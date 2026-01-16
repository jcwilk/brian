import { useEffect } from 'react'
import { useStore } from './store/useStore'
import { Toaster } from 'sonner'
import Navbar from './components/Navbar'
import ViewSwitcher from './components/ViewSwitcher'
import FeedView from './views/FeedView'
import TimelineView from './views/TimelineView'
import GraphView from './views/GraphView'
import ItemModal from './components/ItemModal'

function App() {
  const { currentView, theme, fetchItems, fetchStats, fetchTags } = useStore()

  useEffect(() => {
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  useEffect(() => {
    // Initial data fetch
    fetchItems()
    fetchStats()
    fetchTags()
  }, [fetchItems, fetchStats, fetchTags])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <Navbar />

      {/* View Switcher */}
      <div className="container mx-auto px-4 py-6">
        <ViewSwitcher />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12">
        {currentView === 'feed' && <FeedView />}
        {currentView === 'timeline' && <TimelineView />}
        {currentView === 'graph' && <GraphView />}
      </main>

      {/* Item Modal */}
      <ItemModal />

      {/* Toast Notifications */}
      <Toaster 
        theme={theme}
        position="top-right"
        toastOptions={{
          classNames: {
            toast: 'bg-card border-border',
            title: 'text-foreground',
            description: 'text-muted-foreground',
          },
        }}
      />
    </div>
  )
}

export default App
