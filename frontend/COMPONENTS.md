# Component Reference

## Available UI Components

### Button
```jsx
import { Button } from '@/components/ui/button'

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>
```

### Card
```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

### Input
```jsx
import { Input } from '@/components/ui/input'

<Input type="text" placeholder="Enter text..." />
<Input type="search" placeholder="Search..." />
<Input type="email" placeholder="Email..." />
```

### Badge
```jsx
import { Badge } from '@/components/ui/badge'

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

## Creating New Components

### Example: KnowledgeCard Component

Create `src/components/KnowledgeCard.jsx`:

```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function KnowledgeCard({ item, onFavorite, onEdit, onDelete }) {
  const getTypeIcon = (type) => {
    const icons = {
      link: '🔗',
      note: '📝',
      code: '💻',
      paper: '📄'
    }
    return icons[type] || '📌'
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getTypeIcon(item.type)}</span>
            <div>
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <CardDescription className="text-xs mt-1">
                {item.created}
              </CardDescription>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onFavorite(item.id)}
            >
              {item.favorite ? '⭐' : '☆'}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(item.id)}
            >
              ✏️
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(item.id)}
            >
              🗑️
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          {item.description}
        </p>
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline break-all"
          >
            {item.url}
          </a>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        {item.tags.map((tag, index) => (
          <Badge key={index} variant="secondary">
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  )
}
```

Then use it in your App:

```jsx
import { KnowledgeCard } from '@/components/KnowledgeCard'

// In your component
{filteredItems.map((item) => (
  <KnowledgeCard
    key={item.id}
    item={item}
    onFavorite={toggleFavorite}
    onEdit={handleEdit}
    onDelete={handleDelete}
  />
))}
```

## Styling Tips

### Using Tailwind Classes
```jsx
// Spacing
<div className="p-4">Padding all sides</div>
<div className="px-4 py-2">Padding x and y</div>
<div className="space-y-4">Vertical spacing between children</div>

// Layout
<div className="flex items-center justify-between">Flexbox</div>
<div className="grid grid-cols-3 gap-4">Grid</div>

// Colors (monochrome theme)
<div className="bg-background text-foreground">Default</div>
<div className="bg-muted text-muted-foreground">Muted</div>
<div className="bg-primary text-primary-foreground">Primary</div>

// Borders
<div className="border border-border rounded-lg">Bordered</div>

// Hover states
<div className="hover:bg-accent hover:text-accent-foreground">Hover</div>

// Transitions
<div className="transition-all duration-200">Smooth transition</div>
```

### Using the cn() utility
```jsx
import { cn } from '@/lib/utils'

// Combine classes conditionally
<div className={cn(
  "base-class",
  isActive && "active-class",
  isPrimary ? "primary-class" : "secondary-class"
)}>
  Content
</div>
```

## Common Patterns

### Loading State
```jsx
{isLoading ? (
  <div className="text-center py-12 text-muted-foreground">
    Loading...
  </div>
) : (
  <div>Content</div>
)}
```

### Empty State
```jsx
{items.length === 0 && (
  <div className="text-center py-12 text-muted-foreground">
    <p className="text-lg">No items found</p>
    <p className="text-sm mt-2">Try adding some knowledge</p>
  </div>
)}
```

### Error State
```jsx
{error && (
  <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
    {error.message}
  </div>
)}
```
