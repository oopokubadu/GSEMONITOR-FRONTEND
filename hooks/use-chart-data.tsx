"use client"

import { useQuery } from "@tanstack/react-query"

// Type definition for the chart data
export interface ChartData {
  _id: { $oid: string }
  close_offer_price: number
  closing_price_vwap_gh: number
  data_source: string
  date: { $date: string }
  high: number
  last_transaction_price: number
  low: number
  open: number
  previous_closing_price: number
  price_change_gh: number
  ticker: string
  timestamp: { $date: string }
  total_shares_traded: number
}

// Fallback data
const fallbackData: ChartData[] = []

// Function to fetch chart data by ticker
async function fetchChartData(ticker: string): Promise<ChartData[]> {
  try {
    const response = await fetch(`https://gsemonitor.vercel.app/fetch_all_by_ticker?ticker=${ticker}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch chart data: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching chart data:", error)
    throw error
  }
}

// Hook to use chart data
export function useChartData(ticker: string) {
  return useQuery({
    queryKey: ["chartData", ticker],
    queryFn: () => fetchChartData(ticker),
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
    retry: 2,
    placeholderData: fallbackData,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
  })
}