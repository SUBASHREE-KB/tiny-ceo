
import { 
  Sparkles, 
  Code, 
  FileText,
  BarChart3
} from 'lucide-react';
import OutputCard from './OutputCard.jsx';
// Developer Section
function DeveloperSection() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Code className="text-blue-500" size={28} />
          <h2 className="text-2xl font-bold text-white">Developer Team</h2>
        </div>
        <p className="text-gray-300">Technical architecture, feature roadmap, and development priorities.</p>
      </div>

      <div className="grid gap-4">
        <OutputCard
          title="Tech Stack Recommendation"
          content="Frontend: React + Tailwind (fast iteration). Backend: Node.js + Express (simple, scalable). Database: PostgreSQL (relational data) + Redis (caching). Hosting: Vultr (cost-effective). AI: LiquidMetal API for smart features. Auth: WorkOS. Payments: Stripe."
          icon={Code}
        />
        <OutputCard
          title="MVP Feature List"
          content="Core: Project boards, task creation/assignment, comments, file uploads. Must-have: Real-time updates, mobile responsive, Slack integration. Nice-to-have: AI task suggestions, time tracking, calendar view. Ship in 6 weeks with core + 2 must-haves."
          icon={FileText}
        />
        <OutputCard
          title="Development Timeline"
          content="Week 1-2: Auth + database setup. Week 3-4: Core task management UI. Week 5: Real-time features + Slack integration. Week 6: Polish, testing, deploy. Post-launch: 2-week sprints, prioritize based on user feedback. Maintain 80% uptime SLA minimum."
          icon={BarChart3}
        />
        <OutputCard
          title="AI Features Roadmap"
          content="Phase 1 (Month 2): Smart task prioritization based on deadlines + dependencies. Phase 2 (Month 4): Auto-generate task descriptions from meeting notes. Phase 3 (Month 6): Predictive project timeline adjustments. Use LiquidMetal's SmartMemory for context."
          icon={Sparkles}
        />
      </div>
    </div>
  );
}
export default DeveloperSection;