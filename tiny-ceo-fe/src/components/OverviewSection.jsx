import {  Check } from 'lucide-react';
import OutputCard from './OutputCard.jsx';
// Overview Section
function OverviewSection({ ideaTitle }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-white mb-2">{ideaTitle}</h2>
        <p className="text-gray-300 mb-6">Your AI startup team has analyzed your idea and organized everything below.</p>
        
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-white mb-1">5</div>
            <div className="text-gray-400 text-sm">Active Teams</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-white mb-1">12</div>
            <div className="text-gray-400 text-sm">Tasks Completed</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="text-2xl font-bold text-white mb-1">Ready</div>
            <div className="text-gray-400 text-sm">Status</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4">Quick Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <OutputCard
            title="Market Validated"
            content="Your target audience and market size have been identified. Ready to move forward with marketing strategy."
            icon={Check}
          />
          <OutputCard
            title="Business Model Set"
            content="Pricing strategy and revenue projections are complete. Finance team has your numbers ready."
            icon={Check}
          />
        </div>
      </div>
    </div>
  );
}
export default OverviewSection;