import React from "react"
import Link from "next/link"
import Footer from "@/components/landing-footer"

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <Link
              href="/"
              className="inline-block px-4 py-2 text-sm font-medium bg-primary text-white rounded hover:bg-primary/90 transition"
            >
              Back to Home
            </Link>
          </div>
          <p className="mb-4">
            At <span className="font-semibold">GSE Monitor</span>, we are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, share, and safeguard your personal information.
          </p>

          <h2 className="text-2xl font-semibold mt-6">Collection of Personal Information:</h2>
          <p className="mb-4">We collect the information you provide when creating an account, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your name</li>
            <li>Email address</li>
            <li>Phone number</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6">Use of Personal Information:</h2>
          <p className="mb-4">We use your data to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Communicate with you about your account or transactions</li>
            <li>Send you promotional content and service updates</li>
            <li>Conduct research and data analysis to improve our offerings</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6">Disclosure of Personal Information:</h2>
          <p className="mb-4">We do not sell your personal information. We may share it with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Trusted third-party service providers (e.g., payment processors)</li>
            <li>Affiliates and business partners, strictly for service delivery</li>
            <li>Government or regulatory authorities if legally required</li>
          </ul>
          <p className="mt-4">All third parties are required to maintain confidentiality and data protection standards.</p>

          <h2 className="text-2xl font-semibold mt-6">Security of Personal Information:</h2>
          <p className="mb-4">We take appropriate technical and organizational measures to protect your information from:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Unauthorized access or disclosure</li>
            <li>Loss, theft, or alteration</li>
          </ul>
          <p className="mt-4">
            While we strive to safeguard your data, no digital system can be 100% secure, and we cannot guarantee absolute protection.
          </p>
          <p className="text-gray-500 text-xs mt-8 text-right">Last updated: May 2025</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default PrivacyPolicy