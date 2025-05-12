"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  isPositive: boolean
}

interface TradePanelProps {
  stock: Stock
}

export function TradePanel({ stock }: TradePanelProps) {
  const [quantity, setQuantity] = useState("100")
  const [orderType, setOrderType] = useState("market")
  const [limitPrice, setLimitPrice] = useState(stock?.price.toString())

  const calculateTotal = () => {
    const price = orderType === "market" ? stock?.price : Number.parseFloat(limitPrice)
    return (Number.parseFloat(quantity) * price).toFixed(2)
  }

  return (
    <Tabs defaultValue="buy" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="buy" className="data-[state=active]:bg-gray-500 data-[state=active]:text-white">
          Buy
        </TabsTrigger>
        <TabsTrigger value="sell" className="data-[state=active]:bg-gray-500 data-[state=active]:text-white">
          Sell
        </TabsTrigger>
      </TabsList>
      <TabsContent value="buy" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
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
              <RadioGroupItem value="market" id="market" />
              <Label htmlFor="market" className="cursor-pointer">
                Market
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="limit" id="limit" />
              <Label htmlFor="limit" className="cursor-pointer">
                Limit
              </Label>
            </div>
          </RadioGroup>
        </div>

        {orderType === "limit" && (
          <div className="space-y-2">
            <Label htmlFor="limitPrice">Limit Price (₵)</Label>
            <Input
              id="limitPrice"
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              step="0.01"
            />
          </div>
        )}

        <div className="pt-2 border-t">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Estimated Total:</span>
            <span className="font-medium">₵{calculateTotal()}</span>
          </div>
          <Button className="w-full bg-gray-500 hover:bg-gray-600">Buy {stock?.symbol}</Button>
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

        <div className="pt-2 border-t">
          <div className="flex justify-between mb-2">
            <span className="text-muted-foreground">Estimated Total:</span>
            <span className="font-medium">₵{calculateTotal()}</span>
          </div>
          <Button className="w-full bg-gray-500 hover:bg-gray-600">Sell {stock?.symbol}</Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}
