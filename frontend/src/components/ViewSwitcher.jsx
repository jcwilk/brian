import { useStore } from '../store/useStore'
import { Button } from './ui/button'
import { LayoutGrid, Clock, Network } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ViewSwitcher() {
  const { currentView, setCurrentView } = useStore()

  const views = [
    { id: 'feed', label: 'Feed', icon: LayoutGrid },
    { id: 'timeline', label: 'Time Machine', icon: Clock },
    { id: 'graph', label: 'Graph', icon: Network },
  ]

  return (
    <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
      {views.map((view) => {
        const Icon = view.icon
        const isActive = currentView === view.id

        return (
          <Button
            key={view.id}
            variant={isActive ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView(view.id)}
            className="relative gap-2"
          >
            {isActive && (
              <motion.div
                layoutId="activeView"
                className="absolute inset-0 bg-primary rounded-md"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon className="h-4 w-4 relative z-10" />
            <span className="relative z-10">{view.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
