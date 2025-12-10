import { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Target,
  MessageCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import AgentChatPanel from './AgentChatPanel.jsx';

// KPI Card Component
function KPICard({ title, value, change, icon: Icon, trend }) {
  const isPositive = trend === 'up';

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-pink-500/50 transition-all">
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 bg-pink-600/20 rounded-lg">
          <Icon className="text-pink-500" size={20} />
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

// Custom Tooltip for charts
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

// Marketing Section Component
function MarketingSection({ data, workspaceId }) {
  const [showChat, setShowChat] = useState(false);

  // Loading state
  if (!data) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-pink-600/20 to-rose-600/20 border border-pink-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-pink-500" size={28} />
            <h2 className="text-2xl font-bold text-white">Marketing Analytics</h2>
          </div>
          <p className="text-gray-300">Real-time market trends and profit analysis.</p>
        </div>
        <div className="text-center py-12">
          <TrendingUp className="animate-spin text-pink-500 mx-auto mb-4" size={48} />
          <p className="text-gray-400 text-lg">Generating marketing analytics and visualizations...</p>
        </div>
      </div>
    );
  }

  const {
    market_trends_data,
    revenue_projections,
    profit_analysis,
    customer_metrics,
    channel_performance
  } = data;

  const COLORS = ['#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600/20 to-rose-600/20 border border-pink-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-pink-500" size={28} />
            <h2 className="text-2xl font-bold text-white">Marketing Analytics</h2>
          </div>
          <button
            onClick={() => setShowChat(!showChat)}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg transition-all flex items-center gap-2"
          >
            <MessageCircle size={16} />
            Chat with Marketing
          </button>
        </div>
        <p className="text-gray-300">Real-time market trends, revenue projections, and profit analysis.</p>
      </div>

      {/* KPI Cards */}
      {revenue_projections && customer_metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Revenue (YTD)"
            value={`$${revenue_projections.year_end_projection?.total_revenue?.toLocaleString() || '0'}`}
            change="+127%"
            icon={DollarSign}
            trend="up"
          />
          <KPICard
            title="MRR (Current)"
            value={`$${revenue_projections.monthly_data?.[11]?.revenue?.toLocaleString() || '0'}`}
            change="+15%"
            icon={TrendingUp}
            trend="up"
          />
          <KPICard
            title="Total Customers"
            value={customer_metrics.key_metrics?.total_customers?.toLocaleString() || '0'}
            change="+89%"
            icon={Users}
            trend="up"
          />
          <KPICard
            title="LTV:CAC Ratio"
            value={customer_metrics.key_metrics?.ltv_cac_ratio || '0'}
            change="+12%"
            icon={Target}
            trend="up"
          />
        </div>
      )}

      {/* Market Trends Chart */}
      {market_trends_data && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Market Growth Trends</h3>
            <p className="text-gray-400 text-sm">
              Historical data and 12-month projections - Market Size: {market_trends_data.summary?.current_market_size}
            </p>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="text-green-400">Growth Rate: {market_trends_data.summary?.projected_growth_rate}</span>
              <span className="text-blue-400">Your Projected Share: {market_trends_data.summary?.your_projected_share}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={market_trends_data.historical_and_projected}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorYour" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="total_market"
                stroke="#ec4899"
                fillOpacity={1}
                fill="url(#colorTotal)"
                name="Total Market ($M)"
              />
              <Area
                type="monotone"
                dataKey="your_market"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorYour)"
                name="Your Market ($M)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Revenue & Profit Chart */}
      {revenue_projections && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Revenue & Profit Projections</h3>
            <p className="text-gray-400 text-sm">
              12-month revenue forecast with cost breakdown and profit margins
            </p>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="text-green-400">ARR Projection: ${revenue_projections.year_end_projection?.arr_projection?.toLocaleString()}</span>
              <span className="text-blue-400">Avg Profit Margin: 65%</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={revenue_projections.monthly_data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
              <Bar dataKey="costs" fill="#f59e0b" name="Costs ($)" />
              <Line type="monotone" dataKey="profit" stroke="#ec4899" strokeWidth={3} name="Profit ($)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Customer Acquisition Metrics */}
      {customer_metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CAC vs LTV Chart */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">CAC vs LTV Trends</h3>
              <p className="text-gray-400 text-sm">
                Customer Acquisition Cost vs Lifetime Value over time
              </p>
              <div className="text-sm mt-2 text-green-400">
                Target Ratio: 3:1 | Current: {customer_metrics.key_metrics?.ltv_cac_ratio}:1
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={customer_metrics.monthly_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="ltv" stroke="#10b981" strokeWidth={2} name="LTV ($)" />
                <Line type="monotone" dataKey="cac" stroke="#f59e0b" strokeWidth={2} name="CAC ($)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Customer Growth Chart */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Customer Growth</h3>
              <p className="text-gray-400 text-sm">
                Monthly new customers and total customer base
              </p>
              <div className="text-sm mt-2 text-blue-400">
                Churn Rate: {customer_metrics.key_metrics?.monthly_churn}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={customer_metrics.monthly_data}>
                <defs>
                  <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="total_customers"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorCustomers)"
                  name="Total Customers"
                />
                <Line type="monotone" dataKey="new_customers" stroke="#10b981" strokeWidth={2} name="New Customers" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Channel Performance */}
      {channel_performance && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Channel ROI Comparison */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Channel Performance (ROI)</h3>
              <p className="text-gray-400 text-sm">
                Return on investment by marketing channel
              </p>
              <div className="text-sm mt-2 text-green-400">
                Overall ROI: {channel_performance.overall_roi}%
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={channel_performance.channels}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="roi" fill="#ec4899" name="ROI (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Budget Allocation */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Budget Allocation</h3>
              <p className="text-gray-400 text-sm">
                Marketing spend across channels
              </p>
              <div className="text-sm mt-2 text-blue-400">
                Total Budget: ${channel_performance.total_budget?.toLocaleString()} | Spent: ${channel_performance.total_spend?.toLocaleString()}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={channel_performance.channels}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="spend"
                >
                  {channel_performance.channels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Quarterly Profit Analysis */}
      {profit_analysis && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Quarterly Profit Breakdown</h3>
            <p className="text-gray-400 text-sm">
              Revenue, costs, and profit margins by quarter
            </p>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="text-green-400">Target Gross Margin: {profit_analysis.profitability_metrics?.target_gross_margin}</span>
              <span className="text-blue-400">Break-even: Month {profit_analysis.break_even_month}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={profit_analysis.quarterly_data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="quarter" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="revenue" stackId="a" fill="#10b981" name="Revenue ($)" />
              <Bar dataKey="cogs" stackId="b" fill="#f59e0b" name="COGS ($)" />
              <Bar dataKey="marketing" stackId="b" fill="#ec4899" name="Marketing ($)" />
              <Bar dataKey="operations" stackId="b" fill="#8b5cf6" name="Operations ($)" />
              <Line type="monotone" dataKey="net_profit" stroke="#3b82f6" strokeWidth={3} name="Net Profit ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Channel Details Table */}
      {channel_performance && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Channel Performance Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-semibold">Channel</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">Budget</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">Spend</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">Leads</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">Customers</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">Revenue</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">ROI</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-semibold">Conv %</th>
                </tr>
              </thead>
              <tbody>
                {channel_performance.channels.map((channel, index) => (
                  <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                    <td className="py-3 px-4 text-white font-medium">{channel.name}</td>
                    <td className="py-3 px-4 text-right text-gray-300">${channel.budget.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-gray-300">${channel.spend.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-blue-400">{channel.leads}</td>
                    <td className="py-3 px-4 text-right text-green-400">{channel.customers}</td>
                    <td className="py-3 px-4 text-right text-green-400">${channel.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-pink-400 font-semibold">{channel.roi}%</td>
                    <td className="py-3 px-4 text-right text-gray-300">{channel.conversion_rate}%</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-gray-600 font-bold">
                  <td className="py-3 px-4 text-white">TOTAL</td>
                  <td className="py-3 px-4 text-right text-white">${channel_performance.total_budget.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-white">${channel_performance.total_spend.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-blue-400">{channel_performance.total_leads}</td>
                  <td className="py-3 px-4 text-right text-green-400">{channel_performance.total_customers}</td>
                  <td className="py-3 px-4 text-right text-green-400">${channel_performance.total_revenue.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-pink-400">{channel_performance.overall_roi}%</td>
                  <td className="py-3 px-4 text-right text-gray-300">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Chat Panel */}
      {showChat && (
        <AgentChatPanel
          agentType="marketing"
          workspaceId={workspaceId}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}

export default MarketingSection;
