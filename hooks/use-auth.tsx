"use client"

import { useQuery } from "@tanstack/react-query"
import { getAuthState } from "../services/auth"

export function useAuth() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["authState"],
    queryFn: getAuthState,
    retry: false, // Disable retries for auth check
  })

  return {
    isSignedIn: !!data , // User is signed in if data exists
    isLoading,
    isError,
  }
}