/**
 * 商品分类管理API
 */
import { get, post, put, del } from '@/utils/request'
import type { Category, CategoryQuery, CategoryForm } from '@/types/product'

/**
 * 查询分类树
 */
export function getCategoryTree(params?: CategoryQuery) {
  return get<Category[]>('/categories/tree', params)
}

/**
 * 查询分类列表（扁平结构）
 */
export function getCategoryList(params?: CategoryQuery) {
  return get<Category[]>('/categories/list', params)
}

/**
 * 查询分类详情
 */
export function getCategoryDetail(categoryId: number) {
  return get<Category>(`/categories/${categoryId}`)
}

/**
 * 创建分类
 */
export function createCategory(data: CategoryForm) {
  return post('/categories', data)
}

/**
 * 更新分类
 */
export function updateCategory(data: CategoryForm) {
  return put('/categories', data)
}

/**
 * 删除分类
 */
export function deleteCategory(categoryId: number) {
  return del(`/categories/${categoryId}`)
}

/**
 * 启用/禁用分类
 */
export function updateCategoryStatus(categoryId: number, status: number) {
  return put(`/categories/${categoryId}/status/${status}`)
}
