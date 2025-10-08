/**
 * API 接口类型定义
 */

// 统一响应格式
export interface ApiResponse<T = any> {
  code: number | string
  message: string
  data: T
  traceId?: string
}

// 分页请求参数
export interface PageParams {
  pageNum?: number
  pageSize?: number
}

// 分页响应数据
export interface PageResult<T = any> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

// 登录请求
export interface LoginRequest {
  username: string
  password: string
  captcha?: string
  captchaKey?: string
}

// 登录响应
export interface LoginResponse {
  token: string
  tokenType: string
  expiresIn: number
  userInfo?: {
    userId: number
    username: string
    realName: string
    avatarUrl?: string
    roleId: number
  }
}

// 状态枚举
export enum Status {
  DISABLED = 0,
  ENABLED = 1,
}

// 商品状态
export enum ProductStatus {
  OFF_SHELF = 0,
  ON_SHELF = 1,
  DRAFT = 2,
}

// 订单状态
export enum OrderStatus {
  PENDING_PAYMENT = 0,
  PAID = 1,
  SHIPPED = 2,
  COMPLETED = 3,
  CANCELLED = 4,
}
