import React, { useState } from 'react'
import { WebView, View, Text } from '@tarojs/components'
import Taro, { useLoad } from '@tarojs/taro'
import { handleLoginSuccess } from '../../utils/auth'

export default function WebviewPage() {
  const [src, setSrc] = useState('')

  useLoad((options) => {
    const url = options?.url ? decodeURIComponent(options.url as string) : ''
    const codeVerifier = options?.code_verifier ? decodeURIComponent(options.code_verifier as string) : ''
    
    // 验证URL有效性
    if (!url || url === '' || url === 'undefined' || url === 'null') {
      Taro.showToast({
        title: '登录URL无效',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 2000)
      return
    }
    
    // 验证URL格式
    try {
      const urlObj = new URL(url)
      if (!urlObj.protocol.startsWith('http')) {
        throw new Error('Invalid protocol')
      }
    } catch (error) {
      Taro.showToast({
        title: '登录URL格式错误',
        icon: 'none'
      })
      setTimeout(() => {
        Taro.navigateBack()
      }, 2000)
      return
    }
    
    setSrc(url)
    
    // 存储 code_verifier
    if (codeVerifier) {
      Taro.setStorageSync('pkce_code_verifier', codeVerifier)
    }
  })

  // 处理 WebView 消息
  const handleMessage = async (e: any) => {
    try {
      let messageData = null
      
      // 解析消息数据
      if (e?.detail?.data && Array.isArray(e.detail.data) && e.detail.data.length > 0) {
        const firstItem = e.detail.data[0]
        messageData = Array.isArray(firstItem) ? firstItem[0] : firstItem
      } else if (e?.detail?.data && typeof e.detail.data === 'object' && !Array.isArray(e.detail.data)) {
        messageData = e.detail.data
      } else if (e?.data && Array.isArray(e.data) && e.data.length > 0) {
        const firstItem = e.data[0]
        messageData = Array.isArray(firstItem) ? firstItem[0] : firstItem
      } else if (e?.data && typeof e.data === 'object' && !Array.isArray(e.data)) {
        messageData = e.data
      }
      
      if (!messageData) {
        return
      }
      
      // 确保 messageData 不是数组
      if (Array.isArray(messageData)) {
        messageData = messageData[0]
      }
      
      // 处理不同类型的消息
      if (messageData.token) {
        // 收到临时 token
        await handleLoginSuccess(messageData.token)
      } else if (messageData.type === 'url_hash' && messageData.temp_token) {
        // 收到 hash 中的 token
        await handleLoginSuccess(messageData.temp_token)
      } else if (messageData.error) {
        // 登录失败
        Taro.showModal({
          title: '登录失败',
          content: messageData.error || '登录失败，请重试',
          showCancel: false
        })
      }
    } catch (error) {
      console.error('处理登录消息失败:', error)
    }
  }

  // 处理 WebView 加载错误
  const handleError = (e: any) => {
    Taro.showModal({
      title: '加载失败',
      content: '无法加载登录页面，请检查网络连接',
      showCancel: true,
      confirmText: '重试',
      cancelText: '返回',
      success: (res) => {
        if (res.confirm) {
          // 刷新页面
          window.location.reload()
        } else {
          Taro.navigateBack()
        }
      }
    })
  }

  return (
    <View style={{ height: '100vh', width: '100vw' }}>
      {src ? (
        <WebView 
          src={src}
          style={{ 
            height: '100vh', 
            width: '100vw'
          }} 
          onMessage={handleMessage}
          onError={handleError}
        />
      ) : (
        <View style={{ 
          height: '100vh', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center'
        }}>
          <Text>正在初始化...</Text>
        </View>
      )}
    </View>
  )
}
