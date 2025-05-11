import { useMutation } from "@tanstack/react-query"
import axios from "axios"

export function useSendOTP() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await axios.post(`https://gsemonitor.vercel.app/send_otp`, { email })
      return response.data
    },
    onSuccess: (data) => {
      console.log("OTP sent successfully:", data)
    },
    onError: (error) => {
      console.error("Failed to send OTP:", error)
    },
  })
}