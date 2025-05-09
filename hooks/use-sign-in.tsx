import { useMutation } from "@tanstack/react-query"
import { signIn } from "../services/auth"

export function useSignIn() {
  return useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      // Save token or user data to localStorage
      localStorage.setItem("authToken", data.access_token)
    },
    onError: (error) => {
      console.error("Sign-in failed:", error)
    },
  })
}