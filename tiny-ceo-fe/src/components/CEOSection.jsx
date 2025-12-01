import { useState } from 'react';
import {
  TrendingUp,
  Target,
  FileText,
  BarChart3,
  Lightbulb,
  AlertTriangle,
  RefreshCw,
  MessageCircle
} from 'lucide-react';
import OutputCard from './OutputCard.jsx';
import AgentChatPanel from './AgentChatPanel.jsx';

// CEO Strategy Section
function CEOSection({ data, onRegenerate, workspaceId }) {
  const [showChat, setShowChat] = useState(false);

  // Loading state
  if (!data) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="text-indigo-500" size={28} />
            <h2 className="text-2xl font-bold text-white">CEO Strategy</h2>
          </div>
          <p className="text-gray-300">High-level strategy, competitive analysis, and growth planning.</p>
        </div>
        <div className="text-center py-12">
          <RefreshCw className="animate-spin text-indigo-500 mx-auto mb-4" size={48} />
          <p className="text-gray-400 text-lg">CEO Agent is analyzing your startup strategy...</p>
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
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Target className="text-indigo-500" size={28} />
            <h2 className="text-2xl font-bold text-white">CEO Strategy</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowChat(!showChat)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <MessageCircle size={16} />
              Chat with CEO
            </button>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Regenerate
              </button>
            )}
          </div>
        </div>
        <p className="text-gray-300">High-level strategy, competitive analysis, and growth planning.</p>
      </div>

      <div className="grid gap-4">
        {/* Competitive Analysis */}
        {data.competitive_analysis && Array.isArray(data.competitive_analysis) && data.competitive_analysis.length > 0 && (
          <OutputCard
            title="Competitive Analysis"
            content={data.competitive_analysis.map(comp => {
              const competitor = safeRender(comp.competitor, 'Competitor');
              const strength = safeRender(comp.strength, '');
              const weakness = safeRender(comp.weakness, '');
              const recommendation = safeRender(comp.recommendation, '');
              return `${competitor}: ${strength}. Weakness: ${weakness}. ${recommendation ? `Action: ${recommendation}` : ''}`;
            }).join('\n\n')}
            icon={BarChart3}
          />
        )}

        {/* Roadmap */}
        {data.roadmap && Array.isArray(data.roadmap) && data.roadmap.length > 0 && (
          <OutputCard
            title="Growth Roadmap"
            content={data.roadmap.map(phase => {
              const phaseName = safeRender(phase.phase, 'Phase');
              const timeline = safeRender(phase.timeline, '');
              const milestone = safeRender(phase.milestone, '');
              const objectives = Array.isArray(phase.objectives) ? phase.objectives.join(', ') : safeRender(phase.objectives, '');
              const success = safeRender(phase.success_criteria, '');
              const budget = safeRender(phase.budget, '');

              return `${phaseName}${timeline ? ` (${timeline})` : ''}: ${milestone}${objectives ? `\nObjectives: ${objectives}` : ''}${success ? `\nSuccess: ${success}` : ''}${budget ? `\nBudget: ${budget}` : ''}`;
            }).join('\n\n')}
            icon={FileText}
          />
        )}

        {/* Fundraising Strategy */}
        {data.fundraising && (
          <OutputCard
            title="Fundraising Strategy"
            content={(() => {
              const round = safeRender(data.fundraising.recommended_round || data.fundraising.target, '');
              const valuation = safeRender(data.fundraising.target_valuation || data.fundraising.valuation, '');
              const timeline = safeRender(data.fundraising.timeline, '');

              let content = '';
              if (round) content += `${round}\n`;
              if (valuation) content += `Valuation: ${valuation}\n`;
              if (timeline) content += `Timeline: ${timeline}\n`;

              if (data.fundraising.use_of_funds && typeof data.fundraising.use_of_funds === 'object') {
                content += '\nUse of Funds:\n';
                content += Object.entries(data.fundraising.use_of_funds).map(([key, val]) => {
                  if (typeof val === 'object' && val.percentage) {
                    return `${key.replace(/_/g, ' ').toUpperCase()}: ${val.percentage} - ${val.description || ''}`;
                  } else if (typeof val === 'string') {
                    return `${key.replace(/_/g, ' ').toUpperCase()}: ${val}`;
                  }
                  return '';
                }).filter(Boolean).join('\n');
              }

              const dilution = safeRender(data.fundraising.dilution_expectation || data.fundraising.dilution, '');
              if (dilution) content += `\n\nDilution: ${dilution}`;

              return content || 'Fundraising strategy being analyzed...';
            })()}
            icon={TrendingUp}
          />
        )}

        {/* Pivot Signals */}
        {data.pivot_signals && Array.isArray(data.pivot_signals) && data.pivot_signals.length > 0 && (
          <OutputCard
            title="Pivot Signals to Watch"
            content={data.pivot_signals.map(signal => {
              const severity = safeRender(signal.severity, 'Medium');
              const signalText = safeRender(signal.signal, '');
              const action = safeRender(signal.action, '');
              const timeline = safeRender(signal.timeline, '');

              return `[${severity}] ${signalText}${action ? `\nAction: ${action}` : ''}${timeline ? `\nEvaluate: ${timeline}` : ''}`;
            }).join('\n\n')}
            icon={AlertTriangle}
          />
        )}

        {/* Key Metrics */}
        {data.key_metrics && Array.isArray(data.key_metrics) && data.key_metrics.length > 0 && (
          <OutputCard
            title="Key Metrics to Track"
            content={data.key_metrics.map(metric => {
              const metricName = safeRender(metric.metric, '');
              const why = safeRender(metric.why_it_matters || metric.why, '');
              const target = safeRender(metric.target, '');
              const tracking = safeRender(metric.how_to_track || metric.tracking, '');

              return `${metricName}${why ? `: ${why}` : ''}${target ? `\nTarget: ${target}` : ''}${tracking ? `\nTracking: ${tracking}` : ''}`;
            }).join('\n\n')}
            icon={BarChart3}
          />
        )}

        {/* Strategic Recommendations */}
        {data.strategic_recommendations && (
          <OutputCard
            title="Strategic Recommendations"
            content={(() => {
              let content = '';

              if (data.strategic_recommendations.immediate_priorities && Array.isArray(data.strategic_recommendations.immediate_priorities)) {
                content += 'IMMEDIATE PRIORITIES:\n';
                content += data.strategic_recommendations.immediate_priorities.map(p => {
                  const priority = safeRender(p.priority, '');
                  const description = safeRender(p.description, '');
                  const impact = safeRender(p.impact, '');
                  return `${priority}${description ? `: ${description}` : ''}${impact ? ` (Impact: ${impact})` : ''}`;
                }).join('\n');
              }

              if (data.strategic_recommendations.competitive_advantages && Array.isArray(data.strategic_recommendations.competitive_advantages)) {
                if (content) content += '\n\n';
                content += 'COMPETITIVE ADVANTAGES:\n';
                content += data.strategic_recommendations.competitive_advantages.join('\n');
              }

              return content || 'Strategic recommendations being analyzed...';
            })()}
            icon={Lightbulb}
          />
        )}

        {/* Fallback if no data */}
        {(!data.competitive_analysis || data.competitive_analysis.length === 0) &&
         (!data.roadmap || data.roadmap.length === 0) &&
         !data.fundraising &&
         (!data.pivot_signals || data.pivot_signals.length === 0) &&
         (!data.key_metrics || data.key_metrics.length === 0) &&
         !data.strategic_recommendations && (
          <div className="text-center py-12 text-gray-400">
            <p>CEO strategy insights are being generated...</p>
            <p className="text-sm mt-2">This may take a moment with Gemini AI analysis</p>
          </div>
        )}
      </div>

      {/* Chat Panel */}
      {showChat && (
        <AgentChatPanel
          agentType="ceo"
          workspaceId={workspaceId}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}

export default CEOSection;
