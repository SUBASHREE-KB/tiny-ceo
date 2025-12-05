// Team Sidebar Component
import { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  DollarSign,
  Users,
  Code,
  Target,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';

function TeamSidebar({ activeTeam, onSelectTeam, onBackToHome }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const teams = [
    { id: 'overview', name: 'Overview', icon: Sparkles, color: 'from-purple-600 to-blue-600' },
    { id: 'marketing', name: 'Marketing', icon: TrendingUp, color: 'from-pink-600 to-rose-600' },
    { id: 'finance', name: 'Finance', icon: DollarSign, color: 'from-green-600 to-emerald-600' },
    { id: 'sales', name: 'Sales', icon: Users, color: 'from-orange-600 to-yellow-600' },
    { id: 'ceo', name: 'CEO Strategy', icon: Target, color: 'from-indigo-600 to-purple-600' },
    { id: 'developer', name: 'Developer', icon: Code, color: 'from-blue-600 to-cyan-600' }
  ];

  const handleTeamSelect = (teamId) => {
    onSelectTeam(teamId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg text-white"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed lg:relative
        w-64 bg-[#0B0B0F] border-r border-gray-800
        flex flex-col h-screen z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      <div className="p-4 border-b border-gray-800">
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="mb-3 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">Back to Ideas</span>
          </button>
        )}
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="text-blue-500" size={24} />
          Tiny CEO
        </h2>
        <p className="text-gray-400 text-sm mt-1">Your Startup Team</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        {teams.map((team) => {
          const Icon = team.icon;
          const isActive = activeTeam === team.id;
          
          return (
            <button
              key={team.id}
              onClick={() => handleTeamSelect(team.id)}
              className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all flex items-center gap-3 ${
                isActive
                  ? `bg-gradient-to-r ${team.color} bg-opacity-20 border border-opacity-30 shadow-md`
                  : 'bg-gray-800/30 hover:bg-gray-800/50 border border-transparent'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
              <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>
                {team.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
export default TeamSidebar;