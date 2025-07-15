import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

export function useUpdatePortfolio() {
  const queryClient = useQueryClient()
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gsemonitor-engine.onrender.com/"
  return useMutation({
    mutationFn: async (portfolioData: any) => {
      const response = await axios.patch(`${url}/portfolio`, portfolioData)
      return response.data
    },
    onSuccess: () => {
      console.log("portfolio updated successfully")
      // Invalidate or refetch the profile query to ensure updated data
      queryClient.refetchQueries({queryKey: ["PortfolioData"]})
      // Optionally, you can invalidate the query to force a refetch
    },
    onError: (error) => {
      console.error("Failed to update profile:", error)
    },
  })
}