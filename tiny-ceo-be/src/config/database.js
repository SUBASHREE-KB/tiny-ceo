// In-memory database for development
// In production, replace with PostgreSQL, MongoDB, or your preferred database

class Database {
  constructor() {
    this.users = [];
    this.workspaces = [];
    this.conversations = [];
    this.agentOutputs = [];
    this.agentChats = [];

    // ID counters
    this.userIdCounter = 1;
    this.workspaceIdCounter = 1;
    this.conversationIdCounter = 1;
    this.agentOutputIdCounter = 1;
    this.agentChatIdCounter = 1;
  }

  // User methods
  createUser(userData) {
    const user = {
      id: this.userIdCounter++,
      ...userData,
      created_at: new Date().toISOString()
    };
    this.users.push(user);
    return user;
  }

  findUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  findUserById(id) {
    return this.users.find(u => u.id === id);
  }

  // Workspace methods
  createWorkspace(workspaceData) {
    const workspace = {
      id: this.workspaceIdCounter++,
      ...workspaceData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.workspaces.push(workspace);
    return workspace;
  }

  findWorkspaceById(id) {
    return this.workspaces.find(w => w.id === parseInt(id));
  }

  findWorkspacesByUserId(userId) {
    return this.workspaces
      .filter(w => w.user_id === userId)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  }

  updateWorkspace(id, updates) {
    const workspace = this.findWorkspaceById(id);
    if (workspace) {
      Object.assign(workspace, updates, { updated_at: new Date().toISOString() });
    }
    return workspace;
  }

  // Conversation methods
  createConversation(conversationData) {
    const conversation = {
      id: this.conversationIdCounter++,
      ...conversationData,
      messages: conversationData.messages || [],
      created_at: new Date().toISOString()
    };
    this.conversations.push(conversation);
    return conversation;
  }

  findConversationByWorkspaceId(workspaceId) {
    return this.conversations.find(c => c.workspace_id === parseInt(workspaceId));
  }

  addMessageToConversation(workspaceId, userMessage, assistantMessage) {
    let conversation = this.findConversationByWorkspaceId(workspaceId);

    if (!conversation) {
      conversation = this.createConversation({
        workspace_id: parseInt(workspaceId),
        messages: []
      });
    }

    conversation.messages.push(
      { role: 'user', content: userMessage },
      { role: 'assistant', content: assistantMessage }
    );

    return conversation;
  }

  // Agent output methods
  createAgentOutput(outputData) {
    const output = {
      id: this.agentOutputIdCounter++,
      ...outputData,
      created_at: new Date().toISOString()
    };
    this.agentOutputs.push(output);
    return output;
  }

  findAgentOutputsByWorkspaceId(workspaceId) {
    return this.agentOutputs.filter(o => o.workspace_id === parseInt(workspaceId));
  }

  findAgentOutput(workspaceId, agentType) {
    return this.agentOutputs.find(
      o => o.workspace_id === parseInt(workspaceId) && o.agent_type === agentType
    );
  }

  clearAgentOutputsByWorkspaceId(workspaceId) {
    this.agentOutputs = this.agentOutputs.filter(o => o.workspace_id !== parseInt(workspaceId));
  }

  updateAgentOutput(workspaceId, agentType, outputData) {
    const output = this.findAgentOutput(workspaceId, agentType);
    if (output) {
      output.output_data = outputData;
      output.created_at = new Date().toISOString();
    }
    return output;
  }

  // Agent chat methods
  createAgentChat(chatData) {
    const chat = {
      id: this.agentChatIdCounter++,
      ...chatData,
      created_at: new Date().toISOString()
    };
    this.agentChats.push(chat);
    return chat;
  }

  findAgentChats(workspaceId, agentType) {
    return this.agentChats
      .filter(c => c.workspace_id === parseInt(workspaceId) && c.agent_type === agentType)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }

  // Utility methods
  reset() {
    this.users = [];
    this.workspaces = [];
    this.conversations = [];
    this.agentOutputs = [];
    this.agentChats = [];

    this.userIdCounter = 1;
    this.workspaceIdCounter = 1;
    this.conversationIdCounter = 1;
    this.agentOutputIdCounter = 1;
    this.agentChatIdCounter = 1;
  }
}

// Export singleton instance
const db = new Database();

module.exports = db;
