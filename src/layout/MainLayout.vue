<template>
  <div class="main-layout">
    <el-container>
      <!-- 顶部Header -->
      <el-header class="main-header">
        <!-- 左侧区域 -->
        <div class="header-left">
          <!-- Logo -->
          <div class="header-logo">
            <el-icon :size="24" color="#36D399">
              <ShoppingCart />
            </el-icon>
            <span class="logo-text">电商管理后台</span>
          </div>

          <!-- 折叠按钮 -->
          <el-button
            text
            :icon="appStore.sidebarCollapsed ? Expand : Fold"
            class="collapse-btn"
            @click="toggleSidebar"
          />
        </div>

        <!-- 右侧区域 -->
        <div class="header-right">
          <!-- 通知图标 -->
          <el-button text :icon="Bell" class="header-action" />

          <!-- 用户下拉菜单 -->
          <el-dropdown @command="handleCommand">
            <div class="user-dropdown">
              <!-- 头像：优先显示用户上传的头像，否则显示图标或首字母 -->
              <el-avatar v-if="authStore.userInfo?.avatarUrl" :src="authStore.userInfo.avatarUrl" :size="36" />
              <el-avatar v-else :size="36" style="background-color: #e6e8eb; color: #666666">
                <template v-if="authStore.userInfo?.realName">
                  {{ authStore.userInfo.realName.charAt(0) }}
                </template>
                <el-icon v-else :size="20">
                  <User />
                </el-icon>
              </el-avatar>
              <!-- 用户名：优先显示真实姓名，否则显示用户名 -->
              <span class="username">
                {{ authStore.userInfo?.realName || authStore.userInfo?.username || 'Admin' }}
              </span>
              <el-icon class="arrow-icon">
                <ArrowDown />
              </el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon>
                    <User />
                  </el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon>
                    <SwitchButton />
                  </el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-container class="main-container">
        <!-- 侧边栏 -->
        <el-aside :width="sidebarWidth" class="main-aside">
          <el-menu
            :default-active="activeMenu"
            :collapse="appStore.sidebarCollapsed"
            :unique-opened="true"
            background-color="#ffffff"
            text-color="#909399"
            active-text-color="#36d399"
            router
          >
            <template v-for="route in menuRoutes" :key="route.path">
              <!-- 单个菜单项 -->
              <el-menu-item
                v-if="!route.children || route.children.length === 1"
                :index="route.children && route.children.length === 1 ? resolveMenuPath(route.path, route.children[0].path) : route.path"
              >
                <img
                  v-if="getMenuIcon(route)"
                  :src="getMenuIcon(route)"
                  class="menu-icon"
                  alt="icon"
                />
                <template #title>{{ getMenuTitle(route) }}</template>
              </el-menu-item>

              <!-- 子菜单 -->
              <el-sub-menu v-else :index="route.path">
                <template #title>
                  <img
                    v-if="route.meta?.icon"
                    :src="route.meta.icon"
                    class="menu-icon"
                    alt="icon"
                  />
                  <span>{{ route.meta?.title }}</span>
                </template>

                <el-menu-item v-for="child in route.children" :key="child.path" :index="resolveMenuPath(route.path, child.path)">
                  <img
                    v-if="child.meta?.icon"
                    :src="child.meta.icon"
                    class="menu-icon"
                    alt="icon"
                  />
                  <template #title>{{ child.meta?.title }}</template>
                </el-menu-item>
              </el-sub-menu>
            </template>
          </el-menu>
        </el-aside>

        <!-- 主内容区 -->
        <el-main class="main-content">
          <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  Fold,
  Expand,
  Bell,
  User,
  ArrowDown,
  SwitchButton,
  ShoppingCart,
} from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { asyncRoutes } from '@/router'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const authStore = useAuthStore()

// 侧边栏宽度
const sidebarWidth = computed(() => {
  return appStore.sidebarCollapsed ? '64px' : '200px'
})

// 当前路由
const currentRoute = computed(() => route)

// 当前激活的菜单
const activeMenu = computed(() => {
  return route.path
})

// 菜单路由（过滤隐藏的路由）
const menuRoutes = computed(() => {
  return asyncRoutes
    .filter((route) => !route.meta?.hidden && route.path !== '/:pathMatch(.*)*')
    .map((route) => {
      if (route.children && route.children.length > 0) {
        const visibleChildren = route.children.filter((child) => !child.meta?.hidden)
        return {
          ...route,
          children: visibleChildren,
        }
      }
      return route
    })
})

// 获取菜单图标
const getMenuIcon = (route: any) => {
  if (route.children && route.children.length === 1) {
    return route.children[0].meta?.icon || route.meta?.icon
  }
  return route.meta?.icon
}

// 获取菜单标题
const getMenuTitle = (route: any) => {
  if (route.children && route.children.length === 1) {
    return route.children[0].meta?.title || route.meta?.title
  }
  return route.meta?.title
}

// 切换侧边栏
const toggleSidebar = () => {
  appStore.toggleSidebar()
}

// 处理下拉菜单命令
const handleCommand = async (command: string) => {
  if (command === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })

      await authStore.logout()
      ElMessage.success('退出成功')
      router.push('/login')
    } catch (error) {
      // 用户取消或退出失败
    }
  } else if (command === 'profile') {
    ElMessage.info('个人中心功能开发中')
  }
}

const resolveMenuPath = (parentPath: string, childPath?: string) => {
  const normalize = (path: string) => {
    if (!path) return ''
    const cleaned = path.replace(/\/+/g, '/').replace(/\/+/g, '/')
    return cleaned === '/' ? '/' : cleaned.replace(/\/$/, '')
  }
  const normalizedParent = normalize(parentPath)
  if (childPath) {
    const normalizedChild = normalize(childPath).replace(/^\//, '')
    if (!normalizedParent || normalizedParent === '/') {
      return `/${normalizedChild}`
    }
    return `${normalizedParent}/${normalizedChild}`.replace(/\/+/g, '/')
  }
  return normalizedParent || '/'
}
</script>

<style scoped>
/* 整体布局 - 完全填充屏幕，无边距 */
.main-layout {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #ffffff;
}

.el-container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.main-container {
  height: calc(100vh - 60px);
  margin: 0;
  padding: 0;
}

/* 顶部Header - 60px高度，完全紧贴顶部 */
.main-header {
  position: relative;
  height: 60px !important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0;
  padding: 0 20px;
  background: #ffffff;
  border-bottom: 1px solid #e6e8eb;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

/* Header左侧区域 */
.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  white-space: nowrap;
}

.collapse-btn {
  font-size: 20px;
  color: #666666;
}

.collapse-btn:hover {
  color: #36d399;
}

/* Header右侧区域 */
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-action {
  font-size: 18px;
  color: #666666;
}

.header-action:hover {
  color: #36d399;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-dropdown:hover {
  background-color: #f5f7fa;
}

.user-dropdown .username {
  font-size: 14px;
  color: #333333;
}

.user-dropdown .arrow-icon {
  font-size: 12px;
  color: #909399;
}

/* 侧边栏 - 完全紧贴左侧 */
.main-aside {
  position: relative;
  margin: 0;
  padding: 0 !important;
  background: #ffffff;
  border-right: 1px solid #e6e8eb;
  transition: width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  overflow-x: hidden;
  flex-shrink: 0;
}

/* 覆盖Element Plus的默认样式 */
.main-aside :deep(.el-aside) {
  padding: 0 !important;
  margin: 0 !important;
}

.main-aside :deep(.el-menu) {
  border-right: none;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 侧边栏滚动条样式 */
.main-aside :deep(.el-menu::-webkit-scrollbar) {
  width: 6px;
}

.main-aside :deep(.el-menu::-webkit-scrollbar-thumb) {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.main-aside :deep(.el-menu::-webkit-scrollbar-thumb:hover) {
  background-color: rgba(0, 0, 0, 0.2);
}

/* 菜单项样式 */
.main-aside :deep(.el-menu-item) {
  height: 48px;
  line-height: 48px;
  font-size: 14px;
  color: #909399;
  transition: all 0.3s;
  margin: 0;
  border-left: 3px solid transparent;
}

.main-aside :deep(.el-menu-item:hover) {
  background-color: #f5f7fa !important;
  color: #36d399;
}

.main-aside :deep(.el-menu-item.is-active) {
  background-color: #f0fff7 !important;
  color: #36d399 !important;
  border-left: 3px solid #36d399 !important;
  font-weight: 500;
}

/* PNG 图标样式 */
.menu-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  vertical-align: middle;
  display: inline-block;
  flex-shrink: 0;
}

.main-aside :deep(.el-menu-item .menu-icon) {
  margin-right: 8px;
}

.main-aside :deep(.el-sub-menu__title .menu-icon) {
  margin-right: 8px;
}

.main-aside :deep(.el-sub-menu__title) {
  height: 48px;
  line-height: 48px;
  font-size: 14px;
  color: #909399;
}

.main-aside :deep(.el-sub-menu__title:hover) {
  background-color: #f5f7fa !important;
  color: #36d399;
}

.main-aside :deep(.el-sub-menu.is-active > .el-sub-menu__title) {
  color: #36d399;
}

/* 折叠状态 */
.main-aside :deep(.el-menu--collapse) {
  width: 64px;
}

.main-aside :deep(.el-menu--collapse .el-menu-item),
.main-aside :deep(.el-menu--collapse .el-sub-menu__title) {
  padding: 0 !important;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 折叠状态下图标居中 */
.main-aside :deep(.el-menu--collapse .menu-icon) {
  margin: 0 auto;
}

/* 主内容区 */
.main-content {
  background: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 内容区滚动条样式 */
.main-content::-webkit-scrollbar {
  width: 8px;
}

.main-content::-webkit-scrollbar-thumb {
  background-color: #dcdfe6;
  border-radius: 4px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background-color: #c0c4cc;
}

.main-content::-webkit-scrollbar-track {
  background-color: #f5f7fa;
}

/* 页面切换动画 */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 下拉菜单样式调整 */
:deep(.el-dropdown-menu__item) {
  font-size: 14px;
  padding: 8px 16px;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: #f5f7fa;
  color: #36d399;
}

:deep(.el-dropdown-menu__item .el-icon) {
  margin-right: 8px;
}
</style>
