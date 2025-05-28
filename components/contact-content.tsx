"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactContent() {
  return (
    <div>
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
                  admin@chopmoney.co
                </a>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8 text-center">
                <Phone className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Call Us</h3>
                <p className="text-gray-300 mb-4">Speak with our support team</p>
                <a href="tel:+233123456789" className="text-green-400 hover:text-green-300">
                  +233 (0) 20 043 8498
                </a>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-8 text-center">
                <MapPin className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Visit Us</h3>
                <p className="text-gray-300 mb-4">Our office location</p>
                <p className="text-green-400">
                  House No 3 Lanquel St.
                  <br />
                  Anyaa, Accra
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form and Info */}
          
        </div>
      </section>
    </div>
  )
}