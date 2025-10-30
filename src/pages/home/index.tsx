import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { checkLoginStatus, clearLoginData } from '../../utils/auth'
import './index.scss'

export default function HomePage() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserInfo()
  }, [])

  const loadUserInfo = async () => {
    try {
      const loginResult = await checkLoginStatus()
      if (loginResult.isLoggedIn && loginResult.user) {
        setUserInfo(loginResult.user)
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    Taro.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          clearLoginData()
          Taro.showToast({ title: '已退出登录', icon: 'success' })
          // 跳转到登录页
          setTimeout(() => {
            Taro.redirectTo({ url: '/pages/index/index' })
          }, 1500)
        }
      }
    })
  }

  if (loading) {
    return (
      <View className='home-page'>
        <View className='loading'>
          <Text>加载中...</Text>
        </View>
      </View>
    )
  }

  return (
    <View className='home-page'>
      <View className='header'>
        <Text className='title'>首页</Text>
      </View>
      
      <View className='content'>
        {userInfo && (
          <View className='user-info'>
            <Text>欢迎, {userInfo.username}</Text>
          </View>
        )}
        
        <View className='placeholder'>
          <Text>首页内容待完善</Text>
        </View>
      </View>
    </View>
  )
}

