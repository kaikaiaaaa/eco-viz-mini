import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton, AtMessage, AtActivityIndicator } from 'taro-ui'
import Taro from '@tarojs/taro'
import { clearLoginData } from '../../utils/auth'
import api from '../../utils/api'
import 'taro-ui/dist/style/index.scss'

interface UserInfo {
  id: string
  username?: string
  name?: string
  primaryEmail?: string
  primaryPhone?: string
  createdAt?: number
  updatedAt?: number
  lastSignInAt?: number
}

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserInfo()
  }, [])

  const loadUserInfo = async () => {
    try {
      const cachedUser = Taro.getStorageSync('user_info')
      if (cachedUser) {
        setUserInfo(cachedUser)
        setLoading(false)
        return
      }

      // 从缓存加载失败，尝试从 API 获取
      const response: any = await api.getUserInfo()
      if (response.code === 0 && response.data?.user) {
        setUserInfo(response.data.user)
        Taro.setStorageSync('user_info', response.data.user)
      }
    } catch (error) {
      console.error('加载用户信息失败:', error)
      Taro.atMessage({ message: '加载用户信息失败', type: 'error' })
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
          Taro.atMessage({ message: '已退出登录', type: 'info' })
          setTimeout(() => { 
            Taro.redirectTo({ url: '/pages/home/index' })
          }, 1500)
        }
      }
    })
  }

  const formatPhone = (phone?: string) => {
    if (!phone) return '--'
    const cleaned = phone.replace(/^86/, '')
    return cleaned.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
  }

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '--'
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  if (loading) {
    return (
      <View style={{minHeight:'100vh',background:'#fff',display:'flex',justifyContent:'center',alignItems:'center'}}>
        <AtActivityIndicator mode='center' isOpened={loading}></AtActivityIndicator>
      </View>
    )
  }

  return (
    <View style={{minHeight:'100vh',background:'#f5f6fa',padding:'20px'}}>
      <AtMessage />
      
      {/* 基本信息卡片 */}
      <View style={{background:'#fff',borderRadius:'12px',padding:'20px',marginBottom:'20px'}}>
        <View style={{borderBottom:'1px solid #ededed',paddingBottom:'16px',marginBottom:'16px'}}>
          <Text style={{fontSize:'18px',fontWeight:600,color:'#222'}}>基本信息</Text>
        </View>
        
        <View style={{marginBottom:'16px'}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:'8px'}}>
            <Text style={{fontSize:'14px',color:'#666'}}>姓名/昵称</Text>
            <Text style={{fontSize:'14px',color:'#222',fontWeight:500}}>{userInfo?.name || '--'}</Text>
          </View>
        </View>

        <View style={{marginBottom:'16px'}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:'8px'}}>
            <Text style={{fontSize:'14px',color:'#666'}}>用户名</Text>
            <Text style={{fontSize:'14px',color:'#222',fontWeight:500}}>{userInfo?.username || '--'}</Text>
          </View>
        </View>

        <View style={{marginBottom:'16px'}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:'8px'}}>
            <Text style={{fontSize:'14px',color:'#666'}}>手机号码</Text>
            <Text style={{fontSize:'14px',color:'#222',fontWeight:500}}>{formatPhone(userInfo?.primaryPhone)}</Text>
          </View>
        </View>

        <View style={{marginBottom:'16px'}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:'8px'}}>
            <Text style={{fontSize:'14px',color:'#666'}}>邮箱</Text>
            <Text style={{fontSize:'14px',color:'#222',fontWeight:500}}>{userInfo?.primaryEmail || '--'}</Text>
          </View>
        </View>
      </View>

      {/* 登录管理卡片 */}
      <View style={{background:'#fff',borderRadius:'12px',padding:'20px',marginBottom:'20px'}}>
        <View style={{borderBottom:'1px solid #ededed',paddingBottom:'16px',marginBottom:'16px'}}>
          <Text style={{fontSize:'18px',fontWeight:600,color:'#222'}}>登录管理</Text>
        </View>
        
        <View style={{marginBottom:'16px'}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:'8px'}}>
            <Text style={{fontSize:'14px',color:'#666'}}>注册时间</Text>
            <Text style={{fontSize:'14px',color:'#222',fontWeight:500}}>{formatDate(userInfo?.createdAt)}</Text>
          </View>
        </View>

        <View style={{marginBottom:'16px'}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:'8px'}}>
            <Text style={{fontSize:'14px',color:'#666'}}>最近修改时间</Text>
            <Text style={{fontSize:'14px',color:'#222',fontWeight:500}}>{formatDate(userInfo?.updatedAt)}</Text>
          </View>
        </View>

        <View style={{marginBottom:'16px'}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:'8px'}}>
            <Text style={{fontSize:'14px',color:'#666'}}>最近登录时间</Text>
            <Text style={{fontSize:'14px',color:'#222',fontWeight:500}}>{formatDate(userInfo?.lastSignInAt)}</Text>
          </View>
        </View>
      </View>

      {/* 退出登录按钮 */}
      <View style={{padding:'20px 0'}}>
        <AtButton 
          type='primary' 
          onClick={handleLogout}
          customStyle={{background:'#1B9AEE'}}
        >
          退出登录
        </AtButton>
      </View>
    </View>
  )
}
