"use client"

import { useEffect, useMemo, useRef, useState, useCallback } from "react"
import {
  type IChartApi,
  type CandlestickData,
  CandlestickSeries,
  AreaSeries,
  LineSeries,
  UTCTimestamp,
  CrosshairMode,
  type ISeriesApi,
  type MouseEventParams,
  type Time,
} from "lightweight-charts"
import { useTheme } from "next-themes"
import { useChartData } from "../hooks/use-chart-data"
import {
  calculateMA,
  calculateEMA,
  calculateBB,
  calculateRSI,
  calculateMACD,
  calculateStoch,
} from "../lib/technical-indicators"
import { MiniIndicatorChart } from "./mini-chart"

interface TrendLinePoint {
  time: Time
  price: number
}

interface CandlestickChartProps {
  readonly ticker: string
  readonly period: string
  readonly chartType: "candle" | "line"
  readonly containerClassName?: string
  readonly candlesPerPage?: number
  readonly isHorizontalToolActive: boolean
  readonly isVerticalToolActive: boolean
  readonly isFullScreen?: boolean
  readonly isTrendLineToolActive?: boolean
  readonly isSaveChart?: boolean
  readonly technicalIndicators?: string[]
}

export function CandlestickChart({
  ticker,
  period,
  chartType,
  containerClassName = "h-400 w-full",
  candlesPerPage = 300,
  isHorizontalToolActive = false,
  isVerticalToolActive = false,
  isFullScreen = false,
  isTrendLineToolActive = false,
  isSaveChart = false,
  technicalIndicators,
}: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<"Candlestick" | "Area"> | null>(null)
  const trendlineSeriesRef = useRef<ISeriesApi<"Line"> | null>(null)
  const indicatorSeriesRef = useRef<Map<string, ISeriesApi<"Line">>>(new Map())
  const verticalLinesRef = useRef<ISeriesApi<"Line">[]>([])
  const eventHandlersRef = useRef<{
    click?: (param: MouseEventParams<Time>) => void
    crosshairMove?: (param: MouseEventParams<Time>) => void
  }>({})

  const { theme } = useTheme()
  const { data: chartData, isLoading, isError } = useChartData(ticker, period)

  const [currentPage, setCurrentPage] = useState(1)
  const [trendlineActive, setTrendlineActive] = useState(false)
  const [startPoint, setStartPoint] = useState<TrendLinePoint | null>(null)

  // Memoize paginated data
  const paginatedData = useMemo(() => {
    if (!chartData?.length) return []
    
    const end = chartData.length
    const start = Math.max(0, end - candlesPerPage * currentPage)

    return chartData
      .slice(start, end)
      .map((item) => ({
        time: item.date as Time,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        value: item.close,
      }))
  }, [chartData, candlesPerPage, currentPage])

  // Precompute technical indicators
  const indicatorData = useMemo(() => {
    if (!paginatedData.length || !technicalIndicators?.length) return {}

    const indicators: Record<string, any[]> = {}

    technicalIndicators.forEach((indicator) => {
      switch (indicator) {
        case "ma":
          indicators.ma = calculateMA(paginatedData, 14).filter(
            (point) => point !== null
          )
          break
        case "ema":
          indicators.ema = calculateEMA(paginatedData, 14)
          break
        case "bb":
          indicators.bb = calculateBB(paginatedData, 20, 2)
          break
        case "rsi":
          indicators.rsi = calculateRSI(paginatedData, 14)
          break
        case "macd":
          indicators.macd = calculateMACD(paginatedData)
          break
        case "stoch":
          indicators.stoch = calculateStoch(paginatedData, 14, 3, 3)
          break
      }
    })

    return indicators
  }, [paginatedData, technicalIndicators])

  // Filter mini chart indicators
  const miniChartIndicators = useMemo(() => {
    return technicalIndicators?.filter(i => ["stoch", "macd", "rsi"].includes(i)) || []
  }, [technicalIndicators])

  const miniChartData = useMemo(() => {
    if (!miniChartIndicators.length) return {}
    
    const data: Record<string, any> = {}
    miniChartIndicators.forEach(indicator => {
      if (indicatorData[indicator]) {
        data[indicator] = indicatorData[indicator]
      }
    })
    return data
  }, [miniChartIndicators, indicatorData])

  // Complete chart cleanup
  const cleanupChart = useCallback(() => {
    // Unsubscribe all event handlers
    if (chartRef.current && eventHandlersRef.current.click) {
      chartRef.current.unsubscribeClick(eventHandlersRef.current.click)
    }
    if (chartRef.current && eventHandlersRef.current.crosshairMove) {
      chartRef.current.unsubscribeCrosshairMove(eventHandlersRef.current.crosshairMove)
    }

    // Clear all series references
    seriesRef.current = null
    trendlineSeriesRef.current = null
    indicatorSeriesRef.current.clear()
    verticalLinesRef.current = []

    // Remove chart instance
    if (chartRef.current) {
      chartRef.current.remove()
      chartRef.current = null
    }

    // Clear container
    if (chartContainerRef.current) {
      chartContainerRef.current.innerHTML = ""
    }

    // Clear event handlers reference
    eventHandlersRef.current = {}
  }, [])

  const initializeChart = useCallback(async () => {
    if (!chartContainerRef.current || !paginatedData.length) return null

    const { createChart } = await import("lightweight-charts")
    const containerRect = chartContainerRef.current.getBoundingClientRect()
    const isDarkTheme = theme === "dark"

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: isDarkTheme ? { color: "transparent" } : { color: "#ffffff" },
        textColor: isDarkTheme ? "#d1d5db" : "#1f2937",
      },
      grid: {
        vertLines: { color: isDarkTheme ? "#333" : "#e5e7eb" },
        horzLines: { color: isDarkTheme ? "#333" : "#e5e7eb" },
      },
      width: containerRect.width,
      height: containerRect.height,
      timeScale: {
        timeVisible: true,
        borderVisible: false,
        rightOffset: 5,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: "#2962FF",
          width: 1,
          style: 1,
          visible: true,
          labelVisible: true,
        },
        horzLine: {
          color: "#2962FF",
          width: 1,
          style: 1,
          visible: true,
          labelVisible: true,
        },
      },
    })

    chartRef.current = chart
    return chart
  }, [theme, paginatedData.length])

  const addSeriesToChart = useCallback((chart: IChartApi, data: CandlestickData[]) => {
    if (chartType === "candle") {
      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
      })
      candlestickSeries.setData(data)
      seriesRef.current = candlestickSeries
    } else {
      const areaSeries = chart.addSeries(AreaSeries, {
        lineColor: "#2962FF",
        topColor: "rgba(41, 98, 255, 0.28)",
        bottomColor: "rgba(41, 98, 255, 0.05)",
      })
      areaSeries.setData(data.map((item) => ({ time: item.time, value: item.close })))
      seriesRef.current = areaSeries
    }
  }, [chartType])

  const addTechnicalIndicators = useCallback((chart: IChartApi) => {
    if (!technicalIndicators?.length) return

    // Clear existing indicator series
    indicatorSeriesRef.current.clear()

    technicalIndicators.forEach((indicator) => {
      const data = indicatorData[indicator]
      if (!data?.length) return

      switch (indicator) {
        case "ma":
          const maSeries = chart.addSeries(LineSeries, { color: "#f59e42", lineWidth: 2 })
          maSeries.setData(data)
          indicatorSeriesRef.current.set("ma", maSeries)
          break
        case "ema":
          const emaSeries = chart.addSeries(LineSeries, { color: "#42a5f5", lineWidth: 2 })
          emaSeries.setData(data)
          indicatorSeriesRef.current.set("ema", emaSeries)
          break
        case "bb":
          const upperSeries = chart.addSeries(LineSeries, { color: "#8e44ad", lineWidth: 1 })
          const lowerSeries = chart.addSeries(LineSeries, { color: "#8e44ad", lineWidth: 1 })
          const middleSeries = chart.addSeries(LineSeries, { color: "#27ae60", lineWidth: 1, lineStyle: 2 })
          
          upperSeries.setData(data.map((b: any) => ({ time: b.time, value: b.upper })))
          lowerSeries.setData(data.map((b: any) => ({ time: b.time, value: b.lower })))
          middleSeries.setData(data.map((b: any) => ({ time: b.time, value: b.middle })))
          
          indicatorSeriesRef.current.set("bb_upper", upperSeries)
          indicatorSeriesRef.current.set("bb_lower", lowerSeries)
          indicatorSeriesRef.current.set("bb_middle", middleSeries)
          break
      }
    })
  }, [technicalIndicators, indicatorData])

  // Fixed trendline functionality
  const handleChartClick = useCallback((param: MouseEventParams<Time>) => {
    const chart = chartRef.current
    const series = seriesRef.current
    
    if (!chart || !series || !param.point || param.time === undefined) return

    if (isTrendLineToolActive && 'coordinateToPrice' in series) {
      const time = param.time
      const price = series.coordinateToPrice(param.point.y)

      if (!trendlineActive) {
        // Start drawing trendline
        setTrendlineActive(true)
        setStartPoint({ time, price })

        // Create new trendline series
        const newTrendlineSeries = chart.addSeries(LineSeries, { 
          color: "#FFD700", 
          lineWidth: 2,
          crosshairMarkerVisible: false
        })
        
        newTrendlineSeries.setData([{ time, value: price }])
        trendlineSeriesRef.current = newTrendlineSeries

        // Create crosshair move handler for drawing
        const crosshairMoveHandler = (moveParam: MouseEventParams<Time>) => {
          if (moveParam.point && moveParam.time !== undefined && startPoint && trendlineSeriesRef.current) {
            const movePrice = series.coordinateToPrice(moveParam.point.y)
            trendlineSeriesRef.current.setData([
              { time: startPoint.time, value: startPoint.price },
              { time: moveParam.time, value: movePrice },
            ])
          }
        }

        chart.subscribeCrosshairMove(crosshairMoveHandler)
        eventHandlersRef.current.crosshairMove = crosshairMoveHandler
      } else {
        // Finish drawing trendline
        setTrendlineActive(false)
        setStartPoint(null)

        // Unsubscribe crosshair move handler
        if (eventHandlersRef.current.crosshairMove) {
          chart.unsubscribeCrosshairMove(eventHandlersRef.current.crosshairMove)
          eventHandlersRef.current.crosshairMove = undefined
        }
      }
    }

    // Handle horizontal tool
    if (isHorizontalToolActive && 'coordinateToPrice' in series) {
      const price = series.coordinateToPrice(param.point.y)
      series.createPriceLine?.({
        price,
        color: "#FFFF00",
        lineWidth: 1,
        lineStyle: 0,
      })
    }

    // Handle vertical tool
    if (isVerticalToolActive) {
      const verticalLineSeries = chart.addSeries(LineSeries, {
        color: "#FF6B35",
        lineWidth: 2,
        crosshairMarkerVisible: false,
        lastValueVisible: false,
        priceLineVisible: false,
      })

      // Store reference for cleanup
      verticalLinesRef.current.push(verticalLineSeries)

      // Get the price range for the vertical line
      const timeScale = chart.timeScale()
      const visibleRange = timeScale.getVisibleLogicalRange()
      
      if (visibleRange) {
        // Find price range from visible data
        const visibleData = paginatedData.slice(
          Math.max(0, Math.floor(visibleRange.from)), 
          Math.min(paginatedData.length, Math.ceil(visibleRange.to))
        )
        
        if (visibleData.length > 0) {
          const minPrice = Math.min(...visibleData.map(d => Math.min(d.low, d.high)))
          const maxPrice = Math.max(...visibleData.map(d => Math.max(d.low, d.high)))
          
          // Create vertical line data points
          const verticalLineData = [
            { time, value: minPrice },
            { time, value: maxPrice }
          ]
          
          verticalLineSeries.setData(verticalLineData)
        }
      }
    }
  }, [isTrendLineToolActive, isHorizontalToolActive, trendlineActive, startPoint])

  const saveChart = useCallback(() => {
    const canvas = chartRef.current?.takeScreenshot?.()
    if (canvas instanceof HTMLCanvasElement) {
      const image = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = image
      link.download = `gsemonitor-${ticker}-${period}-chart.png`
      link.click()
    }
  }, [ticker, period])

  // Save chart effect
  useEffect(() => {
    if (isSaveChart) {
      saveChart()
    }
  }, [isSaveChart, saveChart])

  // Main chart setup effect
  useEffect(() => {
    const setupChart = async () => {
      cleanupChart()
      
      const chart = await initializeChart()
      if (!chart) return

      addSeriesToChart(chart, paginatedData)
      addTechnicalIndicators(chart)
      
      chart.timeScale().setVisibleLogicalRange({
        from: Math.max(0, paginatedData.length - 40),
        to: paginatedData.length,
      })

      // Subscribe to chart click
      eventHandlersRef.current.click = handleChartClick
      chart.subscribeClick(handleChartClick)
    }

    if (paginatedData.length > 0) {
      setupChart()
    }

    return cleanupChart
  }, [
    paginatedData,
    theme,
    technicalIndicators,
    chartType,
    currentPage,
    candlesPerPage,
    isHorizontalToolActive,
    isVerticalToolActive,
    isFullScreen,
    isTrendLineToolActive,
    cleanupChart,
    initializeChart,
    addSeriesToChart,
    addTechnicalIndicators,
    handleChartClick
  ])

  const useMiniChart = miniChartIndicators.length > 0

  return (
    <div className={`relative ${containerClassName}`}>
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-destructive text-destructive-foreground px-3 py-1 rounded-md text-sm z-10">
          Failed to load chart data.
        </div>
      )}
      {(isLoading || !chartData?.length) && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      <div className="h-full w-full flex flex-col">
        <div ref={chartContainerRef} className="w-full overflow-hidden flex-grow" />
        {useMiniChart && (
          <MiniIndicatorChart 
            data={miniChartData} 
            technicalIndicators={miniChartIndicators} 
          />
        )}
      </div>
    </div>
  )
}