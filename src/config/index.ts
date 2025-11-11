// 小程序环境配置
export const config = {
  // API 配置 - 强制使用开发环境
  api: {
    baseUrl: 'http://192.168.199.153:3000' // 强制使用开发环境URL
  },
  
  // Logto 配置 - 使用新创建的小程序应用
  logto: {
    endpoint: 'https://login.eboard.apps.aigrohub.com',
    appId: 'avmoloeby2yvj8bi6mwse', // 使用环境变量中的 App ID
    apiResource: 'https://ynsq.eboard.apps.aigrohub.com/api',
    redirectUri: 'http://192.168.199.153:3000/api/auth/mini-callback' // 使用后端API回调
  },
  
  // 微信小程序配置
  weapp: {
    appId: 'wxad0bc6972754b77c'
  }
}

export default config
