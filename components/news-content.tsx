"use client"

import { useState } from "react"
import { BookmarkIcon, Calendar, Clock, Filter, Search, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample news data
const newsItems = [
  {
    id: 1,
    title: "Ghana Stock Exchange records 15% growth in Q1 2023",
    source: "Ghana Business News",
    time: "2 hours ago",
    date: "May 4, 2023",
    summary:
      "The Ghana Stock Exchange (GSE) has recorded a 15% growth in the first quarter of 2023, outperforming many regional markets.",
    content:
      "The Ghana Stock Exchange (GSE) has recorded a 15% growth in the first quarter of 2023, outperforming many regional markets. This growth has been attributed to increased investor confidence and the strong performance of listed companies, particularly in the financial and telecommunications sectors. The GSE Composite Index, which tracks the performance of all listed companies, closed at 3,245.67 points at the end of March, up from 2,823.19 points at the beginning of the year. Market analysts predict that this positive trend will continue throughout the year as the Ghanaian economy shows signs of recovery from the global economic downturn.",
    image: "/placeholder.svg?key=y8cjs",
    category: "Market Update",
    isBookmarked: false,
  },
  {
    id: 2,
    title: "MTN Ghana announces dividend payout for shareholders",
    source: "Business & Financial Times",
    time: "5 hours ago",
    date: "May 4, 2023",
    summary:
      "MTN Ghana has announced a dividend payout of GHS 0.11 per share for shareholders following strong performance in the last fiscal year.",
    content:
      "MTN Ghana has announced a dividend payout of GHS 0.11 per share for shareholders following strong performance in the last fiscal year. The telecommunications giant reported a 28% increase in profit after tax for the year ended December 31, 2022. The dividend will be paid to shareholders whose names appear in the register of members as of the close of business on May 15, 2023. The payment date has been set for June 2, 2023. This announcement has been well-received by investors, with MTN Ghana's stock price rising by 3.7% following the news. Analysts have noted that this dividend payout reflects the company's strong financial position and commitment to delivering value to shareholders.",
    image: "/placeholder.svg?key=5mopx",
    category: "Corporate News",
    isBookmarked: true,
  },
  {
    id: 3,
    title: "Bank of Ghana maintains policy rate at 30%",
    source: "Ghana Web",
    time: "Yesterday",
    date: "May 3, 2023",
    summary:
      "The Bank of Ghana's Monetary Policy Committee has decided to maintain the policy rate at 30% citing ongoing inflationary pressures.",
    content:
      "The Bank of Ghana's Monetary Policy Committee has decided to maintain the policy rate at 30% citing ongoing inflationary pressures. The decision was announced following the committee's 111th meeting held on April 30, 2023. According to the committee, while there are signs of inflation easing, the rate remains high at 18.2% as of March 2023. The committee noted that maintaining the policy rate at its current level is necessary to continue anchoring inflation expectations and support the disinflation process. Market analysts had widely expected this decision, given the current economic conditions. The committee also expressed optimism about the Ghanaian economy's growth prospects for 2023, projecting a GDP growth rate of 3.8%.",
    image: "/placeholder.svg?key=3ebeu",
    category: "Economic Policy",
    isBookmarked: false,
  },
  {
    id: 4,
    title: "Ecobank Ghana posts strong Q2 results",
    source: "Joy Business",
    time: "2 days ago",
    date: "May 2, 2023",
    summary:
      "Ecobank Ghana has posted impressive second quarter results with a 22% increase in profit after tax compared to the same period last year.",
    content:
      "Ecobank Ghana has posted impressive second quarter results with a 22% increase in profit after tax compared to the same period last year. The bank reported a profit after tax of GHS 286 million for the quarter ended March 31, 2023, up from GHS 234 million in the same period in 2022. Total assets grew by 15% to GHS 18.2 billion, while customer deposits increased by 17% to GHS 14.5 billion. The bank's strong performance has been attributed to growth in its loan book, improved asset quality, and effective cost management strategies. Following the announcement, Ecobank Ghana's stock price rose by 2.74% on the Ghana Stock Exchange. Analysts have upgraded their outlook for the bank, with many recommending it as a 'buy' for investors looking for exposure to the Ghanaian banking sector.",
    image: "/placeholder.svg?key=mlzoz",
    category: "Corporate News",
    isBookmarked: true,
  },
  {
    id: 5,
    title: "Ghana's inflation rate drops to 18.2% in March",
    source: "Citi Business News",
    time: "3 days ago",
    date: "May 1, 2023",
    summary:
      "Ghana's year-on-year inflation rate for March 2023 dropped to 18.2%, down from 19.5% recorded in February, according to the Ghana Statistical Service.",
    content:
      "Ghana's year-on-year inflation rate for March 2023 dropped to 18.2%, down from 19.5% recorded in February, according to the Ghana Statistical Service. This marks the second consecutive month of declining inflation in the country. The food inflation rate was 17.8%, while non-food inflation stood at 18.5%. The government has attributed the decline to its fiscal and monetary policy measures aimed at stabilizing the economy. Economists have welcomed this development but caution that inflation remains significantly above the central bank's target range of 6-10%. The continued decline in inflation is expected to have a positive impact on the stock market, as it may lead to a reduction in interest rates in the medium term, making equities more attractive to investors.",
    image: "/placeholder.svg?key=p9dn2",
    category: "Economic Indicators",
    isBookmarked: false,
  },
  {
    id: 6,
    title: "Ghana Oil Company announces expansion plans",
    source: "Energy Ghana",
    time: "4 days ago",
    date: "April 30, 2023",
    summary:
      "Ghana Oil Company (GOIL) has announced plans to expand its operations with the construction of 20 new service stations across the country.",
    content:
      "Ghana Oil Company (GOIL) has announced plans to expand its operations with the construction of 20 new service stations across the country. The expansion project, estimated to cost GHS 50 million, is expected to be completed by the end of 2023. According to the company's Managing Director, the expansion is part of GOIL's strategic plan to increase its market share in the downstream petroleum sector. The company also plans to venture into the upstream sector in partnership with international oil companies. GOIL's stock has responded positively to this announcement, with a 2.34% increase in its share price. Analysts believe that this expansion will strengthen GOIL's position as the leading indigenous oil marketing company in Ghana and potentially lead to increased dividends for shareholders in the coming years.",
    image: "/placeholder.svg?key=r7fk3",
    category: "Corporate News",
    isBookmarked: false,
  },
]

export function NewsContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedArticle, setSelectedArticle] = useState(newsItems[0])
  const [bookmarkedNews, setBookmarkedNews] = useState(newsItems.filter((item) => item.isBookmarked))

  const filteredNews = newsItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleBookmark = (id: number) => {
    const updatedNews = newsItems.map((item) => (item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item))

    // Update the selected article if it's the one being bookmarked/unbookmarked
    if (selectedArticle.id === id) {
      setSelectedArticle({ ...selectedArticle, isBookmarked: !selectedArticle.isBookmarked })
    }

    // Update the bookmarked news list
    setBookmarkedNews(updatedNews.filter((item) => item.isBookmarked))
  }

  const categories = ["All", "Market Update", "Corporate News", "Economic Policy", "Economic Indicators"]

  return (
    <div className="flex flex-col space-y-4 p-4 lg:p-6">
      <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
        <div className="w-full md:w-96 lg:w-[400px] flex flex-col gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">Market News</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search news..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              <Tabs defaultValue="latest" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="latest">Latest</TabsTrigger>
                  <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
                </TabsList>

                <TabsContent value="latest" className="m-0 space-y-4">
                  {filteredNews.length > 0 ? (
                    filteredNews.map((item) => (
                      <div
                        key={item.id}
                        className={`flex gap-4 p-3 rounded-md cursor-pointer hover:bg-accent ${selectedArticle.id === item.id ? "bg-accent" : ""}`}
                        onClick={() => setSelectedArticle(item)}
                      >
                        <Avatar className="h-12 w-12 rounded-md">
                          <AvatarImage src={item.image || "/placeholder.svg"} alt={item.source} />
                          <AvatarFallback className="rounded-md">{item.source.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 flex-1">
                          <h3 className="font-medium leading-tight text-sm">{item.title}</h3>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span>{item.source}</span>
                            <span className="mx-1">•</span>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{item.time}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No news articles found matching your search.
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="bookmarked" className="m-0 space-y-4">
                  {bookmarkedNews.length > 0 ? (
                    bookmarkedNews.map((item) => (
                      <div
                        key={item.id}
                        className={`flex gap-4 p-3 rounded-md cursor-pointer hover:bg-accent ${selectedArticle.id === item.id ? "bg-accent" : ""}`}
                        onClick={() => setSelectedArticle(item)}
                      >
                        <Avatar className="h-12 w-12 rounded-md">
                          <AvatarImage src={item.image || "/placeholder.svg"} alt={item.source} />
                          <AvatarFallback className="rounded-md">{item.source.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 flex-1">
                          <h3 className="font-medium leading-tight text-sm">{item.title}</h3>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span>{item.source}</span>
                            <span className="mx-1">•</span>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{item.time}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No bookmarked articles yet. Click the bookmark icon to save articles.
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xl">{selectedArticle.title}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <span>{selectedArticle.source}</span>
                  <span className="mx-2">•</span>
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{selectedArticle.date}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{selectedArticle.time}</span>
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleBookmark(selectedArticle.id)}
                  className={selectedArticle.isBookmarked ? "text-primary" : ""}
                >
                  <BookmarkIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative w-full h-48 md:h-64 lg:h-80 rounded-md overflow-hidden">
                <img
                  src={selectedArticle.image || "/placeholder.svg"}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground font-medium">{selectedArticle.summary}</p>
                <p>{selectedArticle.content}</p>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Related News</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {newsItems
                    .filter((item) => item.id !== selectedArticle.id && item.category === selectedArticle.category)
                    .slice(0, 2)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 p-2 rounded-md cursor-pointer hover:bg-accent"
                        onClick={() => setSelectedArticle(item)}
                      >
                        <Avatar className="h-10 w-10 rounded-md">
                          <AvatarImage src={item.image || "/placeholder.svg"} alt={item.source} />
                          <AvatarFallback className="rounded-md">{item.source.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="font-medium text-sm leading-tight">{item.title}</h4>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span>{item.source}</span>
                            <span className="mx-1">•</span>
                            <span>{item.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
