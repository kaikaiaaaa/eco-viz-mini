import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { View, Text, Picker, Image } from '@tarojs/components'
import { AtButton, AtActivityIndicator, AtMessage } from 'taro-ui'
import Taro from '@tarojs/taro'
import api from '../../utils/api'
import { getAuthHeaders } from '../../utils/auth'
import EcCanvas from '../../components/chart/ec-canvas'
import { getIndicatorParameters, getIndicatorMapping } from '../../utils/indicators-mapping'
import 'taro-ui/dist/style/index.scss'
import './index.scss'
import dayjs from 'dayjs'
const iconEdit = require('../../assets/images/icon-edit.png')

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

type TabType = 'analysis' | 'history'

export default function DeviceDetailPage() {
  const [deviceId, setDeviceId] = useState<number | null>(null)
  const [device, setDevice] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('analysis')
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [analysisData, setAnalysisData] = useState<any[]>([])
  const [chartLoading, setChartLoading] = useState(false)
  const [parameters, setParameters] = useState<any[]>([])
  const [selectedParameter, setSelectedParameter] = useState<string>('')
  const [displayParameter, setDisplayParameter] = useState<string>('')
  const [chartData, setChartData] = useState<any[]>([])
  const [nodeData, setNodeData] = useState<any[]>([])
  const [dateRange, setDateRange] = useState({
    start: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    end: dayjs().format('YYYY-MM-DD')
  })

  const isCrossYear = useMemo(() => {
    return dayjs(dateRange.start).year() !== dayjs(dateRange.end).year()
  }, [dateRange.start, dateRange.end])

  const formatAxisLabel = useCallback((timestamp: string) => {
    if (!timestamp) return ''
    const date = dayjs(timestamp)
    const datePart = isCrossYear ? date.format('YYYY/MM/DD') : date.format('MM/DD')
    return `${datePart}\n${date.format('HH:mm')}`
  }, [isCrossYear])

  const formatTooltipLabel = useCallback((timestamp: string) => {
    if (!timestamp) return ''
    const date = dayjs(timestamp)
    return isCrossYear ? date.format('YYYY/MM/DD HH:mm') : date.format('MM/DD HH:mm')
  }, [isCrossYear])

const MAX_RANGE_DAYS = 365

const validateDateRange = useCallback((start: string, end: string, showMessage = true) => {
  const startDay = dayjs(start)
  const endDay = dayjs(end)

  if (!startDay.isValid() || !endDay.isValid()) {
    if (showMessage) {
      Taro.atMessage({ message: '请选择有效的时间范围', type: 'warning' })
    }
    return false
  }

  if (endDay.isBefore(startDay)) {
    if (showMessage) {
      Taro.atMessage({ message: '结束日期不能早于开始日期', type: 'warning' })
    }
    return false
  }

  if (endDay.diff(startDay, 'day') > MAX_RANGE_DAYS) {
    if (showMessage) {
      Taro.atMessage({ message: '时间范围最多查询一年，请重新选择', type: 'warning' })
    }
    return false
  }

  return true
}, [])

const updateDateRange = useCallback((type: 'start' | 'end', value: string) => {
  let nextRange = {
    ...dateRange,
    [type]: value
  }

  const startDay = dayjs(nextRange.start)
  const endDay = dayjs(nextRange.end)

  if (startDay.isValid() && endDay.isValid() && endDay.isBefore(startDay)) {
    if (type === 'start') {
      nextRange = {
        ...nextRange,
        end: value
      }
    } else {
      nextRange = {
        ...nextRange,
        start: value
      }
    }
  }

  if (!validateDateRange(nextRange.start, nextRange.end)) {
    return
  }

  setDateRange(nextRange)
}, [dateRange, validateDateRange])

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
        // 加载设备参数列表（用于历史数据）
        await loadDeviceParameters(id, resp.data.deviceType)
        // 加载最新分析数据
        await loadAnalysisData(id, resp.data.deviceType)
      } else {
        Taro.atMessage({ message: resp.message || '获取设备详情失败', type: 'error' })
      }
    } catch (e) {
      Taro.atMessage({ message: '获取设备详情失败', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  // 加载最新分析数据
  const loadAnalysisData = async (id: number, deviceType: string) => {
    // 只支持墒情设备和气象设备
    if (deviceType !== '1' && deviceType !== '2') {
      return
    }

    try {
      setAnalysisLoading(true)
      const indicatorParameters = getIndicatorParameters(deviceType)
      const mapping = getIndicatorMapping(deviceType)

      if (indicatorParameters.length === 0 || mapping.length === 0) {
        return
      }

      let response: any
      if (deviceType === '1') {
        // 墒情设备
        response = await api.getMoistureIndicators(id, indicatorParameters)
      } else {
        // 气象设备
        response = await api.getWeatherIndicators(id, indicatorParameters)
      }

      if (response?.code === 0) {
        const data = deviceType === '1' ? response.data : response.data?.weather
        const formattedData = indicatorParameters.map(parameter => {
          const map = mapping.find(m => m.parameter === parameter)
          if (!map) return null

          let value: string
          const rawValue = data?.[parameter]

          // 处理布尔值：布尔值即使是 false 也应该显示
          if (typeof rawValue === 'boolean') {
            if (map.transform) {
              value = map.transform(rawValue)
            } else {
              value = rawValue ? '是' : '否'
            }
          } else if (rawValue !== null && rawValue !== undefined && rawValue !== 0) {
            // 如果有转换函数，使用转换函数
            if (map.transform) {
              value = map.transform(rawValue)
            } else {
              // 处理数值，保留两位小数
              if (typeof rawValue === 'number' || !isNaN(parseFloat(rawValue))) {
                const numValue = parseFloat(rawValue.toString())
                const truncatedValue = Math.floor(numValue * 100) / 100
                value = truncatedValue.toFixed(2)
              } else {
                value = rawValue.toString()
              }
            }
          } else {
            value = '--'
          }

          return {
            label: map.name,
            value: value,
            unit: map.unit || ''
          }
        }).filter((item): item is { label: string; value: string; unit: string } => item !== null)

        setAnalysisData(formattedData)
      } else {
        // API 失败时显示默认数据
        const defaultData = indicatorParameters.map(parameter => {
          const map = mapping.find(m => m.parameter === parameter)
          if (!map) return null
          return {
            label: map.name,
            value: '--',
            unit: map.unit || ''
          }
        }).filter((item): item is { label: string; value: string; unit: string } => item !== null)
        setAnalysisData(defaultData)
      }
    } catch (e: any) {
      console.error('获取最新分析数据失败:', e)
      // 出错时显示默认数据
      const indicatorParameters = getIndicatorParameters(deviceType)
      const mapping = getIndicatorMapping(deviceType)
      const defaultData = indicatorParameters.map(parameter => {
        const map = mapping.find(m => m.parameter === parameter)
        if (!map) return null
        return {
          label: map.name,
          value: '--',
          unit: map.unit || ''
        }
      }).filter((item): item is { label: string; value: string; unit: string } => item !== null)
      setAnalysisData(defaultData)
    } finally {
      setAnalysisLoading(false)
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

    if (!validateDateRange(dateRange.start, dateRange.end)) {
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
        setDisplayParameter(param)
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

    if (!validateDateRange(dateRange.start, dateRange.end)) {
      return
    }

    try {
      setChartLoading(true)
      const startDate = `${dateRange.start} 00:00:00`
      const endDate = `${dateRange.end} 23:59:59`
      const currentParameter = selectedParameter
      
      console.log('请求参数:', { deviceId, parameters: currentParameter, startDate, endDate })
      
      const resp: any = await api.getDeviceHistoryData(deviceId, {
        parameters: currentParameter,
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
        setDisplayParameter(currentParameter)
      } else {
        Taro.atMessage({ message: resp?.message || '获取历史数据失败', type: 'error' })
      }
    } catch (e: any) {
      console.error('获取历史数据失败:', e)
      Taro.atMessage({ message: e.message || '获取历史数据失败', type: 'error' })
    } finally {
      setChartLoading(false)
    }
  }, [deviceId, selectedParameter, dateRange, validateDateRange])

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

  // 生成图表配置 - 无节点数据
  const chartOption = useMemo(() => {
    if (chartData.length === 0) return null

    const valueKey = displayParameter || parameters[0]?.parameter || ''
    const timestamps = chartData.map(item => item.timestamp)
    const values = chartData.map(item => {
      const raw = item[valueKey] ?? item.value ?? 0
      return typeof raw === 'number' ? raw : parseFloat(raw) || 0
    })
    const labelInterval = isCrossYear ? 'auto' : Math.max(0, Math.ceil(timestamps.length / 6) - 1)

    return {
      tooltip: {
        trigger: 'axis',
        confine: true,
        renderMode: 'richText',
        extraCssText: 'white-space: pre-line; height: auto; min-height: auto;',
        formatter: (params: any) => {
          const param = Array.isArray(params) ? params[0] : params
          if (!param) return ''
          const dataPoint = chartData[param.dataIndex]
          const unit = getParameterUnit(valueKey)
          const rawValue = dataPoint ? (dataPoint[valueKey] ?? dataPoint.value ?? param.value) : param.value
          const value = rawValue !== undefined && rawValue !== null
            ? parseFloat(rawValue.toString()).toFixed(2)
            : '0.00'
          const timeLabel = dataPoint
            ? formatTooltipLabel(dataPoint.timestamp)
            : formatTooltipLabel(param.axisValue)
          const lines: string[] = []
          if (timeLabel) {
            lines.push(timeLabel)
          }
          lines.push(`${param.marker}${getParameterName(valueKey)}: ${value}${unit ? ' ' + unit : ''}`)
          return lines.join('\n')
        }
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '10%',
        top: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timestamps,
        axisLabel: {
          rotate: 0,
          fontSize: 12,
          interval: labelInterval,
          formatter: (value: string) => formatAxisLabel(value),
          hideOverlap: true
        }
      },
      yAxis: {
        type: 'value',
        name: getParameterUnit(valueKey),
        axisLabel: {
          formatter: (value: number) => {
            return parseFloat(value.toString()).toFixed(1)
          }
        }
      },
      series: [{
        name: getParameterName(valueKey),
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
  }, [chartData, displayParameter, parameters, formatAxisLabel, formatTooltipLabel])

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

    const valueKey = displayParameter || parameters[0]?.parameter || ''
    const timestamps = Array.from(new Set(nodeData.map(item => item.timestamp))).sort()
    const labelInterval = isCrossYear ? 'auto' : Math.max(0, Math.ceil(timestamps.length / 6) - 1)

    const series = sortedNodes.map((node, index) => ({
      name: node === '0' ? '地表' : `${node}cm`,
      type: 'line',
      data: timestamps.map(ts => {
        const nodeData = nodeGroups.get(node)?.find(d => d.timestamp === ts)
        if (!nodeData) return null
        const raw = nodeData.value ?? nodeData[valueKey]
        if (raw === null || raw === undefined) {
          return null
        }
        return typeof raw === 'number' ? raw : parseFloat(raw)
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
        confine: true,
        renderMode: 'richText',
        extraCssText: 'white-space: pre-line; height: auto; min-height: auto;',
        formatter: (params: any) => {
          const list = Array.isArray(params) ? params : [params]
          const first = list[0]
          const timeLabel = first ? formatTooltipLabel(first.axisValue) : ''
          const lines: string[] = []
          if (timeLabel) {
            lines.push(timeLabel)
          }
          if (hasOnlySurfaceNode) {
            const value = first && first.value !== null && first.value !== undefined
              ? parseFloat(first.value).toFixed(2)
              : '0.00'
            const unit = getParameterUnit(valueKey)
            lines.push(`${value}${unit ? ' ' + unit : ''}`)
          } else {
            list.forEach((param: any) => {
              if (param.value !== null && param.value !== undefined) {
                const unit = getParameterUnit(valueKey)
                const value = parseFloat(param.value).toFixed(2)
                lines.push(`${param.marker}${param.seriesName}: ${value}${unit ? ' ' + unit : ''}`)
              }
            })
          }
          return lines.join('\n')
        }
      },
      ...(hasOnlySurfaceNode ? {} : {
        legend: {
          data: sortedNodes.map(node => node === '0' ? '地表' : `${node}cm`),
          bottom: 0
        }
      }),
      grid: {
        left: '2%',
        right: '2%',
        bottom: hasOnlySurfaceNode ? '10%' : '20%',
        top: '2%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timestamps,
        axisLabel: {
          rotate: 0,
          fontSize: 12,
          interval: labelInterval,
          formatter: (value: string) => formatAxisLabel(value),
          hideOverlap: true
        }
      },
      yAxis: {
        type: 'value',
        name: getParameterUnit(valueKey),
        axisLabel: {
          formatter: (value: number) => {
            return parseFloat(value.toString()).toFixed(1)
          }
        }
      },
      series: series
    }
  }, [nodeData, displayParameter, parameters, formatAxisLabel, formatTooltipLabel])


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

  return (
    <View className='device-detail-page'>
      <AtMessage />
      <View style={{paddingBottom:'20px'}}>
        {/* 设备信息卡片 */}
        <View style={{
          background:'#fff',
          margin:'16px',
          borderRadius:'12px',
          padding:'20px',
          boxShadow:'0 2px 8px rgba(0,0,0,0.08)',
          position:'relative'
        }}>
          <Text style={{fontSize:'20px',fontWeight:600,color:'#222',display:'block',marginBottom:'8px'}}>
            {device.alias || device.name || device.sn}
          </Text>
          <Text style={{fontSize:'14px',color:'#666'}}>
            No.{device.sn}
          </Text>
          <View
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/device-threshold-edit/index?deviceId=${device.id}&deviceSn=${encodeURIComponent(device.sn)}`
              })
            }}
            style={{
              position:'absolute',
              top:'16px',
              right:'16px',
              width:'32px',
              height:'32px',
              borderRadius:'16px',
              background:'#f5f6f7',
              display:'flex',
              alignItems:'center',
              justifyContent:'center'
            }}
          >
            <Image
              src={iconEdit}
              style={{width:'16px',height:'16px'}}
              mode='aspectFit'
            />
          </View>
        </View>

        {/* Tab 切换和设备数据 */}
        <View style={{
          background:'#fff',
          margin:'16px',
          borderRadius:'12px',
          overflow:'hidden',
          boxShadow:'0 2px 8px rgba(0,0,0,0.08)'
        }}>
          {/* Tab 切换 */}
          <View style={{
            display:'flex',
            borderBottom:'1px solid #f0f0f0'
          }}>
            <View
              onClick={() => setActiveTab('analysis')}
              style={{
                flex:1,
                padding:'16px 20px',
                textAlign:'center',
                borderBottom: activeTab === 'analysis' ? '2px solid #1B9AEE' : '2px solid transparent',
                background: activeTab === 'analysis' ? '#f8f9fa' : 'transparent'
              }}
            >
              <Text style={{
                fontSize:'16px',
                fontWeight: activeTab === 'analysis' ? 600 : 400,
                color: activeTab === 'analysis' ? '#1B9AEE' : '#666'
              }}>最新分析</Text>
            </View>
            <View
              onClick={() => setActiveTab('history')}
              style={{
                flex:1,
                padding:'16px 20px',
                textAlign:'center',
                borderBottom: activeTab === 'history' ? '2px solid #1B9AEE' : '2px solid transparent',
                background: activeTab === 'history' ? '#f8f9fa' : 'transparent'
              }}
            >
              <Text style={{
                fontSize:'16px',
                fontWeight: activeTab === 'history' ? 600 : 400,
                color: activeTab === 'history' ? '#1B9AEE' : '#666'
              }}>历史数据</Text>
            </View>
          </View>

          {/* 最新分析内容 */}
          {activeTab === 'analysis' && (
            <View style={{padding:'20px'}}>
              {analysisLoading ? (
                <View style={{
                  display:'flex',
                  justifyContent:'center',
                  alignItems:'center',
                  minHeight:'200px'
                }}>
                  <AtActivityIndicator mode='normal' size={30} content='加载中...' color='#1B9AEE' />
                </View>
              ) : (
                <View>
                  {analysisData.length > 0 ? (
                    <View className='analysis-grid'>
                      {analysisData.map((item, index) => (
                        <View
                          key={index}
                          className='analysis-card'
                        >
                          <View className='analysis-value-wrapper'>
                            <Text className='analysis-value'>{item.value}</Text>
                            {item.unit && (
                              <Text className='analysis-unit'>{item.unit}</Text>
                            )}
                          </View>
                          <Text className='analysis-label'>{item.label}</Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <View style={{
                      display:'flex',
                      justifyContent:'center',
                      alignItems:'center',
                      minHeight:'200px'
                    }}>
                      <Text style={{fontSize:'14px',color:'#999'}}>暂无数据</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}

          {/* 历史数据内容 */}
          {activeTab === 'history' && (
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
                alignItems:'center',
                justifyContent:'flex-start',
                flexWrap:'wrap',
                width:'100%'
              }}>
                <Picker
                  mode='date'
                  value={dateRange.start}
                  onChange={(e: any) => updateDateRange('start', e.detail.value)}
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
                  onChange={(e: any) => updateDateRange('end', e.detail.value)}
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
                <AtButton
                  type='primary'
                  size='small'
                  onClick={loadChartData}
                  disabled={chartLoading}
                  customStyle={{
                    background: chartLoading ? '#ccc' : '#1B9AEE',
                    padding: '0 16px',
                    height: '36px',
                    lineHeight: '36px',
                    borderRadius: '18px',
                    marginLeft: 'auto'
                  }}
                >
                  {chartLoading ? '查询' : '查询'}
                </AtButton>
              </View>
            </View>

            {/* 图表区域 */}
            <View style={{
              minHeight:'300px',
              background:'#fafafa',
              borderRadius:'8px',
              padding:'16px'
            }}>
              {chartData.length > 0 || nodeData.length > 0 ? (
                <View style={{width:'100%',height:'300px'}}>
                  <EcCanvas
                    option={nodeData.length > 0 ? nodeChartOption : chartOption}
                    canvasId='chart-canvas'
                    style={{width:'100%',height:'300px'}}
                  />
                </View>
              ) : chartLoading ? (
                <View style={{display:'flex',justifyContent:'center',alignItems:'center',height:'300px'}}>
                  <Text style={{fontSize:'14px',color:'#666'}}>查询中...</Text>
                </View>
              ) : (
                <View style={{display:'flex',justifyContent:'center',alignItems:'center',height:'300px'}}>
                  <Text style={{fontSize:'14px',color:'#999'}}>暂无数据，请选择参数和时间范围后点击查询</Text>
                </View>
              )}
            </View>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

