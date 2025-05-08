"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, Clock, Filter, Info, MoreHorizontal, RefreshCw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TopStocks } from "@/components/top-stocks"
import { MarketNews } from "@/components/market-news"
import { TradePanel } from "@/components/trade-panel"
import { CandlestickChart } from "@/components/candlestick-chart"
import { useDashboardData } from "@/hooks/use-dashboard-data"

export function DashboardContent() {
  const { data: dashboardData = [], isLoading, isError } = useDashboardData()
  const [activeStock, setActiveStock] = useState(() => dashboardData[0] || null)
  const [filteredStocks, setFilteredStocks] = useState(dashboardData)
  const [activeFilter, setActiveFilter] = useState("All") // Track the active filter
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("ID") // Default period is ID

  // Update activeStock and filteredStocks when dashboardData changes
  useEffect(() => {
    if (dashboardData.length > 0) {
      setActiveStock(dashboardData[0])
      setFilteredStocks(dashboardData)
    }
  }, [dashboardData])

  // Sort stocks by gainers
  const handleGainers = () => {
    const gainers = [...dashboardData]
      .filter(stock => stock.isPositive)
      .sort((a, b) => b.changePercent - a.changePercent)
    setFilteredStocks(gainers)
    setActiveFilter("Gainers") // Set active filter to Gainers
  }

  // Sort stocks by losers
  const handleLosers = () => {
    const losers = [...dashboardData]
      .filter(stock => !stock.isPositive)
      .sort((a, b) => a.changePercent - b.changePercent)
    setFilteredStocks(losers)
    setActiveFilter("Losers") // Set active filter to Losers
  }

  // Reset to default (volume or original order)
  const handleVolume = () => {
    setFilteredStocks(dashboardData)
    setActiveFilter("All") // Set active filter to All
  }

  if (isLoading) {
    return <div>Loading dashboard data...</div>
  }

  if (isError) {
    return <div>Error loading dashboard data.</div>
  }

  const periodMap: Record<string, string> = {
    "1D": "daily",
    "1W": "weekly",
    "1M": "monthly",
    "3M": "quarterly",
    "1Y": "yearly"
  }
  const selectedPeriod = periodMap[selectedTimePeriod] || "daily"

  return (
    <div className="flex flex-col space-y-4 p-4 lg:p-6 lg:space-y-6">
      <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
        <div className="flex-1">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex flex-col space-y-1">
                <CardTitle className="text-xl flex items-center">
                  {activeStock?.symbol} <span className="text-sm text-muted-foreground ml-2">{activeStock?.name}</span>
                </CardTitle>
                <div className="flex items-center">
                  <span className="text-2xl font-bold">₵{activeStock?.price}</span>
                  <span
                    className={`ml-2 flex items-center text-sm ${activeStock?.isPositive ? "text-green-500" : "text-red-500"}`}
                  >
                    {activeStock?.isPositive ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {activeStock?.isPositive ? "+" : ""}
                    {activeStock?.change} ({activeStock?.changePercent}%)
                  </span>
                </div>
              </div>
              {/* <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div> */}
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="1D"
                className="w-full"
                onValueChange={setSelectedTimePeriod}
              >
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="1D">1D</TabsTrigger>
                    <TabsTrigger value="1W">1W</TabsTrigger>
                    <TabsTrigger value="1M">1M</TabsTrigger>
                    <TabsTrigger value="3M">3M</TabsTrigger>
                    <TabsTrigger value="1Y">1Y</TabsTrigger>
                  </TabsList>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    Last updated: 15:30 GMT
                  </div>
                </div>
                <TabsContent value={selectedTimePeriod} key={activeStock?.symbol}>
                  <CandlestickChart
                    ticker={activeStock?.symbol.toLowerCase()}
                    period={selectedPeriod}
                    chartType="line"
                    containerClassName="h-[300px] w-full"
                    isHorizontalToolActive={false}
                    isVerticalToolActive={false}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        <div className="w-full md:w-80 lg:w-96 flex flex-col gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Coming Soon (Trade)</CardTitle>
              <CardDescription>Execute trades for {activeStock?.symbol}</CardDescription>
            </CardHeader>
            <CardContent>
              <TradePanel stock={activeStock} />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Top Stocks</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={activeFilter === "Gainers" ? "default" : "ghost"}
                size="sm"
                className="h-8 text-xs"
                onClick={handleGainers}
              >
                Gainers
              </Button>
              <Button
                variant={activeFilter === "Losers" ? "default" : "ghost"}
                size="sm"
                className="h-8 text-xs"
                onClick={handleLosers}
              >
                Losers
              </Button>
              <Button
                variant={activeFilter === "All" ? "default" : "ghost"}
                size="sm"
                className="h-8 text-xs"
                onClick={handleVolume}
              >
                All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <TopStocks setActiveStock={setActiveStock} stocks={filteredStocks} />
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Market News</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                <Filter className="h-3 w-3" /> Filter
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                <Search className="h-3 w-3" /> Search
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <MarketNews />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}