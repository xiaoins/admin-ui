/**
 * 角色权限管理API
 */
import { get, post, put, del } from '@/utils/request'
import type { PageResult } from '@/types/api'
import type { Role, RoleQuery, RoleForm, Permission } from '@/types/role'

/**
 * 分页查询角色列表
 */
export function getRolePage(params: RoleQuery) {
  return get<PageResult<Role>>('/roles/page', params)
}

/**
 * 查询角色详情
 */
export function getRoleDetail(roleId: number) {
  return get<Role>(`/roles/${roleId}`)
}

/**
 * 创建角色
 */
export function createRole(data: RoleForm) {
  return post('/roles', data)
}

/**
 * 更新角色
 */
export function updateRole(data: RoleForm) {
  return put('/roles', data)
}

/**
 * 删除角色
 */
export function deleteRole(roleId: number) {
  return del(`/roles/${roleId}`)
}

/**
 * 启用/禁用角色
 */
export function updateRoleStatus(roleId: number, status: number) {
  return put(`/roles/${roleId}/status/${status}`)
}

/**
 * 查询角色权限列表
 */
export function getRolePermissions(roleId: number) {
  return get<Permission[]>(`/roles/${roleId}/permissions`)
}

/**
 * 查询所有权限列表
 */
export function getAllPermissions() {
  return get<Permission[]>('/roles/permissions/all')
}
