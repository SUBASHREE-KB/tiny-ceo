import { useState } from 'react';
import {
  DollarSign,
  FileText,
  BarChart3,
  RefreshCw,
  TrendingUp,
  PieChart,
  MessageCircle
} from 'lucide-react';
import OutputCard from './OutputCard.jsx';
import AgentChatPanel from './AgentChatPanel.jsx';

// Finance Section
function FinanceSection({ data, onRegenerate, workspaceId }) {
  const [showChat, setShowChat] = useState(false);

  // Safe helper to render content
  const safeRender = (value, fallback = 'N/A') => {
    return value !== undefined && value !== null ? value : fallback;
  };

  // Loading state
  if (!data) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="text-green-500" size={28} />
            <h2 className="text-2xl font-bold text-white">Finance Team</h2>
          </div>
          <p className="text-gray-300">Pricing strategy, revenue projections, and budget planning.</p>
        </div>
        <div className="text-center py-12">
          <RefreshCw className="animate-spin text-green-500 mx-auto mb-4" size={48} />
          <p className="text-gray-400 text-lg">Finance Agent is calculating your financial model...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <DollarSign className="text-green-500" size={28} />
            <h2 className="text-2xl font-bold text-white">Finance Team</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowChat(!showChat)}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <MessageCircle size={16} />
              Chat with Finance
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
        <p className="text-gray-300">Pricing strategy, revenue projections, and budget planning.</p>
      </div>

      <div className="grid gap-4">
        {/* Pricing Strategy */}
        {data.pricing && data.pricing.tiers && Array.isArray(data.pricing.tiers) && data.pricing.tiers.length > 0 && (
          <OutputCard
            title="Recommended Pricing"
            content={`Strategy: ${safeRender(data.pricing.strategy, 'Value-based tiered pricing')}\nModel: ${safeRender(data.pricing.pricing_model, 'SaaS subscription')}\n\n${data.pricing.tiers.map(tier =>
              `${safeRender(tier.name, 'Tier')}: ${safeRender(tier.monthly_price, 'N/A')}/mo (${safeRender(tier.annual_price, 'N/A')} annually)\nTarget: ${safeRender(tier.target_customer, 'N/A')}\nAdoption: ${safeRender(tier.expected_adoption, 'N/A')}`
            ).join('\n\n')}`}
            icon={DollarSign}
          />
        )}

        {/* Revenue Projections */}
        {data.revenue_projections && (
          <OutputCard
            title="Revenue Projections"
            content={(() => {
              let content = '';
              if (data.revenue_projections.year_1?.conservative?.mrr_month_12) {
                content += `Conservative (Year 1): ${data.revenue_projections.year_1.conservative.mrr_month_12} MRR by month 12\n`;
              }
              if (data.revenue_projections.year_1?.realistic?.mrr_month_12) {
                content += `Realistic (Year 1): ${data.revenue_projections.year_1.realistic.mrr_month_12} MRR by month 12\n`;
              }
              if (data.revenue_projections.year_1?.optimistic?.mrr_month_12) {
                content += `Optimistic (Year 1): ${data.revenue_projections.year_1.optimistic.mrr_month_12} MRR by month 12\n`;
              }
              if (data.revenue_projections.assumptions && Array.isArray(data.revenue_projections.assumptions) && data.revenue_projections.assumptions.length > 0) {
                content += `\nAssumptions:\n${data.revenue_projections.assumptions.slice(0, 4).join('\n')}`;
              }
              return content || 'Revenue projections being calculated by Gemini...';
            })()}
            icon={TrendingUp}
          />
        )}

        {/* Unit Economics */}
        {data.unit_economics && (
          <OutputCard
            title="Unit Economics"
            content={(() => {
              const cac = safeRender(data.unit_economics.cac, '$150-250');
              const ltv = safeRender(data.unit_economics.ltv, '$1,500-2,500');
              const ratio = safeRender(data.unit_economics.ltv_cac_ratio, '6-10x');
              const payback = safeRender(data.unit_economics.payback_period, '3-6 months');

              let content = `CAC (Customer Acquisition Cost): ${cac}\nLTV (Lifetime Value): ${ltv}\nLTV/CAC Ratio: ${ratio}\nPayback Period: ${payback}`;

              if (data.unit_economics.breakdown && typeof data.unit_economics.breakdown === 'object') {
                const breakdown = Object.entries(data.unit_economics.breakdown).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join('\n');
                if (breakdown) {
                  content += `\n\nBreakdown:\n${breakdown}`;
                }
              }

              return content;
            })()}
            icon={PieChart}
          />
        )}

        {/* Budget */}
        {data.budget && (
          <OutputCard
            title="Startup Budget"
            content={(() => {
              const period = safeRender(data.budget.period, '12 months');
              const total = safeRender(data.budget.total, '$150K-200K');

              let content = `Total (First ${period}): ${total}`;

              if (data.budget.breakdown && typeof data.budget.breakdown === 'object') {
                const breakdown = Object.entries(data.budget.breakdown).map(([category, details]) => {
                  if (typeof details === 'object' && details !== null) {
                    const amount = safeRender(details.amount || details.monthly, '');
                    const desc = details.description || (Array.isArray(details.items) ? details.items.join(', ') : '');
                    return `${category.toUpperCase()}: ${amount}${desc ? `\n  ${desc}` : ''}`;
                  } else {
                    return `${category}: ${safeRender(details, '')}`;
                  }
                }).join('\n\n');

                if (breakdown) {
                  content += `\n\nBreakdown:\n${breakdown}`;
                }
              }

              return content;
            })()}
            icon={FileText}
          />
        )}

        {/* Breakeven Analysis */}
        {data.breakeven && (
          <OutputCard
            title="Breakeven Analysis"
            content={(() => {
              const customers = safeRender(data.breakeven.customers, '150-200');
              const months = safeRender(data.breakeven.months, 'Month 8-12');
              const mrr = safeRender(data.breakeven.mrr, '$15K-20K');
              const costs = safeRender(data.breakeven.monthly_costs, '$15K-18K');
              const path = safeRender(data.breakeven.path_to_breakeven, 'Achieve through organic growth and paid acquisition');

              return `Break-even at: ${customers} customers\nTimeline: ${months}\nMRR Required: ${mrr}\n\nMonthly Costs: ${costs}\nPath: ${path}`;
            })()}
            icon={BarChart3}
          />
        )}

        {/* Financial Metrics */}
        {data.financial_metrics && Array.isArray(data.financial_metrics) && data.financial_metrics.length > 0 && (
          <OutputCard
            title="Key Financial Metrics"
            content={data.financial_metrics.slice(0, 5).map(metric =>
              `${safeRender(metric.metric, 'Metric')}: ${safeRender(metric.description, '')}\nTarget: ${safeRender(metric.target || metric.benchmark, 'N/A')}`
            ).join('\n\n')}
            icon={BarChart3}
          />
        )}

        {/* Funding Runway */}
        {data.funding_runway && (
          <OutputCard
            title="Funding & Runway"
            content={(() => {
              const funding = safeRender(data.funding_runway.initial_funding, '$150K-250K');
              const runway = safeRender(data.funding_runway.runway_months, '12-18 months');
              const burn = safeRender(data.funding_runway.monthly_burn, '$12K-15K/month');

              let content = `Initial Funding Needed: ${funding}\nRunway: ${runway}\nBurn Rate: ${burn}`;

              if (data.funding_runway.milestones_before_raise && Array.isArray(data.funding_runway.milestones_before_raise) && data.funding_runway.milestones_before_raise.length > 0) {
                content += `\n\nMilestones Before Next Raise:\n${data.funding_runway.milestones_before_raise.join('\n')}`;
              }

              return content;
            })()}
            icon={TrendingUp}
          />
        )}
      </div>

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
