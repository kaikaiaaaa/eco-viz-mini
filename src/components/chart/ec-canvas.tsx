import React, { useRef, useEffect, useCallback } from 'react'
import { Canvas, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import echarts from '../../assets/echarts.min.js'

type CanvasLike = {
  width?: number
  height?: number
  getContext: (type: string) => any
}

const createFallbackContext = (canvasNode: any) => {
  return {
    canvas: canvasNode,
    scale: function () {},
    measureText: function (text: string) {
      if (!text) {
        return { width: 0, height: 12 }
      }
      const chineseCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length
      const otherCount = text.length - chineseCount
      return {
        width: chineseCount * 12 + otherCount * 6,
        height: 12
      }
    },
    fillText: function () {},
    strokeText: function () {},
    fillRect: function () {},
    strokeRect: function () {},
    clearRect: function () {},
    beginPath: function () {},
    closePath: function () {},
    moveTo: function () {},
    lineTo: function () {},
    quadraticCurveTo: function () {},
    bezierCurveTo: function () {},
    arc: function () {},
    fill: function () {},
    stroke: function () {},
    save: function () {},
    restore: function () {},
    translate: function () {},
    rotate: function () {},
    transform: function () {},
    setTransform: function () {},
    drawImage: function () {},
    getImageData: function () {},
    putImageData: function () {},
    createImageData: function () {},
    set fillStyle(val: any) {},
    get fillStyle() {
      return '#000'
    },
    set strokeStyle(val: any) {},
    get strokeStyle() {
      return '#000'
    },
    set lineWidth(val: any) {},
    get lineWidth() {
      return 1
    },
    set font(val: any) {},
    get font() {
      return '12px sans-serif'
    },
    set textAlign(val: any) {},
    get textAlign() {
      return 'left'
    },
    set textBaseline(val: any) {},
    get textBaseline() {
      return 'alphabetic'
    },
    set globalAlpha(val: any) {},
    get globalAlpha() {
      return 1
    },
    set globalCompositeOperation(val: any) {},
    get globalCompositeOperation() {
      return 'source-over'
    },
    set imageSmoothingEnabled(val: any) {},
    get imageSmoothingEnabled() {
      return true
    }
  }
}

const createFallbackCanvas = () => {
  const fallbackContext = createFallbackContext(null)
  const canvas: CanvasLike = {
    width: 300,
    height: 150,
    getContext(type: string) {
      if (type === '2d') {
        return fallbackContext
      }
      return null
    }
  }
  return canvas
}

let platformInitialized = false

interface EcCanvasProps {
  option: any
  canvasId?: string
  style?: any
  className?: string
}

export default function EcCanvas({ option, canvasId = 'chart-canvas', style, className }: EcCanvasProps) {
  const chartInstanceRef = useRef<any>(null)
  const containerRef = useRef<any>(null)

  const wrapTouch = useCallback((event: any) => {
    if (!event) {
      return event
    }
    const touches = event.touches
    if (touches && touches.length > 0) {
      const primary = touches[0]
      const primaryX = primary?.x ?? primary?.clientX ?? primary?.pageX ?? 0
      const primaryY = primary?.y ?? primary?.clientY ?? primary?.pageY ?? 0
      for (let i = 0; i < touches.length; i += 1) {
        const touch = touches[i]
        if (touch) {
          const x = touch.x ?? touch.clientX ?? touch.pageX ?? 0
          const y = touch.y ?? touch.clientY ?? touch.pageY ?? 0
          touch.offsetX = x
          touch.offsetY = y
        }
      }
      event.zrX = primaryX
      event.zrY = primaryY
    }
    const changedTouches = event.changedTouches
    if ((!event.zrX || !event.zrY) && changedTouches && changedTouches.length > 0) {
      const touch = changedTouches[0]
      const x = touch.x ?? touch.clientX ?? touch.pageX ?? 0
      const y = touch.y ?? touch.clientY ?? touch.pageY ?? 0
      event.zrX = x
      event.zrY = y
    }
    return event
  }, [])

  const handleTouchStart = useCallback((event: any) => {
    const chart = chartInstanceRef.current
    if (!chart) return
    const touchEvent = wrapTouch(event)
    const handler = chart.getZr().handler
    handler.dispatch('mousedown', touchEvent)
    handler.dispatch('mousemove', touchEvent)
    handler.processGesture(touchEvent, 'start')
  }, [wrapTouch])

  const handleTouchMove = useCallback((event: any) => {
    const chart = chartInstanceRef.current
    if (!chart) return
    const touchEvent = wrapTouch(event)
    const handler = chart.getZr().handler
    handler.dispatch('mousemove', touchEvent)
    handler.processGesture(touchEvent, 'change')
  }, [wrapTouch])

  const handleTouchEnd = useCallback((event: any) => {
    const chart = chartInstanceRef.current
    if (!chart) return
    const touchEvent = wrapTouch(event)
    const handler = chart.getZr().handler
    handler.dispatch('mouseup', touchEvent)
    handler.dispatch('click', touchEvent)
    handler.processGesture(touchEvent, 'end')
  }, [wrapTouch])

  useEffect(() => {
    if (!option) {
      // 如果没有option，清理图表
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose()
        chartInstanceRef.current = null
      }
      return
    }

    // 辅助函数：初始化图表
    const ensurePlatformAPI = (primaryCanvas: any) => {
      if (platformInitialized || typeof echarts.setPlatformAPI !== 'function') {
        return
      }

      try {
        echarts.setPlatformAPI({
          createCanvas: () => {
            try {
              // 优先尝试使用小程序的离屏 Canvas
              const offscreenCanvas = typeof primaryCanvas?.createOffscreenCanvas === 'function'
                ? primaryCanvas.createOffscreenCanvas(primaryCanvas.width || 300, primaryCanvas.height || 150)
                : (typeof Taro?.createOffscreenCanvas === 'function'
                  ? Taro.createOffscreenCanvas({
                      type: '2d',
                      width: primaryCanvas?.width || 300,
                      height: primaryCanvas?.height || 150
                    })
                  : null)

              if (offscreenCanvas && typeof offscreenCanvas.getContext === 'function') {
                return offscreenCanvas as unknown as CanvasLike
              }
            } catch (error) {
              console.debug('创建离屏Canvas失败，使用兜底实现:', error)
            }

            return createFallbackCanvas()
          }
        })
        platformInitialized = true
      } catch (error) {
        console.debug('设置ECharts平台API失败:', error)
      }
    }

    const initializeChart = (canvasNode: any, canvasWidth: number, canvasHeight: number) => {
      // 清理旧图表实例
      if (chartInstanceRef.current) {
        try {
          chartInstanceRef.current.dispose()
        } catch (e) {
          console.warn('清理图表失败:', e)
        }
        chartInstanceRef.current = null
      }

      if (!canvasNode) {
        console.error('Canvas节点无效')
        return
      }

      try {
        const dpr = Taro.getSystemInfoSync().pixelRatio || 1
        
        // 设置canvas尺寸
        canvasNode.width = canvasWidth * dpr
        canvasNode.height = canvasHeight * dpr
        
        // 首先尝试获取真实的上下文
        let cachedRealContext: any = null
        
        // 保存原始的 getContext 方法（如果存在）
        const originalGetContext = typeof canvasNode.getContext === 'function' ? canvasNode.getContext.bind(canvasNode) : null
        
        // 尝试获取一次上下文并缓存
        try {
          if (originalGetContext) {
            cachedRealContext = originalGetContext('2d')
            if (cachedRealContext && typeof cachedRealContext.scale === 'function') {
              cachedRealContext.scale(dpr, dpr)
            }
          }
        } catch (e) {
          console.debug('获取Canvas上下文失败:', e)
        }
        
        // 创建一个备选的上下文对象
        const fallbackContext: any = createFallbackContext(canvasNode)
        
        // 始终确保 getContext 方法存在且可用
        // 这样可以处理后续 ECharts 内部的调用
        canvasNode.getContext = function(type: string) {
          if (type === '2d') {
            // 优先使用缓存的真实上下文
            if (cachedRealContext) {
              return cachedRealContext
            }
            
            // 如果原方法存在，尝试调用并缓存结果
            if (originalGetContext) {
              try {
                const ctx = originalGetContext('2d')
                if (ctx) {
                  cachedRealContext = ctx
                  return ctx
                }
              } catch (e) {
                console.debug('调用原始getContext失败:', e)
              }
            }
            
            // 返回备选的上下文对象
            return fallbackContext
          }
          return null
        }
        
        // 如果之前没有获取到真实上下文，现在尝试获取一次
        if (!cachedRealContext) {
          try {
            cachedRealContext = canvasNode.getContext('2d')
          } catch (e) {
            console.debug('通过包装方法获取上下文失败:', e)
          }
        }

        ensurePlatformAPI(canvasNode)

        // 为小程序 Canvas 添加必要的 DOM 方法
        if (!canvasNode.addEventListener) {
          canvasNode.addEventListener = () => {}
        }
        if (!canvasNode.removeEventListener) {
          canvasNode.removeEventListener = () => {}
        }
        Object.defineProperty(canvasNode, 'clientWidth', {
          get: () => canvasWidth,
          configurable: true
        })
        Object.defineProperty(canvasNode, 'clientHeight', {
          get: () => canvasHeight,
          configurable: true
        })
        if (!canvasNode.style) {
          canvasNode.style = {}
        }

        // 初始化 ECharts - ECharts会自动处理Canvas上下文
        const chart = echarts.init(canvasNode as any, null, {
          width: canvasWidth,
          height: canvasHeight,
          devicePixelRatio: dpr
        })

        chartInstanceRef.current = chart
        chart.setOption(option, true)
      } catch (error) {
        console.error('初始化图表失败:', error)
      }
    }

    // 延迟执行以确保 DOM 已经渲染
    const timer = setTimeout(() => {
      const query = Taro.createSelectorQuery()
      query.select(`#${canvasId}`)
        .fields({ node: true, size: true })
        .exec((res) => {
          if (!res || !res[0]) {
            console.warn('Canvas节点未找到，尝试重新获取')
            // 重试一次
            setTimeout(() => {
              const retryQuery = Taro.createSelectorQuery()
              retryQuery.select(`#${canvasId}`)
                .fields({ node: true, size: true })
                .exec((retryRes) => {
                  if (retryRes && retryRes[0] && retryRes[0].node) {
                    initializeChart(retryRes[0].node, retryRes[0].width || 300, retryRes[0].height || 300)
                  } else {
                    console.error('重试后仍无法获取Canvas节点')
                  }
                })
            }, 200)
            return
          }

          const canvas = res[0].node
          if (!canvas) {
            console.warn('Canvas节点为空，尝试重新获取')
            // 重试一次
            setTimeout(() => {
              const retryQuery = Taro.createSelectorQuery()
              retryQuery.select(`#${canvasId}`)
                .fields({ node: true, size: true })
                .exec((retryRes) => {
                  if (retryRes && retryRes[0] && retryRes[0].node) {
                    initializeChart(retryRes[0].node, retryRes[0].width || 300, retryRes[0].height || 300)
                  } else {
                    console.error('重试后仍无法获取Canvas节点')
                  }
                })
            }, 200)
            return
          }

          const width = res[0].width || 300
          const height = res[0].height || 300

          // 使用nextTick确保Canvas完全准备好
          Taro.nextTick(() => {
            initializeChart(canvas, width, height)
          })
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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    </View>
  )
}

