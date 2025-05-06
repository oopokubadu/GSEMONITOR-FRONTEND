"use client"

import { ArrowDown, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  isPositive: boolean
}

interface TopStocksProps {
  readonly setActiveStock: (stock: Stock) => void
  readonly stocks: Stock[] // Accept stocks as a prop from the parent
}

export function TopStocks({ setActiveStock, stocks }: TopStocksProps) {
  if (!stocks || stocks.length === 0) {
    return <div>No stocks available.</div>
  }

  return (
    <div className="max-h-96 overflow-y-auto"> {/* Scrollable container */}
      {stocks.map((stock) => (
        <div
          key={stock.symbol}
          className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
          onClick={() => setActiveStock(stock)}
        >
          <div className="flex flex-col">
            <div className="font-medium">{stock.symbol}</div>
            <div className="text-xs text-muted-foreground">{stock.name}</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="font-medium">₵{stock.price}</div>
            <div className={cn("flex items-center text-xs", stock.isPositive ? "text-green-500" : "text-red-500")}>
              {stock.isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              {stock.isPositive ? "+" : ""}
              {stock.change} ({stock.changePercent}%)
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}