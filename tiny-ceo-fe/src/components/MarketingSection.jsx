import { 
  TrendingUp, 
  Target,
  MessageSquare,
  FileText,
  Mail
} from 'lucide-react';
import OutputCard from './OutputCard.jsx';
// Marketing Section
function MarketingSection() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-600/20 to-rose-600/20 border border-pink-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="text-pink-500" size={28} />
          <h2 className="text-2xl font-bold text-white">Marketing Team</h2>
        </div>
        <p className="text-gray-300">All your marketing materials, copy, and campaign strategies.</p>
      </div>

      <div className="grid gap-4">
        <OutputCard
          title="Landing Page Copy"
          content="Transform your remote team's chaos into clarity. [Your App Name] brings structure to distributed work with intuitive project management built for the way modern teams actually work. Start your 14-day free trial today."
          icon={FileText}
        />
        <OutputCard
          title="Social Media Campaign"
          content="Week 1: Problem awareness posts about remote work challenges. Week 2: Solution-focused content showcasing key features. Week 3: Social proof and testimonials. Week 4: Launch announcement and special offer."
          icon={MessageSquare}
        />
        <OutputCard
          title="Email Outreach Template"
          content="Subject: Quick question about [Company]'s remote team workflow\n\nHi [Name], I noticed [Company] recently went fully remote. We built [Your App] specifically for distributed teams struggling with [pain point]. Would love 10 minutes to show you how teams like yours are cutting meeting time by 40%."
          icon={Mail}
        />
        <OutputCard
          title="Brand Positioning"
          content="Position as: 'The project management tool that doesn't feel like homework.' Focus on simplicity, speed, and reducing busywork. Differentiate from Asana/Monday with our AI-powered task prioritization and zero-setup approach."
          icon={Target}
        />
      </div>
    </div>
  );
}
export default MarketingSection;