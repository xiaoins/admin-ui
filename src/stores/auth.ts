/**
 * 认证状态管理
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, logout as logoutApi } from '@/api/auth'
import { setToken, removeToken, getToken } from '@/utils/auth'
import type { LoginRequest, LoginResponse } from '@/types/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>(getToken() || '')
  const userInfo = ref<LoginResponse['userInfo'] | null>(null)

  /**
   * 登录
   */
  const login = async (loginForm: LoginRequest) => {
    try {
      const data = await loginApi(loginForm)
      token.value = data.token
      setToken(data.token)
      // 保存用户信息
      if (data.userInfo) {
        userInfo.value = data.userInfo
        // 持久化到localStorage
        localStorage.setItem('userInfo', JSON.stringify(data.userInfo))
      }
      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  /**
   * 登出
   */
  const logout = async () => {
    try {
      await logoutApi()
      token.value = ''
      userInfo.value = null
      removeToken()
      localStorage.removeItem('userInfo')
    } catch (error) {
      // 即使接口失败，也清除本地token
      token.value = ''
      userInfo.value = null
      removeToken()
      localStorage.removeItem('userInfo')
    }
  }

  /**
   * 重置状态
   */
  const reset = () => {
    token.value = ''
    userInfo.value = null
    removeToken()
    localStorage.removeItem('userInfo')
  }

  /**
   * 从localStorage恢复用户信息
   */
  const restoreUserInfo = () => {
    const stored = localStorage.getItem('userInfo')
    if (stored) {
      try {
        userInfo.value = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse userInfo from localStorage', e)
      }
    }
  }

  // 初始化时恢复用户信息
  if (token.value) {
    restoreUserInfo()
  }

  return {
    token,
    userInfo,
    login,
    logout,
    reset,
    restoreUserInfo,
  }
})
