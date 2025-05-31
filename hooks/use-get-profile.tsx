import { useQuery } from "@tanstack/react-query"
import axios from "axios"

// Function to fetch user profile
async function fetchUserProfile() {
  const userId = localStorage.getItem("userId") // Get user ID from local storage
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gsemonitor.vercel.app"
  if (!userId) {
    throw new Error("User ID not found in local storage")
  }
  
  const response = await axios.get(`${url}/user`, {
    params: { user_id: userId }, // Include the user ID in the request body
  })

  if (!response.status || response.status !== 200) {
    if(response.data.error) {
      localStorage.removeItem("authToken")
      window.location.href = "/?login=true"
    }
    throw new Error(`Failed to fetch user profile: ${response.status}`)
  }

  return response.data // Return the user profile data
}

// Hook to use user profile data
export function useGetProfile() {
  return useQuery({
    queryKey: ["userProfile", localStorage.getItem("userId")], // Unique query key for caching
    queryFn: fetchUserProfile, // Fetch user profile using userId
    enabled: !!localStorage.getItem("userId"), // Only fetch if userId exists in local storage
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: true, // Refetch when the window regains focus
    retry: 2, // Retry failed requests up to 2 times
  })
}