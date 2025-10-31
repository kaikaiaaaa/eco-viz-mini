import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { View, Text, Image, Picker } from '@tarojs/components'
import { AtButton, AtActivityIndicator, AtMessage } from 'taro-ui'
import Taro from '@tarojs/taro'
import api from '../../utils/api'
import { getAuthHeaders } from '../../utils/auth'
import EcCanvas from '../../components/chart/ec-canvas'
import 'taro-ui/dist/style/index.scss'
import './index.scss'
import dayjs from 'dayjs'

// 导入设备图标
const iconSq = require('../../assets/images/icon-sq.png')
const iconQx = require('../../assets/images/icon-qx.png')
const iconZhishang = require('../../assets/images/icon-zhishang.png')
const iconTianqiqxz = require('../../assets/images/icon-tianqiqxz.png')

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

// 格式化时间
const formatTime = (timestamp: string | null) => {
  if (!timestamp) return '从未上报'
  try {
    return dayjs(timestamp).format('YYYY/MM/DD HH:mm')
  } catch {
    return '从未上报'
  }
}

// 格式化相对时间
const formatRelativeTime = (timestamp: string | null) => {
  if (!timestamp) return '从未上报'
  try {
    const deviceLastUpdate = dayjs(timestamp)
    const now = dayjs()
    const diffMinutes = now.diff(deviceLastUpdate, 'minute')
    if (diffMinutes < 1) return '刚刚'
    if (diffMinutes < 60) return `${diffMinutes}分钟前`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}小时前`
    return `${Math.floor(diffMinutes / 1440)}天前`
  } catch {
    return '从未上报'
  }
}

// 根据设备类型获取参数列表
const getParametersByDeviceType = (deviceType: string): string[] => {
  // deviceType='1' 是墒情设备
  // deviceType='2' 是气象设备
  if (deviceType === '1') {
    // 墒情设备参数
    return ['moisture', 'temperature', 'battery', 'outsideVoltage']
  } else if (deviceType === '2') {
    // 气象设备参数
    return ['rainfall', 'airTemperature', 'relativeHumidity', 'atmosphericPressure', 'averageWindSpeed', 'windDirection', 'solarRadiationIntensity', 'solarRadiationAmount', 'sunshineDuration', 'battery', 'outsideVoltage']
  }
  return []
}

export default function DeviceDetailPage() {
  const [deviceId, setDeviceId] = useState<number | null>(null)
  const [device, setDevice] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [chartLoading, setChartLoading] = useState(false)
  const [parameters, setParameters] = useState<any[]>([])
  const [selectedParameter, setSelectedParameter] = useState<string>('')
  const [chartData, setChartData] = useState<any[]>([])
  const [nodeData, setNodeData] = useState<any[]>([])
  const [dateRange, setDateRange] = useState({
    start: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    end: dayjs().format('YYYY-MM-DD')
  })

  useEffect(() => {
    const pages = Taro.getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const id = currentPage.options?.id
    if (id) {
      setDeviceId(parseInt(id))
      loadDeviceDetail(parseInt(id))
    }
  }, [])

  const loadDeviceDetail = async (id: number) => {
    try {
      setLoading(true)
      const resp: any = await api.getDeviceDetail(id)
      if (resp?.code === 0) {
        setDevice(resp.data)
        // 加载设备参数列表
        await loadDeviceParameters(id, resp.data.deviceType)
      } else {
        Taro.atMessage({ message: resp.message || '获取设备详情失败', type: 'error' })
      }
    } catch (e) {
      Taro.atMessage({ message: '获取设备详情失败', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const loadDeviceParameters = async (id: number, deviceType: string) => {
    try {
      // 根据设备类型获取参数列表
      const parameterNames = getParametersByDeviceType(deviceType)
      
      if (parameterNames.length === 0) {
        console.warn('设备类型不支持:', deviceType)
        Taro.atMessage({ message: '该设备类型暂无可用参数', type: 'warning' })
        return
      }
      
      console.log('设备类型:', deviceType, '参数列表:', parameterNames)
      
      // 根据参数名称获取参数详情（名称、单位等）
      const resp: any = await api.getParametersInfo(parameterNames)
      console.log('获取参数详情响应:', resp)
      
      if (resp?.code === 0 && resp.data) {
        // API返回的data直接是参数数组
        const params = Array.isArray(resp.data) ? resp.data : []
        console.log('解析后的参数列表:', params)
        
        // 按照预定义的顺序排序
        const orderedParams = parameterNames
          .map(name => params.find((p: any) => p.parameter === name))
          .filter(Boolean) as any[]
        
        setParameters(orderedParams)
        
        if (orderedParams.length > 0) {
          const firstParam = orderedParams[0].parameter
          setSelectedParameter(firstParam)
          // 自动加载图表数据 - 等待 state 更新完成后再调用
          setTimeout(() => {
            // 直接使用最新的参数值，避免闭包问题
            loadChartDataWithParam(id, firstParam)
          }, 500)
        } else {
          console.warn('设备没有可用参数')
          Taro.atMessage({ message: '该设备暂无可用参数', type: 'warning' })
        }
      } else {
        console.error('获取参数详情失败:', resp)
        Taro.atMessage({ message: resp?.message || '获取参数详情失败', type: 'error' })
      }
    } catch (e: any) {
      console.error('获取参数异常:', e)
      Taro.atMessage({ message: e.message || '获取参数失败', type: 'error' })
    }
  }

  const loadChartDataWithParam = async (deviceIdParam: number, param: string) => {
    console.log('loadChartDataWithParam called', { deviceIdParam, param, dateRange })
    
    if (!deviceIdParam || !param) {
      return
    }

    try {
      setChartLoading(true)
      const startDate = `${dateRange.start} 00:00:00`
      const endDate = `${dateRange.end} 23:59:59`
      
      console.log('请求参数:', { deviceIdParam, parameters: param, startDate, endDate })
      
      const resp: any = await api.getDeviceHistoryData(deviceIdParam, {
        parameters: param,
        startDate,
        endDate
      })
      
      console.log('响应数据:', resp)
      
      if (resp?.code === 0) {
        const data = resp.data || []
        if (data.length > 0 && data[0].hasOwnProperty('node')) {
          setNodeData(data)
          setChartData([])
        } else {
          setChartData(data)
          setNodeData([])
        }
      } else {
        Taro.atMessage({ message: resp?.message || '获取历史数据失败', type: 'error' })
      }
    } catch (e: any) {
      console.error('获取历史数据失败:', e)
      Taro.atMessage({ message: e.message || '获取历史数据失败', type: 'error' })
    } finally {
      setChartLoading(false)
    }
  }

  const loadChartData = useCallback(async () => {
    console.log('loadChartData called', { deviceId, selectedParameter, dateRange })
    
    if (!deviceId) {
      Taro.atMessage({ message: '设备ID不存在', type: 'error' })
      return
    }
    
    if (!selectedParameter) {
      Taro.atMessage({ message: '请先选择参数', type: 'warning' })
      return
    }

    try {
      setChartLoading(true)
      const startDate = `${dateRange.start} 00:00:00`
      const endDate = `${dateRange.end} 23:59:59`
      
      console.log('请求参数:', { deviceId, parameters: selectedParameter, startDate, endDate })
      
      const resp: any = await api.getDeviceHistoryData(deviceId, {
        parameters: selectedParameter,
        startDate,
        endDate
      })
      
      console.log('响应数据:', resp)
      
      if (resp?.code === 0) {
        const data = resp.data || []
        if (data.length > 0 && data[0].hasOwnProperty('node')) {
          setNodeData(data)
          setChartData([])
        } else {
          setChartData(data)
          setNodeData([])
        }
      } else {
        Taro.atMessage({ message: resp?.message || '获取历史数据失败', type: 'error' })
      }
    } catch (e: any) {
      console.error('获取历史数据失败:', e)
      Taro.atMessage({ message: e.message || '获取历史数据失败', type: 'error' })
    } finally {
      setChartLoading(false)
    }
  }, [deviceId, selectedParameter, dateRange])

  // 获取参数信息
  const getParameterInfo = (parameter: string) => {
    return parameters.find((p: any) => p.parameter === parameter)
  }

  const getParameterName = (parameter: string) => {
    const paramInfo = getParameterInfo(parameter)
    return paramInfo?.name || parameter
  }

  const getParameterUnit = (parameter: string) => {
    const paramInfo = getParameterInfo(parameter)
    return paramInfo?.unit || ''
  }

  const getParameterColor = (index: number) => {
    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0']
    return colors[index % colors.length]
  }

  const formatTimestamp = (timestamp: string) => {
    return dayjs(timestamp).format('MM/DD HH:mm')
  }

  // 生成图表配置 - 无节点数据
  const chartOption = useMemo(() => {
    if (chartData.length === 0) return null

    const timestamps = chartData.map(item => formatTimestamp(item.timestamp))
    const values = chartData.map(item => item[selectedParameter] || 0)

    return {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const unit = getParameterUnit(selectedParameter)
          const value = parseFloat(params[0].value).toFixed(2)
          return `${formatTimestamp(params[0].axisValue)}<br/>${params[0].marker}${getParameterName(selectedParameter)}: ${value}${unit ? ' ' + unit : ''}`
        }
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '10%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timestamps,
        axisLabel: {
          rotate: 0,
          fontSize: 12,
          interval: Math.max(0, Math.floor(timestamps.length / 6))
        }
      },
      yAxis: {
        type: 'value',
        name: getParameterUnit(selectedParameter),
        axisLabel: {
          formatter: (value: number) => {
            return parseFloat(value.toString()).toFixed(1)
          }
        }
      },
      series: [{
        name: getParameterName(selectedParameter),
        type: 'line',
        data: values,
        smooth: true,
        lineStyle: {
          color: getParameterColor(0),
          width: 2
        },
        itemStyle: {
          color: getParameterColor(0)
        },
        symbol: 'none'
      }]
    }
  }, [chartData, selectedParameter, parameters])

  // 生成图表配置 - 有节点数据
  const nodeChartOption = useMemo(() => {
    if (nodeData.length === 0) return null

    // 按节点分组
    const nodeGroups = new Map<string, any[]>()
    nodeData.forEach(item => {
      const node = item.node || '0'
      if (!nodeGroups.has(node)) {
        nodeGroups.set(node, [])
      }
      nodeGroups.get(node)!.push(item)
    })

    // 按节点深度排序：地表(0) -> 10cm -> 20cm -> 30cm...
    const sortedNodes = Array.from(nodeGroups.keys()).sort((a, b) => {
      const depthA = parseInt(a) || 0
      const depthB = parseInt(b) || 0
      return depthA - depthB
    })

    const timestamps = Array.from(new Set(nodeData.map(item => item.timestamp))).sort()
    const formattedTimestamps = timestamps.map(ts => formatTimestamp(ts))

    const series = sortedNodes.map((node, index) => ({
      name: node === '0' ? '地表' : `${node}cm`,
      type: 'line',
      data: timestamps.map(ts => {
        const nodeData = nodeGroups.get(node)?.find(d => d.timestamp === ts)
        return nodeData ? nodeData.value : null
      }),
      smooth: true,
      lineStyle: {
        color: getParameterColor(index),
        width: 2
      },
      itemStyle: {
        color: getParameterColor(index)
      },
      symbol: 'none',
      connectNulls: false
    }))

    const hasOnlySurfaceNode = sortedNodes.length === 1 && sortedNodes[0] === '0'

    return {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          let result = formatTimestamp(params[0].axisValue) + '<br/>'
          if (hasOnlySurfaceNode) {
            const value = parseFloat(params[0].value).toFixed(2)
            const unit = getParameterUnit(selectedParameter)
            result += `${value}${unit ? ' ' + unit : ''}`
          } else {
            params.forEach((param: any) => {
              if (param.value !== null) {
                const unit = getParameterUnit(selectedParameter)
                const value = parseFloat(param.value).toFixed(2)
                result += `${param.marker}${param.seriesName}: ${value}${unit ? ' ' + unit : ''}<br/>`
              }
            })
          }
          return result
        }
      },
      ...(hasOnlySurfaceNode ? {} : {
        legend: {
          data: sortedNodes.map(node => node === '0' ? '地表' : `${node}cm`),
          bottom: 0
        }
      }),
      grid: {
        left: '3%',
        right: '3%',
        bottom: hasOnlySurfaceNode ? '10%' : '20%',
        top: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: formattedTimestamps,
        axisLabel: {
          rotate: 0,
          fontSize: 12,
          interval: Math.max(0, Math.floor(formattedTimestamps.length / 6))
        }
      },
      yAxis: {
        type: 'value',
        name: getParameterUnit(selectedParameter),
        axisLabel: {
          formatter: (value: number) => {
            return parseFloat(value.toString()).toFixed(1)
          }
        }
      },
      series: series
    }
  }, [nodeData, selectedParameter, parameters])


  if (loading) {
    return (
      <View style={{minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',background:'#fff'}}>
        <AtActivityIndicator mode='normal' size={40} content='加载中...' color='#1B9AEE' />
      </View>
    )
  }

  if (!device) {
    return (
      <View style={{minHeight:'100vh',display:'flex',justifyContent:'center',alignItems:'center',background:'#fff'}}>
        <Text style={{color:'#999',fontSize:'16px'}}>设备不存在</Text>
      </View>
    )
  }

  const deviceIcon = getDeviceIcon(device.connectorIdentifier || '', device.deviceType || '')
  const lastUpdateTime = formatTime(device.latestCollectTime || device.lastUpdate)
  const location = device.province && device.city && device.district
    ? `${device.province}省${device.city}市${device.district}区`
    : device.location || '--'

  return (
    <View className='device-detail-page'>
      <AtMessage />
      <View style={{paddingBottom:'20px'}}>
        {/* 设备信息卡片 */}
        <View style={{
          background:'#fff',
          margin:'16px',
          borderRadius:'12px',
          overflow:'hidden',
          boxShadow:'0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <View style={{
            background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding:'20px',
            display:'flex',
            alignItems:'center'
          }}>
            {deviceIcon && (
              <Image
                src={deviceIcon}
                style={{
                  width:'80px',
                  height:'100px',
                  objectFit:'contain',
                  marginRight:'16px'
                }}
                mode='aspectFit'
              />
            )}
            <View style={{flex:1}}>
              <Text style={{fontSize:'20px',fontWeight:600,color:'#fff',display:'block',marginBottom:'8px'}}>
                {device.alias || device.name || device.sn}
              </Text>
              <Text style={{fontSize:'14px',color:'rgba(255,255,255,0.9)',display:'block'}}>
                No.{device.sn}
              </Text>
            </View>
          </View>
          
          <View style={{padding:'20px'}}>
            <View style={{display:'flex',justifyContent:'space-between',marginBottom:'16px',paddingBottom:'16px',borderBottom:'1px solid #f0f0f0'}}>
              <Text style={{fontSize:'14px',color:'#999'}}>设备名称</Text>
              <Text style={{fontSize:'14px',color:'#222',fontWeight:500}}>{device.alias || device.name || device.sn}</Text>
            </View>
            <View style={{display:'flex',justifyContent:'space-between',marginBottom:'16px',paddingBottom:'16px',borderBottom:'1px solid #f0f0f0'}}>
              <Text style={{fontSize:'14px',color:'#999'}}>设备编号</Text>
              <Text style={{fontSize:'14px',color:'#222',fontWeight:500}}>{device.sn}</Text>
            </View>
            <View style={{display:'flex',justifyContent:'space-between',marginBottom:'16px',paddingBottom:'16px',borderBottom:'1px solid #f0f0f0'}}>
              <Text style={{fontSize:'14px',color:'#999'}}>最新采集时间</Text>
              <Text style={{fontSize:'14px',color:'#222',fontWeight:500}}>{lastUpdateTime}</Text>
            </View>
            <View style={{display:'flex',justifyContent:'space-between'}}>
              <Text style={{fontSize:'14px',color:'#999'}}>地理位置</Text>
              <Text style={{fontSize:'14px',color:'#222',fontWeight:500}}>{location}</Text>
            </View>
          </View>
        </View>

        {/* 设备数据图表 */}
        <View style={{
          background:'#fff',
          margin:'16px',
          borderRadius:'12px',
          overflow:'hidden',
          boxShadow:'0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <View style={{
            padding:'16px 20px',
            borderBottom:'1px solid #f0f0f0',
            display:'flex',
            alignItems:'center'
          }}>
            <View style={{
              width:'4px',
              height:'16px',
              background:'#1B9AEE',
              marginRight:'8px',
              borderRadius:'2px'
            }}></View>
            <Text style={{fontSize:'16px',fontWeight:600,color:'#222'}}>设备数据</Text>
          </View>

          <View style={{padding:'20px'}}>
            {/* 参数选择 */}
            {parameters.length > 0 ? (
              <View style={{marginBottom:'16px'}}>
                <Text style={{fontSize:'14px',color:'#666',marginBottom:'8px',display:'block'}}>参数:</Text>
                <View style={{
                  display:'flex',
                  flexWrap:'wrap',
                  gap:'8px'
                }}>
                  {parameters.map((param: any) => (
                    <View
                      key={param.parameter}
                      onClick={() => {
                        setSelectedParameter(param.parameter)
                        setTimeout(() => loadChartData(), 300)
                      }}
                      style={{
                        padding:'8px 16px',
                        borderRadius:'20px',
                        background:selectedParameter === param.parameter ? '#1B9AEE' : '#f5f5f5',
                        color:selectedParameter === param.parameter ? '#fff' : '#666',
                        fontSize:'13px'
                      }}
                    >
                      {param.name || param.parameter}
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View style={{marginBottom:'16px',padding:'12px',background:'#fff3cd',borderRadius:'8px',border:'1px solid #ffc107'}}>
                <Text style={{fontSize:'14px',color:'#856404'}}>该设备暂无可用参数，请稍后重试</Text>
              </View>
            )}

            {/* 时间选择 */}
            <View style={{marginBottom:'16px'}}>
              <Text style={{fontSize:'14px',color:'#666',marginBottom:'8px',display:'block'}}>时间:</Text>
              <View style={{
                display:'flex',
                gap:'8px',
                alignItems:'center'
              }}>
                <Picker
                  mode='date'
                  value={dateRange.start}
                  onChange={(e: any) => setDateRange({...dateRange, start: e.detail.value})}
                >
                  <View style={{
                    flex:1,
                    padding:'10px',
                    border:'1px solid #e0e0e0',
                    borderRadius:'8px',
                    fontSize:'14px',
                    color:'#222',
                    background:'#fff'
                  }}>
                    {dateRange.start}
                  </View>
                </Picker>
                <Text style={{color:'#999'}}>至</Text>
                <Picker
                  mode='date'
                  value={dateRange.end}
                  onChange={(e: any) => setDateRange({...dateRange, end: e.detail.value})}
                >
                  <View style={{
                    flex:1,
                    padding:'10px',
                    border:'1px solid #e0e0e0',
                    borderRadius:'8px',
                    fontSize:'14px',
                    color:'#222',
                    background:'#fff'
                  }}>
                    {dateRange.end}
                  </View>
                </Picker>
              </View>
            </View>

            {/* 查询按钮 */}
            <AtButton
              type='primary'
              onClick={loadChartData}
              disabled={chartLoading}
              customStyle={{background:chartLoading?'#ccc':'#1B9AEE',marginBottom:'20px'}}
            >
              {chartLoading ? '加载中...' : '查询'}
            </AtButton>

            {/* 图表区域 */}
            <View style={{
              minHeight:'300px',
              background:'#fafafa',
              borderRadius:'8px',
              padding:'16px'
            }}>
              {chartLoading ? (
                <View style={{display:'flex',justifyContent:'center',alignItems:'center',height:'300px'}}>
                  <AtActivityIndicator mode='normal' size={30} content='加载中...' color='#1B9AEE' />
                </View>
              ) : chartData.length > 0 || nodeData.length > 0 ? (
                <View style={{width:'100%',height:'300px'}}>
                  <EcCanvas
                    option={nodeData.length > 0 ? nodeChartOption : chartOption}
                    canvasId='chart-canvas'
                    style={{width:'100%',height:'300px'}}
                  />
                </View>
              ) : (
                <View style={{display:'flex',justifyContent:'center',alignItems:'center',height:'300px'}}>
                  <Text style={{fontSize:'14px',color:'#999'}}>暂无数据，请选择参数和时间范围后点击查询</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

