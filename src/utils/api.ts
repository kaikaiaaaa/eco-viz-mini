import Taro from '@tarojs/taro'
import config from '../config'

// 请求拦截器
const request = (url: string, options: RequestInit = {}) => {
  const token = Taro.getStorageSync('logto_token')
  
  return new Promise((resolve, reject) => {
    Taro.request({
      url: `${config.api.baseUrl}${url}`,
      method: options.method as any || 'GET',
      header: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      },
      data: options.body ? JSON.parse(options.body as string) : undefined,
      success: (res) => {
        if (res.statusCode === 401) {
          // Token 过期，清除本地存储并跳转登录
          Taro.removeStorageSync('logto_token')
          Taro.navigateTo({ url: '/pages/login/index' })
          reject(new Error('登录已过期'))
          return
        }
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(new Error(`请求失败: ${res.statusCode}`))
        }
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

// API 方法封装
export const api = {
  // 获取用户信息
  getUserInfo: () => request('/api/logto/my-account'),
  
  // 获取设备列表
  getDevices: () => request('/api/devices'),
  
  // 获取设备详情
  getDeviceDetail: (id: number) => request(`/api/devices/${id}`),
  
  // 获取设备参数
  getDeviceParameters: (id: number) => request(`/api/devices/${id}/parameters`),
  
  // 获取设备数据
  getDeviceData: (id: number, params?: any) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    return request(`/api/devices/${id}/et-data${queryString}`)
  }
}

export default api
