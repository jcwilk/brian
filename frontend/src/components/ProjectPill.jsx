import { useStore } from '../store/useStore'
import { 
  Globe,
  Folder,
  Database,
  Lightbulb,
  Rocket,
  BookOpen,
  Target,
  FlaskConical,
  Palette,
  Code,
  BarChart3,
  Brain,
  Heart,
  Star,
  Zap,
  Coffee,
  Music
} from 'lucide-react'

// Icon mapping for projects - uses Lucide icon names
const ICON_MAP = {
  'globe': Globe,
  'folder': Folder,
  'database': Database,
  'lightbulb': Lightbulb,
  'rocket': Rocket,
  'book': BookOpen,
  'target': Target,
  'flask': FlaskConical,
  'palette': Palette,
  'code': Code,
  'chart': BarChart3,
  'brain': Brain,
  'heart': Heart,
  'star': Star,
  'zap': Zap,
  'coffee': Coffee,
  'music': Music,
}

// Get icon component from icon name
const getIconComponent = (iconName) => {
  if (!iconName) return Folder
  const Icon = ICON_MAP[iconName.toLowerCase()]
  if (Icon) return Icon
  return Folder
}

// Check if icon is a Lucide icon (not emoji)
const isLucideIcon = (iconName) => {
  if (!iconName) return false
  return ICON_MAP.hasOwnProperty(iconName.toLowerCase())
}

/**
 * ProjectPill - A small pill/badge showing the project a knowledge item belongs to
 * 
 * @param {string} projectId - The project ID to display
 * @param {string} size - 'sm' | 'md' (default: 'sm')
 * @param {boolean} showIcon - Whether to show the project icon (default: true)
 * @param {function} onClick - Optional click handler (e.g., to filter by project)
 * @param {string} className - Additional CSS classes
 */
export function ProjectPill({ 
  projectId, 
  size = 'sm', 
  showIcon = true, 
  onClick,
  className = ''
}) {
  const { projects, currentProject, switchProject } = useStore()
  
  // Find the project
  const project = projects.find(p => p.id === projectId)
  
  // Don't render if project not found or if viewing single project and it's the current one
  if (!project) return null
  
  // Size classes
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-xs px-2 py-1 gap-1.5'
  }
  
  const iconSizeClasses = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3'
  }
  
  const handleClick = (e) => {
    e.stopPropagation()
    if (onClick) {
      onClick(project)
    } else {
      // Default: switch to this project
      switchProject(projectId)
    }
  }
  
  // Render icon
  const renderIcon = () => {
    if (!showIcon || !project.icon) return null
    
    if (isLucideIcon(project.icon)) {
      const IconComponent = getIconComponent(project.icon)
      return <IconComponent className={iconSizeClasses[size]} />
    }
    
    // Fallback to emoji
    return <span className="leading-none">{project.icon}</span>
  }
  
  // Truncate project name
  const truncatedName = project.name.length > 12 
    ? project.name.substring(0, 12) + '…' 
    : project.name
  
  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center rounded-full font-medium
        transition-all hover:scale-105 hover:shadow-sm
        ${sizeClasses[size]}
        ${className}
      `}
      style={{
        backgroundColor: `${project.color}20`,
        color: project.color,
        border: `1px solid ${project.color}40`
      }}
      title={`${project.name} • ${project.item_count || 0} items`}
    >
      {renderIcon()}
      <span className="truncate max-w-[80px]">{truncatedName}</span>
    </button>
  )
}

export default ProjectPill
