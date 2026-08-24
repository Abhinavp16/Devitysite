const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const request = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}/public${endpoint}`);

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const errData = await response.json();
      message = errData.error || message;
    } catch (_) { /* non-JSON error body */ }
    throw new Error(message);
  }

  const data = await response.json();
  return data.data || [];
};

const publicApiService = {
  getMemories: () => request('/memories'),
  getEvents: () => request('/events'),
  getTeamMembers: () => request('/team'),
  getSpeakers: () => request('/speakers'),
  getReviews: () => request('/reviews')
};

export default publicApiService;
