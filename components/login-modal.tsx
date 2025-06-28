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
              {!didForgotPassword && <div className="flex flex-col items-center mb-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 border-gray-300 dark:border-gray-700"
                  onClick={() => {
                    window.location.href = "https://engine.gsemonitor.chopmoney.co/google_auth"
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#clip0_680_19997)"><path fillRule="evenodd" clipRule="evenodd" d="M4.3101 10.0003C4.3101 9.35078 4.41791 8.72797 4.61057 8.14391L1.24025 5.57031C0.583379 6.90391 0.213379 8.40672 0.213379 10.0003C0.213379 11.5927 0.583066 13.0944 1.23885 14.4272L4.60729 11.8486C4.4165 11.2672 4.3101 10.6467 4.3101 10.0003Z" fill="#FBBC05"></path><path fillRule="evenodd" clipRule="evenodd" d="M10.2276 4.09094C11.6387 4.09094 12.9132 4.59094 13.9146 5.40906L16.8277 2.5C15.0526 0.954531 12.7766 0 10.2276 0C6.27008 0 2.86883 2.26312 1.24023 5.57L4.61039 8.14359C5.38695 5.78641 7.60055 4.09094 10.2276 4.09094Z" fill="#EA4335"></path><path fillRule="evenodd" clipRule="evenodd" d="M10.2276 15.9091C7.6007 15.9091 5.38711 14.2136 4.61055 11.8564L1.24023 14.4295C2.86883 17.7369 6.27008 20 10.2276 20C12.6701 20 15.0021 19.1327 16.7523 17.5077L13.5532 15.0345C12.6505 15.6031 11.5138 15.9091 10.2276 15.9091Z" fill="#34A853"></path><path fillRule="evenodd" clipRule="evenodd" d="M19.7864 10C19.7864 9.40907 19.6954 8.77267 19.5588 8.18188H10.2275V12.0455H15.5988C15.3302 13.3628 14.5993 14.3755 13.5532 15.0345L16.7522 17.5077C18.5907 15.8014 19.7864 13.2595 19.7864 10Z" fill="#4285F4"></path></g><defs><clipPath id="clip0_680_19997"><rect width="20" height="20" fill="white"></rect></clipPath></defs></svg>

                  Login with Google
                </Button>
                <div className="my-4 w-full flex items-center">
                  <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                  <span className="mx-2 text-xs text-gray-400">or</span>
                  <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                </div>
              </div>}

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