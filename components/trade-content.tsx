"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample stock data
const stocks = [
  {
    symbol: "GCB",
    name: "GCB Bank Ltd",
    price: 5.25,
    change: 0.15,
    changePercent: 2.94,
    isPositive: true,
    volume: "245K",
    bid: 5.2,
    ask: 5.3,
  },
  {
    symbol: "MTNGH",
    name: "MTN Ghana",
    price: 1.12,
    change: 0.04,
    changePercent: 3.7,
    isPositive: true,
    volume: "1.2M",
    bid: 1.1,
    ask: 1.14,
  },
  {
    symbol: "EGH",
    name: "Ecobank Ghana",
    price: 7.5,
    change: 0.2,
    changePercent: 2.74,
    isPositive: true,
    volume: "156K",
    bid: 7.45,
    ask: 7.55,
  },
  {
    symbol: "TOTAL",
    name: "Total Petroleum Ghana",
    price: 4.3,
    change: -0.1,
    changePercent: 2.27,
    isPositive: false,
    volume: "65K",
    bid: 4.25,
    ask: 4.35,
  },
  {
    symbol: "GGBL",
    name: "Guinness Ghana Breweries",
    price: 2.15,
    change: 0.05,
    changePercent: 2.38,
    isPositive: true,
    volume: "112K",
    bid: 2.1,
    ask: 2.2,
  },
]

export function TradeContent() {
  const [selectedStock, setSelectedStock] = useState(stocks[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [quantity, setQuantity] = useState("100")
  const [orderType, setOrderType] = useState("market")
  const [limitPrice, setLimitPrice] = useState(selectedStock.price.toString())
  // const [cashBalance] = useState(12500)

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const calculateTotal = (type: "buy" | "sell") => {
    const price =
      orderType === "market" ? (type === "buy" ? selectedStock.ask : selectedStock.bid) : Number.parseFloat(limitPrice)
    return (Number.parseFloat(quantity) * price).toFixed(2)
  }

  return (
    <div className="flex flex-col space-y-4 p-4 lg:p-6">
      <div className="w-full max-w-3xl mx-auto">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Place Order</CardTitle>
            <CardDescription>Execute trades quickly and efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search stocks..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && filteredStocks.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-card border rounded-md shadow-lg">
                  {filteredStocks.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="p-2 hover:bg-accent cursor-pointer"
                      onClick={() => {
                        setSelectedStock(stock)
                        setLimitPrice(stock.price.toString())
                        setSearchTerm("")
                      }}
                    >
                      <div className="font-medium">{stock.symbol}</div>
                      <div className="text-xs text-muted-foreground">{stock.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center mb-4">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-2xl font-bold mr-2">{selectedStock.symbol}</span>
                  <span className="text-muted-foreground">{selectedStock.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xl font-bold">₵{selectedStock.price}</span>
                  <span
                    className={`ml-2 flex items-center text-sm ${selectedStock.isPositive ? "text-green-500" : "text-red-500"}`}
                  >
                    {selectedStock.isPositive ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    {selectedStock.isPositive ? "+" : ""}
                    {selectedStock.change} ({selectedStock.changePercent}%)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-muted/50 p-3 rounded-md">
                <div className="text-sm text-muted-foreground">Bid</div>
                <div className="text-lg font-medium">₵{selectedStock.bid}</div>
              </div>
              <div className="bg-muted/50 p-3 rounded-md">
                <div className="text-sm text-muted-foreground">Ask</div>
                <div className="text-lg font-medium">₵{selectedStock.ask}</div>
              </div>
              <div className="bg-muted/50 p-3 rounded-md">
                <div className="text-sm text-muted-foreground">Volume</div>
                <div className="text-lg font-medium">{selectedStock.volume}</div>
              </div>
            </div>

            <Tabs defaultValue="buy" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="buy" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
                  Buy
                </TabsTrigger>
                <TabsTrigger value="sell" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                  Sell
                </TabsTrigger>
              </TabsList>

              <TabsContent value="buy" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity-buy">Quantity</Label>
                  <Input
                    id="quantity-buy"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    step="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Order Type</Label>
                  <RadioGroup defaultValue="market" onValueChange={setOrderType} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="market" id="market-buy" />
                      <Label htmlFor="market-buy" className="cursor-pointer">
                        Market
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="limit" id="limit-buy" />
                      <Label htmlFor="limit-buy" className="cursor-pointer">
                        Limit
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {orderType === "limit" && (
                  <div className="space-y-2">
                    <Label htmlFor="limitPrice-buy">Limit Price (₵)</Label>
                    <Input
                      id="limitPrice-buy"
                      type="number"
                      value={limitPrice}
                      onChange={(e) => setLimitPrice(e.target.value)}
                      step="0.01"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="duration-buy">Duration</Label>
                  <Select defaultValue="day">
                    <SelectTrigger id="duration-buy">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day Only</SelectItem>
                      <SelectItem value="gtc">Good Till Canceled</SelectItem>
                      <SelectItem value="gtd">Good Till Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Estimated Total:</span>
                    <span className="font-medium">₵{calculateTotal("buy")}</span>
                  </div>
                  <Button className="w-full bg-green-500 hover:bg-green-600">Buy {selectedStock.symbol}</Button>
                </div>
              </TabsContent>

              <TabsContent value="sell" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity-sell">Quantity</Label>
                  <Input
                    id="quantity-sell"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    step="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Order Type</Label>
                  <RadioGroup defaultValue="market" onValueChange={setOrderType} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="market" id="market-sell" />
                      <Label htmlFor="market-sell" className="cursor-pointer">
                        Market
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="limit" id="limit-sell" />
                      <Label htmlFor="limit-sell" className="cursor-pointer">
                        Limit
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {orderType === "limit" && (
                  <div className="space-y-2">
                    <Label htmlFor="limitPrice-sell">Limit Price (₵)</Label>
                    <Input
                      id="limitPrice-sell"
                      type="number"
                      value={limitPrice}
                      onChange={(e) => setLimitPrice(e.target.value)}
                      step="0.01"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="duration-sell">Duration</Label>
                  <Select defaultValue="day">
                    <SelectTrigger id="duration-sell">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day">Day Only</SelectItem>
                      <SelectItem value="gtc">Good Till Canceled</SelectItem>
                      <SelectItem value="gtd">Good Till Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Estimated Total:</span>
                    <span className="font-medium">₵{calculateTotal("sell")}</span>
                  </div>
                  <Button className="w-full bg-red-500 hover:bg-red-600">Sell {selectedStock.symbol}</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="w-full max-w-3xl mx-auto">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Order Status</CardTitle>
            <CardDescription>Track your pending orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted/50 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Buy GCB</div>
                    <div className="text-xs text-muted-foreground">Limit ₵5.20 × 200</div>
                  </div>
                  <div className="text-sm text-amber-500">Pending</div>
                </div>
              </div>
              <div className="bg-muted/50 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">Sell MTNGH</div>
                    <div className="text-xs text-muted-foreground">Market × 500</div>
                  </div>
                  <div className="text-sm text-amber-500">Pending</div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View All Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
