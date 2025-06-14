"use client"

import { useState, useEffect, SetStateAction } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import {
  ArrowRight,
  BarChart3,
  BarChart4,
  BookOpen,
  ChevronDown,
  CreditCard,
  Eye,
  Globe,
  LineChart,
  Menu,
  Moon,
  Newspaper,
  PlayCircle,
  Search,
  Shield,
  Sun,
  Wallet,
  X,
  ChevronUp,
  TrendingUp,
  Users,
  Zap,
  Lightbulb,
  UserPlus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import OnboardingModal from "@/components/onboarding-modal"
import { useAuth } from "@/hooks/use-auth"
import LoginModal from "./login-modal"
import { useQueryClient } from "@tanstack/react-query"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { SearchInput } from "./search-input"
import charts from "@/assets/chart.png"
import logo from "@/assets/gselogo.png"
import logoblack from "@/assets/gselogoblack.png"
import WatchDemoModal from "./watch-demo-modal"

export default function LandingPage() {
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showBrokers, setShowBrokers] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState("charts")
  const [email, setEmail] = useState("")
  const [onboardingOpen, setOnboardingOpen] = useState(false)
  const { data: dashboardData = [] } = useDashboardData()
  let login = false;
  if (typeof window !== "undefined") { 
    const urlParams = new URLSearchParams(window.location.search);
    login = urlParams.get("login") === "true";
  }
  const [loginOpen, setLoginOpen] = useState(login)
  const { isSignedIn } = useAuth()
  const queryClient = useQueryClient()
  const [mounted, setMounted] = useState(false);
  const [watchDemo, setWatchDemo] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTabChange = (value: SetStateAction<string>) => {
    setActiveTab(value)
  }

  const handleLogout = () => {
      console.log("Logging out...")
      localStorage.removeItem("authToken")
      sessionStorage.clear()
      document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      queryClient.invalidateQueries({queryKey: ["authState"]})
      // Redirect to the login or landing page
      window.location.href = "/"
    }

  const handleEmailSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    // In a real app, this would submit the email to a backend service
    setOnboardingOpen(true)
    setEmail("")
  }

  const handleWatchDemo = () => {
    // In a real app, this would open a video modal
    setWatchDemo(true)
  }

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  const openOnboarding = () => {
    setOnboardingOpen(true)
  }
  
  const openLogin = () => {
    setLoginOpen(true)
  }

  // Mock stock data
  const stockData = dashboardData.map(({ symbol, name, price, change, changePercent }) => ({
    symbol,
    name,
    price: price.toFixed(2), // Ensures price formatting consistency
    change: change >= 0 ? `+${change}` : `${change}`, // Formats change with a "+" if positive
    percentChange: changePercent >= 0 ? `+${changePercent}%` : `${changePercent}%` // Adds percentage sign
  }));

  const topLosers = stockData
                      .filter((stock) => stock.change.startsWith("-"))
                      .toSorted(
                        (a, b) =>
                          Number.parseFloat(b.percentChange.replace("-", "").replace("%", "")) -
                          Number.parseFloat(a.percentChange.replace("-", "").replace("%", "")),
                      )
                      .slice(0, 3)
const topGainers = stockData
                      .filter((stock) => stock.change.startsWith("+"))
                      .toSorted(
                        (a, b) =>
                          Number.parseFloat(b.percentChange.replace("+", "").replace("%", "")) -
                          Number.parseFloat(a.percentChange.replace("+", "").replace("%", "")),
                      )
                      .slice(0, 3)

const isBestPerformingGain = 
  parseFloat(topGainers[0]?.percentChange?.replace("+", "").replace("%", "") || "0") >
  parseFloat(topLosers[0]?.percentChange?.replace("-", "").replace("%", "") || "0");

  // Mock market indices
  const marketIndices = [
    { name: "GSE Composite Index", value: "2,856.12", change: "+0.75%" },
    { name: "GSE Financial Index", value: "2,105.45", change: "+0.62%" },
    { name: "GSE Manufacturing Index", value: "1,876.30", change: "-0.21%" },
  ]

  const faqData = [
  {
    question: "What is this platform, and how does it relate to the Ghana Stock Exchange?",
    answer: "We provide real-time market insights, stock analytics, and tools to help investors and traders make informed decisions. We are not affiliated with the official GSE but aggregate and visualize data from the exchange."
  },
  {
    question: "How do I create an account?",
    answer: "Simply click on the 'Get Started' button on the homepage. You’ll be guided through a quick signup process using your email or phone number."
  },
  {
    question: "Do I need a broker to trade?",
    answer: "Yes. While we provide tools for market monitoring and trade planning, you’ll still need a licensed broker to place trades on the Ghana Stock Exchange."
  },
  {
    question: "Is the market data live or delayed?",
    answer: "We strive to offer near real-time data. However, some feeds may have slight delays depending on your network connection and API access level."
  },
  {
    question: "Can I track my portfolio here?",
    answer: "Yes. You can build a custom watchlist and manually track your stock portfolio performance over time."
  }
];

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black text-gray-900 dark:text-white">
      {/* Header */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 ${
          scrolled
            ? "bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
            : "bg-transparent"
        }`}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
            {
              mounted && (
                <Image src={theme === "dark" ? logo : logoblack} alt="gse logo" width={100} />
              )
            }
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4 pl-2 pr-2">
              <SearchInput/>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("market-data")}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Market Data
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  Brokers
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 p-2">
                <div className="grid gap-2">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">Contact Brokers</div>
                  {[
                    { id: "databank", name: "Databank", logo: "https://cdn.brandfetch.io/idvnRWNCiD/w/334/h/334/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1741214899554" },
                    { id: "ic-securities", name: "IC Securities", logo: "https://cdn.brandfetch.io/idEHo1F7KY/w/200/h/200/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1740538630001" },
                    { id: "black-star", name: "Black Star Brokerage", logo: "https://gsiaonline.org/images/pagepics/gtlcmember_ff_20200203_1580732894.png" },
                    { id: "ecobank", name: "Ecobank Securities", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Ecobank_Logo.svg/750px-Ecobank_Logo.svg.png?20181117204655" },
                    { id: "sasghana", name: "Strategic African Securities", logo: "https://www.sasghana.com/assets/upload/logo.png" }
                  ].map((broker) => (
                    <DropdownMenuItem
                      key={broker.id}
                      className="flex items-center gap-3 p-2 focus:bg-gray-100 dark:focus:bg-gray-800 rounded-md cursor-pointer"
                      onClick={() => alert(`${broker.name} details coming soon!`)}
                    >
                      <div className="h-8 w-8 rounded-md overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                        <Image
                          src={broker.logo || "/placeholder.svg"}
                          alt={broker.name}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{broker.name}</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  {/* <Separator className="my-1 bg-gray-200 dark:bg-gray-800" />
                  <DropdownMenuItem
                    className="flex items-center gap-2 focus:bg-gray-100 dark:focus:bg-gray-800 rounded-md cursor-pointer"
                    onClick={() => scrollToSection("broker-comparison")}
                  >
                    <BarChart4 className="h-4 w-4 text-primary" />
                    <span>Broker Comparison</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 focus:bg-gray-100 dark:focus:bg-gray-800 rounded-md cursor-pointer"
                    onClick={() => alert("Open Account feature coming soon!")}
                  >
                    <UserPlus className="h-4 w-4 text-primary" />
                    <span>Open Account</span>
                  </DropdownMenuItem> */}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* <button
              onClick={() => scrollToSection("community")}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Community
            </button> */}
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden md:flex text-gray-600 dark:text-gray-300"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden md:flex gap-1 text-gray-600 dark:text-gray-300">
                  <Globe className="h-4 w-4" />
                  <span>EN</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              >
                <DropdownMenuItem className="focus:bg-gray-100 dark:focus:bg-gray-800">English</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden md:flex gap-2">
              {
                isSignedIn ?
                <>
                  <Button className="bg-primary hover:bg-primary/90" 
                  onClick={() => window.location.href = "/dashboard"}
                    >
                    Go to My Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
                    onClick={handleLogout} 
                  >
                    Logout
                  </Button>
                </>
              : 
              <>
                <Button
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
                    onClick={openLogin}
                  >
                  Log In
                </Button>
                <Button className="bg-primary hover:bg-primary/90" onClick={openOnboarding}>
                  Get Started
                </Button>
              </>
              }
              
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-600 dark:text-gray-300"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-black md:hidden">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
              {
                mounted && (
                  <Image src={theme === "dark" ? logo : logoblack} alt="gse logo" width={100} />
                )
              }
              </Link>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-300" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="container grid gap-6 py-6">
            <SearchInput/>
            <button
              onClick={() => scrollToSection("market-data")}
              className="text-lg font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-left"
            >
              Market Data
            </button>
            <div className="space-y-3">
              <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Brokers</p>
              <div className="pl-4 space-y-2">
                <div className="grid gap-2">
                  <div onClick={() => setShowBrokers(!showBrokers)} className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">{showBrokers ? "Hide" : "Show"} Brokers</div>
                  {showBrokers && [
                    { id: "databank", name: "Databank", logo: "https://cdn.brandfetch.io/idvnRWNCiD/w/334/h/334/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1741214899554" },
                    { id: "ic-securities", name: "IC Securities", logo: "https://cdn.brandfetch.io/idEHo1F7KY/w/200/h/200/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1740538630001" },
                    { id: "black-star", name: "Black Star Brokerage", logo: "https://gsiaonline.org/images/pagepics/gtlcmember_ff_20200203_1580732894.png" },
                    { id: "ecobank", name: "Ecobank Securities", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Ecobank_Logo.svg/750px-Ecobank_Logo.svg.png?20181117204655" },
                    { id: "sasghana", name: "Strategic African Securities", logo: "https://www.sasghana.com/assets/upload/logo.png" }
                  ].map((broker) => (
                    <div
                      key={broker.id}
                      className="flex items-center gap-3 p-2 focus:bg-gray-100 dark:focus:bg-gray-800 rounded-md cursor-pointer"
                      onClick={() => alert(`${broker.name} details coming soon!`)}
                    >
                      <div className="h-8 w-8 rounded-md overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                        <Image
                          src={broker.logo || "/placeholder.svg"}
                          alt={broker.name}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{broker.name}</p>
                      </div>
                    </div>
                  ))}
                  </div>
              </div>
            </div>
            <Separator className="bg-gray-200 dark:bg-gray-800" />
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-gray-300"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1 text-gray-300">
                    <Globe className="h-4 w-4" />
                    <span>EN</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-900 border-gray-800">
                  <DropdownMenuItem className="focus:bg-gray-800">English</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-col gap-2">
            {
              isSignedIn ?
                <Button
                    variant="outline"
                    className="w-full border-gray-700 hover:bg-gray-800 text-black dark:text-white"
                    onClick={() => window.location.href = "/dashboard"}
                  >
                  Go to My Dashboard
                </Button>
                :
              <>
                <Button
                  variant="outline"
                  className="w-full border-gray-700 hover:bg-gray-800  text-black dark:text-white"
                  onClick={openLogin}
                >
                  Log In
                </Button>
                <Button className="w-full bg-primary hover:bg-primary/90" onClick={openOnboarding}>
                  Get Started
                </Button>
              </>
              }
            </div>
          </nav>
        </div>
      )}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-28 lg:py-32">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 dark:bg-gradient-to-r from-black via-black/90 to-transparent z-10"></div>
            {/* <Image
              src={hero}
              alt="Background"
              fill
              className="object-cover opacity-40"
              priority
            /> */}
          </div>
          <div className="container relative z-10 px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl/none">
                    <span className="text-primary">Research First.</span>
                    <br />
                    Then Trade.
                  </h1>
                  <p className="max-w-[600px] text-gray-400 text-xl md:text-2xl">
                    The best trades on the Ghana Stock Exchange require research, then commitment.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[500px]:flex-row">
                 {!isSignedIn
                  ? <>
                      <Button size="lg" className="gap-1 bg-primary hover:bg-primary/90 text-lg" onClick={openOnboarding}>
                        Get started for free
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="gap-1 border-gray-700 hover:bg-gray-800 text-black dark:text-white text-lg"
                        onClick={handleWatchDemo}
                      >
                        <PlayCircle className="h-4 w-4" />
                        Watch demo
                      </Button>
                    </>
                  : <Button size="lg" className="gap-1 bg-primary hover:bg-primary/90 text-lg" onClick={() => window.location.href = "/markets"}>
                      View Market Trends
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  }

                </div>
                <p className="text-gray-400">Access live GSE market data at no charge</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Secure & Reliable</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-primary" />
                    <span>30+ Listed Companies</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center lg:justify-end">
                <div className="relative w-full max-w-[600px] overflow-hidden rounded-lg border border-gray-800 bg-gray-900 shadow-xl">
                  <Image
                    src="https://res.cloudinary.com/dgmevpvaq/image/upload/v1747388228/hero.d3ed764f_l6i90c.webp"
                    width={800}
                    height={600}
                    alt="GSE Trading Platform Dashboard"
                    className="w-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                      { 
                        isBestPerformingGain ?
                        <Badge variant="secondary" className="bg-green-900/50 text-green-400 border-green-700">
                          {topGainers[0]?.symbol}:{topGainers[0]?.percentChange}
                        </Badge> :
                        <Badge variant="secondary" className="bg-green-900/50 text-green-400 border-green-700">
                        {topLosers[0]?.symbol}:{topLosers[0]?.percentChange}
                      </Badge>
                        }
                        <Badge variant="secondary" className="bg-blue-900/50 text-blue-400 border-blue-700">
                          Live Data
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full animate-bounce text-gray-400"
              onClick={() => scrollToSection("market-data")}
            >
              <ChevronDown className="h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Market Data Section */}
        <section
          id="market-data"
          className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 py-12"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
              <div className="space-y-2">
                <Badge variant="outline" className="border-primary text-primary">
                  Market Data
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter">Ghana Stock Exchange</h2>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Market Indices */}
              {/* <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart4 className="h-5 w-5 text-primary" />
                    Market Indices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketIndices.map((index) => (
                      <div key={index.name} className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">{index.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{index.value}</span>
                          <span className={index.change.startsWith("+") ? "text-green-400" : "text-red-400"}>
                            {index.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card> */}

              {/* Top Gainers */}
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    Top Gainers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topGainers.map((stock) => (
                        <div key={stock.symbol} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{stock.symbol}</div>
                            <div className="text-xs text-gray-400">{stock.name}</div>
                          </div>
                          <div className="text-right">
                            <div>{stock.price}</div>
                            <div className="text-sm text-green-400">{stock.percentChange}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Losers */}
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-red-400 transform rotate-180" />
                    Top Losers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topLosers
                      .map((stock) => (
                        <div key={stock.symbol} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{stock.symbol}</div>
                            <div className="text-xs text-gray-400">{stock.name}</div>
                          </div>
                          <div className="text-right">
                            <div>{stock.price}</div>
                            <div className="text-sm text-red-400">{stock.percentChange}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stock Table */}
            <Card className="mt-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Most Active Stocks</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 hover:bg-gray-800 text-black dark:text-white"
                    onClick={() => isSignedIn ? window.location.href = "/markets": setLoginOpen(true)}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                          Symbol
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                          Name
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                          Price
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                          Change
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                          % Change
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                      stockData
                      .sort((a, b) =>
                          Number.parseFloat(b.percentChange.replace("-", "").replace("%", "").replace("+", "")) -
                          Number.parseFloat(a.percentChange.replace("-", "").replace("%", "").replace("+", "")),
                      )
                      .splice(0, 10).map((stock) => (
                        <tr
                          key={stock.symbol}
                          className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 cursor-pointer"
                          // onClick={() => alert(`Details for ${stock.name} coming soon!`)}
                        >
                          <td className="py-3 px-4 font-medium">{stock.symbol}</td>
                          <td className="py-3 px-4 text-gray-400">{stock.name}</td>
                          <td className="py-3 px-4 text-right">{stock.price}</td>
                          <td className="py-3 px-4 text-right">
                            <span className={stock.change.startsWith("+") ? "text-green-400" : "text-red-400"}>
                              {stock.change}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={stock.percentChange.startsWith("+") ? "text-green-400" : "text-red-400"}>
                              {stock.percentChange}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Platform Preview Section */}
        <section id="platform" className="border-t border-gray-200 dark:border-gray-800 py-20 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="outline" className="border-primary text-primary">
                  Platform Preview
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Advanced Trading Tools</h2>
                <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Experience our powerful trading platform designed specifically for the Ghana Stock Exchange.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-12 max-w-6xl">
              <Tabs defaultValue="charts" className="w-full" onValueChange={handleTabChange}>
                {/* <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-gray-100 dark:bg-gray-900 p-1">
                  <TabsTrigger
                    value="charts"
                    // className="data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-800"
                  >
                    Charts
                  </TabsTrigger>
                  <TabsTrigger value="screener" className="data-[state=active]:bg-gray-800">
                    Screener
                  </TabsTrigger>
                  <TabsTrigger value="trading" className="data-[state=active]:bg-gray-800">
                    Trading
                  </TabsTrigger>
                </TabsList> */}
                <TabsContent value="charts" className="mt-6">
                  <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg">
                    <div className="relative">
                      <Image
                        src={charts}
                        width={1200}
                        height={600}
                        alt="Advanced Chart"
                        className="w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold">Advanced Charting</h3>
                      <p className="mt-2 text-gray-400">
                        Analyze market trends with our powerful charting tools. Choose from multiple chart types and add
                        technical indicators to inform your trading decisions.
                      </p>
                      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-3 text-center">
                          <span className="text-sm font-medium">50+ Indicators</span>
                        </div>
                        <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-3 text-center">
                          <span className="text-sm font-medium">Drawing Tools</span>
                        </div>
                        <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-3 text-center">
                          <span className="text-sm font-medium">Multiple Timeframes</span>
                        </div>
                        <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-3 text-center">
                          <span className="text-sm font-medium">Pattern Recognition</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                {/* <TabsContent value="screener" className="mt-6">
                  <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg">
                    <div className="relative">
                      <Image
                        src="/placeholder.svg?key=4ld6i"
                        width={1200}
                        height={600}
                        alt="Stock Screener"
                        className="w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold">Powerful Stock Screener</h3>
                      <p className="mt-2 text-gray-400">
                        Find the best trading opportunities with our customizable stock screener. Filter stocks by
                        performance, fundamentals, technicals, and more to discover your next investment.
                      </p>
                      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-3 text-center">
                          <span className="text-sm font-medium">Custom Filters</span>
                        </div>
                        <div className="rounded-lg bg-gray-800 p-3 text-center">
                          <span className="text-sm font-medium">Technical Scans</span>
                        </div>
                        <div className="rounded-lg bg-gray-800 p-3 text-center">
                          <span className="text-sm font-medium">Fundamental Data</span>
                        </div>
                        <div className="rounded-lg bg-gray-800 p-3 text-center">
                          <span className="text-sm font-medium">Saved Screens</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="trading" className="mt-6">
                  <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg">
                    <div className="relative">
                      <Image
                        src="/placeholder.svg?key=0arjg"
                        width={1200}
                        height={600}
                        alt="Trading Terminal"
                        className="w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold">Seamless Trading Experience</h3>
                      <p className="mt-2 text-gray-400">
                        Execute trades quickly and efficiently with our intuitive trading interface. Place market
                        orders, limit orders, and stop orders with just a few clicks.
                      </p>
                      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <div className="rounded-lg bg-gray-800 p-3 text-center">
                          <span className="text-sm font-medium">One-Click Trading</span>
                        </div>
                        <div className="rounded-lg bg-gray-800 p-3 text-center">
                          <span className="text-sm font-medium">Multiple Order Types</span>
                        </div>
                        <div className="rounded-lg bg-gray-800 p-3 text-center">
                          <span className="text-sm font-medium">Real-time Execution</span>
                        </div>
                        <div className="rounded-lg bg-gray-800 p-3 text-center">
                          <span className="text-sm font-medium">Trade History</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent> */}
              </Tabs>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section
          id="features"
          className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 py-20 md:py-24 lg:py-32"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="outline" className="border-primary text-primary">
                  Key Features
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Tools for Every Trader</h2>
                <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides all the tools and resources you need to make informed investment decisions on
                  the Ghana Stock Exchange.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 md:gap-10 lg:grid-cols-2">
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
                <CardHeader className="pb-2">
                  <LineChart className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Real-time Market Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Access live price updates, market depth, and historical data for all GSE-listed securities.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
                <CardHeader className="pb-2">
                  <Eye className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Watchlists & Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Create custom watchlists and set price alerts to monitor your favorite stocks.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
                <CardHeader className="pb-2">
                  <BarChart3 className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Advanced Charts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Analyze market trends with interactive charts and over 50 technical indicators.
                  </p>
                </CardContent>
              </Card>
              {/* <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
                <CardHeader className="pb-2">
                  <Wallet className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Portfolio Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Monitor your investments with real-time portfolio valuation and performance analytics.
                  </p>
                </CardContent>
              </Card> */}
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
                <CardHeader className="pb-2">
                  <Newspaper className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Market News</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Stay informed with the latest market news, analysis, and corporate announcements.
                  </p>
                </CardContent>
              </Card>
              {/* <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
                <CardHeader className="pb-2">
                  <BookOpen className="h-10 w-10 text-primary" />
                  <CardTitle className="mt-4">Educational Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">
                    Learn to trade with our comprehensive library of tutorials, guides, and webinars.
                  </p>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </section>

        {/* Community Section */}
        {/* <section id="community" className="border-t border-gray-200 dark:border-gray-800 py-20 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="outline" className="border-primary text-primary">
                  Community
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Join Ghana's Trading Community</h2>
                <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Connect with other traders, share ideas, and learn from the best in the business.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Trading Ideas
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Share and discover trading ideas from other traders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-full overflow-hidden">
                          <Image
                            src="/placeholder.svg?key=9kbsz"
                            width={32}
                            height={32}
                            alt="User avatar"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Kwame A.</p>
                          <p className="text-xs text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                      <p className="text-sm">
                        MTN Ghana (MTNGH) looking bullish after breaking above key resistance at 1.15. Target: 1.25
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                        <button className="flex items-center gap-1 hover:text-green-400">
                          <ChevronUp className="h-3 w-3 text-green-400" />
                          24
                        </button>
                        <button className="hover:text-white">12 comments</button>
                      </div>
                    </div>
                    <div className="rounded-lg bg-gray-100 dark:bg-gray-800 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-full overflow-hidden">
                          <Image
                            src="/placeholder.svg?key=rn9w5"
                            width={32}
                            height={32}
                            alt="User avatar"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Abena M.</p>
                          <p className="text-xs text-gray-400">5 hours ago</p>
                        </div>
                      </div>
                      <p className="text-sm">
                        GCB Bank showing strong support at 5.00 level. Good entry point for long-term investors.
                      </p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                        <button className="flex items-center gap-1 hover:text-green-400">
                          <ChevronUp className="h-3 w-3 text-green-400" />
                          18
                        </button>
                        <button className="hover:text-white">8 comments</button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 hover:bg-gray-800 text-white"
                    onClick={() => alert("Trading ideas page coming soon!")}
                  >
                    View All Ideas
                  </Button>
                </CardFooter>
              </Card>
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Market Analysis
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Expert analysis and market insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div
                      className="rounded-lg bg-gray-800 p-4 cursor-pointer"
                      onClick={() => alert("Premium content coming soon!")}
                    >
                      <h4 className="font-medium mb-1">Weekly Market Outlook</h4>
                      <p className="text-sm text-gray-400 mb-2">
                        Analysis of key market trends and potential opportunities for the coming week.
                      </p>
                      <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">
                        Premium
                      </Badge>
                    </div>
                    <div
                      className="rounded-lg bg-gray-800 p-4 cursor-pointer"
                      onClick={() => alert("Premium content coming soon!")}
                    >
                      <h4 className="font-medium mb-1">Sector Rotation Analysis</h4>
                      <p className="text-sm text-gray-400 mb-2">
                        Which sectors are showing strength and which are lagging behind.
                      </p>
                      <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">
                        Premium
                      </Badge>
                    </div>
                    <div
                      className="rounded-lg bg-gray-800 p-4 cursor-pointer"
                      onClick={() => alert("Free content coming soon!")}
                    >
                      <h4 className="font-medium mb-1">GSE Composite Index Forecast</h4>
                      <p className="text-sm text-gray-400 mb-2">
                        Technical and fundamental analysis of the GSE Composite Index.
                      </p>
                      <Badge className="text-xs bg-primary text-white">Free</Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 hover:bg-gray-800 text-white"
                    onClick={() => alert("Market analysis page coming soon!")}
                  >
                    View All Analysis
                  </Button>
                </CardFooter>
              </Card>
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Upcoming Events
                  </CardTitle>
                  <CardDescription className="text-gray-500 dark:text-gray-400">
                    Webinars, workshops, and market events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div
                      className="rounded-lg bg-gray-800 p-4 cursor-pointer"
                      onClick={() => alert("Event registration coming soon!")}
                    >
                      <h4 className="font-medium mb-1">Technical Analysis Masterclass</h4>
                      <p className="text-xs text-gray-400 mb-2">May 15, 2023 • 7:00 PM</p>
                      <p className="text-sm text-gray-400">
                        Learn how to use technical analysis to identify trading opportunities.
                      </p>
                    </div>
                    <div
                      className="rounded-lg bg-gray-800 p-4 cursor-pointer"
                      onClick={() => alert("Event registration coming soon!")}
                    >
                      <h4 className="font-medium mb-1">Q1 Earnings Season Review</h4>
                      <p className="text-xs text-gray-400 mb-2">May 20, 2023 • 6:30 PM</p>
                      <p className="text-sm text-gray-400">
                        Analysis of Q1 earnings reports and their impact on stock prices.
                      </p>
                    </div>
                    <div
                      className="rounded-lg bg-gray-800 p-4 cursor-pointer"
                      onClick={() => alert("Event registration coming soon!")}
                    >
                      <h4 className="font-medium mb-1">Beginner's Guide to GSE</h4>
                      <p className="text-xs text-gray-400 mb-2">May 25, 2023 • 5:00 PM</p>
                      <p className="text-sm text-gray-400">
                        Introduction to trading on the Ghana Stock Exchange for beginners.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full border-gray-700 hover:bg-gray-800 text-white"
                    onClick={() => alert("Events calendar coming soon!")}
                  >
                    View All Events
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section> */}

        {/* FAQ Section */}
        <section id="faq" className="border-t border-gray-200 dark:border-gray-800 py-20 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="outline" className="border-primary text-primary">
                  FAQ
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Frequently Asked Questions</h2>
                <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Find answers to common questions about our platform and trading on the Ghana Stock Exchange.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-12 max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {
                faqData.map((faq) => (
                  <AccordionItem
                    key={faq.question}
                    value={`item-${faq.question.replace(/\s+/g, '-').toLowerCase()}`}
                    className="border-gray-200 dark:border-gray-800"
                  >
                    <AccordionTrigger className="text-gray-900 dark:text-white hover:text-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))
                }
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {/* <section className="border-t border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-100 to-white dark:from-gray-900 dark:to-black py-20 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Start Trading?</h2>
                <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of investors trading on the Ghana Stock Exchange with our powerful platform.
                </p>
              </div>
              <div className="mx-auto w-full max-w-sm space-y-2">
                {
                isSignedIn
                ?
                  <Button type="submit" className="bg-primary hover:bg-primary/90" onClick={() => window.location.href = "/trade"}>
                    Start Trading
                  </Button>
                :
                <>
                <form className="flex flex-col gap-2 sm:flex-row" onSubmit={handleEmailSubmit}>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="max-w-lg flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Get Started
                  </Button>
                </form>
                <p className="text-xs text-gray-400">
                  By signing up, you agree to our{" "}
                  <button
                    onClick={() => alert("Terms & Conditions coming soon!")}
                    className="text-gray-300 underline underline-offset-2"
                  >
                    Terms & Conditions
                  </button>{" "}
                  and{" "}
                  <button
                    onClick={() => alert("Privacy Policy coming soon!")}
                    className="text-gray-300 underline underline-offset-2"
                  >
                    Privacy Policy
                  </button>
                </p>
                </>
                }
              </div>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm text-gray-400">Secure & Encrypted</span>
                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span className="text-sm text-gray-400">No Credit Card Required</span>
                </div>
              </div>
            </div>
          </div>
        </section> */}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
              {
                mounted && (
                  <Image src={theme === "dark" ? logo : logoblack} alt="gse logo" width={100} />
                )
              }
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                The go-to platform for Ghana Stock Exchange traders and investors — delivering real-time market data, 
                smart analytics, interactive charts, and tools for efficient, informed trading.
              </p>
              <div className="flex gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    Features
                  </button>
                </li>
                {/* <li>
                  <button
                    onClick={() => scrollToSection("platform")}
                    className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    Platform Preview
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("community")}
                    className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    Community
                  </button>
                </li> */}
                <li>
                  <button onClick={() => scrollToSection("faq")} className="text-sm text-gray-400 hover:text-white">
                    FAQ
                  </button>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href={"/about"}>
                    <button
                      className="text-sm text-gray-400 hover:text-white"
                    >
                      About Us
                    </button>
                  </Link>
                </li>
                {/* <li>
                  <button
                    onClick={() => alert("Careers page coming soon!")}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Careers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => alert("Blog page coming soon!")}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => alert("Press page coming soon!")}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Press
                  </button>
                </li> */}
                <li>
                  <Link href={"/contact"}>
                    <button
                      className="text-sm text-gray-400 hover:text-white"
                    >
                      Contact
                    </button>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href={"/term-of-use"}>
                    <button
                      className="text-sm text-gray-400 hover:text-white"
                    >
                      Terms of Service
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href={"/privacy-policy"}>
                  <button
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Privacy Policy
                  </button>
                  </Link>
                </li>
                {/* <li>
                  <button
                    onClick={() => alert("Cookie Policy page coming soon!")}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Cookie Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => alert("Security page coming soon!")}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Security
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => alert("Compliance page coming soon!")}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Compliance
                  </button>
                </li> */}
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} GSE Monitor. All rights reserved.
              </p>
              {/* <p className="text-sm text-gray-500 dark:text-gray-400">
                GSE Trader is regulated by the Securities and Exchange Commission of Ghana.
              </p> */}
            </div>
          </div>
        </div>
      </footer>

      {/* Onboarding Modal */}
      <WatchDemoModal isOpen={watchDemo} onClose={() => setWatchDemo(false)} />
      <OnboardingModal isOpen={onboardingOpen} onClose={() => setOnboardingOpen(false)} />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  )
}
