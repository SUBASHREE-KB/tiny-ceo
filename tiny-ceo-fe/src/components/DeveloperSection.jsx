import { useState } from 'react';
import {
  Sparkles,
  Code,
  FileText,
  BarChart3,
  AlertCircle,
  Server,
  MessageCircle
} from 'lucide-react';
import OutputCard from './OutputCard.jsx';
import AgentChatPanel from './AgentChatPanel.jsx';

// Developer Section
function DeveloperSection({ data, workspaceId }) {
  const [showChat, setShowChat] = useState(false);


  // Loading state
  if (!data) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Code className="text-blue-500" size={28} />
            <h2 className="text-2xl font-bold text-white">Developer Team</h2>
          </div>
          <p className="text-gray-300">Technical architecture, feature roadmap, and development priorities.</p>
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
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Code className="text-blue-500" size={28} />
            <h2 className="text-2xl font-bold text-white">Developer Team</h2>
          </div>
          <button
            onClick={() => setShowChat(!showChat)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all flex items-center gap-2"
          >
            <MessageCircle size={16} />
            Chat with Developer
          </button>
        </div>
        <p className="text-gray-300">Technical architecture, feature roadmap, and development priorities.</p>
      </div>

      <div className="grid gap-4">
        {/* Tech Stack */}
        {data.tech_stack && (
          <OutputCard
            title="Tech Stack Recommendation"
            content={`FRONTEND: ${data.tech_stack.frontend?.primary || ''} + ${data.tech_stack.frontend?.framework || ''} + ${data.tech_stack.frontend?.styling || ''}\n${data.tech_stack.frontend?.reasoning || ''}\n\nBACKEND: ${data.tech_stack.backend?.runtime || ''} + ${data.tech_stack.backend?.framework || ''} + ${data.tech_stack.backend?.database || ''}\n${data.tech_stack.backend?.reasoning || ''}\n\nINFRASTRUCTURE: ${data.tech_stack.infrastructure?.hosting || ''} + ${data.tech_stack.infrastructure?.containers || ''}\n${data.tech_stack.infrastructure?.reasoning || ''}`}
            icon={Code}
          />
        )}

        {/* Architecture */}
        {data.architecture && (
          <OutputCard
            title="System Architecture"
            content={`Type: ${data.architecture.architecture_type || 'Modern Web Application'}\n\n${data.architecture.components?.map(c => `${c.component}: ${c.description}`).join('\n\n') || ''}\n\nData Flow: ${data.architecture.data_flow || 'Client -> API -> Database'}`}
            icon={Server}
          />
        )}

        {/* MVP Features */}
        {data.mvp_features && (
          <OutputCard
            title="MVP Feature List"
            content={`CORE FEATURES (Must Have):\n${data.mvp_features.core_features?.map(f => `- ${f.feature}: ${f.description}`).join('\n') || ''}\n\nNICE-TO-HAVE:\n${data.mvp_features.nice_to_have?.map(f => `- ${f.feature}: ${f.description}`).join('\n') || ''}\n\nPOST-MVP:\n${data.mvp_features.post_mvp?.slice(0, 3).map(f => `- ${f.feature}`).join('\n') || ''}`}
            icon={FileText}
          />
        )}

        {/* Timeline */}
        {data.timeline && (
          <OutputCard
            title="Development Timeline"
            content={`Total: ${data.timeline.total_estimate || '8-12 weeks'}\n\n${data.timeline.phases?.map(phase =>
              `${phase.phase}: ${phase.duration}\nDeliverables: ${phase.deliverables?.join(', ') || ''}`
            ).join('\n\n') || ''}\n\nMilestone: ${data.timeline.mvp_target || 'MVP in 8-12 weeks'}`}
            icon={BarChart3}
          />
        )}

        {/* Technical Risks */}
        {data.technical_risks && data.technical_risks.length > 0 && (
          <OutputCard
            title="Technical Risks & Mitigation"
            content={data.technical_risks.map(risk =>
              `[${risk.severity}] ${risk.risk}\nMitigation: ${risk.mitigation}\nTimeline: ${risk.when_to_address}`
            ).join('\n\n')}
            icon={AlertCircle}
          />
        )}

        {/* Scalability Plan */}
        {data.scalability_plan && (
          <OutputCard
            title="Scalability Strategy"
            content={`Initial: ${data.scalability_plan.initial_capacity || 'Support 1,000 users'}\n\nBottlenecks:\n${data.scalability_plan.bottlenecks?.map(b => `- ${b.area}: ${b.solution}`).join('\n') || ''}\n\nScaling Triggers:\n${data.scalability_plan.scaling_triggers?.map(t => `- ${t.metric}: ${t.action}`).join('\n') || ''}`}
            icon={Sparkles}
          />
        )}

        {/* Development Phases */}
        {data.development_phases && data.development_phases.length > 0 && (
          <OutputCard
            title="Development Phases"
            content={data.development_phases.map(phase =>
              `${phase.phase} (${phase.timeline}):\n${phase.goals?.join('\n') || ''}\nSuccess: ${phase.completion_criteria || ''}`
            ).join('\n\n')}
            icon={BarChart3}
          />
        )}
      </div>

      {/* Chat Panel */}
      {showChat && (
        <AgentChatPanel
          agentType="developer"
          workspaceId={workspaceId}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}

export default DeveloperSection;