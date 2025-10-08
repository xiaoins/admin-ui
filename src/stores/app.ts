/**
 * 应用全局状态管理
 */
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 侧边栏是否折叠
  const sidebarCollapsed = ref(false)

  // 切换侧边栏折叠状态
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  // 设置侧边栏折叠状态
  const setSidebarCollapsed = (collapsed: boolean) => {
    sidebarCollapsed.value = collapsed
  }

  // 页面加载状态
  const loading = ref(false)

  // 设置加载状态
  const setLoading = (status: boolean) => {
    loading.value = status
  }

  return {
    sidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed,
    loading,
    setLoading,
  }
})
