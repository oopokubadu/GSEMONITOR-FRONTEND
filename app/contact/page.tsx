"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, Mail, Phone, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import logo from "@/assets/gselogo.png"
import { SearchInput } from "@/components/search-input"

export default function ContactPage() {
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
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/login" className="text-sm text-gray-300 hover:text-white"
              onClick={() => window.location.href = "/?login=true"}>
              Log In
            </Link>
            <Button className="bg-green-500 hover:bg-green-600 text-black font-medium">Get Started</Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-green-400">Get in</span> <span className="text-white">Touch.</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Have questions about GSE Monitor? Need support with your account? Our team is here to help you succeed in
            your trading journey.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8 text-center">
                <Mail className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Email Us</h3>
                <p className="text-gray-300 mb-4">Get in touch via email</p>
                <a href="mailto:support@gsemonitor.chopmoney.co" className="text-green-400 hover:text-green-300">
                  support@gsemonitor.chopmoney.co
                </a>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8 text-center">
                <Phone className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Call Us</h3>
                <p className="text-gray-300 mb-4">Speak with our support team</p>
                <a href="tel:+233123456789" className="text-green-400 hover:text-green-300">
                  +233 (0) 123 456 789
                </a>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8 text-center">
                <MapPin className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Visit Us</h3>
                <p className="text-gray-300 mb-4">Our office location</p>
                <p className="text-green-400">
                  Accra Digital Centre
                  <br />
                  Ring Road East, Accra
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form and Info */}
          <div className="grid lg:grid-cols-1 gap-12">
            {/* Contact Form */}
            <Card className="bg-gray-800 border-gray-700 w-full">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-green-400 mb-6">Send us a Message</h2>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-white">
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        className="bg-gray-700 border-gray-600 text-white mt-2"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-white">
                        Last Name
                      </Label>
                      <Input id="lastName" className="bg-gray-700 border-gray-600 text-white mt-2" placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      className="bg-gray-700 border-gray-600 text-white mt-2"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-white">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      className="bg-gray-700 border-gray-600 text-white mt-2"
                      placeholder="How can we help you?"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-white">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      className="bg-gray-700 border-gray-600 text-white mt-2 min-h-[120px]"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-medium">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
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
                  <Link href="/about" className="hover:text-white"
                    onClick={() => window.location.href = "/contact"}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
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
