import { useState } from 'react';
import {
  Check,
  MessageCircle,
  AlertTriangle,
  Target,
  TrendingUp,
  Users,
  Rocket,
  Clock,
  DollarSign,
  BarChart3,
  Code,
  ChevronRight,
  Star,
  Zap,
  CheckCircle2
} from 'lucide-react';
import AgentChatPanel from './AgentChatPanel.jsx';

// Overview Section
function OverviewSection({ ideaTitle, data, workspaceId }) {
  const [showChat, setShowChat] = useState(false);

  // Loading state
  if (!data) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center animate-pulse">
              <Star className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Analyzing Your Startup...</h2>
              <p className="text-purple-300 text-sm mt-1">Generating insights and strategy</p>
            </div>
          </div>
          <p className="text-gray-300">Your AI team is creating a comprehensive analysis of your idea...</p>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin text-purple-500 mx-auto mb-4">
            <Rocket size={48} />
          </div>
          <p className="text-gray-400 text-lg">Generating comprehensive analysis...</p>
        </div>
      </div>
    );
  }

  const summary = data.executive_summary || {};

  // Use startup name if available, otherwise use ideaTitle
  const displayName = summary.startup_name || ideaTitle;
  const displayTagline = summary.tagline || summary.one_sentence_pitch || 'Your startup analysis is ready';

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Star className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-white tracking-tight">{displayName}</h2>
                {summary.startup_name && (
                  <p className="text-purple-300 text-sm mt-1 italic">{displayTagline}</p>
                )}
              </div>
            </div>
            <p className="text-lg text-gray-300 font-medium mb-3">
              {summary.one_sentence_pitch || displayTagline}
            </p>
            {summary.opportunity_overview && (
              <p className="text-gray-400 leading-relaxed">
                {summary.opportunity_overview}
              </p>
            )}
          </div>
          <button
            onClick={() => setShowChat(!showChat)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all flex items-center gap-2 flex-shrink-0 ml-4"
          >
            <MessageCircle size={16} />
            Ask Questions
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="text-green-500" size={18} />
              <div className="text-sm text-gray-400">Market Size</div>
            </div>
            <div className="text-xl font-bold text-white">
              {summary.market_context?.market_size || 'Analyzing...'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {summary.market_context?.growth_rate || 'Growth pending'}
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="text-blue-500" size={18} />
              <div className="text-sm text-gray-400">Year 1 ARR</div>
            </div>
            <div className="text-xl font-bold text-white">
              {summary.financial_highlights?.year_1_arr || 'Calculating...'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Break-even: {summary.financial_highlights?.breakeven || 'TBD'}
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="text-purple-500" size={18} />
              <div className="text-sm text-gray-400">Unit Economics</div>
            </div>
            <div className="text-xl font-bold text-white">
              {summary.financial_highlights?.unit_economics || 'Analyzing...'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {summary.business_model?.gross_margin || 'Margins pending'}
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center gap-2 mb-1">
              <Rocket className="text-orange-500" size={18} />
              <div className="text-sm text-gray-400">Funding Need</div>
            </div>
            <div className="text-xl font-bold text-white">
              {summary.financial_highlights?.funding_need || 'Calculating...'}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              For {summary.financial_highlights?.breakeven || '12 months'}
            </div>
          </div>
        </div>
      </div>

      {/* YOUR NEXT STEPS - Prominent Section */}
      <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 border-2 border-green-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
            <Rocket className="text-green-500" size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Your Action Plan</h3>
            <p className="text-gray-400">Start here to launch your startup</p>
          </div>
        </div>

        {data.next_steps && data.next_steps.length > 0 ? (
          <div className="space-y-3">
            {data.next_steps.slice(0, 8).map((step, idx) => {
              const stepData = typeof step === 'string' ? { step } : step;
              const isPriority = stepData.priority === 'High' || idx < 3;

              return (
                <div
                  key={idx}
                  className={`group relative bg-gray-900/50 hover:bg-gray-900/80 rounded-xl p-4 border transition-all cursor-pointer ${
                    isPriority
                      ? 'border-green-500/50 hover:border-green-500'
                      : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Step Number */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-lg ${
                        isPriority
                          ? 'bg-green-600/20 text-green-500 border border-green-500/30'
                          : 'bg-gray-800 text-gray-400 border border-gray-700'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-lg mb-1">
                            {stepData.step || stepData.action}
                          </h4>
                          {stepData.why && (
                            <p className="text-gray-400 text-sm mb-2">
                              {stepData.why}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {stepData.priority && (
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  stepData.priority === 'High'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : stepData.priority === 'Medium'
                                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                    : 'bg-gray-700 text-gray-400 border border-gray-600'
                                }`}
                              >
                                {stepData.priority} Priority
                              </span>
                            )}
                            {stepData.timeline && (
                              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs border border-blue-500/30">
                                <Clock size={12} className="inline mr-1" />
                                {stepData.timeline}
                              </span>
                            )}
                            {stepData.owner && (
                              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs border border-purple-500/30">
                                <Users size={12} className="inline mr-1" />
                                {stepData.owner}
                              </span>
                            )}
                          </div>
                          {stepData.dependencies && stepData.dependencies.length > 0 && (
                            <div className="mt-2 text-xs text-gray-500">
                              <span className="font-medium">Depends on:</span> {stepData.dependencies.join(', ')}
                            </div>
                          )}
                        </div>
                        <ChevronRight className="text-gray-600 group-hover:text-green-500 transition-colors flex-shrink-0 mt-1" size={20} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Target className="mx-auto mb-3 text-gray-600" size={40} />
            <p>Action plan is being generated...</p>
            <p className="text-sm mt-2">Check back in a moment or regenerate the overview</p>
          </div>
        )}
      </div>

      {/* Two Column Layout for Strengths/Challenges and Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths & Challenges */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-yellow-500" size={20} />
            <h3 className="text-xl font-bold text-white">Key Insights</h3>
          </div>

          {/* Strengths */}
          {summary.key_strengths && summary.key_strengths.length > 0 && (
            <div className="mb-6">
              <div className="text-green-400 font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 size={18} />
                Strengths
              </div>
              <div className="space-y-2">
                {summary.key_strengths.slice(0, 5).map((strength, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                    <Check className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Challenges */}
          {summary.key_challenges && summary.key_challenges.length > 0 && (
            <div>
              <div className="text-orange-400 font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle size={18} />
                Challenges to Address
              </div>
              <div className="space-y-2">
                {summary.key_challenges.slice(0, 5).map((challenge, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                    <AlertTriangle className="text-orange-500 flex-shrink-0 mt-0.5" size={16} />
                    <span>{challenge}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!summary.key_strengths && !summary.key_challenges && (
            <div className="text-center py-8 text-gray-500">
              <Zap className="mx-auto mb-2 text-gray-700" size={32} />
              <p className="text-sm">Analysis in progress...</p>
            </div>
          )}
        </div>

        {/* Key Risks */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-red-500" size={20} />
            <h3 className="text-xl font-bold text-white">Risk Management</h3>
          </div>

          {data.key_risks && data.key_risks.length > 0 ? (
            <div className="space-y-3">
              {data.key_risks.slice(0, 6).map((risk, idx) => {
                const riskData = typeof risk === 'string' ? { risk } : risk;
                const severity = riskData.severity || 'Medium';

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${
                      severity === 'Critical'
                        ? 'bg-red-500/10 border-red-500/30'
                        : severity === 'High'
                        ? 'bg-orange-500/10 border-orange-500/30'
                        : 'bg-yellow-500/10 border-yellow-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          severity === 'Critical'
                            ? 'bg-red-500/20 text-red-400'
                            : severity === 'High'
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {severity}
                      </span>
                      {riskData.source_team && (
                        <span className="px-2 py-0.5 bg-gray-700 text-gray-400 rounded text-xs">
                          {riskData.source_team}
                        </span>
                      )}
                    </div>
                    <div className="text-white text-sm font-medium mb-1">
                      {riskData.risk}
                    </div>
                    {riskData.mitigation && (
                      <div className="text-gray-400 text-xs">
                        <span className="font-medium text-gray-300">Mitigation:</span> {riskData.mitigation}
                      </div>
                    )}
                    {riskData.when_to_address && (
                      <div className="text-xs text-gray-500 mt-1">
                        Address: {riskData.when_to_address}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="mx-auto mb-2 text-gray-700" size={32} />
              <p className="text-sm">Risk analysis in progress...</p>
            </div>
          )}
        </div>
      </div>

      {/* Success Metrics */}
      {data.success_metrics && data.success_metrics.length > 0 && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-cyan-500" size={20} />
            <h3 className="text-xl font-bold text-white">Success Metrics to Track</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.success_metrics.map((metric, idx) => {
              const metricData = typeof metric === 'string' ? { metric } : metric;

              return (
                <div key={idx} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="text-cyan-400 font-semibold mb-1">
                    {metricData.metric}
                  </div>
                  {metricData.target && (
                    <div className="text-white text-2xl font-bold mb-1">
                      {metricData.target}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    {metricData.timeframe && (
                      <span className="px-2 py-0.5 bg-gray-700 rounded">
                        {metricData.timeframe}
                      </span>
                    )}
                    {metricData.source && (
                      <span className="text-gray-500">via {metricData.source}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Business Model Summary */}
      {summary.market_context && summary.business_model && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Code className="text-blue-500" size={20} />
            <h3 className="text-xl font-bold text-white">Business Model Overview</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-gray-400 text-sm mb-2">Market</div>
              <div className="space-y-1">
                {summary.market_context.industry && (
                  <div className="text-white">
                    <span className="text-gray-500 text-sm">Industry:</span> {summary.market_context.industry}
                  </div>
                )}
                {summary.market_context.competitive_position && (
                  <div className="text-white">
                    <span className="text-gray-500 text-sm">Position:</span> {summary.market_context.competitive_position}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="text-gray-400 text-sm mb-2">Revenue Model</div>
              <div className="space-y-1">
                {summary.business_model.revenue_model && (
                  <div className="text-white">
                    <span className="text-gray-500 text-sm">Model:</span> {summary.business_model.revenue_model}
                  </div>
                )}
                {summary.business_model.primary_tier && (
                  <div className="text-white">
                    <span className="text-gray-500 text-sm">Primary Tier:</span> {summary.business_model.primary_tier}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="text-gray-400 text-sm mb-2">Distribution</div>
              <div className="space-y-1">
                {summary.business_model.distribution && (
                  <div className="text-white text-sm">
                    {summary.business_model.distribution}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Explore Teams CTA */}
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Dive Deeper into Each Area</h3>
            <p className="text-gray-400">Explore detailed insights from each specialized team</p>
          </div>
          <div className="flex items-center gap-2">
            <ChevronRight className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
          <div className="bg-gray-900/50 rounded-lg p-3 text-center border border-gray-800 hover:border-blue-500/50 transition-all cursor-pointer">
            <Target className="text-indigo-500 mx-auto mb-1" size={24} />
            <div className="text-white text-sm font-medium">CEO Team</div>
            <div className="text-gray-500 text-xs">Strategy</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center border border-gray-800 hover:border-green-500/50 transition-all cursor-pointer">
            <DollarSign className="text-green-500 mx-auto mb-1" size={24} />
            <div className="text-white text-sm font-medium">Finance</div>
            <div className="text-gray-500 text-xs">Projections</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center border border-gray-800 hover:border-pink-500/50 transition-all cursor-pointer">
            <TrendingUp className="text-pink-500 mx-auto mb-1" size={24} />
            <div className="text-white text-sm font-medium">Marketing</div>
            <div className="text-gray-500 text-xs">GTM</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center border border-gray-800 hover:border-orange-500/50 transition-all cursor-pointer">
            <Users className="text-orange-500 mx-auto mb-1" size={24} />
            <div className="text-white text-sm font-medium">Sales</div>
            <div className="text-gray-500 text-xs">Playbook</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-3 text-center border border-gray-800 hover:border-cyan-500/50 transition-all cursor-pointer">
            <Code className="text-cyan-500 mx-auto mb-1" size={24} />
            <div className="text-white text-sm font-medium">Developer</div>
            <div className="text-gray-500 text-xs">Tech & Code</div>
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      {showChat && (
        <AgentChatPanel
          agentType="overview"
          workspaceId={workspaceId}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}

export default OverviewSection;
