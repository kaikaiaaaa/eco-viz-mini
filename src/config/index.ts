// 小程序环境配置
const ENV: 'dev' | 'prod' = 'dev'

const apiBaseUrls = {
  dev: 'http://192.168.199.187:3000',
  prod: 'https://ynsq.eboard.apps.aigrohub.com'
} as const

export const config = {
  env: ENV,
  // API 配置
  api: {
    baseUrl: apiBaseUrls[ENV]
  },

  // 微信小程序配置
  weapp: {
    appId: 'wxad0bc6972754b77c'
  }
}

export default config
