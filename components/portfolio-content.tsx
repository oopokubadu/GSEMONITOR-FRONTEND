"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Download, PieChart, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { PieChartComponent } from "@/components/pie-chart"
import { Area, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "@/components/ui/chart"
// import { usePortfolioData } from "@/hooks/use-portfolio-data"
import { usePortfolioData } from "@/hooks/use-portfolio-data-new"

// Sample portfolio data
// const portfolioSummary = {
//   totalValue: 45250.75,
//   dayChange: 1250.25,
//   dayChangePercent: 2.84,
//   totalGain: 8750.5,
//   totalGainPercent: 23.95,
//   isPositive: true,
// }
// {
//     "holdings_summary": [
//         {
//             "allocation_percentage": 11.54,
//             "current_value": 104.39999999999999,
//             "ticker": "EGH"
//         },
//         {
//             "allocation_percentage": 88.46,
//             "current_value": 800,
//             "ticker": "GCB"
//         }
//     ],
//     "last_update": "2025-06-28T21:26:52.340376+00:00",
//     "no_of_holdings": 2,
//     "overall_profit_loss_percentage": 585.15,
//     "total_invested": 132,
//     "total_portfolio_value": 904.4,
//     "total_profit_loss": 772.4
// }
//

// const portfolioHoldings = [
// [
//     {
//         "average_cost": 1,
//         "current_price": 8.7,
//         "current_value": 104.39999999999999,
//         "last_price_update": "Sat, 28 Jun 2025 21:34:28 GMT",
//         "last_updated": "Sat, 28 Jun 2025 20:59:06 GMT",
//         "name": "Ecobank Ghana Plc",
//         "profit_loss": 92.39999999999999,
//         "profit_loss_percentage": 769.9999999999999,
//         "ticker": "EGH",
//         "total_cost": 12,
//         "total_shares": 12,
//         "user_id": "01JXAF1DXDANPMWXCW773N3FNS"
//     },
//     {
//         "average_cost": 1.5,
//         "current_price": 10,
//         "current_value": 800,
//         "last_price_update": "Sat, 28 Jun 2025 21:34:29 GMT",
//         "last_updated": "Sat, 28 Jun 2025 21:00:54 GMT",
//         "name": "Ghana Commercial Bank Plc",
//         "profit_loss": 680,
//         "profit_loss_percentage": 566.6666666666667,
//         "ticker": "GCB",
//         "total_cost": 120,
//         "total_shares": 80,
//         "user_id": "01JXAF1DXDANPMWXCW773N3FNS"
//     }
// ]
//   {
//     symbol: "GCB",
//     name: "GCB Bank Ltd",
//     shares: 2000,
//     avgPrice: 4.75,
//     currentPrice: 5.25,
//     value: 10500,
//     gain: 1000,
//     gainPercent: 10.53,
//     isPositive: true,
//     allocation: 23.2,
//   },
//   {
//     symbol: "MTNGH",
//     name: "MTN Ghana",
//     shares: 5000,
//     avgPrice: 0.95,
//     currentPrice: 1.12,
//     value: 5600,
//     gain: 850,
//     gainPercent: 17.89,
//     isPositive: true,
//     allocation: 12.4,
//   },
//   {
//     symbol: "EGH",
//     name: "Ecobank Ghana",
//     shares: 1500,
//     avgPrice: 7.0,
//     currentPrice: 7.5,
//     value: 11250,
//     gain: 750,
//     gainPercent: 7.14,
//     isPositive: true,
//     allocation: 24.9,
//   },
//   {
//     symbol: "TOTAL",
//     name: "Total Petroleum Ghana",
//     shares: 1000,
//     avgPrice: 4.5,
//     currentPrice: 4.3,
//     value: 4300,
//     gain: -200,
//     gainPercent: -4.44,
//     isPositive: false,
//     allocation: 9.5,
//   },
//   {
//     symbol: "GGBL",
//     name: "Guinness Ghana Breweries",
//     shares: 2500,
//     avgPrice: 2.0,
//     currentPrice: 2.15,
//     value: 5375,
//     gain: 375,
//     gainPercent: 7.5,
//     isPositive: true,
//     allocation: 11.9,
//   },
//   {
//     symbol: "SOGEGH",
//     name: "Societe Generale Ghana",
//     shares: 3000,
//     avgPrice: 1.1,
//     currentPrice: 1.05,
//     value: 3150,
//     gain: -150,
//     gainPercent: -4.55,
//     isPositive: false,
//     allocation: 7.0,
//   },
//   {
//     symbol: "SCB",
//     name: "Standard Chartered Bank",
//     shares: 250,
//     avgPrice: 20.0,
//     currentPrice: 21.5,
//     value: 5375,
//     gain: 375,
//     gainPercent: 7.5,
//     isPositive: true,
//     allocation: 11.9,
//   },
// ]

// const transactionHistory = 
// [
//     {
//         "created_at": "Sat, 28 Jun 2025 20:59:06 GMT",
//         "no_of_shares": 12,
//         "price_per_share": 1,
//         "purchase_date": "Fri, 28 Feb 2025 00:00:00 GMT",
//         "purchase_price": 1,
//         "source": "Databank Brokerage",
//         "status": "completed",
//         "ticker": "EGH",
//         "total_amount": 12,
//         "txn_date": "Fri, 28 Feb 2025 00:00:00 GMT",
//         "txn_id": "01JYW5CCYYTMNY2J60GBYM692J",
//         "txn_type": "buy",
//         "user_id": "01JXAF1DXDANPMWXCW773N3FNS"
//     },
//     {
//         "created_at": "Sat, 28 Jun 2025 21:00:54 GMT",
//         "no_of_shares": 80,
//         "price_per_share": 1.5,
//         "purchase_date": "Sat, 07 Dec 2024 00:00:00 GMT",
//         "purchase_price": 1.5,
//         "source": "Databank Brokerage",
//         "status": "completed",
//         "ticker": "GCB",
//         "total_amount": 120,
//         "txn_date": "Sat, 07 Dec 2024 00:00:00 GMT",
//         "txn_id": "01JYW5FP0D4GM68WCARPPJX295",
//         "txn_type": "buy",
//         "user_id": "01JXAF1DXDANPMWXCW773N3FNS"
//     }
// ]
// [
//   { date: "2023-04-15", type: "Buy", symbol: "GCB", shares: 500, price: 4.75, value: 2375 },
//   { date: "2023-04-10", type: "Buy", symbol: "MTNGH", shares: 2000, price: 0.95, value: 1900 },
//   { date: "2023-03-28", type: "Sell", symbol: "TOTAL", shares: 200, price: 4.4, value: 880 },
//   { date: "2023-03-15", type: "Buy", symbol: "EGH", shares: 500, price: 7.0, value: 3500 },
//   { date: "2023-03-05", type: "Buy", symbol: "GGBL", shares: 1000, price: 2.0, value: 2000 },
//   { date: "2023-02-20", type: "Buy", symbol: "SCB", shares: 100, price: 20.0, value: 2000 },
//   { date: "2023-02-10", type: "Sell", symbol: "MTNGH", shares: 1000, price: 1.0, value: 1000 },
//   { date: "2023-01-25", type: "Buy", symbol: "SOGEGH", shares: 1500, price: 1.1, value: 1650 },
// ]

export function PortfolioContent() {
  const [selectedPeriod, setSelectedPeriod] = useState("1Y")
  const { data } = usePortfolioData(localStorage.getItem("userId") || "")
  const portfolioSummary = {
    totalValue: data?.summary?.total_portfolio_value || 0,
    dayChange: 0,
    dayChangePercent: data?.performance?.today_change_percentage || 0,
    totalGain: data?.summary?.total_profit_loss || 0,
    totalGainPercent: data?.summary?.overall_profit_loss_percentage || 0,
    isPositive: data?.summary?.total_profit_loss || 0 >= 0,
    holdings: data?.summary?.holdings_summary || [],
  }
  const portfolioHoldings = data?.holdings || []
  const transactionHistory = data?.transactions || []

  return (
    <div className="flex flex-col space-y-4 p-4 lg:p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex flex-col">
            <div className="text-sm font-medium text-muted-foreground">Total Portfolio Value</div>
            <div className="text-2xl font-bold mt-1">₵{portfolioSummary.totalValue.toLocaleString()}</div>
            <div
              className={cn(
                "flex items-center text-sm mt-1",
                portfolioSummary.isPositive ? "text-green-500" : "text-red-500",
              )}
            >
              {portfolioSummary.isPositive ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              ₵
              {/* {portfolioSummary.dayChange.toLocaleString()}  */}
              {portfolioSummary.dayChangePercent}% Today
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col">
            <div className="text-sm font-medium text-muted-foreground">Total Gain/Loss</div>
            <div className="text-2xl font-bold mt-1">₵{portfolioSummary.totalGain.toLocaleString()}</div>
            <div
              className={cn(
                "flex items-center text-sm mt-1",
                portfolioSummary.isPositive ? "text-green-500" : "text-red-500",
              )}
            >
              {portfolioSummary.isPositive ? (
                <ArrowUp className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 mr-1" />
              )}
              {portfolioSummary.totalGainPercent}% All Time
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col">
            <div className="text-sm font-medium text-muted-foreground">Number of Holdings</div>
            <div className="text-2xl font-bold mt-1">{portfolioHoldings.length}</div>
            <div className="flex items-center text-sm mt-1 text-muted-foreground">
              <RefreshCw className="h-4 w-4 mr-1" />
              Last updated: 15:30 GMT
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col bg-muted">
            <div className="text-sm font-medium text-muted-foreground">Cash Balance</div>
            <div className="text-2xl font-bold mt-1">₵XXXXX</div>
            <div className="flex items-center text-sm mt-1 text-muted-foreground">Available for trading</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Portfolio Performance</CardTitle>
            <div className="flex items-center space-x-2">
              {/* <div className="flex bg-muted rounded-md p-1">
                <Button
                  variant={selectedPeriod === "1M" ? "default" : "ghost"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setSelectedPeriod("1M")}
                >
                  1M
                </Button>
                <Button
                  variant={selectedPeriod === "3M" ? "default" : "ghost"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setSelectedPeriod("3M")}
                >
                  3M
                </Button>
                <Button
                  variant={selectedPeriod === "1Y" ? "default" : "ghost"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setSelectedPeriod("1Y")}
                >
                  1Y
                </Button>
                <Button
                  variant={selectedPeriod === "ALL" ? "default" : "ghost"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setSelectedPeriod("ALL")}
                >
                  ALL
                </Button>
              </div> */}
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <PortfolioLineChart period={selectedPeriod} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">Allocation</CardTitle>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <PieChart className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <PieChartComponent data={portfolioHoldings} />
            <div className="mt-4 space-y-2">
              {portfolioSummary.holdings.slice(0, 5).map((holding:{
                "allocation_percentage": number,
                "current_value": number,
                "ticker": "EGH"
                }, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 bg-green-500`} //${index % 5 === 0 ? "green" : index % 5 === 1 ? "yellow" : index % 5 === 2 ? "grey" : index % 5 === 3 ? "red" : "purple"}
                    ></div>
                    <span className="text-sm">{holding.ticker}</span>
                  </div>
                  <span className="text-sm">{holding.allocation_percentage}%</span>
                </div>
              ))}
              {portfolioHoldings.length > 5 && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2 bg-gray-500"></div>
                    <span className="text-sm">Others</span>
                  </div>
                  <span className="text-sm">
                    {portfolioSummary.holdings
                      .slice(5)
                      .reduce((sum: any, holding: { allocation_percentage: any }) => sum + holding.allocation_percentage, 0)
                      .toFixed(1)}
                    %
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Portfolio Details</CardTitle>
          <CardDescription>View and manage your stock holdings</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="holdings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="holdings">Holdings</TabsTrigger>
              <TabsTrigger value="transactions">Transaction History</TabsTrigger>
            </TabsList>

            <TabsContent value="holdings" className="m-0">
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Symbol</th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                        <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Shares</th>
                        <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">
                          Avg Price
                        </th>
                        <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">
                          Current Price
                        </th>
                        <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Value</th>
                        <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">
                          Gain/Loss
                        </th>
                        <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">
                          % Gain/Loss
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolioHoldings.map((holding: any, index: number) => (
                        <tr key={index} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle font-medium">{holding.ticker}</td>
                          <td className="p-4 align-middle">{holding.name}</td>
                          <td className="p-4 align-middle text-right">{holding.total_shares.toLocaleString()}</td>
                          <td className="p-4 align-middle text-right">₵{holding.average_cost.toFixed(2)}</td>
                          <td className="p-4 align-middle text-right">₵{holding.current_price.toFixed(2)}</td>
                          <td className="p-4 align-middle text-right">₵{holding.total_cost.toLocaleString()}</td>
                          <td
                            className={cn(
                              "p-4 align-middle text-right",
                              holding.profit_loss > 0  ? "text-green-500" : "text-red-500",
                            )}
                          >
                            {holding.profit_loss > 0 ? "+" : ""}₵{holding.profit_loss.toFixed(2)}
                          </td>
                          <td
                            className={cn(
                              "p-4 align-middle text-right",
                              holding.profit_loss > 0  ? "text-green-500" : "text-red-500",
                            )}
                          >
                            {holding.profit_lost > 0  ? "+" : ""}
                            {holding.profit_loss_percentage.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="m-0">
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Type</th>
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Symbol</th>
                        <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Shares</th>
                        <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Price</th>
                        <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionHistory.map((transaction: any, index: number) => (
                        <tr key={index} className="border-b transition-colors hover:bg-muted/50">
                          <td className="p-4 align-middle">{new Date(transaction.created_at).toLocaleDateString()}</td>
                          <td
                            className={cn(
                              "p-4 align-middle",
                              transaction.txn_type === "buy" ? "text-green-500" : "text-red-500",
                            )}
                          >
                            {transaction.txn_type}
                          </td>
                          <td className="p-4 align-middle font-medium">{transaction.ticker}</td>
                          <td className="p-4 align-middle text-right">{transaction.no_of_shares.toLocaleString()}</td>
                          <td className="p-4 align-middle text-right">₵{transaction.price_per_share.toFixed(2)}</td>
                          <td className="p-4 align-middle text-right">₵{transaction.total_amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function PortfolioLineChart({ period }: { period: string }) {
  const { data: performanceData, isLoading, error, refetch } = usePortfolioData(localStorage.getItem("userId") || "")
  let data = performanceData?.performance?.performance ?? []

  data = data.map((item: { date: string; portfolio_value: number }) => ({
    date: item.date,
    // new Date(item.date).toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    value: item.portfolio_value,
  }))

  if (isLoading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-[300px] w-full flex flex-col items-center justify-center">
        <p className="text-destructive mb-4">Failed to load performance data</p>
        {/* <p className="text-xs text-muted-foreground mb-4">{error instanceof Error ? error.message : "Unknown error"}</p> */}
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <div className="flex justify-between mb-2">
        <div className="text-xs text-muted-foreground">
          <span className="inline-flex items-center">
            <span className="bg-green-500/20 text-green-500 px-2 py-0.5 rounded text-[10px] font-medium mr-2">DEV</span>
            Using sample data
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => refetch()} className="h-7">
          <RefreshCw className="h-3 w-3 mr-1" />
          Refresh
        </Button>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
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
            tickFormatter={(value: number) => `₵${(value / 1000).toFixed(0)}K`}
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
          <Line
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
          <Area type="monotone" dataKey="value" stroke="transparent" fillOpacity={0.6} fill="url(#colorValue)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
