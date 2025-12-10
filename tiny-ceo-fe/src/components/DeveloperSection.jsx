import { useState } from 'react';
import {
  Code,
  FileCode,
  GitBranch,
  Database,
  Layout,
  Zap,
  Package,
  Terminal,
  CheckCircle,
  Clock,
  MessageSquare,
  Copy,
  Download,
  Play
} from 'lucide-react';
import AgentChatPanel from './AgentChatPanel.jsx';

// Developer Section with Code Generation
function DeveloperSection({ data, workspaceId }) {
  const [showChat, setShowChat] = useState(true); // Start with chat open
  const [activeTab, setActiveTab] = useState('chat'); // chat, code, architecture, roadmap

  // Loading state
  if (!data) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Code className="text-blue-500" size={28} />
            <h2 className="text-2xl font-bold text-white">Developer Team</h2>
          </div>
          <p className="text-gray-300">AI-powered code generation, architecture design, and development roadmap.</p>
        </div>
        <div className="text-center py-12">
          <Code className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
          <p className="text-gray-400 text-lg">Developer Agent is architecting your technical solution...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Code className="text-blue-500" size={28} />
            <h2 className="text-2xl font-bold text-white">Developer Team</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center gap-1">
              <CheckCircle size={14} />
              Ready to Code
            </span>
          </div>
        </div>
        <p className="text-gray-300">AI-powered code generation, architecture design, and development roadmap for your startup.</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'chat'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
          }`}
        >
          <MessageSquare size={16} />
          Code Generation Chat
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'code'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
          }`}
        >
          <FileCode size={16} />
          Code Snippets
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'architecture'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
          }`}
        >
          <Layout size={16} />
          Architecture
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'roadmap'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
          }`}
        >
          <GitBranch size={16} />
          Development Roadmap
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'chat' && (
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Zap className="text-yellow-500" size={18} />
              Quick Code Generation
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-all">
                Generate API Endpoints
              </button>
              <button className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-all">
                Database Schema
              </button>
              <button className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-all">
                Auth System
              </button>
              <button className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-all">
                Frontend Components
              </button>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 border-b border-gray-800 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Terminal className="text-blue-500" size={18} />
                    AI Code Assistant
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">Ask for code, architecture advice, or technical solutions</p>
                </div>
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-all"
                >
                  {showChat ? 'Minimize' : 'Expand'}
                </button>
              </div>
            </div>

            {showChat && (
              <div className="h-[600px]">
                <AgentChatPanel
                  agentType="developer"
                  workspaceId={workspaceId}
                  onClose={() => setShowChat(false)}
                  embedded={true}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'code' && (
        <div className="space-y-4">
          {/* Tech Stack Overview */}
          {data.tech_stack && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Package className="text-purple-500" size={20} />
                Recommended Tech Stack
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Frontend */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                    <Layout size={16} />
                    Frontend
                  </div>
                  <div className="space-y-1 text-sm text-gray-300">
                    <div>{data.tech_stack.frontend?.primary || 'React'}</div>
                    <div>{data.tech_stack.frontend?.framework || 'Next.js'}</div>
                    <div>{data.tech_stack.frontend?.styling || 'Tailwind CSS'}</div>
                  </div>
                </div>

                {/* Backend */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-green-400 font-medium mb-2 flex items-center gap-2">
                    <Code size={16} />
                    Backend
                  </div>
                  <div className="space-y-1 text-sm text-gray-300">
                    <div>{data.tech_stack.backend?.runtime || 'Node.js'}</div>
                    <div>{data.tech_stack.backend?.framework || 'Express'}</div>
                    <div>{data.tech_stack.backend?.database || 'PostgreSQL'}</div>
                  </div>
                </div>

                {/* Infrastructure */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-orange-400 font-medium mb-2 flex items-center gap-2">
                    <Database size={16} />
                    Infrastructure
                  </div>
                  <div className="space-y-1 text-sm text-gray-300">
                    <div>{data.tech_stack.infrastructure?.hosting || 'AWS/Vercel'}</div>
                    <div>{data.tech_stack.infrastructure?.containers || 'Docker'}</div>
                    <div>GitHub Actions</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Code Snippets */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <FileCode className="text-cyan-500" size={20} />
              Boilerplate Code Snippets
            </h3>

            {/* API Endpoint Example */}
            <CodeSnippet
              title="Sample API Endpoint"
              language="javascript"
              code={`// Express.js API endpoint for your startup
const express = require('express');
const router = express.Router();

// GET endpoint
router.get('/api/items', async (req, res) => {
  try {
    const items = await db.items.findAll();
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST endpoint
router.post('/api/items', async (req, res) => {
  try {
    const newItem = await db.items.create(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;`}
            />

            {/* Database Schema */}
            <CodeSnippet
              title="Database Schema"
              language="sql"
              code={`-- PostgreSQL schema for your startup
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_items_user_id ON items(user_id);
CREATE INDEX idx_items_status ON items(status);`}
            />

            {/* React Component */}
            <CodeSnippet
              title="React Component Example"
              language="jsx"
              code={`import { useState, useEffect } from 'react';

function ItemList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items');
      const data = await response.json();
      setItems(data.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid gap-4">
      {items.map(item => (
        <div key={item.id} className="p-4 border rounded">
          <h3>{item.title}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}

export default ItemList;`}
            />
          </div>
        </div>
      )}

      {activeTab === 'architecture' && (
        <div className="space-y-4">
          {/* Architecture Diagram */}
          {data.tech_stack && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Layout className="text-purple-500" size={20} />
                Visual Architecture Diagram
              </h3>
              <ArchitectureDiagram
                techStack={data.tech_stack}
                architecture={data.architecture}
              />
            </div>
          )}

          {/* System Architecture Details */}
          {data.architecture && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Layout className="text-purple-500" size={20} />
                Architecture Details
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Architecture Type</div>
                  <div className="text-white font-medium">{data.architecture.architecture_type || 'Modern Web Application'}</div>
                </div>

                {data.architecture.components && (
                  <div>
                    <div className="text-sm text-gray-400 mb-2">System Components</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {data.architecture.components.map((comp, idx) => (
                        <div key={idx} className="bg-gray-800/50 rounded-lg p-3">
                          <div className="text-blue-400 font-medium text-sm">{comp.component}</div>
                          <div className="text-gray-300 text-xs mt-1">{comp.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Data Flow</div>
                  <div className="text-white">{data.architecture.data_flow || 'Client → API → Database'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Scalability Plan */}
          {data.scalability_plan && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Zap className="text-yellow-500" size={20} />
                Scalability Strategy
              </h3>
              <div className="space-y-3">
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="text-sm text-gray-400">Initial Capacity</div>
                  <div className="text-white">{data.scalability_plan.initial_capacity || 'Support 1,000 concurrent users'}</div>
                </div>

                {data.scalability_plan.bottlenecks && (
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Potential Bottlenecks & Solutions</div>
                    <div className="space-y-2">
                      {data.scalability_plan.bottlenecks.map((b, idx) => (
                        <div key={idx} className="bg-gray-800/50 rounded-lg p-3">
                          <div className="text-orange-400 text-sm font-medium">{b.area}</div>
                          <div className="text-gray-300 text-sm">{b.solution}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'roadmap' && (
        <div className="space-y-4">
          {/* MVP Features */}
          {data.mvp_features && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-500" size={20} />
                MVP Feature List
              </h3>

              {data.mvp_features.core_features && (
                <div className="mb-6">
                  <div className="text-green-400 font-medium mb-3">Core Features (Must Have)</div>
                  <div className="space-y-2">
                    {data.mvp_features.core_features.map((feature, idx) => (
                      <div key={idx} className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                          <div>
                            <div className="text-white font-medium">{feature.feature}</div>
                            <div className="text-gray-300 text-sm mt-1">{feature.description}</div>
                            <div className="flex gap-2 mt-2">
                              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">P0 Priority</span>
                              <span className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs">{feature.complexity || 'Medium'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.mvp_features.nice_to_have && (
                <div className="mb-6">
                  <div className="text-blue-400 font-medium mb-3">Nice-to-Have Features</div>
                  <div className="space-y-2">
                    {data.mvp_features.nice_to_have.map((feature, idx) => (
                      <div key={idx} className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <Clock className="text-blue-500 mt-0.5 flex-shrink-0" size={16} />
                          <div>
                            <div className="text-white font-medium">{feature.feature}</div>
                            <div className="text-gray-300 text-sm mt-1">{feature.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.mvp_features.post_mvp && (
                <div>
                  <div className="text-gray-400 font-medium mb-3">Post-MVP Features</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {data.mvp_features.post_mvp.slice(0, 6).map((feature, idx) => (
                      <div key={idx} className="bg-gray-800/50 rounded-lg p-2 text-gray-300 text-sm">
                        • {feature.feature || feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Development Timeline */}
          {data.timeline && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Clock className="text-cyan-500" size={20} />
                Development Timeline
              </h3>
              <div className="mb-4 text-gray-300">
                Total Estimate: <span className="text-white font-semibold">{data.timeline.total_estimate || '8-12 weeks'}</span>
              </div>

              {data.timeline.phases && (
                <div className="space-y-3">
                  {data.timeline.phases.map((phase, idx) => (
                    <div key={idx} className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-cyan-400 font-medium">{phase.phase}</div>
                        <div className="text-gray-400 text-sm">{phase.duration}</div>
                      </div>
                      {phase.deliverables && (
                        <div className="text-gray-300 text-sm">
                          <div className="text-gray-400 mb-1">Deliverables:</div>
                          <ul className="list-disc list-inside space-y-1">
                            {phase.deliverables.map((d, i) => (
                              <li key={i}>{d}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Technical Risks */}
          {data.technical_risks && data.technical_risks.length > 0 && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Code className="text-red-500" size={20} />
                Technical Risks & Mitigation
              </h3>
              <div className="space-y-3">
                {data.technical_risks.map((risk, idx) => (
                  <div key={idx} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        risk.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                        risk.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-600/20 text-gray-400'
                      }`}>
                        {risk.severity}
                      </span>
                      <div className="flex-1">
                        <div className="text-white font-medium mb-1">{risk.risk}</div>
                        <div className="text-gray-300 text-sm mb-2">
                          <span className="text-gray-400">Mitigation:</span> {risk.mitigation}
                        </div>
                        {risk.when_to_address && (
                          <div className="text-gray-400 text-xs">Address: {risk.when_to_address}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Architecture Diagram Component
function ArchitectureDiagram({ techStack, architecture }) {
  const frontend = techStack?.frontend?.primary || 'React';
  const backend = techStack?.backend?.runtime || 'Node.js';
  const database = techStack?.backend?.database || 'PostgreSQL';
  const hosting = techStack?.infrastructure?.hosting || 'Cloud';

  return (
    <div className="bg-gray-800/30 rounded-lg p-8 overflow-x-auto">
      <svg width="100%" height="500" viewBox="0 0 800 500" className="mx-auto">
        {/* Define gradients and markers */}
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: '#1d4ed8', stopOpacity: 0.8 }} />
          </linearGradient>
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 0.8 }} />
          </linearGradient>
          <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: '#7c3aed', stopOpacity: 0.8 }} />
          </linearGradient>
          <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#f97316', stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: '#ea580c', stopOpacity: 0.8 }} />
          </linearGradient>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
            <polygon points="0 0, 10 3, 0 6" fill="#60a5fa" />
          </marker>
        </defs>

        {/* Layer 1: Client/Frontend */}
        <g>
          <rect x="300" y="20" width="200" height="80" rx="8" fill="url(#blueGradient)" stroke="#3b82f6" strokeWidth="2" />
          <text x="400" y="50" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">Frontend</text>
          <text x="400" y="70" textAnchor="middle" fill="#bfdbfe" fontSize="14">{frontend}</text>
          <text x="400" y="88" textAnchor="middle" fill="#93c5fd" fontSize="12">Client Application</text>
        </g>

        {/* Arrow: Frontend to API */}
        <line x1="400" y1="100" x2="400" y2="150" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <text x="420" y="130" fill="#93c5fd" fontSize="12">HTTPS</text>

        {/* Layer 2: API Gateway */}
        <g>
          <rect x="300" y="150" width="200" height="80" rx="8" fill="url(#greenGradient)" stroke="#10b981" strokeWidth="2" />
          <text x="400" y="180" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">API Layer</text>
          <text x="400" y="200" textAnchor="middle" fill="#d1fae5" fontSize="14">{backend}</text>
          <text x="400" y="218" textAnchor="middle" fill="#a7f3d0" fontSize="12">REST API / GraphQL</text>
        </g>

        {/* Arrow: API to Backend */}
        <line x1="400" y1="230" x2="400" y2="280" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowhead)" />

        {/* Layer 3: Backend Services (Split into 3 boxes) */}
        <g>
          {/* Business Logic */}
          <rect x="50" y="280" width="180" height="80" rx="8" fill="url(#purpleGradient)" stroke="#a855f7" strokeWidth="2" />
          <text x="140" y="310" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Business Logic</text>
          <text x="140" y="330" textAnchor="middle" fill="#e9d5ff" fontSize="12">Controllers</text>
          <text x="140" y="348" textAnchor="middle" fill="#e9d5ff" fontSize="12">Services</text>

          {/* Auth & Security */}
          <rect x="310" y="280" width="180" height="80" rx="8" fill="url(#purpleGradient)" stroke="#a855f7" strokeWidth="2" />
          <text x="400" y="310" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Auth & Security</text>
          <text x="400" y="330" textAnchor="middle" fill="#e9d5ff" fontSize="12">JWT / OAuth</text>
          <text x="400" y="348" textAnchor="middle" fill="#e9d5ff" fontSize="12">Validation</text>

          {/* External Services */}
          <rect x="570" y="280" width="180" height="80" rx="8" fill="url(#purpleGradient)" stroke="#a855f7" strokeWidth="2" />
          <text x="660" y="310" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">External APIs</text>
          <text x="660" y="330" textAnchor="middle" fill="#e9d5ff" fontSize="12">Payment</text>
          <text x="660" y="348" textAnchor="middle" fill="#e9d5ff" fontSize="12">Email / SMS</text>
        </g>

        {/* Arrow: Backend to Database */}
        <line x1="140" y1="360" x2="250" y2="410" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="400" y1="360" x2="350" y2="410" stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arrowhead)" />

        {/* Layer 4: Data Layer */}
        <g>
          <rect x="250" y="410" width="200" height="80" rx="8" fill="url(#orangeGradient)" stroke="#f97316" strokeWidth="2" />
          <text x="350" y="440" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">Database</text>
          <text x="350" y="460" textAnchor="middle" fill="#fed7aa" fontSize="14">{database}</text>
          <text x="350" y="478" textAnchor="middle" fill="#fdba74" fontSize="12">Data Persistence</text>
        </g>

        {/* Cloud/Infrastructure Box around everything */}
        <rect x="20" y="5" width="760" height="490" rx="12" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
        <text x="40" y="25" fill="#a5b4fc" fontSize="14" fontWeight="bold">☁️ {hosting}</text>

        {/* Side annotations */}
        <text x="20" y="60" fill="#9ca3af" fontSize="12">Presentation</text>
        <text x="20" y="190" fill="#9ca3af" fontSize="12">API Gateway</text>
        <text x="20" y="320" fill="#9ca3af" fontSize="12">Application</text>
        <text x="20" y="450" fill="#9ca3af" fontSize="12">Data Layer</text>
      </svg>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}></div>
          <span className="text-gray-400">Frontend Layer</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}></div>
          <span className="text-gray-400">API Gateway</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)' }}></div>
          <span className="text-gray-400">Backend Services</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }}></div>
          <span className="text-gray-400">Database</span>
        </div>
      </div>
    </div>
  );
}

// Code Snippet Component
function CodeSnippet({ title, language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between bg-gray-800/50 px-4 py-2 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <FileCode className="text-cyan-500" size={16} />
          <span className="text-white font-medium text-sm">{title}</span>
          <span className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs">{language}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-all flex items-center gap-1"
          >
            {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-gray-300 text-sm font-mono">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export default DeveloperSection;
