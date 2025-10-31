import React, { useRef, useEffect } from 'react'
import { Canvas, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import * as echarts from 'echarts/core'
import {
  LineChart,
  BarChart
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  LineChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer
])

interface EcCanvasProps {
  option: any
  canvasId?: string
  style?: any
  className?: string
}

export default function EcCanvas({ option, canvasId = 'chart-canvas', style, className }: EcCanvasProps) {
  const chartInstanceRef = useRef<echarts.ECharts | null>(null)
  const containerRef = useRef<any>(null)

  useEffect(() => {
    if (!option) {
      // 如果没有option，清理图表
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose()
        chartInstanceRef.current = null
      }
      return
    }

    // 延迟执行以确保 DOM 已经渲染
    const timer = setTimeout(() => {
      const query = Taro.createSelectorQuery()
      query.select(`#${canvasId}`)
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res || !res[0]) {
            console.warn('Canvas节点未找到')
            return
          }

          const canvas = res[0].node
          if (!canvas) {
            console.warn('Canvas节点为空')
            return
          }

          const dpr = Taro.getSystemInfoSync().pixelRatio || 1
          const width = res[0].width || 300
          const height = res[0].height || 300

          // 初始化图表
          if (chartInstanceRef.current) {
            try {
              chartInstanceRef.current.dispose()
            } catch (e) {
              console.warn('清理图表失败:', e)
            }
            chartInstanceRef.current = null
          }

          try {
            // 设置canvas尺寸
            canvas.width = width * dpr
            canvas.height = height * dpr
            
            const ctx = canvas.getContext('2d')
            if (ctx) {
              ctx.scale(dpr, dpr)
            }

            // 初始化 ECharts
            const chart = echarts.init(canvas as any, null, {
              width: width,
              height: height,
              devicePixelRatio: dpr
            })

            chartInstanceRef.current = chart
            chart.setOption(option, true) // 第二个参数表示不合并，完全替换
          } catch (error) {
            console.error('图表初始化失败:', error)
          }
        })
    }, 300) // 增加延迟时间确保DOM渲染完成

    return () => {
      clearTimeout(timer)
      if (chartInstanceRef.current) {
        try {
          chartInstanceRef.current.dispose()
        } catch (e) {
          console.warn('清理图表失败:', e)
        }
        chartInstanceRef.current = null
      }
    }
  }, [option, canvasId])

  return (
    <View ref={containerRef} style={{ width: '100%', height: '100%', ...style }} className={className}>
      <Canvas
        id={canvasId}
        canvasId={canvasId}
        type='2d'
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  )
}

