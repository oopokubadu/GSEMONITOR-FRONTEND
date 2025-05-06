"use client"

import { ArrowDown, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

const marketData = [
  { name: "GSE Composite", value: "3,245.67", change: "+1.2%", isPositive: true },
  { name: "GSE Financial", value: "2,187.45", change: "-0.5%", isPositive: false },
  { name: "Volume", value: "1.2M", change: "+15.3%", isPositive: true },
  { name: "Value", value: "GHS 4.5M", change: "+8.7%", isPositive: true },
]

export function MarketSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 lg:p-6">
      {marketData.map((item, index) => (
        <div key={index} className="bg-card rounded-lg border shadow-sm">
          <div className="p-4 flex flex-col">
            <div className="text-sm font-medium text-muted-foreground">{item.name}</div>
            <div className="text-2xl font-bold mt-1">{item.value}</div>
            <div className={cn("flex items-center text-sm mt-1", item.isPositive ? "text-green-500" : "text-red-500")}>
              {item.isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
              {item.change}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
