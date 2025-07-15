import { useMutation } from "@tanstack/react-query"
import axios from "axios"

export function useVerifyOTP() {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gsemonitor-engine.onrender.com/"
  return useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      const response = await axios.post(`${url}/verify_otp`, { email, otp })
      return response.data
    },
    onSuccess: (data) => {
      console.log("OTP verified successfully:", data)
    },
    onError: (error) => {
      console.error("Failed to verify OTP:", error)
    },
  })
}