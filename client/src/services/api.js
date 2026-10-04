const rawApiUrl = import.meta.env.VITE_API_URL;
const API_BASE = rawApiUrl
  ? (rawApiUrl.startsWith('http') ? `${rawApiUrl}/api` : `https://${rawApiUrl}/api`)
  : '/api';

async function fetchAPI(endpoint, options = {}) {
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
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please ensure the backend is running.');
    }
    throw error;
  }
}

// Demo endpoints
export const demoAPI = {
  start: (scenarioId = 'mohali') => fetchAPI('/demo/start', { method: 'POST', body: JSON.stringify({ scenarioId }) }),
  status: () => fetchAPI('/demo/status'),
  scenarios: () => fetchAPI('/demo/scenarios'),
  reset: () => fetchAPI('/demo/reset', { method: 'POST' }),
};

// Incident endpoints
export const incidentAPI = {
  list: () => fetchAPI('/incidents'),
  get: (id) => fetchAPI(`/incidents/${id}`),
  timeline: (id) => fetchAPI(`/incidents/${id}/timeline`),
};

// User endpoints
export const userAPI = {
  get: () => fetchAPI('/user'),
  update: (data) => fetchAPI('/user', { method: 'PUT', body: JSON.stringify(data) }),
};

// AI endpoints
export const aiAPI = {
  query: (question) => fetchAPI('/ai/query', { method: 'POST', body: JSON.stringify({ question }) }),
};

// Map endpoints
export const mapAPI = {
  incidents: () => fetchAPI('/map/incidents'),
  userLocations: () => fetchAPI('/map/user-locations'),
};

// Community Report endpoints
export const reportAPI = {
  list: () => fetchAPI('/reports'),
  submit: (data) => fetchAPI('/reports', { method: 'POST', body: JSON.stringify(data) }),
};

// Health check
export const healthAPI = {
  check: () => fetchAPI('/health'),
};
