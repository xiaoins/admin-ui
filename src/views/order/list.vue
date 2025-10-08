<template>
  <div class="page-container">
    <!-- 搜索栏 -->
    <el-card class="search-card">
      <el-form :model="queryForm" inline>
        <el-form-item label="订单号">
          <el-input
            v-model="queryForm.orderNo"
            placeholder="请输入订单号"
            clearable
            style="width: 200px"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="queryForm.status" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="待付款" :value="0" />
            <el-option label="已付款" :value="1" />
            <el-option label="已发货" :value="2" />
            <el-option label="已完成" :value="3" />
            <el-option label="已取消" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery">搜索</el-button>
          <el-button :icon="Refresh" @click="handleReset">重置</el-button>
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
        <el-table-column prop="orderId" label="订单ID" width="80" />
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="username" label="用户" width="120" />
        <el-table-column prop="receiverName" label="收货人" width="100" />
        <el-table-column prop="receiverPhone" label="收货电话" width="130" />
        <el-table-column prop="payAmount" label="实付金额" width="100" align="right">
          <template #default="{ row }">
            <span class="price">¥{{ row.payAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.statusDesc }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleDetail(row)">
              详情
            </el-button>
            <el-button
              v-if="row.status === 1"
              type="success"
              size="small"
              @click="handleShip(row)"
            >
              发货
            </el-button>
            <el-button
              v-if="row.status === 2"
              type="warning"
              size="small"
              @click="handleFinish(row)"
            >
              完成
            </el-button>
            <el-button
              v-if="row.status <= 1"
              type="danger"
              size="small"
              @click="handleCancel(row)"
            >
              取消
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'
import {
  getOrderPage,
  shipOrder,
  finishOrder,
  cancelOrder
} from '@/api/order'
import type { Order, OrderQuery } from '@/types/order'

const router = useRouter()

// 查询表单
const queryForm = reactive<OrderQuery>({
  pageNum: 1,
  pageSize: 10,
  orderNo: '',
  userId: undefined,
  status: undefined,
  startTime: '',
  endTime: ''
})

const dateRange = ref<string[]>([])

// 表格数据
const loading = ref(false)
const tableData = ref<Order[]>([])
const total = ref(0)

// 获取状态标签类型
const getStatusType = (status: number) => {
  const types: any = {
    0: 'info',
    1: 'warning',
    2: 'primary',
    3: 'success',
    4: 'danger'
  }
  return types[status] || 'info'
}

// 查询订单列表
const loadData = async () => {
  loading.value = true

  // 处理日期范围
  if (dateRange.value && dateRange.value.length === 2) {
    queryForm.startTime = dateRange.value[0] + ' 00:00:00'
    queryForm.endTime = dateRange.value[1] + ' 23:59:59'
  } else {
    queryForm.startTime = ''
    queryForm.endTime = ''
  }

  try {
    const res = await getOrderPage(queryForm)
    tableData.value = res.records
    total.value = res.total
  } catch (error) {
    ElMessage.error('加载订单列表失败')
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
  queryForm.orderNo = ''
  queryForm.status = undefined
  dateRange.value = []
  handleQuery()
}

// 查看详情
const handleDetail = (row: Order) => {
  router.push(`/order/detail/${row.orderId}`)
}

// 发货
const handleShip = async (row: Order) => {
  try {
    await ElMessageBox.confirm(`确定要发货订单【${row.orderNo}】吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await shipOrder(row.orderId)
    ElMessage.success('发货成功')
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败')
    }
  }
}

// 完成订单
const handleFinish = async (row: Order) => {
  try {
    await ElMessageBox.confirm(`确定要完成订单【${row.orderNo}】吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await finishOrder(row.orderId)
    ElMessage.success('订单完成')
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败')
    }
  }
}

// 取消订单
const handleCancel = async (row: Order) => {
  try {
    await ElMessageBox.confirm(`确定要取消订单【${row.orderNo}】吗？`, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await cancelOrder(row.orderId)
    ElMessage.success('订单已取消')
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败')
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
</style>
