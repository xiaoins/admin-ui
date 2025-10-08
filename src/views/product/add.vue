<template>
  <div class="page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>新增商品</span>
          <el-button @click="router.back()">返回</el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        size="large"
      >
        <el-form-item label="商品名称" prop="productName">
          <el-input
            v-model="form.productName"
            placeholder="请输入商品名称"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="商品分类" prop="categoryId">
          <el-select
            v-model="form.categoryId"
            placeholder="请选择商品分类"
            style="width: 100%"
          >
            <el-option
              v-for="category in categories"
              :key="category.categoryId"
              :label="category.categoryName"
              :value="category.categoryId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="商品品牌" prop="brand">
          <el-input v-model="form.brand" placeholder="请输入商品品牌" />
        </el-form-item>

        <el-form-item label="商品主图" prop="mainImage">
          <ImageUpload
            v-model="form.mainImage"
            type="product"
            :limit="1"
            :multiple="false"
            tip="建议尺寸：800x800像素"
          />
        </el-form-item>

        <el-form-item label="商品相册" prop="images">
          <ImageUpload
            v-model="form.images"
            type="product"
            :limit="5"
            :multiple="true"
            tip="最多上传5张图片，建议尺寸：800x800像素"
          />
        </el-form-item>

        <el-form-item label="原价" prop="originalPrice">
          <el-input-number
            v-model="form.originalPrice"
            :min="0"
            :precision="2"
            :step="0.01"
            placeholder="请输入原价"
          />
        </el-form-item>

        <el-form-item label="现价" prop="currentPrice">
          <el-input-number
            v-model="form.currentPrice"
            :min="0"
            :precision="2"
            :step="0.01"
            placeholder="请输入现价"
          />
        </el-form-item>

        <el-form-item label="库存" prop="stock">
          <el-input-number
            v-model="form.stock"
            :min="0"
            :step="1"
            placeholder="请输入库存"
          />
        </el-form-item>

        <el-form-item label="商品描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入商品描述"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="submitForm">
            提交
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { createProduct } from '@/api/product'
import { getCategoryList } from '@/api/category'
import ImageUpload from '@/components/ImageUpload.vue'

const router = useRouter()
const formRef = ref<FormInstance>()
const loading = ref(false)
const categories = ref<any[]>([])

// 表单数据
const form = reactive({
  productName: '',
  categoryId: null as number | null,
  brand: '',
  mainImage: '',
  images: [] as string[],
  originalPrice: 0,
  currentPrice: 0,
  stock: 0,
  description: ''
})

// 表单验证规则
const rules = reactive<FormRules>({
  productName: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
  brand: [{ required: true, message: '请输入商品品牌', trigger: 'blur' }],
  mainImage: [{ required: true, message: '请上传商品主图', trigger: 'change' }],
  currentPrice: [
    { required: true, message: '请输入现价', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value <= 0) {
          callback(new Error('现价必须大于0'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  stock: [
    { required: true, message: '请输入库存', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value < 0) {
          callback(new Error('库存不能小于0'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

// 加载商品分类
const loadCategories = async () => {
  try {
    const data = await getCategoryList()
    // 拦截器已经处理了成功情况，这里直接使用返回的数据
    // 只显示二级分类
    categories.value = data.filter((item: any) => item.level === 2)
  } catch (error) {
    console.error('加载商品分类失败', error)
    ElMessage.error('加载商品分类失败')
  }
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      // 将图片数组转换为JSON字符串
      const imagesStr = form.images.length > 0 ? JSON.stringify(form.images) : null

      const data = {
        ...form,
        images: imagesStr
      }

      await createProduct(data)
      // 拦截器已经处理了成功情况
      ElMessage.success('商品新增成功')
      router.push('/product/list')
    } catch (error: any) {
      ElMessage.error('商品新增失败')
    } finally {
      loading.value = false
    }
  })
}

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}
</style>
