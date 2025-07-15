"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Download, PieChart, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { PieChartComponent } from "@/components/pie-chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Area, ResponsiveContainer } from "recharts";
// import { usePortfolioData } from "@/hooks/use-portfolio-data"
import { usePortfolioData } from "@/hooks/use-portfolio-data-new"
import { useUpdatePortfolio } from "@/hooks/use-update-portfolio"
import { AddRecordModal } from "@/components/add-record-modal"
import { toast } from "@/hooks/use-toast"

export function PortfolioContent() {
  const [selectedPeriod, setSelectedPeriod] = useState("1Y")
  const [modalOpen, setModalOpen] = useState(false)
  const { data } = usePortfolioData(localStorage.getItem("userId") || "")
  const { mutate: updatePortfolio } = useUpdatePortfolio()
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

  function handleAddRecord(data: any) {
    data.userId = localStorage.getItem("userId") || ""
    setModalOpen(false)
    updatePortfolio(data, {
      onSuccess: () => {
        toast({
          title: "Record Added",
          description: `Successfully added ${data.ticker} record to your portfolio.`,
        })
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to update portfolio",
          variant: "destructive",
        })
      }
    })
  }

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
              {portfolioSummary.dayChangePercent.toFixed(2)}% Today
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col">
            <div className="text-sm font-medium text-muted-foreground">Total Gain/Loss</div>
            <div className="text-2xl font-bold mt-1">₵{portfolioSummary.totalGain.toFixed(2)}</div>
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
              {portfolioSummary.totalGainPercent.toFixed(2)}% All Time
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
      <AddRecordModal open={modalOpen} onOpenChange={setModalOpen} onSubmit={handleAddRecord} />
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
                    {/* <div //["#10b981", "#3e4e68ff", "#f59e0b", "#ef4444", "#8b5cf6", "#6b7280"]
                      className={`w-3 h-3 rounded-full mr-2 bg-${index % 6 === 0 ? "emerald" : index % 6 === 1 ? "blue" : index % 6 === 2 ? "yellow" : index % 6 === 3 ? "red" : index % 6 === 4 ? "violet" : "grey"}-500`} 
                    ></div> */}
                    <span className={`text-sm text-${index % 6 === 0 ? "emerald" : index % 6 === 1 ? "blue" : index % 6 === 2 ? "yellow" : index % 6 === 3 ? "red" : index % 6 === 4 ? "violet" : "grey"}-500`}>{holding.ticker }</span>
                  </div>
                  <span className="text-sm">{holding.allocation_percentage}%</span>
                </div>
              ))}
              {portfolioHoldings.length > 5 && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm text-grey-500">Others</span>
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
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Portfolio Details</CardTitle>
            <CardDescription>View and manage your stock holdings</CardDescription>
          </div>
          <Button variant="default" size="sm" onClick={() => setModalOpen(true)} className="h-8">
            Add Record
          </Button>
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
                        <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Source</th>
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
                          <td className="p-4 align-middle text-left">{transaction.source}</td>
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
                          <td className="p-4 align-middle text-right">₵{transaction.total_amount.toFixed(2)}</td>
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
    month: new Date(item.date).toLocaleDateString("en-US", { month: "short", year: "2-digit", day: "numeric" }),
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
            <span className="bg-green-500/20 text-green-500 px-2 py-0.5 rounded text-[10px] font-medium mr-2">LIVE</span>
            Chart updates when there is a price change
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
            tickFormatter={(value: number) => `₵${(value).toFixed(0)}`}
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
