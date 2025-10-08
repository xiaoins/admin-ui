/**
 * 数据统计API
 */
import { get } from '@/utils/request'
import type { DashboardData } from '@/types/order'

// ========== 类型定义 ==========

/** 地区分布数据项 */
export interface RegionDistributionItem {
  name: string
  value: number
}

/** 销售趋势数据项 */
export interface SalesTrendItem {
  date: string
  orderCount: number
  salesAmount: number
}

/** 热销商品数据项 */
export interface HotProductItem {
  productId: number
  productName: string
  sales: number
}

/** 订单状态分布数据项 */
export interface OrderStatusDistributionItem {
  name: string
  value: number
}

// ========== API方法 ==========

/**
 * 获取仪表盘概览数据
 */
export function getDashboard() {
  return get<DashboardData>('/statistics/dashboard')
}

/**
 * 获取用户地区分布统计
 */
export function getCustomerRegionDistribution() {
  return get<RegionDistributionItem[]>('/statistics/customer-region')
}

/**
 * 获取销售趋势数据
 * @param days 统计天数，默认7天
 */
export function getSalesTrend(days: number = 7) {
  return get<SalesTrendItem[]>('/statistics/sales-trend', { days })
}

/**
 * 获取热销商品排行
 * @param categoryId 分类ID（可选，不传则查询所有分类）
 * @param limit 显示数量，默认10
 */
export function getHotProducts(categoryId?: number, limit: number = 10) {
  const params: any = { limit }
  if (categoryId !== undefined && categoryId !== null) {
    params.categoryId = categoryId
  }
  console.log('API getHotProducts 调用 - params:', params)
  return get<HotProductItem[]>('/statistics/hot-products', params)
}

/**
 * 获取订单状态分布统计
 */
export function getOrderStatusDistribution() {
  return get<OrderStatusDistributionItem[]>('/statistics/order-status')
}
