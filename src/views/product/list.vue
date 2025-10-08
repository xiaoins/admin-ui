<template>
  <div class="page-container">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="商品名称">
          <el-input
            v-model="queryForm.productName"
            placeholder="请输入商品名称"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="商品编号">
          <el-input
            v-model="queryForm.productNo"
            placeholder="请输入商品编号"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="品牌">
          <el-input
            v-model="queryForm.brand"
            placeholder="请输入品牌"
            clearable
            style="width: 150px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="上架" :value="1" />
            <el-option label="下架" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
          <el-button type="success" :icon="Plus" @click="handleAdd">新增商品</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        style="width: 100%"
      >
        <el-table-column prop="productId" label="商品ID" width="80" />
        <el-table-column prop="productNo" label="商品编号" width="140" />
        <el-table-column label="商品图片" width="100" align="center">
          <template #default="{ row }">
            <el-image
              v-if="row.mainImage"
              :src="row.mainImage"
              :preview-src-list="[row.mainImage]"
              fit="cover"
              class="product-image"
            >
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
            <div v-else class="image-slot">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="商品名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="categoryName" label="分类" width="120" />
        <el-table-column prop="brand" label="品牌" width="100" />
        <el-table-column prop="currentPrice" label="现价" width="100" align="right">
          <template #default="{ row }">
            <span class="price">¥{{ row.currentPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.stock < 10 ? 'danger' : 'success'">
              {{ row.stock }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sales" label="销量" width="80" align="center" />
        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">
              {{ row.statusDesc }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="340" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button
              :type="row.status === 1 ? 'warning' : 'success'"
              size="small"
              @click="handleStatusChange(row)"
            >
              {{ row.status === 1 ? '下架' : '上架' }}
            </el-button>
            <el-button type="info" size="small" @click="handleStock(row)">
              库存
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(row)"
              :disabled="row.status === 1"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="queryForm.pageNum"
          v-model:page-size="queryForm.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleQuery"
          @current-change="handleQuery"
        />
      </div>
    </el-card>

    <!-- 库存调整对话框 -->
    <el-dialog
      v-model="stockDialogVisible"
      title="库存调整"
      width="400px"
    >
      <el-form
        ref="stockFormRef"
        :model="stockForm"
        :rules="stockRules"
        label-width="100px"
      >
        <el-form-item label="商品名称">
          <el-input :value="currentProduct?.productName" disabled />
        </el-form-item>
        <el-form-item label="当前库存">
          <el-input :value="currentProduct?.stock" disabled />
        </el-form-item>
        <el-form-item label="调整数量" prop="quantity">
          <el-input-number
            v-model="stockForm.quantity"
            :min="-9999"
            :max="9999"
            controls-position="right"
            style="width: 100%"
            placeholder="正数增加，负数减少"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="stockForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入调整原因"
            maxlength="200"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="stockDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleStockSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { Search, Refresh, Plus, Edit, Delete, Picture } from '@element-plus/icons-vue'
import {
  getProductPage,
  deleteProduct,
  updateProductStatus,
  adjustStock
} from '@/api/product'
import type { Product, ProductQuery, StockAdjustForm } from '@/types/product'

const router = useRouter()

// 查询表单
const queryForm = reactive<ProductQuery>({
  pageNum: 1,
  pageSize: 10,
  productName: '',
  productNo: '',
  categoryId: undefined,
  brand: '',
  status: undefined
})

// 表格数据
const loading = ref(false)
const tableData = ref<Product[]>([])
const total = ref(0)

// 库存调整对话框
const stockDialogVisible = ref(false)
const currentProduct = ref<Product>()
const stockFormRef = ref<FormInstance>()
const submitLoading = ref(false)

const stockForm = reactive<StockAdjustForm>({
  productId: 0,
  quantity: 0,
  remark: ''
})

const stockRules: FormRules = {
  quantity: [
    { required: true, message: '请输入调整数量', trigger: 'blur' },
    { type: 'number', message: '必须是数字' }
  ]
}

// 查询商品列表
const loadData = async () => {
  loading.value = true
  try {
    const res = await getProductPage(queryForm)
    tableData.value = res.records
    total.value = res.total
  } catch (error) {
    ElMessage.error('加载商品列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleQuery = () => {
  queryForm.pageNum = 1
  loadData()
}

// 重置
const handleReset = () => {
  queryForm.productName = ''
  queryForm.productNo = ''
  queryForm.brand = ''
  queryForm.status = undefined
  handleQuery()
}

// 新增
const handleAdd = () => {
  router.push('/product/add')
}

// 编辑
const handleEdit = (row: Product) => {
  router.push(`/product/edit/${row.productId}`)
}

// 状态切换
const handleStatusChange = async (row: Product) => {
  const newStatus = row.status === 1 ? 0 : 1
  const statusText = newStatus === 1 ? '上架' : '下架'

  try {
    await ElMessageBox.confirm(`确定要${statusText}商品【${row.productName}】吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await updateProductStatus(row.productId, newStatus)
    ElMessage.success(`${statusText}成功`)
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败')
    }
  }
}

// 库存调整
const handleStock = (row: Product) => {
  currentProduct.value = row
  stockForm.productId = row.productId
  stockForm.quantity = 0
  stockForm.remark = ''
  stockDialogVisible.value = true
}

// 提交库存调整
const handleStockSubmit = async () => {
  if (!stockFormRef.value) return

  await stockFormRef.value.validate(async (valid) => {
    if (!valid) return

    submitLoading.value = true
    try {
      await adjustStock(stockForm)
      ElMessage.success('库存调整成功')
      stockDialogVisible.value = false
      loadData()
    } catch (error: any) {
      ElMessage.error(error.message || '调整失败')
    } finally {
      submitLoading.value = false
    }
  })
}

// 删除
const handleDelete = async (row: Product) => {
  try {
    await ElMessageBox.confirm(`确定要删除商品【${row.productName}】吗？`, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteProduct(row.productId)
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

.search-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.price {
  color: #f56c6c;
  font-weight: bold;
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  cursor: pointer;
}

.image-slot {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  border-radius: 4px;
  color: #909399;
  font-size: 24px;
}
</style>
