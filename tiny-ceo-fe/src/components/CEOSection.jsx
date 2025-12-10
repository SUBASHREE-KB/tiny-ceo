import { useState } from 'react';
import {
  Target,
  TrendingUp,
  Zap,
  DollarSign,
  Users,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  MessageCircle,
  ArrowRight,
  Flame
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import AgentChatPanel from './AgentChatPanel.jsx';

// Priority Card Component
function PriorityCard({ priority, index }) {
  const impactColors = {
    CRITICAL: 'border-red-500 bg-red-500/10',
    HIGH: 'border-orange-500 bg-orange-500/10',
    MEDIUM: 'border-yellow-500 bg-yellow-500/10'
  };

  const impactBadges = {
    CRITICAL: 'bg-red-500 text-white',
    HIGH: 'bg-orange-500 text-white',
    MEDIUM: 'bg-yellow-500 text-black'
  };

  return (
    <div className={`relative border-2 ${impactColors[priority.impact]} rounded-2xl p-6 hover:scale-105 transition-all`}>
      <div className="absolute -top-3 -left-3 bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">
        {index + 1}
      </div>
      <div className="mb-3">
        <span className={`${impactBadges[priority.impact]} px-3 py-1 rounded-full text-xs font-bold`}>
          {priority.impact} PRIORITY
        </span>
      </div>
      <h3 className="text-white text-xl font-bold mb-2">{priority.title}</h3>
      <p className="text-gray-300 text-sm mb-4">{priority.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-400">
          <Clock size={16} />
          <span className="text-sm">{priority.timeline}</span>
        </div>
        <div className="text-green-400 text-sm font-semibold">{priority.progress}% Complete</div>
      </div>
      <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" style={{ width: `${priority.progress}%` }}></div>
      </div>
    </div>
  );
}

// Quick Win Card
function QuickWinCard({ win }) {
  const effortColors = {
    Low: 'text-green-400',
    Medium: 'text-yellow-400',
    High: 'text-orange-400'
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-indigo-500/50 transition-all">
      <div className="flex items-start gap-3">
        <div className="bg-indigo-600/20 p-2 rounded-lg">
          <Zap className="text-indigo-400" size={20} />
        </div>
        <div className="flex-1">
          <h4 className="text-white font-semibold text-sm mb-1">{win.action}</h4>
          <p className="text-gray-400 text-xs mb-2">{win.impact}</p>
          <span className={`${effortColors[win.effort]} text-xs font-semibold`}>Effort: {win.effort}</span>
        </div>
      </div>
    </div>
  );
}

// Milestone Card
function MilestoneCard({ milestone, isActive }) {
  return (
    <div className={`relative bg-gray-800/50 border ${isActive ? 'border-indigo-500' : 'border-gray-700'} rounded-xl p-5`}>
      {isActive && (
        <div className="absolute -top-2 -right-2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
          <Flame size={12} />
          NEXT
        </div>
      )}
      <div className="text-indigo-400 text-sm font-semibold mb-2">Month {milestone.month}</div>
      <h4 className="text-white font-bold text-lg mb-2">{milestone.title}</h4>
      <p className="text-gray-400 text-sm mb-3">{milestone.key_achievement}</p>
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-900/50 p-2 rounded text-center">
          <div className="text-blue-400 text-xs">Users</div>
          <div className="text-white font-bold">{milestone.metrics.users.toLocaleString()}</div>
        </div>
        <div className="bg-gray-900/50 p-2 rounded text-center">
          <div className="text-green-400 text-xs">MRR</div>
          <div className="text-white font-bold">${(milestone.metrics.mrr / 1000).toFixed(0)}K</div>
        </div>
        <div className="bg-gray-900/50 p-2 rounded text-center">
          <div className="text-purple-400 text-xs">Team</div>
          <div className="text-white font-bold">{milestone.metrics.team}</div>
        </div>
      </div>
    </div>
  );
}

// Custom Tooltip
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
        <p className="text-white font-semibold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// CEO Section Component
function CEOSection({ data, workspaceId }) {
  const [showChat, setShowChat] = useState(false);

  // Loading state
  if (!data) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="text-indigo-500" size={28} />
            <h2 className="text-2xl font-bold text-white">CEO Strategy Dashboard</h2>
          </div>
          <p className="text-gray-300">Strategic priorities, competitive analysis, and growth roadmap.</p>
        </div>
        <div className="text-center py-12">
          <Target className="animate-spin text-indigo-500 mx-auto mb-4" size={48} />
          <p className="text-gray-400 text-lg">Generating strategic insights...</p>
        </div>
      </div>
    );
  }

  const {
    strategic_priorities,
    growth_milestones,
    competitive_positioning,
    risk_dashboard,
    fundraising
  } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Target className="text-indigo-500" size={28} />
            <h2 className="text-2xl font-bold text-white">CEO Strategy Dashboard</h2>
          </div>
          <button
            onClick={() => setShowChat(!showChat)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all flex items-center gap-2"
          >
            <MessageCircle size={16} />
            Chat with CEO
          </button>
        </div>
        <p className="text-gray-300">Strategic priorities, growth roadmap, and competitive positioning.</p>
      </div>

      {/* Top 3 Strategic Priorities */}
      {strategic_priorities && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-indigo-400" size={24} />
            <h3 className="text-2xl font-bold text-white">Top 3 Strategic Priorities</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {strategic_priorities.top_3_priorities?.map((priority, index) => (
              <PriorityCard key={index} priority={priority} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Quick Wins */}
      {strategic_priorities && strategic_priorities.quick_wins && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-yellow-400" size={24} />
            <h3 className="text-xl font-bold text-white">Quick Wins (Do This Week!)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategic_priorities.quick_wins?.map((win, index) => (
              <QuickWinCard key={index} win={win} />
            ))}
          </div>
        </div>
      )}

      {/* Growth Milestones Timeline */}
      {growth_milestones && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-green-400" size={24} />
                <h3 className="text-xl font-bold text-white">12-Month Growth Roadmap</h3>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Current: </span>
                <span className="text-indigo-400 font-semibold">{growth_milestones.current_stage}</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Next Milestone: {growth_milestones.next_milestone}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {growth_milestones.milestones?.map((milestone, index) => (
              <MilestoneCard key={index} milestone={milestone} isActive={index === 0} />
            ))}
          </div>
        </div>
      )}

      {/* Competitive Positioning & Fundraising */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competitive Advantages */}
        {competitive_positioning && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-yellow-400" size={24} />
              <h3 className="text-xl font-bold text-white">Your Competitive Advantages</h3>
            </div>
            <div className="space-y-3">
              {competitive_positioning.your_advantages?.map((adv, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-300 text-sm font-semibold">{adv.advantage}</span>
                    <span className="text-green-400 font-bold">{adv.strength}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                      style={{ width: `${adv.strength}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fundraising Snapshot */}
        {fundraising && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="text-green-400" size={24} />
              <h3 className="text-xl font-bold text-white">Fundraising Strategy</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <div className="text-gray-400 text-xs mb-1">Target Round</div>
                <div className="text-white text-lg font-bold">{fundraising.recommended_round || 'Seed: $750K - $1.5M'}</div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <div className="text-gray-400 text-xs mb-1">Valuation</div>
                <div className="text-white text-lg font-bold">{fundraising.target_valuation || '$4M - $6M pre-money'}</div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <div className="text-gray-400 text-xs mb-1">Timeline</div>
                <div className="text-white text-lg font-bold">{fundraising.timeline || '3-6 months'}</div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <div className="text-gray-400 text-xs mb-1">Expected Dilution</div>
                <div className="text-orange-400 text-lg font-bold">{fundraising.dilution_expectation || '15-25%'}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Risk Dashboard */}
      {risk_dashboard && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-red-400" size={24} />
                <h3 className="text-xl font-bold text-white">Risk Assessment</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Overall Risk:</span>
                <span className="text-yellow-400 font-bold">{risk_dashboard.risk_rating}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {risk_dashboard.risk_factors?.map((category, index) => (
              <div key={index} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <h4 className="text-white font-semibold mb-3">{category.category}</h4>
                <div className="space-y-3">
                  {category.risks?.map((risk, rIndex) => (
                    <div key={rIndex} className="text-sm">
                      <div className="flex items-start gap-2 mb-1">
                        <AlertTriangle size={14} className={`mt-0.5 ${
                          risk.likelihood === 'High' || risk.likelihood === 'Critical' ? 'text-red-400' :
                          risk.likelihood === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                        }`} />
                        <div className="flex-1">
                          <div className="text-gray-300 font-medium">{risk.risk}</div>
                          <div className="text-gray-500 text-xs mt-1">{risk.mitigation}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market Gaps (Opportunities) */}
      {competitive_positioning && competitive_positioning.market_gaps && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-indigo-400" size={24} />
            <h3 className="text-xl font-bold text-white">Market Opportunities</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {competitive_positioning.market_gaps?.map((gap, index) => (
              <div key={index} className="bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="text-green-400" size={20} />
                  <span className={`text-xs font-bold ${
                    gap.opportunity === 'High' ? 'text-green-400' :
                    gap.opportunity === 'Medium' ? 'text-yellow-400' : 'text-blue-400'
                  }`}>{gap.opportunity.toUpperCase()} OPPORTUNITY</span>
                </div>
                <p className="text-white font-semibold">{gap.gap}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market Opportunity Analysis */}
      {data.market_opportunity && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Market Opportunity Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/30 rounded-lg p-4">
              <div className="text-blue-400 text-xs mb-1">TAM</div>
              <div className="text-white text-2xl font-bold mb-1">{data.market_opportunity.market_size?.tam?.value}</div>
              <div className="text-gray-400 text-xs">{data.market_opportunity.market_size?.tam?.description}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/30 rounded-lg p-4">
              <div className="text-purple-400 text-xs mb-1">SAM</div>
              <div className="text-white text-2xl font-bold mb-1">{data.market_opportunity.market_size?.sam?.value}</div>
              <div className="text-gray-400 text-xs">{data.market_opportunity.market_size?.sam?.description}</div>
            </div>
            <div className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 border border-green-500/30 rounded-lg p-4">
              <div className="text-green-400 text-xs mb-1">SOM</div>
              <div className="text-white text-2xl font-bold mb-1">{data.market_opportunity.market_size?.som?.value}</div>
              <div className="text-gray-400 text-xs">{data.market_opportunity.market_size?.som?.description}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Key Market Drivers</h4>
              <ul className="space-y-2 text-sm">
                {data.market_opportunity.market_dynamics?.key_drivers?.map((driver, i) => (
                  <li key={i} className="text-gray-300 flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-400 mt-0.5" />
                    <span>{driver}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <h4 className="text-white font-semibold mb-3">Market Trends</h4>
              <ul className="space-y-2 text-sm">
                {data.market_opportunity.market_dynamics?.market_trends?.map((trend, i) => (
                  <li key={i} className="text-gray-300 flex items-start gap-2">
                    <TrendingUp size={16} className="text-blue-400 mt-0.5" />
                    <span>{trend}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SWOT Analysis */}
      {data.swot_analysis && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">SWOT Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="bg-green-600/10 border border-green-500/30 rounded-lg p-4">
              <h4 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                <Award size={20} />
                Strengths
              </h4>
              <ul className="space-y-2">
                {data.swot_analysis.strengths?.map((item, i) => (
                  <li key={i} className="text-sm">
                    <div className="text-white font-semibold">{item.item}</div>
                    <div className="text-gray-400 text-xs">{item.description}</div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-red-600/10 border border-red-500/30 rounded-lg p-4">
              <h4 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                <AlertTriangle size={20} />
                Weaknesses
              </h4>
              <ul className="space-y-2">
                {data.swot_analysis.weaknesses?.map((item, i) => (
                  <li key={i} className="text-sm">
                    <div className="text-white font-semibold">{item.item}</div>
                    <div className="text-gray-400 text-xs">{item.description}</div>
                    <div className="text-green-400 text-xs mt-1">→ {item.mitigation}</div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="bg-blue-600/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                <TrendingUp size={20} />
                Opportunities
              </h4>
              <ul className="space-y-2">
                {data.swot_analysis.opportunities?.map((item, i) => (
                  <li key={i} className="text-sm">
                    <div className="text-white font-semibold">{item.item}</div>
                    <div className="text-gray-400 text-xs">{item.timeframe} • {item.action}</div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Threats */}
            <div className="bg-orange-600/10 border border-orange-500/30 rounded-lg p-4">
              <h4 className="text-orange-400 font-bold mb-3 flex items-center gap-2">
                <AlertTriangle size={20} />
                Threats
              </h4>
              <ul className="space-y-2">
                {data.swot_analysis.threats?.map((item, i) => (
                  <li key={i} className="text-sm">
                    <div className="text-white font-semibold">{item.item}</div>
                    <div className="text-gray-400 text-xs">Likelihood: {item.likelihood}</div>
                    <div className="text-green-400 text-xs mt-1">→ {item.response}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Vision & Mission */}
      {data.vision_mission && (
        <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Vision & Mission</h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="text-indigo-400" size={20} />
                <h4 className="text-indigo-400 font-bold">Our Vision</h4>
              </div>
              <p className="text-white text-lg mb-3 italic">"{data.vision_mission.vision?.statement}"</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.vision_mission.vision?.success_looks_like?.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle size={16} className="text-green-400 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-indigo-500/30 pt-6">
              <div className="flex items-center gap-2 mb-3">
                <Target className="text-purple-400" size={20} />
                <h4 className="text-purple-400 font-bold">Our Mission</h4>
              </div>
              <p className="text-white text-lg mb-3 italic">"{data.vision_mission.mission?.statement}"</p>
            </div>

            <div className="border-t border-indigo-500/30 pt-6">
              <h4 className="text-white font-bold mb-3">Core Values</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.vision_mission.core_values?.map((value, i) => (
                  <div key={i} className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                    <div className="text-indigo-400 font-semibold text-sm mb-1">{value.value}</div>
                    <div className="text-gray-400 text-xs">{value.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Partnerships */}
      {data.key_partnerships && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Strategic Partnerships</h3>
          <div className="space-y-6">
            {/* Integration Partners */}
            {data.key_partnerships.integration_partners && (
              <div>
                <h4 className="text-white font-semibold mb-3">Integration Partners</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {data.key_partnerships.integration_partners?.map((partner, i) => (
                    <div key={i} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="text-white font-semibold">{partner.partner}</h5>
                        <span className={`text-xs font-bold ${
                          partner.priority === 'Critical' ? 'text-red-400' :
                          partner.priority === 'High' ? 'text-orange-400' : 'text-yellow-400'
                        }`}>{partner.priority}</span>
                      </div>
                      <p className="text-gray-400 text-xs mb-2">{partner.why}</p>
                      <div className="text-green-400 text-xs">{partner.timeline}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technology Partners */}
            {data.key_partnerships.technology_partners && (
              <div>
                <h4 className="text-white font-semibold mb-3">Technology Partners</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.key_partnerships.technology_partners?.map((partner, i) => (
                    <div key={i} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="text-white font-semibold">{partner.partner}</h5>
                        <span className="text-xs font-bold text-red-400">{partner.priority}</span>
                      </div>
                      <p className="text-gray-400 text-xs">{partner.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
