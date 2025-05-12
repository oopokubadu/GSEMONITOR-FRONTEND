"use client"

import { useGetProfile } from "@/hooks/use-get-profile"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export default function ProfilePage() {
  const { data: profile, isLoading, isError, error } = useGetProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    trading_experience: profile?.trading_experience || "",
    investment_goals: profile?.investment_goals || [],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // Save logic here (e.g., API call to update profile)
    console.log("Profile saved:", formData)
    setIsEditing(false)
  }

  if (isLoading) {
    return <p>Loading profile...</p>
  }

  if (isError) {
    return <p>Error fetching profile: {error.message}</p>
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
                value={formData.full_name}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="trading_experience">Trading Experience</Label>
              <Input
                id="trading_experience"
                name="trading_experience"
                value={formData.trading_experience}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div>
            <Label>Investment Goals</Label>
            <div className="flex flex-wrap gap-2">
              {formData.investment_goals.map((goal, index) => (
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
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>
      </Card>
    </div>
  )
}