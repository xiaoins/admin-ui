/**
 * 认证相关API
 */
import { post } from '@/utils/request'
import type { LoginRequest, LoginResponse } from '@/types/api'

/**
 * 用户登录
 */
export function login(data: LoginRequest) {
  return post<LoginResponse>('/auth/login', data)
}

/**
 * 用户登出
 */
export function logout() {
  return post('/auth/logout')
}
