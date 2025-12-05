import { useState } from 'react';
import { Check, MessageCircle, AlertCircle, Target, TrendingUp, Users, ListTodo, Activity, X } from 'lucide-react';
import OutputCard from './OutputCard.jsx';
import AgentChatPanel from './AgentChatPanel.jsx';

// Info Modal Component
function InfoModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="text-gray-300">
          {children}
        </div>
      </div>
    </div>
  );
}

// Overview Section
function OverviewSection({ ideaTitle, data, workspaceId }) {
  const [showChat, setShowChat] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  // Loading state
  if (!data) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold text-white">{ideaTitle}</h2>
          </div>
          <p className="text-gray-300 mb-6">Your AI startup team is analyzing your idea...</p>
        </div>
        <div className="text-center py-12">
          <RefreshCw className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
          <p className="text-gray-400 text-lg">Overview Agent is generating insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-white">{ideaTitle}</h2>
          <button
            onClick={() => setShowChat(!showChat)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all flex items-center gap-2"
          >
            <MessageCircle size={16} />
            Chat with Overview
          </button>
        </div>
        <p className="text-gray-300 mb-6">Your AI startup team has analyzed your idea and organized everything below.</p>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <button
            onClick={() => setActiveModal('teams')}
            className="bg-gray-800/50 hover:bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-blue-500/50 transition-all cursor-pointer text-left"
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="text-blue-500" size={20} />
              <div className="text-2xl font-bold text-white">5</div>
            </div>
            <div className="text-gray-400 text-sm">Active Teams</div>
            <div className="text-gray-500 text-xs mt-1">Click to see details</div>
          </button>

          <button
            onClick={() => setActiveModal('nextsteps')}
            className="bg-gray-800/50 hover:bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-green-500/50 transition-all cursor-pointer text-left"
          >
            <div className="flex items-center gap-2 mb-2">
              <ListTodo className="text-green-500" size={20} />
              <div className="text-2xl font-bold text-white">
                {data.next_steps?.length || 0}
              </div>
            </div>
            <div className="text-gray-400 text-sm">Next Steps</div>
            <div className="text-gray-500 text-xs mt-1">Click to see actions</div>
          </button>

          <button
            onClick={() => setActiveModal('status')}
            className="bg-gray-800/50 hover:bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer text-left"
          >
            <div className="flex items-center gap-2 mb-2">
              <Activity className="text-purple-500" size={20} />
              <div className="text-2xl font-bold text-white">Ready</div>
            </div>
            <div className="text-gray-400 text-sm">Status</div>
            <div className="text-gray-500 text-xs mt-1">Click for insights</div>
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {/* Executive Summary */}
        {data.executive_summary && (
          <OutputCard
            title="Executive Summary"
            content={(() => {
              if (typeof data.executive_summary === 'string') {
                return data.executive_summary;
              }

              const summary = data.executive_summary;
              let content = '';

              // One sentence pitch
              if (summary.one_sentence_pitch) {
                content += `📍 THE IDEA\n${summary.one_sentence_pitch}\n\n`;
              }

              // Opportunity overview
              if (summary.opportunity_overview) {
                content += `🎯 OPPORTUNITY\n${summary.opportunity_overview}\n\n`;
              }

              // Market context
              if (summary.market_context) {
                content += `📊 MARKET\n`;
                if (summary.market_context.industry) content += `Industry: ${summary.market_context.industry}\n`;
                if (summary.market_context.market_size) content += `Market Size: ${summary.market_context.market_size}\n`;
                if (summary.market_context.growth_rate) content += `Growth: ${summary.market_context.growth_rate}\n`;
                if (summary.market_context.competitive_position) content += `Position: ${summary.market_context.competitive_position}\n`;
                content += '\n';
              }

              // Business model
              if (summary.business_model) {
                content += `💼 BUSINESS MODEL\n`;
                if (summary.business_model.revenue_model) content += `Model: ${summary.business_model.revenue_model}\n`;
                if (summary.business_model.primary_tier) content += `Primary Tier: ${summary.business_model.primary_tier}\n`;
                if (summary.business_model.distribution) content += `Distribution: ${summary.business_model.distribution}\n`;
                if (summary.business_model.gross_margin) content += `Margins: ${summary.business_model.gross_margin}\n`;
                content += '\n';
              }

              // Financial highlights
              if (summary.financial_highlights) {
                content += `💰 FINANCIAL HIGHLIGHTS\n`;
                if (summary.financial_highlights.year_1_arr) content += `Year 1: ${summary.financial_highlights.year_1_arr}\n`;
                if (summary.financial_highlights.year_3_arr) content += `Year 3: ${summary.financial_highlights.year_3_arr}\n`;
                if (summary.financial_highlights.unit_economics) content += `Unit Economics: ${summary.financial_highlights.unit_economics}\n`;
                if (summary.financial_highlights.breakeven) content += `Break-even: ${summary.financial_highlights.breakeven}\n`;
                if (summary.financial_highlights.funding_need) content += `Funding: ${summary.financial_highlights.funding_need}\n`;
                content += '\n';
              }

              // Key strengths
              if (summary.key_strengths && Array.isArray(summary.key_strengths) && summary.key_strengths.length > 0) {
                content += `✅ KEY STRENGTHS\n${summary.key_strengths.map(s => `• ${s}`).join('\n')}\n\n`;
              }

              // Key challenges
              if (summary.key_challenges && Array.isArray(summary.key_challenges) && summary.key_challenges.length > 0) {
                content += `⚠️ KEY CHALLENGES\n${summary.key_challenges.map(c => `• ${c}`).join('\n')}`;
              }

              return content || JSON.stringify(summary, null, 2);
            })()}
            icon={Check}
          />
        )}

        {/* Key Risks */}
        {data.key_risks && Array.isArray(data.key_risks) && data.key_risks.length > 0 && (
          <OutputCard
            title="Key Risks to Address"
            content={data.key_risks.map(risk => {
              if (typeof risk === 'string') return risk;
              if (typeof risk === 'object' && risk !== null) {
                const parts = [];
                if (risk.risk) parts.push(risk.risk);
                if (risk.severity) parts.push(`[${risk.severity}]`);
                if (risk.mitigation) parts.push(`Mitigation: ${risk.mitigation}`);
                return parts.join(' ');
              }
              return String(risk);
            }).join('\n\n')}
            icon={AlertCircle}
          />
        )}

        {/* Next Steps */}
        {data.next_steps && Array.isArray(data.next_steps) && data.next_steps.length > 0 && (
          <OutputCard
            title="Immediate Next Steps"
            content={data.next_steps.map((step, idx) => {
              if (typeof step === 'string') return `${idx + 1}. ${step}`;
              if (typeof step === 'object' && step !== null) {
                const parts = [];
                if (step.step || step.action) parts.push(step.step || step.action);
                if (step.timeline) parts.push(`(${step.timeline})`);
                if (step.priority) parts.push(`[${step.priority} priority]`);
                return `${idx + 1}. ${parts.join(' ')}`;
              }
              return `${idx + 1}. ${String(step)}`;
            }).join('\n\n')}
            icon={Target}
          />
        )}

        {/* Success Metrics */}
        {data.success_metrics && Array.isArray(data.success_metrics) && data.success_metrics.length > 0 && (
          <OutputCard
            title="Success Metrics"
            content={data.success_metrics.map(metric => {
              if (typeof metric === 'string') return metric;
              if (typeof metric === 'object' && metric !== null) {
                const parts = [];
                if (metric.metric) parts.push(metric.metric);
                if (metric.target) parts.push(`: ${metric.target}`);
                if (metric.timeframe) parts.push(`(${metric.timeframe})`);
                return parts.join(' ');
              }
              return String(metric);
            }).join('\n\n')}
            icon={TrendingUp}
          />
        )}

        {/* Fallback if no structured data */}
        {!data.executive_summary && (!data.key_risks || data.key_risks.length === 0) &&
         (!data.next_steps || data.next_steps.length === 0) && (!data.success_metrics || data.success_metrics.length === 0) && (
          <div className="text-center py-12 text-gray-400">
            <p>Overview insights are being processed...</p>
            <p className="text-sm mt-2">Try regenerating if this persists</p>
          </div>
        )}
      </div>

      {/* Chat Panel */}
      {showChat && (
        <AgentChatPanel
          agentType="overview"
          workspaceId={workspaceId}
          onClose={() => setShowChat(false)}
        />
      )}

      {/* Info Modals */}
      <InfoModal
        isOpen={activeModal === 'teams'}
        onClose={() => setActiveModal(null)}
        title="Active AI Teams"
      >
        <p className="mb-4">Your startup has 5 specialized AI teams working together:</p>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
              <Target className="text-blue-500" size={16} />
            </div>
            <div>
              <div className="font-semibold text-white">CEO Team</div>
              <div className="text-sm text-gray-400">Strategic vision, business model, competitive analysis</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="text-green-500" size={16} />
            </div>
            <div>
              <div className="font-semibold text-white">Finance Team</div>
              <div className="text-sm text-gray-400">Pricing, revenue projections, budget planning</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-pink-600/20 flex items-center justify-center flex-shrink-0">
              <Users className="text-pink-500" size={16} />
            </div>
            <div>
              <div className="font-semibold text-white">Marketing Team</div>
              <div className="text-sm text-gray-400">Brand positioning, customer acquisition, content strategy</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-orange-600/20 flex items-center justify-center flex-shrink-0">
              <Users className="text-orange-500" size={16} />
            </div>
            <div>
              <div className="font-semibold text-white">Sales Team</div>
              <div className="text-sm text-gray-400">Lead generation, sales playbook, customer profiles</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-cyan-600/20 flex items-center justify-center flex-shrink-0">
              <Activity className="text-cyan-500" size={16} />
            </div>
            <div>
              <div className="font-semibold text-white">Developer Team</div>
              <div className="text-sm text-gray-400">Tech stack, architecture, MVP features, timeline</div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-400">Click on each team's tab to see their detailed insights and recommendations.</p>
      </InfoModal>

      <InfoModal
        isOpen={activeModal === 'nextsteps'}
        onClose={() => setActiveModal(null)}
        title="Immediate Next Steps"
      >
        {data.next_steps && data.next_steps.length > 0 ? (
          <>
            <p className="mb-4">Here's what you should focus on right now to move your startup forward:</p>
            <div className="space-y-3">
              {data.next_steps.map((step, idx) => {
                const stepText = typeof step === 'string' ? step : (step.step || step.action || '');
                const timeline = typeof step === 'object' && step.timeline ? step.timeline : null;
                const priority = typeof step === 'object' && step.priority ? step.priority : null;

                return (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-green-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-green-500 text-sm font-bold">{idx + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-white">{stepText}</div>
                      {(timeline || priority) && (
                        <div className="flex gap-2 mt-1">
                          {timeline && <span className="text-xs px-2 py-0.5 bg-blue-600/20 text-blue-400 rounded">{timeline}</span>}
                          {priority && <span className="text-xs px-2 py-0.5 bg-orange-600/20 text-orange-400 rounded">{priority} priority</span>}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-sm text-gray-400">These actions are prioritized based on your startup's needs and market conditions.</p>
          </>
        ) : (
          <p className="text-gray-400">Your AI teams are still analyzing your startup to identify the best next steps. Check back in a moment!</p>
        )}
      </InfoModal>

      <InfoModal
        isOpen={activeModal === 'status'}
        onClose={() => setActiveModal(null)}
        title="Workspace Status"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-green-600/10 border border-green-600/30 rounded-lg">
            <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center">
              <Check className="text-green-500" size={24} />
            </div>
            <div>
              <div className="font-semibold text-white text-lg">Analysis Complete</div>
              <div className="text-sm text-gray-400">All teams have finished their analysis</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <span className="text-gray-300">Executive Summary</span>
              <span className="text-green-500 font-semibold">✓ Ready</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <span className="text-gray-300">Financial Model</span>
              <span className="text-green-500 font-semibold">✓ Ready</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <span className="text-gray-300">Go-to-Market Strategy</span>
              <span className="text-green-500 font-semibold">✓ Ready</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <span className="text-gray-300">Technical Architecture</span>
              <span className="text-green-500 font-semibold">✓ Ready</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <span className="text-gray-300">Sales Playbook</span>
              <span className="text-green-500 font-semibold">✓ Ready</span>
            </div>
          </div>

          <div className="mt-4 p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
            <div className="font-semibold text-white mb-2">💡 What's Next?</div>
            <p className="text-sm text-gray-400">
              Explore each team's insights using the tabs above. Download reports, chat with AI advisors, or start implementing your action plan.
            </p>
          </div>
        </div>
      </InfoModal>
    </div>
  );
}
export default OverviewSection;