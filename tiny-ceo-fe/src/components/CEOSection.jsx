import { 
  TrendingUp, 
  Target,
  FileText,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import OutputCard from './OutputCard.jsx';
// CEO Strategy Section
function CEOSection() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Target className="text-indigo-500" size={28} />
          <h2 className="text-2xl font-bold text-white">CEO Strategy</h2>
        </div>
        <p className="text-gray-300">High-level strategy, competitive analysis, and growth planning.</p>
      </div>

      <div className="grid gap-4">
        <OutputCard
          title="Competitive Analysis"
          content="Asana: Feature-rich but complex. Monday: Visual but expensive. Notion: Flexible but steep learning curve. YOUR EDGE: AI-powered simplicity. Zero setup. Async-first design. Price point for startups. Focus on speed and reducing cognitive load."
          icon={BarChart3}
        />
        <OutputCard
          title="3-Month Roadmap"
          content="Month 1: MVP launch, 10 beta customers, iterate on feedback. Month 2: Marketing push, Product Hunt launch, 50 paying customers. Month 3: Add AI features (smart task prioritization), scale to 150 customers, hire first contractor for support."
          icon={FileText}
        />
        <OutputCard
          title="Pivot Signals to Watch"
          content="If churn >10%: Simplify onboarding. If conversion <5%: Adjust pricing or positioning. If NPS <30: Major product issues. If CAC >LTV: Marketing channels aren't working. Review metrics monthly and be ready to pivot on positioning or features."
          icon={Lightbulb}
        />
        <OutputCard
          title="Fundraising Strategy"
          content="Bootstrap until $15K MRR (gives negotiation power). Then consider pre-seed: $500K-$1M at $5M cap. Pitch: 'Asana for the AI era - 10x simpler, 3x cheaper.' Target: angels who've built SaaS, funds focused on productivity tools. Need: 12mo runway + 1 technical hire."
          icon={TrendingUp}
        />
      </div>
    </div>
  );
}
export default CEOSection;