import React, { useState, useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtActivityIndicator, AtMessage } from 'taro-ui'
import Taro from '@tarojs/taro'
import api from '../../utils/api'
import dayjs from 'dayjs'
import 'taro-ui/dist/style/index.scss'
import './index.scss'
const emptyIcon = require('../../assets/images/icon-empty.png')

interface MessageItem {
  id: number
  deviceId?: number | null
  deviceSn: string
  deviceName: string
  parameter: string
  parameterName: string
  parameterUnit: string
  thresholdType: 'lower' | 'upper'
  currentValue: number
  thresholdValue: number
  node: string | null
  message: string
  isRead: boolean
  alarmDate: string
  createdAt: string
}

export default function MessagePage() {
  const [loading, setLoading] = useState(true)
  const [initialLoading, setInitialLoading] = useState(true)
  const [tabIdx, setTabIdx] = useState(0) // 0: 全部, 1: 未读, 2: 已读
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const updateTabBarBadge = (count: number) => {
    try {
      if (count > 0) {
        Taro.setTabBarBadge({
          index: 1,
          text: count > 99 ? '99+' : String(count)
        })
      } else {
        Taro.removeTabBarBadge({ index: 1 })
      }
    } catch (e) {
      console.warn('更新消息角标失败:', e)
    }
  }

  useEffect(() => {
    loadMessages(1, true)
  }, [tabIdx])

  Taro.useDidShow(() => {
    loadMessages(1, true)
  })

  const loadMessages = async (pageNum: number, refresh = false) => {
    try {
      if (refresh) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }

      const isReadParam = tabIdx === 1 ? 'false' : tabIdx === 2 ? 'true' : undefined
      const resp: any = await api.getMessages({
        page: pageNum,
        pageSize: 20,
        isRead: isReadParam as 'true' | 'false' | undefined
      })

      if (resp?.code === 0) {
        const data = resp.data
        const list = (data.list || []) as Array<MessageItem>
        if (refresh) {
          setMessages(list)
          const unreadCount = list.filter(item => !item.isRead).length
          updateTabBarBadge(unreadCount)
        } else {
          setMessages(prev => {
            const combined = [...prev, ...list]
            const unreadCount = combined.filter(item => !item.isRead).length
            updateTabBarBadge(unreadCount)
            return combined
          })
        }
        setPage(pageNum)
        setHasMore(data.hasMore || false)
      } else {
        Taro.atMessage({ message: resp.message || '获取消息列表失败', type: 'error' })
      }
    } catch (e: any) {
      console.error('加载消息失败:', e)
      Taro.atMessage({ message: e.message || '获取消息列表失败', type: 'error' })
    } finally {
      setLoading(false)
      setLoadingMore(false)
      if (refresh) {
        setInitialLoading(false)
      }
    }
  }

  const handleTabChange = (idx: number) => {
    setTabIdx(idx)
    setMessages([])
    setPage(1)
    setHasMore(true)
  }

  const handleMarkRead = async (messageId: number) => {
    try {
      const resp: any = await api.markMessageRead(messageId)
      if (resp?.code === 0) {
        // 更新本地状态
        setMessages(prev => {
          const next = prev.map(msg =>
            msg.id === messageId ? { ...msg, isRead: true } : msg
          )
          const unread = next.filter(item => !item.isRead).length
          updateTabBarBadge(unread)
          return next
        })
        Taro.atMessage({ message: '已标记为已读', type: 'success' })
      } else {
        Taro.atMessage({ message: resp.message || '操作失败', type: 'error' })
      }
    } catch (e: any) {
      console.error('标记已读失败:', e)
      Taro.atMessage({ message: e.message || '操作失败', type: 'error' })
    }
  }

  const handleDelete = async (messageId: number) => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这条消息吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            const resp: any = await api.deleteMessage(messageId)
            if (resp?.code === 0) {
              setMessages(prev => {
                const next = prev.filter(msg => msg.id !== messageId)
                const unread = next.filter(item => !item.isRead).length
                updateTabBarBadge(unread)
                return next
              })
              Taro.atMessage({ message: '删除成功', type: 'success' })
            } else {
              Taro.atMessage({ message: resp.message || '删除失败', type: 'error' })
            }
          } catch (e: any) {
            console.error('删除消息失败:', e)
            Taro.atMessage({ message: e.message || '删除失败', type: 'error' })
          }
        }
      }
    })
  }

  const onReachBottom = () => {
    if (!loadingMore && hasMore) {
      loadMessages(page + 1, false)
    }
  }

  // @ts-ignore
  Taro.useReachBottom(onReachBottom)

  const formatTime = (timestamp: string) => {
    try {
      return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
    } catch {
      return timestamp
    }
  }

  const getThresholdTypeText = (type: 'lower' | 'upper') => {
    return type === 'lower' ? '低于下限' : '超过上限'
  }

  const getNodeText = (node: string | null) => {
    if (!node) return ''
    return node === '0' ? '节点地表' : `节点${node}cm`
  }

  const handleNavigateToDevice = (message: MessageItem) => {
    if (!message.deviceId) {
      Taro.atMessage({ message: '未找到该设备详情', type: 'warning' })
      return
    }

    Taro.navigateTo({
      url: `/pages/device-detail/index?id=${message.deviceId}`
    })
  }

  if (loading && initialLoading) {
    return (
      <View className='message-loading'>
        <AtActivityIndicator mode='normal' size={40} content='加载中...' color='#1B9AEE' />
      </View>
    )
  }

  const unreadCount = messages.filter(m => !m.isRead).length

  return (
    <View className='message-page'>
      <AtMessage />

      <AtTabs
        current={tabIdx}
        tabList={[
          { title: '全部' },
          { title: '未读' },
          { title: '已读' }
        ]}
        onClick={handleTabChange}
        height='44'
        swipeable={true}
        animated
        tabDirection='horizontal'
        customStyle={{fontSize:'18px'}}
      >
        {/* 全部消息 */}
        <AtTabsPane current={tabIdx} index={0}>
          <MessageList
            messages={messages}
            loading={loading}
            onMarkRead={handleMarkRead}
            onDelete={handleDelete}
            formatTime={formatTime}
            getThresholdTypeText={getThresholdTypeText}
            getNodeText={getNodeText}
            onNavigate={handleNavigateToDevice}
          />
          {loadingMore && hasMore && (
            <View style={{display:'flex',justifyContent:'center',padding:'16px 0'}}>
              <AtActivityIndicator content='加载更多...' size={26} color='#3192ff' />
            </View>
          )}
          {!hasMore && !loadingMore && messages.length > 0 && (
            <View style={{textAlign:'center',fontSize:'14px',color:'#aaa',margin:'20px 0'}}>没有更多了</View>
          )}
        </AtTabsPane>

        {/* 未读消息 */}
        <AtTabsPane current={tabIdx} index={1}>
          <MessageList
            messages={messages.filter(m => !m.isRead)}
            loading={loading}
            onMarkRead={handleMarkRead}
            onDelete={handleDelete}
            formatTime={formatTime}
            getThresholdTypeText={getThresholdTypeText}
            getNodeText={getNodeText}
            onNavigate={handleNavigateToDevice}
          />
          {loadingMore && hasMore && (
            <View style={{display:'flex',justifyContent:'center',padding:'16px 0'}}>
              <AtActivityIndicator content='加载更多...' size={26} color='#3192ff' />
            </View>
          )}
          {!hasMore && !loadingMore && messages.filter(m => !m.isRead).length > 0 && (
            <View style={{textAlign:'center',fontSize:'14px',color:'#aaa',margin:'20px 0'}}>没有更多了</View>
          )}
        </AtTabsPane>

        {/* 已读消息 */}
        <AtTabsPane current={tabIdx} index={2}>
          <MessageList
            messages={messages.filter(m => m.isRead)}
            loading={loading}
            onMarkRead={handleMarkRead}
            onDelete={handleDelete}
            formatTime={formatTime}
            getThresholdTypeText={getThresholdTypeText}
            getNodeText={getNodeText}
            onNavigate={handleNavigateToDevice}
          />
          {loadingMore && hasMore && (
            <View style={{display:'flex',justifyContent:'center',padding:'16px 0'}}>
              <AtActivityIndicator content='加载更多...' size={26} color='#3192ff' />
            </View>
          )}
          {!hasMore && !loadingMore && messages.filter(m => m.isRead).length > 0 && (
            <View style={{textAlign:'center',fontSize:'14px',color:'#aaa',margin:'20px 0'}}>没有更多了</View>
          )}
        </AtTabsPane>
      </AtTabs>
    </View>
  )
}

// 消息列表组件
function MessageList({
  messages,
  loading,
  onMarkRead,
  onDelete,
  formatTime,
  getThresholdTypeText,
  getNodeText,
  onNavigate
}: {
  messages: MessageItem[]
  loading: boolean
  onMarkRead: (id: number) => void
  onDelete: (id: number) => void
  formatTime: (time: string) => string
  getThresholdTypeText: (type: 'lower' | 'upper') => string
  getNodeText: (node: string | null) => string
  onNavigate: (message: MessageItem) => void
}) {
  if (loading) {
    return (
      <View className='message-pane-loading'>
        <AtActivityIndicator mode='normal' size={32} content='加载中...' color='#1B9AEE' />
      </View>
    )
  }

  if (messages.length === 0) {
    return (
      <View className='message-empty'>
        <Image src={emptyIcon} className='message-empty-icon' mode='aspectFit' />
        <Text className='message-empty-text'>暂无消息</Text>
      </View>
    )
  }

  return (
    <View>
      {messages.map((msg) => (
        <View
          key={msg.id}
          style={{
            margin:'12px 16px',
            borderRadius:'12px',
            padding:'16px',
            boxShadow:'0 2px 8px rgba(0,0,0,0.08)',
            borderLeft:`4px solid ${msg.isRead ? '#ddd' : '#ff4444'}`,
            background:'#fff'
          }}
          onClick={() => onNavigate(msg)}
        >
          {/* 消息头部 */}
          <View style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}}>
            <View style={{flex:1}}>
              <View style={{display:'flex',alignItems:'center',marginBottom:'4px'}}>
                <Text style={{fontSize:'16px',fontWeight:600,color:'#222',marginRight:'8px'}}>
                  {msg.deviceName}
                </Text>
                {!msg.isRead && (
                  <View style={{
                    width:'8px',
                    height:'8px',
                    borderRadius:'4px',
                    background:'#ff4444'
                  }}></View>
                )}
              </View>
              <View style={{display:'flex',flexDirection:'column',gap:'2px'}}>
                <Text style={{fontSize:'12px',color:'#999'}}>SN：{msg.deviceSn}</Text>
                <Text style={{fontSize:'12px',color:'#bbb'}}>{formatTime(msg.createdAt)}</Text>
              </View>
            </View>
          </View>

          {/* 消息内容 */}
          <View style={{marginBottom:'12px'}}>
            <Text style={{fontSize:'14px',color:'#666',lineHeight:'1.6'}}>
              {msg.message || `${msg.parameterName}${getNodeText(msg.node)}${getThresholdTypeText(msg.thresholdType)}阈值报警！当前值：${msg.currentValue.toFixed(2)}${msg.parameterUnit ? ' ' + msg.parameterUnit : ''}，${msg.thresholdType === 'lower' ? '下限' : '上限'}阈值：${msg.thresholdValue.toFixed(2)}${msg.parameterUnit ? ' ' + msg.parameterUnit : ''}`}
            </Text>
          </View>

          {/* 操作按钮 */}
          <View style={{display:'flex',gap:'8px',justifyContent:'flex-end',paddingTop:'12px',borderTop:'1px solid #f0f0f0'}}>
            {!msg.isRead && (
              <Text
                onClick={(e: any) => {
                  e.stopPropagation()
                  onMarkRead(msg.id)
                }}
                style={{
                  fontSize:'13px',
                  color:'#1B9AEE',
                  padding:'4px 12px',
                  borderRadius:'4px',
                  background:'#f0f7ff',
                  cursor:'pointer'
                }}
              >
                标记已读
              </Text>
            )}
            <Text
              onClick={(e: any) => {
                e.stopPropagation()
                onDelete(msg.id)
              }}
              style={{
                fontSize:'13px',
                color:'#ff4444',
                padding:'4px 12px',
                borderRadius:'4px',
                background:'#fff5f5',
                cursor:'pointer'
              }}
            >
              删除
            </Text>
          </View>
        </View>
      ))}
  </View>
  )
}
