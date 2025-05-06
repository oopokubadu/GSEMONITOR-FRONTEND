"use client"

import { useState, useEffect } from "react"
import {
  ArrowDown,
  ArrowUp,
  BarChart2,
  ChevronDown,
  Clock,
  Layers,
  LineChart,
  Maximize2,
  Minimize2,
  Plus,
  Save,
  Settings,
  Share2,
  SlidersHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { CandlestickChart } from "@/components/candlestick-chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useDashboardData } from "@/hooks/use-dashboard-data"

export function MarketsContent() {
  const { data: dashboardData = [], isLoading, isError } = useDashboardData()
  const [selectedTicker, setSelectedTicker] = useState("")
  const [chartTimeframe, setChartTimeframe] = useState("1D")
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [selectedChartType, setSelectedChartType] = useState<"candle" | "line">("candle")
  const [activeIndicators, setActiveIndicators] = useState<string[]>([])

  // Map chartTimeframe to period
  const periodMap: Record<string, string> = {
    "1D": "daily",
    "1W": "weekly",
    "1M": "monthly",
    "3M": "quarterly",
    "1Y": "yearly",
    "ALL": "all",
  }
  const selectedPeriod = periodMap[chartTimeframe] || "daily"

  // Set the default selected ticker when data is loaded
  useEffect(() => {
    if (dashboardData.length > 0) {
      setSelectedTicker(dashboardData[0].symbol.toLowerCase())
    }
  }, [dashboardData])

  // Find the selected stock details
  const selectedStock = dashboardData.find((stock) => stock.symbol.toLowerCase() === selectedTicker) || dashboardData[0]

  // Toggle indicator
  const toggleIndicator = (id: string) => {
    if (activeIndicators.includes(id)) {
      setActiveIndicators(activeIndicators.filter((i) => i !== id))
    } else {
      setActiveIndicators([...activeIndicators, id])
    }
  }

  if (isLoading) {
    return <div>Loading market data...</div>
  }

  if (isError) {
    return <div>Error loading market data.</div>
  }

  return (
    <div
      className={cn("flex flex-col h-[calc(100vh-8rem)] bg-background", isFullScreen && "fixed inset-0 z-50 h-screen")}
    >
      {/* Top toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b p-2 gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectedTicker} onValueChange={setSelectedTicker}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select ticker" />
            </SelectTrigger>
            <SelectContent>
              {dashboardData.map((stock) => (
                <SelectItem key={stock.symbol.toLowerCase()} value={stock.symbol.toLowerCase()}>
                  {stock.symbol} - {stock.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold">₵{selectedStock?.price}</span>
            <span
              className={cn(
                "flex items-center text-sm",
                selectedStock?.isPositive ? "text-green-500" : "text-red-500"
              )}
            >
              {selectedStock?.isPositive ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {selectedStock?.isPositive ? "+" : ""}
              {selectedStock?.change} ({selectedStock?.changePercent}%)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => setIsFullScreen(!isFullScreen)}>
                  {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isFullScreen ? "Exit Full Screen" : "Full Screen"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Save className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save Chart</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share Chart</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main chart area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chart header */}
          <div className="flex flex-wrap justify-between items-center p-2 border-b gap-2">
            <Tabs value={chartTimeframe} onValueChange={setChartTimeframe} className="w-auto">
              <TabsList className="h-8">
                <TabsTrigger value="1D" className="text-xs px-2 h-6">
                  1D
                </TabsTrigger>
                <TabsTrigger value="1W" className="text-xs px-2 h-6">
                  1W
                </TabsTrigger>
                <TabsTrigger value="1M" className="text-xs px-2 h-6">
                  1M
                </TabsTrigger>
                <TabsTrigger value="3M" className="text-xs px-2 h-6">
                  3M
                </TabsTrigger>
                <TabsTrigger value="1Y" className="text-xs px-2 h-6">
                  1Y
                </TabsTrigger>
                <TabsTrigger value="ALL" className="text-xs px-2 h-6">
                  ALL
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Chart */}
          <div className="flex-1 relative min-h-0">
            <CandlestickChart
              ticker={selectedTicker}
              period={selectedPeriod}
              chartType={selectedChartType}
              containerClassName="h-full w-full"
            />
          </div>
        </div>

        {/* Right sidebar - Market data */}
        <div className="w-64 border-l hidden lg:block overflow-hidden">
          <div className="p-2 border-b">
            <Input type="search" placeholder="Search stocks..." className="h-8" />
          </div>

          <div className="overflow-auto h-[calc(100%-44px)]">
            <div className="p-2 text-xs font-medium text-muted-foreground">MARKET MOVERS</div>

            {dashboardData.map((stock) => (
              <div
                key={stock.symbol}
                className={cn(
                  "flex justify-between items-center p-2 hover:bg-accent/50 cursor-pointer",
                  selectedTicker === stock.symbol.toLowerCase() && "bg-accent"
                )}
                onClick={() => setSelectedTicker(stock.symbol.toLowerCase())}
              >
                <div>
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-xs text-muted-foreground">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div>₵{stock.price}</div>
                  <div
                    className={cn(
                      "text-xs flex items-center justify-end",
                      stock.isPositive ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {stock.isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {stock.changePercent}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}