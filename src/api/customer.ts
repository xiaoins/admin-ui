/**
 * 消费者用户管理API
 */
import request from '@/utils/request'
import type { CustomerVO, CustomerQuery, CustomerForm, CustomerPageResult } from '@/types/customer'

/**
 * 分页查询消费者用户列表
 */
export function getCustomerPage(params: CustomerQuery) {
  return request<CustomerPageResult>({
    url: '/customers/page',
    method: 'get',
    params
  })
}

/**
 * 根据ID查询消费者用户详情
 */
export function getCustomerById(customerId: number) {
  return request<CustomerVO>({
    url: `/customers/${customerId}`,
    method: 'get'
  })
}

/**
 * 新增消费者用户
 */
export function createCustomer(data: CustomerForm) {
  return request({
    url: '/customers',
    method: 'post',
    data
  })
}

/**
 * 更新消费者用户
 */
export function updateCustomer(customerId: number, data: CustomerForm) {
  return request({
    url: `/customers/${customerId}`,
    method: 'put',
    data
  })
}

/**
 * 删除消费者用户
 */
export function deleteCustomer(customerId: number) {
  return request({
    url: `/customers/${customerId}`,
    method: 'delete'
  })
}

/**
 * 重置密码
 */
export function resetCustomerPassword(customerId: number, newPassword: string) {
  return request({
    url: `/customers/${customerId}/reset-password`,
    method: 'put',
    data: newPassword
  })
}

