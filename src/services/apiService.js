// API Service for DevityClub Admin Dashboard
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
                    console.error('Authentication failed:', data.error);
                    this.setToken(null);
                    throw new Error(data.error || 'Authentication failed');
                }
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Authentication methods
    async login(credentials) {
        console.log('ApiService: Attempting login with:', { 
            email: credentials.email, 
            username: credentials.username,
            password: '***' 
        });
        
        try {
            const response = await this.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            });

            console.log('ApiService: Login response received:', response);

            if (response.success && response.token) {
                console.log('ApiService: Setting token');
                this.setToken(response.token);
            }

            return response;
        } catch (error) {
            console.error('ApiService: Login error:', error);
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
        const queryString = new URLSearchParams(params).toString();
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
        return this.request('/memories', {
            method: 'DELETE',
            body: JSON.stringify({ ids }),
        });
    }

    // Events methods
    async getEvents(params = {}) {
        const queryString = new URLSearchParams(params).toString();
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
        const queryString = new URLSearchParams(params).toString();
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

    // Speakers methods
    async getSpeakers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
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

    // Utility methods
    async checkHealth() {
        return this.request('/health');
    }

    // Fallback to localStorage for development
    async fallbackToLocalStorage() {
        console.warn('API not available, using localStorage fallback');
        
        // Return mock data structure
        return {
            success: true,
            data: {
                clubMemories: JSON.parse(localStorage.getItem('devityclub_memories') || '[]'),
                events: JSON.parse(localStorage.getItem('devityclub_events') || '[]'),
                teamMembers: JSON.parse(localStorage.getItem('devityclub_team') || '[]'),
                speakers: JSON.parse(localStorage.getItem('devityclub_speakers') || '[]')
            }
        };
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