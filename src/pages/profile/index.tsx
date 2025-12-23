import React, { useState, useEffect } from 'react'
import { View, Text, Button, Input } from '@tarojs/components'
import { AtButton, AtMessage, AtActivityIndicator } from 'taro-ui'
import Taro from '@tarojs/taro'
import { clearLoginData, navigateToWebViewLoginSimple } from '../../utils/auth'
import api from '../../utils/api'
import 'taro-ui/dist/style/index.scss'
import './index.scss'

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
  const [editVisible, setEditVisible] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [passwordSubmitting, setPasswordSubmitting] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    primaryEmail: '',
    primaryPhone: ''
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    Taro.setNavigationBarTitle({ title: '我的' })
    loadUserInfo()
  }, [])

  const loadUserInfo = async () => {
    try {
      const cachedUser = Taro.getStorageSync('user_info')
      if (cachedUser) {
        setUserInfo(cachedUser)
        setLoading(false)
        refreshUserInfo()
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

  const refreshUserInfo = async () => {
    try {
      const response: any = await api.getUserInfo()
      if (response.code === 0 && response.data?.user) {
        setUserInfo(response.data.user)
        Taro.setStorageSync('user_info', response.data.user)
      }
    } catch (error) {
      console.error('刷新用户信息失败:', error)
    }
  }

  Taro.useDidShow(() => {
    refreshUserInfo()
  })

  const openEditModal = () => {
    if (userInfo) {
      setEditForm({
        name: userInfo.name || '',
        username: userInfo.username || '',
        primaryEmail: userInfo.primaryEmail || '',
        primaryPhone: userInfo.primaryPhone ? userInfo.primaryPhone.replace(/^86/, '') : ''
      })
    }
    setEditVisible(true)
  }

  const closeEditModal = () => {
    setEditVisible(false)
  }

  const handleEditChange = (field: keyof typeof editForm, value: string | number) => {
    setEditForm(prev => ({
      ...prev,
      [field]: typeof value === 'number' ? String(value) : value
    }))
  }

  const submitEditForm = async () => {
    if (editSubmitting) return
    if (!editForm.username && !editForm.primaryEmail && !editForm.primaryPhone) {
      Taro.showToast({ title: '用户名、邮箱或手机号至少填写一项', icon: 'none' })
      return
    }

    const payload: Record<string, string> = {}
    if (editForm.username) payload.username = editForm.username.trim()
    if (editForm.primaryEmail) payload.primaryEmail = editForm.primaryEmail.trim()
    if (editForm.primaryPhone) payload.primaryPhone = editForm.primaryPhone.trim()
    if (editForm.name) payload.name = editForm.name.trim()

    if (payload.primaryEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.primaryEmail)) {
      Taro.showToast({ title: '邮箱格式不正确', icon: 'none' })
      return
    }

    if (payload.primaryPhone && !/^\d{6,}$/.test(payload.primaryPhone)) {
      Taro.showToast({ title: '手机号格式不正确', icon: 'none' })
      return
    }

    setEditSubmitting(true)
    try {
      const resp: any = await api.updateProfile(payload)
      if (resp?.code === 0) {
        Taro.showToast({ title: '信息更新成功', icon: 'success' })
        closeEditModal()
        await refreshUserInfo()
      } else {
        Taro.showToast({ title: resp?.message || '更新失败', icon: 'none' })
      }
    } catch (error) {
      console.error('更新个人信息失败:', error)
      Taro.showToast({ title: '更新失败，请稍后重试', icon: 'none' })
    } finally {
      setEditSubmitting(false)
    }
  }

  const openPasswordModal = () => {
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setPasswordVisible(true)
  }

  const closePasswordModal = () => {
    setPasswordVisible(false)
  }

  const handlePasswordChange = (field: keyof typeof passwordForm, value: string | number) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: typeof value === 'number' ? String(value) : value
    }))
  }

  const submitPasswordForm = async () => {
    if (passwordSubmitting) return
    if (!passwordForm.currentPassword) {
      Taro.showToast({ title: '请输入当前密码', icon: 'none' })
      return
    }

    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      Taro.showToast({ title: '新密码至少6位', icon: 'none' })
      return
    }

    if (passwordForm.newPassword === passwordForm.currentPassword) {
      Taro.showToast({ title: '新密码不能与当前密码相同', icon: 'none' })
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Taro.showToast({ title: '两次输入的新密码不一致', icon: 'none' })
      return
    }

    setPasswordSubmitting(true)
    try {
      const resp: any = await api.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      if (resp?.code === 0) {
        Taro.showToast({ title: '密码修改成功，请重新登录', icon: 'success' })
        closePasswordModal()
        clearLoginData()
        setTimeout(() => {
          navigateToWebViewLoginSimple()
        }, 800)
      } else {
        Taro.showToast({ title: resp?.message || '修改失败', icon: 'none' })
      }
    } catch (error) {
      console.error('修改密码失败:', error)
      Taro.showToast({ title: '修改失败，请稍后重试', icon: 'none' })
    } finally {
      setPasswordSubmitting(false)
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
            navigateToWebViewLoginSimple()
          }, 300)
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

  const basicInfo = [
    { label: '姓名/昵称', value: userInfo?.name || '--' },
    { label: '用户名', value: userInfo?.username || '--' },
    { label: '手机号码', value: formatPhone(userInfo?.primaryPhone) },
    { label: '邮箱', value: userInfo?.primaryEmail || '--' }
  ]

  if (loading) {
    return (
      <View className='profile-loading'>
        <AtActivityIndicator mode='center' isOpened={loading}></AtActivityIndicator>
      </View>
    )
  }

  return (
    <View className='profile-page'>
      <AtMessage />

      <View className='profile-card'>
        <Text className='profile-card-title'>基本信息</Text>
        <View className='profile-info-list'>
          {basicInfo.map((item) => (
            <View className='profile-info-row' key={item.label}>
              <Text className='profile-info-label'>{item.label}</Text>
              <Text className='profile-info-value'>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className='profile-action-card'>
        <Text className='profile-card-title'>账户操作</Text>
        <View className='profile-action-list'>
          <View className='profile-action-item' onClick={openEditModal}>
            <View className='profile-action-text'>
              <Text className='profile-action-title'>编辑信息</Text>
              <Text className='profile-action-desc'>修改昵称、邮箱或联系方式</Text>
            </View>
            <Text className='profile-action-arrow'>›</Text>
          </View>
          <View className='profile-action-item' onClick={openPasswordModal}>
            <View className='profile-action-text'>
              <Text className='profile-action-title'>修改密码</Text>
              <Text className='profile-action-desc'>更新账号密码以提升安全性</Text>
            </View>
            <Text className='profile-action-arrow'>›</Text>
          </View>
        </View>
      </View>

      <View className='profile-footer'>
        <AtButton 
          type='primary' 
          onClick={handleLogout}
          className='profile-logout-button'
        >
          退出登录
        </AtButton>
      </View>
      {editVisible && (
        <View className='profile-popup-mask' onClick={closeEditModal} catchMove={true}>
          <View className='profile-popup' onClick={(e) => e.stopPropagation()}>
            <View className='profile-popup-header'>
              <Text className='profile-popup-title'>编辑个人信息</Text>
              <Text className='profile-popup-close' onClick={closeEditModal}>×</Text>
            </View>
            <View className='profile-popup-body'>
              <View className='profile-field'>
                <Text className='profile-field-label'>昵称</Text>
                <View className='profile-field-input'>
                  <Input
                    className='profile-field-native'
                    type='text'
                    value={editForm.name}
                    onInput={(e) => handleEditChange('name', e.detail.value)}
                    placeholder='请输入昵称'
                  />
                </View>
              </View>
              <View className='profile-field'>
                <Text className='profile-field-label'>用户名</Text>
                <View className='profile-field-input'>
                  <Input
                    className='profile-field-native'
                    type='text'
                    value={editForm.username}
                    onInput={(e) => handleEditChange('username', e.detail.value)}
                    placeholder='请输入用户名'
                  />
                </View>
              </View>
              <View className='profile-field'>
                <Text className='profile-field-label'>邮箱</Text>
                <View className='profile-field-input'>
                  <Input
                    className='profile-field-native'
                    type='text'
                    value={editForm.primaryEmail}
                    onInput={(e) => handleEditChange('primaryEmail', e.detail.value)}
                    placeholder='请输入邮箱地址'
                  />
                </View>
              </View>
              <View className='profile-field'>
                <Text className='profile-field-label'>手机号码</Text>
                <View className='profile-field-input'>
                  <Input
                    className='profile-field-native'
                    type='number'
                    value={editForm.primaryPhone}
                    onInput={(e) => handleEditChange('primaryPhone', e.detail.value)}
                    placeholder='请输入手机号码'
                  />
                </View>
              </View>
              <View className='profile-modal-tip'>用户名、邮箱或手机号至少填写一项</View>
            </View>
            <View className='profile-popup-actions'>
              <Text className='profile-popup-btn' onClick={closeEditModal}>取消</Text>
              <Text className='profile-popup-btn primary' onClick={submitEditForm}>
                {editSubmitting ? '更新中...' : '保存'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {passwordVisible && (
        <View className='profile-popup-mask' onClick={closePasswordModal} catchMove={true}>
          <View className='profile-popup' onClick={(e) => e.stopPropagation()}>
            <View className='profile-popup-header'>
              <Text className='profile-popup-title'>修改密码</Text>
              <Text className='profile-popup-close' onClick={closePasswordModal}>×</Text>
            </View>
            <View className='profile-popup-body'>
              <View className='profile-field'>
                <Text className='profile-field-label'>当前密码</Text>
                <View className='profile-field-input'>
                  <Input
                    className='profile-field-native'
                    type='text'
                    password
                    value={passwordForm.currentPassword}
                    onInput={(e) => handlePasswordChange('currentPassword', e.detail.value)}
                    placeholder='请输入当前密码'
                  />
                </View>
              </View>
              <View className='profile-field'>
                <Text className='profile-field-label'>新密码</Text>
                <View className='profile-field-input'>
                  <Input
                    className='profile-field-native'
                    type='text'
                    password
                    value={passwordForm.newPassword}
                    onInput={(e) => handlePasswordChange('newPassword', e.detail.value)}
                    placeholder='至少6位，区分大小写'
                  />
                </View>
              </View>
              <View className='profile-field'>
                <Text className='profile-field-label'>确认新密码</Text>
                <View className='profile-field-input'>
                  <Input
                    className='profile-field-native'
                    type='text'
                    password
                    value={passwordForm.confirmPassword}
                    onInput={(e) => handlePasswordChange('confirmPassword', e.detail.value)}
                    placeholder='再次输入新密码'
                  />
                </View>
              </View>
            </View>
            <View className='profile-popup-actions'>
              <Text className='profile-popup-btn' onClick={closePasswordModal}>取消</Text>
              <Text className='profile-popup-btn primary' onClick={submitPasswordForm}>
                {passwordSubmitting ? '修改中...' : '确认修改'}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
