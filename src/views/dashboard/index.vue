<template>
  <div class="dashboard-container">
    <!-- 数据卡片 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="item in statisticsData" :key="item.title">
        <el-card class="stat-card" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon" :style="{ backgroundColor: item.color }">
              <el-icon :size="32">
                <component :is="item.icon" />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-title">{{ item.title }}</div>
              <div class="stat-value">{{ item.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <!-- 销售趋势 -->
      <el-col :span="12">
        <el-card>
          <SalesTrendChart :data="salesTrendData" />
        </el-card>
      </el-col>

      <!-- 订单状态分布 -->
      <el-col :span="12">
        <el-card>
          <OrderStatusChart :data="orderStatusData" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 用户地区分布地图 - 单独一行占满 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <RegionChart :data="regionData" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 热销商品排行 - 单独一行 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <HotProductsChart :data="hotProductsData" @category-change="handleCategoryChange" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getDashboard,
  getCustomerRegionDistribution,
  getSalesTrend,
  getHotProducts,
  getOrderStatusDistribution,
} from '@/api/statistics'
import type {
  RegionDistributionItem,
  SalesTrendItem,
  HotProductItem,
  OrderStatusDistributionItem,
} from '@/api/statistics'
import { ElMessage } from 'element-plus'
import RegionChart from '@/components/charts/RegionChart.vue'
import SalesTrendChart from '@/components/charts/SalesTrendChart.vue'
import OrderStatusChart from '@/components/charts/OrderStatusChart.vue'
import HotProductsChart from '@/components/charts/HotProductsChart.vue'

// 统计数据
const statisticsData = ref([
  {
    title: '今日订单',
    value: '0',
    icon: 'ShoppingCart',
    color: '#409eff',
  },
  {
    title: '今日销售额',
    value: '¥0.00',
    icon: 'Money',
    color: '#67c23a',
  },
  {
    title: '总用户数',
    value: '0',
    icon: 'User',
    color: '#e6a23c',
  },
  {
    title: '总商品数',
    value: '0',
    icon: 'Goods',
    color: '#f56c6c',
  },
])

// 图表数据
const regionData = ref<RegionDistributionItem[]>([])
const salesTrendData = ref<SalesTrendItem[]>([])
const hotProductsData = ref<HotProductItem[]>([])
const orderStatusData = ref<OrderStatusDistributionItem[]>([])

// 加载仪表盘数据
const loadDashboardData = async () => {
  try {
    const data = await getDashboard()
    statisticsData.value = [
      {
        title: '今日订单',
        value: data.todayOrders.toString(),
        icon: 'ShoppingCart',
        color: '#409eff',
      },
      {
        title: '今日销售额',
        value: `¥${data.todaySales.toFixed(2)}`,
        icon: 'Money',
        color: '#67c23a',
      },
      {
        title: '总用户数',
        value: data.totalUsers.toString(),
        icon: 'User',
        color: '#e6a23c',
      },
      {
        title: '总商品数',
        value: data.totalProducts.toString(),
        icon: 'Goods',
        color: '#f56c6c',
      },
    ]
  } catch (error) {
    console.error('加载仪表盘数据失败：', error)
  }
}

// 加载图表数据
const loadChartsData = async () => {
  try {
    // 并行加载所有图表数据
    const [regionRes, salesRes, productsRes, statusRes] = await Promise.all([
      getCustomerRegionDistribution(),
      getSalesTrend(7),
      getHotProducts(undefined, 10), // undefined 表示查询所有分类
      getOrderStatusDistribution(),
    ])

    regionData.value = regionRes
    salesTrendData.value = salesRes
    hotProductsData.value = productsRes
    orderStatusData.value = statusRes
  } catch (error) {
    console.error('加载图表数据失败：', error)
    ElMessage.error('加载图表数据失败')
  }
}

// 处理热销商品分类切换
const handleCategoryChange = async (categoryId: number) => {
  console.log('分类切换 - categoryId:', categoryId)
  try {
    // categoryId 为 0 表示全部分类，传 undefined
    const id = categoryId === 0 ? undefined : categoryId
    console.log('请求热销商品 - id:', id, 'limit:', 10)
    hotProductsData.value = await getHotProducts(id, 10)
    console.log('热销商品数据已更新:', hotProductsData.value)
  } catch (error) {
    console.error('加载热销商品数据失败：', error)
    ElMessage.error('加载热销商品数据失败')
  }
}

onMounted(() => {
  loadDashboardData()
  loadChartsData()
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  background: #f0f2f5;
  min-height: calc(100vh - 100px);
}

.stat-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px;
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.stat-info {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
  font-weight: 500;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

/* 图表卡片样式 */
.el-card {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.el-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

/* 行间距优化 */
.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 10px;
  }

  .stat-value {
    font-size: 20px;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
  }
}
</style>
