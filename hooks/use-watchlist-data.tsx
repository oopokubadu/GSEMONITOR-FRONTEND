"use client"

import { useQuery } from "@tanstack/react-query"

// Sample fallback data
const fallbackData: WatchlistData[] = [] // Set fallback data to an empty array

// Type for watchlist data
export interface WatchlistData {
  change: number
  changePercent: number
  isPositive: boolean
  name: string
  price: number
  symbol: string
}

// Function to fetch watchlist data using POST request
async function fetchWatchlistData(): Promise<WatchlistData[]> {
  try {
    // Fetch data from the provided API route using POST
    const response = await fetch('https://gsemonitor.vercel.app/watchlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tickers: ["ACCESS", "GCB", "MTNGH"] }), // Request body
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch watchlist data: ${response.status}`)
    }
    const data = await response.json()
    return data.watchlist // Return the watchlist array from the response
  } catch (error) {
    console.error("Error fetching watchlist data:", error)
    throw error
  }
}

// Hook to use watchlist data
export function useWatchlistData() {
  return useQuery({
    queryKey: ["watchlistData"],
    queryFn: fetchWatchlistData,
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
    retry: 2,
    placeholderData: fallbackData,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
  })
}