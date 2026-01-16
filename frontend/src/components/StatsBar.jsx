import { useStore } from '../store/useStore'
import { Card } from './ui/card'
import { motion } from 'framer-motion'
import { FileText, Tag, Network } from 'lucide-react'

export default function StatsBar() {
  const { stats } = useStore()

  const statItems = [
    {
      label: 'Total Items',
      value: stats.total_items,
      icon: FileText,
    },
    {
      label: 'Tags',
      value: stats.total_tags,
      icon: Tag,
    },
    {
      label: 'Connections',
      value: stats.total_connections,
      icon: Network,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statItems.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {stat.label}
                  </p>
                  <motion.p
                    className="text-3xl font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                  >
                    {stat.value}
                  </motion.p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}
