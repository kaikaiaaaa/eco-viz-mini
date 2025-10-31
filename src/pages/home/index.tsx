import React, { useState, useEffect } from 'react'
import { View, Text, Image, Input } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtList, AtListItem, AtActivityIndicator, AtMessage, AtSegmentedControl } from 'taro-ui'
import Taro from '@tarojs/taro'
import api from '../../utils/api'
import { navigateToWebViewLoginSimple, getAuthHeaders } from '../../utils/auth'
import 'taro-ui/dist/style/index.scss'
import './index.scss'

let redirectingToLogin = false

// 导入设备图标
const iconSq = require('../../assets/images/icon-sq.png')
const iconQx = require('../../assets/images/icon-qx.png')
const iconZhishang = require('../../assets/images/icon-zhishang.png')
const iconTianqiqxz = require('../../assets/images/icon-tianqiqxz.png')
// 导入搜索图标
const iconSearch = require('../../assets/images/icon-search.png')

// 设备图标列表
const deviceIconList = [
  { connectorIdentifier: 'huayi', deviceType: '1', icon: iconSq },
  { connectorIdentifier: 'huayi', deviceType: '2', icon: iconQx },
  { connectorIdentifier: 'ecois', deviceType: '1', icon: iconZhishang },
  { connectorIdentifier: 'ecois', deviceType: '2', icon: iconTianqiqxz },
]

// 获取设备图标
const getDeviceIcon = (connectorIdentifier: string, deviceType: string) => {
  const icon = deviceIconList.find(
    (item: any) => item.connectorIdentifier === connectorIdentifier && item.deviceType === deviceType
  )
  return icon ? icon.icon : null
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
  if (item.province && item.city && item.district) {
    return `${item.province}省${item.city}市${item.district}区`
  } else if (item.country && item.province && item.city) {
    return `${item.country}${item.province}省${item.city}市`
  }
  return item.location || '--'
}

export default function HomePage() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [groups, setGroups] = useState<Array<{ id: number | string, name: string, count: number }>>([])
  const [tabIdx, setTabIdx] = useState(0)
  const [listsByGroup, setListsByGroup] = useState<Record<string, { list: Array<any>, page: number, hasMore: boolean, loading: boolean }>>({})
  const [searchValue, setSearchValue] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('') // 实际用于搜索的关键词
  const [deviceTypeFilter, setDeviceTypeFilter] = useState('all') // 设备类型筛选：all, 1, 2

  useEffect(() => {
    loadUserInfo()
  }, [])
  useEffect(() => {
    if (!loading) {
      initGroupsAndFirstPage()
    }
  }, [loading])

  const loadUserInfo = async () => {
    try {
      const accessToken = Taro.getStorageSync('logto_token')
      const loginTimestamp = Taro.getStorageSync('login_timestamp')
      const expiresIn = Taro.getStorageSync('token_expires_in')
      if (!accessToken || !loginTimestamp || !expiresIn) {
        if (!redirectingToLogin) {
          redirectingToLogin = true
          await navigateToWebViewLoginSimple()
        }
        return
      }
      const now = Date.now()
      const tokenAge = now - loginTimestamp
      const maxAge = expiresIn * 1000
      if (tokenAge > maxAge) {
        if (!redirectingToLogin) {
          redirectingToLogin = true
          await navigateToWebViewLoginSimple()
        }
        return
      }
      redirectingToLogin = false
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
      const resp: any = await api.getMiniGroups()
      if (resp?.code === 0) {
        const list = resp.data?.groups || []
        // 去掉"全部"选项
        setGroups(list as any)
        if (list.length > 0 && !listsByGroup[String(list[0].id)]) {
          setTabIdx(0)
          await loadDevices(list[0].id, true)
        }
      }
    } catch (e) {
      setGroups([])
    }
  }
  const ensureGroupState = (gid: string | number) => {
    const key = String(gid)
    if (!listsByGroup[key]) {
      setListsByGroup((prev) => ({
        ...prev,
        [key]: { list: [], page: 0, hasMore: true, loading: false }
      }))
    }
  }
  const loadDevices = async (gid: string | number, refresh = false) => {
    const key = String(gid)
    ensureGroupState(gid)
    const cur = listsByGroup[key] || { list: [], page: 0, hasMore: true, loading: false }
    if (!refresh && (cur.loading || !cur.hasMore)) return
    const nextPage = refresh ? 1 : (cur.page + 1)
    setListsByGroup((prev) => ({ ...prev, [key]: { ...cur, loading: true } }))
    try {
      const params: any = { groupId: gid, page: nextPage, pageSize: 20 }
      if (searchKeyword.trim()) {
        params.search = searchKeyword.trim()
      }
      if (deviceTypeFilter !== 'all') {
        params.devicetype = deviceTypeFilter
      }
      const resp: any = await api.getMiniDevices(params)
      if (resp?.code === 0) {
        const data = resp.data
        const merged = refresh ? data.list : cur.list.concat(data.list)
        setListsByGroup((prev) => ({
          ...prev,
          [key]: { list: merged, page: data.page, hasMore: data.hasMore, loading: false }
        }))
      } else {
        setListsByGroup((prev) => ({ ...prev, [key]: { ...cur, loading: false } }))
      }
    } catch (e) {
      setListsByGroup((prev) => ({ ...prev, [key]: { ...cur, loading: false } }))
    }
  }
  
  // 搜索防抖处理
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchKeyword(searchValue)
    }, 500) // 500ms 防抖
    return () => clearTimeout(timer)
  }, [searchValue])
  
  // 搜索关键词变化时重新加载
  useEffect(() => {
    if (!loading && groups.length > 0 && tabIdx >= 0) {
      // 重置所有分组的状态并重新加载当前分组
      setListsByGroup({})
      const currentGroupId = groups[tabIdx]?.id
      if (currentGroupId) {
        loadDevices(currentGroupId, true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKeyword, deviceTypeFilter])
  const onTabChange = async (idx: number) => {
    setTabIdx(idx)
    const gid = groups[idx].id
    const key = String(gid)
    if (!listsByGroup[key] || listsByGroup[key].list.length === 0) await loadDevices(gid, true)
  }
  const onPullDownRefresh = async () => {
    await loadDevices(groups[tabIdx].id, true)
    Taro.stopPullDownRefresh()
  }
  const onReachBottom = async () => {
    await loadDevices(groups[tabIdx].id, false)
  }
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

  const handleDeviceTypeChange = (value: any) => {
    setDeviceTypeFilter(value)
    setListsByGroup({})
  }

  if (loading) {
    return <View style={{minHeight: '100vh',display:'flex',justifyContent:'center',alignItems:'center',background:'white',fontSize:'18px'}}>加载中...</View>
  }
  
  if (groups.length === 0) {
    return <View style={{minHeight: '100vh',display:'flex',justifyContent:'center',alignItems:'center',background:'white',fontSize:'18px',color:'#999'}}>暂无分组数据</View>
  }
  
  const curKey = groups[tabIdx] ? String(groups[tabIdx].id) : ''
  const curState = listsByGroup[curKey] || { list: [], loading: false, hasMore: true, page: 0 }

  return (
    <View className='home-page'>
      <AtMessage />
      <View style={{padding:'16px 18px',background:'#fff',borderBottom:'1px solid #ededed'}}>
        {/* 改进的搜索框样式 */}
        <View style={{
          background:'#f5f5f5',
          borderRadius:'8px',
          padding:'8px 12px',
          display:'flex',
          alignItems:'center',
          position:'relative'
        }}>
          <Image
            src={iconSearch}
            style={{
              width:'16px',
              height:'16px',
              marginRight:'8px'
            }}
            mode='aspectFit'
          />
          <Input
            type='text'
            value={searchValue}
            onInput={(e: any) => handleSearchChange(e.detail.value)}
            placeholder='搜索设备名称或编号'
            placeholderStyle='color:#999'
            style={{
              flex:1,
              border:'none',
              background:'transparent',
              fontSize:'14px',
              outline:'none'
            }}
          />
          {searchValue && (
            <Text
              onClick={handleSearchClear}
              style={{color:'#999',fontSize:'14px',padding:'0 4px',cursor:'pointer'}}
            >✕</Text>
          )}
        </View>
        {/* 设备类型筛选 */}
        <View style={{marginTop:'12px'}}>
          <AtSegmentedControl
            values={['全部设备', '墒情设备', '气象设备']}
            current={deviceTypeFilter === 'all' ? 0 : deviceTypeFilter === '1' ? 1 : 2}
            onClick={(index) => {
              const value = index === 0 ? 'all' : index === 1 ? '1' : '2'
              handleDeviceTypeChange(value)
            }}
            selectedColor='#1B9AEE'
          />
        </View>
      </View>
      <AtTabs
        current={tabIdx}
        tabList={groups.map(g=>({ title:`${g.name}${g.count!==undefined?'('+g.count+')':''}` }))}
        onClick={onTabChange}
        height='44'
        swipeable={true}
        animated
        tabDirection='horizontal'
        customStyle={{background:'#fff',fontSize:'18px'}}
      >
        {groups.map((group,idx)=>(
          <AtTabsPane current={tabIdx} index={idx} key={group.id}
            customStyle={{background:'#f8fafe',padding:0}}
          >
            {curState.loading && curState.list.length===0 ? (
              <View style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'400px'}}>
                <AtActivityIndicator mode='normal' size={40} content='加载设备列表...' color='#1B9AEE' />
              </View>
            ) : curState.list.length===0 ? (
              <View className='empty' style={{fontSize:'17px',padding:'36px 0',color:'#bbb'}}>暂无 {group.name} 设备</View>
            ) : (
              <AtList hasBorder={false}>
                {curState.list.map((item: any)=>{
                  const deviceIcon = getDeviceIcon(item.connectorIdentifier || '', item.deviceType || '')
                  const location = formatLocation(item)
                  const lastUpdateTime = formatRelativeTime(item.lastUpdate)
                  return (
                    <View
                      key={item.id}
                      onClick={() => {
                        Taro.navigateTo({
                          url: `/pages/device-detail/index?id=${item.id}`
                        })
                      }}
                      style={{
                        display:'flex',
                        alignItems:'center',
                        padding:'16px 18px',
                        margin:'0 12px',
                        borderBottom:'1px solid #f0f0f0',
                        background:'#fff',
                        cursor:'pointer'
                      }}
                    >
                      {/* 设备图片 */}
                      {deviceIcon && (
                        <Image
                          src={deviceIcon}
                          style={{
                            width:'60px',
                            height:'75px',
                            objectFit:'contain',
                            marginRight:'12px'
                          }}
                          mode='aspectFit'
                        />
                      )}
                      {/* 设备信息 */}
                      <View style={{flex:1,display:'flex',flexDirection:'column',justifyContent:'space-between'}}>
                        <View>
                          <Text style={{fontSize:'16px',fontWeight:600,color:'#222',display:'block',marginBottom:'4px'}}>
                            {item.name || item.sn}
                          </Text>
                          <Text style={{fontSize:'13px',color:'#999',display:'block',marginBottom:'6px'}}>
                            No.{item.sn}
                          </Text>
                        </View>
                        {/* 地理位置 */}
                        <Text style={{fontSize:'12px',color:'#999',display:'block',marginBottom:'4px'}}>
                          {location}
                        </Text>
                        {/* 上报时间 */}
                        <Text style={{fontSize:'12px',color:'#999'}}>
                          {lastUpdateTime ? `${lastUpdateTime}上报` : '从未上报'}
                        </Text>
                      </View>
                      {/* 右箭头 */}
                      <Text style={{color:'#ddd',fontSize:'18px',marginLeft:'8px'}}>›</Text>
                    </View>
                  )
                })}
              </AtList>
            )}
            {curState.loading && curState.list.length!==0 && <AtActivityIndicator content='加载更多...' size={26} color='#3192ff' />}
            {!curState.hasMore && curState.list.length>0 && <View style={{textAlign:'center',fontSize:'15px',color:'#aaa',margin:'20px 0 8px 0'}}>没有更多了</View>}
          </AtTabsPane>
        ))}
      </AtTabs>
    </View>
  )
}

