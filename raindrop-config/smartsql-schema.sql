-- Tiny CEO SmartSQL Database Schema
-- For Raindrop MCP Server

-- Drop existing tables (for clean reinstall)
DROP TABLE IF EXISTS chat_history CASCADE;
DROP TABLE IF EXISTS file_metadata CASCADE;
DROP TABLE IF EXISTS agent_outputs CASCADE;
DROP TABLE IF EXISTS workspaces CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  auth_token VARCHAR(512),
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT true,

  -- Indexes
  CONSTRAINT users_email_key UNIQUE (email)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth_token ON users(auth_token);

-- Workspaces table
CREATE TABLE workspaces (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  startup_idea TEXT NOT NULL,
  industry VARCHAR(100),
  target_audience TEXT,
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'analyzing', 'completed', 'archived'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workspaces_user_id ON workspaces(user_id);
CREATE INDEX idx_workspaces_status ON workspaces(status);
CREATE INDEX idx_workspaces_created_at ON workspaces(created_at DESC);

-- Agent outputs table
CREATE TABLE agent_outputs (
  id SERIAL PRIMARY KEY,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  agent_type VARCHAR(50) NOT NULL, -- 'ceo', 'finance', 'marketing', 'sales', 'developer', 'overview'
  output_data JSONB NOT NULL,
  version INTEGER DEFAULT 1,
  generation_time_ms INTEGER, -- Track generation performance
  model_used VARCHAR(100), -- Track which AI model was used
  created_at TIMESTAMP DEFAULT NOW(),

  -- Ensure one latest output per agent per workspace
  CONSTRAINT unique_agent_workspace UNIQUE (workspace_id, agent_type, version)
);

CREATE INDEX idx_agent_outputs_workspace_id ON agent_outputs(workspace_id);
CREATE INDEX idx_agent_outputs_agent_type ON agent_outputs(agent_type);
CREATE INDEX idx_agent_outputs_created_at ON agent_outputs(created_at DESC);

-- Chat history table
CREATE TABLE chat_history (
  id SERIAL PRIMARY KEY,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  agent_type VARCHAR(50) NOT NULL, -- 'ceo', 'finance', 'marketing', 'sales', 'developer'
  user_message TEXT NOT NULL,
  agent_response TEXT NOT NULL,
  response_time_ms INTEGER,
  model_used VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chat_history_workspace_id ON chat_history(workspace_id);
CREATE INDEX idx_chat_history_agent_type ON chat_history(agent_type);
CREATE INDEX idx_chat_history_created_at ON chat_history(created_at DESC);

-- File metadata table (for Vultr Object Storage files)
CREATE TABLE file_metadata (
  id SERIAL PRIMARY KEY,
  workspace_id INTEGER NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  file_type VARCHAR(50) NOT NULL, -- 'pitchdeck', 'analysis_pdf', 'export_json', 'screenshot'
  file_name VARCHAR(255) NOT NULL,
  storage_url TEXT NOT NULL, -- Vultr Object Storage URL
  file_size INTEGER, -- Size in bytes
  mime_type VARCHAR(100),
  metadata JSONB DEFAULT '{}', -- Additional file metadata
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_file_metadata_workspace_id ON file_metadata(workspace_id);
CREATE INDEX idx_file_metadata_file_type ON file_metadata(file_type);
CREATE INDEX idx_file_metadata_created_at ON file_metadata(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to workspaces table
CREATE TRIGGER update_workspaces_updated_at
BEFORE UPDATE ON workspaces
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert sample user for testing
INSERT INTO users (email, name, auth_token)
VALUES ('demo@tinyceo.ai', 'Demo User', 'demo_token_12345');

-- Sample workspace for testing
INSERT INTO workspaces (user_id, name, startup_idea, industry, target_audience, status)
VALUES (
  1,
  'AI Task Manager',
  'An AI-powered task management application that automatically prioritizes tasks based on user behavior and deadlines',
  'SaaS',
  'Busy professionals and remote teams',
  'draft'
);

-- Views for common queries

-- View: Latest agent outputs per workspace
CREATE OR REPLACE VIEW latest_agent_outputs AS
SELECT DISTINCT ON (workspace_id, agent_type)
  id,
  workspace_id,
  agent_type,
  output_data,
  version,
  generation_time_ms,
  model_used,
  created_at
FROM agent_outputs
ORDER BY workspace_id, agent_type, version DESC, created_at DESC;

-- View: Workspace with latest outputs
CREATE OR REPLACE VIEW workspaces_with_outputs AS
SELECT
  w.id AS workspace_id,
  w.user_id,
  w.name,
  w.startup_idea,
  w.industry,
  w.target_audience,
  w.status,
  w.created_at,
  w.updated_at,
  COALESCE(
    JSON_OBJECT_AGG(
      ao.agent_type,
      ao.output_data
    ) FILTER (WHERE ao.agent_type IS NOT NULL),
    '{}'::json
  ) AS agent_outputs
FROM workspaces w
LEFT JOIN latest_agent_outputs ao ON w.id = ao.workspace_id
GROUP BY w.id, w.user_id, w.name, w.startup_idea, w.industry, w.target_audience, w.status, w.created_at, w.updated_at;

-- Grant permissions (adjust as needed for your Raindrop setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO raindrop_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO raindrop_user;
-- GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO raindrop_user;

-- Database statistics
SELECT
  'users' AS table_name, COUNT(*) AS row_count FROM users
UNION ALL
SELECT 'workspaces', COUNT(*) FROM workspaces
UNION ALL
SELECT 'agent_outputs', COUNT(*) FROM agent_outputs
UNION ALL
SELECT 'chat_history', COUNT(*) FROM chat_history
UNION ALL
SELECT 'file_metadata', COUNT(*) FROM file_metadata;
