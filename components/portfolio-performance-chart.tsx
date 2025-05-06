"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"

// Generate sample portfolio performance data
const generatePerformanceData = () => {
  const data = []
  let value = 35000

  // Generate data for the last 12 months
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const currentMonth = new Date().getMonth()

  for (let i = 0; i < 12; i++) {
    const monthIndex = (currentMonth - 11 + i) % 12
    const month = months[monthIndex >= 0 ? monthIndex : monthIndex + 12]

    // Add some random fluctuation to the portfolio value
    const change = (Math.random() - 0.3) * 2000
    value += change

    data.push({
      month,
      value: Math.round(value),
    })
  }

  return data
}

const performanceData = generatePerformanceData()

export function PortfolioPerformanceChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={{ stroke: "#333" }} />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#333" }}
            tickFormatter={(value) => `₵${(value / 1000).toFixed(0)}K`}
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-card border rounded-md shadow-md p-2 text-sm">
                    <p className="font-medium">{`Month: ${payload[0].payload.month}`}</p>
                    <p className="text-green-500">{`Value: ₵${payload[0].value.toLocaleString()}`}</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
