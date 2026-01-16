/**
 * View rendering logic for brian
 */

class ViewManager {
    constructor() {
        this.currentView = 'feed';
        this.currentFilters = {
            item_type: null,
            favorite_only: false,
            sort_by: 'created_at',
            sort_order: 'DESC',
        };
        this.currentTimelineDate = new Date();
    }

    // ========================================================================
    // Feed View
    // ========================================================================

    async renderFeed() {
        const container = document.getElementById('itemsGrid');
        container.innerHTML = '<div class="loading">Loading your knowledge</div>';

        try {
            const items = await api.getItems(this.currentFilters);
            
            if (items.length === 0) {
                container.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                        <p style="font-size: 1.2rem; color: var(--text-secondary);">
                            No items yet. Start building your knowledge base!
                        </p>
                    </div>
                `;
                return;
            }

            container.innerHTML = items.map(item => this.renderItemCard(item)).join('');
            
            // Attach event listeners
            this.attachItemCardListeners();
        } catch (error) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--danger);">
                    Error loading items: ${error.message}
                </div>
            `;
        }
    }

    renderItemCard(item) {
        const typeEmoji = {
            link: '🔗',
            note: '📝',
            snippet: '💻',
            paper: '📄',
        };

        const createdDate = new Date(item.created_at).toLocaleDateString();
        const contentPreview = this.stripMarkdown(item.content).substring(0, 200);
        
        return `
            <div class="item-card" data-id="${item.id}">
                <div class="item-header">
                    <span class="item-type">${typeEmoji[item.item_type] || '📌'}</span>
                    <div class="item-actions">
                        <button class="item-action-btn favorite-btn ${item.favorite ? 'active' : ''}" 
                                data-id="${item.id}" title="Favorite">
                            <i class="fas fa-star"></i>
                        </button>
                        <button class="item-action-btn edit-btn" 
                                data-id="${item.id}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="item-action-btn delete-btn" 
                                data-id="${item.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <h3 class="item-title">${this.escapeHtml(item.title)}</h3>
                
                ${item.url ? `<a href="${item.url}" class="item-url" target="_blank" onclick="event.stopPropagation()">${item.url}</a>` : ''}
                
                <div class="item-content">
                    ${this.escapeHtml(contentPreview)}${contentPreview.length >= 200 ? '...' : ''}
                </div>
                
                ${item.tags && item.tags.length > 0 ? `
                    <div class="item-tags">
                        ${item.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}
                    </div>
                ` : ''}
                
                <div class="item-footer">
                    <div class="item-votes">
                        <button class="vote-btn" data-id="${item.id}" data-direction="up">
                            <i class="fas fa-arrow-up"></i>
                        </button>
                        <span>${item.vote_count || 0}</span>
                        <button class="vote-btn" data-id="${item.id}" data-direction="down">
                            <i class="fas fa-arrow-down"></i>
                        </button>
                    </div>
                    <span>${createdDate}</span>
                </div>
            </div>
        `;
    }

    attachItemCardListeners() {
        // Card click - view details
        document.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button') && !e.target.closest('a')) {
                    const id = card.dataset.id;
                    this.showItemDetails(id);
                }
            });
        });

        // Favorite buttons
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                try {
                    await api.toggleFavorite(id);
                    btn.classList.toggle('active');
                } catch (error) {
                    alert('Failed to toggle favorite: ' + error.message);
                }
            });
        });

        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                window.editItem(id);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                if (confirm('Are you sure you want to delete this item?')) {
                    try {
                        await api.deleteItem(id);
                        this.renderFeed();
                    } catch (error) {
                        alert('Failed to delete item: ' + error.message);
                    }
                }
            });
        });

        // Vote buttons
        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                const direction = btn.dataset.direction;
                try {
                    await api.voteItem(id, direction);
                    this.renderFeed();
                } catch (error) {
                    alert('Failed to vote: ' + error.message);
                }
            });
        });
    }

    async showItemDetails(id) {
        try {
            const item = await api.getItem(id);
            const modal = document.getElementById('itemModal');
            
            // Render item in modal (read-only view)
            alert(`Item Details:\n\nTitle: ${item.title}\n\nContent: ${item.content}\n\nType: ${item.item_type}`);
            
            // TODO: Create a proper detail view modal
        } catch (error) {
            alert('Failed to load item: ' + error.message);
        }
    }

    // ========================================================================
    // Timeline View
    // ========================================================================

    async renderTimeline() {
        const container = document.getElementById('timelineContainer');
        container.innerHTML = '<div class="loading">Loading timeline</div>';

        try {
            // Get items for current month
            const startDate = new Date(this.currentTimelineDate.getFullYear(), this.currentTimelineDate.getMonth(), 1);
            const endDate = new Date(this.currentTimelineDate.getFullYear(), this.currentTimelineDate.getMonth() + 1, 0);
            
            const items = await api.getTimeline(startDate.toISOString(), endDate.toISOString());
            
            // Update date display
            const dateDisplay = document.getElementById('timelineDate');
            dateDisplay.textContent = this.currentTimelineDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
            });

            if (items.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 3rem;">
                        <p style="font-size: 1.2rem; color: var(--text-secondary);">
                            No items in this time period
                        </p>
                    </div>
                `;
                return;
            }

            // Group items by day
            const itemsByDay = {};
            items.forEach(item => {
                const day = new Date(item.created_at).toLocaleDateString();
                if (!itemsByDay[day]) {
                    itemsByDay[day] = [];
                }
                itemsByDay[day].push(item);
            });

            // Render timeline
            let html = '<div style="max-width: 800px; margin: 0 auto;">';
            Object.entries(itemsByDay).forEach(([day, dayItems]) => {
                html += `
                    <div style="margin-bottom: 2rem;">
                        <h3 style="color: var(--primary); margin-bottom: 1rem; padding-left: 2rem; position: relative;">
                            <span style="position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 12px; height: 12px; background: var(--primary); border-radius: 50%;"></span>
                            ${day}
                        </h3>
                        <div style="padding-left: 2rem; border-left: 2px solid var(--border);">
                            ${dayItems.map(item => `
                                <div style="background: var(--bg-secondary); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; cursor: pointer;" onclick="viewManager.showItemDetails('${item.id}')">
                                    <strong>${this.escapeHtml(item.title)}</strong>
                                    <div style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem;">
                                        ${this.stripMarkdown(item.content).substring(0, 100)}...
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            });
            html += '</div>';

            container.innerHTML = html;
        } catch (error) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--danger);">
                    Error loading timeline: ${error.message}
                </div>
            `;
        }
    }

    navigateTimeline(direction) {
        const currentMonth = this.currentTimelineDate.getMonth();
        const currentYear = this.currentTimelineDate.getFullYear();
        
        if (direction === 'back') {
            this.currentTimelineDate = new Date(currentYear, currentMonth - 1, 1);
        } else {
            this.currentTimelineDate = new Date(currentYear, currentMonth + 1, 1);
        }
        
        this.renderTimeline();
    }

    // ========================================================================
    // Graph View
    // ========================================================================

    async renderGraph() {
        const container = document.getElementById('graphContainer');
        container.innerHTML = '<div class="loading">Loading knowledge graph</div>';

        try {
            const graphData = await api.getGraph();
            const items = await api.getItems({ limit: 500 });
            
            if (items.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 3rem;">
                        <p style="font-size: 1.2rem; color: var(--text-secondary);">
                            No items to visualize yet
                        </p>
                    </div>
                `;
                return;
            }

            this.renderD3Graph(container, items, graphData.connections);
        } catch (error) {
            container.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--danger);">
                    Error loading graph: ${error.message}
                </div>
            `;
        }
    }

    renderD3Graph(container, items, connections) {
        // Clear container
        container.innerHTML = '';

        const width = container.clientWidth;
        const height = 700;

        // Create SVG
        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // Create nodes from items
        const nodes = items.map(item => ({
            id: item.id,
            title: item.title,
            type: item.item_type,
        }));

        // Create links from connections
        const links = connections.map(conn => ({
            source: conn.source_item_id,
            target: conn.target_item_id,
            strength: conn.strength,
        }));

        // Create force simulation
        const simulation = d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2));

        // Draw links
        const link = svg.append('g')
            .selectAll('line')
            .data(links)
            .enter()
            .append('line')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', d => Math.sqrt(d.strength));

        // Draw nodes
        const node = svg.append('g')
            .selectAll('circle')
            .data(nodes)
            .enter()
            .append('circle')
            .attr('r', 8)
            .attr('fill', d => this.getNodeColor(d.type))
            .call(d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));

        // Add labels
        const labels = svg.append('g')
            .selectAll('text')
            .data(nodes)
            .enter()
            .append('text')
            .text(d => d.title.substring(0, 20))
            .attr('font-size', 10)
            .attr('dx', 12)
            .attr('dy', 4);

        // Add tooltips
        node.append('title')
            .text(d => d.title);

        // Update positions on tick
        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node
                .attr('cx', d => d.x)
                .attr('cy', d => d.y);

            labels
                .attr('x', d => d.x)
                .attr('y', d => d.y);
        });

        // Drag functions
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
    }

    getNodeColor(type) {
        const colors = {
            link: '#6366f1',
            note: '#10b981',
            snippet: '#f59e0b',
            paper: '#8b5cf6',
        };
        return colors[type] || '#6b7280';
    }

    // ========================================================================
    // Utility Methods
    // ========================================================================

    stripMarkdown(text) {
        return text
            .replace(/[#*_~`]/g, '')
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
            .trim();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Export singleton
const viewManager = new ViewManager();
