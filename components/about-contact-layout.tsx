"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, TrendingUp, Shield, Users, Target, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import logo from "@/assets/gselogo.png"
import { SearchInput } from "@/components/search-input"
import { useAuth } from "@/hooks/use-auth"
import { useQueryClient } from "@tanstack/react-query"

import { ReactNode, useState } from "react"
import OnboardingModal from "./onboarding-modal"
import LoginModal from "./login-modal"

interface AboutPageProps {
  children?: ReactNode
}

export default function AboutLayout({ children }: AboutPageProps) {
const [onboardingOpen, setOnboardingOpen] = useState(false)
const [loginOpen, setLoginOpen] = useState(false)
const {isSignedIn} = useAuth()
const queryClient = useQueryClient()

const handleLogout = () => {
    console.log("Logging out...")
    localStorage.removeItem("authToken")
    sessionStorage.clear()
    document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    queryClient.invalidateQueries({queryKey: ["authState"]})
    // Redirect to the login or landing page
    window.location.href = "/"
}
    
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold text-green-400">
              <Image src={logo} alt="gse logo" width={100} />
            </Link>
            <SearchInput/>
          </div>
          {
            !isSignedIn ? <nav className="hidden md:flex items-center gap-6">
            <span className="text-sm text-gray-300 hover:text-white"
              onClick={() => setLoginOpen(true)}>
              Log In
            </span>
            <Button className="bg-green-500 hover:bg-green-600 text-black font-medium"
            onClick={() => setOnboardingOpen(true)}>
                Get Started
            </Button>
            </nav>
            : 
            <nav className="hidden md:flex items-center gap-6">
            <Button className="bg-green-500 hover:bg-green-600 text-black font-medium"
            onClick={() => window.location.href = "/dashboard"}>
                Go to My Dashboard
            </Button>
            <Button
            variant="outline"
            className="border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
            onClick={handleLogout}>
                Logout
            </Button>
            </nav>
          }
        </div>
      </header>
      {children}
      
      <OnboardingModal isOpen={onboardingOpen} onClose={() => setOnboardingOpen(false)} />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-4">GSE Monitor</h3>
              <p className="text-gray-400 text-sm">
                Your trusted partner for Ghana Stock Exchange market data and analysis.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white"
                    onClick={() => window.location.href = "/contact"}>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} GSE Monitor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
