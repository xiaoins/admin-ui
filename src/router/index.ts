/**
 * 路由配置
 */
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { isAuthenticated } from '@/utils/auth'

// 公共路由
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录', hidden: true },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: { title: '404', hidden: true },
  },
]

// 主路由
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layout/MainLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: '/src/assets/仪表盘.png' },
      },
    ],
  },
  {
    path: '/user',
    component: () => import('@/layout/MainLayout.vue'),
    redirect: '/user/list',
    meta: { title: '系统用户', icon: '/src/assets/用户.png' },
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '系统用户', icon: '/src/assets/用户.png' },
      },
    ],
  },
  {
    path: '/customer',
    component: () => import('@/layout/MainLayout.vue'),
    redirect: '/customer/list',
    meta: { title: '会员列表', icon: '/src/assets/消费者.png' },
    children: [
      {
        path: 'list',
        name: 'CustomerList',
        component: () => import('@/views/customer/index.vue'),
        meta: { title: '会员列表', icon: '/src/assets/消费者.png' },
      },
    ],
  },
  {
    path: '/role',
    component: () => import('@/layout/MainLayout.vue'),
    redirect: '/role/list',
    meta: { title: '角色管理', icon: '/src/assets/角色.png' },
    children: [
      {
        path: 'list',
        name: 'RoleList',
        component: () => import('@/views/role/index.vue'),
        meta: { title: '角色列表', icon: '/src/assets/角色.png' },
      },
    ],
  },
  {
    path: '/category',
    component: () => import('@/layout/MainLayout.vue'),
    redirect: '/category/list',
    meta: { title: '分类管理', icon: '/src/assets/分类.png' },
    children: [
      {
        path: 'list',
        name: 'CategoryList',
        component: () => import('@/views/category/index.vue'),
        meta: { title: '分类列表', icon: '/src/assets/分类.png' },
      },
    ],
  },
  {
    path: '/product',
    component: () => import('@/layout/MainLayout.vue'),
    redirect: '/product/list',
    meta: { title: '商品管理', icon: '/src/assets/商品.png' },
    children: [
      {
        path: 'list',
        name: 'ProductList',
        component: () => import('@/views/product/list.vue'),
        meta: { title: '商品列表', icon: '/src/assets/商品.png' },
      },
      {
        path: 'add',
        name: 'ProductAdd',
        component: () => import('@/views/product/add.vue'),
        meta: { title: '新增商品', icon: '/src/assets/商品.png', hidden: true },
      },
      {
        path: 'edit/:id',
        name: 'ProductEdit',
        component: () => import('@/views/product/edit.vue'),
        meta: { title: '编辑商品', icon: '/src/assets/商品.png', hidden: true },
      },
    ],
  },
  {
    path: '/order',
    component: () => import('@/layout/MainLayout.vue'),
    redirect: '/order/list',
    meta: { title: '订单管理', icon: '/src/assets/订单.png' },
    children: [
      {
        path: 'list',
        name: 'OrderList',
        component: () => import('@/views/order/list.vue'),
        meta: { title: '订单列表', icon: '/src/assets/订单.png' },
      },
      {
        path: 'detail/:id',
        name: 'OrderDetail',
        component: () => import('@/views/order/detail.vue'),
        meta: { title: '订单详情', icon: '/src/assets/订单.png', hidden: true },
      },
    ],
  },
  // 404页面必须放在最后
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hidden: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...constantRoutes, ...asyncRoutes],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title || ''} - 电商后台管理系统`

  // 白名单路由（不需要登录）
  const whiteList = ['/login', '/404']

  if (isAuthenticated()) {
    // 已登录
    if (to.path === '/login') {
      // 已登录则跳转到首页
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    // 未登录
    if (whiteList.includes(to.path)) {
      next()
    } else {
      // 重定向到登录页
      next(`/login?redirect=${to.path}`)
    }
  }
})

export default router
