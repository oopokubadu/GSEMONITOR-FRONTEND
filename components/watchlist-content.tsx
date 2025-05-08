"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, Bell, BellOff, Edit, MoreHorizontal, Plus, Trash2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { StockChart } from "@/components/stock-chart"

// Sample watchlist data
const defaultWatchlists = [
  {
    id: 1,
    name: "My Watchlist",
    stocks: [
      {
        symbol: "GCB",
        name: "GCB Bank Ltd",
        price: 5.25,
        change: 0.15,
        changePercent: 2.94,
        isPositive: true,
        alerts: true,
      },
      {
        symbol: "MTNGH",
        name: "MTN Ghana",
        price: 1.12,
        change: 0.04,
        changePercent: 3.7,
        isPositive: true,
        alerts: false,
      },
      {
        symbol: "EGH",
        name: "Ecobank Ghana",
        price: 7.5,
        change: 0.2,
        changePercent: 2.74,
        isPositive: true,
        alerts: true,
      },
      {
        symbol: "TOTAL",
        name: "Total Petroleum Ghana",
        price: 4.3,
        change: -0.1,
        changePercent: 2.27,
        isPositive: false,
        alerts: false,
      },
    ],
  },
  {
    id: 2,
    name: "Financial Stocks",
    stocks: [
      {
        symbol: "GCB",
        name: "GCB Bank Ltd",
        price: 5.25,
        change: 0.15,
        changePercent: 2.94,
        isPositive: true,
        alerts: true,
      },
      {
        symbol: "EGH",
        name: "Ecobank Ghana",
        price: 7.5,
        change: 0.2,
        changePercent: 2.74,
        isPositive: true,
        alerts: false,
      },
      {
        symbol: "SOGEGH",
        name: "Societe Generale Ghana",
        price: 1.05,
        change: -0.02,
        changePercent: 1.87,
        isPositive: false,
        alerts: false,
      },
      {
        symbol: "CAL",
        name: "CAL Bank Limited",
        price: 0.85,
        change: -0.03,
        changePercent: 3.41,
        isPositive: false,
        alerts: true,
      },
      {
        symbol: "SCB",
        name: "Standard Chartered Bank",
        price: 21.5,
        change: 0.5,
        changePercent: 2.38,
        isPositive: true,
        alerts: false,
      },
    ],
  },
  {
    id: 3,
    name: "Consumer Goods",
    stocks: [
      {
        symbol: "GGBL",
        name: "Guinness Ghana Breweries",
        price: 2.15,
        change: 0.05,
        changePercent: 2.38,
        isPositive: true,
        alerts: false,
      },
      {
        symbol: "BOPP",
        name: "Benso Oil Palm Plantation",
        price: 3.7,
        change: -0.08,
        changePercent: 2.12,
        isPositive: false,
        alerts: true,
      },
      {
        symbol: "UNIL",
        name: "Unilever Ghana",
        price: 6.1,
        change: 0.12,
        changePercent: 2.01,
        isPositive: true,
        alerts: false,
      },
      {
        symbol: "FML",
        name: "Fan Milk Limited",
        price: 3.2,
        change: 0.08,
        changePercent: 2.56,
        isPositive: true,
        alerts: true,
      },
    ],
  },
]

export function WatchlistContent() {
  const [watchlists, setWatchlists] = useState(defaultWatchlists)
  const [activeWatchlist, setActiveWatchlist] = useState(watchlists[0])
  const [selectedStock, setSelectedStock] = useState(watchlists[0].stocks[0])
  const [newWatchlistName, setNewWatchlistName] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [editingWatchlistId, setEditingWatchlistId] = useState<number | null>(null)
  const [editingWatchlistName, setEditingWatchlistName] = useState("")
  
  useEffect(() => {
    if (watchlists.length > 0) {
      setActiveWatchlist(watchlists[0])
      setSelectedStock(watchlists[0].stocks[0])
    }
  }, [watchlists])


  const handleAddWatchlist = () => {
    if (newWatchlistName.trim()) {
      const newWatchlist = {
        id: Date.now(),
        name: newWatchlistName,
        stocks: [],
      }
      setWatchlists([...watchlists, newWatchlist])
      setNewWatchlistName("")
      setIsAddDialogOpen(false)
    }
  }

  const handleRenameWatchlist = () => {
    if (editingWatchlistName.trim() && editingWatchlistId) {
      setWatchlists(
        watchlists.map((list) => (list.id === editingWatchlistId ? { ...list, name: editingWatchlistName } : list)),
      )

      if (activeWatchlist.id === editingWatchlistId) {
        setActiveWatchlist({ ...activeWatchlist, name: editingWatchlistName })
      }

      setIsRenameDialogOpen(false)
    }
  }

  const handleDeleteWatchlist = (id: number) => {
    const updatedWatchlists = watchlists.filter((list) => list.id !== id)
    setWatchlists(updatedWatchlists)

    if (activeWatchlist.id === id && updatedWatchlists.length > 0) {
      setActiveWatchlist(updatedWatchlists[0])
    }
  }

  const toggleStockAlert = (symbol: string) => {
    const updatedWatchlist = {
      ...activeWatchlist,
      stocks: activeWatchlist.stocks.map((stock) =>
        stock.symbol === symbol ? { ...stock, alerts: !stock.alerts } : stock,
      ),
    }

    setActiveWatchlist(updatedWatchlist)
    setWatchlists(watchlists.map((list) => (list.id === activeWatchlist.id ? updatedWatchlist : list)))

    if (selectedStock.symbol === symbol) {
      setSelectedStock({ ...selectedStock, alerts: !selectedStock.alerts })
    }
  }

  const removeStockFromWatchlist = (symbol: string) => {
    const updatedStocks = activeWatchlist.stocks.filter((stock) => stock.symbol !== symbol)
    const updatedWatchlist = { ...activeWatchlist, stocks: updatedStocks }

    setActiveWatchlist(updatedWatchlist)
    setWatchlists(watchlists.map((list) => (list.id === activeWatchlist.id ? updatedWatchlist : list)))

    if (updatedStocks.length > 0 && selectedStock.symbol === symbol) {
      setSelectedStock(updatedStocks[0])
    }
  }

  return (
    <div className="flex flex-col space-y-4 p-4 lg:p-6">
      <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
        <div className="w-full md:w-80 lg:w-96 flex flex-col gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">My Watchlists</CardTitle>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Watchlist</DialogTitle>
                    <DialogDescription>Enter a name for your new watchlist.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Watchlist Name</Label>
                      <Input
                        id="name"
                        value={newWatchlistName}
                        onChange={(e) => setNewWatchlistName(e.target.value)}
                        placeholder="My New Watchlist"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddWatchlist}>Create Watchlist</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename Watchlist</DialogTitle>
                    <DialogDescription>Enter a new name for your watchlist.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="rename">Watchlist Name</Label>
                      <Input
                        id="rename"
                        value={editingWatchlistName}
                        onChange={(e) => setEditingWatchlistName(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleRenameWatchlist}>Rename Watchlist</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue={activeWatchlist.id.toString()}
                onValueChange={(value) => {
                  const selected = watchlists.find((list) => list.id.toString() === value)
                  if (selected) {
                    setActiveWatchlist(selected)
                    if (selected.stocks.length > 0) {
                      setSelectedStock(selected.stocks[0])
                    }
                  }
                }}
                className="w-full"
              >
                <TabsList className="flex overflow-x-auto overflow-y-hidden lg:pl-10 mb-4 space-4">
                  {watchlists.map((list) => (
                    <TabsTrigger key={list.id} value={list.id.toString()} className="flex-shrink-0">
                      {list.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {watchlists.map((list) => (
                  <TabsContent key={list.id} value={list.id.toString()} className="m-0">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">{list.name}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingWatchlistId(list.id)
                              setEditingWatchlistName(list.name)
                              setIsRenameDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500" onClick={() => handleDeleteWatchlist(list.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-1">
                      {list.stocks.length > 0 ? (
                        list.stocks.map((stock) => (
                          <div
                            key={stock.symbol}
                            className={cn(
                              "flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer",
                              selectedStock.symbol === stock.symbol && "bg-accent",
                            )}
                            onClick={() => setSelectedStock(stock)}
                          >
                            <div className="flex flex-col">
                              <div className="font-medium">{stock.symbol}</div>
                              <div className="text-xs text-muted-foreground">{stock.name}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex flex-col items-end">
                                <div className="font-medium">₵{stock.price}</div>
                                <div
                                  className={cn(
                                    "flex items-center text-xs",
                                    stock.isPositive ? "text-green-500" : "text-red-500",
                                  )}
                                >
                                  {stock.isPositive ? (
                                    <ArrowUp className="h-3 w-3 mr-1" />
                                  ) : (
                                    <ArrowDown className="h-3 w-3 mr-1" />
                                  )}
                                  {stock.isPositive ? "+" : ""}
                                  {stock.change} ({stock.changePercent}%)
                                </div>
                              </div>
                              <div className="flex flex-col space-y-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleStockAlert(stock.symbol)
                                  }}
                                >
                                  {stock.alerts ? (
                                    <Bell className="h-3 w-3 text-primary" />
                                  ) : (
                                    <BellOff className="h-3 w-3 text-muted-foreground" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-red-500"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeStockFromWatchlist(stock.symbol)
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No stocks in this watchlist. Add stocks from the Markets page.
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          {selectedStock && (
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex flex-col space-y-1">
                  <CardTitle className="text-xl flex items-center">
                    {selectedStock.symbol}{" "}
                    <span className="text-sm text-muted-foreground ml-2">{selectedStock.name}</span>
                  </CardTitle>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">₵{selectedStock.price}</span>
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
                <div className="flex items-center space-x-2">
                  <Button
                    variant={selectedStock.alerts ? "default" : "outline"}
                    size="sm"
                    className={selectedStock.alerts ? "bg-primary" : ""}
                    onClick={() => toggleStockAlert(selectedStock.symbol)}
                  >
                    {selectedStock.alerts ? (
                      <>
                        <Bell className="h-4 w-4 mr-2" />
                        Alerts On
                      </>
                    ) : (
                      <>
                        <BellOff className="h-4 w-4 mr-2" />
                        Set Alert
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm">
                    Trade
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="1D" className="w-full">
                  <div className="flex justify-between items-center mb-4">
                    {/* <TabsList>
                      <TabsTrigger value="1D">1D</TabsTrigger>
                      <TabsTrigger value="1W">1W</TabsTrigger>
                      <TabsTrigger value="1M">1M</TabsTrigger>
                      <TabsTrigger value="3M">3M</TabsTrigger>
                      <TabsTrigger value="1Y">1Y</TabsTrigger>
                      <TabsTrigger value="ALL">ALL</TabsTrigger>
                    </TabsList> */}
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      Last updated: 15:30 GMT
                    </div>
                  </div>
                  <TabsContent value="1D">
                    <StockChart period="1D" />
                  </TabsContent>
                  <TabsContent value="1W">
                    <StockChart period="1W" />
                  </TabsContent>
                  <TabsContent value="1M">
                    <StockChart period="1M" />
                  </TabsContent>
                  <TabsContent value="3M">
                    <StockChart period="3M" />
                  </TabsContent>
                  <TabsContent value="1Y">
                    <StockChart period="1Y" />
                  </TabsContent>
                  <TabsContent value="ALL">
                    <StockChart period="ALL" />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
