import { useMutation } from "@tanstack/react-query"
import axios from "axios"

export function useResetPassword() {
  return useMutation({
    mutationFn: async ({ password, email }: { password: string; email: string }) => {
      const response = await axios.patch(`https://gsemonitor.vercel.app/user`, { email, password })
      return response.data
    },
    onSuccess: (data) => {
      console.log("Password reset successful:", data)
    },
    onError: (error) => {
      console.error("Failed to reset password:", error)
    },
  })
}