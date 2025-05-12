"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useChartData } from "../hooks/use-chart-data"

interface StockChartProps {
  readonly period: "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL"
  readonly ticker: string
}

// Generate random stock data based on the period
export function StockChart({ period, ticker }: Readonly<StockChartProps>) {
  const [data, setData] = useState<{ time: string; price: number }[]>([])
  const periodMap: Record<string, string> = {
    "1D": "daily",
    "1W": "weekly",
    "1M": "monthly",
    "3M": "quarterly",
    "1Y": "yearly"
  }
  const { data: chartData } = useChartData(ticker, periodMap[period])

  useEffect(() => {
    const paginatedData = (chartData ?? [])
      .slice(-10, chartData?.length) // Adjust the slice to get the last 10 items
      .filter((item) => item.date && item.open && item.high && item.low && item.close)
      .map((item) => ({
        time: item.date,
        price: item.open + item.close / 2, // Average of open and close prices
      }))

    setData(paginatedData)
  }, [chartData])


  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#333" }} />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#333" }}
            tickFormatter={(value) => `₵${value}`}
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-card border rounded-md shadow-md p-2 text-sm">
                    <p className="font-medium">{`Time: ${payload[0].payload.time}`}</p>
                    <p className="text-green-500">{`Price: ₵${payload[0].value}`}</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Area type="monotone" dataKey="price" stroke="#10b981" fillOpacity={1} fill="url(#colorPrice)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
