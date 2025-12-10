import { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart as PieChartIcon,
  MessageCircle,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle
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
  ComposedChart,
  ReferenceLine
} from 'recharts';
import AgentChatPanel from './AgentChatPanel.jsx';

// KPI Card Component
function FinancialKPICard({ title, value, change, icon: Icon, trend, status }) {
  const isPositive = trend === 'up';
  const statusColors = {
    healthy: 'border-green-500/50',
    warning: 'border-yellow-500/50',
    critical: 'border-red-500/50',
    neutral: 'border-gray-700'
  };

  return (
    <div className={`bg-gray-800/50 border rounded-xl p-4 hover:border-green-500/50 transition-all ${statusColors[status] || statusColors.neutral}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 bg-green-600/20 rounded-lg">
          <Icon className="text-green-500" size={20} />
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
            {entry.name}: ${typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// Finance Section Component
function FinanceSection({ data, workspaceId }) {
  const [showChat, setShowChat] = useState(false);

  // Loading state
  if (!data) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-green-500" size={28} />
            <h2 className="text-2xl font-bold text-white">Financial Dashboard</h2>
          </div>
          <p className="text-gray-300">Comprehensive financial analysis and projections.</p>
        </div>
        <div className="text-center py-12">
          <DollarSign className="animate-spin text-green-500 mx-auto mb-4" size={48} />
          <p className="text-gray-400 text-lg">Generating financial analysis and projections...</p>
        </div>
      </div>
    );
  }

  const {
    cash_flow_data,
    monthly_financials,
    revenue_scenarios,
    expense_breakdown,
    burn_rate_runway,
    profitability_timeline,
    unit_economics,
    pricing
  } = data;

  const COLORS = ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#06b6d4'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <DollarSign className="text-green-500" size={28} />
            <h2 className="text-2xl font-bold text-white">Financial Dashboard</h2>
          </div>
          <button
            onClick={() => setShowChat(!showChat)}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-all flex items-center gap-2"
          >
            <MessageCircle size={16} />
            Chat with Finance
          </button>
        </div>
        <p className="text-gray-300">Real-time financial metrics, cash flow analysis, and profitability projections.</p>
      </div>

      {/* KPI Cards */}
      {cash_flow_data && burn_rate_runway && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FinancialKPICard
            title="Cash Balance"
            value={`$${cash_flow_data.summary?.ending_cash?.toLocaleString() || '0'}`}
            change="-8%"
            icon={Wallet}
            trend="down"
            status="healthy"
          />
          <FinancialKPICard
            title="Monthly Burn Rate"
            value={`$${burn_rate_runway.key_metrics?.current_burn_rate?.toLocaleString() || '0'}`}
            change="-5%"
            icon={TrendingDown}
            trend="up"
            status="healthy"
          />
          <FinancialKPICard
            title="Runway Remaining"
            value={`${burn_rate_runway.key_metrics?.runway_remaining || 0} months`}
            change="+2"
            icon={AlertCircle}
            trend="up"
            status="warning"
          />
          <FinancialKPICard
            title="Gross Margin"
            value="85%"
            change="+3%"
            icon={PieChartIcon}
            trend="up"
            status="healthy"
          />
        </div>
      )}

      {/* Cash Flow Analysis */}
      {cash_flow_data && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Cash Flow Analysis</h3>
            <p className="text-gray-400 text-sm">
              Monthly revenue vs expenses with cumulative cash balance
            </p>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="text-green-400">Total Revenue: ${cash_flow_data.summary?.total_revenue?.toLocaleString()}</span>
              <span className="text-red-400">Total Expenses: ${cash_flow_data.summary?.total_expenses?.toLocaleString()}</span>
              <span className="text-blue-400">Net Cash Flow: ${(cash_flow_data.summary?.ending_cash - cash_flow_data.summary?.starting_cash)?.toLocaleString()}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={cash_flow_data.monthly_data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
              <Bar dataKey="expenses" fill="#f59e0b" name="Expenses ($)" />
              <Line type="monotone" dataKey="cumulative_cash" stroke="#3b82f6" strokeWidth={3} name="Cash Balance ($)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Revenue Scenarios */}
      {revenue_scenarios && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Revenue Projections (3 Scenarios)</h3>
            <p className="text-gray-400 text-sm">
              Conservative, realistic, and optimistic revenue growth scenarios
            </p>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="text-yellow-400">Conservative: ${revenue_scenarios.year_end_projections?.conservative?.mrr?.toLocaleString()}/mo</span>
              <span className="text-blue-400">Realistic: ${revenue_scenarios.year_end_projections?.realistic?.mrr?.toLocaleString()}/mo</span>
              <span className="text-green-400">Optimistic: ${revenue_scenarios.year_end_projections?.optimistic?.mrr?.toLocaleString()}/mo</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenue_scenarios.monthly_data}>
              <defs>
                <linearGradient id="colorOptimistic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRealistic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorConservative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="optimistic"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorOptimistic)"
                name="Optimistic ($)"
              />
              <Area
                type="monotone"
                dataKey="realistic"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorRealistic)"
                name="Realistic ($)"
              />
              <Area
                type="monotone"
                dataKey="conservative"
                stroke="#f59e0b"
                fillOpacity={1}
                fill="url(#colorConservative)"
                name="Conservative ($)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* P&L Statement and Expense Breakdown */}
      {monthly_financials && expense_breakdown && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly P&L */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Monthly P&L Statement</h3>
              <p className="text-gray-400 text-sm">
                Revenue, costs, and profitability by month
              </p>
              <div className="text-sm mt-2 text-green-400">
                Gross Margin: {monthly_financials.annual_summary?.avg_gross_margin}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={monthly_financials.monthly_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
                <Bar dataKey="total_opex" fill="#f59e0b" name="Operating Expenses ($)" />
                <Line type="monotone" dataKey="net_income" stroke="#ec4899" strokeWidth={2} name="Net Income ($)" />
                <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Annual Budget Allocation</h3>
              <p className="text-gray-400 text-sm">
                Distribution of operating expenses
              </p>
              <div className="text-sm mt-2 text-blue-400">
                Total Annual Budget: ${expense_breakdown.total_annual?.toLocaleString()} | Monthly: ${expense_breakdown.total_monthly?.toLocaleString()}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={expense_breakdown.categories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {expense_breakdown.categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Burn Rate and Runway */}
      {burn_rate_runway && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Burn Rate & Runway Projection</h3>
            <p className="text-gray-400 text-sm">
              Monthly burn rate with cash balance and runway tracking
            </p>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="text-red-400">Avg Burn Rate: ${burn_rate_runway.key_metrics?.average_burn_rate?.toLocaleString()}/mo</span>
              <span className="text-yellow-400">Current Runway: {burn_rate_runway.key_metrics?.runway_remaining} months</span>
              <span className="text-green-400">Break-even: Month {burn_rate_runway.key_metrics?.break_even_month}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={burn_rate_runway.monthly_data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="cash_balance"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
                name="Cash Balance ($)"
              />
              <Bar dataKey="burn_rate" fill="#f59e0b" name="Monthly Burn ($)" />
              <Line type="monotone" dataKey="runway_months" stroke="#10b981" strokeWidth={2} name="Runway (months)" yAxisId="right" />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Profitability Timeline */}
      {profitability_timeline && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-2">Path to Profitability</h3>
            <p className="text-gray-400 text-sm">
              Quarterly revenue, expenses, and profit margins
            </p>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="text-green-400">Break-even: {profitability_timeline.milestones?.break_even_quarter}</span>
              <span className="text-blue-400">Target Margin: {profitability_timeline.milestones?.target_margin}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={profitability_timeline.quarterly_data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="quarter" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
              <Bar dataKey="expenses" fill="#f59e0b" name="Expenses ($)" />
              <Line type="monotone" dataKey="profit" stroke="#ec4899" strokeWidth={3} name="Profit ($)" />
              <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" label="Break-even" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Unit Economics Table */}
      {unit_economics && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Unit Economics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <div className="text-gray-400 text-sm mb-1">Customer Acquisition Cost</div>
              <div className="text-white text-2xl font-bold">{unit_economics.customer_acquisition_cost?.cac}</div>
              <div className="text-green-400 text-xs mt-1">{unit_economics.customer_acquisition_cost?.benchmark}</div>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <div className="text-gray-400 text-sm mb-1">Lifetime Value</div>
              <div className="text-white text-2xl font-bold">{unit_economics.lifetime_value?.ltv}</div>
              <div className="text-green-400 text-xs mt-1">{unit_economics.lifetime_value?.benchmark}</div>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <div className="text-gray-400 text-sm mb-1">LTV:CAC Ratio</div>
              <div className="text-white text-2xl font-bold">{unit_economics.ltv_to_cac_ratio?.ratio}</div>
              <div className="text-green-400 text-xs mt-1">{unit_economics.ltv_to_cac_ratio?.verdict}</div>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <div className="text-gray-400 text-sm mb-1">Payback Period</div>
              <div className="text-white text-2xl font-bold">{unit_economics.payback_period?.months} months</div>
              <div className="text-green-400 text-xs mt-1">{unit_economics.payback_period?.verdict}</div>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <div className="text-gray-400 text-sm mb-1">ARPU</div>
              <div className="text-white text-2xl font-bold">{unit_economics.metrics_summary?.arpu}</div>
              <div className="text-gray-400 text-xs mt-1">Average Revenue Per User</div>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <div className="text-gray-400 text-sm mb-1">Gross Margin</div>
              <div className="text-white text-2xl font-bold">{unit_economics.payback_period?.gross_margin}</div>
              <div className="text-green-400 text-xs mt-1">Industry Target: 80%+</div>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Tiers */}
      {pricing && pricing.tiers && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Pricing Strategy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pricing.tiers.map((tier, index) => (
              <div
                key={index}
                className={`bg-gray-900/50 p-5 rounded-lg border ${tier.recommended ? 'border-green-500 ring-2 ring-green-500/20' : 'border-gray-700'} hover:border-green-500/50 transition-all`}
              >
                {tier.recommended && (
                  <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded mb-2 inline-block">
                    RECOMMENDED
                  </div>
                )}
                <h4 className="text-white font-bold text-lg mb-2">{tier.name}</h4>
                <div className="text-green-400 text-3xl font-bold mb-1">{tier.monthly_price}</div>
                <div className="text-gray-400 text-sm mb-3">{tier.annual_price}</div>
                <div className="text-gray-400 text-xs mb-2">{tier.target_customer}</div>
                <div className="text-blue-400 text-xs">{tier.expected_adoption}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Panel */}
      {showChat && (
        <AgentChatPanel
          agentType="finance"
          workspaceId={workspaceId}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}

export default FinanceSection;
