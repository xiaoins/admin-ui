/**
 * 订单管理API
 */
import { get, put } from '@/utils/request'
import type { PageResult } from '@/types/api'
import type { Order, OrderQuery } from '@/types/order'

/**
 * 分页查询订单列表
 */
export function getOrderPage(params: OrderQuery) {
  return get<PageResult<Order>>('/orders/page', params)
}

/**
 * 查询订单详情
 */
export function getOrderDetail(orderId: number) {
  return get<Order>(`/orders/${orderId}`)
}

/**
 * 订单发货
 */
export function shipOrder(orderId: number) {
  return put(`/orders/${orderId}/ship`)
}

/**
 * 完成订单
 */
export function finishOrder(orderId: number) {
  return put(`/orders/${orderId}/finish`)
}

/**
 * 取消订单
 */
export function cancelOrder(orderId: number) {
  return put(`/orders/${orderId}/cancel`)
}
