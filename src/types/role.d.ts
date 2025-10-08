/**
 * 角色权限相关类型定义
 */

// 角色信息
export interface Role {
  roleId: number
  roleName: string
  roleCode: string
  description?: string
  status: number
  statusDesc: string
  permissionCount?: number
  createTime: string
}

// 角色查询参数
export interface RoleQuery {
  pageNum?: number
  pageSize?: number
  roleName?: string
  roleCode?: string
  status?: number
}

// 角色表单
export interface RoleForm {
  roleId?: number
  roleName: string
  roleCode: string
  description?: string
  status: number
}

// 权限信息
export interface Permission {
  permissionId: number
  roleId: number
  permissionName: string
  permissionCode: string
  resourceType: string
  createTime: string
}
