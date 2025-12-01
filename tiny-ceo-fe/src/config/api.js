// API Configuration
export const API_BASE_URL = 'http://localhost:3001';

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',

  // Workspaces
  WORKSPACES: '/workspaces',
  WORKSPACE_BY_ID: (id) => `/workspaces/${id}`,

  // Conversations
  CONVERSATIONS: (workspaceId) => `/workspaces/${workspaceId}/conversations`,
  SEND_MESSAGE: (workspaceId) => `/workspaces/${workspaceId}/conversations/message`,

  // Agents
  GENERATE_AGENTS: (workspaceId) => `/workspaces/${workspaceId}/agents/generate`,
  REGENERATE_AGENT: (workspaceId, agentType) => `/workspaces/${workspaceId}/agents/${agentType}/regenerate`,
  AGENT_OUTPUTS: (workspaceId) => `/workspaces/${workspaceId}/agents`,
};
