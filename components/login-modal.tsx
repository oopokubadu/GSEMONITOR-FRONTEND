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
    otp: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [currentStep, setCurrentStep] = useState(1) // Step 1: Email, Step 2: OTP, Step 3: New Password
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { mutate: signIn } = useSignIn()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isForgotPassword, setIsForgotPassword] = useState(false) // State to toggle modal content

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  
  const handleSendOTP = async () => {
    setIsSubmitting(true)
    setErrorMessage(null)

    // Simulate API call to send OTP
    setTimeout(() => {
      if (formData.email === "test@example.com") {
        setCurrentStep(2) // Move to Step 2: OTP Verification
      } else {
        setErrorMessage("Email not found in our database.")
      }
      setIsSubmitting(false)
    }, 1500)
  }

  const handleVerifyOTP = async () => {
    setIsSubmitting(true)
    setErrorMessage(null)

    // Simulate API call to verify OTP
    setTimeout(() => {
      if (formData.otp === "123456") {
        setCurrentStep(3) // Move to Step 3: Create New Password
      } else {
        setErrorMessage("Invalid OTP. Please try again.")
      }
      setIsSubmitting(false)
    }, 1500)
  }

  const handleResetPassword = async () => {
    setIsSubmitting(true)
    setErrorMessage(null)

    // Simulate API call to reset password
    setTimeout(() => {
      if (formData.newPassword === formData.confirmPassword) {
        alert("Password reset successfully!")
        onClose() // Close the modal
      } else {
        setErrorMessage("Passwords do not match.")
      }
      setIsSubmitting(false)
    }, 1500)
  }

  const handleLogin = async () => {
    setIsSubmitting(true)
    setErrorMessage(null)
    signIn(formData)
  }

  const handleForgotPassword = () => {
    // Logic for forgot password (e.g., API call to send reset email)
    alert("Password reset link sent to your email!")
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


          {isForgotPassword ? (
            // Forgot Password Content
            <div className="p-6">
          {currentStep === 1 && (
            // Step 1: Enter Email
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Forgot Password</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter your email to receive an OTP
                </p>
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
              </div>

              <div className="mt-6">
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleSendOTP}
                  disabled={isSubmitting || !formData.email}
                >
                  {isSubmitting ? "Sending OTP..." : "Send OTP"}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            // Step 2: Enter OTP
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Verify OTP</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter the OTP sent to your email
                </p>
              </div>

              {errorMessage && (
                <div className="mb-4 p-2 text-sm text-red-600 bg-red-100 rounded-lg">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    name="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={handleInputChange}
                    className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                  />
                </div>
              </div>

              <div className="mt-6">
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleVerifyOTP}
                  disabled={isSubmitting || !formData.otp}
                >
                  {isSubmitting ? "Verifying..." : "Verify OTP"}
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            // Step 3: Create New Password
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">Reset Password</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Create a new password for your account
                </p>
              </div>

              {errorMessage && (
                <div className="mb-4 p-2 text-sm text-red-600 bg-red-100 rounded-lg">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                  />
                </div>
              </div>

              <div className="mt-6">
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleResetPassword}
                  disabled={isSubmitting || !formData.newPassword || !formData.confirmPassword}
                >
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            </div>
          )}
        </div>
          ) : (
            // Login Content
            <div className="p-4">
              <div>
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
                    onClick={() => setIsForgotPassword(true)} // Switch to forgot password
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
          )}
      </div>
    </div>
  )
}