"use client"

import { useQuery } from "@tanstack/react-query"

// Sample fallback data
const fallbackData: NewsData[] = [] // Set fallback data to an empty array

// Type for News data
export interface NewsData {
  content: string,
  date_time_published: string,
  headline: string,
  sentiment: string,
  source: string,
  summary: string,
  ticker: string,
  url: string
}

// Function to fetch News data using POST request
async function fetchNewsData(): Promise<NewsData[]> {
  try {
    // Fetch data from the provided API route using POST
    const response = await fetch('https://gsemonitor.vercel.app/news', {
      method: 'GET'
    })
    if (!response.ok) {
      throw new Error(`Failed to fetch News data: ${response.status}`)
    }
    const data = await response.json()
    return data // Return the News array from the response
  } catch (error) {
    console.error("Error fetching News data:", error)
    throw error
  }
}

// Hook to use News data
export function useNewsData() {
  return useQuery({
    queryKey: ["NewsData"],
    queryFn: fetchNewsData,
    refetchInterval: 60000, // Refetch every minute
    refetchOnWindowFocus: true,
    retry: 2,
    placeholderData: fallbackData,
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep unused data in cache for 5 minutes
  })
}