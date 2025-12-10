import { useState } from 'react';
import {
  Users,
  Target,
  TrendingUp,
  Phone,
  Mail,
  BarChart3,
  MessageCircle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  FunnelChart,
  Funnel
} from 'recharts';
import AgentChatPanel from './AgentChatPanel.jsx';

// KPI Card Component
function SalesKPICard({ title, value, change, icon: Icon, trend }) {
  const isPositive = trend === 'up';

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-orange-500/50 transition-all">
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 bg-orange-600/20 rounded-lg">
          <Icon className="text-orange-500" size={20} />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            <span>{change}</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-white text-2xl font-bold">{value}</p>
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
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// Sales Section Component
function SalesSection({ data, workspaceId }) {
  const [showChat, setShowChat] = useState(false);

  // Loading state
  if (!data) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border border-orange-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-orange-500" size={28} />
            <h2 className="text-2xl font-bold text-white">Sales Dashboard</h2>
          </div>
          <p className="text-gray-300">Lead generation, pipeline tracking, and conversion optimization.</p>
        </div>
        <div className="text-center py-12">
          <Users className="animate-spin text-orange-500 mx-auto mb-4" size={48} />
          <p className="text-gray-400 text-lg">Generating sales strategy and metrics...</p>
        </div>
      </div>
    );
  }

  const {
    sales_funnel_data,
    pipeline_metrics,
    conversion_data,
    lead_sources_performance,
    sales_activities,
    icp,
    objection_handling
  } = data;

  const COLORS = ['#f97316', '#eab308', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border border-orange-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Users className="text-orange-500" size={28} />
            <h2 className="text-2xl font-bold text-white">Sales Dashboard</h2>
          </div>
          <button
            onClick={() => setShowChat(!showChat)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-all flex items-center gap-2"
          >
            <MessageCircle size={16} />
            Chat with Sales
          </button>
        </div>
        <p className="text-gray-300">Real-time sales metrics, pipeline tracking, and conversion optimization.</p>
      </div>

      {/* KPI Cards */}
      {pipeline_metrics && conversion_data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SalesKPICard
            title="Pipeline Value"
            value={`$${pipeline_metrics.current_pipeline?.total_value?.toLocaleString() || '0'}`}
            change="+18%"
            icon={TrendingUp}
            trend="up"
          />
          <SalesKPICard
            title="Win Rate"
            value={conversion_data.overall_metrics?.win_rate || '0%'}
            change="+4%"
            icon={Target}
            trend="up"
          />
          <SalesKPICard
            title="Avg Deal Size"
            value={`$${pipeline_metrics.current_pipeline?.avg_deal_size?.toLocaleString() || '0'}`}
            change="+8%"
            icon={BarChart3}
            trend="up"
          />
          <SalesKPICard
            title="Sales Cycle"
            value={`${conversion_data.overall_metrics?.sales_cycle_days || '0'} days`}
            change="-5 days"
            icon={Users}
            trend="up"
          />
        </div>
      )}

      {/* Sales Funnel */}
      {sales_funnel_data && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Sales Funnel</h3>
            <p className="text-gray-400 text-sm">
              Conversion through each stage of the sales process
            </p>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="text-blue-400">Total Visitors: {sales_funnel_data.summary?.total_visitors?.toLocaleString()}</span>
              <span className="text-green-400">Customers: {sales_funnel_data.summary?.total_customers}</span>
              <span className="text-orange-400">Overall Conversion: {sales_funnel_data.summary?.overall_conversion}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sales_funnel_data.stages?.map((stage, index) => (
              <div key={index} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 text-center">
                <div className="text-gray-400 text-xs mb-2">{stage.stage}</div>
                <div className="text-white text-2xl font-bold mb-1">{stage.count.toLocaleString()}</div>
                <div className="text-sm" style={{ color: stage.color }}>{stage.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conversion Rates & Pipeline Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Rates */}
        {conversion_data && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Conversion Rates</h3>
            <div className="space-y-4">
              {conversion_data.conversion_rates?.map((conv, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 text-sm">{conv.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{conv.current}%</span>
                      <span className="text-gray-400 text-xs">/ {conv.target}%</span>
                      {conv.status === 'above' && <CheckCircle size={16} className="text-green-400" />}
                      {conv.status === 'below' && <AlertCircle size={16} className="text-red-400" />}
                      {conv.status === 'on-track' && <CheckCircle size={16} className="text-blue-400" />}
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        conv.status === 'above' ? 'bg-green-500' :
                        conv.status === 'below' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`}
                      style={{ width: `${(conv.current / conv.target) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pipeline Growth */}
        {pipeline_metrics && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">Pipeline Growth</h3>
              <p className="text-gray-400 text-sm">Monthly pipeline value and deals closed</p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={pipeline_metrics.monthly_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="deals_closed" fill="#f97316" name="Deals Closed" />
                <Line type="monotone" dataKey="pipeline_value" stroke="#10b981" strokeWidth={2} name="Pipeline Value ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Lead Sources Performance */}
      {lead_sources_performance && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Lead Sources Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Source</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">Leads</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">Cost/Lead</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">Converted</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">Conv %</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">ROI</th>
                </tr>
              </thead>
              <tbody>
                {lead_sources_performance.sources?.map((source, index) => (
                  <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <td className="py-3 px-4 text-white font-medium">{source.name}</td>
                    <td className="py-3 px-4 text-right text-blue-400">{source.leads}</td>
                    <td className="py-3 px-4 text-right text-gray-300">${source.cost_per_lead}</td>
                    <td className="py-3 px-4 text-right text-green-400">{source.converted}</td>
                    <td className="py-3 px-4 text-right text-gray-300">{source.conversion_rate}%</td>
                    <td className="py-3 px-4 text-right text-orange-400 font-semibold">{source.roi}%</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-600 font-bold">
                  <td className="py-3 px-4 text-white">TOTAL</td>
                  <td className="py-3 px-4 text-right text-blue-400">{lead_sources_performance.total_leads}</td>
                  <td className="py-3 px-4 text-right text-gray-300">${lead_sources_performance.blended_cac}</td>
                  <td className="py-3 px-4 text-right text-green-400">{lead_sources_performance.total_converted}</td>
                  <td className="py-3 px-4 text-right text-gray-300">{lead_sources_performance.avg_conversion}%</td>
                  <td className="py-3 px-4 text-right text-gray-300">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sales Activities & ICP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Activities */}
        {sales_activities && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">Weekly Sales Activities</h3>
              <p className="text-gray-400 text-sm">Calls, emails, demos, and closed deals</p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={sales_activities.weekly_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="week" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="calls_made" stroke="#3b82f6" strokeWidth={2} name="Calls" />
                <Line type="monotone" dataKey="demos_completed" stroke="#10b981" strokeWidth={2} name="Demos" />
                <Line type="monotone" dataKey="deals_closed" stroke="#f97316" strokeWidth={2} name="Deals Closed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ICP Summary */}
        {icp && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Ideal Customer Profile</h3>
            <div className="space-y-3">
              <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                <div className="text-gray-400 text-xs mb-1">Company Size</div>
                <div className="text-white font-semibold">{icp.firmographics?.employee_count || '10-500 employees'}</div>
              </div>
              <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                <div className="text-gray-400 text-xs mb-1">Annual Budget</div>
                <div className="text-white font-semibold">{icp.firmographics?.budget || '$5K-$50K'}</div>
              </div>
              <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                <div className="text-gray-400 text-xs mb-1">Decision Process</div>
                <div className="text-white font-semibold">{icp.firmographics?.decision_process || 'Manager → Director/VP'}</div>
              </div>
              <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                <div className="text-gray-400 text-xs mb-1">Buying Cycle</div>
                <div className="text-white font-semibold">{icp.firmographics?.buying_cycle || '30-90 days'}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Objection Handling */}
      {objection_handling && objection_handling.length > 0 && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Common Objections & Responses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {objection_handling.slice(0, 6).map((obj, index) => (
              <div key={index} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <div className="flex items-start gap-2 mb-2">
                  <div className="bg-orange-600/20 p-1 rounded">
                    <MessageCircle size={16} className="text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-semibold text-sm mb-1">"{obj.objection}"</div>
                    <div className="text-gray-400 text-xs">{obj.response}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sales Team & Hiring Roadmap */}
      {data.sales_team_structure && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Sales Team & Hiring Roadmap</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.sales_team_structure.hiring_roadmap?.map((hire, index) => (
              <div key={index} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <div className="text-orange-400 text-sm font-semibold mb-2">Month {hire.month}</div>
                <h4 className="text-white font-bold mb-2">{hire.role}</h4>
                <div className="space-y-2 text-xs">
                  <div><span className="text-gray-400">Why:</span> <span className="text-gray-300">{hire.why}</span></div>
                  <div><span className="text-gray-400">Salary:</span> <span className="text-green-400">{hire.salary}</span></div>
                  <div><span className="text-gray-400">Quota:</span> <span className="text-blue-400">{hire.quota}</span></div>
                  <div><span className="text-gray-400">Ramp:</span> <span className="text-gray-300">{hire.ramp_time}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buyer Journey */}
      {data.buyer_journey && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Buyer Journey Stages</h3>
          <div className="space-y-4">
            {data.buyer_journey.stages?.map((stage, index) => (
              <div key={index} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-white font-bold text-lg">{index + 1}. {stage.stage}</h4>
                    <p className="text-gray-400 text-sm">{stage.buyer_state}</p>
                  </div>
                  <span className="text-orange-400 text-sm font-semibold">{stage.duration}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="text-gray-400 font-semibold mb-1">Touchpoints:</div>
                    <div className="text-gray-300">{stage.touchpoints.join(', ')}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 font-semibold mb-1">Content Needed:</div>
                    <div className="text-gray-300">{stage.content_needed.join(', ')}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 font-semibold mb-1">Sales Action:</div>
                    <div className="text-green-400">{stage.sales_action}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sales Tools Stack */}
      {data.sales_tools_stack && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Sales Tools & Tech Stack</h3>
          <div className="space-y-4">
            {data.sales_tools_stack.categories?.map((category, index) => (
              <div key={index}>
                <h4 className="text-white font-semibold mb-3">{category.category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {category.tools?.map((tool, tIndex) => (
                    <div key={tIndex} className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-white font-semibold text-sm">{tool.tool}</span>
                        <span className={`text-xs font-bold ${
                          tool.priority === 'Critical' ? 'text-red-400' :
                          tool.priority === 'High' ? 'text-orange-400' :
                          tool.priority === 'Medium' ? 'text-yellow-400' : 'text-gray-400'
                        }`}>{tool.priority}</span>
                      </div>
                      <p className="text-gray-400 text-xs mb-2">{tool.purpose}</p>
                      <span className="text-green-400 text-xs font-semibold">{tool.cost}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <h5 className="text-white font-semibold mb-2">Total Monthly Cost:</h5>
            <div className="flex gap-4 text-sm">
              <span className="text-gray-300">Essential: <span className="text-green-400 font-semibold">{data.sales_tools_stack.total_monthly_cost?.essential}</span></span>
              <span className="text-gray-300">Recommended: <span className="text-blue-400 font-semibold">{data.sales_tools_stack.total_monthly_cost?.recommended}</span></span>
              <span className="text-gray-300">Advanced: <span className="text-orange-400 font-semibold">{data.sales_tools_stack.total_monthly_cost?.advanced}</span></span>
            </div>
          </div>
        </div>
      )}

      {/* Competitor Battlecards */}
      {data.competitor_battlecards && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Competitor Battlecards</h3>
          <div className="space-y-4">
            {data.competitor_battlecards.competitors?.map((comp, index) => (
              <div key={index} className="bg-gray-900/50 p-5 rounded-lg border border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-white font-bold text-lg">{comp.name}</h4>
                    <p className="text-gray-400 text-sm">{comp.market_position} • {comp.pricing}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-green-400 font-semibold text-sm mb-2">Their Strengths:</div>
                    <ul className="text-gray-300 text-xs space-y-1">
                      {comp.strengths?.map((s, i) => <li key={i}>• {s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="text-red-400 font-semibold text-sm mb-2">Their Weaknesses:</div>
                    <ul className="text-gray-300 text-xs space-y-1">
                      {comp.weaknesses?.map((w, i) => <li key={i}>• {w}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="border-t border-gray-700 pt-3">
                  <div className="text-orange-400 font-semibold text-sm mb-2">How to Compete:</div>
                  <ul className="text-gray-300 text-xs space-y-1">
                    {comp.how_to_compete?.map((h, i) => <li key={i}>✓ {h}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
