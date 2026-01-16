# API Integration Guide

## Connecting Frontend to Backend

### 1. Create API Client

Create `src/lib/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8000/api'

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`)
      }
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Knowledge Items
  async getItems(params = {}) {
    const query = new URLSearchParams(params).toString()
    return this.request(`/items${query ? `?${query}` : ''}`)
  }

  async getItem(id) {
    return this.request(`/items/${id}`)
  }

  async createItem(data) {
    return this.request('/items', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateItem(id, data) {
    return this.request(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteItem(id) {
    return this.request(`/items/${id}`, {
      method: 'DELETE',
    })
  }

  async toggleFavorite(id) {
    return this.request(`/items/${id}/favorite`, {
      method: 'POST',
    })
  }

  // Search
  async search(query) {
    return this.request(`/search?q=${encodeURIComponent(query)}`)
  }

  // Tags
  async getTags() {
    return this.request('/tags')
  }

  async getItemsByTag(tag) {
    return this.request(`/tags/${encodeURIComponent(tag)}/items`)
  }
}

export const api = new ApiClient()
```

### 2. Update App.jsx to Use API

Replace the mock data section with:

```jsx
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

function App() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Load items on mount
  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getItems()
      setItems(data)
    } catch (err) {
      setError(err)
      console.error('Failed to load items:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async (id) => {
    try {
      await api.toggleFavorite(id)
      // Optimistically update UI
      setItems(items.map(item => 
        item.id === id ? { ...item, favorite: !item.favorite } : item
      ))
    } catch (err) {
      console.error('Failed to toggle favorite:', err)
      // Optionally: show error toast
    }
  }

  const handleSearch = async (query) => {
    setSearchQuery(query)
    if (!query.trim()) {
      loadItems()
      return
    }
    
    try {
      setLoading(true)
      const results = await api.search(query)
      setItems(results)
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      setLoading(false)
    }
  }

  // Rest of your component...
}
```

### 3. Create a Custom Hook for Data Fetching

Create `src/hooks/useKnowledge.js`:

```javascript
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export function useKnowledge() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getItems()
      setItems(data)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const createItem = async (data) => {
    try {
      const newItem = await api.createItem(data)
      setItems([newItem, ...items])
      return newItem
    } catch (err) {
      console.error('Failed to create item:', err)
      throw err
    }
  }

  const updateItem = async (id, data) => {
    try {
      const updated = await api.updateItem(id, data)
      setItems(items.map(item => item.id === id ? updated : item))
      return updated
    } catch (err) {
      console.error('Failed to update item:', err)
      throw err
    }
  }

  const deleteItem = async (id) => {
    try {
      await api.deleteItem(id)
      setItems(items.filter(item => item.id !== id))
    } catch (err) {
      console.error('Failed to delete item:', err)
      throw err
    }
  }

  const toggleFavorite = async (id) => {
    try {
      await api.toggleFavorite(id)
      setItems(items.map(item => 
        item.id === id ? { ...item, favorite: !item.favorite } : item
      ))
    } catch (err) {
      console.error('Failed to toggle favorite:', err)
      throw err
    }
  }

  return {
    items,
    loading,
    error,
    loadItems,
    createItem,
    updateItem,
    deleteItem,
    toggleFavorite,
  }
}
```

Then use it in your App:

```jsx
import { useKnowledge } from '@/hooks/useKnowledge'

function App() {
  const { items, loading, error, toggleFavorite, deleteItem } = useKnowledge()
  
  // Your component logic...
}
```

### 4. Environment Variables

Create `.env` file in frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Update `src/lib/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
```

### 5. CORS Configuration

Make sure your FastAPI backend has CORS enabled:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 6. Error Handling

Create `src/components/ErrorBoundary.jsx`:

```jsx
import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

Wrap your app in `src/main.jsx`:

```jsx
import { ErrorBoundary } from './components/ErrorBoundary'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
```

## Testing API Integration

1. Start your backend server
2. Start the frontend dev server
3. Check browser console for API calls
4. Use browser DevTools Network tab to inspect requests/responses

## Next Steps

- Add loading skeletons for better UX
- Implement optimistic updates
- Add toast notifications for actions
- Handle offline state
- Add retry logic for failed requests
