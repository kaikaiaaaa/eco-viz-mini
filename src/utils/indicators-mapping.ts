// 指标映射配置

export interface IndicatorsMappingType {
  parameter: string
  name: string
  unit: string
  transform?: (value: any) => string
}

// 干旱等级列表
const droughtLevelList = [
  { label: '无旱', value: 1 },
  { label: '轻旱', value: 2 },
  { label: '中旱', value: 3 },
  { label: '重旱', value: 4 },
  { label: '特旱', value: 5 }
]

// 气象指标参数映射
export const weatherIndicatorsMapping: IndicatorsMappingType[] = [
  { parameter: 'annualRainfall', name: '年度降雨量', unit: 'mm' },
  { parameter: 'annualAccumulatedTemperature', name: '年度积温', unit: '' },
  { 
    parameter: 'strongWind', 
    name: '大风预警', 
    unit: '', 
    transform: (value: boolean) => value ? '存在风险' : '无' 
  },
  { 
    parameter: 'frost', 
    name: '霜冻预警', 
    unit: '', 
    transform: (value: boolean) => value ? '存在风险' : '无' 
  },
  { 
    parameter: 'drought', 
    name: '干旱识别', 
    unit: '', 
    transform: (level: number) => {
      const drought = droughtLevelList.find(item => item.value === level)
      return drought ? drought.label : '未知'
    }
  },
  { 
    parameter: 'highTemperature', 
    name: '高温预警', 
    unit: '', 
    transform: (value: boolean) => value ? '存在风险' : '无' 
  }
]

// 墒情分析数据映射
export const moistureAnalysisMapping: IndicatorsMappingType[] = [
  { parameter: 'waterStorage', name: '当前储水量', unit: 'mm' },
  { parameter: 'etc', name: '昨日蒸发蒸腾量ET', unit: 'mm' },
  { parameter: 'et0T7', name: '未来7日ET0', unit: 'mm' },
  { parameter: 'rainfallT7', name: '未来7日降雨量', unit: 'mm' },
  { parameter: 'rootDepth', name: '当前根系深度', unit: 'cm' },
  { parameter: 'layeringEtPercent', name: '平均灌溉速率', unit: '%/h' }
]

// 根据设备类型获取指标参数列表
export const getIndicatorParameters = (deviceType: string): string[] => {
  if (deviceType === '1') {
    // 墒情设备
    return ['waterStorage', 'etc', 'et0T7', 'rainfallT7', 'rootDepth', 'layeringEtPercent']
  } else if (deviceType === '2') {
    // 气象设备
    return ['annualRainfall', 'annualAccumulatedTemperature', 'strongWind', 'frost', 'drought', 'highTemperature']
  }
  return []
}

// 根据设备类型获取指标映射
export const getIndicatorMapping = (deviceType: string): IndicatorsMappingType[] => {
  if (deviceType === '1') {
    return moistureAnalysisMapping
  } else if (deviceType === '2') {
    return weatherIndicatorsMapping
  }
  return []
}

