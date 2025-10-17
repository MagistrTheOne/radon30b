"use client"

import { useState, useEffect, useRef } from 'react'
import { Search, X, Clock, FileText, HelpCircle, BookOpen } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SearchResult {
  id: string
  title: string
  content: string
  url: string
  type: 'docs' | 'blog' | 'faq'
  score: number
  publishedAt?: string
}

interface SearchComponentProps {
  placeholder?: string
  className?: string
  onResultClick?: (result: SearchResult) => void
}

export function SearchComponent({ 
  placeholder = "Поиск по документации...", 
  className = "",
  onResultClick 
}: SearchComponentProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Загружаем недавние поиски из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent-searches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Закрытие при клике вне компонента
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const performSearch = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`)
      const data = await response.json()
      
      if (response.ok) {
        setResults(data.results || [])
        
        // Сохраняем в недавние поиски
        const newRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
        setRecentSearches(newRecent)
        localStorage.setItem('recent-searches', JSON.stringify(newRecent))
      } else {
        setResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    if (value.length >= 2) {
      performSearch(value)
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(value.length > 0)
    }
  }

  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result)
    } else {
      window.location.href = result.url
    }
    setIsOpen(false)
    setQuery('')
  }

  const handleRecentClick = (recentQuery: string) => {
    setQuery(recentQuery)
    performSearch(recentQuery)
    setIsOpen(true)
  }

  const clearRecent = () => {
    setRecentSearches([])
    localStorage.removeItem('recent-searches')
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'docs':
        return <FileText className="w-4 h-4" />
      case 'blog':
        return <BookOpen className="w-4 h-4" />
      case 'faq':
        return <HelpCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'docs':
        return 'Документация'
      case 'blog':
        return 'Блог'
      case 'faq':
        return 'FAQ'
      default:
        return 'Документ'
    }
  }

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-md", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            onClick={() => {
              setQuery('')
              setResults([])
              setIsOpen(false)
            }}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Результаты поиска */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Поиск...
            </div>
          ) : results.length > 0 ? (
            <div className="p-2">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="w-full text-left p-3 hover:bg-muted rounded-lg transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5 text-muted-foreground">
                      {getTypeIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">
                          {result.title}
                        </h4>
                        <Badge variant="secondary" className="text-xs">
                          {getTypeLabel(result.type)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {result.content}
                      </p>
                      {result.publishedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(result.publishedAt).toLocaleDateString('ru-RU')}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="p-4 text-center text-muted-foreground">
              Ничего не найдено
            </div>
          ) : recentSearches.length > 0 ? (
            <div className="p-2">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Недавние поиски
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecent}
                  className="h-6 px-2 text-xs"
                >
                  Очистить
                </Button>
              </div>
              {recentSearches.map((recent, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentClick(recent)}
                  className="w-full text-left p-3 hover:bg-muted rounded-lg transition-colors flex items-center gap-3"
                >
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{recent}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
