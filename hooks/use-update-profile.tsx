import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (profileData: any) => {
      const response = await axios.patch(`https://gsemonitor.vercel.app/user`, profileData)
      return response.data
    },
    onSuccess: () => {
      console.log("Profile updated successfully")
      // Invalidate or refetch the profile query to ensure updated data
      queryClient.invalidateQueries({queryKey: ["userProfile"]})
    },
    onError: (error) => {
      console.error("Failed to update profile:", error)
    },
  })
}