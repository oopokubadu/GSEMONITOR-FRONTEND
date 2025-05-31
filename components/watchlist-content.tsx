"use client"

import { useState, useEffect } from "react"
import { PlusCircleIcon, ArrowDown, ArrowUp, Bell, BellOff, Edit, MoreHorizontal, Plus, Trash2, Clock, Save } from "lucide-react"
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
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { useGetProfile } from "@/hooks/use-get-profile"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useUpdateProfile } from "@/hooks/use-update-profile"
import { useSendPriceAlert } from "@/hooks/use-send-alert"
import { toast } from "@/hooks/use-toast"

// Sample watchlist data
const defaultWatchlists = [
  {
    id: 1,
    name: "WatchList Loading",
    stocks: [
      {
        symbol: "",
        name: "",
        price: 0.0,
        change: 0.0,
        changePercent: 0.0,
        isPositive: true,
        alerts: false,
      },
    ],
  }
]

export function WatchlistContent() {
  const [watchlists, setWatchlists] = useState(defaultWatchlists)
  const [activeWatchlist, setActiveWatchlist] = useState(watchlists[0])
  console.log(watchlists)
  const [selectedStock, setSelectedStock] = useState(watchlists[0]?.stocks && watchlists[0]?.stocks[0])
  const [newWatchlistName, setNewWatchlistName] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isAddStockDialogOpen, setIsAddStockDialogOpen] = useState(false)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [editingWatchlistId, setEditingWatchlistId] = useState<number | null>(null)
  const [editingWatchlistName, setEditingWatchlistName] = useState("")
  const [selectedTicker, setSelectedTicker] = useState("")
  const [saved, setSaved] = useState(true)
  const [isPriceAlertDialogOpen, setIsPriceAlertDialogOpen] = useState(false)
  const [alertPrice, setAlertPrice] = useState("")
  const { data: dashboardData = [], isLoading, isError } = useDashboardData()
  const { data: profile, isLoading: isProfileLoading, isError: isProfileError, error } = useGetProfile();
  const { mutate: updateProfile } = useUpdateProfile();
  const { mutate: sendPriceAlert } = useSendPriceAlert();
  
    // Load watchlists from profile
    useEffect(() => {
      if (profile && profile.watchlist) {
        const formattedWatchlists = profile.watchlist.map((list: any, index: number) => ({
          id: index + 1, // Generate a unique ID for each watchlist
          name: list.name,
          stocks: list.tickers?.map((ticker: string) => {
            const stockData = dashboardData.find((stock) => stock.symbol === ticker.toUpperCase())
            return {
              symbol: ticker.toUpperCase(),
              name: stockData?.name || ticker.toUpperCase(), // Use dashboardData name or fallback to ticker
              price: stockData?.price || 0, // Use dashboardData price or fallback to 0
              change: stockData?.change || 0, // Use dashboardData change or fallback to 0
              changePercent: stockData?.changePercent || 0, // Use dashboardData changePercent or fallback to 0
              isPositive: stockData?.isPositive ?? true, // Use dashboardData isPositive or fallback to true
              alerts: false, // Default alerts to false
            }
          }),
        }))
        setWatchlists(formattedWatchlists)
        if (formattedWatchlists.length > 0) {
          setActiveWatchlist(formattedWatchlists[0])
          if (formattedWatchlists[0]?.stocks?.length > 0) {
            setSelectedStock(formattedWatchlists[0].stocks[0])
          }
        }
      }
    }, [profile, dashboardData])

  const handleAddWatchlist = () => {
    if (newWatchlistName.trim()) {
      const newWatchlist = {
        id: Date.now(),
        name: newWatchlistName,
        stocks: [],
      }
      setWatchlists([...watchlists, newWatchlist])
      setSaved(false)
      setNewWatchlistName("")
      setIsAddDialogOpen(false)
    }
  }

  const handleSetPriceAlert = () => {
    setIsPriceAlertDialogOpen(false)
    if (alertPrice.trim()) {
      // const updatedWatchlist = {
      //   ...activeWatchlist,
      //   stocks: activeWatchlist.stocks.map((stock) =>
      //     stock.symbol === stockSymbol ? { ...stock, alertPrice: parseFloat(alertPrice) } : stock,
      //   ),
      // }
      // setActiveWatchlist(updatedWatchlist)
      // setWatchlists(watchlists.map((list) => (list.id === activeWatchlist.id ? updatedWatchlist : list)))
      sendPriceAlert({
        ticker: selectedStock.symbol,
        price: parseFloat(alertPrice),
      }, {
      onSuccess: () => {
        toast({
          title: "Price Alert Set",
          description: `You will be notified when ${selectedStock.symbol} reaches ₵${alertPrice}.`
        })
        console.log("Price alert set successfully")
      },
      onError: (error) => {
        console.error("Failed to set price alert:", error)
        setIsPriceAlertDialogOpen(false)
        toast({
          title: "Error",
          description: `Failed to set price alert for ${selectedStock.symbol}. Please try again.`,
          variant: "destructive",
        })
      },
      })
      setAlertPrice("")
      // Here you can add logic to actually set the price alert in your backend or notification system
    } else {
      console.error("Please enter a valid alert price and stock symbol.")
      // You can show an error message to the user here
    }
  }

  const saveActiveWatchlist = () => {
    const formData = profile;

    formData.watchlist = watchlists.map((list) => ({
      name: list.name,
      tickers: list.stocks?.map((stock) => stock.symbol.toLowerCase()) || [], 
    }));
    
    if(!saved){
      setSaved(true)
      updateProfile(formData, {
      onSuccess: () => {
        console.log("Profile updated successfully")
        },
      onError: () => {
        setSaved(false)
        console.error("Failed to update profile")
        },
      })
    }
  }

  const handleAddStocklist = () => {
      const updatedWatchList =  watchlists.map((list) => {
            return list.id === editingWatchlistId
            ? { ...list, stocks: [...list.stocks ?? [], JSON.parse(selectedTicker)] }
            : list
        })
        console.log("updatedWatchList", updatedWatchList)
      setWatchlists(updatedWatchList)
      setSaved(false)
      setIsAddStockDialogOpen(false)
  }

  const handleRenameWatchlist = () => {
    if (editingWatchlistName.trim() && editingWatchlistId) {
      setWatchlists(
        watchlists.map((list) => (list.id === editingWatchlistId ? { ...list, name: editingWatchlistName } : list)),
      )

      if (activeWatchlist.id === editingWatchlistId) {
        setActiveWatchlist({ ...activeWatchlist, name: editingWatchlistName })
      }
      setSaved(false)
      setIsRenameDialogOpen(false)
    }
  }

  const handleDeleteWatchlist = (id: number) => {
    const updatedWatchlists = watchlists.filter((list) => list.id !== id)
    setWatchlists(updatedWatchlists)

    if (activeWatchlist.id === id && updatedWatchlists.length > 0) {
      setActiveWatchlist(updatedWatchlists[0])
    }

    setSaved(false)
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
    setSaved(false)
  }

  return (
    <div className="flex flex-col space-y-4 p-4 lg:p-6">
      <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
        <div className="w-full md:w-80 lg:w-96 flex flex-col gap-4">
          <Card>
            {!saved && <center><sub className="text-red-500">Unsaved Changes will Be lost</sub></center>}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">My Watchlists</CardTitle>
              <div>
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
               <Button variant="outline" size="icon" className={!saved ? "bg-red-500 ml-2" : 'bg-green-500 ml-2'} onClick={saveActiveWatchlist}>
                    <Save/>
              </Button>
              <Dialog open={isAddStockDialogOpen} onOpenChange={setIsAddStockDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Stock to Watchlist</DialogTitle>
                    <DialogDescription>Select a stock to add</DialogDescription>
                  </DialogHeader>
                  <Select onValueChange={setSelectedTicker}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select ticker" />
                    </SelectTrigger>
                    <SelectContent>
                      {dashboardData
                      // profile?.watchlist[list.id - 1].tickers
                      .filter((stock) =>
                        editingWatchlistId !== null &&
                        !profile?.watchlist[editingWatchlistId - 1]?.tickers?.includes(stock.symbol.toLowerCase())
                      )
                      .map((stock) => (
                        <SelectItem key={stock.symbol.toLowerCase()} value={JSON.stringify(stock)}>
                          {stock.symbol} - {stock.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddStockDialogOpen(false)}>
                      Close
                    </Button>
                    <Button onClick={handleAddStocklist}>Add to Watchlist</Button>
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
              <Dialog open={isPriceAlertDialogOpen} onOpenChange={setIsPriceAlertDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Set Price Alert for {selectedStock.symbol}</DialogTitle>
                    <DialogDescription>Enter the details for your price alert.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="price-alert">Alert Price</Label>
                      <Input
                        id="price-alert"
                        value={alertPrice}
                        onChange={(e) => setAlertPrice(e.target.value)}
                        type="number"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsPriceAlertDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSetPriceAlert}>Set Alert</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              </div>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue={activeWatchlist.id.toString()}
                onValueChange={(value) => {
                  const selected = watchlists.find((list) => list.id.toString() === value)
                  if (selected) {
                    setActiveWatchlist(selected)
                    if (selected?.stocks?.length > 0) {
                      setSelectedStock(selected?.stocks[0])
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
                              setIsAddStockDialogOpen(!isAddDialogOpen)
                            }}
                          >
                            <PlusCircleIcon className="mr-2 h-4 w-4" />
                            Add
                          </DropdownMenuItem>
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
                      {list.stocks?.length > 0 ? (
                        list.stocks?.map((stock) => (
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
                                    !selectedStock.alerts &&  setIsPriceAlertDialogOpen(true)
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
          {watchlists[0]?.stocks?.length > 0 && selectedStock && (
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
                    onClick={() => {
                      toggleStockAlert(selectedStock.symbol)
                      !selectedStock.alerts && setIsPriceAlertDialogOpen(true)
                    }
                  }
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
                  {/* <Button variant="outline" size="sm">
                    Trade (Coming Soon)
                  </Button> */}
                </div>
              </CardHeader>
              {
              selectedStock.symbol.length > 0 && <CardContent>
                <Tabs defaultValue="1D" className="w-full">
                  <div className="flex justify-between items-center mb-4">
                    <TabsList>
                      <TabsTrigger value="1D">1D</TabsTrigger>
                      <TabsTrigger value="1W">1W</TabsTrigger>
                      <TabsTrigger value="1M">1M</TabsTrigger>
                      <TabsTrigger value="3M">3M</TabsTrigger>
                      <TabsTrigger value="1Y">1Y</TabsTrigger>
                      <TabsTrigger value="ALL">ALL</TabsTrigger>
                    </TabsList>
                    {/* <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      Last updated: 15:30 GMT
                    </div> */}
                  </div>
                  <TabsContent value="1D">
                    <StockChart ticker={selectedStock.symbol} period="1D" />
                  </TabsContent>
                  <TabsContent value="1W">
                    <StockChart ticker={selectedStock.symbol} period="1W" />
                  </TabsContent>
                  <TabsContent value="1M">
                    <StockChart ticker={selectedStock.symbol} period="1M" />
                  </TabsContent>
                  <TabsContent value="3M">
                    <StockChart ticker={selectedStock.symbol} period="3M" />
                  </TabsContent>
                  <TabsContent value="1Y">
                    <StockChart ticker={selectedStock.symbol} period="1Y" />
                  </TabsContent>
                  <TabsContent value="ALL">
                    <StockChart ticker={selectedStock.symbol} period="ALL" />
                  </TabsContent>
                </Tabs>
              </CardContent>
              }
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
