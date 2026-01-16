import { create } from 'zustand'
import { api } from '../api/client'

export const useStore = create((set, get) => ({
  // Items state
  items: [],
  currentItem: null,
  loading: false,
  error: null,
  
  // Filters
  filters: {
    item_type: null,
    favorite_only: false,
    sort_by: 'created_at',
    sort_order: 'DESC',
  },
  
  // Stats
  stats: {
    total_items: 0,
    total_tags: 0,
    total_connections: 0,
    by_type: {},
    favorites: 0,
  },
  
  // UI state
  currentView: 'feed',
  isModalOpen: false,
  editingItemId: null,
  
  // Actions
  setView: (view) => set({ currentView: view }),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  
  openModal: (itemId = null) => set({
    isModalOpen: true,
    editingItemId: itemId,
  }),
  
  closeModal: () => set({
    isModalOpen: false,
    editingItemId: null,
  }),
  
  // Fetch items
  fetchItems: async () => {
    set({ loading: true, error: null })
    try {
      const items = await api.getItems(get().filters)
      set({ items, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  
  // Fetch single item
  fetchItem: async (id) => {
    set({ loading: true, error: null })
    try {
      const item = await api.getItem(id)
      set({ currentItem: item, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  
  // Create item
  createItem: async (data) => {
    set({ loading: true, error: null })
    try {
      await api.createItem(data)
      await get().fetchItems()
      await get().fetchStats()
      set({ loading: false })
      get().closeModal()
      return true
    } catch (error) {
      set({ error: error.message, loading: false })
      return false
    }
  },
  
  // Update item
  updateItem: async (id, data) => {
    set({ loading: true, error: null })
    try {
      await api.updateItem(id, data)
      await get().fetchItems()
      set({ loading: false })
      get().closeModal()
      return true
    } catch (error) {
      set({ error: error.message, loading: false })
      return false
    }
  },
  
  // Delete item
  deleteItem: async (id) => {
    set({ loading: true, error: null })
    try {
      await api.deleteItem(id)
      await get().fetchItems()
      await get().fetchStats()
      set({ loading: false })
      return true
    } catch (error) {
      set({ error: error.message, loading: false })
      return false
    }
  },
  
  // Toggle favorite
  toggleFavorite: async (id) => {
    try {
      await api.toggleFavorite(id)
      await get().fetchItems()
    } catch (error) {
      set({ error: error.message })
    }
  },
  
  // Vote
  voteItem: async (id, direction) => {
    try {
      await api.voteItem(id, direction)
      await get().fetchItems()
    } catch (error) {
      set({ error: error.message })
    }
  },
  
  // Search
  searchItems: async (query) => {
    set({ loading: true, error: null })
    try {
      const items = await api.search(query)
      set({ items, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  
  // Fetch stats
  fetchStats: async () => {
    try {
      const stats = await api.getStats()
      set({ stats })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  },
}))
