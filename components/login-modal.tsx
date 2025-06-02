"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { useSignIn } from "@/hooks/use-sign-in"
import { useQueryClient } from "@tanstack/react-query"
import { useSendOTP } from "@/hooks/use-send-otp"
import { useCheckEmail } from "@/hooks/use-check-email"
import { useVerifyOTP } from "@/hooks/use-verify-otp"
import { useResetPassword } from "@/hooks/use-reset-password"

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
  const [didForgotPassword, setDidForgotPassword] = useState(false)
  const { mutate: signIn } = useSignIn()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isForgotPassword, setIsForgotPassword] = useState(false) // State to toggle modal content
  const queryClient = useQueryClient()
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  const { mutate: sendOTP } = useSendOTP()
  const { mutate: checkEmail } = useCheckEmail()
  const { mutate: verifyOTP } = useVerifyOTP()
  const { mutate: resetPassword } = useResetPassword()

  const handleSendOTP = async () => {
    setIsSubmitting(true)
    setErrorMessage(null)
    if (!formData.email) return
    
    checkEmail(formData.email, {
      onSuccess: () => {
        sendOTP(formData.email, {
          onSuccess: () => {
            console.log("OTP sent successfully!")
            setCurrentStep(2)
          },
          onError: () => {
            setErrorMessage("Failed to send OTP. Please try again.")
            console.error("Failed to send OTP.")
          },
        })
      },
      onError: () => {
        setErrorMessage("Email not found in our database.")
      },
    })

    setIsSubmitting(false)
  }

  const handleVerifyOTP = async () => {
    setIsSubmitting(true)
    setErrorMessage(null)

    verifyOTP({ email: formData.email, otp: formData.otp }, {
      onSuccess: () => {
        console.log("OTP verified successfully!")
        setCurrentStep(3) // Move to Step 3: Create New Password
      },
      onError: () => {
        setErrorMessage("Invalid OTP. Please try again.")
        console.error("Failed to verify OTP.")
      },
    })

    setIsSubmitting(false)
  }

  const handleResetPassword = async () => {
    setIsSubmitting(true)
    setErrorMessage(null)

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.")
      setIsSubmitting(false)
      return
    }
    
    resetPassword({ email: formData.email, password: formData.newPassword }, {
      onSuccess: () => {
        console.log("Password reset successfully!")
        setDidForgotPassword(true)
        setIsForgotPassword(false)
      },
      onError: () => {
        setErrorMessage("Failed to reset password. Please try again.")
        console.error("Failed to reset password.")
      },
    })
    setIsSubmitting(false)
  }

  const handleLogin = async () => {
    setIsSubmitting(true)
    setErrorMessage(null)
    setDidForgotPassword(false)
    signIn(formData, {
      onSuccess: () => {
        queryClient.refetchQueries({queryKey: ["authState"]}) // Invalidate user data
        onClose()
      },
      onError: () => {
        setErrorMessage("Invalid email or password. Please try again.")
      },
      onSettled: () => {
        setIsSubmitting(false) // Ensure isSubmitting is reset
      },
    })
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

          <div className="mt-4 text-center">
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => 
                currentStep <= 1 
                ? setIsForgotPassword(false)
                : setCurrentStep(currentStep-1 || 1 )// Switch back to login
              } // Switch back to login
            >
              Back
            </button>
          </div>
        </div>
          ) : (
            // Login Content
            <div className="p-4">
              
              <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">{didForgotPassword ? "Password Resetted" : "Welcome Back"}</h2>
                <p className="text-gray-600 dark:text-gray-400">Log in to your account</p>
              </div>
              {/* {!didForgotPassword && <div className="flex flex-col items-center mb-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 border-gray-300 dark:border-gray-700"
                  onClick={() => {
                    // TODO: Implement Google sign up logic
                    alert("Log In with Google clicked!")
                  }}
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g>
                      <path
                        d="M44.5 20H24V28.5H36.9C35.5 33.1 31.2 36 24 36C16.3 36 10 29.7 10 22C10 14.3 16.3 8 24 8C27.3 8 30.2 9.1 32.5 11L38.1 5.4C34.5 2.2 29.6 0 24 0C10.7 0 0 10.7 0 24C0 37.3 10.7 48 24 48C37.3 48 48 37.3 48 24C48 22.3 47.8 20.7 47.5 19.2L44.5 20Z"
                        fill="#FFC107"
                      />
                      <path
                        d="M6.3 14.7L12.7 19.2C14.6 15.1 18.9 12 24 12C27.3 12 30.2 13.1 32.5 15L38.1 9.4C34.5 6.2 29.6 4 24 4C16.3 4 10 10.3 10 18C10 19.3 10.2 20.6 10.5 21.8L6.3 14.7Z"
                        fill="#FF3D00"
                      />
                      <path
                        d="M24 44C31.2 44 35.5 41.1 36.9 36.5L24 28.5V36H36.9C35.5 40.6 31.2 44 24 44Z"
                        fill="#4CAF50"
                      />
                      <path
                        d="M44.5 20H24V28.5H36.9C36.3 30.7 34.7 32.6 32.5 34L38.1 39.6C41.6 36.5 44 31.8 44.5 26.5C44.5 25.7 44.5 24.9 44.5 24C44.5 22.3 44.3 20.7 44.5 20Z"
                        fill="#1976D2"
                      />
                    </g>
                  </svg>
                  Login with Google
                </Button>
                <div className="my-4 w-full flex items-center">
                  <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                  <span className="mx-2 text-xs text-gray-400">or</span>
                  <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                </div>
              </div>} */}

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