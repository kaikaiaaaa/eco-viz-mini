import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import type { CSSProperties } from 'react'
import { View, Text, Image, Input, Picker } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtList, AtActivityIndicator, AtMessage } from 'taro-ui'
import Taro from '@tarojs/taro'
import api from '../../utils/api'
import { navigateToWebViewLoginSimple, getAuthHeaders } from '../../utils/auth'
import 'taro-ui/dist/style/index.scss'
import './index.scss'

// 导入设备图标
const iconSq = require('../../assets/images/icon-sq.png')
const iconQx = require('../../assets/images/icon-qx.png')
const iconZhishang = require('../../assets/images/icon-zhishang.png')
const iconTianqiqxz = require('../../assets/images/icon-tianqiqxz.png')
// 导入搜索图标
const iconSearch = require('../../assets/images/icon-search.png')
const iconDown = require('../../assets/images/icon-down.png')

// 设备图标列表
const deviceIconList = [
  { connectorIdentifier: 'huayi', deviceType: '1', icon: iconSq },
  { connectorIdentifier: 'huayi', deviceType: '2', icon: iconQx },
  { connectorIdentifier: 'ecois', deviceType: '1', icon: iconZhishang },
  { connectorIdentifier: 'ecois', deviceType: '2', icon: iconTianqiqxz },
]

const deviceStatusList = [
  { label: '在线', value: 'Online', color: '#52c41a' },
  { label: '离线', value: 'Offline', color: '#F1AE55' }
]

// 获取设备图标
const getDeviceIcon = (connectorIdentifier: string, deviceType: string) => {
  const icon = deviceIconList.find(
    (item: any) => item.connectorIdentifier === connectorIdentifier && item.deviceType === deviceType
  )
  return icon ? icon.icon : null
}

const getDeviceStatusInfo = (statusCode?: string | null): { label: string; color: string } | null => {
  if (!statusCode) {
    return null
  }
  const status = deviceStatusList.find(item => item.value === statusCode)
  return status || { label: '未知', color: '#fa607e' }
}

const appendSuffix = (value: string, suffix: string) => {
  if (!value) {
    return value
  }
  return value.endsWith(suffix) ? value : `${value}${suffix}`
}

// 格式化相对时间
const formatRelativeTime = (timestamp: string | null) => {
  if (!timestamp) {
    return '从未上报'
  }
  try {
    const deviceLastUpdate = new Date(timestamp)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - deviceLastUpdate.getTime()) / 1000 / 60)

    if (diffMinutes < 1) {
      return '刚刚'
    } else if (diffMinutes < 60) {
      return `${diffMinutes}分钟前`
    } else if (diffMinutes < 1440) { // 24小时
      const diffHours = Math.floor(diffMinutes / 60)
      return `${diffHours}小时前`
    } else {
      const diffDays = Math.floor(diffMinutes / 1440)
      return `${diffDays}天前`
    }
  } catch (error) {
    return '从未上报'
  }
}

// 格式化地理位置
const formatLocation = (item: any) => {
  const segments: Array<string> = []
  if (item.province) {
    segments.push(appendSuffix(item.province, '省'))
  }
  if (item.city) {
    segments.push(appendSuffix(item.city, '市'))
  }
  if (item.district) {
    segments.push(item.district)
  }

  if (segments.length > 0) {
    return segments.join('')
  }

  return item.location || '--'
}

export default function HomePage() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [groupsLoading, setGroupsLoading] = useState(true)
  const [groups, setGroups] = useState<Array<{ id: number | string, name: string, count: number }>>([])
  const [tabIdx, setTabIdx] = useState(0)
  const [listsByGroup, setListsByGroup] = useState<Record<string, { list: Array<any>, page: number, hasMore: boolean, loading: boolean }>>({})
  const [searchValue, setSearchValue] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('') // 实际用于搜索的关键词
  const [deviceTypeFilter, setDeviceTypeFilter] = useState('all') // 设备类型筛选：all, 1, 2
  const [headerHeight, setHeaderHeight] = useState(0)
  const deviceTypeOptions = useMemo(() => ([
    { label: '全部设备', value: 'all' },
    { label: '墒情设备', value: '1' },
    { label: '气象设备', value: '2' }
  ]), [])
  
  // 使用ref来避免闭包陷阱，存储最新的状态值
  const searchKeywordRef = useRef('')
  const deviceTypeFilterRef = useRef('all')
  const listsByGroupRef = useRef<Record<string, { list: Array<any>, page: number, hasMore: boolean, loading: boolean }>>({})
  const initGroupsCalledRef = useRef(false)
  const searchReloadingRef = useRef(false) // 防止搜索重新加载的重复触发
  const prevSearchKeywordRef = useRef('') // 跟踪上一次的搜索关键词
  const prevDeviceTypeFilterRef = useRef('all') // 跟踪上一次的设备类型筛选
  const redirectingToLoginRef = useRef(false)

  const updateTabBarBadge = useCallback((count: number) => {
    try {
      if (count > 0) {
        Taro.setTabBarBadge({
          index: 1,
          text: count > 99 ? '99+' : String(count)
        })
      } else {
        Taro.removeTabBarBadge({ index: 1 })
      }
    } catch (error) {
      console.warn('更新消息角标失败:', error)
    }
  }, [])

  const refreshUnreadMessageBadge = useCallback(async () => {
    try {
      const resp: any = await api.getMessages({ page: 1, pageSize: 1, isRead: 'false' })
      if (resp?.code === 0) {
        const total = resp.data?.total ?? 0
        updateTabBarBadge(total)
      }
    } catch (error) {
      console.warn('获取未读消息数量失败:', error)
    }
  }, [updateTabBarBadge])
  
  // 同步ref和state
  useEffect(() => {
    searchKeywordRef.current = searchKeyword
  }, [searchKeyword])
  
  useEffect(() => {
    deviceTypeFilterRef.current = deviceTypeFilter
  }, [deviceTypeFilter])
  
  useEffect(() => {
    listsByGroupRef.current = listsByGroup
  }, [listsByGroup])

  useEffect(() => {
    loadUserInfo()
    refreshUnreadMessageBadge()
  }, [refreshUnreadMessageBadge])

  useEffect(() => {
    if (!loading) {
      Taro.nextTick(() => {
        const query = Taro.createSelectorQuery()
        query
          .select('.home-fixed-header')
          .boundingClientRect(rect => {
            const resolvedRect = Array.isArray(rect) ? rect?.[0] : rect
            if (resolvedRect && resolvedRect.height) {
              setHeaderHeight(resolvedRect.height)
            }
          })
          .exec()
      })
    }
  }, [loading])

  Taro.useDidShow(() => {
    refreshUnreadMessageBadge()
    loadUserInfo()
  })
  
  useEffect(() => {
    if (!loading && !initGroupsCalledRef.current) {
      initGroupsCalledRef.current = true
      initGroupsAndFirstPage()
    }
  }, [loading])

  const loadUserInfo = async () => {
    try {
      const accessToken = Taro.getStorageSync('logto_token')
      const loginTimestamp = Taro.getStorageSync('login_timestamp')
      const expiresIn = Taro.getStorageSync('token_expires_in')
      if (!accessToken || !loginTimestamp || !expiresIn) {
        if (!redirectingToLoginRef.current) {
          redirectingToLoginRef.current = true
          await navigateToWebViewLoginSimple()
        }
        return
      }
      const now = Date.now()
      const tokenAge = now - loginTimestamp
      const maxAge = expiresIn * 1000
      if (tokenAge > maxAge) {
        if (!redirectingToLoginRef.current) {
          redirectingToLoginRef.current = true
          await navigateToWebViewLoginSimple()
        }
        return
      }
      redirectingToLoginRef.current = false
      const cachedUser = Taro.getStorageSync('user_info')
      if (cachedUser) setUserInfo(cachedUser)
      setLoading(false)
      if (!cachedUser) {
        try {
          const meResp = await Taro.request({
            url: `${process.env.TARO_APP_BASE_API || ''}/api/me/data`,
            method: 'GET',
            header: getAuthHeaders()
          })
          if (meResp.statusCode === 200 && meResp.data && meResp.data.code === 0) {
            const data = meResp.data.data
            if (data?.user) {
              Taro.setStorageSync('user_info', data.user)
              setUserInfo(data.user)
            }
          }
        } catch (e) {}
      }
    } catch (error) {
      Taro.atMessage({ message: '登录信息获取失败', type: 'error' })
      setLoading(false)
    }
  }
  const initGroupsAndFirstPage = async () => {
    try {
      setGroupsLoading(true)
      console.log('[Home] 开始加载分组...')
      const resp: any = await api.getMiniGroups()
      console.log('[Home] 分组API响应:', resp)
      if (resp?.code === 0) {
        const list = resp.data?.groups || []
        console.log('[Home] 分组列表:', list)
        // 设置分组列表
        setGroups(list as any)
        if (list.length > 0) {
          setTabIdx(0)
          console.log('[Home] 开始加载第一个分组的设备...', list[0].id)
          // 直接加载第一个分组的数据，不检查缓存（首次加载应该总是刷新）
          await loadDevices(list[0].id, true)
          console.log('[Home] 第一个分组设备加载完成')
        }
      } else {
        console.warn('[Home] 分组API返回错误:', resp)
        setGroups([])
      }
    } catch (e) {
      console.error('[Home] 初始化分组失败:', e)
      setGroups([])
      Taro.atMessage({ message: '加载分组失败', type: 'error' })
    } finally {
      setGroupsLoading(false)
    }
  }
  const ensureGroupState = (gid: string | number) => {
    const key = String(gid)
    const currentLists = listsByGroupRef.current
    if (!currentLists[key]) {
      const newState = { list: [], page: 0, hasMore: true, loading: false }
      // 先更新ref，再更新state，确保同步
      listsByGroupRef.current = {
        ...currentLists,
        [key]: newState
      }
      setListsByGroup((prev) => ({
        ...prev,
        [key]: newState
      }))
    }
  }
  
  const loadDevices = useCallback(async (gid: string | number, refresh = false) => {
    const key = String(gid)
    console.log(`[Home] loadDevices 调用: groupId=${gid}, refresh=${refresh}`)
    ensureGroupState(gid)
    
    // 使用ref获取最新状态，避免闭包陷阱
    const currentLists = listsByGroupRef.current
    const cur = currentLists[key] || { list: [], page: 0, hasMore: true, loading: false }
    
    // 防止重复加载
    if (!refresh && (cur.loading || !cur.hasMore)) {
      console.log(`[Home] 跳过加载: loading=${cur.loading}, hasMore=${cur.hasMore}`)
      return Promise.resolve()
    }
    
    const nextPage = refresh ? 1 : (cur.page + 1)
    console.log(`[Home] 开始请求设备列表: page=${nextPage}`)
    
    // 更新loading状态
    setListsByGroup((prev) => {
      const updated = { ...prev, [key]: { ...cur, loading: true } }
      listsByGroupRef.current = updated
      return updated
    })
    
    try {
      const params: any = { groupId: gid, page: nextPage, pageSize: 20 }
      
      // 使用ref获取最新的搜索关键词和设备类型筛选
      const currentSearchKeyword = searchKeywordRef.current.trim()
      const currentDeviceTypeFilter = deviceTypeFilterRef.current
      
      if (currentSearchKeyword) {
        params.search = currentSearchKeyword
      }
      if (currentDeviceTypeFilter !== 'all') {
        params.devicetype = currentDeviceTypeFilter
      }
      
      const resp: any = await api.getMiniDevices(params)
      console.log(`[Home] 设备列表API响应:`, resp)
      if (resp?.code === 0) {
        const data = resp.data
        const merged = refresh ? data.list : cur.list.concat(data.list)
        console.log(`[Home] 设备列表加载成功: 总数=${merged.length}, 当前页=${data.page}, 是否有更多=${data.hasMore}`)
        setListsByGroup((prev) => {
          const updated = {
            ...prev,
            [key]: { list: merged, page: data.page, hasMore: data.hasMore, loading: false }
          }
          listsByGroupRef.current = updated
          return updated
        })
      } else {
        console.warn(`[Home] 设备列表API返回错误:`, resp)
        setListsByGroup((prev) => {
          const updated = { ...prev, [key]: { ...cur, loading: false } }
          listsByGroupRef.current = updated
          return updated
        })
      }
    } catch (e) {
      console.error(`[Home] 加载设备列表失败:`, e)
      setListsByGroup((prev) => {
        const updated = { ...prev, [key]: { ...cur, loading: false } }
        listsByGroupRef.current = updated
        return updated
      })
    }
  }, [])
  
  // 搜索防抖处理
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchKeyword(searchValue)
    }, 500) // 500ms 防抖
    return () => clearTimeout(timer)
  }, [searchValue])
  
  // 搜索关键词变化时重新加载（只在搜索关键词或筛选条件变化时触发）
  useEffect(() => {
    // 检查是否真的发生了变化（避免初始化时触发）
    const searchChanged = searchKeyword !== prevSearchKeywordRef.current
    const filterChanged = deviceTypeFilter !== prevDeviceTypeFilterRef.current
    
    if (!searchChanged && !filterChanged) {
      // 没有变化，不执行
      return
    }
    
    // 更新prevRef
    prevSearchKeywordRef.current = searchKeyword
    prevDeviceTypeFilterRef.current = deviceTypeFilter
    
    // 防止在groups或tabIdx变化时触发（这些变化由其他逻辑处理）
    // 需要等待loading完成且groups已初始化
    if (!loading && groups.length > 0 && tabIdx >= 0 && groups[tabIdx] && !searchReloadingRef.current) {
      searchReloadingRef.current = true
      const currentGroupId = groups[tabIdx].id
      
      // 重置当前分组的状态并重新加载
      const key = String(currentGroupId)
      setListsByGroup((prev) => {
        const updated = { ...prev }
        delete updated[key]
        listsByGroupRef.current = updated
        return updated
      })
      
      // 直接调用loadDevices，ensureGroupState会处理状态初始化
      loadDevices(currentGroupId, true)
        .then(() => {
          searchReloadingRef.current = false
        })
        .catch(() => {
          searchReloadingRef.current = false
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword, deviceTypeFilter]) // 只依赖搜索相关的状态
  const onTabChange = useCallback(async (idx: number) => {
    setTabIdx(idx)
    // 直接使用groups，因为useCallback会在groups变化时重新创建
    if (groups[idx]) {
      const gid = groups[idx].id
      // 切换tab时总是重新加载，确保应用当前的筛选条件（搜索关键词和设备类型）
      await loadDevices(gid, true)
    }
  }, [groups, loadDevices])
  
  const onPullDownRefresh = useCallback(async () => {
    const currentGroups = groups
    const currentTabIdx = tabIdx
    if (currentGroups[currentTabIdx]) {
      await loadDevices(currentGroups[currentTabIdx].id, true)
    }
    Taro.stopPullDownRefresh()
  }, [groups, tabIdx, loadDevices])
  
  const onReachBottom = useCallback(async () => {
    const currentGroups = groups
    const currentTabIdx = tabIdx
    if (currentGroups[currentTabIdx]) {
      await loadDevices(currentGroups[currentTabIdx].id, false)
    }
  }, [groups, tabIdx, loadDevices])
  
  // 注册下拉刷新和上拉加载（Taro hooks需要在组件顶层调用）
  // 使用useCallback确保回调函数稳定，避免重复注册导致的问题
  // @ts-ignore
  Taro.usePullDownRefresh(onPullDownRefresh)
  // @ts-ignore
  Taro.useReachBottom(onReachBottom)

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
  }
  
  const handleSearchClear = () => {
    setSearchValue('')
    setSearchKeyword('')
  }

  const handleDeviceTypeChange = (value: string) => {
    setDeviceTypeFilter(value)
    // 不需要手动重置，useEffect会自动处理
  }

  const handleDeviceTypePickerChange = (event: any) => {
    const index = Number(event?.detail?.value ?? 0)
    const selected = deviceTypeOptions[index]?.value || 'all'
    handleDeviceTypeChange(selected)
  }

  const currentDeviceTypeLabel = useMemo(() => {
    const found = deviceTypeOptions.find(option => option.value === deviceTypeFilter)
    return found ? found.label : '全部设备'
  }, [deviceTypeFilter, deviceTypeOptions])

  // 使用useMemo缓存tabList，避免每次渲染都重新计算（必须在条件返回之前）
  const tabList = useMemo(() => {
    return groups.map(g => ({
      title: `${g.name}${g.count !== undefined ? '(' + g.count + ')' : ''}`
    }))
  }, [groups])

  const tabsCustomStyle = useMemo(() => {
    return {
      '--home-tabs-offset': `${headerHeight}px`,
    } as CSSProperties
  }, [headerHeight])
  
  if (loading || groupsLoading) {
    return (
      <View className='home-loading'>
        <AtActivityIndicator mode='normal' size={40} content='加载中...' color='#1B9AEE' />
      </View>
    )
  }
  
  if (groups.length === 0) {
    return <View className='home-empty-groups'>暂无分组数据</View>
  }

  return (
    <View className='home-page'>
      <AtMessage />
      <View className='home-fixed-header'>
        <View className='home-search-row'>
          <View className='home-search-bar'>
            <Image
              src={iconSearch}
              className='home-search-icon'
              mode='aspectFit'
            />
            <Input
              type='text'
              value={searchValue}
              onInput={(e: any) => handleSearchChange(e.detail.value)}
              placeholder='搜索设备名称或编号'
              placeholderStyle='color:#999'
              className='home-search-input'
            />
            {searchValue && (
              <Text
                onClick={handleSearchClear}
                className='home-search-clear'
              >✕</Text>
            )}
          </View>

          <Picker
            mode='selector'
            range={deviceTypeOptions.map(option => option.label)}
            value={deviceTypeFilter === 'all' ? 0 : deviceTypeFilter === '1' ? 1 : 2}
            onChange={handleDeviceTypePickerChange}
          >
            <View className='home-filter-select'>
              <Text className='home-filter-select-label'>{currentDeviceTypeLabel}</Text>
              <Image
                src={iconDown}
                className='home-filter-select-arrow'
                mode='aspectFit'
              />
            </View>
          </Picker>
        </View>
      </View>
      <View className='home-tabs-wrapper'>
        <AtTabs
          className='home-tabs'
          current={tabIdx}
          tabList={tabList}
          onClick={onTabChange}
          height='44'
          swipeable={true}
          animated
          tabDirection='horizontal'
          customStyle={tabsCustomStyle}
        >
          {groups.map((group, idx) => {
            const paneKey = String(group.id)
            const paneState = listsByGroup[paneKey] || { list: [], loading: false, hasMore: true, page: 0 }
            return (
              <AtTabsPane current={tabIdx} index={idx} key={group.id} customStyle={{ padding: 0 }}>
                {paneState.loading && paneState.list.length === 0 ? (
                  <View className='home-pane-loading'>
                    <AtActivityIndicator mode='normal' size={40} content='加载设备列表...' color='#1B9AEE' />
                  </View>
                ) : paneState.list.length === 0 ? (
                  <View className='empty'>暂无 {group.name} 设备</View>
                ) : (
                  <AtList hasBorder={false}>
                    {paneState.list.map((item: any) => {
                      const deviceIcon = getDeviceIcon(item.connectorIdentifier || '', item.deviceType || '')
                      const location = formatLocation(item)
                      const lastUpdateTime = formatRelativeTime(item.lastUpdate)
                      const statusInfo = getDeviceStatusInfo(item.status)
                      return (
                        <View
                          key={item.id}
                          onClick={() => {
                            Taro.navigateTo({
                              url: `/pages/device-detail/index?id=${item.id}`
                            })
                          }}
                          className='home-device-item'
                        >
                          <View className='home-device-icon-wrapper'>
                            {deviceIcon && (
                              <Image
                                src={deviceIcon}
                                className='home-device-icon'
                                mode='aspectFit'
                              />
                            )}
                            {statusInfo && (
                              <Text
                                className='home-device-status-badge'
                                style={{ backgroundColor: statusInfo.color }}
                              >
                                {statusInfo.label}
                              </Text>
                            )}
                          </View>
                          <View className='home-device-info'>
                            <View>
                              <Text className='home-device-name'>
                                {item.name || item.sn}
                              </Text>
                              <Text className='home-device-sn'>
                                No.{item.sn}
                              </Text>
                            </View>
                            <Text className='home-device-location'>
                              {location}
                            </Text>
                            <Text className='home-device-update'>
                              {lastUpdateTime ? `${lastUpdateTime}上报` : '从未上报'}
                            </Text>
                          </View>
                          <Text className='home-device-arrow'>›</Text>
                        </View>
                      )
                    })}
                  </AtList>
                )}
                {paneState.loading && paneState.list.length !== 0 && (
                  <View className='home-load-more'>
                    <AtActivityIndicator content='加载更多...' size={26} color='#3192ff' />
                  </View>
                )}
                {!paneState.hasMore && paneState.list.length > 0 && (
                  <View className='home-no-more'>没有更多了</View>
                )}
              </AtTabsPane>
            )
          })}
        </AtTabs>
      </View>
    </View>
  )
}

