import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, Input, Picker } from '@tarojs/components'
import { AtButton, AtActivityIndicator, AtMessage } from 'taro-ui'
import Taro from '@tarojs/taro'
import api from '../../utils/api'
import 'taro-ui/dist/style/index.scss'
import './index.scss'

// 根据设备类型获取参数列表
const getParametersByDeviceType = (deviceType: string): string[] => {
  if (deviceType === '1') {
    // 墒情设备参数
    return ['moisture', 'temperature', 'battery', 'outsideVoltage']
  } else if (deviceType === '2') {
    // 气象设备参数
    return ['rainfall', 'airTemperature', 'relativeHumidity', 'atmosphericPressure', 'averageWindSpeed', 'windDirection', 'solarRadiationIntensity', 'solarRadiationAmount', 'sunshineDuration', 'battery', 'outsideVoltage']
  }
  return []
}

const MULTI_NODE_PARAMETERS = new Set(['moisture', 'temperature'])
const NODE_DEPTH_OPTIONS = ['10', '20', '30', '40', '50', '60']

const buildNodeScopeRangeOptions = () => {
  const options: Array<{ label: string; value: string }> = [
    { label: '全部节点', value: 'all' }
  ]

  NODE_DEPTH_OPTIONS.forEach((depth) => {
    options.push({
      label: `≤${depth}cm 报警`,
      value: `lte:${depth}`
    })
  })

  NODE_DEPTH_OPTIONS.forEach((depth) => {
    options.push({
      label: `≥${depth}cm 报警`,
      value: `gte:${depth}`
    })
  })

  return options
}

const NODE_SCOPE_OPTIONS = buildNodeScopeRangeOptions()

const isMultiNodeParameter = (parameter: string | undefined | null) => {
  if (!parameter) return false
  return MULTI_NODE_PARAMETERS.has(parameter)
}

const parseNodeScopeFromThreshold = (threshold: any): string => {
  if (!threshold?.nodeScopeType || !threshold?.nodeScopeValue) {
    return 'all'
  }
  return `${threshold.nodeScopeType}:${threshold.nodeScopeValue}`
}

const formatNodeScopeLabel = (value: string) => {
  const option = NODE_SCOPE_OPTIONS.find(item => item.value === value)
  return option ? option.label : '全部节点'
}

export default function DeviceThresholdEditPage() {
  const [deviceId, setDeviceId] = useState<number | null>(null)
  const [deviceSn, setDeviceSn] = useState<string>('')
  const [device, setDevice] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [parameters, setParameters] = useState<Array<{ parameter: string, name: string, unit: string }>>([])
  const [selectedParameter, setSelectedParameter] = useState<string>('')
  const [lowerThreshold, setLowerThreshold] = useState<string>('')
  const [upperThreshold, setUpperThreshold] = useState<string>('')
  const [lowerTouched, setLowerTouched] = useState<boolean>(false)
  const [upperTouched, setUpperTouched] = useState<boolean>(false)
  const [existingThreshold, setExistingThreshold] = useState<Array<any>>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingThresholdId, setEditingThresholdId] = useState<number | null>(null)
  const [nodeScopeSelection, setNodeScopeSelection] = useState<string>('all')

  useEffect(() => {
    const pages = Taro.getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const id = currentPage.options?.deviceId
    const sn = currentPage.options?.deviceSn

    if (sn) {
      setDeviceSn(sn)
    }

    if (id) {
      const parsedId = parseInt(id)
      if (!isNaN(parsedId)) {
        setDeviceId(parsedId)
        loadDeviceDetail(parsedId, sn)
        return
      }
    }

    // 如果没有ID但有SN，尝试提示用户目前无法加载详情
    if (!id) {
      if (!sn) {
        Taro.atMessage({ message: '缺少设备信息', type: 'error' })
      } else {
        Taro.atMessage({ message: '无法加载设备详情，请返回重试', type: 'warning' })
      }
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500)
    }
  }, [])

  const loadDeviceDetail = async (id: number, snHint?: string) => {
    try {
      setLoading(true)
      
      // 加载设备详情
      const deviceResp: any = await api.getDeviceDetail(id)
      if (deviceResp?.code === 0) {
        setDevice(deviceResp.data)
        const resolvedSn = snHint || deviceResp.data?.sn
        if (resolvedSn) {
          setDeviceSn(resolvedSn)
          await loadExistingThresholds(resolvedSn)
        } else {
          Taro.atMessage({ message: '设备SN不存在，无法加载阈值', type: 'error' })
        }
        
        // 加载设备参数列表
        await loadDeviceParameters(deviceResp.data.deviceType)
      } else {
        Taro.atMessage({ message: deviceResp.message || '获取设备详情失败', type: 'error' })
      }
    } catch (e: any) {
      console.error('加载设备详情失败:', e)
      Taro.atMessage({ message: e.message || '获取设备详情失败', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const loadDeviceParameters = async (deviceType: string) => {
    try {
      const parameterNames = getParametersByDeviceType(deviceType)
      
      if (parameterNames.length === 0) {
        Taro.atMessage({ message: '该设备类型暂无可用参数', type: 'warning' })
        return
      }
      
      // 根据参数名称获取参数详情（名称、单位等）
      const resp: any = await api.getParametersInfo(parameterNames)
      
      if (resp?.code === 0 && resp.data) {
        const params = Array.isArray(resp.data) ? resp.data : []
        
        // 按照预定义的顺序排序
        const orderedParams = parameterNames
          .map(name => params.find((p: any) => p.parameter === name))
          .filter(Boolean) as Array<{ parameter: string, name: string, unit: string }>
        
        setParameters(orderedParams)
        
        if (orderedParams.length > 0 && !selectedParameter) {
          setSelectedParameter(orderedParams[0].parameter)
        }
      } else {
        Taro.atMessage({ message: resp?.message || '获取参数详情失败', type: 'error' })
      }
    } catch (e: any) {
      console.error('获取参数详情失败:', e)
      Taro.atMessage({ message: e.message || '获取参数详情失败', type: 'error' })
    }
  }

  const loadExistingThresholds = async (sn: string) => {
    try {
      const resp: any = await api.getDeviceThresholds(sn)
      if (resp?.code === 0 && resp.data) {
        // 如果有现有的阈值配置，可以在选择参数时自动填充
        // 这里暂时只存储，等用户选择参数时再填充
        setExistingThreshold(Array.isArray(resp.data) ? resp.data : [])
      } else {
        setExistingThreshold([])
      }
    } catch (e: any) {
      console.error('获取阈值配置失败:', e)
      // 不显示错误，因为可能是第一次设置阈值
    }
  }

  // 当选择或加载编辑的阈值时自动填充
  useEffect(() => {
    if (!isEditing || !editingThresholdId) {
      return
    }

    const threshold = existingThreshold.find((t: any) => t.id === editingThresholdId)
    if (threshold) {
      setSelectedParameter(threshold.parameter)
      setLowerThreshold(threshold.lowerThreshold !== null ? String(threshold.lowerThreshold) : '')
      setUpperThreshold(threshold.upperThreshold !== null ? String(threshold.upperThreshold) : '')
      setNodeScopeSelection(parseNodeScopeFromThreshold(threshold))
    }
  }, [isEditing, editingThresholdId, existingThreshold])

  const handleParameterChange = (value: string) => {
    setSelectedParameter(value)
    setLowerThreshold('')
    setUpperThreshold('')
    setNodeScopeSelection('all')
    setLowerTouched(false)
    setUpperTouched(false)
    setIsEditing(false)
    setEditingThresholdId(null)
  }

  const handleSubmit = async () => {
    if (!selectedParameter) {
      Taro.atMessage({ message: '请选择参数', type: 'warning' })
      return
    }

    const editingThreshold = isEditing && editingThresholdId
      ? existingThreshold.find((t: any) => t.id === editingThresholdId)
      : null

    // 验证数值
    let lower: number | null = null
    let upper: number | null = null

    if (lowerThreshold.trim()) {
      lower = parseFloat(lowerThreshold.trim())
      if (isNaN(lower) || !isFinite(lower)) {
        Taro.atMessage({ message: '下限阈值必须是有效数字', type: 'warning' })
        return
      }
    } else if (isEditing && !lowerTouched && editingThreshold && editingThreshold.lowerThreshold !== null) {
      lower = editingThreshold.lowerThreshold
    }

    if (upperThreshold.trim()) {
      upper = parseFloat(upperThreshold.trim())
      if (isNaN(upper) || !isFinite(upper)) {
        Taro.atMessage({ message: '上限阈值必须是有效数字', type: 'warning' })
        return
      }
    } else if (isEditing && !upperTouched && editingThreshold && editingThreshold.upperThreshold !== null) {
      upper = editingThreshold.upperThreshold
    }

    if (lower === null && upper === null) {
      Taro.atMessage({ message: '下限阈值和上限阈值不能同时为空', type: 'warning' })
      return
    }

    // 验证上下限逻辑
    if (lower !== null && upper !== null && lower >= upper) {
      Taro.atMessage({ message: '下限阈值必须小于上限阈值', type: 'warning' })
      return
    }

    if (!deviceSn) {
      Taro.atMessage({ message: '设备SN不存在', type: 'error' })
      return
    }

    let scopeType: 'lte' | 'gte' | null = null
    let scopeValue: string | null = null
    if (isMultiNodeParameter(selectedParameter) && nodeScopeSelection !== 'all') {
      const [type, value] = nodeScopeSelection.split(':')
      if ((type === 'lte' || type === 'gte') && value) {
        scopeType = type
        scopeValue = value
      }
    }

    const payload: {
      id?: number
      parameter: string
      lowerThreshold: number | null
      upperThreshold: number | null
      enabled: boolean
      nodeScopeType: 'lte' | 'gte' | null
      nodeScopeValue: string | null
    } = {
      parameter: selectedParameter,
      lowerThreshold: lower,
      upperThreshold: upper,
      enabled: true,
      nodeScopeType: scopeType,
      nodeScopeValue: scopeValue
    }

    if (isEditing && editingThresholdId) {
      payload.id = editingThresholdId
    }

    try {
      setSaving(true)
      const resp: any = await api.saveDeviceThreshold(deviceSn, payload)

      if (resp?.code === 0) {
        Taro.atMessage({ message: '阈值配置保存成功', type: 'success' })
        // 重新加载阈值列表
        await loadExistingThresholds(deviceSn)
        // 清空输入框，准备设置下一个
        setLowerThreshold('')
        setUpperThreshold('')
        setIsEditing(false)
        setEditingThresholdId(null)
        setLowerTouched(false)
        setUpperTouched(false)
        if (isMultiNodeParameter(selectedParameter)) {
          setNodeScopeSelection('all')
        }
      } else {
        Taro.atMessage({ message: resp.message || '保存失败', type: 'error' })
      }
    } catch (e: any) {
      console.error('保存阈值配置失败:', e)
      Taro.atMessage({ message: e.message || '保存失败', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteThreshold = async (threshold: any) => {
    Taro.showModal({
      title: '确认删除',
      content: `确定要删除参数"${getParameterName(threshold.parameter)}"的阈值配置吗？`,
      success: async (res) => {
        if (res.confirm && deviceSn) {
          try {
            const resp: any = await api.deleteDeviceThreshold(deviceSn, threshold.id)
            if (resp?.code === 0) {
              Taro.atMessage({ message: '删除成功', type: 'success' })
              // 重新加载阈值列表
              await loadExistingThresholds(deviceSn)
              // 如果删除的是当前正在编辑的阈值，清空输入框
              if (isEditing && editingThresholdId === threshold.id) {
                setLowerThreshold('')
                setUpperThreshold('')
                setNodeScopeSelection('all')
                setIsEditing(false)
                setEditingThresholdId(null)
                setLowerTouched(false)
                setUpperTouched(false)
              }
            } else {
              Taro.atMessage({ message: resp.message || '删除失败', type: 'error' })
            }
          } catch (e: any) {
            console.error('删除阈值配置失败:', e)
            Taro.atMessage({ message: e.message || '删除失败', type: 'error' })
          }
        }
      }
    })
  }

  const handleEditThreshold = (threshold: any) => {
    // 切换到该参数并填充值
    setSelectedParameter(threshold.parameter)
    setLowerThreshold(threshold.lowerThreshold !== null ? String(threshold.lowerThreshold) : '')
    setUpperThreshold(threshold.upperThreshold !== null ? String(threshold.upperThreshold) : '')
    setNodeScopeSelection(parseNodeScopeFromThreshold(threshold))
    setLowerTouched(false)
    setUpperTouched(false)
    setIsEditing(true)
    setEditingThresholdId(threshold.id)
    // 滚动到输入区域
    setTimeout(() => {
      Taro.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    }, 100)
  }

  const getParameterName = (parameter: string) => {
    const param = parameters.find(p => p.parameter === parameter)
    return param?.name || parameter
  }

  const getParameterUnit = (parameter: string) => {
    const param = parameters.find(p => p.parameter === parameter)
    return param?.unit || ''
  }

  const currentNodeScopeLabel = useMemo(() => formatNodeScopeLabel(nodeScopeSelection), [nodeScopeSelection])
  const shouldShowNodeScopeSelector = isMultiNodeParameter(selectedParameter)

  const getThresholdNodeScopeLabel = (threshold: any) => {
    if (!isMultiNodeParameter(threshold?.parameter)) {
      return null
    }
    return formatNodeScopeLabel(parseNodeScopeFromThreshold(threshold))
  }

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
    <View className='device-threshold-edit-page'>
      <AtMessage />
      
      <View style={{padding:'20px'}}>
        {/* 已设置的阈值配置列表 */}
        {existingThreshold.length > 0 && (
          <View style={{
            background:'#fff',
            borderRadius:'12px',
            padding:'20px',
            marginBottom:'16px',
            boxShadow:'0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <View style={{
              display:'flex',
              alignItems:'center',
              marginBottom:'16px',
              paddingBottom:'16px',
              borderBottom:'1px solid #f0f0f0'
            }}>
              <View style={{
                width:'4px',
                height:'16px',
                background:'#1B9AEE',
                marginRight:'8px',
                borderRadius:'2px'
              }}></View>
              <Text style={{fontSize:'16px',fontWeight:600,color:'#222'}}>已设置的阈值配置</Text>
            </View>

            {existingThreshold.map((threshold: any) => {
              const paramName = getParameterName(threshold.parameter)
              const paramUnit = getParameterUnit(threshold.parameter)
              const scopeLabel = getThresholdNodeScopeLabel(threshold)
              return (
                <View
                  key={threshold.id}
                  style={{
                    padding:'12px',
                    marginBottom:'12px',
                    background:'#f9f9f9',
                    borderRadius:'8px',
                    border:'1px solid #e0e0e0'
                  }}
                >
                  <View style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
                    <Text style={{fontSize:'15px',fontWeight:600,color:'#222'}}>{paramName}</Text>
                    <View style={{display:'flex',gap:'8px'}}>
                      <Text
                        onClick={() => handleEditThreshold(threshold)}
                        style={{
                          fontSize:'13px',
                          color:'#1B9AEE',
                          padding:'4px 12px',
                          borderRadius:'4px',
                          background:'#f0f7ff',
                          cursor:'pointer'
                        }}
                      >
                        编辑
                      </Text>
                      <Text
                        onClick={() => handleDeleteThreshold(threshold)}
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
                  <View style={{display:'flex',flexDirection:'column',gap:'4px'}}>
                    {threshold.lowerThreshold !== null && (
                      <Text style={{fontSize:'13px',color:'#666'}}>
                        下限阈值：{threshold.lowerThreshold.toFixed(2)}{paramUnit ? ' ' + paramUnit : ''}
                      </Text>
                    )}
                    {threshold.upperThreshold !== null && (
                      <Text style={{fontSize:'13px',color:'#666'}}>
                        上限阈值：{threshold.upperThreshold.toFixed(2)}{paramUnit ? ' ' + paramUnit : ''}
                      </Text>
                    )}
                    {scopeLabel && (
                      <Text style={{fontSize:'13px',color:'#666'}}>
                        节点范围：{scopeLabel}
                      </Text>
                    )}
                    {threshold.lowerThreshold === null && threshold.upperThreshold === null && (
                      <Text style={{fontSize:'13px',color:'#999'}}>未设置阈值</Text>
                    )}
                  </View>
                </View>
              )
            })}
          </View>
        )}

        {/* 设备名称和新增阈值配置 */}
        <View style={{
          background:'#fff',
          borderRadius:'12px',
          padding:'20px',
          marginBottom:'16px',
          boxShadow:'0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <View style={{
            display:'flex',
            alignItems:'center',
            marginBottom:'20px',
            paddingBottom:'16px',
            borderBottom:'1px solid #f0f0f0'
          }}>
            <View style={{
              width:'4px',
              height:'16px',
              background:'#1B9AEE',
              marginRight:'8px',
              borderRadius:'2px'
            }}></View>
            <Text style={{fontSize:'16px',fontWeight:600,color:'#222'}}>
              {isEditing ? '编辑阈值配置' : '新增阈值配置'}
            </Text>
          </View>

          <View style={{marginBottom:'16px'}}>
            <Text style={{fontSize:'14px',color:'#999',display:'block',marginBottom:'8px'}}>设备名称</Text>
            <View style={{
              padding:'12px',
              border:'1px solid #e0e0e0',
              borderRadius:'8px',
              background:'#f9f9f9'
            }}>
              <Text style={{fontSize:'14px',color:'#222'}}>
                {device.alias || device.name || device.sn}
              </Text>
            </View>
          </View>

          {/* 参数选择 */}
          <View style={{marginBottom:'16px'}}>
            <Text style={{fontSize:'14px',color:'#999',display:'block',marginBottom:'8px'}}>参数</Text>
            <Picker
              mode='selector'
              range={parameters}
              rangeKey='name'
              value={parameters.findIndex(p => p.parameter === selectedParameter)}
              onChange={(e: any) => {
                const index = e.detail.value
                if (parameters[index]) {
                  handleParameterChange(parameters[index].parameter)
                }
              }}
            >
              <View style={{
                padding:'12px',
                border:'1px solid #e0e0e0',
                borderRadius:'8px',
                background:'#fff',
                display:'flex',
                justifyContent:'space-between',
                alignItems:'center'
              }}>
                <Text style={{fontSize:'14px',color:'#222'}}>
                  {selectedParameter ? getParameterName(selectedParameter) : '请选择参数'}
                </Text>
                <Text style={{fontSize:'14px',color:'#999'}}>›</Text>
              </View>
            </Picker>
          </View>

          {shouldShowNodeScopeSelector && (
            <View style={{marginBottom:'16px'}}>
              <Text style={{fontSize:'14px',color:'#999',display:'block',marginBottom:'8px'}}>节点范围</Text>
              <Picker
                mode='selector'
                range={NODE_SCOPE_OPTIONS}
                rangeKey='label'
                value={NODE_SCOPE_OPTIONS.findIndex(option => option.value === nodeScopeSelection)}
                onChange={(e: any) => {
                  const index = e.detail.value
                  if (NODE_SCOPE_OPTIONS[index]) {
                    setNodeScopeSelection(NODE_SCOPE_OPTIONS[index].value)
                  }
                }}
              >
                <View style={{
                  padding:'12px',
                  border:'1px solid #e0e0e0',
                  borderRadius:'8px',
                  background:'#fff',
                  display:'flex',
                  justifyContent:'space-between',
                  alignItems:'center'
                }}>
                  <Text style={{fontSize:'14px',color:'#222'}}>
                    {currentNodeScopeLabel}
                  </Text>
                  <Text style={{fontSize:'14px',color:'#999'}}>›</Text>
                </View>
              </Picker>
              <Text style={{fontSize:'12px',color:'#999',marginTop:'8px',display:'block'}}>
                选择需要监控的节点范围，例如“≤40cm 报警”代表监控地表至40cm范围内的节点。
              </Text>
            </View>
          )}

          {/* 下限阈值 */}
          <View style={{marginBottom:'16px'}}>
            <Text style={{fontSize:'14px',color:'#999',display:'block',marginBottom:'8px'}}>下限阈值</Text>
            <View style={{position:'relative'}}>
              <Input
                type='digit'
                value={lowerThreshold}
                onInput={(e: any) => {
                  setLowerThreshold(e.detail.value)
                  setLowerTouched(true)
                }}
                placeholder='请输入下限阈值'
                placeholderStyle='color:#999'
                style={{
                  padding:'12px',
                  border:'1px solid #e0e0e0',
                  borderRadius:'8px',
                  background:'#fff',
                  fontSize:'14px',
                  color:'#222'
                }}
              />
              {lowerThreshold && (
                <Text
                  onClick={() => {
                    setLowerThreshold('')
                    setLowerTouched(true)
                  }}
                  style={{
                    position:'absolute',
                    right:'12px',
                    top:'50%',
                    transform:'translateY(-50%)',
                    color:'#999',
                    fontSize:'18px',
                    cursor:'pointer'
                  }}
                >×</Text>
              )}
            </View>
          </View>

          {/* 上限阈值 */}
          <View style={{marginBottom:'20px'}}>
            <Text style={{fontSize:'14px',color:'#999',display:'block',marginBottom:'8px'}}>上限阈值</Text>
            <View style={{position:'relative'}}>
              <Input
                type='digit'
                value={upperThreshold}
                onInput={(e: any) => {
                  setUpperThreshold(e.detail.value)
                  setUpperTouched(true)
                }}
                placeholder='请输入上限阈值'
                placeholderStyle='color:#999'
                style={{
                  padding:'12px',
                  border:'1px solid #e0e0e0',
                  borderRadius:'8px',
                  background:'#fff',
                  fontSize:'14px',
                  color:'#222'
                }}
              />
              {upperThreshold && (
                <Text
                  onClick={() => {
                    setUpperThreshold('')
                    setUpperTouched(true)
                  }}
                  style={{
                    position:'absolute',
                    right:'12px',
                    top:'50%',
                    transform:'translateY(-50%)',
                    color:'#999',
                    fontSize:'18px',
                    cursor:'pointer'
                  }}
                >×</Text>
              )}
            </View>
          </View>
        </View>

        {/* 提交按钮 */}
        <AtButton
          type='primary'
          onClick={handleSubmit}
          disabled={saving}
          customStyle={{
            background: saving ? '#ccc' : '#1B9AEE',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600
          }}
        >
          {saving ? '提交中...' : '提交'}
        </AtButton>
      </View>
    </View>
  )
}

