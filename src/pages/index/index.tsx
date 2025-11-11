import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { checkLoginStatus, navigateToWebViewLoginSimple } from '../../utils/auth'

export default function IndexPage() {
  const [hasChecked, setHasChecked] = useState(false)

  // 首次加载检查
  useEffect(() => {
    checkLoginAndRedirect()
  }, [])

  // 页面显示时检查（包括从 webview 返回的情况）
  useDidShow(() => {
    if (!hasChecked) return
    
    // 已经从 webview 返回，重新检查登录状态
    checkLoginAndRedirect()
  })

  const checkLoginAndRedirect = async () => {
    setHasChecked(true)
    
    try {
      const loginResult = await checkLoginStatus()
      
      if (loginResult.isLoggedIn) {
        // 已登录，跳转到首页
        Taro.switchTab({ 
          url: '/pages/home/index',
          fail: () => {
            // 如果 switchTab 失败，使用 reLaunch
            Taro.reLaunch({ url: '/pages/home/index' })
          }
        })
      } else {
        // 未登录，自动跳转到 WebView 登录页
        await navigateToWebViewLoginSimple()
      }
    } catch (error) {
      console.error('检查登录状态失败:', error)
      // 发生错误时，尝试登录
      try {
        await navigateToWebViewLoginSimple()
      } catch (loginError) {
        console.error('跳转到登录页失败:', loginError)
        Taro.showToast({ 
          title: '登录失败，请重试', 
          icon: 'none',
          duration: 3000
        })
      }
    }
  }

  return (
    <View style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <Text>正在初始化...</Text>
    </View>
  )
}


