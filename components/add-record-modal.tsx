import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"

const TICKERS = [
        { value: "EGH", label: "Ecobank Ghana (EGH)" },
        { value: "GCB", label: "GCB Bank (GCB)" },
        { value: "FML", label: "Fan Milk (FML)" },
        // ...add more as needed
]

export function AddRecordModal({ open, onOpenChange, onSubmit }: { open: boolean, onOpenChange: (open: boolean) => void, onSubmit: (data: any) => void }) {
const [ticker, setTicker] = useState("EGH")
const [noOfShares, setNoOfShares] = useState(1)
const [purchasePrice, setPurchasePrice] = useState(1)
const [purchaseDate, setPurchaseDate] = useState<Date>(new Date())
const [source, setSource] = useState("Databank Brokerage")

function handleDateChange(date: Date | undefined) {
    if (date) {
        setPurchaseDate(date)
    }
}

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
                    value={purchaseDate ? purchaseDate.toISOString().slice(0, 10) : ""}
                    onValueChange={dateStr => {
                        const date = dateStr ? new Date(dateStr) : new Date()
                        handleDateChange(date)
                    }}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select date" />
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
            {purchaseDate && (
            <div className="text-xs mt-1 text-muted-foreground">
                Selected: {purchaseDate.toISOString().slice(0, 10)}
            </div>
            )}
        </div>
        <div>
            <Label>Source</Label>
            <Input
            value={source}
            onChange={e => setSource(e.target.value)}
            required
            />
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
