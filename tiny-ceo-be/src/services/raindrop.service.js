/**
 * Raindrop MCP Client Service
 * Main interface for connecting to Raindrop MCP Server
 */

const { logger } = require('../utils/logger');

class RaindropService {
  constructor() {
    this.mcpUrl = process.env.RAINDROP_MCP_URL || 'http://localhost:3100';
    this.apiKey = process.env.RAINDROP_API_KEY;
    this.connected = false;
  }

  /**
   * Initialize connection to Raindrop MCP Server
   */
  async connect() {
    try {
      logger.info('Connecting to Raindrop MCP Server...', { url: this.mcpUrl });

      // Test connection with a ping or info request
      const response = await this.makeRequest('GET', '/info');

      if (response.ok) {
        this.connected = true;
        logger.success('Connected to Raindrop MCP Server');
        return true;
      }

      throw new Error('Failed to connect to Raindrop MCP Server');
    } catch (error) {
      logger.error('Raindrop MCP connection failed', error);
      this.connected = false;
      return false;
    }
  }

  /**
   * Make HTTP request to Raindrop MCP Server
   */
  async makeRequest(method, endpoint, data = null) {
    const url = `${this.mcpUrl}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` })
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      return { ok: true, data: result };
    } catch (error) {
      logger.error(`Raindrop request failed: ${method} ${endpoint}`, error);
      return { ok: false, error: error.message };
    }
  }

  /**
   * Call a specific MCP tool
   */
  async callTool(toolName, args) {
    logger.info(`Calling Raindrop tool: ${toolName}`, { args });

    const response = await this.makeRequest('POST', `/tools/${toolName}`, args);

    if (!response.ok) {
      throw new Error(`Tool ${toolName} failed: ${response.error}`);
    }

    return response.data;
  }

  /**
   * Execute MCP method (generic)
   */
  async execute(method, params) {
    const response = await this.makeRequest('POST', '/execute', {
      method,
      params
    });

    if (!response.ok) {
      throw new Error(`MCP execute failed: ${response.error}`);
    }

    return response.data.result;
  }

  /**
   * Check if connected to Raindrop
   */
  isConnected() {
    return this.connected;
  }
}

// Export singleton instance
const raindropService = new RaindropService();

module.exports = raindropService;
