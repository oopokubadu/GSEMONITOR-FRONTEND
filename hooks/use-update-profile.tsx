import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gsemonitor.vercel.app"
  return useMutation({
    mutationFn: async (profileData: any) => {
      const response = await axios.patch(`${url}/user`, profileData)
      return response.data
    },
    onSuccess: () => {
      console.log("Profile updated successfully")
      // Invalidate or refetch the profile query to ensure updated data
      queryClient.refetchQueries({queryKey: ["userProfile"]})
      // Optionally, you can invalidate the query to force a refetch
    },
    onError: (error) => {
      console.error("Failed to update profile:", error)
    },
  })
}