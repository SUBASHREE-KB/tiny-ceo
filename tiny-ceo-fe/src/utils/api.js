import { API_BASE_URL } from '../config/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Set auth token to localStorage
export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

// Set user info to localStorage
export const setUserInfo = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Get user info from localStorage
export const getUserInfo = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Remove auth token and user info from localStorage
export const removeAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  register: async (email, password) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.token) {
      setAuthToken(response.token);
    }
    if (response.user) {
      setUserInfo(response.user);
    }
    return response;
  },

  login: async (email, password) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (response.token) {
      setAuthToken(response.token);
    }
    if (response.user) {
      setUserInfo(response.user);
    }
    return response;
  },

  logout: () => {
    removeAuthToken();
  },
};

// Workspace API calls
export const workspaceAPI = {
  getAll: async () => {
    return await apiRequest('/workspaces', {
      method: 'GET',
    });
  },

  getById: async (workspaceId) => {
    return await apiRequest(`/workspaces/${workspaceId}`, {
      method: 'GET',
    });
  },

  create: async (title, startupIdeaText) => {
    return await apiRequest('/workspaces', {
      method: 'POST',
      body: JSON.stringify({ title, startup_idea_text: startupIdeaText }),
    });
  },

  update: async (workspaceId, updates) => {
    return await apiRequest(`/workspaces/${workspaceId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};

// Conversation API calls
export const conversationAPI = {
  getMessages: async (workspaceId) => {
    return await apiRequest(`/workspaces/${workspaceId}/conversations`, {
      method: 'GET',
    });
  },

  sendMessage: async (workspaceId, message) => {
    return await apiRequest(`/workspaces/${workspaceId}/conversations/message`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },
};

// Agent API calls
export const agentAPI = {
  generateAll: async (workspaceId) => {
    return await apiRequest(`/workspaces/${workspaceId}/agents/generate`, {
      method: 'POST',
    });
  },

  regenerate: async (workspaceId, agentType) => {
    return await apiRequest(`/workspaces/${workspaceId}/agents/${agentType}/regenerate`, {
      method: 'POST',
    });
  },

  getOutputs: async (workspaceId) => {
    return await apiRequest(`/workspaces/${workspaceId}/agents`, {
      method: 'GET',
    });
  },
};
