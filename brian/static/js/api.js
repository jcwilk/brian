/**
 * API Client for brian
 */

const API_BASE = '/api/v1';

class BrianAPI {
    /**
     * Make an API request
     */
    async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'API request failed');
            }

            // Handle 204 No Content
            if (response.status === 204) {
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // ========================================================================
    // Knowledge Items
    // ========================================================================

    async getItems(filters = {}) {
        const params = new URLSearchParams();
        
        if (filters.item_type) params.append('item_type', filters.item_type);
        if (filters.favorite_only) params.append('favorite_only', 'true');
        if (filters.limit) params.append('limit', filters.limit);
        if (filters.offset) params.append('offset', filters.offset);
        if (filters.sort_by) params.append('sort_by', filters.sort_by);
        if (filters.sort_order) params.append('sort_order', filters.sort_order);

        const query = params.toString() ? `?${params.toString()}` : '';
        return this.request(`/items${query}`);
    }

    async getItem(id) {
        return this.request(`/items/${id}`);
    }

    async createItem(data) {
        return this.request('/items', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateItem(id, data) {
        return this.request(`/items/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteItem(id) {
        return this.request(`/items/${id}`, {
            method: 'DELETE',
        });
    }

    async toggleFavorite(id) {
        return this.request(`/items/${id}/favorite`, {
            method: 'POST',
        });
    }

    async voteItem(id, direction) {
        return this.request(`/items/${id}/vote?direction=${direction}`, {
            method: 'POST',
        });
    }

    // ========================================================================
    // Search
    // ========================================================================

    async search(query, limit = 50) {
        const params = new URLSearchParams({ q: query, limit });
        return this.request(`/search?${params.toString()}`);
    }

    // ========================================================================
    // Timeline
    // ========================================================================

    async getTimeline(startDate, endDate) {
        const params = new URLSearchParams({
            start_date: startDate,
            end_date: endDate,
        });
        return this.request(`/timeline?${params.toString()}`);
    }

    // ========================================================================
    // Tags
    // ========================================================================

    async getTags() {
        return this.request('/tags');
    }

    async getPopularTags(limit = 20) {
        return this.request(`/tags/popular?limit=${limit}`);
    }

    // ========================================================================
    // Connections
    // ========================================================================

    async createConnection(data) {
        return this.request('/connections', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getItemConnections(itemId) {
        return this.request(`/connections/${itemId}`);
    }

    async getGraph() {
        return this.request('/graph');
    }

    async deleteConnection(id) {
        return this.request(`/connections/${id}`, {
            method: 'DELETE',
        });
    }

    // ========================================================================
    // Stats
    // ========================================================================

    async getStats() {
        return this.request('/stats');
    }
}

// Export singleton instance
const api = new BrianAPI();
