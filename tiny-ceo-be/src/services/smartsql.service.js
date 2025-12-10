/**
 * SmartSQL Service
 * Database operations through Raindrop MCP SmartSQL
 */

const raindropService = require('./raindrop.service');
const { logger } = require('../utils/logger');

class SmartSQLService {
  /**
   * Insert data into a table
   */
  async insert(table, data) {
    try {
      logger.info(`SmartSQL INSERT into ${table}`, { data });

      const result = await raindropService.callTool('smartsql-insert', {
        table,
        data
      });

      return result;
    } catch (error) {
      logger.error(`SmartSQL INSERT failed: ${table}`, error);
      throw error;
    }
  }

  /**
   * Select data from a table
   */
  async select(table, conditions = {}, options = {}) {
    try {
      logger.info(`SmartSQL SELECT from ${table}`, { conditions, options });

      const result = await raindropService.callTool('smartsql-select', {
        table,
        where: conditions,
        ...options
      });

      return result;
    } catch (error) {
      logger.error(`SmartSQL SELECT failed: ${table}`, error);
      throw error;
    }
  }

  /**
   * Update data in a table
   */
  async update(table, id, data) {
    try {
      logger.info(`SmartSQL UPDATE ${table}`, { id, data });

      const result = await raindropService.callTool('smartsql-update', {
        table,
        where: { id },
        data
      });

      return result;
    } catch (error) {
      logger.error(`SmartSQL UPDATE failed: ${table}`, error);
      throw error;
    }
  }

  /**
   * Delete data from a table
   */
  async delete(table, id) {
    try {
      logger.info(`SmartSQL DELETE from ${table}`, { id });

      const result = await raindropService.callTool('smartsql-delete', {
        table,
        where: { id }
      });

      return result;
    } catch (error) {
      logger.error(`SmartSQL DELETE failed: ${table}`, error);
      throw error;
    }
  }

  /**
   * Execute raw SQL query (for complex queries)
   */
  async query(sql, params = []) {
    try {
      logger.info('SmartSQL raw query', { sql });

      const result = await raindropService.callTool('smartsql-query', {
        sql,
        params
      });

      return result;
    } catch (error) {
      logger.error('SmartSQL query failed', error);
      throw error;
    }
  }

  // User operations
  async createUser(userData) {
    return await this.insert('users', userData);
  }

  async getUser(id) {
    const result = await this.select('users', { id });
    return result.rows?.[0] || null;
  }

  async getUserByEmail(email) {
    const result = await this.select('users', { email });
    return result.rows?.[0] || null;
  }

  async updateUser(id, userData) {
    return await this.update('users', id, userData);
  }

  // Workspace operations
  async createWorkspace(workspaceData) {
    return await this.insert('workspaces', {
      ...workspaceData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  async getWorkspace(id) {
    const result = await this.select('workspaces', { id });
    return result.rows?.[0] || null;
  }

  async listWorkspaces(userId, options = {}) {
    return await this.select('workspaces', { user_id: userId }, {
      orderBy: 'created_at DESC',
      ...options
    });
  }

  async updateWorkspace(id, workspaceData) {
    return await this.update('workspaces', id, {
      ...workspaceData,
      updated_at: new Date().toISOString()
    });
  }

  async deleteWorkspace(id) {
    return await this.delete('workspaces', id);
  }

  // Agent output operations
  async saveAgentOutput(workspaceId, agentType, outputData, metadata = {}) {
    return await this.insert('agent_outputs', {
      workspace_id: workspaceId,
      agent_type: agentType,
      output_data: outputData,
      version: metadata.version || 1,
      generation_time_ms: metadata.generationTime,
      model_used: metadata.modelUsed,
      created_at: new Date().toISOString()
    });
  }

  async getAgentOutputs(workspaceId, agentType = null) {
    const conditions = { workspace_id: workspaceId };
    if (agentType) {
      conditions.agent_type = agentType;
    }

    return await this.select('agent_outputs', conditions, {
      orderBy: 'created_at DESC'
    });
  }

  async getLatestAgentOutputs(workspaceId) {
    const sql = `
      SELECT DISTINCT ON (agent_type)
        id, workspace_id, agent_type, output_data, version,
        generation_time_ms, model_used, created_at
      FROM agent_outputs
      WHERE workspace_id = $1
      ORDER BY agent_type, version DESC, created_at DESC
    `;

    return await this.query(sql, [workspaceId]);
  }

  // Chat history operations
  async saveChatMessage(workspaceId, agentType, userMessage, agentResponse, metadata = {}) {
    return await this.insert('chat_history', {
      workspace_id: workspaceId,
      agent_type: agentType,
      user_message: userMessage,
      agent_response: agentResponse,
      response_time_ms: metadata.responseTime,
      model_used: metadata.modelUsed,
      created_at: new Date().toISOString()
    });
  }

  async getChatHistory(workspaceId, agentType = null, limit = 50) {
    const conditions = { workspace_id: workspaceId };
    if (agentType) {
      conditions.agent_type = agentType;
    }

    return await this.select('chat_history', conditions, {
      orderBy: 'created_at DESC',
      limit
    });
  }

  // File metadata operations
  async saveFileMetadata(workspaceId, fileType, fileName, storageUrl, fileSize, mimeType) {
    return await this.insert('file_metadata', {
      workspace_id: workspaceId,
      file_type: fileType,
      file_name: fileName,
      storage_url: storageUrl,
      file_size: fileSize,
      mime_type: mimeType,
      created_at: new Date().toISOString()
    });
  }

  async getFiles(workspaceId, fileType = null) {
    const conditions = { workspace_id: workspaceId };
    if (fileType) {
      conditions.file_type = fileType;
    }

    return await this.select('file_metadata', conditions, {
      orderBy: 'created_at DESC'
    });
  }
}

// Export singleton instance
const smartSQLService = new SmartSQLService();

module.exports = smartSQLService;
