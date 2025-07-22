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
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gsemonitor-engine.onrender.com"
  try {
    const response = await fetch(
      `${url}/fetch_all_by_ticker?ticker=${ticker}&period=${period}`
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

// Define allowed period values

// Hook to use chart data
export function useChartData(ticker: string, period: string) {

   const config: Record<string, { staleTime: number; gcTime: number }> = {
    daily: { staleTime: 24 * 60 * 60 * 1000, gcTime: 2 * 24 * 60 * 60 * 1000 }, // 1-day freshness, 2-day cache retention
    weekly: { staleTime: 7 * 24 * 60 * 60 * 1000, gcTime: 14 * 24 * 60 * 60 * 1000 }, // 1-week freshness, 2-week cache retention
    monthly: { staleTime: 30 * 24 * 60 * 60 * 1000, gcTime: 60 * 24 * 60 * 60 * 1000 }, // 1-month freshness, 2-month cache retention
    quarterly: { staleTime: 3 * 30 * 24 * 60 * 60 * 1000, gcTime: 60 * 24 * 60 * 60 * 1000 }, // 1-month freshness, 2-month cache retention
    yearly: { staleTime: 30 * 24 * 60 * 60 * 1000, gcTime: 60 * 24 * 60 * 60 * 1000 }, // 1-month freshness, 2-month cache retention
  };

  const { staleTime, gcTime } = config[period]; 
  
  return useQuery({
    queryKey: ["chartData", ticker, period],
    queryFn: () => fetchChartData(ticker, period),
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
    retry: 2,
    placeholderData: fallbackData,
    staleTime,
    gcTime, // Keep unused data in cache for 5 minutes
  })
}