import { motion } from 'framer-motion'
import { Network } from 'lucide-react'

export default function GraphView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Network className="h-20 w-20 text-muted-foreground mb-6" />
      </motion.div>
      <h2 className="text-3xl font-bold mb-2">Knowledge Graph</h2>
      <p className="text-muted-foreground text-center max-w-md">
        Explore connections between your knowledge items. An interactive network visualization showing how your ideas relate.
      </p>
      <p className="text-sm text-muted-foreground mt-4">Coming soon...</p>
    </motion.div>
  )
}
