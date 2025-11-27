import { 
  DollarSign, 
  FileText,
  BarChart3
} from 'lucide-react';
import OutputCard from './OutputCard.jsx';
// Finance Section
function FinanceSection() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <DollarSign className="text-green-500" size={28} />
          <h2 className="text-2xl font-bold text-white">Finance Team</h2>
        </div>
        <p className="text-gray-300">Pricing strategy, revenue projections, and budget planning.</p>
      </div>

      <div className="grid gap-4">
        <OutputCard
          title="Recommended Pricing"
          content="Starter: $29/month (up to 5 users) | Professional: $79/month (up to 20 users) | Enterprise: $199/month (unlimited). Annual plans at 20% discount. Competitive with market, positioned slightly below Asana to capture price-sensitive startups."
          icon={DollarSign}
        />
        <OutputCard
          title="Revenue Projection (Year 1)"
          content="Conservative: 50 customers by month 6, 150 by month 12 = $8,500 MRR. Realistic: 200 customers by month 12 = $15,800 MRR. Optimistic: 400 customers = $31,600 MRR. Assumes 60% Starter, 35% Professional, 5% Enterprise mix."
          icon={BarChart3}
        />
        <OutputCard
          title="Startup Budget"
          content="Development: $5,000 (initial build), Hosting: $200/mo (Vultr/AWS), Marketing: $2,000/mo (ads + content), Tools: $500/mo (analytics, email, CRM). Total first 6 months: ~$25,000. Break even estimated at month 8-10 with realistic projections."
          icon={FileText}
        />
      </div>
    </div>
  );
}
export default FinanceSection;
