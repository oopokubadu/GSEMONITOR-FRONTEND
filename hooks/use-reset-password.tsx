import { useMutation } from "@tanstack/react-query"
import axios from "axios"

export function useResetPassword() {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gsemonitor-engine.onrender.com/"
  return useMutation({
    mutationFn: async ({ password, email }: { password: string; email: string }) => {
      const response = await axios.patch(`${url}/user`, { email, password })
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