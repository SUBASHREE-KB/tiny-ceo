/**
 * SmartMemory Service
 * Key-value store operations through Raindrop MCP SmartMemory
 */

const raindropService = require('./raindrop.service');
const { logger } = require('../utils/logger');
const { smartMemoryHelpers } = require('../../../raindrop-config/smart-memory-init');

class SmartMemoryService {
  /**
   * Set a value in SmartMemory
   */
  async set(key, value, ttl = null) {
    try {
      logger.info(`SmartMemory SET: ${key}`);

      const result = await raindropService.callTool('smartmemory-set', {
        key,
        value,
        ttl
      });

      return result;
    } catch (error) {
      logger.error(`SmartMemory SET failed: ${key}`, error);
      throw error;
    }
  }

  /**
   * Get a value from SmartMemory
   */
  async get(key) {
    try {
      logger.info(`SmartMemory GET: ${key}`);

      const result = await raindropService.callTool('smartmemory-get', {
        key
      });

      return result.value;
    } catch (error) {
      logger.error(`SmartMemory GET failed: ${key}`, error);
      return null;
    }
  }

  /**
   * Delete a value from SmartMemory
   */
  async delete(key) {
    try {
      logger.info(`SmartMemory DELETE: ${key}`);

      const result = await raindropService.callTool('smartmemory-delete', {
        key
      });

      return result;
    } catch (error) {
      logger.error(`SmartMemory DELETE failed: ${key}`, error);
      throw error;
    }
  }

  /**
   * Check if a key exists
   */
  async exists(key) {
    try {
      const value = await this.get(key);
      return value !== null;
    } catch (error) {
      return false;
    }
  }

  // User profile operations
  async getUserProfile(userId) {
    const key = smartMemoryHelpers.getUserProfileKey(userId);
    return await this.get(key);
  }

  async setUserProfile(userId, profile) {
    const key = smartMemoryHelpers.getUserProfileKey(userId);
    return await this.set(key, profile, null); // No expiration for profiles
  }

  async updateUserProfile(userId, updates) {
    const profile = await this.getUserProfile(userId) || {};
    const updatedProfile = { ...profile, ...updates };
    return await this.setUserProfile(userId, updatedProfile);
  }

  async deleteUserProfile(userId) {
    const key = smartMemoryHelpers.getUserProfileKey(userId);
    return await this.delete(key);
  }

  // Session operations
  async getSession(sessionId) {
    const key = smartMemoryHelpers.getSessionKey(sessionId);
    return await this.get(key);
  }

  async setSession(sessionId, sessionData) {
    const key = smartMemoryHelpers.getSessionKey(sessionId);
    const ttl = 86400; // 24 hours
    return await this.set(key, sessionData, ttl);
  }

  async updateSession(sessionId, updates) {
    const session = await this.getSession(sessionId) || {};
    const updatedSession = {
      ...session,
      ...updates,
      lastActivity: new Date().toISOString()
    };
    return await this.setSession(sessionId, updatedSession);
  }

  async deleteSession(sessionId) {
    const key = smartMemoryHelpers.getSessionKey(sessionId);
    return await this.delete(key);
  }

  // Agent context operations
  async getAgentContext(workspaceId, agentType) {
    const key = smartMemoryHelpers.getAgentContextKey(workspaceId, agentType);
    return await this.get(key);
  }

  async setAgentContext(workspaceId, agentType, context) {
    const key = smartMemoryHelpers.getAgentContextKey(workspaceId, agentType);
    const ttl = 3600; // 1 hour
    return await this.set(key, context, ttl);
  }

  async updateAgentContext(workspaceId, agentType, updates) {
    const context = await this.getAgentContext(workspaceId, agentType) || {
      workspaceId,
      agentType,
      conversationHistory: [],
      lastTopics: [],
      userPreferences: '',
      contextSummary: ''
    };

    const updatedContext = { ...context, ...updates };
    return await this.setAgentContext(workspaceId, agentType, updatedContext);
  }

  async deleteAgentContext(workspaceId, agentType) {
    const key = smartMemoryHelpers.getAgentContextKey(workspaceId, agentType);
    return await this.delete(key);
  }

  // Workspace cache operations
  async getWorkspaceCache(workspaceId) {
    const key = smartMemoryHelpers.getWorkspaceCacheKey(workspaceId);
    return await this.get(key);
  }

  async setWorkspaceCache(workspaceId, cacheData) {
    const key = smartMemoryHelpers.getWorkspaceCacheKey(workspaceId);
    const ttl = 1800; // 30 minutes
    return await this.set(key, cacheData, ttl);
  }

  async invalidateWorkspaceCache(workspaceId) {
    const key = smartMemoryHelpers.getWorkspaceCacheKey(workspaceId);
    return await this.delete(key);
  }

  // Bulk operations
  async setMultiple(items) {
    const promises = items.map(item => this.set(item.key, item.value, item.ttl));
    return await Promise.all(promises);
  }

  async getMultiple(keys) {
    const promises = keys.map(key => this.get(key));
    const values = await Promise.all(promises);

    return keys.reduce((acc, key, index) => {
      acc[key] = values[index];
      return acc;
    }, {});
  }
}

// Export singleton instance
const smartMemoryService = new SmartMemoryService();

module.exports = smartMemoryService;
