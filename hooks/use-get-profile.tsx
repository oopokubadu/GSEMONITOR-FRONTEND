import { useQuery } from "@tanstack/react-query"
import axios from "axios"

// Function to fetch user profile
async function fetchUserProfile() {
  const userId = localStorage.getItem("userId") // Get user ID from local storage
  if (!userId) {
    throw new Error("User ID not found in local storage")
  }
  
  const response = await axios.get(`https://gsemonitor.vercel.app/user`, {
    params: { user_id: userId }, // Include the user ID in the request body
  })

  console.log("User profile response:", response) // Log the response for debugging
  // Check if the response is successful

  if (!response.status || response.status !== 200) {
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