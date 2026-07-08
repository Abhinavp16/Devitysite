const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const request = async (endpoint) => {
  const response = await fetch(`${API_BASE_URL}/public${endpoint}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }

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
