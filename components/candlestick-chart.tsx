"use client"

import { useEffect, useRef, useState } from "react"
import { type IChartApi, type CandlestickData, CandlestickSeries, AreaSeries } from "lightweight-charts"
import { useTheme } from "next-themes"
import { useChartData } from "../hooks/use-chart-data"

interface CandlestickChartProps {
  readonly ticker: string
  readonly period: string
  readonly chartType: "candle" | "line"
  readonly containerClassName?: string
  readonly candlesPerPage?: number // Number of candles to display per page
}

export function CandlestickChart({
  ticker,
  period,
  chartType,
  containerClassName = "h-[400px] w-full",
  candlesPerPage = 50, // Default to 50 candles per page
}: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<any>(null)
  const { theme } = useTheme()
  const { data: chartData, isLoading, isError } = useChartData(ticker, period)

  const [currentPage, setCurrentPage] = useState(0) // Track the current page

  useEffect(() => {
    if (!chartContainerRef.current || !Array.isArray(chartData) || chartData.length === 0) return

    // Clean up previous chart and observers
    if (chartRef.current) {
      chartRef.current.remove()
      chartRef.current = null
      seriesRef.current = null
    }

    try {
      import("lightweight-charts").then((lwc) => {
        if (!chartContainerRef.current) return

        const containerRect = chartContainerRef.current.getBoundingClientRect()
        const isDarkTheme = theme === "dark"

        const chart = lwc.createChart(chartContainerRef.current, {
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
            rightOffset: 5, // Add space between the last candle and the right border
          },
        })

        chartRef.current = chart

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
          upColor: "#26a69a",
          downColor: "#ef5350",
          borderVisible: false,
          wickUpColor: "#26a69a",
          wickDownColor: "#ef5350",
        })
        seriesRef.current = candlestickSeries

        // Slice the data for the current page
        const start = currentPage * candlesPerPage
        const end = start + candlesPerPage
        const paginatedData = chartData
          .slice(start, end)
          .filter((item) => item.date && item.open && item.high && item.low && item.close)
          .map((item) => ({
            time: item.date, // Format date to YYYY-MM-DD
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
          }))
        
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
          candlestickSeries.setData(paginatedData)
        } else if (chartType === "line") {
          // Render line chart
          const areaSeries = chart.addSeries(AreaSeries, {
            lineColor: "#2962FF",
            topColor: "rgba(41, 98, 255, 0.28)",
            bottomColor: "rgba(41, 98, 255, 0.05)",
          })
          seriesRef.current = areaSeries
          const areaData = paginatedData.map((item) => ({
            time: item.time,
            value: item.close,
          }))
          areaSeries.setData(areaData)
        }
        
        // Set the chart data
        chart.timeScale().setVisibleLogicalRange({ from: paginatedData.length - 40, to: paginatedData.length }) // Adjust the range

        // Handle scrolling
        // const handleVisibleTimeRangeChange = () => {
        //   const visibleRange = chart.timeScale().getVisibleRange()
        //   if (visibleRange && Number(visibleRange.to) >= chartData.length - 1) {
        //     setCurrentPage((prevPage) => prevPage + 1) // Load the next page
        //   }
        // }

        // chart.timeScale().subscribeVisibleTimeRangeChange(handleVisibleTimeRangeChange)
      })
    } catch (error) {
      console.error("Error creating chart:", error)
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
        seriesRef.current = null
      }
    }
  }, [chartData, theme, chartType, currentPage, candlesPerPage])

  return (
    <div className={`relative ${containerClassName}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

      {isError && (
        <div className="absolute top-2 right-2 bg-destructive text-destructive-foreground px-3 py-1 rounded-md text-sm z-10">
          Failed to load chart data.
        </div>
      )}

      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  )
}