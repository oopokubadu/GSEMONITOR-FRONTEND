import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import { useAuth } from "@/hooks/use-auth"

export function SearchInput() {
  const [query, setQuery] = useState("")
  const { data: dashboardData = [] } = useDashboardData()
  const [results, setResults] = useState<string[]>([]) // Replace `string[]` with your actual data type
  const [isTyping, setIsTyping] = useState(false)
  const { isSignedIn, isLoading } = useAuth()

  // Simulate fetching search results
  const fetchResults = (searchQuery: string) => {
    // Simulate an API call
    return dashboardData
      .filter(x => JSON.stringify(x).includes(searchQuery))
      .map(x => `${x.name}:${x.symbol}`)
  }

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsTyping(true)
  }

  // Fetch results when the user stops typing
  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const timeoutId = setTimeout(async () => {
      const fetchedResults = fetchResults(query)
      setResults(fetchedResults)
      setIsTyping(false)
    }, 500) // Wait 500ms after the user stops typing

    return () => clearTimeout(timeoutId) // Cleanup timeout
  }, [query])

  const checkandRedirect = (e: any) => {
    const res = e.target.innerHTML?.split(":")[1]
    if(isSignedIn){
        window.location.href = `/dashboard?stock=${res}`
      }
  }

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search GSE Trader"
        value={query}
        onChange={handleInputChange}
        className="w-full appearance-none bg-background pl-8 shadow-none"
      />
      {query && (
        <div className="absolute left-0 right-0 mt-2 bg-card border rounded-md shadow-lg z-10">
          {isTyping ? (
            <div className="p-4 text-sm text-muted-foreground">Searching...</div>
          ) : results.length > 0 ? (
            <ul className="divide-y divide-muted-foreground">
              {results.map((result, index) => (
                <li key={index} onClick={checkandRedirect} className="p-4 hover:bg-muted cursor-pointer">
                  {result}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-muted-foreground">No results found</div>
          )}
        </div>
      )}
    </div>
  )
}