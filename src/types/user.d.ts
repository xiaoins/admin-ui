/**
 * 用户相关类型定义
 */

// 用户信息
export interface User {
  userId: number
  username: string
  realName: string
  phone?: string
  email?: string
  avatarUrl?: string
  roleId: number
  roleName: string
  status: number
  statusDesc: string
  createTime: string
}

// 用户查询参数
export interface UserQuery {
  pageNum?: number
  pageSize?: number
  username?: string
  realName?: string
  phone?: string
  roleId?: number
  status?: number
}

// 用户表单
export interface UserForm {
  userId?: number
  username: string
  password?: string
  realName: string
  phone?: string
  email?: string
  avatarUrl?: string
  roleId: number
  status: number
}

// 重置密码
export interface ResetPasswordForm {
  userId: number
  newPassword: string
}
