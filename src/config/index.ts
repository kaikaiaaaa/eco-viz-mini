// 小程序环境配置
const ENV: 'dev' | 'prod' = 'dev'

const apiBaseUrls = {
  dev: 'http://192.168.199.61:3000',
  prod: 'https://ynsq.eboard.apps.aigrohub.com'
} as const

const logtoRedirectUris = {
  dev: 'http://192.168.199.61:3000/api/auth/mini-callback',
  prod: 'https://ynsq.eboard.apps.aigrohub.com/api/auth/mini-callback'
} as const

export const config = {
  env: ENV,
  // API 配置
  api: {
    baseUrl: apiBaseUrls[ENV]
  },
  
  // Logto 配置 - 使用新创建的小程序应用
  logto: {
    endpoint: 'https://login.eboard.apps.aigrohub.com',
    appId: 'ctvdqppb8we5z1yz41qfg', // 使用环境变量中的 App ID
    apiResource: 'https://ynsq.eboard.apps.aigrohub.com/api',
    redirectUri: logtoRedirectUris[ENV] // 使用后端API回调
  },
  
  // 微信小程序配置
  weapp: {
    appId: 'wxad0bc6972754b77c'
  }
}

export default config
