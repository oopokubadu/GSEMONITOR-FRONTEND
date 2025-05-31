"use client"

import { useGetProfile } from "@/hooks/use-get-profile"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useUpdateProfile } from "@/hooks/use-update-profile"
import { useSignIn } from "@/hooks/use-sign-in"
import { toast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { data: profile} = useGetProfile()
  const { mutate: signIn } = useSignIn()
  const { mutate: updateProfile } = useUpdateProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name ?? "",
    email: profile?.email ?? "",
    phone: profile?.phone ?? "",
    trading_experience: profile?.trading_experience ?? "",
    investment_goals: profile?.investment_goals ?? [],
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [passwordErrors, setPasswordErrors] = useState({
    newPassword: "",
    confirmPassword: "",
    currentPassword: ""
  })

  useEffect(() => {
    setFormData({
      full_name: profile?.full_name ?? "",
      email: profile?.email ?? "",
      phone: profile?.phone ?? "",
      trading_experience: profile?.trading_experience ?? "",
      investment_goals: profile?.investment_goals ?? [],
    });
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validatePassword = (password: string) => {
    if (password.length === 0) return ""
    if (password.length < 8) {
      return "Password must be at least 8 characters."
    } else if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter."
    } else if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number."
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character."
    }
    return ""
  }

  const handlePasswordChange = (field: keyof typeof passwordData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value
    setPasswordData(prev => ({ ...prev, [field]: value }))

    // Validate based on field
    let error = ""
    if (field === "newPassword") {
      error = validatePassword(value)
    } else if (field === "confirmPassword") {
      error = value !== passwordData.newPassword && value.length > 0 
        ? "Passwords do not match." 
        : ""
    }

    setPasswordErrors(prev => ({ ...prev, [field]: error }))
  }

  const hasPasswordErrors = () => {
    return Object.values(passwordErrors).some(error => error !== "") ||
           (passwordData.newPassword && passwordData.newPassword !== passwordData.confirmPassword)
  }

  const isPasswordChangeAttempted = () => {
    return passwordData.currentPassword || passwordData.newPassword || passwordData.confirmPassword
  }

  const handleSave = () => {
    // Check for password validation errors
    if (hasPasswordErrors()) return

    // Prepare update data
    const updateData = { ...formData }

    
  const updateProfileData = () => {
    updateProfile(updateData, {
      onSuccess: () => {
        setIsEditing(false)
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        })
        setPasswordErrors({
          newPassword: "",
          confirmPassword: "",
          currentPassword: ""
        })
        toast({
        title: "Success!",
        description: "Profile Data Updated Successfully.",
        duration: 4000
      })
      },
      onError: (error) => {
        console.error("Error updating profile:", error)
      }
    })
  }
    
    // Add password to update if user is changing it
    if (isPasswordChangeAttempted()) {
      if (!passwordData.currentPassword) {
        setPasswordErrors(prev => ({ 
          ...prev, 
          currentPassword: "Current password is required to change password." 
        }))
        return
      }
      if (!passwordData.newPassword) {
        setPasswordErrors(prev => ({ 
          ...prev, 
          newPassword: "New password is required." 
        }))
        return
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordErrors(prev => ({ 
          ...prev, 
          confirmPassword: "Passwords do not match." 
        }))
        return
      }
      
      // Add password fields to update
      Object.assign(updateData, {
        currentPassword: passwordData.currentPassword,
        password: passwordData.newPassword
      })
    }
    
    if(passwordData.currentPassword) {
      signIn({
        email: formData.email,
        password: passwordData.currentPassword
      }, {
        onSuccess: () => {
          updateProfileData()
        },
        onError: () => {
          setPasswordErrors(prev => ({ 
            ...prev, 
            currentPassword: "Current password is incorrect." 
          }))
          return
        }
    })
    } else {
      updateProfileData()
    }
  }

  const handleCancel = () => {
    setPasswordErrors({
      newPassword: "",
      confirmPassword: "",
      currentPassword: ""
    })
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    })
    setIsEditing(false)
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                value={formData.full_name ?? ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email ?? ""}
                onChange={handleInputChange}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone ?? ""}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="trading_experience">Trading Experience</Label>
              <br/>
              <select
                id="trading_experience"
                name="trading_experience"
                value={formData.trading_experience ?? ""}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-md p-2 w-full"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="veteran">Veteran</option>
              </select>
            </div>
          </div>

          {/* Password Change Section */}
          {isEditing && (
            <div className="border-t pt-4 mt-6">
              <h3 className="text-lg font-medium mb-4">Change Password (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange("currentPassword")}
                    placeholder="Enter current password"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword}</p>
                  )}
                </div>
                <div></div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange("newPassword")}
                    placeholder="Enter new password"
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange("confirmPassword")}
                    placeholder="Confirm new password"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div>
            <Label>Investment Goals</Label>
            <div className="flex flex-wrap gap-2">
              {formData.investment_goals?.map((goal: any, index: any) => (
                <Badge key={index} variant="outline">
                  {goal}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <Label>Phone Confirmed</Label>
            <p className="text-sm">
              {profile?.phone_confirmed ? (
                <span className="text-green-500">Yes</span>
              ) : (
                <span className="text-red-500">No</span>
              )}
            </p>
          </div>
        </CardContent>
        <div className="p-4 flex justify-end space-x-4">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={hasPasswordErrors()}>
                Save
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </Card>
    </div>
  )
}