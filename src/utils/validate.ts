/**
 * 表单验证规则
 */

/**
 * 验证用户名（4-20位字母、数字或下划线）
 */
export function validateUsername(username: string): boolean {
  const reg = /^[a-zA-Z0-9_]{4,20}$/
  return reg.test(username)
}

/**
 * 验证密码（6-20位）
 */
export function validatePassword(password: string): boolean {
  return password.length >= 6 && password.length <= 20
}

/**
 * 验证手机号
 */
export function validatePhone(phone: string): boolean {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(phone)
}

/**
 * 验证邮箱
 */
export function validateEmail(email: string): boolean {
  const reg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return reg.test(email)
}

/**
 * 验证商品编号（6-20位大写字母或数字）
 */
export function validateProductNo(productNo: string): boolean {
  const reg = /^[A-Z0-9]{6,20}$/
  return reg.test(productNo)
}

/**
 * 验证角色编码（2-50位大写字母或下划线）
 * 注意：Element Plus 的表单验证器需要在组件中定义，不能使用简单的布尔函数
 * 示例：
 * const validateRoleCode = (rule: any, value: any, callback: any) => {
 *   if (!/^[A-Z_]{2,50}$/.test(value)) {
 *     callback(new Error('角色编码必须是2-50位大写字母或下划线'))
 *   } else {
 *     callback()
 *   }
 * }
 */
