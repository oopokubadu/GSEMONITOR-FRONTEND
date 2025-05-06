"use client"

import { useQuery } from "@tanstack/react-query"

// Updated type definition for the chart data
export interface ChartData {
  close: number
  date: string
  high: number
  last_transaction_price: number
  low: number
  open: number
  period: string
  previous_closing_price: number
  price_change_gh: number
  ticker: string
  timestamp: string
  total_shares_traded: number
  total_value_traded: number
}

// Fallback data
const fallbackData: ChartData[] = []

// Function to fetch chart data by ticker and period
async function fetchChartData(ticker: string, period: string): Promise<ChartData[]> {
  try {
    const response = await fetch(
      `https://gsemonitor.vercel.app/fetch_all_by_ticker?ticker=${ticker}&period=${period}`
    )
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
export function useChartData(ticker: string, period: string) {
  return useQuery({
    queryKey: ["chartData", ticker, period],
    queryFn: () => fetchChartData(ticker, period),
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
    retry: 2,
    placeholderData: fallbackData,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
  })
}