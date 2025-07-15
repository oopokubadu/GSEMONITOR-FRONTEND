import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { useDashboardData } from "@/hooks/use-dashboard-data"

export function AddRecordModal({ open, onOpenChange, onSubmit }: { open: boolean, onOpenChange: (open: boolean) => void, onSubmit: (data: any) => void }) {
const [ticker, setTicker] = useState("EGH")
const [noOfShares, setNoOfShares] = useState(1)
const [purchasePrice, setPurchasePrice] = useState(1)
const [purchaseDate, setPurchaseDate] = useState<Date>(new Date())
const [source, setSource] = useState("Databank Brokerage")
const { data: dashboardData = [], isLoading, isError } = useDashboardData()
const [broker, setBroker] = useState("Databank")

function handleDateChange(date: Date | undefined) {
    if (date) {
        setPurchaseDate(date)
    }
}
const TICKERS = dashboardData.map((item: any) => ({value: item.symbol, label: item.name}))

const brokers = [
                    { id: "databank", name: "Databank", logo: "https://cdn.brandfetch.io/idvnRWNCiD/w/334/h/334/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1741214899554" },
                    { id: "ic-securities", name: "IC Securities", logo: "https://cdn.brandfetch.io/idEHo1F7KY/w/200/h/200/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1740538630001" },
                    { id: "black-star", name: "Black Star Brokerage", logo: "https://gsiaonline.org/images/pagepics/gtlcmember_ff_20200203_1580732894.png" },
                    { id: "ecobank", name: "Ecobank Securities", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Ecobank_Logo.svg/750px-Ecobank_Logo.svg.png?20181117204655" },
                    { id: "sasghana", name: "Strategic African Securities", logo: "https://www.sasghana.com/assets/upload/logo.png" }
]

function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!purchaseDate) return
    onSubmit({
        ticker,
        no_of_shares: noOfShares,
        purchase_price: purchasePrice,
        purchase_date: purchaseDate.toISOString().slice(0, 10),
        source,
    })
    onOpenChange(false)
}

return (
    <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
        <DialogHeader>
        <DialogTitle>Add Portfolio Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <Label>Ticker</Label>
            <Select value={ticker} onValueChange={setTicker}>
            <SelectTrigger>
                <SelectValue placeholder="Select ticker" />
            </SelectTrigger>
            <SelectContent>
                {TICKERS.map(t => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
        <div>
            <Label>Number of Shares</Label>
            <Input
            type="number"
            min={1}
            value={noOfShares}
            onChange={e => setNoOfShares(Number(e.target.value))}
            required
            />
        </div>
        <div>
            <Label>Purchase Price</Label>
            <Input
            type="number"
            min={0}
            step={0.01}
            value={purchasePrice}
            onChange={e => setPurchasePrice(Number(e.target.value))}
            required
            />
        </div>
        <div>
            <Label>Purchase Date</Label>
            <div>
                <Select
                    name="date"
                    onValueChange={dateStr => {
                        const date = dateStr ? new Date(dateStr) : new Date()
                        handleDateChange(date)
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={purchaseDate ? purchaseDate.toISOString().slice(0, 10) : ""} />
                    </SelectTrigger>
                    <SelectContent>
                        <div className="p-2">
                            <Calendar
                                mode="single"
                                selected={purchaseDate}
                                onSelect={handleDateChange}
                                initialFocus
                            />
                        </div>
                    </SelectContent>
                </Select>
            </div>
            {/* {purchaseDate && (
            <div className="text-xs mt-1 text-muted-foreground">
                Selected: {purchaseDate.toISOString().slice(0, 10)}
            </div>
            )} */}
        </div>
        <div>
            <Label>Source</Label>
            <Select value={broker} onValueChange={setBroker}>
            <SelectTrigger>
                <SelectValue placeholder="Select Broker" />
            </SelectTrigger>
            <SelectContent>
                {brokers.map(t => (
                <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
        <DialogFooter>
            <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Add Record</Button>
        </DialogFooter>
        </form>
    </DialogContent>
    </Dialog>
)
}
