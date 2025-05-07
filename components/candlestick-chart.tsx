"use client"

import { useEffect, useRef, useState } from "react"
import { type IChartApi, type CandlestickData, CandlestickSeries, AreaSeries, LineSeries, UTCTimestamp, CrosshairMode } from "lightweight-charts"
import { useTheme } from "next-themes"
import { useChartData } from "../hooks/use-chart-data"

interface CandlestickChartProps {
  readonly ticker: string
  readonly period: string
  readonly chartType: "candle" | "line"
  readonly containerClassName?: string
  readonly candlesPerPage?: number // Number of candles to display per page
  readonly isHorizontalToolActive: boolean // Add this prop
  readonly isVerticalToolActive: boolean // Add this prop
  readonly isFullScreen?: boolean
}

export function CandlestickChart({
  ticker,
  period,
  chartType,
  containerClassName = "h-400 w-auto",
  candlesPerPage = 100, // Default to 50 candles per page
  isHorizontalToolActive,
  isVerticalToolActive,
  isFullScreen = false,
}: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<any>(null)
  const { theme } = useTheme()
  const { data: chartData, isLoading, isError } = useChartData(ticker, period)

  const [currentPage, setCurrentPage] = useState(0) // Track the current page


  // Initialize the chart
  const initializeChart = async () => {
    if (!chartContainerRef.current || !Array.isArray(chartData) || chartData.length === 0) return

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
        mode: CrosshairMode.Normal, // Enable both vertical and horizontal lines
        vertLine: {
          color: "#2962FF",
          width: 1,
          style: 1, // Dashed line
          visible: true,
          labelVisible: true,
        },
        horzLine: {
          color: "#2962FF",
          width: 1,
          style: 1, // Dashed line
          visible: true,
          labelVisible: true,
        },
      },
    })

    chartRef.current = chart
    return chart
  }

  // Add series to the chart
  const addSeriesToChart = (chart: IChartApi, data: CandlestickData[]) => {
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
    } else if (chartType === "line") {
      const areaSeries = chart.addSeries(AreaSeries, {
        lineColor: "#2962FF",
        topColor: "rgba(41, 98, 255, 0.28)",
        bottomColor: "rgba(41, 98, 255, 0.05)",
      })
      areaSeries.setData(data.map((item) => ({ time: item.time, value: item.close })))
      seriesRef.current = areaSeries
    }
  }

  // Handle mouse click for drawing tools
  const handleMouseClick = (event: MouseEvent) => {
    const chart = chartRef.current
    if (!chart || !chartContainerRef.current) return

    const series = seriesRef.current
    const timeScale = chart.timeScale()
    const coordinate = chartContainerRef.current.getBoundingClientRect()
    const x = event.clientX - coordinate.left
    const y = event.clientY - coordinate.top

    if (isHorizontalToolActive) {
      const price = series.coordinateToPrice(y);
      series.createPriceLine({
        price,
        color: "blue",
        lineWidth: 1,
        lineStyle: 0,
      })
    }

    if (isVerticalToolActive && chart) {
      const time = timeScale.coordinateToTime(x);
    
      if (time !== null) {
        const verticalLineSeries = chart.addSeries( LineSeries, {
          color: 'blue',
          lineWidth: 1,
          priceLineVisible: false,
          lastValueVisible: false,
          crosshairMarkerVisible: false,
        });
    
        verticalLineSeries.setData([
          { time: time as UTCTimestamp, value: 6.7 },
          { time: (time as UTCTimestamp) + 1 as UTCTimestamp, value: 7.0 },
        ]);        
      }
    }
  }

  // Cleanup chart and event listeners
  const cleanupChart = () => {
    if (chartRef.current) {
      chartRef.current.remove()
      chartRef.current = null
      seriesRef.current = null
    }

    if (chartContainerRef.current) {
      chartContainerRef.current.innerHTML = "" // Clear the chart container
      chartContainerRef.current.removeEventListener("click", handleMouseClick) // Remove event listener
    }
  }

  useEffect(() => {
    const setupChart = async () => {
      cleanupChart()
      const chart = await initializeChart()
      if (!chart) return

      const start = currentPage * candlesPerPage
      const end = start + candlesPerPage
      const paginatedData = (chartData ?? [])
        .slice(start, end)
        .filter((item) => item.date && item.open && item.high && item.low && item.close)
        .map((item) => ({
          time: item.date,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        }))

      addSeriesToChart(chart, paginatedData)
      chart.timeScale().setVisibleLogicalRange({ from: paginatedData.length - 40, to: paginatedData.length })

      chartContainerRef.current?.addEventListener("click", handleMouseClick)
    }

    setupChart()

    return cleanupChart
  }, [chartData, theme, chartType, currentPage, candlesPerPage, isHorizontalToolActive, isVerticalToolActive, isFullScreen])

  return (
    <div className={`relative ${containerClassName}`}>
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-destructive text-destructive-foreground px-3 py-1 rounded-md text-sm z-10">
          Failed to load chart data.
        </div>
      )}

      {isLoading || (Array.isArray(chartData) && chartData.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      <div ref={chartContainerRef} className="w-full h-full overflow-hidden" />
    </div>
  )
}