/**
 * Tiny CEO - SmartMemory Initialization
 * Sets up memory namespaces and default data for Raindrop MCP
 */

const smartMemoryConfig = {
  namespaces: {
    // User Profiles
    user_profiles: {
      description: 'User profile data including preferences and stats',
      ttl: null, // Never expire
      schema: {
        userId: 'number',
        name: 'string',
        email: 'string',
        preferences: {
          defaultIndustry: 'string',
          theme: 'string', // 'light' | 'dark'
          notifications: 'boolean',
          language: 'string'
        },
        stats: {
          workspacesCreated: 'number',
          analysesGenerated: 'number',
          chatMessages: 'number',
          filesExported: 'number'
        },
        onboarding: {
          completed: 'boolean',
          currentStep: 'number',
          skipped: 'boolean'
        }
      },
      example: {
        userId: 1,
        name: 'John Doe',
        email: 'john@example.com',
        preferences: {
          defaultIndustry: 'SaaS',
          theme: 'dark',
          notifications: true,
          language: 'en'
        },
        stats: {
          workspacesCreated: 12,
          analysesGenerated: 45,
          chatMessages: 234,
          filesExported: 8
        },
        onboarding: {
          completed: true,
          currentStep: 5,
          skipped: false
        }
      }
    },

    // User Preferences
    user_preferences: {
      description: 'Quick-access user preferences',
      ttl: null,
      schema: {
        userId: 'number',
        settings: 'object'
      },
      example: {
        userId: 1,
        settings: {
          emailNotifications: true,
          autoSave: true,
          showTutorials: false,
          defaultView: 'overview'
        }
      }
    },

    // Session Data
    session_data: {
      description: 'Active session information',
      ttl: 86400, // 24 hours
      schema: {
        sessionId: 'string',
        userId: 'number',
        currentWorkspaceId: 'number',
        agentContexts: 'object',
        lastActivity: 'timestamp',
        expiresAt: 'timestamp'
      },
      example: {
        sessionId: 'sess_abc123xyz',
        userId: 1,
        currentWorkspaceId: 456,
        agentContexts: {
          ceo: 'Last discussed market positioning and competitive advantages...',
          developer: 'Building REST API for user authentication...',
          finance: 'Analyzing pricing strategy for SaaS model...'
        },
        lastActivity: '2025-12-10T05:00:00Z',
        expiresAt: '2025-12-11T05:00:00Z'
      }
    },

    // Agent Contexts
    agent_contexts: {
      description: 'Conversation context for each agent per workspace',
      ttl: 3600, // 1 hour
      schema: {
        workspaceId: 'number',
        agentType: 'string',
        conversationHistory: 'array',
        lastTopics: 'array',
        userPreferences: 'string',
        contextSummary: 'string'
      },
      example: {
        workspaceId: 456,
        agentType: 'developer',
        conversationHistory: [
          {
            role: 'user',
            content: 'What tech stack do you recommend?',
            timestamp: '2025-12-10T05:00:00Z'
          },
          {
            role: 'assistant',
            content: 'For your SaaS app, I recommend React + Node.js + PostgreSQL...',
            timestamp: '2025-12-10T05:00:30Z'
          }
        ],
        lastTopics: ['tech stack', 'database design', 'API architecture'],
        userPreferences: 'Prefers detailed technical explanations with code examples',
        contextSummary: 'Building a SaaS task management app, discussed tech stack and architecture'
      }
    },

    // Workspace Cache
    workspace_cache: {
      description: 'Cached workspace data for quick access',
      ttl: 1800, // 30 minutes
      schema: {
        workspaceId: 'number',
        name: 'string',
        industry: 'string',
        status: 'string',
        lastUpdated: 'timestamp',
        quickStats: 'object'
      },
      example: {
        workspaceId: 456,
        name: 'AI Task Manager',
        industry: 'SaaS',
        status: 'completed',
        lastUpdated: '2025-12-10T05:00:00Z',
        quickStats: {
          analysesCompleted: 6,
          chatMessagesCount: 45,
          filesGenerated: 3
        }
      }
    }
  },

  // Key naming conventions
  keyPatterns: {
    user_profile: 'user_profile:{userId}',
    user_preferences: 'user_pref:{userId}',
    session: 'session:{sessionId}',
    agent_context: 'agent_ctx:{workspaceId}:{agentType}',
    workspace_cache: 'ws_cache:{workspaceId}'
  },

  // Default values for new users
  defaults: {
    newUserProfile: {
      preferences: {
        defaultIndustry: 'SaaS',
        theme: 'dark',
        notifications: true,
        language: 'en'
      },
      stats: {
        workspacesCreated: 0,
        analysesGenerated: 0,
        chatMessages: 0,
        filesExported: 0
      },
      onboarding: {
        completed: false,
        currentStep: 1,
        skipped: false
      }
    },

    newSession: (userId, sessionId) => ({
      sessionId,
      userId,
      currentWorkspaceId: null,
      agentContexts: {},
      lastActivity: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000).toISOString() // 24 hours
    })
  }
};

/**
 * Helper functions for SmartMemory operations
 */
const smartMemoryHelpers = {
  // Generate key for user profile
  getUserProfileKey: (userId) => `user_profile:${userId}`,

  // Generate key for session
  getSessionKey: (sessionId) => `session:${sessionId}`,

  // Generate key for agent context
  getAgentContextKey: (workspaceId, agentType) => `agent_ctx:${workspaceId}:${agentType}`,

  // Generate key for workspace cache
  getWorkspaceCacheKey: (workspaceId) => `ws_cache:${workspaceId}`,

  // Validate data against schema
  validateData: (namespace, data) => {
    const schema = smartMemoryConfig.namespaces[namespace]?.schema;
    if (!schema) {
      throw new Error(`Unknown namespace: ${namespace}`);
    }
    // Basic validation - in production, use a proper schema validator
    return true;
  }
};

module.exports = {
  smartMemoryConfig,
  smartMemoryHelpers
};
