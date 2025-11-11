import Taro from '@tarojs/taro'
import config from '../config'
import { navigateToWebViewLoginSimple } from './auth'

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
          navigateToWebViewLoginSimple(); // 不能加await！
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
  // 获取用户信息（小程序专用接口）
  getUserInfo: () => request('/api/mini/my-account'),

  // 更新个人信息
  updateProfile: (data: { username?: string; primaryEmail?: string; primaryPhone?: string; name?: string }) => {
    return request('/api/mini/my-account/update-profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  // 修改密码
  changePassword: (data: { currentPassword: string; newPassword: string }) => {
    return request('/api/mini/my-account/change-password', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
 
  // 小程序：获取分组（当前用户可见）
  getMiniGroups: () => request('/api/mini/groups'),

  // 小程序：获取设备列表（分页）
  getMiniDevices: (params: { groupId?: string | number, page?: number, pageSize?: number, keyword?: string, search?: string, devicetype?: string }) => {
    const query = new URLSearchParams()
    if (params.groupId !== undefined) query.set('groupId', String(params.groupId))
    if (params.page !== undefined) query.set('page', String(params.page))
    if (params.pageSize !== undefined) query.set('pageSize', String(params.pageSize))
    // search 参数优先级更高，与后台保持一致
    if (params.search) {
      query.set('search', params.search)
    } else if (params.keyword) {
      query.set('keyword', params.keyword)
    }
    if (params.devicetype) {
      query.set('devicetype', params.devicetype)
    }
    const qs = query.toString() ? `?${query.toString()}` : ''
    return request(`/api/mini/devices${qs}`)
  },
  
  // 获取设备详情（保留原有 Web 端接口，如后续需要）
  getDeviceDetail: (id: number) => request(`/api/devices/${id}`),
  
  // 获取设备参数
  getDeviceParameters: (id: number) => request(`/api/devices/${id}/parameters`),
  
  // 根据参数名称列表获取参数详情
  getParametersInfo: (parameterNames: string[]) => {
    const params = new URLSearchParams()
    params.set('parameters', parameterNames.join(','))
    return request(`/api/parameters?${params.toString()}`)
  },
  
  // 获取设备历史数据
  getDeviceHistoryData: (id: number, params: { parameters: string, startDate: string, endDate: string }) => {
    const query = new URLSearchParams()
    query.set('parameters', params.parameters)
    query.set('startDate', params.startDate)
    query.set('endDate', params.endDate)
    return request(`/api/devices/${id}/history-data?${query.toString()}`)
  },
  
  // 获取设备数据
  getDeviceData: (id: number, params?: any) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
    return request(`/api/devices/${id}/et-data${queryString}`)
  },

  // 小程序：获取设备阈值配置
  getDeviceThresholds: (deviceSn: string) => request(`/api/mini/devices/${encodeURIComponent(deviceSn)}/thresholds`),

  // 小程序：创建或更新设备阈值配置
  saveDeviceThreshold: (deviceSn: string, data: { id?: number, parameter: string, lowerThreshold?: number | null, upperThreshold?: number | null, enabled?: boolean, nodeScopeType?: 'lte' | 'gte' | null, nodeScopeValue?: string | number | null }) => {
    return request(`/api/mini/devices/${encodeURIComponent(deviceSn)}/thresholds`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  // 小程序：删除设备阈值配置
  deleteDeviceThreshold: (deviceSn: string, thresholdId: number) => {
    const query = new URLSearchParams()
    query.set('id', String(thresholdId))
    return request(`/api/mini/devices/${encodeURIComponent(deviceSn)}/thresholds?${query.toString()}`, {
      method: 'DELETE'
    })
  },

  // 小程序：获取消息列表
  getMessages: (params?: { page?: number, pageSize?: number, isRead?: 'true' | 'false' }) => {
    const query = new URLSearchParams()
    if (params?.page) query.set('page', String(params.page))
    if (params?.pageSize) query.set('pageSize', String(params.pageSize))
    if (params?.isRead) query.set('isRead', params.isRead)
    const qs = query.toString() ? `?${query.toString()}` : ''
    return request(`/api/mini/messages${qs}`)
  },

  // 小程序：标记消息为已读
  markMessageRead: (messageId: number) => {
    return request(`/api/mini/messages/${messageId}/read`, {
      method: 'PUT'
    })
  },

  // 小程序：删除消息
  deleteMessage: (messageId: number) => {
    return request(`/api/mini/messages/${messageId}`, {
      method: 'DELETE'
    })
  },

  // 小程序：一键标记所有消息为已读
  markAllMessagesRead: () => {
    return request('/api/mini/messages/read-all', {
      method: 'PUT'
    })
  }
}

export default api
