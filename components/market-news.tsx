"use client"

import { Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useNewsData } from "@/hooks/use-news-data"

function formatDate(dateString: string) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options).replace(/,/g, '');
}

export function MarketNews() {
  const {data: NewsData} = useNewsData()
  const newsItems = NewsData?.map((news, index) => ({
    id: index,
    title: news.headline,
    source: news.source,
    time: formatDate(news.date_time_published),
    summary: news.summary,
    sentiment: news.sentiment,
    image: "/placeholder.svg?key=mlzoz",
  }))

  return (
    <div className="space-y-4">
      {newsItems?.slice(0,4).map((item) => (
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
              <span className="mx-1">•</span>
              <span>{item.sentiment}</span>
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
