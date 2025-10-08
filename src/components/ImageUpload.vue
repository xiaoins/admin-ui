<template>
  <div class="image-upload">
    <el-upload
      :action="uploadUrl"
      :headers="headers"
      :data="uploadData"
      :file-list="fileList"
      :list-type="listType"
      :limit="limit"
      :multiple="multiple"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      accept="image/*"
    >
      <el-button v-if="listType === 'text'" type="primary">选择图片</el-button>
      <template v-else>
        <el-icon><Plus /></el-icon>
      </template>
      <template #tip>
        <div class="el-upload__tip">
          {{ tip || `只能上传jpg/png/gif/webp文件，超过${maxSize}MB会自动压缩` }}
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { getToken } from '@/utils/auth'

interface Props {
  modelValue?: string | string[]  // v-model绑定的值（URL或URL数组）
  type?: string  // 上传类型（avatar/product）
  limit?: number  // 最大上传数量
  multiple?: boolean  // 是否支持多选
  listType?: 'text' | 'picture' | 'picture-card'  // 列表类型
  maxSize?: number  // 最大文件大小（MB）
  tip?: string  // 提示文字
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'other',
  limit: 1,
  multiple: false,
  listType: 'picture-card',
  maxSize: 2,
  tip: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[]): void
}>()

// 上传地址（与 request.ts 保持一致）
const uploadUrl = computed(() => {
  return '/api/admin/v1/upload/single'
})

// 请求头
const headers = computed(() => {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
})

// 上传参数
const uploadData = computed(() => {
  return { type: props.type }
})

// 文件列表
const fileList = ref<UploadUserFile[]>([])

// 初始化文件列表
watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) {
      fileList.value = []
      return
    }

    if (Array.isArray(newValue)) {
      fileList.value = newValue.map((url, index) => ({
        name: `image-${index + 1}`,
        url: url,
        uid: Date.now() + index
      }))
    } else if (typeof newValue === 'string' && newValue) {
      fileList.value = [
        {
          name: 'image',
          url: newValue,
          uid: Date.now()
        }
      ]
    }
  },
  { immediate: true }
)

/**
 * 压缩图片
 * @param file 原始图片文件
 * @param maxSizeMB 目标大小（MB）
 * @returns 压缩后的文件
 */
const compressImage = (file: File, maxSizeMB: number): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target?.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        // 计算压缩比例
        let width = img.width
        let height = img.height
        const maxWidth = 1920  // 最大宽度
        const maxHeight = 1080  // 最大高度

        // 如果图片尺寸过大，先缩小尺寸
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = width * ratio
          height = height * ratio
        }

        canvas.width = width
        canvas.height = height

        // 绘制图片
        ctx.drawImage(img, 0, 0, width, height)

        // 逐步降低质量直到满足大小要求
        let quality = 0.9
        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('图片压缩失败'))
                return
              }

              const compressedSizeMB = blob.size / 1024 / 1024

              // 如果已经满足要求，或质量已经很低了，就返回
              if (compressedSizeMB <= maxSizeMB || quality <= 0.1) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now()
                })

                // 记录压缩结果到控制台（不弹出消息，避免干扰用户）
                const originalSizeMB = (file.size / 1024 / 1024).toFixed(2)
                const finalSizeMB = compressedSizeMB.toFixed(2)
                if (compressedSizeMB < file.size / 1024 / 1024) {
                  console.log(`✅ 图片已自动压缩：${originalSizeMB}MB → ${finalSizeMB}MB`)
                }

                resolve(compressedFile)
              } else {
                // 继续降低质量
                quality -= 0.1
                tryCompress()
              }
            },
            file.type,
            quality
          )
        }

        tryCompress()
      }
      img.onerror = () => {
        reject(new Error('图片加载失败'))
      }
    }
    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
  })
}

// 上传前验证和压缩
const beforeUpload: UploadProps['beforeUpload'] = async (rawFile) => {
  const isImage = rawFile.type.startsWith('image/')

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }

  // 检查文件大小
  const fileSizeMB = rawFile.size / 1024 / 1024

  // 如果文件超过限制，自动压缩
  if (fileSizeMB > props.maxSize) {
    try {
      ElMessage.info('图片较大，正在自动压缩...')
      const compressedFile = await compressImage(rawFile, props.maxSize)
      return compressedFile
    } catch (error) {
      console.error('图片压缩失败:', error)
      ElMessage.error('图片压缩失败，请尝试更小的图片')
      return false
    }
  }

  return true
}

// 上传成功
const handleSuccess: UploadProps['onSuccess'] = (response) => {
  // 后端成功返回的 code 是字符串 "0"
  if (response.code === '0' || response.code === 0 || response.code === 200) {
    const url = response.data.url

    if (props.multiple) {
      const urls = Array.isArray(props.modelValue) ? [...props.modelValue] : []
      urls.push(url)
      emit('update:modelValue', urls)
    } else {
      emit('update:modelValue', url)
    }

    ElMessage.success('上传成功')
  } else {
    ElMessage.error(response.message || '上传失败')
  }
}

// 上传失败
const handleError: UploadProps['onError'] = () => {
  ElMessage.error('上传失败')
}

// 删除文件
const handleRemove: UploadProps['onRemove'] = (file) => {
  if (props.multiple) {
    const urls = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const index = fileList.value.findIndex((item) => item.url === file.url)
    if (index > -1) {
      urls.splice(index, 1)
      emit('update:modelValue', urls)
    }
  } else {
    emit('update:modelValue', '')
  }
}

// 超出限制
const handleExceed: UploadProps['onExceed'] = () => {
  ElMessage.warning(`最多只能上传 ${props.limit} 张图片`)
}
</script>

<style scoped>
.image-upload {
  width: 100%;
}

.el-upload__tip {
  color: #999;
  font-size: 12px;
  margin-top: 8px;
}
</style>

