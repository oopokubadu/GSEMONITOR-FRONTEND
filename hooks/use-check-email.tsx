import { useMutation } from "@tanstack/react-query"
import axios from "axios"

export function useCheckEmail() {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gsemonitor-engine.onrender.com/"
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await axios.get(`${url}/user`, {
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