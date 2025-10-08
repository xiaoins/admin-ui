<template>
  <div style="position: relative">
    <!-- 地图切换按钮 -->
    <div class="map-switch">
      <el-radio-group v-model="mapType" size="small" @change="handleMapTypeChange">
        <el-radio-button value="china">中国地图</el-radio-button>
        <el-radio-button value="world">世界地图</el-radio-button>
      </el-radio-group>
    </div>
    <!-- 地图容器 -->
    <div ref="chartRef" style="width: 100%; height: 600px"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'
import type { RegionDistributionItem } from '@/api/statistics'

const props = defineProps<{
  data: RegionDistributionItem[]
}>()

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null
const mapType = ref<'china' | 'world'>('china') // 默认显示中国地图
let mapsRegistered = false // 标记地图是否已注册

// 从 DataV 获取中国地图 GeoJSON 数据
const loadChinaMap = async () => {
  try {
    const response = await axios.get(
      'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json'
    )
    return response.data
  } catch (error) {
    console.error('加载中国地图数据失败：', error)
    return null
  }
}

// 从本地加载世界地图 GeoJSON 数据
const loadWorldMap = async () => {
  try {
    // 使用本地JSON文件（放在public目录下）
    const response = await axios.get('/maps/world-zh.json')
    return response.data
  } catch (error) {
    console.error('加载世界地图数据失败：', error)
    return null
  }
}

// 地图切换处理
const handleMapTypeChange = () => {
  initChart()
}

const initChart = async () => {
  if (!chartRef.value) return

  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }

  // 显示加载动画
  chartInstance.showLoading({
    text: '地图加载中...',
    color: '#409eff',
    textColor: '#000',
    maskColor: 'rgba(255, 255, 255, 0.8)',
    zlevel: 0,
  })

  // 只在第一次加载时注册地图
  if (!mapsRegistered) {
    try {
      // 并行加载两个地图数据
      const [chinaData, worldData] = await Promise.all([
        loadChinaMap(),
        loadWorldMap()
      ])

      // 注册中国地图
      if (chinaData) {
        echarts.registerMap('china', chinaData)
      }

      // 注册世界地图
      if (worldData) {
        echarts.registerMap('world', worldData)
      }

      mapsRegistered = true
    } catch (error) {
      console.error('地图注册失败：', error)
      chartInstance.hideLoading()
      return
    }
  }

  // 关闭加载动画
  chartInstance.hideLoading()

  // 根据选择确定地图名称和标题
  let mapName = ''
  let titleText = ''
  let subtitleText = ''

  if (mapType.value === 'china') {
    mapName = 'china'
    titleText = '用户地区分布'
    subtitleText = '按省份统计'
  } else {
    mapName = 'world'
    titleText = '全球用户分布'
    subtitleText = '按国家统计'
  }

  // 转换数据格式为 ECharts 地图所需格式
  let seriesData: Array<{ name: string; value: number }> = []
  let maxValue = 1

  if (mapType.value === 'world') {
    // 世界地图：汇总所有中国省份数据为"中国"
    const chinaTotal = props.data.reduce((sum, item) => sum + item.value, 0)
    seriesData = [
      {
        name: '中国',
        value: chinaTotal,
      },
    ]
    maxValue = Math.max(chinaTotal, 1)
  } else {
    // 中国地图：显示各省份数据
    seriesData = props.data.map((item) => ({
      name: item.name,
      value: item.value,
    }))
    maxValue = Math.max(...seriesData.map((item) => item.value), 1)
  }

  const option: echarts.EChartsOption = {
    title: {
      text: titleText,
      subtext: subtitleText,
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      subtextStyle: {
        fontSize: 12,
        color: '#999',
      },
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        if (params.value) {
          return `${params.name}<br/>用户数量: ${params.value} 人`
        } else {
          return `${params.name}<br/>暂无数据`
        }
      },
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: '#409eff',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
      },
    },
    visualMap: {
      min: 0,
      max: maxValue,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'],
      calculable: true,
      inRange: {
        color: ['#ffebee', '#ffcdd2', '#ef9a9a', '#e57373', '#ef5350', '#f44336', '#d32f2f', '#c62828'],
      },
      textStyle: {
        color: '#000',
      },
    },
    series: [
      {
        name: '用户数量',
        type: 'map',
        map: mapName,
        roam: true, // 开启鼠标缩放和平移
        label: {
          show: true,
          fontSize: mapType.value === 'world' ? 10 : 11, // 世界地图字体稍小
          color: '#000',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 12,
            color: '#fff',
            fontWeight: 'bold',
          },
          itemStyle: {
            areaColor: '#4caf50',
            borderColor: '#fff',
            borderWidth: 2,
          },
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1,
          areaColor: '#eee',
        },
        data: seriesData,
      },
    ],
  }

  chartInstance.setOption(option, true) // true 表示不合并，完全替换
}

// 监听数据变化
watch(
  () => props.data,
  () => {
    initChart()
  },
  { deep: true }
)

let resizeHandler: (() => void) | null = null

onMounted(() => {
  initChart()
  // 监听窗口大小变化
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
/* 地图切换按钮样式 */
.map-switch {
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 4px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 鼠标悬停效果 */
.map-switch:hover {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>


