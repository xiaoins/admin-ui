/**
 * Axios 封装
 * 统一处理请求和响应拦截
 */
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { getToken, removeToken } from './auth'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: '/api/admin/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = getToken()
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data

    // 后端返回的成功code是字符串"0"
    if (res.code === '0' || res.code === 0) {
      return res.data
    }

    // 处理业务错误
    const errorMsg = res.message || '请求失败'

    // Token相关错误，跳转到登录页
    if (res.code === 'A0401' || res.code === 'A0402') {
      ElMessage.error('登录已过期，请重新登录')
      removeToken()
      // 延迟跳转，避免多次提示
      setTimeout(() => {
        window.location.href = '/login'
      }, 1000)
      return Promise.reject(new Error(errorMsg))
    }

    // 其他业务错误
    ElMessage.error(errorMsg)
    return Promise.reject(new Error(errorMsg))
  },
  (error) => {
    console.error('响应错误：', error)

    let errorMessage = '请求失败'
    if (error.response) {
      switch (error.response.status) {
        case 400:
          errorMessage = '请求参数错误'
          break
        case 401:
          errorMessage = '未授权，请重新登录'
          removeToken()
          setTimeout(() => {
            window.location.href = '/login'
          }, 1000)
          break
        case 403:
          errorMessage = '拒绝访问'
          break
        case 404:
          errorMessage = '请求地址不存在'
          break
        case 500:
          errorMessage = '服务器内部错误'
          break
        case 502:
          errorMessage = '网关错误'
          break
        case 503:
          errorMessage = '服务不可用'
          break
        case 504:
          errorMessage = '网关超时'
          break
        default:
          errorMessage = `连接错误${error.response.status}`
      }
    } else if (error.message.includes('timeout')) {
      errorMessage = '请求超时'
    } else if (error.message.includes('Network Error')) {
      errorMessage = '网络连接异常'
    }

    ElMessage.error(errorMessage)
    return Promise.reject(error)
  },
)

// 导出封装的请求方法
export default service

// 封装GET请求
export function get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.get(url, { params, ...config })
}

// 封装POST请求
export function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.post(url, data, config)
}

// 封装PUT请求
export function put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.put(url, data, config)
}

// 封装DELETE请求
export function del<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.delete(url, { params, ...config })
}
