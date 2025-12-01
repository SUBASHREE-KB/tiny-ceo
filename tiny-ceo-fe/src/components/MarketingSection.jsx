import { useState } from 'react';
import {
  TrendingUp,
  Target,
  MessageSquare,
  FileText,
  Mail,
  RefreshCw,
  Megaphone,
  Globe,
  MessageCircle
} from 'lucide-react';
import OutputCard from './OutputCard.jsx';
import AgentChatPanel from './AgentChatPanel.jsx';

// Marketing Section
function MarketingSection({ data, onRegenerate, workspaceId }) {
  const [showChat, setShowChat] = useState(false);
  // Loading state
  if (!data) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-pink-600/20 to-rose-600/20 border border-pink-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-pink-500" size={28} />
            <h2 className="text-2xl font-bold text-white">Marketing Team</h2>
          </div>
          <p className="text-gray-300">All your marketing materials, copy, and campaign strategies.</p>
        </div>
        <div className="text-center py-12">
          <RefreshCw className="animate-spin text-pink-500 mx-auto mb-4" size={48} />
          <p className="text-gray-400 text-lg">Marketing Agent is crafting your go-to-market strategy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-600/20 to-rose-600/20 border border-pink-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-pink-500" size={28} />
            <h2 className="text-2xl font-bold text-white">Marketing Team</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowChat(!showChat)}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg transition-all flex items-center gap-2"
            >
              <MessageCircle size={16} />
              Chat with Marketing
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
        <p className="text-gray-300">All your marketing materials, copy, and campaign strategies.</p>
      </div>

      <div className="grid gap-4">
        {/* Positioning */}
        {data.positioning && (
          <OutputCard
            title="Brand Positioning"
            content={`${data.positioning.positioning_statement || ''}\n\nElevator Pitch: ${data.positioning.elevator_pitch || ''}\n\nOne-liner: ${data.positioning.one_liner || ''}\n\nBrand Voice: ${data.positioning.brand_personality?.voice || ''}\nTone: ${data.positioning.brand_personality?.tone || ''}`}
            icon={Target}
          />
        )}

        {/* Messaging - Landing Page */}
        {data.messaging?.landing_page && (
          <OutputCard
            title="Landing Page Copy"
            content={`Headline: ${data.messaging.landing_page.headline || ''}\n\nSubheadline: ${data.messaging.landing_page.subheadline || ''}\n\nPrimary CTA: ${data.messaging.landing_page.cta_primary || ''}\nSecondary CTA: ${data.messaging.landing_page.cta_secondary || ''}\n\nSocial Proof: ${data.messaging.landing_page.social_proof || ''}\n\nValue Props:\n${data.messaging.landing_page.value_props?.map(vp => `- ${vp}`).join('\n') || ''}`}
            icon={FileText}
          />
        )}

        {/* Market Analysis */}
        {data.market_analysis && (
          <OutputCard
            title="Market Analysis"
            content={`TAM: ${data.market_analysis.market_size?.tam || 'N/A'}\nSAM: ${data.market_analysis.market_size?.sam || 'N/A'}\nSOM: ${data.market_analysis.market_size?.som || 'N/A'}\n\nPrimary Segment: ${data.market_analysis.target_segments?.[0]?.segment || ''}\nSize: ${data.market_analysis.target_segments?.[0]?.size || ''}\nCharacteristics:\n${data.market_analysis.target_segments?.[0]?.characteristics?.slice(0, 3).join('\n') || ''}`}
            icon={Globe}
          />
        )}

        {/* Go-to-Market Strategy */}
        {data.go_to_market_strategy && (
          <OutputCard
            title="Go-to-Market Strategy"
            content={`Strategy: ${data.go_to_market_strategy.strategy_overview || ''}\n\nTop Channels:\n${data.go_to_market_strategy.channel_mix?.slice(0, 3).map(channel =>
              `${channel.channel} (${channel.priority} priority)\nBudget: ${channel.budget_allocation}\nTimeline: ${channel.timeline}\nExpected: ${channel.expected_results}`
            ).join('\n\n') || ''}`}
            icon={Megaphone}
          />
        )}

        {/* Content Strategy */}
        {data.content_strategy && (
          <OutputCard
            title="Content Strategy"
            content={`Content Pillars:\n${data.content_strategy.content_pillars?.map(pillar =>
              `${pillar.pillar} - ${pillar.frequency}\nPurpose: ${pillar.purpose}`
            ).join('\n\n') || ''}\n\nSEO Keywords:\n${data.content_strategy.seo_strategy?.primary_keywords?.slice(0, 5).join(', ') || ''}`}
            icon={FileText}
          />
        )}

        {/* Launch Plan */}
        {data.launch_plan && (
          <OutputCard
            title="Launch Plan"
            content={`PRE-LAUNCH (${data.launch_plan.pre_launch?.timing || '30 days before'}):\n${data.launch_plan.pre_launch?.checklist?.join('\n') || ''}\n\nLAUNCH DAY:\n${data.launch_plan.launch_day?.checklist?.join('\n') || ''}\nGoals: ${data.launch_plan.launch_day?.goals || ''}\n\nPOST-LAUNCH:\n${data.launch_plan.post_launch?.checklist?.slice(0, 3).join('\n') || ''}`}
            icon={MessageSquare}
          />
        )}

        {/* Email Templates */}
        {data.messaging?.email_sequences?.welcome_series && (
          <OutputCard
            title="Email Sequences"
            content={`WELCOME SERIES:\n${data.messaging.email_sequences.welcome_series.slice(0, 3).map(email =>
              `Email ${email.email} (${email.timing}):\nSubject: ${email.subject}\nGoal: ${email.goal}`
            ).join('\n\n') || ''}`}
            icon={Mail}
          />
        )}

        {/* Channel Recommendations */}
        {data.channel_recommendations && (
          <OutputCard
            title="Channel Recommendations"
            content={`TOP 3 CHANNELS:\n${data.channel_recommendations.top_3_channels?.map(channel =>
              `${channel.channel}\nWhy: ${channel.why}\nInvestment: ${channel.investment}\nTimeline: ${channel.timeline}`
            ).join('\n\n') || ''}\n\nAVOID INITIALLY:\n${data.channel_recommendations.avoid_initially?.map(ch => `- ${ch.channel}: ${ch.why}`).join('\n') || ''}`}
            icon={TrendingUp}
          />
        )}
      </div>

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