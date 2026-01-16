/**
 * Main application logic for brian
 */

// ============================================================================
// Application State
// ============================================================================

let currentEditingItemId = null;

// ============================================================================
// Initialization
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🧠 brian is loading...');
    
    // Initialize views
    await loadStats();
    await viewManager.renderFeed();
    
    // Set up event listeners
    setupEventListeners();
    
    console.log('🧠 brian is ready!');
});

// ============================================================================
// Event Listeners Setup
// ============================================================================

function setupEventListeners() {
    // View switcher
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchView(btn.dataset.view);
        });
    });

    // Add item button
    document.getElementById('addItemBtn').addEventListener('click', () => {
        openAddItemModal();
    });

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal();
        });
    });

    // Click outside modal to close
    document.getElementById('itemModal').addEventListener('click', (e) => {
        if (e.target.id === 'itemModal') {
            closeModal();
        }
    });

    // Item form submission
    document.getElementById('itemForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveItem();
    });

    // Type selector buttons
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('itemType').value = btn.dataset.type;
            updateFormForType(btn.dataset.type);
        });
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            viewManager.currentFilters.item_type = type === 'all' ? null : type;
            viewManager.renderFeed();
        });
    });

    // Sort dropdown
    document.getElementById('sortBy').addEventListener('change', (e) => {
        viewManager.currentFilters.sort_by = e.target.value;
        viewManager.renderFeed();
    });

    // Favorites only checkbox
    document.getElementById('favoritesOnly').addEventListener('change', (e) => {
        viewManager.currentFilters.favorite_only = e.target.checked;
        viewManager.renderFeed();
    });

    // Search input
    let searchTimeout;
    document.getElementById('searchInput').addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value);
        }, 300);
    });

    // Timeline navigation
    document.getElementById('timelineBack').addEventListener('click', () => {
        viewManager.navigateTimeline('back');
    });

    document.getElementById('timelineForward').addEventListener('click', () => {
        viewManager.navigateTimeline('forward');
    });

    // Graph controls
    document.getElementById('resetZoom').addEventListener('click', () => {
        viewManager.renderGraph();
    });
}

// ============================================================================
// View Management
// ============================================================================

function switchView(viewName) {
    // Update buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    // Update views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(`${viewName}View`).classList.add('active');

    // Show/hide filters
    document.getElementById('feedFilters').style.display = 
        viewName === 'feed' ? 'flex' : 'none';

    // Render appropriate view
    viewManager.currentView = viewName;
    
    switch (viewName) {
        case 'feed':
            viewManager.renderFeed();
            break;
        case 'timeline':
            viewManager.renderTimeline();
            break;
        case 'graph':
            viewManager.renderGraph();
            break;
    }
}

// ============================================================================
// Modal Management
// ============================================================================

function openAddItemModal() {
    currentEditingItemId = null;
    document.getElementById('modalTitle').textContent = 'Add Knowledge';
    document.getElementById('itemForm').reset();
    document.getElementById('itemId').value = '';
    
    // Set default type
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.type-btn[data-type="link"]').classList.add('active');
    document.getElementById('itemType').value = 'link';
    updateFormForType('link');
    
    document.getElementById('itemModal').classList.add('active');
}

async function editItem(itemId) {
    currentEditingItemId = itemId;
    
    try {
        const item = await api.getItem(itemId);
        
        document.getElementById('modalTitle').textContent = 'Edit Knowledge';
        document.getElementById('itemId').value = item.id;
        document.getElementById('itemTitle').value = item.title;
        document.getElementById('itemContent').value = item.content;
        document.getElementById('itemUrl').value = item.url || '';
        document.getElementById('itemLanguage').value = item.language || '';
        document.getElementById('itemTags').value = item.tags ? item.tags.join(', ') : '';
        
        // Set type
        document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`.type-btn[data-type="${item.item_type}"]`).classList.add('active');
        document.getElementById('itemType').value = item.item_type;
        updateFormForType(item.item_type);
        
        document.getElementById('itemModal').classList.add('active');
    } catch (error) {
        alert('Failed to load item for editing: ' + error.message);
    }
}

// Make editItem globally accessible
window.editItem = editItem;

function closeModal() {
    document.getElementById('itemModal').classList.remove('active');
    currentEditingItemId = null;
}

function updateFormForType(type) {
    const urlGroup = document.getElementById('urlGroup');
    const languageGroup = document.getElementById('languageGroup');
    
    // Show/hide fields based on type
    urlGroup.style.display = (type === 'link' || type === 'paper') ? 'block' : 'none';
    languageGroup.style.display = (type === 'snippet') ? 'block' : 'none';
}

// ============================================================================
// Item Management
// ============================================================================

async function saveItem() {
    const itemData = {
        title: document.getElementById('itemTitle').value,
        content: document.getElementById('itemContent').value,
        item_type: document.getElementById('itemType').value,
        url: document.getElementById('itemUrl').value || null,
        language: document.getElementById('itemLanguage').value || null,
        tags: document.getElementById('itemTags').value
            .split(',')
            .map(t => t.trim())
            .filter(t => t.length > 0),
    };

    try {
        if (currentEditingItemId) {
            await api.updateItem(currentEditingItemId, itemData);
        } else {
            await api.createItem(itemData);
        }
        
        closeModal();
        await loadStats();
        
        // Refresh current view
        if (viewManager.currentView === 'feed') {
            await viewManager.renderFeed();
        }
        
        // Show success message
        showNotification('Item saved successfully!', 'success');
    } catch (error) {
        alert('Failed to save item: ' + error.message);
    }
}

// ============================================================================
// Search
// ============================================================================

async function performSearch(query) {
    if (!query || query.length < 2) {
        // If search is empty, show all items
        viewManager.renderFeed();
        return;
    }

    const container = document.getElementById('itemsGrid');
    container.innerHTML = '<div class="loading">Searching</div>';

    try {
        const items = await api.search(query);
        
        if (items.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                    <p style="font-size: 1.2rem; color: var(--text-secondary);">
                        No results found for "${query}"
                    </p>
                </div>
            `;
            return;
        }

        container.innerHTML = items.map(item => viewManager.renderItemCard(item)).join('');
        viewManager.attachItemCardListeners();
    } catch (error) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--danger);">
                Search error: ${error.message}
            </div>
        `;
    }
}

// ============================================================================
// Stats
// ============================================================================

async function loadStats() {
    try {
        const stats = await api.getStats();
        
        document.getElementById('totalItems').textContent = stats.total_items;
        document.getElementById('totalTags').textContent = stats.total_tags;
        document.getElementById('totalConnections').textContent = stats.total_connections;
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

// ============================================================================
// Notifications
// ============================================================================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--success)' : 'var(--primary)'};
        color: white;
        border-radius: var(--radius-md);
        box-shadow: 0 4px 6px var(--shadow);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================================================
// Keyboard Shortcuts
// ============================================================================

document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + K - Focus search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
    
    // Cmd/Ctrl + N - New item
    if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        openAddItemModal();
    }
    
    // Escape - Close modal
    if (e.key === 'Escape') {
        closeModal();
    }
});

console.log('🧠 brian keyboard shortcuts:');
console.log('  Cmd/Ctrl + K: Focus search');
console.log('  Cmd/Ctrl + N: Add new item');
console.log('  Escape: Close modal');
