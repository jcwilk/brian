import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { Button } from './ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Link as LinkIcon, FileText, Code, File } from 'lucide-react'
import { toast } from 'sonner'

export default function ItemModal() {
  const { isModalOpen, modalMode, selectedItem, closeModal, createItem, updateItem } = useStore()
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    item_type: 'link',
    url: '',
    language: '',
    tags: '',
  })

  useEffect(() => {
    if (selectedItem && modalMode === 'edit') {
      setFormData({
        title: selectedItem.title || '',
        content: selectedItem.content || '',
        item_type: selectedItem.item_type || 'link',
        url: selectedItem.url || '',
        language: selectedItem.language || '',
        tags: selectedItem.tags ? selectedItem.tags.join(', ') : '',
      })
    } else {
      setFormData({
        title: '',
        content: '',
        item_type: 'link',
        url: '',
        language: '',
        tags: '',
      })
    }
  }, [selectedItem, modalMode, isModalOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const data = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0),
    }

    let success
    if (modalMode === 'edit' && selectedItem) {
      success = await updateItem(selectedItem.id, data)
    } else {
      success = await createItem(data)
    }

    if (success) {
      toast.success(modalMode === 'edit' ? 'Item updated!' : 'Item created!')
      closeModal()
    } else {
      toast.error('Failed to save item')
    }
  }

  const types = [
    { id: 'link', label: 'Link', icon: LinkIcon },
    { id: 'note', label: 'Note', icon: FileText },
    { id: 'snippet', label: 'Snippet', icon: Code },
    { id: 'paper', label: 'Paper', icon: File },
  ]

  return (
    <AnimatePresence>
      {isModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold">
                  {modalMode === 'edit' ? 'Edit Knowledge' : 'Add Knowledge'}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeModal}
                  className="rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Type Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <div className="grid grid-cols-4 gap-2">
                    {types.map((type) => {
                      const Icon = type.icon
                      const isActive = formData.item_type === type.id

                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, item_type: type.id })}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            isActive
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <Icon className="h-6 w-6 mx-auto mb-2" />
                          <span className="text-sm font-medium">{type.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Enter a descriptive title..."
                  />
                </div>

                {/* URL (for links and papers) */}
                {(formData.item_type === 'link' || formData.item_type === 'paper') && (
                  <div className="space-y-2">
                    <label htmlFor="url" className="text-sm font-medium">
                      URL
                    </label>
                    <input
                      id="url"
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="https://..."
                    />
                  </div>
                )}

                {/* Language (for snippets) */}
                {formData.item_type === 'snippet' && (
                  <div className="space-y-2">
                    <label htmlFor="language" className="text-sm font-medium">
                      Language
                    </label>
                    <select
                      id="language"
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select language...</option>
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="csharp">C#</option>
                      <option value="cpp">C++</option>
                      <option value="go">Go</option>
                      <option value="rust">Rust</option>
                      <option value="sql">SQL</option>
                      <option value="html">HTML</option>
                      <option value="css">CSS</option>
                    </select>
                  </div>
                )}

                {/* Content */}
                <div className="space-y-2">
                  <label htmlFor="content" className="text-sm font-medium">
                    Content * <span className="text-muted-foreground">(Markdown supported)</span>
                  </label>
                  <textarea
                    id="content"
                    required
                    rows={10}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                    placeholder="Write your content here... Markdown is supported!"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <label htmlFor="tags" className="text-sm font-medium">
                    Tags <span className="text-muted-foreground">(comma-separated)</span>
                  </label>
                  <input
                    id="tags"
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="e.g. programming, tutorial, important"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {modalMode === 'edit' ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
