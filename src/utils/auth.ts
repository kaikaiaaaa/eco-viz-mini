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
      
      // 加强 debug 日志和报错显示
      Taro.navigateTo({
        url: `/pages/webview/index?url=${encodedUrl}&code_verifier=${encodedCodeVerifier}`,
        success: () => console.log('WebView 登录页面跳转成功'),
        fail: (err) => {
          console.error('WebView 登录页面跳转失败', err)
          Taro.showToast({ title: '跳转登录页失败', icon: 'none' })
        }
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
    console.log('🔄 处理临时 token（JWT解码）...')
    console.log('Temp token length:', tempToken ? tempToken.length : 0)

    // ========== JWT Token 解码 ==========
    // JWT 格式: header.payload.signature
    // 我们只需要解码 payload 部分来获取数据
    const decodeJWT = (jwt: string): any => {
      try {
        const parts = jwt.split('.')
        if (parts.length !== 3) {
          throw new Error('无效的 JWT 格式')
        }

        // 解码 payload（第二个部分）
        const payload = parts[1]
        
        // Base64URL 解码
        const safeBase64UrlDecodeToString = (input: string): string => {
          // 将 Base64URL 转为标准 Base64，并补齐 '='
          const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
          const padLen = (4 - (base64.length % 4)) % 4
          const padded = base64 + '='.repeat(padLen)

          const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
          const rev: Record<string, number> = {}
          for (let i = 0; i < alphabet.length; i++) rev[alphabet[i]] = i

          const bytes: Array<number> = []
          let buffer = 0
          let bits = 0
          for (let i = 0; i < padded.length; i++) {
            const c = padded[i]
            if (c === '=') break
            const val = rev[c]
            if (val === undefined) continue
            buffer = (buffer << 6) | val
            bits += 6
            if (bits >= 8) {
              bits -= 8
              const byte = (buffer >> bits) & 0xff
              bytes.push(byte)
              buffer = buffer & ((1 << bits) - 1)
            }
          }

          // UTF-8 解码
          let out = ''
          for (let i = 0; i < bytes.length; ) {
            const b0 = bytes[i++]
            if (b0 < 0x80) {
              out += String.fromCharCode(b0)
            } else if (b0 >= 0xc0 && b0 < 0xe0) {
              const b1 = bytes[i++]
              out += String.fromCharCode(((b0 & 0x1f) << 6) | (b1 & 0x3f))
            } else if (b0 >= 0xe0 && b0 < 0xf0) {
              const b1 = bytes[i++]
              const b2 = bytes[i++]
              out += String.fromCharCode(
                ((b0 & 0x0f) << 12) | ((b1 & 0x3f) << 6) | (b2 & 0x3f)
              )
            } else {
              // 超过 BMP 的字符（4 字节），转为代理对
              const b1 = bytes[i++]
              const b2 = bytes[i++]
              const b3 = bytes[i++]
              let codePoint =
                ((b0 & 0x07) << 18) | ((b1 & 0x3f) << 12) | ((b2 & 0x3f) << 6) | (b3 & 0x3f)
              codePoint -= 0x10000
              out += String.fromCharCode(0xd800 + ((codePoint >> 10) & 0x3ff))
              out += String.fromCharCode(0xdc00 + (codePoint & 0x3ff))
            }
          }
          return out
        }

        const decodedStr = safeBase64UrlDecodeToString(payload)
        const decoded = JSON.parse(decodedStr)

        // 验证过期时间（exp 字段，单位：秒）
        if (decoded.exp) {
          const now = Math.floor(Date.now() / 1000)
          if (decoded.exp < now) {
            throw new Error('临时 token 已过期')
          }
        }

        return decoded
      } catch (error) {
        console.error('JWT 解码失败:', error)
        throw new Error('无效的临时凭证格式')
      }
    }

    // 解码 JWT token
    const decoded = decodeJWT(tempToken)

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
