import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TeamSidebar from '../components/SideBar.jsx';
import OverviewSection from '../components/OverviewSection.jsx';
import MarketingSection from '../components/MarketingSection.jsx';
import FinanceSection from '../components/FinanceSection.jsx';
import SalesSection from '../components/SalesSection.jsx';
import CEOSection from '../components/CEOSection.jsx';
import DeveloperSection from '../components/DeveloperSection.jsx';
import { workspaceAPI, agentAPI } from '../utils/api';

// Main Workspace Component
function Workspace() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [activeTeam, setActiveTeam] = useState('overview');
  const [workspace, setWorkspace] = useState(null);
  const [agentOutputs, setAgentOutputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load workspace and agent outputs on mount
  useEffect(() => {
    loadWorkspaceData();
  }, [workspaceId]);

  const loadWorkspaceData = async () => {
    try {
      setLoading(true);
      const [workspaceData, agentsData] = await Promise.all([
        workspaceAPI.getById(workspaceId),
        agentAPI.getOutputs(workspaceId)
      ]);

      setWorkspace(workspaceData.workspace);

      // Transform agent outputs into a map
      if (agentsData.outputs) {
        const outputsMap = {};
        agentsData.outputs.forEach(output => {
          outputsMap[output.agent_type] = output.output_data;
        });
        setAgentOutputs(outputsMap);
      }
    } catch (err) {
      console.error('Failed to load workspace:', err);
      setError('Failed to load workspace data');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateAgent = async (agentType) => {
    try {
      const data = await agentAPI.regenerate(workspaceId, agentType);
      setAgentOutputs({
        ...agentOutputs,
        [agentType]: data.output
      });
    } catch (err) {
      console.error('Failed to regenerate agent:', err);
      setError(`Failed to regenerate ${agentType} agent`);
    }
  };

  const ideaTitle = workspace?.title || "Loading...";

  const renderContent = () => {
    if (loading) {
      return <div className="text-white text-center p-8">Loading agent insights...</div>;
    }

    switch (activeTeam) {
      case 'overview':
        return <OverviewSection ideaTitle={ideaTitle} data={agentOutputs.overview} onRegenerate={() => handleRegenerateAgent('overview')} workspaceId={workspaceId} />;
      case 'marketing':
        return <MarketingSection data={agentOutputs.marketing} onRegenerate={() => handleRegenerateAgent('marketing')} workspaceId={workspaceId} />;
      case 'finance':
        return <FinanceSection data={agentOutputs.finance} onRegenerate={() => handleRegenerateAgent('finance')} workspaceId={workspaceId} />;
      case 'sales':
        return <SalesSection data={agentOutputs.sales} onRegenerate={() => handleRegenerateAgent('sales')} workspaceId={workspaceId} />;
      case 'ceo':
        return <CEOSection data={agentOutputs.ceo} onRegenerate={() => handleRegenerateAgent('ceo')} workspaceId={workspaceId} />;
      case 'developer':
        return <DeveloperSection data={agentOutputs.developer} onRegenerate={() => handleRegenerateAgent('developer')} workspaceId={workspaceId} />;
      default:
        return <OverviewSection ideaTitle={ideaTitle} data={agentOutputs.overview} onRegenerate={() => handleRegenerateAgent('overview')} workspaceId={workspaceId} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0B0B0F]">
      {error && (
        <div className="absolute top-4 right-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 z-50">
          {error}
        </div>
      )}
      <TeamSidebar activeTeam={activeTeam} onSelectTeam={setActiveTeam} onBackToHome={() => navigate('/')} />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default Workspace;