import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { Button } from './ui/button'
import { Search, Plus, Moon, Sun, Brain } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Navbar() {
  const { 
    theme, 
    toggleTheme, 
    openModal, 
    searchQuery, 
    setSearchQuery, 
    searchItems,
    fetchItems 
  } = useStore()
  
  const [localSearch, setLocalSearch] = useState(searchQuery)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch) {
        searchItems(localSearch)
      } else {
        fetchItems()
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [localSearch, searchItems, fetchItems])

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <Brain className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">brian</h1>
              <p className="text-xs text-muted-foreground">your personal knowledge base</p>
            </div>
          </motion.div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search your knowledge... (Cmd+K)"
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value)
                  setSearchQuery(e.target.value)
                }}
                className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <Button
              onClick={() => openModal('create')}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Knowledge
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
