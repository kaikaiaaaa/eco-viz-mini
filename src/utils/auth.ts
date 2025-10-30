import Taro from '@tarojs/taro'
import config from '../config'

// 生成随机字符串 - 使用更安全的字符集
const generateRandomString = (length: number) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_' // 移除 . 和 ~ 避免 URL 编码问题
  let result = ''
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return result
}

// 小程序环境的 Base64 编码实现
const base64Encode = (str: string) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let result = ''
  let i = 0
  
  while (i < str.length) {
    const a = str.charCodeAt(i++)
    const b = i < str.length ? str.charCodeAt(i++) : 0
    const c = i < str.length ? str.charCodeAt(i++) : 0
    
    const bitmap = (a << 16) | (b << 8) | c
    
    result += chars.charAt((bitmap >> 18) & 63)
    result += chars.charAt((bitmap >> 12) & 63)
    result += i - 2 < str.length ? chars.charAt((bitmap >> 6) & 63) : '='
    result += i - 1 < str.length ? chars.charAt(bitmap & 63) : '='
  }
  
  return result
}

// 生成 code_challenge (SHA256 + Base64URL)
const generateCodeChallenge = async (codeVerifier: string) => {
  try {
    // 在小程序环境中，我们使用 Web Crypto API 生成真正的 SHA256
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder()
      const data = encoder.encode(codeVerifier)
      const hash = await crypto.subtle.digest('SHA-256', data)
      
      // 转换为 Base64URL
      const base64 = base64Encode(String.fromCharCode(...new Uint8Array(hash)))
      const base64url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
      
      // SHA256的Base64URL编码应该是43个字符
      return base64url
    } else {
      throw new Error('Web Crypto API not available')
    }
  } catch (error) {
    console.warn('SHA256 failed, using fallback:', error)
    // 降级方案：使用简单的 Base64 编码（仅用于测试）
    const base64 = base64Encode(codeVerifier)
    const base64url = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    return base64url
  }
}



// WebView 登录 - 使用简化的会话ID方案
export const navigateToWebViewLoginSimple = async () => {
  try {
    console.log('🚀 请求后端生成PKCE参数...')
    
    // 调用后端API生成PKCE参数
    const response = await Taro.request({
      url: `${config.api.baseUrl}/api/auth/mini-pkce`,
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.statusCode === 200 && response.data.code === 0) {
      const pkceData = response.data.data
      console.log('✅ PKCE参数获取成功:', pkceData.loginUrl.substring(0, 100) + '...')
      
      // 存储 code_verifier 用于后续的 token 交换
      Taro.setStorageSync('pkce_code_verifier', pkceData.codeVerifier)
      
      // 跳转到WebView页面
      const encodedUrl = encodeURIComponent(pkceData.loginUrl)
      const encodedCodeVerifier = encodeURIComponent(pkceData.codeVerifier)
      
      Taro.navigateTo({
        url: `/pages/webview/index?url=${encodedUrl}&code_verifier=${encodedCodeVerifier}`
      })
    } else {
      throw new Error(response.data.message || 'PKCE参数生成失败')
    }
  } catch (error) {
    console.error('❌ WebView登录失败:', error)
    Taro.showToast({
      title: '登录失败，请重试',
      icon: 'none'
    })
  }
}


// 登录成功后处理（服务端代理模式）
export const handleLoginSuccess = async (tempToken: string) => {
  try {
    console.log('🔄 处理临时 token（本地解析）...')
    console.log('Temp token length:', tempToken ? tempToken.length : 0)

    // tempToken 为 base64(JSON.stringify({ access_token, expires_in, timestamp }))
    const decoded = JSON.parse(
      decodeURIComponent(escape(atob(tempToken)))
    ) as { access_token: string; expires_in?: number; timestamp?: number }

    if (!decoded || !decoded.access_token) {
      throw new Error('无效的临时凭证')
    }

    const accessToken = decoded.access_token
    const expiresIn = decoded.expires_in || 3600

    // 存储用户 access_token（与后端统一）
    Taro.setStorageSync('logto_token', accessToken)
    Taro.setStorageSync('token_expires_in', expiresIn)
    Taro.setStorageSync('login_timestamp', Date.now())

    // 清除临时登录状态
    Taro.removeStorageSync('pkce_code_verifier')

    // 尝试通过后端 API 获取用户信息（而不是直接调用 Logto）
    try {
      const meResp = await Taro.request({
        url: `${config.api.baseUrl}/api/me/data`,
        method: 'GET',
        header: getAuthHeaders()
      })

      if (meResp.statusCode === 200 && meResp.data && meResp.data.code === 0) {
        const userData = meResp.data.data
        if (userData?.user) {
          const userInfo = userData.user
          Taro.setStorageSync('user_info', userInfo)
          // 缓存 userId 用于请求透传
          if (userInfo.id) {
            Taro.setStorageSync('user_id', userInfo.id)
          }
          console.log('✅ 用户信息已获取并缓存')
        }
      }
    } catch (e) {
      console.warn('⚠️ 获取用户信息失败（可忽略，不影响登录）:', e)
      // 不影响登录流程，继续执行
    }

    console.log('✅ 登录成功，令牌已存储')
    Taro.showToast({ title: '登录成功', icon: 'success' })

    // 跳转到首页
    setTimeout(() => {
      Taro.redirectTo({ 
        url: '/pages/home/index',
        fail: () => {
          // 如果 redirectTo 失败，使用 reLaunch
          Taro.reLaunch({ url: '/pages/home/index' })
        }
      })
    }, 1000)
  } catch (error) {
    console.error('❌ 处理临时 token 失败:', error)
    const errorMsg = error instanceof Error ? error.message : '登录验证失败'
    Taro.showToast({ title: errorMsg, icon: 'none' })
  }
}


// 检查登录状态
export const checkLoginStatus = async () => {
  try {
    // 检查 logto_token（WebView登录）
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
    Taro.removeStorageSync('pkce_code_verifier')
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

export default {
  checkLoginStatus,
  navigateToWebViewLoginSimple,
  handleLoginSuccess,
  clearLoginData,
  getAuthHeaders
}
