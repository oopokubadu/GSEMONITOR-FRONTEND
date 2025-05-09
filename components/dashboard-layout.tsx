"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Globe,
  LayoutDashboard,
  LogOut,
  PieChart,
  Search,
  Settings,
  TrendingUp,
  User,
} from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { MarketSummary } from "@/components/market-summary"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserNav } from "@/components/user-nav"
import { DialogTitle } from "@radix-ui/react-dialog"
import { SearchInput } from "./search-input"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const pathname = usePathname()

  const { isSignedIn, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isSignedIn && !isLoading) {
      router.push("/"); // Redirect unauthenticated users
    }
  }, [isSignedIn, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-solid"></div>
          <span className="text-primary font-medium">Getting things ready...</span>
        </div>
      </div>
    )
  }

  // Navigation items
  const mainNavItems: NavItem[] = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/markets",
      label: "Markets",
      icon: TrendingUp,
    },
    {
      href: "/watchlist",
      label: "Watchlist",
      icon: BarChart3,
    },
    {
      href: "/portfolio",
      label: "Portfolio",
      icon: PieChart,
    },
    {
      href: "/trade",
      label: "Trade",
      icon: CreditCard,
    },
    {
      href: "/news",
      label: "News",
      icon: Globe,
    },
    {
      href: "/education",
      label: "Education",
      icon: BookOpen,
    },
  ]

  const accountNavItems: NavItem[] = [
    {
      href: "/profile",
      label: "Profile",
      icon: User,
    },
    {
      href: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ]

  const handleLogout = () => {
    console.log("Logging out...")
    // Clear authentication token or user data
    localStorage.removeItem("authToken") // Remove token from localStorage
    sessionStorage.clear() // Optional: Clear session storage
    // document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;" // Clear cookies if used
  
    // Redirect to the login or landing page
    router.push("/");
  }

  const Sidebar = () => (
    <div className={cn("flex flex-col h-full bg-card border-r overflow-hidden", collapsed ? "items-center" : "w-64")}>
      <div className={cn("flex h-14 items-center border-b px-4", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && <span className="font-bold text-lg">GSE Trader</span>}
        {isDesktop && (
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-auto py-2 h-full">
        <nav className="grid gap-1 px-2">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-9 items-center rounded-md px-2 gap-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  collapsed ? "justify-center w-10 px-0" : "justify-start",
                )}
              >
                <item.icon className="h-4 w-4" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>
        <div className="mt-4">
          <div className="px-3 py-2">
            <h3 className={cn("text-xs font-medium text-muted-foreground", collapsed ? "sr-only" : "")}>Account</h3>
          </div>
          <nav className="grid gap-1 px-2">
            {accountNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex h-9 items-center rounded-md px-2 gap-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    collapsed ? "justify-center w-10 px-0" : "justify-start",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
            <Button
              variant="ghost"
              className={cn(
                "flex h-9 items-center rounded-md px-2 gap-2 text-sm font-medium transition-colors justify-start text-red-500 hover:bg-accent hover:text-red-500",
                collapsed ? "justify-center w-10 px-0" : "",
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Log out</span>}
            </Button>
          </nav>
        </div>
      </div>
    </div>
  )

  return (
    isSignedIn &&
    <div className="flex min-h-screen bg-background">
      {isDesktop ? (
        <Sidebar />
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="absolute left-4 top-16 lg:hidden">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <div className="sr-only">
              <DialogTitle>Sidebar Navigation</DialogTitle>
            </div>
            <Sidebar />
          </SheetContent>
        </Sheet>
      )}
      <div className="flex-1">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:px-6">
          <div className="w-full flex-1">
            <form>
              <SearchInput/>
              {/* <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search GSE Trader"
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div> */}
            </form>
          </div>
          <ThemeToggle />
          <UserNav />
        </header>
        <main className="flex-1">
          {/* {pathname === "/" && <MarketSummary />} */}
          {children}
        </main>
      </div>
    </div>
  )
}
