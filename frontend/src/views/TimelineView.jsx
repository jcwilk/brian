import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

export default function TimelineView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <Clock className="h-20 w-20 text-muted-foreground mb-6" />
      </motion.div>
      <h2 className="text-3xl font-bold mb-2">Time Machine</h2>
      <p className="text-muted-foreground text-center max-w-md">
        Travel through your knowledge timeline. This view will show your items organized by date with beautiful animations.
      </p>
      <p className="text-sm text-muted-foreground mt-4">Coming soon...</p>
    </motion.div>
  )
}
