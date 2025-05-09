"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { useSignIn } from "@/hooks/use-sign-in"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { mutate: signIn } = useSignIn()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async () => {
    setIsSubmitting(true)
    setErrorMessage(null)
    signIn(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-10 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>

        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-gray-600 dark:text-gray-400">Log in to your account</p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-2 text-sm text-red-600 bg-red-100 rounded-lg">
              {errorMessage}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
              />
            </div>

            <div className="text-right">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => alert("Redirect to Forgot Password page")}
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <div className="mt-6">
            <Button
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleLogin}
              disabled={isSubmitting || !formData.email || !formData.password}
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}