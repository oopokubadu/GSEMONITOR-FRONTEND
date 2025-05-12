import { useMutation } from "@tanstack/react-query"
import axios from "axios"

export function useCheckEmail() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await axios.get(`https://gsemonitor.vercel.app/user`, {
        params: { email }, // Include the email in the request body
      })
      return response.data
    },
    onSuccess: (data) => {
      console.log("Email check successful:", data)
    },
    onError: (error) => {
      console.error("Failed to check email:", error)
    },
  })
}