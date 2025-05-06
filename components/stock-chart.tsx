"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

interface StockChartProps {
  period: "1D" | "1W" | "1M" | "3M" | "1Y" | "ALL"
}

// Generate random stock data based on the period
const generateStockData = (period: StockChartProps["period"]) => {
  const dataPoints: { time: string; price: number }[] = []
  let basePrice = 5.0
  const volatility = 0.05

  switch (period) {
    case "1D":
      // Generate hourly data for a day
      for (let hour = 9; hour <= 16; hour++) {
        const time = `${hour}:00`
        const randomChange = (Math.random() - 0.45) * volatility
        basePrice = basePrice + randomChange
        dataPoints.push({ time, price: Number.parseFloat(basePrice.toFixed(2)) })
      }
      break
    case "1W":
      // Generate daily data for a week
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
      for (let i = 0; i < days.length; i++) {
        const randomChange = (Math.random() - 0.45) * volatility * 3
        basePrice = basePrice + randomChange
        dataPoints.push({ time: days[i], price: Number.parseFloat(basePrice.toFixed(2)) })
      }
      break
    case "1M":
      // Generate weekly data for a month
      for (let week = 1; week <= 4; week++) {
        const randomChange = (Math.random() - 0.45) * volatility * 5
        basePrice = basePrice + randomChange
        dataPoints.push({ time: `Week ${week}`, price: Number.parseFloat(basePrice.toFixed(2)) })
      }
      break
    case "3M":
      // Generate monthly data for 3 months
      const months3 = ["Jan", "Feb", "Mar"]
      for (let i = 0; i < months3.length; i++) {
        const randomChange = (Math.random() - 0.45) * volatility * 8
        basePrice = basePrice + randomChange
        dataPoints.push({ time: months3[i], price: Number.parseFloat(basePrice.toFixed(2)) })
      }
      break
    case "1Y":
      // Generate monthly data for a year
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      for (let i = 0; i < months.length; i++) {
        const randomChange = (Math.random() - 0.45) * volatility * 10
        basePrice = basePrice + randomChange
        dataPoints.push({ time: months[i], price: Number.parseFloat(basePrice.toFixed(2)) })
      }
      break
    case "ALL":
      // Generate yearly data for 5 years
      for (let year = 2019; year <= 2023; year++) {
        const randomChange = (Math.random() - 0.45) * volatility * 15
        basePrice = basePrice + randomChange
        dataPoints.push({ time: year.toString(), price: Number.parseFloat(basePrice.toFixed(2)) })
      }
      break
  }

  return dataPoints
}

export function StockChart({ period }: StockChartProps) {
  const [data, setData] = useState<{ time: string; price: number }[]>([])

  useEffect(() => {
    setData(generateStockData(period))
  }, [period])

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
