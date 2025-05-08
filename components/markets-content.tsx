"use client"

import React, { useState, useEffect } from "react"
import {
  AlignHorizontalJustifyStart,
  ArrowDown,
  ArrowUp,
  BarChart2,
  ChevronDown,
  Clock,
  Layers,
  LineChart,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  Save,
  Settings,
  Share2,
  SlidersHorizontal,
  TrendingUp,
  X,
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


// Technical indicators
const technicalIndicators = [
  { id: "ma", name: "Moving Average", active: true },
  { id: "ema", name: "Exponential Moving Average", active: false },
  { id: "bb", name: "Bollinger Bands", active: false },
  { id: "rsi", name: "Relative Strength Index", active: false },
  { id: "macd", name: "MACD", active: false },
  { id: "stoch", name: "Stochastic Oscillator", active: false },
]

// Chart types
const chartTypes: { id: "candle" | "line"; name: string; icon: typeof BarChart2 }[] = [
  { id: "candle", name: "Candlestick", icon: BarChart2 },
  { id: "line", name: "Line", icon: LineChart },
]

export function MarketsContent() {
  const { data: dashboardData = [], isLoading, isError } = useDashboardData()
  const [selectedTicker, setSelectedTicker] = useState("gcb")
  const [chartTimeframe, setChartTimeframe] = useState("1D")
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [selectedChartType, setSelectedChartType] = useState<"candle" | "line">("candle")
  const [activeIndicators, setActiveIndicators] = useState(technicalIndicators.filter((i) => i.active).map((i) => i.id))
  const [showDrawingToolsMenu, setShowDrawingToolsMenu] = useState(false)
  const [showChartSettingsMenu, setShowChartSettingsMenu] = useState(false)
  const [activeDrawingTool, setActiveDrawingTool] = useState<string | null>(null) // Track active drawing tool
  const [searchQuery, setSearchQuery] = useState("") // State to track the search input
  const [filteredStocks, setFilteredStocks] = useState(dashboardData) // State for filtered stocks
  const [isHorizontalToolActive, setIsHorizontalToolActive] = useState(false)
  const [isTrendingToolActive, setIsTrendingToolActive] = useState(false)
  const [isVerticalToolActive, setIsVerticalToolActive] = useState(false)
  const [isSaveChart, setIsSaveChart] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

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
      setFilteredStocks(dashboardData) // Initialize filtered stocks
    }
  }, [dashboardData])

  useEffect(() => {
    const query = searchQuery.toLowerCase()
    const filtered = dashboardData.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(query) || stock.name.toLowerCase().includes(query)
    )
    setFilteredStocks(filtered)
  }, [searchQuery, dashboardData])

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

  const handleShareChart = (platform?: string) => {
    const baseUrl = window.location.origin
    const shareUrl = `${baseUrl}/markets?ticker=${selectedTicker}&period=${selectedPeriod}&type=${selectedChartType}`
  
    if (platform === "clipboard") {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setToastMessage("Chart URL copied to clipboard!") // Show toast message 
      }).catch((err) => {
        console.error("Failed to copy URL: ", err)
      })
    } else if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check out this chart!`, "_blank")
    } else if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank")
    }
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
              className={cn("flex items-center text-sm", selectedStock?.isPositive ? "text-green-500" : "text-red-500")}
            >
              {selectedStock?.isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
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
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setIsSaveChart(!isSaveChart)}
                  >
                  <Save className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save Chart</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleShareChart("clipboard")}>
                      Copy to Clipboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShareChart("twitter")}>
                      Share on Twitter
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShareChart("facebook")}>
                      Share on Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShareChart("linkedin")}>
                      Share on LinkedIn
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>Share Chart</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Chart tools */}
        <div className="w-12 border-r flex flex-col items-center py-2 space-y-4">
          {chartTypes.map((type) => (
            <TooltipProvider key={type.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectedChartType === type.id ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setSelectedChartType(type.id)}
                  >
                    <type.icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{type.name} Chart</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}

          <div className="h-px w-8 bg-border" />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={showDrawingToolsMenu ? "default" : "ghost"} 
                  size="icon"
                  onClick={() => {
                    setShowDrawingToolsMenu((prev) => !prev)
                    setShowChartSettingsMenu(() => false)}
                  }
                  >
                  <Layers className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Drawing Tools</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {showDrawingToolsMenu && (
            <div className="flex flex-col items-center space-y-2 mt-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeDrawingTool === "trendline" ? "default" : "ghost"}
                      size="icon"
                      onClick={() =>
                      {
                        setIsTrendingToolActive((prev) => !prev)
                        setIsHorizontalToolActive(false)
                        setIsVerticalToolActive(false)
                        setActiveDrawingTool((prev) => (prev === "trendline" ? null : "trendline"))
                      }
                    }
                    >
                      <TrendingUp className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Trend Line</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeDrawingTool === "horizontalline" ? "default" : "ghost"}
                      size="icon"
                      onClick={() =>
                        {
                          setIsHorizontalToolActive((prev) => !prev)
                          setIsTrendingToolActive(false)
                          setIsVerticalToolActive(false)
                          setActiveDrawingTool((prev) => (prev === "horizontalline" ? null : "horizontalline"))
                        }
                      }
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Horizontal Line</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={activeDrawingTool === "verticalline" ? "default" : "ghost"}
                      size="icon"
                      onClick={() =>
                        {
                          setActiveDrawingTool((prev) => (prev === "verticalline" ? null : "verticalline"))
                          setIsVerticalToolActive((prev) => !prev)
                          setIsHorizontalToolActive(false)
                          setIsTrendingToolActive(false)
                        }
                      }
                    >
                      <AlignHorizontalJustifyStart className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Vertical Line</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant={showChartSettingsMenu ? "default" : "ghost"} 
                  size="icon"
                  onClick={() => 
                      {
                        setShowDrawingToolsMenu(() => false)
                        setShowChartSettingsMenu((prev) => !prev)
                      }
                    }>
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Chart Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* {showChartSettingsMenu && (
            <div className="relative left-14 top-20 bg-white shadow-md rounded-md p-2 z-50">
              <div className="text-sm font-medium">Chart Settings</div>
              <ul className="mt-2 space-y-1">
                <li className="cursor-pointer hover:bg-gray-100 p-1 rounded">Change Theme</li>
                <li className="cursor-pointer hover:bg-gray-100 p-1 rounded">Adjust Grid</li>
                <li className="cursor-pointer hover:bg-gray-100 p-1 rounded">Reset Settings</li>
              </ul>
            </div>
          )} */}
        </div>

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
              </TabsList>
            </Tabs>

            <div className="flex flex-wrap items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Indicators</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {technicalIndicators.map((indicator) => (
                    <DropdownMenuItem
                      key={indicator.id}
                      onClick={() => toggleIndicator(indicator.id)}
                      className={cn(activeIndicators.includes(indicator.id) && "bg-accent")}
                    >
                      {indicator.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Customize</span>
              </Button>

              <div className="flex items-center text-xs text-muted-foreground whitespace-nowrap">
                <Clock className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Last updated:</span>{" "}
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 relative min-h-0">
            <CandlestickChart
              ticker={selectedTicker}
              period={selectedPeriod}
              chartType={selectedChartType}
              containerClassName="h-full w-full"
              isHorizontalToolActive={isHorizontalToolActive}
              isVerticalToolActive={isVerticalToolActive}
              isFullScreen={isFullScreen}
              isTrendLineToolActive={isTrendingToolActive}
              isSaveChart={isSaveChart}
            />
          </div>

          {/* Active indicators panel */}
          {activeIndicators.length > 0 && (
            <div className="border-t p-2 bg-muted/20">
              <div className="text-sm font-medium mb-1">Active Indicators</div>
              <div className="flex flex-wrap gap-2">
                {activeIndicators.map((id) => {
                  const indicator = technicalIndicators.find((i) => i.id === id)
                  return (
                    <div key={id} className="flex items-center bg-background rounded-md px-2 py-1 text-xs">
                      {indicator?.name}
                      <Button variant="ghost" size="icon" className="h-4 w-4 ml-1" onClick={() => toggleIndicator(id)}>
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar - Market data */}
        <div className="w-64 border-l hidden lg:block overflow-hidden">
          <div className="p-2 border-b">
            <Input 
              type="search" 
              placeholder="Search stocks..." 
              className="h-8" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              />
          </div>

          <div className="overflow-auto h-[calc(100%-44px)]">
            <div className="p-2 text-xs font-medium text-muted-foreground">MARKET MOVERS</div>

            {filteredStocks.map((stock) => (
              <div
                key={stock.symbol}
                className={cn(
                  "flex justify-between items-center p-2 hover:bg-accent/50 cursor-pointer",
                  selectedTicker === stock.symbol.toLowerCase() && "bg-accent",
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
                      stock.isPositive ? "text-green-500" : "text-red-500",
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