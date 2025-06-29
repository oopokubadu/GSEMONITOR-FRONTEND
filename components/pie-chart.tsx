"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface PieChartProps {
  data: {
    ticker: string
    total_shares: number
  }[]
}

export function PieChartComponent({ data }: PieChartProps) {
  // Colors for the pie chart
  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#6b7280"]
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500">No data available</div>
  }

  // Format data for the pie chart
  const chartData = data.map((item) => ({
    name: item.ticker,
    value: item.total_shares
  }))

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%" background="yellow">
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
