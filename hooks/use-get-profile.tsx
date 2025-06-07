"use client"

import { useQuery } from "@tanstack/react-query"
import axios from "axios"
// Function to fetch user profile
async function fetchUserProfile() {
  const userId = localStorage.getItem("userId")// Get user ID from local storage
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gsemonitor.vercel.app"
  if (!userId) {
    throw new Error("User ID not found in local storage")
  }
  try {
    const response = await axios.get(`${url}/user`, {
      params: { user_id: userId }, // Include the user ID in the request body
    })
    
    if (!response.status || response.status !== 200) {
      console.log("Error fetching user profile:", response.data)
      if(response.data.error) {
        localStorage.removeItem("authToken")
        localStorage.removeItem("googleToken")
        window.location.href = "/?login=true"
      }
      throw new Error(`Failed to fetch user profile: ${response.status}`)
    }
  return response.data // Return the user profile data
} catch (error) {
    console.error("Error fetching user profile:", error)
    localStorage.removeItem("authToken")
    localStorage.removeItem("googleToken")
    window.location.href = "/?login=true"
  }
  throw new Error("Failed to fetch user profile")
}

// Hook to use user profile data
export function useGetProfile() {
  const urlParams = typeof window != "undefined" && new URLSearchParams(window.location.search);
  const localStorageUserId = typeof localStorage != "undefined" && localStorage.getItem("userId");

  return useQuery({
    queryKey: [
      "userProfile",
      urlParams && typeof urlParams.get === "function"
        ? urlParams.get("user_id")
        : localStorageUserId
    ], // Unique query key for caching
    queryFn: fetchUserProfile, // Fetch user profile using userId
    enabled: !!localStorage.getItem("userId"), // Only fetch if userId exists in local storage
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: true, // Refetch when the window regains focus
    retry: 2, // Retry failed requests up to 2 times
  })
}