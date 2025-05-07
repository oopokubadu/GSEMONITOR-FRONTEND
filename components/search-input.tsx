import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function SearchInput() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<string[]>([]) // Replace `string[]` with your actual data type
  const [isTyping, setIsTyping] = useState(false)

  // Simulate fetching search results
  const fetchResults = async (searchQuery: string) => {
    // Simulate an API call
    return new Promise<string[]>((resolve) => {
      setTimeout(() => {
        if (searchQuery === "notfound") {
          resolve([]) // Simulate no results
        } else {
          resolve([]) // Simulate results
        }
      }, 500) // Simulate network delay
    })
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
      const fetchedResults = await fetchResults(query)
      setResults(fetchedResults)
      setIsTyping(false)
    }, 500) // Wait 500ms after the user stops typing

    return () => clearTimeout(timeoutId) // Cleanup timeout
  }, [query])

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search GSE Trader"
        value={query}
        onChange={handleInputChange}
        className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
      />
      {query && (
        <div className="absolute left-0 right-0 mt-2 bg-card border rounded-md shadow-lg z-10">
          {isTyping ? (
            <div className="p-4 text-sm text-muted-foreground">Searching...</div>
          ) : results.length > 0 ? (
            <ul className="divide-y divide-muted-foreground">
              {results.map((result, index) => (
                <li key={index} className="p-4 hover:bg-muted cursor-pointer">
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