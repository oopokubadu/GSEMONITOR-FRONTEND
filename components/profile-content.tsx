"use client"

import { useGetProfile } from "@/hooks/use-get-profile"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useUpdateProfile } from "@/hooks/use-update-profile"

export default function ProfilePage() {
  const { data: profile} = useGetProfile()
  const { mutate: updateProfile } = useUpdateProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name ?? "",
    email: profile?.email ?? "",
    phone: profile?.phone ?? "",
    trading_experience: profile?.trading_experience ?? "",
    investment_goals: profile?.investment_goals ?? [],
  })

  useEffect(() => {
    setFormData({
      full_name: profile?.full_name,
      email: profile?.email,
      phone: profile?.phone,
      trading_experience: profile?.trading_experience,
      investment_goals: profile?.investment_goals,
    });
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    updateProfile(formData, {
      onSuccess: () => {
        console.log("Profile updated successfully")
        setIsEditing(false)
      },
      onError: () => {
        console.error("Failed to update profile")
      },
    })
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
              <br/>
              <select
                id="trading_experience"
                name="trading_experience"
                value={formData.trading_experience}
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
          <div>
            <Label>Investment Goals</Label>
            <div className="flex flex-wrap gap-2">
              {formData.investment_goals.map((goal: any, index: any) => (
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