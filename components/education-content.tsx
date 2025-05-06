"use client"

import { useState } from "react"
import { BookOpen, Clock, FileText, Filter, Play, Search, Star } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample education data
const courses = [
  {
    id: 1,
    title: "Introduction to Stock Market Investing",
    description: "Learn the basics of stock market investing and how to build a portfolio.",
    author: "Dr. Kwame Asante",
    authorRole: "Investment Analyst",
    duration: "2 hours 15 minutes",
    level: "Beginner",
    rating: 4.8,
    reviews: 124,
    progress: 75,
    image: "/placeholder.svg?key=course1",
    category: "Investing Basics",
  },
  {
    id: 2,
    title: "Technical Analysis Fundamentals",
    description: "Master the art of reading charts and identifying trading opportunities.",
    author: "Abena Mensah",
    authorRole: "Trading Specialist",
    duration: "3 hours 45 minutes",
    level: "Intermediate",
    rating: 4.6,
    reviews: 98,
    progress: 30,
    image: "/placeholder.svg?key=course2",
    category: "Technical Analysis",
  },
  {
    id: 3,
    title: "Fundamental Analysis for Value Investors",
    description: "Learn how to analyze company financials and find undervalued stocks.",
    author: "Joseph Owusu",
    authorRole: "Financial Analyst",
    duration: "4 hours 20 minutes",
    level: "Intermediate",
    rating: 4.9,
    reviews: 156,
    progress: 0,
    image: "/placeholder.svg?key=course3",
    category: "Fundamental Analysis",
  },
  {
    id: 4,
    title: "Risk Management Strategies",
    description: "Protect your portfolio with effective risk management techniques.",
    author: "Grace Adu",
    authorRole: "Risk Management Specialist",
    duration: "2 hours 30 minutes",
    level: "Advanced",
    rating: 4.7,
    reviews: 87,
    progress: 0,
    image: "/placeholder.svg?key=course4",
    category: "Risk Management",
  },
  {
    id: 5,
    title: "Ghana Stock Exchange: Market Structure",
    description: "Understand the structure and operations of the Ghana Stock Exchange.",
    author: "Dr. Kwame Asante",
    authorRole: "Investment Analyst",
    duration: "1 hour 45 minutes",
    level: "Beginner",
    rating: 4.5,
    reviews: 112,
    progress: 100,
    image: "/placeholder.svg?key=course5",
    category: "Market Structure",
  },
  {
    id: 6,
    title: "Dividend Investing Strategies",
    description: "Build a passive income stream through dividend investing.",
    author: "Abena Mensah",
    authorRole: "Trading Specialist",
    duration: "2 hours 50 minutes",
    level: "Intermediate",
    rating: 4.8,
    reviews: 92,
    progress: 0,
    image: "/placeholder.svg?key=course6",
    category: "Dividend Investing",
  },
]

const articles = [
  {
    id: 1,
    title: "Understanding Market Capitalization",
    description: "Learn what market capitalization means and why it matters for your investment decisions.",
    author: "Dr. Kwame Asante",
    date: "April 28, 2023",
    readTime: "8 min read",
    image: "/placeholder.svg?key=article1",
    category: "Investing Basics",
  },
  {
    id: 2,
    title: "How to Read Annual Reports",
    description: "A step-by-step guide to extracting valuable information from company annual reports.",
    author: "Joseph Owusu",
    date: "April 25, 2023",
    readTime: "12 min read",
    image: "/placeholder.svg?key=article2",
    category: "Fundamental Analysis",
  },
  {
    id: 3,
    title: "Support and Resistance Levels Explained",
    description: "Master the concept of support and resistance to improve your trading decisions.",
    author: "Abena Mensah",
    date: "April 20, 2023",
    readTime: "10 min read",
    image: "/placeholder.svg?key=article3",
    category: "Technical Analysis",
  },
  {
    id: 4,
    title: "Diversification: The Only Free Lunch in Investing",
    description: "Learn why diversification is crucial for managing risk in your investment portfolio.",
    author: "Grace Adu",
    date: "April 15, 2023",
    readTime: "7 min read",
    image: "/placeholder.svg?key=article4",
    category: "Risk Management",
  },
  {
    id: 5,
    title: "Understanding P/E Ratios",
    description: "A comprehensive guide to price-to-earnings ratios and how to use them in stock valuation.",
    author: "Joseph Owusu",
    date: "April 10, 2023",
    readTime: "9 min read",
    image: "/placeholder.svg?key=article5",
    category: "Fundamental Analysis",
  },
  {
    id: 6,
    title: "The History of the Ghana Stock Exchange",
    description: "Explore the origins and development of the Ghana Stock Exchange since its inception.",
    author: "Dr. Kwame Asante",
    date: "April 5, 2023",
    readTime: "15 min read",
    image: "/placeholder.svg?key=article6",
    category: "Market Structure",
  },
]

export function EducationContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedCourse, setSelectedCourse] = useState(courses[0])

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    "All",
    "Investing Basics",
    "Technical Analysis",
    "Fundamental Analysis",
    "Risk Management",
    "Market Structure",
    "Dividend Investing",
  ]

  const inProgressCourses = courses.filter((course) => course.progress > 0 && course.progress < 100)
  const completedCourses = courses.filter((course) => course.progress === 100)

  return (
    <div className="flex flex-col space-y-4 p-4 lg:p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl">Learning Center</CardTitle>
            <CardDescription>Enhance your knowledge of the stock market and investing</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses and articles..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9 gap-1">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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

          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="my-learning">My Learning</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <div className="relative h-40 w-full">
                        <img
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Button variant="secondary" size="sm" className="gap-1">
                            <Play className="h-4 w-4" />
                            Start Learning
                          </Button>
                        </div>
                        <div className="absolute top-2 right-2 bg-card px-2 py-1 rounded-md text-xs font-medium">
                          {course.level}
                        </div>
                      </div>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{course.duration}</span>
                          <span className="mx-2">•</span>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 mr-1 text-yellow-500" />
                            <span>
                              {course.rating} ({course.reviews})
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback>
                            {course.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-xs">
                          <div className="font-medium">{course.author}</div>
                          <div className="text-muted-foreground">{course.authorRole}</div>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8 text-muted-foreground">
                    No courses found matching your search.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="articles" className="m-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => (
                    <Card key={article.id}>
                      <div className="relative h-40 w-full">
                        <img
                          src={article.image || "/placeholder.svg"}
                          alt={article.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-card px-2 py-1 rounded-md text-xs font-medium">
                          {article.category}
                        </div>
                      </div>
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{article.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <FileText className="h-3 w-3 mr-1" />
                          <span>{article.readTime}</span>
                          <span className="mx-2">•</span>
                          <span>{article.date}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        <div className="flex items-center">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback>
                              {article.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-xs font-medium">{article.author}</div>
                        </div>
                        <Button variant="outline" size="sm">
                          Read
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8 text-muted-foreground">
                    No articles found matching your search.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="my-learning" className="m-0">
              <div className="space-y-6">
                {inProgressCourses.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">In Progress</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {inProgressCourses.map((course) => (
                        <Card key={course.id} className="flex overflow-hidden">
                          <div className="relative h-auto w-24 md:w-32">
                            <img
                              src={course.image || "/placeholder.svg"}
                              alt={course.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-4">
                            <h4 className="font-medium">{course.title}</h4>
                            <div className="flex items-center text-xs text-muted-foreground mt-1 mb-2">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Progress</span>
                                <span>{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-2" />
                            </div>
                            <Button variant="outline" size="sm" className="mt-3 gap-1">
                              <Play className="h-3 w-3" />
                              Continue
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {completedCourses.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Completed</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {completedCourses.map((course) => (
                        <Card key={course.id} className="flex overflow-hidden">
                          <div className="relative h-auto w-24 md:w-32">
                            <img
                              src={course.image || "/placeholder.svg"}
                              alt={course.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-4">
                            <h4 className="font-medium">{course.title}</h4>
                            <div className="flex items-center text-xs text-muted-foreground mt-1 mb-2">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{course.duration}</span>
                            </div>
                            <div className="flex items-center text-xs text-green-500">
                              <BookOpen className="h-3 w-3 mr-1" />
                              <span>Completed</span>
                            </div>
                            <Button variant="outline" size="sm" className="mt-3 gap-1">
                              <Play className="h-3 w-3" />
                              Review
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {inProgressCourses.length === 0 && completedCourses.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    You haven't started any courses yet. Browse our courses to begin learning.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
