// Sales Section
import { useState } from 'react';
import {
  Users,
  Target,
  FileText,
  TrendingUp,
  MessageSquare,
  MessageCircle
} from 'lucide-react';
import OutputCard from './OutputCard.jsx';
import AgentChatPanel from './AgentChatPanel.jsx';

function SalesSection({ data, workspaceId }) {
  const [showChat, setShowChat] = useState(false);


  // Loading state
  if (!data) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border border-orange-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-orange-500" size={28} />
            <h2 className="text-2xl font-bold text-white">Sales Team</h2>
          </div>
          <p className="text-gray-300">Lead generation, outreach strategies, and customer acquisition.</p>
        </div>
        <div className="text-center py-12">
          <Users className="animate-spin text-orange-500 mx-auto mb-4" size={48} />
          <p className="text-gray-400 text-lg">Sales Agent is analyzing your customer acquisition strategy...</p>
        </div>
      </div>
    );
  }

  // Safe helper to render content
  const safeRender = (value, fallback = 'N/A') => {
    return value !== undefined && value !== null ? value : fallback;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border border-orange-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Users className="text-orange-500" size={28} />
            <h2 className="text-2xl font-bold text-white">Sales Team</h2>
          </div>
          <button
            onClick={() => setShowChat(!showChat)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-all flex items-center gap-2"
          >
            <MessageCircle size={16} />
            Chat with Sales
          </button>
        </div>
        <p className="text-gray-300">Lead generation, outreach strategies, and customer acquisition.</p>
      </div>

      <div className="grid gap-4">
        {/* ICP (Ideal Customer Profile) */}
        {data.icp && (
          <OutputCard
            title="Ideal Customer Profile (ICP)"
            content={(() => {
              const role = safeRender(data.icp.role, '');
              const companySize = safeRender(data.icp.company_size, '');
              const industry = safeRender(data.icp.industry, '');
              const painPoints = Array.isArray(data.icp.pain_points) ? data.icp.pain_points.join(', ') : safeRender(data.icp.pain_points, '');
              const budget = safeRender(data.icp.budget_range || data.icp.budget, '');

              let content = '';
              if (role) content += `Decision Maker: ${role}\n`;
              if (companySize) content += `Company Size: ${companySize}\n`;
              if (industry) content += `Industry: ${industry}\n`;
              if (painPoints) content += `Pain Points: ${painPoints}\n`;
              if (budget) content += `Budget Range: ${budget}`;

              return content || 'ICP being analyzed by Gemini...';
            })()}
            icon={Target}
          />
        )}

        {/* Buyer Persona */}
        {data.buyer_persona && (
          <OutputCard
            title="Buyer Persona"
            content={(() => {
              const title = safeRender(data.buyer_persona.title, '');
              const responsibilities = safeRender(data.buyer_persona.responsibilities, '');
              const goals = Array.isArray(data.buyer_persona.goals) ? data.buyer_persona.goals.join('\n') : safeRender(data.buyer_persona.goals, '');
              const challenges = Array.isArray(data.buyer_persona.challenges) ? data.buyer_persona.challenges.join('\n') : safeRender(data.buyer_persona.challenges, '');

              let content = '';
              if (title) content += `Title: ${title}\n`;
              if (responsibilities) content += `Responsibilities: ${responsibilities}\n`;
              if (goals) content += `\nGoals:\n${goals}\n`;
              if (challenges) content += `\nChallenges:\n${challenges}`;

              return content || 'Buyer persona being defined...';
            })()}
            icon={Users}
          />
        )}

        {/* Lead Generation */}
        {data.lead_gen && Array.isArray(data.lead_gen) && data.lead_gen.length > 0 && (
          <OutputCard
            title="Lead Generation Sources"
            content={data.lead_gen.map((source, idx) => {
              const sourceName = safeRender(source.source, `Source ${idx + 1}`);
              const priority = safeRender(source.priority, '');
              const conversion = safeRender(source.expected_conversion || source.conversion, '');
              const cost = safeRender(source.cost_per_lead || source.cost, '');
              const volume = safeRender(source.monthly_volume || source.volume, '');

              return `${idx + 1}. ${sourceName}${priority ? ` (${priority} Priority)` : ''}${conversion ? `\n   Conversion: ${conversion}` : ''}${cost ? `\n   Cost per Lead: ${cost}` : ''}${volume ? `\n   Monthly Volume: ${volume}` : ''}`;
            }).join('\n\n')}
            icon={TrendingUp}
          />
        )}

        {/* Sales Playbook */}
        {data.playbook && Array.isArray(data.playbook) && data.playbook.length > 0 && (
          <OutputCard
            title="Sales Playbook"
            content={data.playbook.map((step, idx) => {
              const stepNum = safeRender(step.step, idx + 1);
              const action = safeRender(step.action, '');
              const description = safeRender(step.description, '');
              const timeline = safeRender(step.timeline, '');

              return `Step ${stepNum}: ${action}${description ? `\n${description}` : ''}${timeline ? `\nTimeline: ${timeline}` : ''}`;
            }).join('\n\n')}
            icon={FileText}
          />
        )}

        {/* Objection Handling */}
        {data.objection_handling && Array.isArray(data.objection_handling) && data.objection_handling.length > 0 && (
          <OutputCard
            title="Objection Handling"
            content={data.objection_handling.map((obj, idx) => {
              const objection = safeRender(obj.objection, '');
              const response = safeRender(obj.response, '');
              const frequency = safeRender(obj.frequency, '');

              return `${idx + 1}. "${objection}"${frequency ? ` (${frequency})` : ''}\n   Response: ${response}`;
            }).join('\n\n')}
            icon={MessageSquare}
          />
        )}

        {/* Sales Metrics */}
        {data.sales_metrics && (
          <OutputCard
            title="Sales Metrics & Targets"
            content={(() => {
              const quota = safeRender(data.sales_metrics.monthly_quota || data.sales_metrics.quota, '');
              const pipeline = safeRender(data.sales_metrics.pipeline_target || data.sales_metrics.pipeline, '');
              const conversion = safeRender(data.sales_metrics.target_conversion || data.sales_metrics.conversion, '');
              const avgDeal = safeRender(data.sales_metrics.average_deal_size || data.sales_metrics.deal_size, '');
              const salesCycle = safeRender(data.sales_metrics.sales_cycle_length || data.sales_metrics.cycle_length, '');

              let content = '';
              if (quota) content += `Monthly Quota: ${quota}\n`;
              if (pipeline) content += `Pipeline Target: ${pipeline}\n`;
              if (conversion) content += `Target Conversion Rate: ${conversion}\n`;
              if (avgDeal) content += `Average Deal Size: ${avgDeal}\n`;
              if (salesCycle) content += `Sales Cycle Length: ${salesCycle}`;

              return content || 'Sales metrics being calculated...';
            })()}
            icon={TrendingUp}
          />
        )}

        {/* Fallback if no data */}
        {!data.icp &&
         !data.buyer_persona &&
         (!data.lead_gen || data.lead_gen.length === 0) &&
         (!data.playbook || data.playbook.length === 0) &&
         (!data.objection_handling || data.objection_handling.length === 0) &&
         !data.sales_metrics && (
          <div className="text-center py-12 text-gray-400">
            <p>Sales strategy insights are being generated...</p>
            <p className="text-sm mt-2">Gemini is analyzing your customer acquisition approach</p>
          </div>
        )}
      </div>

      {/* Chat Panel */}
      {showChat && (
        <AgentChatPanel
          agentType="sales"
          workspaceId={workspaceId}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}

export default SalesSection;
