<template>
  <div class="page-container">
    <el-card class="header-card">
      <div class="header">
        <h2>订单详情</h2>
        <el-button @click="handleBack">返回列表</el-button>
      </div>
    </el-card>

    <div v-loading="loading">
      <el-card class="section-card">
        <template #header>
          <span class="card-header-title">订单信息</span>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="订单号">{{ orderDetail?.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getStatusType(orderDetail?.status)">
              {{ orderDetail?.statusDesc }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ orderDetail?.createTime }}</el-descriptions-item>
          <el-descriptions-item label="付款时间">{{ orderDetail?.payTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="发货时间">{{ orderDetail?.sendTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="完成时间">{{ orderDetail?.finishTime || '-' }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card class="section-card">
        <template #header>
          <span class="card-header-title">收货信息</span>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="收货人">{{ orderDetail?.receiverName }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ orderDetail?.receiverPhone }}</el-descriptions-item>
          <el-descriptions-item label="收货地址" :span="2">
            {{ orderDetail?.receiverAddress }}
          </el-descriptions-item>
          <el-descriptions-item label="物流公司">{{ orderDetail?.logisticsCompany || '-' }}</el-descriptions-item>
          <el-descriptions-item label="物流单号">{{ orderDetail?.logisticsNo || '-' }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card class="section-card">
        <template #header>
          <span class="card-header-title">费用信息</span>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="商品总额">
            <span class="price">¥{{ orderDetail?.totalAmount }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="运费">
            <span class="price">¥{{ orderDetail?.freight }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="优惠金额">
            <span class="price">-¥{{ orderDetail?.couponAmount }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="实付金额">
            <span class="price price-large">¥{{ orderDetail?.payAmount }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="支付方式" :span="2">
            {{ orderDetail?.payType === 1 ? '微信支付' : orderDetail?.payType === 2 ? '支付宝' : '其他' }}
          </el-descriptions-item>
          <el-descriptions-item v-if="orderDetail?.remark" label="备注" :span="2">
            {{ orderDetail?.remark }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <el-card v-if="orderDetail" class="section-card">
        <template #header>
          <span class="card-header-title">操作</span>
        </template>
        <div class="action-buttons">
          <el-button
            v-if="orderDetail.status === 1"
            type="success"
            @click="handleShip"
          >
            发货
          </el-button>
          <el-button
            v-if="orderDetail.status === 2"
            type="warning"
            @click="handleFinish"
          >
            完成订单
          </el-button>
          <el-button
            v-if="orderDetail.status <= 1"
            type="danger"
            @click="handleCancel"
          >
            取消订单
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getOrderDetail,
  shipOrder,
  finishOrder,
  cancelOrder
} from '@/api/order'
import type { Order } from '@/types/order'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const orderDetail = ref<Order>()

const orderId = Number(route.params.id)

// 获取状态标签类型
const getStatusType = (status: number | undefined) => {
  if (status === undefined) return 'info'
  const types: any = {
    0: 'info',
    1: 'warning',
    2: 'primary',
    3: 'success',
    4: 'danger'
  }
  return types[status] || 'info'
}

// 加载订单详情
const loadData = async () => {
  loading.value = true
  try {
    orderDetail.value = await getOrderDetail(orderId)
  } catch (error) {
    ElMessage.error('加载订单详情失败')
  } finally {
    loading.value = false
  }
}

// 返回列表
const handleBack = () => {
  router.push('/order/list')
}

// 发货
const handleShip = async () => {
  try {
    await ElMessageBox.confirm('确定要发货此订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await shipOrder(orderId)
    ElMessage.success('发货成功')
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败')
    }
  }
}

// 完成订单
const handleFinish = async () => {
  try {
    await ElMessageBox.confirm('确定要完成此订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await finishOrder(orderId)
    ElMessage.success('订单完成')
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败')
    }
  }
}

// 取消订单
const handleCancel = async () => {
  try {
    await ElMessageBox.confirm('确定要取消此订单吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await cancelOrder(orderId)
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

.header-card {
  margin-bottom: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.section-card {
  margin-bottom: 20px;
}

.card-header-title {
  font-weight: bold;
  font-size: 16px;
}

.price {
  color: #f56c6c;
  font-weight: bold;
}

.price-large {
  font-size: 18px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}
</style>
