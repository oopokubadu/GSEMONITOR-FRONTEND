"use client"

import { useQuery } from "@tanstack/react-query"

// Sample fallback data
const fallbackData: DashboardData[] = [] // Set fallback data to an empty array

// Type for dashboard data
export interface DashboardData {
  change: number
  changePercent: number
  isPositive: boolean
  name: string
  price: number
  symbol: string
}

// Function to fetch dashboard data
async function fetchDashboardData(): Promise<DashboardData[]> {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gsemonitor-engine.onrender.com"
  try {
    // Fetch data from the provided API route
    const response = await fetch(`${url}/dashboard`)
    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard data: ${response.status}`)
    }
    const data = await response.json()
    return data.dashboard // Return the dashboard array from the response
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    throw error
  }
}

// Hook to use dashboard data
export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboardData"],
    queryFn: fetchDashboardData,
    refetchInterval: 2 * 60000, // Refetch every minute
    refetchOnWindowFocus: false,
    retry: 2,
    placeholderData: fallbackData,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
  })
}