/**
 * 订单相关类型定义
 */

// 订单信息
export interface Order {
  orderId: number
  orderNo: string
  userId: number
  username: string
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  totalAmount: number
  freight: number
  payAmount: number
  payType: number
  couponAmount: number
  status: number
  statusDesc: string
  remark?: string
  createTime: string
  payTime?: string
  sendTime?: string
  finishTime?: string
}

// 订单查询参数
export interface OrderQuery {
  pageNum?: number
  pageSize?: number
  orderNo?: string
  userId?: number
  status?: number
  startTime?: string
  endTime?: string
}

// 仪表盘数据
export interface DashboardData {
  todayOrders: number
  todaySales: number
  totalUsers: number
  totalProducts: number
  pendingOrders: number
  paidOrders: number
  shippedOrders: number
  lowStockProducts: number
}
