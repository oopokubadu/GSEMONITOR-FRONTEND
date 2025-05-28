"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Search, TrendingUp, Shield, Users, Target, Award } from "lucide-react"

export default function AboutContent() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-green-400">About</span> <span className="text-white">GSE Monitor.</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Empowering investors with comprehensive Ghana Stock Exchange data, research tools, and market insights for
            informed trading decisions.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-gray-800/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-green-400">Our Mission</h2>
              <p className="text-gray-300 text-lg mb-6">
                To democratize access to Ghana Stock Exchange information and provide retail investors with the same
                quality of market data and analysis tools traditionally available only to institutional investors.
              </p>
              <p className="text-gray-300 text-lg">
                We believe that informed investors make better decisions, and better decisions lead to a stronger, more
                vibrant Ghanaian capital market.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-white mb-2">30+</h3>
                  <p className="text-gray-400 text-sm">Listed Companies</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-green-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-white mb-2">10K+</h3>
                  <p className="text-gray-400 text-sm">Active Users</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Shield className="h-8 w-8 text-green-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-white mb-2">99.9%</h3>
                  <p className="text-gray-400 text-sm">Uptime</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 text-green-400 mx-auto mb-3" />
                  <h3 className="font-semibold text-white mb-2">Real-time</h3>
                  <p className="text-gray-400 text-sm">Market Data</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-400">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8">
                <Target className="h-12 w-12 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">Accuracy</h3>
                <p className="text-gray-300">
                  We provide precise, real-time market data sourced directly from the Ghana Stock Exchange to ensure you
                  make decisions based on accurate information.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8">
                <Shield className="h-12 w-12 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">Security</h3>
                <p className="text-gray-300">
                  Your data and privacy are our top priorities. We employ industry-leading security measures to protect
                  your information and trading activities.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8">
                <Users className="h-12 w-12 text-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">Accessibility</h3>
                <p className="text-gray-300">
                  We believe everyone should have access to professional-grade market tools, regardless of their
                  investment size or experience level.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-gray-800/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6 text-green-400">Our Story</h2>
          <p className="text-gray-300 text-lg mb-8">
            Founded in 2023, GSE Monitor was born from the recognition that Ghana's capital market needed a modern,
            accessible platform for retail investors. Our team of financial technology experts and market analysts came
            together with a shared vision: to level the playing field for all investors.
          </p>
          <p className="text-gray-300 text-lg">
            Today, we serve thousands of investors across Ghana and beyond, providing them with the tools and insights
            they need to navigate the Ghana Stock Exchange with confidence.
          </p>
        </div>
      </section>
      
      </div>
  )
}
