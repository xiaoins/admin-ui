/**
 * 用户信息状态管理
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref<User | null>(null)

  // 设置用户信息
  const setUserInfo = (info: User) => {
    userInfo.value = info
  }

  // 清除用户信息
  const clearUserInfo = () => {
    userInfo.value = null
  }

  return {
    userInfo,
    setUserInfo,
    clearUserInfo,
  }
})
