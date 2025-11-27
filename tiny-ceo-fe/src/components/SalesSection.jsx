// Sales Section
import { 
  Users, 
  Target,
  FileText
} from 'lucide-react';
import OutputCard from './OutputCard.jsx';
function SalesSection() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border border-orange-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <Users className="text-orange-500" size={28} />
          <h2 className="text-2xl font-bold text-white">Sales Team</h2>
        </div>
        <p className="text-gray-300">Lead generation, outreach strategies, and customer acquisition.</p>
      </div>

      <div className="grid gap-4">
        <OutputCard
          title="Target Customer Profile"
          content="Remote-first companies with 10-50 employees, typically in tech/creative industries. Decision makers: CTOs, Operations Managers, Founders. Pain points: Too many tools, async communication chaos, lack of visibility into project status."
          icon={Target}
        />
        <OutputCard
          title="Lead Sources"
          content="1. LinkedIn: Search 'remote team manager' + your industry. 2. Product Hunt: Engage with remote work tool launches. 3. Reddit: r/remotework, r/startups. 4. Twitter: Follow #RemoteWork hashtag. 5. Y Combinator companies list (filter for remote). Aim for 20 outreach/day."
          icon={Users}
        />
        <OutputCard
          title="Sales Playbook"
          content="Week 1: Research + personalized outreach. Week 2: Demo calls (15 min, focus on 1 pain point). Week 3: Follow-up + trial signup. Week 4: Check-in + convert to paid. Use case studies from early users. Offer founding member pricing (30% off for first 50 customers)."
          icon={FileText}
        />
      </div>
    </div>
  );
}
export default SalesSection;