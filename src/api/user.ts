/**
 * 用户管理API
 */
import { get, post, put, del } from '@/utils/request'
import type { PageResult } from '@/types/api'
import type { User, UserQuery, UserForm, ResetPasswordForm } from '@/types/user'

/**
 * 分页查询用户列表
 */
export function getUserPage(params: UserQuery) {
  return get<PageResult<User>>('/users/page', params)
}

/**
 * 查询用户详情
 */
export function getUserDetail(userId: number) {
  return get<User>(`/users/${userId}`)
}

/**
 * 创建用户
 */
export function createUser(data: UserForm) {
  return post('/users', data)
}

/**
 * 更新用户
 */
export function updateUser(data: UserForm) {
  return put('/users', data)
}

/**
 * 删除用户
 */
export function deleteUser(userId: number) {
  return del(`/users/${userId}`)
}

/**
 * 启用/禁用用户
 */
export function updateUserStatus(userId: number, status: number) {
  return put(`/users/${userId}/status/${status}`)
}

/**
 * 重置密码
 */
export function resetPassword(data: ResetPasswordForm) {
  return put('/users/reset-password', data)
}
