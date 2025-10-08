<template>
  <div>
    <!-- 分类切换 Tab -->
    <div class="category-tabs">
      <el-tabs v-model="activeCategory" @tab-change="handleCategoryChange">
        <el-tab-pane label="全部分类" :name="0" />
        <el-tab-pane label="数码电器" :name="1" />
        <el-tab-pane label="服装鞋包" :name="2" />
        <el-tab-pane label="食品饮料" :name="3" />
        <el-tab-pane label="家居家纺" :name="4" />
        <el-tab-pane label="美妆护肤" :name="5" />
      </el-tabs>
    </div>

    <!-- 图表容器 -->
    <div ref="chartRef" style="width: 100%; height: 400px"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { HotProductItem } from '@/api/statistics'

const props = defineProps<{
  data: HotProductItem[]
}>()

const emit = defineEmits<{
  categoryChange: [categoryId: number]
}>()

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null
const activeCategory = ref(0) // 默认显示全部分类

// 分类名称映射
const categoryNames: Record<number, string> = {
  0: '全部分类',
  1: '数码电器',
  2: '服装鞋包',
  3: '食品饮料',
  4: '家居家纺',
  5: '美妆护肤',
}

// 分类切换处理
const handleCategoryChange = (categoryId: number | string) => {
  const id = typeof categoryId === 'string' ? parseInt(categoryId) : categoryId
  emit('categoryChange', id)
}

const initChart = () => {
  if (!chartRef.value) return

  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }

  const categoryName = categoryNames[activeCategory.value] || '全部分类'

  const option: echarts.EChartsOption = {
    title: {
      text: `热销商品排行 - ${categoryName}`,
      left: 'center',
      textStyle: {
        fontSize: 16,
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      name: '销量',
    },
    yAxis: {
      type: 'category',
      data: props.data.map((item) => item.productName).reverse(),
      axisLabel: {
        interval: 0,
        formatter: (value: string) => {
          return value.length > 10 ? value.substring(0, 10) + '...' : value
        },
      },
    },
    series: [
      {
        name: '销量',
        type: 'bar',
        data: props.data.map((item) => item.sales).reverse(),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#fac858' },
            { offset: 1, color: '#ee6666' },
          ]),
        },
        label: {
          show: true,
          position: 'right',
        },
      },
    ],
  }

  chartInstance.setOption(option, true) // true 表示不合并，完全替换
}

watch(
  () => props.data,
  () => {
    initChart()
  },
  { deep: true }
)

watch(
  () => activeCategory.value,
  () => {
    initChart()
  }
)

let resizeHandler: (() => void) | null = null

onMounted(() => {
  initChart()
  resizeHandler = () => {
    chartInstance?.resize()
  }
  window.addEventListener('resize', resizeHandler)
})

onUnmounted(() => {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
  chartInstance?.dispose()
})
</script>

<style scoped>
.category-tabs {
  margin-bottom: 10px;
}

/* 自定义Tab样式 */
.category-tabs :deep(.el-tabs__nav-wrap::after) {
  height: 1px;
}

.category-tabs :deep(.el-tabs__item) {
  font-size: 14px;
  padding: 0 16px;
}

.category-tabs :deep(.el-tabs__item:hover) {
  color: #409eff;
}

.category-tabs :deep(.el-tabs__item.is-active) {
  color: #409eff;
  font-weight: bold;
}
</style>

