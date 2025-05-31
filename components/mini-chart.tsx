"use client"

import { useEffect, useRef } from "react"
import { createChart, LineSeries } from "lightweight-charts"
import {
  calculateRSI,
  calculateMACD,
  calculateStoch,
} from "@/lib/technical-indicators"

interface MiniIndicatorChartProps {
  data: any
  label?: string
  color?: string
  height?: number
  technicalIndicators?: string[]
}

export function MiniIndicatorChart({
  data,
  label,
  color = "#42a5f5",
  height = 100,
  technicalIndicators
}: MiniIndicatorChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<any>(null)

  const addTechnicalIndicators = (chart: any, chart_data: any) => {
    if (chart && Array.isArray(technicalIndicators) && Array.isArray(data)) {
      technicalIndicators.forEach((indicator) => {
        // if (indicator === "ma") {
        //   const ma = calculateMA(chart_data, 14)
        //   const maSeries = chart.addSeries(LineSeries, { color: "#f59e42", lineWidth: 2 })
        //   maSeries.setData(ma.filter((point) => point !== null))
        // }
        // if (indicator === "ema") {
        //   const ema = calculateEMA(chart_data, 14)
        //   const emaSeries = chart.addSeries(LineSeries, { color: "#42a5f5", lineWidth: 2 })
        //   emaSeries.setData(ema)
        // }
        // if (indicator === "bb") {
        //   const bb = calculateBB(chart_data, 20, 2)
        //   const upperSeries = chart.addSeries(LineSeries, { color: "#8e44ad", lineWidth: 1 })
        //   const lowerSeries = chart.addSeries(LineSeries, { color: "#8e44ad", lineWidth: 1 })
        //   const middleSeries = chart.addSeries(LineSeries, { color: "#27ae60", lineWidth: 1, lineStyle: 2 })
        //   upperSeries.setData(bb.map(b => ({ time: b.time, value: b.upper })))
        //   lowerSeries.setData(bb.map(b => ({ time: b.time, value: b.lower })))
        //   middleSeries.setData(bb.map(b => ({ time: b.time, value: b.middle })))
        // }
        if (indicator === "rsi") {
          const rsi = calculateRSI(chart_data, 14)
          const rsiSeries = chart.addSeries(LineSeries, { color: "#e67e22", lineWidth: 2 })
          rsiSeries.setData(rsi)
        }
        if (indicator === "macd") {
          const { macd, signal } = calculateMACD(chart_data)
          const macdSeries = chart.addSeries(LineSeries, { color: "#2ecc71", lineWidth: 2 })
          const signalSeries = chart.addSeries(LineSeries, { color: "#e74c3c", lineWidth: 2, lineStyle: 2 })
          console.log("MACD Data:", macd, signal)
          macdSeries.setData(macd)
          signalSeries.setData(signal)
        }
        if (indicator === "stoch") {
          const { k, d } = calculateStoch(chart_data, 14, 3)
          const kSeries = chart.addSeries(LineSeries, { color: "#2980b9", lineWidth: 2 })
          const dSeries = chart.addSeries(LineSeries, { color: "#c0392b", lineWidth: 2, lineStyle: 2 })
          kSeries.setData(k)
          dSeries.setData(d)
        }
      })
    }
  }

  useEffect(() => {
    if (!chartRef.current || !Array.isArray(data) || data.length === 0) return

    // Clean up previous chart
    if (chartInstance.current) {
      chartInstance.current = null
    }

    const chart = createChart(chartRef.current, {
      height,
      width: chartRef.current.offsetWidth,
      layout: {
        background: { color: "transparent" },
        textColor: "#888",
      },
      grid: {
        vertLines: { color: "transparent" },
        horzLines: { color: "transparent" },
      },
      timeScale: {
        timeVisible: false,
        borderVisible: false,
      },
      rightPriceScale: {
        borderVisible: false,
      },
    })

    addTechnicalIndicators(chart, data)
    // chart.timeScale().setVisibleLogicalRange({ from: data.length - 50, to: data.length })
    chartInstance.current = chart

    return () => {
      chart.remove()
    }
  }, [data, color, height])

  return (
    <div className="w-full bg-white dark:bg-black rounded shadow-sm p-2">
      {label && <div className="text-xs font-semibold mb-1">{label}</div>}
      <div ref={chartRef} style={{ width: "100%", height }} />
    </div>
  )
}