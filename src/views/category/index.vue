<template>
  <div class="page-container">
    <!-- 工具栏 -->
    <el-card class="toolbar-card">
      <el-button type="primary" :icon="Plus" @click="handleAdd">新增分类</el-button>
      <el-button :icon="Refresh" @click="loadData">刷新</el-button>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="tableData"
        row-key="categoryId"
        border
        stripe
        style="width: 100%"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="categoryName" label="分类名称" min-width="200" />
        <el-table-column prop="sortOrder" label="排序" width="100" align="center" />
        <el-table-column prop="level" label="层级" width="80" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.level === 1" type="primary">一级</el-tag>
            <el-tag v-else type="success">二级</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="productCount" label="商品数量" width="120" align="center">
          <template #default="{ row }">
            <el-tag>{{ row.productCount }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.statusDesc }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="360" fixed="right" align="center">
          <template #default="{ row }">
            <el-button
              v-if="row.level === 1"
              type="success"
              size="small"
              @click="handleAddChild(row)"
            >
              添加子分类
            </el-button>
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button
              :type="row.status === 1 ? 'warning' : 'success'"
              size="small"
              @click="handleStatusChange(row)"
            >
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item v-if="formData.parentId > 0" label="上级分类">
          <el-input :value="parentCategoryName" disabled />
        </el-form-item>
        <el-form-item label="分类名称" prop="categoryName">
          <el-input
            v-model="formData.categoryName"
            placeholder="请输入分类名称"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number
            v-model="formData.sortOrder"
            :min="0"
            :max="9999"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Plus, Refresh, Edit, Delete } from '@element-plus/icons-vue'
import {
  getCategoryTree,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryStatus
} from '@/api/category'
import type { Category, CategoryForm } from '@/types/product'

// 表格数据
const loading = ref(false)
const tableData = ref<Category[]>([])

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('新增分类')
const formRef = ref<FormInstance>()
const submitLoading = ref(false)
const parentCategoryName = ref('')

// 表单数据
const formData = reactive<CategoryForm>({
  categoryId: undefined,
  categoryName: '',
  parentId: 0,
  sortOrder: 0,
  status: 1
})

// 表单验证规则
const formRules: FormRules = {
  categoryName: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  sortOrder: [
    { required: true, message: '请输入排序', trigger: 'blur' }
  ]
}

// 查询分类树
const loadData = async () => {
  loading.value = true
  try {
    const res = await getCategoryTree({})
    tableData.value = res
  } catch (error) {
    ElMessage.error('加载分类列表失败')
  } finally {
    loading.value = false
  }
}

// 新增一级分类
const handleAdd = () => {
  dialogTitle.value = '新增一级分类'
  formData.parentId = 0
  parentCategoryName.value = ''
  dialogVisible.value = true
}

// 新增子分类
const handleAddChild = (row: Category) => {
  dialogTitle.value = '新增子分类'
  formData.parentId = row.categoryId
  parentCategoryName.value = row.categoryName
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row: Category) => {
  dialogTitle.value = '编辑分类'
  formData.categoryId = row.categoryId
  formData.categoryName = row.categoryName
  formData.parentId = row.parentId
  formData.sortOrder = row.sortOrder
  formData.status = row.status
  dialogVisible.value = true
}

// 对话框关闭
const handleDialogClose = () => {
  formRef.value?.resetFields()
  formData.categoryId = undefined
  formData.categoryName = ''
  formData.parentId = 0
  formData.sortOrder = 0
  formData.status = 1
  parentCategoryName.value = ''
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      if (formData.categoryId) {
        await updateCategory(formData)
        ElMessage.success('更新成功')
      } else {
        await createCategory(formData)
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      loadData()
    } catch (error: any) {
      ElMessage.error(error.message || '操作失败')
    } finally {
      submitLoading.value = false
    }
  })
}

// 状态切换
const handleStatusChange = async (row: Category) => {
  const newStatus = row.status === 1 ? 0 : 1
  const statusText = newStatus === 1 ? '启用' : '禁用'

  try {
    await ElMessageBox.confirm(`确定要${statusText}分类【${row.categoryName}】吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await updateCategoryStatus(row.categoryId, newStatus)
    ElMessage.success(`${statusText}成功`)
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败')
    }
  }
}

// 删除
const handleDelete = async (row: Category) => {
  try {
    await ElMessageBox.confirm(`确定要删除分类【${row.categoryName}】吗？`, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteCategory(row.categoryId)
    ElMessage.success('删除成功')
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 初始化
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.toolbar-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}
</style>
