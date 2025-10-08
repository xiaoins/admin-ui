/**
 * 商品管理API
 */
import { get, post, put, del } from '@/utils/request'
import type { PageResult } from '@/types/api'
import type { Product, ProductQuery, ProductForm, StockAdjustForm } from '@/types/product'

/**
 * 分页查询商品列表
 */
export function getProductPage(params: ProductQuery) {
  return get<PageResult<Product>>('/products/page', params)
}

/**
 * 查询商品详情
 */
export function getProductDetail(productId: number) {
  return get<Product>(`/products/${productId}`)
}

/**
 * 创建商品
 */
export function createProduct(data: ProductForm) {
  return post('/products', data)
}

/**
 * 更新商品
 */
export function updateProduct(data: ProductForm) {
  return put('/products', data)
}

/**
 * 删除商品
 */
export function deleteProduct(productId: number) {
  return del(`/products/${productId}`)
}

/**
 * 上架/下架商品
 */
export function updateProductStatus(productId: number, status: number) {
  return put(`/products/${productId}/status/${status}`)
}

/**
 * 调整库存
 */
export function adjustStock(data: StockAdjustForm) {
  return put('/products/stock', data)
}
