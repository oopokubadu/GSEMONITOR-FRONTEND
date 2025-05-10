"use client"

import { useState } from "react"
import Image from "next/image"
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  Globe,
  LineChart,
  Link2,
  Settings,
  Shield,
  UserPlus,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { useSignUp } from "@/hooks/use-sign-up"
import SuccessModal from "./success-modal"


interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    experience: "beginner",
    investmentGoals: [],
    preferredBroker: "",
    notifications: true,
    marketUpdates: true,
  })

  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [validationErrors, setValidationErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const { mutateAsync: signUp } = useSignUp()
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(true)


  const totalSteps = 5
  const progress = (step / totalSteps) * 100

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "email" && value) {
      setOtpSent(false)
      setVerified(false)
    }
  }

  const handleSwitchChange = (name, checked) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSendOtp = () => {
    if (!formData.email) return

    // In a real app, this would send an OTP to the user's email
    setOtpSent(true)
    // alert(`OTP sent to ${formData.email}. For demo purposes, use code: 123456`)
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(0, 1)
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleVerifyOtp = () => {
    setVerifying(true)

    // In a real app, this would verify the OTP with a backend service
    setTimeout(() => {
      const enteredOtp = otp.join("")
      // For demo purposes, any 6-digit code is accepted
      if (enteredOtp.length === 6) {
        setVerified(true)
        setVerifying(false)
      } else {
        alert("Invalid OTP. Please try again.")
        setVerifying(false)
      }
    }, 1500)
  }

  const nextStep = () => {
    if (step === 2) {
      const errors = {
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      }
  
      // Validate Full Name
      if (!formData.fullName) {
        errors.fullName = "Full Name is required."
      }
  
      // Validate Email
      if (!formData.email) {
        errors.email = "Email Address is required."
      } else if (!verified) {
        errors.email = "Please verify your email before proceeding."
      }
  
      // Validate Phone
      if (!formData.phone) {
        errors.phone = "Phone Number is required."
      }
  
      // Validate Password
      if (!formData.password) {
        errors.password = "Password is required."
      } else if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters."
      } else if (!/[A-Z]/.test(formData.password)) {
        errors.password = "Password must contain at least one uppercase letter."
      } else if (!/[0-9]/.test(formData.password)) {
        errors.password = "Password must contain at least one number."
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
        errors.password = "Password must contain at least one special character."
      }
  
      // Validate Confirm Password
      if (!formData.confirmPassword) {
        errors.confirmPassword = "Confirm Password is required."
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match."
      }
  
      // Check if there are any errors
      const hasErrors = Object.values(errors).some((error) => error !== "")
      if (hasErrors) {
        setValidationErrors(errors)
        return
      }
  
      // Clear errors and proceed to the next step
      setValidationErrors({})
      setStep(step + 1)
    } else {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const completeOnboarding = async () => {
    try {
      await signUp({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        trading_experience: formData.experience,
        investment_goals: formData.investmentGoals,
      }) // Pass transformed formData to the sign-up mutation
      setShowOnboarding(false) // Hide onboarding modal
      setIsSuccessModalOpen(true) // Show success modal on successful sign-up
    } catch (error) {
      console.error("Sign-up failed:", error)
      alert("An error occurred during sign-up. Please try again.")
    }
  }

  const handleInvestmentGoalToggle = (goalId) => {
    setFormData((prev) => {
      const investmentGoals = [...prev.investmentGoals]
      const goalIndex = investmentGoals.indexOf(goalId)

      if (goalIndex === -1) {
        investmentGoals.push(goalId)
      } else {
        investmentGoals.splice(goalIndex, 1)
      }

      return { ...prev, investmentGoals }
    })
  }

  if (!isOpen) return null

  return (
    <>
    <SuccessModal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)} />
    {showOnboarding && 
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-auto rounded-lg bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
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
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">GSE Trader Onboarding</span>
              </div>
              <Badge variant="outline" className="text-primary border-primary">
                Step {step} of {totalSteps}
              </Badge>
            </div>
            <Progress value={progress} className="h-1 bg-gray-200 dark:bg-gray-800" indicatorClassName="bg-primary" />
          </div>

          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Welcome to GSE Trader</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Let's set up your account to help you get the most out of your trading experience on the Ghana Stock
                  Exchange.
                </p>
              </div>

              <div className="relative h-64 mx-auto my-8 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?key=bnvr2"
                  alt="GSE Trader Platform Overview"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                  <CardContent className="p-4 text-center space-y-2">
                    <div className="mx-auto bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                      <LineChart className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">Real-time Market Data</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Access live price updates and market depth
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                  <CardContent className="p-4 text-center space-y-2">
                    <div className="mx-auto bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">Secure Trading</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Trade with confidence on our secure platform
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                  <CardContent className="p-4 text-center space-y-2">
                    <div className="mx-auto bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                      <Settings className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium">Personalized Experience</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Customize your dashboard to suit your needs
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Step 2: Account Setup */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Create Your Account</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Let's start by setting up your basic account information.
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 ${
                      validationErrors.fullName ? "border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                  />
                  {validationErrors.fullName && (
                    <p className="text-xs text-red-500">{validationErrors.fullName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 ${
                        validationErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""
                      }`}
                      disabled={verified}
                    />
                    {!otpSent && !verified && formData.email && (
                      <Button
                        type="button"
                        variant="outline"
                        className="whitespace-nowrap border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={handleSendOtp}
                      >
                        Send OTP
                      </Button>
                    )}
                  </div>
                  {validationErrors.email && (
                    <p className="text-xs text-red-500">{validationErrors.email}</p>
                  )}
                </div>

                {otpSent && !verified && (
                  <div className="space-y-4 mt-4 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <div className="text-center">
                      <h3 className="text-lg font-medium mb-2">Verify Your Email</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        We've sent a 6-digit code to {formData.email}. Enter it below to verify your email.
                      </p>
                    </div>

                    <div className="flex justify-center gap-2 my-4">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          id={`otp-${index}`}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          className="w-10 h-12 text-center text-lg bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                          maxLength={1}
                          inputMode="numeric"
                          pattern="[0-9]*"
                        />
                      ))}
                    </div>

                    <div className="flex justify-center">
                      <Button
                        onClick={handleVerifyOtp}
                        className="bg-primary hover:bg-primary/90"
                        disabled={otp.join("").length !== 6 || verifying}
                      >
                        {verifying ? "Verifying..." : "Verify Email"}
                      </Button>
                    </div>

                    <div className="text-center mt-2">
                      <button type="button" className="text-sm text-primary hover:underline" onClick={handleSendOtp}>
                        Resend Code
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 ${
                      validationErrors.phone ? "border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                  />
                  {validationErrors.phone && (
                    <p className="text-xs text-red-500">{validationErrors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 ${
                      validationErrors.password ? "border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                  />
                  {validationErrors.password && (
                    <p className="text-xs text-red-500">{validationErrors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 ${
                      validationErrors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""
                    }`}
                  />
                  {validationErrors.confirmPassword && (
                    <p className="text-xs text-red-500">{validationErrors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* Step 3: Investment Goals */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Your Investment Goals</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Tell us about your investment goals so we can personalize your experience.
                </p>
              </div>

              <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "long-term", label: "Long-term Investment", icon: <LineChart className="h-5 w-5" /> },
                  { id: "short-term", label: "Short-term Trading", icon: <BarChart3 className="h-5 w-5" /> },
                  { id: "dividend", label: "Dividend Income", icon: <Globe className="h-5 w-5" /> },
                  { id: "retirement", label: "Retirement Planning", icon: <Shield className="h-5 w-5" /> },
                ].map((goal) => (
                  <div
                    key={goal.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.investmentGoals.includes(goal.id)
                        ? "border-primary bg-gray-50 dark:bg-gray-900"
                        : "border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                    }`}
                    onClick={() => handleInvestmentGoalToggle(goal.id)}
                  >
                    <div
                      className={`rounded-full p-2 ${
                        formData.investmentGoals.includes(goal.id)
                          ? "bg-primary/20 text-primary"
                          : "bg-gray-800 text-gray-400"
                      }`}
                    >
                      {goal.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{goal.label}</h3>
                    </div>
                    {formData.investmentGoals.includes(goal.id) && <Check className="h-5 w-5 text-primary" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Connect Broker */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Connect Your Broker</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Link your brokerage account to start trading on the Ghana Stock Exchange.
                </p>
              </div>

              <div className="max-w-2xl mx-auto">
                <Tabs defaultValue="select" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-900 p-1">
                    <TabsTrigger
                      value="select"
                      className="data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-800"
                    >
                      Select Broker
                    </TabsTrigger>
                    <TabsTrigger
                      value="manual"
                      className="data-[state=active]:bg-gray-200 dark:data-[state=active]:bg-gray-800"
                    >
                      Manual Setup
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="select" className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: "databank", name: "Databank", logo: "/placeholder.svg?key=yjnqw" },
                        { id: "ic-securities", name: "IC Securities", logo: "/placeholder.svg?key=yjnqw" },
                        { id: "black-star", name: "Black Star Brokerage", logo: "/placeholder.svg?key=yjnqw" },
                        { id: "ecobank", name: "Ecobank Securities", logo: "/placeholder.svg?key=yjnqw" },
                      ].map((broker) => (
                        <div
                          key={broker.id}
                          className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                            formData.preferredBroker === broker.id
                              ? "border-primary bg-gray-50 dark:bg-gray-900"
                              : "border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                          }`}
                          onClick={() => setFormData((prev) => ({ ...prev, preferredBroker: broker.id }))}
                        >
                          <div className="h-10 w-10 rounded-md overflow-hidden bg-white flex items-center justify-center">
                            <Image
                              src={broker.logo || "/placeholder.svg"}
                              alt={broker.name}
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{broker.name}</h3>
                          </div>
                          {formData.preferredBroker === broker.id && <Check className="h-5 w-5 text-primary" />}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
                      <div className="flex items-center gap-2 text-primary mb-2">
                        <Link2 className="h-5 w-5" />
                        <h3 className="font-medium">Connect Your Account</h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        You'll be redirected to your broker's website to authorize the connection. Your credentials are
                        never stored by GSE Trader.
                      </p>
                      <Button
                        className="w-full bg-primary hover:bg-primary/90"
                        onClick={() => alert("In a real app, this would redirect to the broker's authentication page.")}
                      >
                        Connect to{" "}
                        {formData.preferredBroker
                          ? formData.preferredBroker.charAt(0).toUpperCase() + formData.preferredBroker.slice(1)
                          : "Broker"}
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="manual" className="mt-6 space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
                      <h3 className="font-medium mb-2">Manual Account Setup</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        If your broker is not listed, you can still use GSE Trader for market data and analysis. You'll
                        need to execute trades through your broker's platform.
                      </p>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="brokerName">Broker Name</Label>
                          <Input
                            id="brokerName"
                            placeholder="Enter your broker's name"
                            className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber">Account Number (Optional)</Label>
                          <Input
                            id="accountNumber"
                            placeholder="Enter your account number"
                            className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                          />
                        </div>
                        <Button className="w-full bg-primary hover:bg-primary/90">Save Broker Information</Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}

          {/* Step 5: Preferences & Finish */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold">Almost Done!</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Set your preferences and you'll be ready to start trading.
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-medium">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications">Push Notifications</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive alerts for price movements and news
                        </p>
                      </div>
                      <Switch
                        id="notifications"
                        checked={formData.notifications}
                        onCheckedChange={(checked) => handleSwitchChange("notifications", checked)}
                      />
                    </div>
                    <Separator className="bg-gray-200 dark:bg-gray-800" />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketUpdates">Market Updates</Label>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive daily market summaries and analysis
                        </p>
                      </div>
                      <Switch
                        id="marketUpdates"
                        checked={formData.marketUpdates}
                        onCheckedChange={(checked) => handleSwitchChange("marketUpdates", checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
                  <h3 className="font-medium mb-4">Your Account Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Name:</span>
                      <span>{formData.fullName || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Email:</span>
                      <span>{formData.email || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                      <span>{formData.phone || "Not provided"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Experience Level:</span>
                      <span className="capitalize">{formData.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Preferred Broker:</span>
                      <span className="capitalize">{formData.preferredBroker || "Not selected"}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="rounded-full bg-primary/20 p-2">
                      <UserPlus className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-medium">Invite Friends & Earn Rewards</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Invite your friends to GSE Trader and earn rewards when they sign up and start trading.
                  </p>
                  <div className="flex gap-2">
                    <Input
                      value="https://gsetrader.com/invite/your-unique-code"
                      readOnly
                      className="bg-gray-800 border-gray-700"
                    />
                    <Button variant="outline" className="border-gray-700 hover:bg-gray-800">
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button
                variant="outline"
                className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={prevStep}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            ) : (
              <div></div>
            )}
            {step < totalSteps ? (
              <Button className="bg-primary hover:bg-primary/90" onClick={nextStep}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button className="bg-primary hover:bg-primary/90" onClick={completeOnboarding}
              >
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
    }
    </>
  )
}
