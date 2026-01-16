import { useEffect } from 'react'
import { useStore } from '../store/useStore'
import { motion, AnimatePresence } from 'framer-motion'
import StatsBar from '../components/StatsBar'
import FilterBar from '../components/FilterBar'
import KnowledgeCard from '../components/KnowledgeCard'

export default function FeedView() {
  const { items, searchResults, searchQuery, isLoading, fetchItems } = useStore()

  useEffect(() => {
    if (!searchQuery) {
      fetchItems()
    }
  }, [searchQuery, fetchItems])

  const displayItems = searchQuery ? searchResults : items

  if (isLoading) {
    return (
      <div className="space-y-6">
        <StatsBar />
        <FilterBar />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <StatsBar />
      <FilterBar />

      {displayItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="text-6xl mb-4">🧠</div>
          <h3 className="text-2xl font-semibold mb-2">No knowledge yet</h3>
          <p className="text-muted-foreground max-w-md">
            {searchQuery
              ? `No results found for "${searchQuery}"`
              : 'Start building your knowledge base by adding your first item!'}
          </p>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {displayItems.map((item, index) => (
              <KnowledgeCard
                key={item.id}
                item={item}
                index={index}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
