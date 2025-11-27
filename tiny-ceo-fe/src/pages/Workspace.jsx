import React, { useState } from 'react';
import TeamSidebar from '../components/SideBar.jsx';
import OverviewSection from '../components/OverviewSection.jsx';
import MarketingSection from '../components/MarketingSection.jsx';
import FinanceSection from '../components/FinanceSection.jsx';
import SalesSection from '../components/SalesSection.jsx';
import CEOSection from '../components/CEOSection.jsx';
import DeveloperSection from '../components/DeveloperSection.jsx';

// Main Workspace Component
function Workspace() {
  const [activeTeam, setActiveTeam] = useState('overview');
  const ideaTitle = "Remote Team Project Management App"; // This would come from props/context

  const renderContent = () => {
    switch (activeTeam) {
      case 'overview':
        return <OverviewSection ideaTitle={ideaTitle} />;
      case 'marketing':
        return <MarketingSection />;
      case 'finance':
        return <FinanceSection />;
      case 'sales':
        return <SalesSection />;
      case 'ceo':
        return <CEOSection />;
      case 'developer':
        return <DeveloperSection />;
      default:
        return <OverviewSection ideaTitle={ideaTitle} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0B0B0F]">
      <TeamSidebar activeTeam={activeTeam} onSelectTeam={setActiveTeam} />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Workspace;