import { useMutation } from "@tanstack/react-query"
import axios from "axios"

export function useSendOTP() {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gsemonitor-engine.onrender.com/"
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await axios.post(`${url}/send_otp`, { email })
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