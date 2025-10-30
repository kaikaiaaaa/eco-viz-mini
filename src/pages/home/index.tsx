import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtList, AtListItem, AtActivityIndicator, AtMessage } from 'taro-ui'
import Taro from '@tarojs/taro'
import api from '../../utils/api'
import { clearLoginData, navigateToWebViewLoginSimple, getAuthHeaders } from '../../utils/auth'
import 'taro-ui/dist/style/index.scss'
import './index.scss'

let redirectingToLogin = false

export default function HomePage() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [groups, setGroups] = useState<Array<{ id: number | string, name: string, count: number }>>([])
  const [tabIdx, setTabIdx] = useState(0)
  const [listsByGroup, setListsByGroup] = useState<Record<string, { list: Array<any>, page: number, hasMore: boolean, loading: boolean }>>({})

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
        const withAll = [{ id: 'all', name: '全部', count: 0 }, ...list]
        setGroups(withAll as any)
        if (!listsByGroup['all']) await loadDevices('all', true)
      }
    } catch (e) {
      setGroups([{ id: 'all', name: '全部', count: 0 }] as any)
      if (!listsByGroup['all']) await loadDevices('all', true)
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
      const resp: any = await api.getMiniDevices({ groupId: gid, page: nextPage, pageSize: 20 })
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

  const handleLogout = () => {
    Taro.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          clearLoginData()
          Taro.atMessage({ message: '已退出登录', type: 'info' })
          setTimeout(() => { Taro.redirectTo({ url: '/pages/home/index' }) }, 1500)
        }
      }
    })
  }

  if (loading) {
    return <View style={{minHeight: '100vh',display:'flex',justifyContent:'center',alignItems:'center',background:'white',fontSize:'18px'}}>加载中...</View>
  }
  const curKey = groups[tabIdx] ? String(groups[tabIdx].id) : 'all'
  const curState = listsByGroup[curKey] || { list: [], loading: false, hasMore: true, page: 0 }

  return (
    <View className='home-page'>
      <AtMessage />
      <View style={{padding:'18px 0 0 0',background:'#fff',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid #ededed'}}>
        <Text style={{fontSize:'22px',fontWeight:600,color:'#222',padding:'0 18px'}}>设备</Text>
        <Text style={{fontSize:'15px',color:'#1B9AEE',padding:'0 18px',borderRadius:6}} onClick={handleLogout}>退出</Text>
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
              <AtActivityIndicator mode='normal' size={40} content='加载设备列表...' color='#1B9AEE' />
            ) : curState.list.length===0 ? (
              <View className='empty' style={{fontSize:'17px',padding:'36px 0',color:'#bbb'}}>暂无 {group.name} 设备</View>
            ) : (
              <AtList hasBorder={false}>
                {curState.list.map((item: any)=>(
                  <AtListItem
                    key={item.id}
                    title={item.name||item.sn}
                    note={item.sn}
                    arrow='right'
                    extraText={item.status==='Online'?'在线':'离线'}
                    customStyle={{padding:'20px 0',margin:'0 12px',borderBottom:'1px solid #f0f0f0',fontSize:'17px',color:'#222',fontWeight:500}}
                  />
                ))}
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

