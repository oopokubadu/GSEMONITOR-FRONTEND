"use client"

import { useEffect, useRef, useState } from "react"
import { type IChartApi, type CandlestickData, CandlestickSeries, AreaSeries } from "lightweight-charts"
import { useTheme } from "next-themes"

interface CandlestickChartProps {
  ticker: string
  chartType: "candle" | "line" // Accept "candle" or "line" as chart types
  containerClassName?: string
}

export function CandlestickChart({ ticker, chartType, containerClassName = "h-[400px] w-full" }: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [chartData, setChartData] = useState<CandlestickData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<any>(null)
  const { theme } = useTheme()
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  useEffect(() => {
    const loadChartData = () => {
      setIsLoading(true)
      setError(null)

      try {
        // Generate mock chart data
        const data = [
          { time: "2018-12-22", open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
          { time: "2018-12-23", open: 45.12, high: 53.9, low: 45.12, close: 48.09 },
          { time: "2018-12-24", open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
          { time: "2018-12-25", open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
          { time: "2018-12-26", open: 45.12, high: 53.9, low: 45.12, close: 48.09 },
          { time: "2018-12-27", open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
          { time: "2018-12-28", open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
          { time: "2018-12-29", open: 45.12, high: 53.9, low: 45.12, close: 48.09 },
          { time: "2018-12-30", open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
        ]
        setChartData(data)
        setIsLoading(false)
      } catch (err) {
        console.error("Error generating chart data:", err)
        setError("Failed to load chart data.")
        setChartData([])
        setIsLoading(false)
      }
    }

    loadChartData()
  }, [ticker])

  useEffect(() => {
    if (!chartContainerRef.current || chartData.length === 0) return

    // Clean up previous chart and observers
    if (chartRef.current) {
      chartRef.current.remove()
      chartRef.current = null
      seriesRef.current = null
    }

    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect()
      resizeObserverRef.current = null
    }

    try {
      import("lightweight-charts").then((lwc) => {
        if (!chartContainerRef.current) return

        const containerRect = chartContainerRef.current.getBoundingClientRect()
        const isDarkTheme = theme === "dark"

        const chart = lwc.createChart(chartContainerRef.current, {
          layout: {
            background: { type: "solid", color: isDarkTheme ? "transparent" : "#ffffff" },
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
          },
        })

        chartRef.current = chart

        if (chartType === "candle") {
          // Render candlestick chart
          const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: "#26a69a",
            downColor: "#ef5350",
            borderVisible: false,
            wickUpColor: "#26a69a",
            wickDownColor: "#ef5350",
          })
          seriesRef.current = candlestickSeries
          candlestickSeries.setData(chartData)
        } else if (chartType === "line") {
          // Render line chart
          const areaSeries = chart.addSeries(AreaSeries, {
            lineColor: "#2962FF",
            topColor: "rgba(41, 98, 255, 0.28)",
            bottomColor: "rgba(41, 98, 255, 0.05)",
          })
          seriesRef.current = areaSeries
          const areaData = chartData.map((item) => ({
            time: item.time,
            value: item.close,
          }))
          areaSeries.setData(areaData)
        }

        chart.timeScale().fitContent()

        resizeObserverRef.current = new ResizeObserver(() => {
          window.requestAnimationFrame(() => {
            if (chartRef.current && chartContainerRef.current) {
              const containerRect = chartContainerRef.current.getBoundingClientRect()
              chartRef.current.applyOptions({
                width: containerRect.width,
                height: containerRect.height,
              })
              chartRef.current.timeScale().fitContent()
            }
          })
        })

        resizeObserverRef.current.observe(chartContainerRef.current)
      })
    } catch (error) {
      console.error("Error creating chart:", error)
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
        resizeObserverRef.current = null
      }

      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
        seriesRef.current = null
      }
    }
  }, [chartData, theme, chartType])

  return (
    <div className={`relative ${containerClassName}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-3 py-1 rounded-md text-sm z-10">
          {error}
        </div>
      )}

      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  )
}