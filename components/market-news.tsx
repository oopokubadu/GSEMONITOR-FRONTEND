"use client"

import { Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const newsItems = [
  {
    id: 1,
    title: "Ghana Stock Exchange records 15% growth in Q1 2023",
    source: "Ghana Business News",
    time: "2 hours ago",
    summary:
      "The Ghana Stock Exchange (GSE) has recorded a 15% growth in the first quarter of 2023, outperforming many regional markets.",
    image: "/placeholder.svg?key=y8cjs",
  },
  {
    id: 2,
    title: "MTN Ghana announces dividend payout for shareholders",
    source: "Business & Financial Times",
    time: "5 hours ago",
    summary:
      "MTN Ghana has announced a dividend payout of GHS 0.11 per share for shareholders following strong performance in the last fiscal year.",
    image: "/placeholder.svg?key=5mopx",
  },
  {
    id: 3,
    title: "Bank of Ghana maintains policy rate at 30%",
    source: "Ghana Web",
    time: "Yesterday",
    summary:
      "The Bank of Ghana's Monetary Policy Committee has decided to maintain the policy rate at 30% citing ongoing inflationary pressures.",
    image: "/placeholder.svg?key=3ebeu",
  },
  {
    id: 4,
    title: "Ecobank Ghana posts strong Q2 results",
    source: "Joy Business",
    time: "2 days ago",
    summary:
      "Ecobank Ghana has posted impressive second quarter results with a 22% increase in profit after tax compared to the same period last year.",
    image: "/placeholder.svg?key=mlzoz",
  },
]

export function MarketNews() {
  return (
    <div className="space-y-4">
      {newsItems.map((item) => (
        <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
          <Avatar className="h-10 w-10 rounded-md">
            <AvatarImage src={item.image || "/placeholder.svg"} alt={item.source} />
            <AvatarFallback className="rounded-md">{item.source.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-medium leading-tight">{item.title}</h3>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{item.source}</span>
              <span className="mx-1">•</span>
              <Clock className="h-3 w-3 mr-1" />
              <span>{item.time}</span>
            </div>
            <p className="text-sm text-muted-foreground">{item.summary}</p>
          </div>
        </div>
      ))}
      <Button variant="outline" className="w-full">
        View All News
      </Button>
    </div>
  )
}
