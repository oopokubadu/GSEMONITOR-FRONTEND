import { useMutation } from "@tanstack/react-query"
import { signUp } from "../services/auth"

export function useSignUp() {
  return useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      console.log("Sign-up successful:", data)
    },
    onError: (error) => {
      console.error("Sign-up failed:", error)
    },
  })
}