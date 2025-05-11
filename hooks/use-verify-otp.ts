import { useMutation } from "@tanstack/react-query"
import axios from "axios"

export function useVerifyOTP() {
  return useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      const response = await axios.post(`https://gsemonitor.vercel.app/verify_otp`, { email, otp })
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