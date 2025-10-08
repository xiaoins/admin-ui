/**
 * 消费者用户类型定义
 */

/**
 * 消费者用户VO
 */
export interface CustomerVO {
  customerId: number
  username: string
  realName?: string
  gender?: number
  genderText?: string
  birthDate?: string
  phone?: string
  email?: string
  country?: string
  avatarUrl?: string
  province?: string
  city?: string
  district?: string
  address?: string
  fullAddress?: string
  status: number
  statusText?: string
  createTime: string
  updateTime: string
}

/**
 * 消费者用户查询参数
 */
export interface CustomerQuery {
  username?: string
  realName?: string
  phone?: string
  province?: string
  city?: string
  status?: number
  gender?: number
  pageNum: number
  pageSize: number
}

/**
 * 消费者用户表单
 */
export interface CustomerForm {
  customerId?: number
  username: string
  password?: string
  realName?: string
  gender?: number
  birthDate?: string
  phone?: string
  email?: string
  country?: string
  avatarUrl?: string
  province?: string
  city?: string
  district?: string
  address?: string
  status?: number
}

/**
 * 消费者用户分页结果
 */
export interface CustomerPageResult {
  records: CustomerVO[]
  total: number
  size: number
  current: number
  pages: number
}

