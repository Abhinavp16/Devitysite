// API Service for DevityClub Admin Dashboard
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('adminToken');
    }

    // Refresh token from localStorage
    refreshToken() {
        this.token = localStorage.getItem('adminToken');
    }

    // Set authentication token
    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('adminToken', token);
        } else {
            localStorage.removeItem('adminToken');
        }
    }

    // Get authentication headers
    getHeaders() {
        // Always refresh token from localStorage before making requests
        this.refreshToken();
        
        const headers = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                // Handle authentication errors specifically
                if (response.status === 401 || response.status === 403) {
                    this.setToken(null);
                    throw new Error(data.error || 'Authentication failed');
                }
                throw new Error(data.details || data.error || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            // Only log unexpected errors, not authentication rejections
            if (!(error.message === 'Authentication failed' || error.message?.includes('HTTP error'))) {
                console.error('API request failed:', error.message);
            }
            throw error;
        }
    }

    // Authentication methods
    async login(credentials) {
        try {
            const response = await this.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            });

            if (response.success && response.token) {
                this.setToken(response.token);
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    async logout() {
        try {
            await this.request('/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.setToken(null);
        }
    }

    async verifyToken() {
        return this.request('/auth/verify');
    }

    // Dashboard methods
    async getDashboardStats() {
        return this.request('/dashboard/stats');
    }

    async getActivities(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/dashboard/activities${queryString ? `?${queryString}` : ''}`);
    }

    async exportData() {
        return this.request('/dashboard/export');
    }

    // Club Memories methods
    async getMemories(params = {}) {
        const queryString = new URLSearchParams({ limit: 1000, ...params }).toString();
        return this.request(`/memories${queryString ? `?${queryString}` : ''}`);
    }

    async getMemory(id) {
        return this.request(`/memories/${id}`);
    }

    async createMemory(memoryData) {
        return this.request('/memories', {
            method: 'POST',
            body: JSON.stringify(memoryData),
        });
    }

    async updateMemory(id, memoryData) {
        return this.request(`/memories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(memoryData),
        });
    }

    async deleteMemory(id) {
        return this.request(`/memories/${id}`, {
            method: 'DELETE',
        });
    }

    async bulkDeleteMemories(ids) {
        return this.request('/memories/bulk-delete', {
            method: 'POST',
            body: JSON.stringify({ ids }),
        });
    }

    // Events methods
    async getEvents(params = {}) {
        const queryString = new URLSearchParams({ limit: 1000, ...params }).toString();
        return this.request(`/events${queryString ? `?${queryString}` : ''}`);
    }

    async getEvent(id) {
        return this.request(`/events/${id}`);
    }

    async createEvent(eventData) {
        return this.request('/events', {
            method: 'POST',
            body: JSON.stringify(eventData),
        });
    }

    async updateEvent(id, eventData) {
        return this.request(`/events/${id}`, {
            method: 'PUT',
            body: JSON.stringify(eventData),
        });
    }

    async deleteEvent(id) {
        return this.request(`/events/${id}`, {
            method: 'DELETE',
        });
    }

    async reorderEvent(id, direction) {
        return this.request(`/events/${id}/reorder`, {
            method: 'PATCH',
            body: JSON.stringify({ direction }),
        });
    }

    async addSpeakerToEvent(eventId, speakerId, role = 'speaker') {
        return this.request(`/events/${eventId}/speakers`, {
            method: 'POST',
            body: JSON.stringify({ speaker_id: speakerId, role }),
        });
    }

    async removeSpeakerFromEvent(eventId, speakerId) {
        return this.request(`/events/${eventId}/speakers/${speakerId}`, {
            method: 'DELETE',
        });
    }

    // Team methods
    async getTeamMembers(params = {}) {
        const queryString = new URLSearchParams({ limit: 1000, ...params }).toString();
        return this.request(`/team${queryString ? `?${queryString}` : ''}`);
    }

    async getTeamMember(id) {
        return this.request(`/team/${id}`);
    }

    async createTeamMember(memberData) {
        return this.request('/team', {
            method: 'POST',
            body: JSON.stringify(memberData),
        });
    }

    async updateTeamMember(id, memberData) {
        return this.request(`/team/${id}`, {
            method: 'PUT',
            body: JSON.stringify(memberData),
        });
    }

    async deleteTeamMember(id) {
        return this.request(`/team/${id}`, {
            method: 'DELETE',
        });
    }

    async toggleTeamMemberStatus(id) {
        return this.request(`/team/${id}/toggle-status`, {
            method: 'PATCH',
        });
    }

    async reorderTeamMember(id, direction) {
        return this.request(`/team/${id}/reorder`, {
            method: 'PATCH',
            body: JSON.stringify({ direction }),
        });
    }

    // Speakers methods
    async getSpeakers(params = {}) {
        const queryString = new URLSearchParams({ limit: 1000, ...params }).toString();
        return this.request(`/speakers${queryString ? `?${queryString}` : ''}`);
    }

    async getSpeaker(id) {
        return this.request(`/speakers/${id}`);
    }

    async createSpeaker(speakerData) {
        return this.request('/speakers', {
            method: 'POST',
            body: JSON.stringify(speakerData),
        });
    }

    async updateSpeaker(id, speakerData) {
        return this.request(`/speakers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(speakerData),
        });
    }

    async deleteSpeaker(id) {
        return this.request(`/speakers/${id}`, {
            method: 'DELETE',
        });
    }

    async toggleSpeakerAvailability(id) {
        return this.request(`/speakers/${id}/toggle-availability`, {
            method: 'PATCH',
        });
    }

    async reorderSpeaker(id, direction) {
        return this.request(`/speakers/${id}/reorder`, {
            method: 'PATCH',
            body: JSON.stringify({ direction }),
        });
    }

    // Speaker Reviews methods
    async getReviews(params = {}) {
        const queryString = new URLSearchParams({ limit: 100, ...params }).toString();
        return this.request(`/reviews${queryString ? `?${queryString}` : ''}`);
    }

    async createReview(reviewData) {
        return this.request('/reviews', {
            method: 'POST',
            body: JSON.stringify(reviewData),
        });
    }

    async updateReview(id, reviewData) {
        return this.request(`/reviews/${id}`, {
            method: 'PUT',
            body: JSON.stringify(reviewData),
        });
    }

    async deleteReview(id) {
        return this.request(`/reviews/${id}`, {
            method: 'DELETE',
        });
    }

    async toggleReviewStatus(id) {
        return this.request(`/reviews/${id}/toggle-status`, {
            method: 'PATCH',
        });
    }

    // Utility methods
    async checkHealth() {
        return this.request('/health');
    }

    // Check if API is available
    async isApiAvailable() {
        try {
            await this.checkHealth();
            return true;
        } catch (error) {
            console.warn('API not available:', error.message);
            return false;
        }
    }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
