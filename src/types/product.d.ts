/**
 * 商品相关类型定义
 */

// 商品分类
export interface Category {
  categoryId: number
  categoryName: string
  parentId: number
  sortOrder: number
  level: number
  status: number
  statusDesc: string
  productCount?: number
  children?: Category[]
  createTime: string
  updateTime: string
}

// 分类查询参数
export interface CategoryQuery {
  categoryName?: string
  status?: number
}

// 分类表单
export interface CategoryForm {
  categoryId?: number
  categoryName: string
  parentId: number
  sortOrder?: number
  status: number
}

// 商品信息
export interface Product {
  productId: number
  productNo: string
  productName: string
  categoryId: number
  categoryName: string
  brand?: string
  mainImage?: string
  images?: string
  description?: string
  originalPrice: number
  currentPrice: number
  stock: number
  sales: number
  status: number
  statusDesc: string
  createTime: string
  updateTime: string
}

// 商品查询参数
export interface ProductQuery {
  pageNum?: number
  pageSize?: number
  productName?: string
  productNo?: string
  categoryId?: number
  brand?: string
  status?: number
}

// 商品表单
export interface ProductForm {
  productId?: number
  productNo: string
  productName: string
  categoryId: number
  brand?: string
  mainImage?: string
  images?: string
  description?: string
  originalPrice: number
  currentPrice: number
  stock: number
  sales?: number
  status: number
}

// 库存调整
export interface StockAdjustForm {
  productId: number
  quantity: number
  remark?: string
}
