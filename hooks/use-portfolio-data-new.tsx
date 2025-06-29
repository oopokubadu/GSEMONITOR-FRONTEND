import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://gsemonitor-engine.onrender.com"

const fetchPortfolioData = async (userId: string) => {
  const endpoints = [
    axios.get(`${BASE_URL}/portfolio_summary?user_id=${userId}`),
    axios.get(`${BASE_URL}/portfolio_transactions?user_id=${userId}`),
    axios.get(`${BASE_URL}/portfolio_performance?user_id=${userId}`),
    axios.get(`${BASE_URL}/portfolio?user_id=${userId}`)
  ]

  const [summaryRes, transactionsRes, performanceRes, holdingsRes] = await Promise.allSettled(endpoints)

  return {
    summary: summaryRes.status === 'fulfilled' ? summaryRes.value.data : [],
    transactions: transactionsRes.status === 'fulfilled' ? transactionsRes.value.data : [],
    performance: performanceRes.status === 'fulfilled' ? performanceRes.value.data : [],
    holdings: holdingsRes.status === 'fulfilled' ? holdingsRes.value.data : []
  }
}

export const usePortfolioData = (userId: string) => {
  return useQuery({
    queryKey: ['portfolio', userId],
    queryFn: () => fetchPortfolioData(userId),
    enabled: !!userId,
  })
}