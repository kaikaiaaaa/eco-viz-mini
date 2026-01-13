import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { checkLoginStatus, wechatSilentLogin } from '../../utils/auth'

export default function IndexPage() {
  const [hasChecked, setHasChecked] = useState(false)

  // 首次加载检查
  useEffect(() => {
    checkLoginAndRedirect()
  }, [])

  const checkLoginAndRedirect = async () => {
    setHasChecked(true)
    
    try {
      const loginResult = await checkLoginStatus()
      
      if (loginResult.isLoggedIn) {
        // 已登录，跳转到首页
        Taro.switchTab({ 
          url: '/pages/home/index',
          fail: () => {
            Taro.reLaunch({ url: '/pages/home/index' })
          }
        })
      } else {
        // 未登录，尝试微信静默登录
        console.log('🔄 尝试微信静默登录...')
        const silentLoginResult = await wechatSilentLogin()
        
        if (silentLoginResult.success) {
          // 静默登录成功，跳转到首页
          console.log('✅ 微信静默登录成功')
          Taro.switchTab({ 
            url: '/pages/home/index',
            fail: () => {
              Taro.reLaunch({ url: '/pages/home/index' })
            }
          })
        } else {
          // 静默登录失败，显示错误提示
          console.error('❌ 微信静默登录失败:', silentLoginResult.error)
          Taro.showToast({ 
            title: silentLoginResult.error || '登录失败，请重试', 
            icon: 'none',
            duration: 3000
          })
        }
      }
    } catch (error) {
      console.error('检查登录状态失败:', error)
      // 发生错误时，尝试静默登录
      try {
        const silentLoginResult = await wechatSilentLogin()
        if (silentLoginResult.success) {
          Taro.switchTab({ 
            url: '/pages/home/index',
            fail: () => {
              Taro.reLaunch({ url: '/pages/home/index' })
            }
          })
        } else {
          Taro.showToast({ 
            title: silentLoginResult.error || '登录失败，请重试', 
            icon: 'none',
            duration: 3000
          })
        }
      } catch (loginError) {
        console.error('登录失败:', loginError)
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


