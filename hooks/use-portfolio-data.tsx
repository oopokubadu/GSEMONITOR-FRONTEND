"use client"

import { useQuery } from "@tanstack/react-query"

// Sample fallback data
const fallbackData = [
  { month: "Jan", value: 38500 },
  { month: "Feb", value: 40200 },
  { month: "Mar", value: 39800 },
  { month: "Apr", value: 42300 },
  { month: "May", value: 44100 },
  { month: "Jun", value: 43500 },
  { month: "Jul", value: 45800 },
  { month: "Aug", value: 47200 },
  { month: "Sep", value: 46500 },
  { month: "Oct", value: 48900 },
  { month: "Nov", value: 47800 },
  { month: "Dec", value: 50200 },
]

// Type for portfolio performance data
export interface PerformanceData {
  month: string
  value: number
}

// Function to fetch portfolio data
async function fetchPortfolioData(): Promise<PerformanceData[]> {
  try {
    // In a real application, this would fetch from an API
    // For now, we'll use the embedded data to avoid path resolution issues

    // When you're ready to connect to a real backend API, uncomment this:
    // const response = await fetch('https://api.example.com/portfolio/performance')
    // if (!response.ok) {
    //   throw new Error(`Failed to fetch portfolio data: ${response.status}`)
    // }
    // return await response.json()

    // For development, we'll use the fallback data directly
    // This simulates a successful API call
    console.log("Using embedded performance data instead of fetching JSON file")

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return fallbackData
  } catch (error) {
    console.error("Error fetching portfolio data:", error)
    throw error
  }
}

// Generate random performance data as a fallback
function generatePerformanceData(): PerformanceData[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  let currentValue = 40000 // Starting value

  return months.map((month) => {
    const change = Math.floor(Math.random() * 5000) - 1500 // Random change between -1500 and 3499
    currentValue += change
    return { month, value: currentValue }
  })
}

// Hook to use portfolio performance data
export function usePortfolioData(period = "1Y") {
  return useQuery({
    queryKey: ["portfolioPerformance", period],
    queryFn: fetchPortfolioData,
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
    retry: 2,
    placeholderData: fallbackData,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
  })
}
