import Taro from '@tarojs/taro'
import config from '../config'

// 检查登录状态
export const checkLoginStatus = async () => {
  try {
    // 检查 logto_token
    const accessToken = Taro.getStorageSync('logto_token')
    const loginTimestamp = Taro.getStorageSync('login_timestamp')
    const expiresIn = Taro.getStorageSync('token_expires_in')
    
    if (!accessToken || !loginTimestamp || !expiresIn) {
      console.log('❌ 登录状态检查失败：缺少必要信息')
      return { isLoggedIn: false }
    }
    
    // 检查 token 是否过期
    const now = Date.now()
    const tokenAge = now - loginTimestamp
    const maxAge = expiresIn * 1000 // 转换为毫秒
    
    if (tokenAge > maxAge) {
      console.log('❌ Token 已过期，清除登录状态')
      clearLoginData()
      return { isLoggedIn: false }
    }
    
    // 验证 token 是否有效
    const userInfo = Taro.getStorageSync('user_info')
    if (!userInfo) {
      console.log('❌ 缺少用户信息')
      return { isLoggedIn: false }
    }
    
    console.log('✅ 登录状态检查成功')
    return {
      isLoggedIn: true,
      user: userInfo,
      access_token: accessToken
    }
  } catch (error) {
    console.error('❌ 检查登录状态失败:', error)
    return { isLoggedIn: false }
  }
}

// 清除登录数据
export const clearLoginData = () => {
  try {
    // 清除所有登录相关的存储
    Taro.removeStorageSync('logto_token')
    Taro.removeStorageSync('user_info')
    Taro.removeStorageSync('user_id')
    Taro.removeStorageSync('token_expires_in')
    Taro.removeStorageSync('login_timestamp')
    console.log('✅ 登录数据已清除')
  } catch (error) {
    console.error('❌ 清除登录数据失败:', error)
  }
}

// 获取带认证头的请求配置
export const getAuthHeaders = () => {
  // 仅使用用户 access_token（logto_token）
  const accessToken = Taro.getStorageSync('logto_token')
  return {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
}

// 全局登录锁，防止并发调用
let isLoggingIn = false
let loginPromise: Promise<{ success: boolean; user?: any; error?: string }> | null = null

// 微信静默登录
export const wechatSilentLogin = async () => {
  // 如果正在登录，返回同一个Promise
  if (isLoggingIn && loginPromise) {
    console.log('⏳ 登录正在进行中，等待结果...')
    return loginPromise
  }

  // 检查是否已经登录
  const existingToken = Taro.getStorageSync('logto_token')
  const loginTimestamp = Taro.getStorageSync('login_timestamp')
  const expiresIn = Taro.getStorageSync('token_expires_in')
  
  if (existingToken && loginTimestamp && expiresIn) {
    const now = Date.now()
    const tokenAge = now - loginTimestamp
    const maxAge = expiresIn * 1000
    // 如果token未过期，直接返回成功
    if (tokenAge <= maxAge) {
      const userInfo = Taro.getStorageSync('user_info')
      if (userInfo) {
        console.log('✅ 用户已登录，跳过登录流程')
        return {
          success: true,
          user: userInfo
        }
      }
    }
  }

  // 设置登录锁
  isLoggingIn = true
  
  // 创建登录Promise
  loginPromise = (async () => {
    try {
      console.log('🚀 开始微信静默登录...')
      
      // 1. 获取微信登录code
      const loginRes = await Taro.login()
      if (!loginRes.code) {
        throw new Error('获取微信登录凭证失败')
      }
      
      console.log('✅ 获取微信code成功')
      
      // 2. 调用后端API进行登录
      const response = await Taro.request({
        url: `${config.api.baseUrl}/api/auth/mini-wechat-login`,
        method: 'POST',
        data: { code: loginRes.code },
        header: {
          'Content-Type': 'application/json'
        }
      })
      
      if (response.statusCode !== 200 || response.data.code !== 0) {
        throw new Error(response.data.message || '登录失败')
      }
      
      const { access_token, expires_in, user } = response.data.data
      
      if (!access_token) {
        throw new Error('获取登录凭证失败')
      }
      
      // 3. 存储token和用户信息
      Taro.setStorageSync('logto_token', access_token)
      Taro.setStorageSync('token_expires_in', expires_in)
      Taro.setStorageSync('login_timestamp', Date.now())
      
      if (user) {
        Taro.setStorageSync('user_info', user)
        if (user.id) {
          Taro.setStorageSync('user_id', user.id)
        }
      }
      
      console.log('✅ 微信静默登录成功')
      
      return {
        success: true,
        user: user
      }
    } catch (error) {
      console.error('❌ 微信静默登录失败:', error)
      const errorMsg = error instanceof Error ? error.message : '登录失败'
      return {
        success: false,
        error: errorMsg
      }
    } finally {
      // 清除登录锁
      isLoggingIn = false
      loginPromise = null
    }
  })()

  return loginPromise
}

export default {
  checkLoginStatus,
  clearLoginData,
  getAuthHeaders,
  wechatSilentLogin
}
