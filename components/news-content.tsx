"use client"

import { useState, useEffect } from "react"
import { BookmarkIcon, Calendar, Clock, Filter, Search, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNewsData } from "@/hooks/use-news-data"
import { formatDate, timeAgo } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { handleShare } from "@/lib/utils"

export function NewsContent() {
  const urlParams = new URLSearchParams(window.location.search);
  const newsId = urlParams.get("id");
  const {data : NewsData} = useNewsData()
  const newsData = NewsData?.map((news, index) => ({
    id: index + 1,
    title: news.headline,
    source: news.source,
    time: timeAgo(news.date_time_published),
    date: formatDate(news.date_time_published),
    summary: news.summary,
    content: news.content,
    category: news.sentiment,
    url: news.url,
    image: news.thumbnail,
    isBookmarked: false,
  }))
  
  const [ newsItems, setNewsItems ] = useState([{
    id: 1,
    title: "",
    source: "",
    time: "",
    date: "",
    summary:"",
    content:"",
    image: "/placeholder.svg?key=r7fk3",
    category: "",
    isBookmarked: false,
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedArticle, setSelectedArticle] = useState(newsItems?.[0] ?? null)
  const [bookmarkedNews, setBookmarkedNews] = useState((newsItems ?? []).filter((item) => item.isBookmarked))
  

// Update newsItems when newsData changes
useEffect(() => {
  setNewsItems(prevItems => {
    if (newsData && JSON.stringify(prevItems) !== JSON.stringify(newsData)) {
      newsId ? setSelectedArticle(newsData[+newsId - 1]): setSelectedArticle(newsData[0])
      return newsData;
    }
    return prevItems;
  });
}, [newsData]);


  const filteredNews = newsItems?.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleBookmark = (id: number) => {
    const updatedNews = newsItems.map((item) => (item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item))

    // // Update the selected article if it's the one being bookmarked/unbookmarked
    // if (selectedArticle.id === id) {
    //   setSelectedArticle({ ...selectedArticle, isBookmarked: !selectedArticle.isBookmarked })
    // }

    // // Update the bookmarked news list
    // setBookmarkedNews(updatedNews.filter((item) => item.isBookmarked))
  }

  const categories = ["All", "Neutral", "Positive", "Negative"]

  const handleShareNews = (platform?: string) => {
    const query = `id=${selectedArticle?.id}`
    handleShare("news", query, platform)
  }

  return (
    <div className="flex flex-col space-y-4 p-4 lg:p-6">
      <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
        <div className="w-full md:w-96 lg:w-[400px] flex flex-col gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">Market News</CardTitle>
              <div className="flex items-center space-x-2">
                {/* <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                </Button> */}
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
                    variant={selectedCategory === category.toLowerCase() ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.toLowerCase())}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              <Tabs defaultValue="latest" className="w-full ">
                {/* <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="latest">Latest</TabsTrigger>
                  <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
                </TabsList> */}

                <TabsContent value="latest" className="m-0 space-y-4 max-h-96 overflow-y-auto">
                  {filteredNews.length > 0 ? (
                    filteredNews.map((item) => (
                      <div
                        key={item.id}
                        className={`flex gap-4 p-3 rounded-md cursor-pointer hover:bg-accent ${selectedArticle?.id === item.id ? "bg-accent" : ""}`}
                        onClick={() => setSelectedArticle(item)}
                      >
                        <Avatar className="h-12 w-12 rounded-md">
                          <AvatarImage src={item.image} alt={item.source} />
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
                          <AvatarImage src={item.image} alt={item.source} />
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
                <CardTitle className="text-xl">{selectedArticle?.title}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <span>{selectedArticle?.source}</span>
                  <span className="mx-2">•</span>
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{selectedArticle?.date}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{selectedArticle?.time}</span>
                </CardDescription>
              </div>
                {/* <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleBookmark(selectedArticle?.id)}
                  className={selectedArticle?.isBookmarked ? "text-primary" : ""}
                >
                  <BookmarkIcon className="h-4 w-4" />
                </Button> */}
                <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleShareNews("clipboard")}>
                      Copy to Clipboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShareNews("twitter")}>
                      Share on Twitter
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShareNews("facebook")}>
                      Share on Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShareNews("linkedin")}>
                      Share on LinkedIn
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent>Share Chart</TooltipContent>
            </Tooltip>
          </TooltipProvider>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative w-full h-48 md:h-64 lg:h-80 rounded-md overflow-hidden">
                <img
                  src={selectedArticle?.image}
                  alt={selectedArticle?.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground font-medium">{selectedArticle?.summary}</p>
                <p>{selectedArticle?.content}</p>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Related News</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {newsItems
                    .filter((item) => item.id !== selectedArticle?.id && item.category === selectedArticle?.category)
                    .slice(0, 2)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 p-2 rounded-md cursor-pointer hover:bg-accent"
                        onClick={() => setSelectedArticle(item)}
                      >
                        <Avatar className="h-10 w-10 rounded-md">
                          <AvatarImage src={item.image} alt={item.source} />
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
