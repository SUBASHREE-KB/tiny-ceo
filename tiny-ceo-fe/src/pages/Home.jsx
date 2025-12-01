import React, { useState, useEffect } from 'react';
import { Send, Plus, Sparkles, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { workspaceAPI, conversationAPI, agentAPI, authAPI } from '../utils/api';

// IdeaSidebar Component
function IdeaSidebar({ ideas, activeIdeaIndex, onSelectIdea, onNewIdea, onLogout }) {
  return (
    <div className="w-64 bg-[#0B0B0F] border-r border-gray-800 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-800 space-y-2">
        <button
          onClick={onNewIdea}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} />
          <span className="font-medium">New Idea</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all"
        >
          <LogOut size={16} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        {ideas.map((idea, index) => (
          <button
            key={index}
            onClick={() => onSelectIdea(index)}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-all ${
              activeIdeaIndex === index
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 shadow-md shadow-blue-500/10'
                : 'bg-gray-800/30 hover:bg-gray-800/50 border border-transparent'
            }`}
          >
            <p className="text-white font-medium truncate">{idea.title}</p>
            <p className="text-gray-400 text-sm mt-1">
              {idea.messages.length} messages
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

// IdeaChat Component
function IdeaChat({ idea, onSendMessage, onCreateSpace, loading }) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() && !loading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#0B0B0F]">
      {/* Header */}
      <div className="border-b border-gray-800 p-6">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Sparkles className="text-blue-500" size={32} />
          Welcome to Tiny CEO
        </h1>
        <p className="text-gray-400">
          Share your startup idea and let's bring it to life
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {idea.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Sparkles className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Start Your Journey
              </h2>
              <p className="text-gray-400">
                Tell me about your startup idea. What problem are you solving?
              </p>
            </div>
          </div>
        ) : (
          idea.messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-lg px-5 py-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-gray-800 text-gray-100 border border-gray-700'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 p-6">
        {idea.messages.length >= 4 && (
          <div className="mb-4">
            <button
              onClick={onCreateSpace}
              className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
            >
              <Sparkles size={20} />
              Create Startup Space
            </button>
          </div>
        )}
        
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your startup idea..."
            className="flex-1 px-5 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:shadow-none flex items-center gap-2"
          >
            {loading ? '...' : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main IdeaPage Component
function Home() {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspaceIndex, setActiveWorkspaceIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load workspaces on mount
  useEffect(() => {
    loadWorkspaces();
  }, []);

  const loadWorkspaces = async () => {
    try {
      const data = await workspaceAPI.getAll();
      if (data.workspaces && data.workspaces.length > 0) {
        // Transform workspaces to match UI format
        const formattedWorkspaces = data.workspaces.map(ws => ({
          id: ws.id,
          title: ws.title,
          messages: [] // Will load messages separately
        }));
        setWorkspaces(formattedWorkspaces);

        // Load messages for first workspace
        if (formattedWorkspaces[0].id) {
          loadMessages(0, formattedWorkspaces[0].id);
        }
      } else {
        // Create a default workspace if none exist
        await addNewIdea();
      }
    } catch (err) {
      console.error('Failed to load workspaces:', err);
      // Create default workspace on error
      setWorkspaces([{ title: 'New Idea', messages: [] }]);
    }
  };

  const loadMessages = async (index, workspaceId) => {
    try {
      const data = await conversationAPI.getMessages(workspaceId);
      if (data.messages) {
        const updatedWorkspaces = [...workspaces];
        updatedWorkspaces[index].messages = data.messages.map(msg => ({
          sender: msg.role === 'user' ? 'user' : 'ai',
          text: msg.content
        }));
        setWorkspaces(updatedWorkspaces);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const addNewIdea = async () => {
    try {
      const data = await workspaceAPI.create(`New Idea ${workspaces.length + 1}`, '');
      const newWorkspace = {
        id: data.workspace.id,
        title: data.workspace.title,
        messages: []
      };
      setWorkspaces([...workspaces, newWorkspace]);
      setActiveWorkspaceIndex(workspaces.length);
    } catch (err) {
      console.error('Failed to create workspace:', err);
      setError('Failed to create new workspace');
    }
  };

  const updateMessages = async (message) => {
    const activeWorkspace = workspaces[activeWorkspaceIndex];
    if (!activeWorkspace.id) {
      setError('Workspace not initialized');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Add user message optimistically
      const updatedWorkspaces = [...workspaces];
      updatedWorkspaces[activeWorkspaceIndex].messages.push({
        sender: 'user',
        text: message
      });

      // Update title based on first message
      if (updatedWorkspaces[activeWorkspaceIndex].messages.length === 1) {
        updatedWorkspaces[activeWorkspaceIndex].title = message.slice(0, 30) + (message.length > 30 ? '...' : '');
      }

      setWorkspaces(updatedWorkspaces);

      // Send message to API
      const data = await conversationAPI.sendMessage(activeWorkspace.id, message);

      // Add AI response
      if (data.response) {
        updatedWorkspaces[activeWorkspaceIndex].messages.push({
          sender: 'ai',
          text: data.response
        });
        setWorkspaces([...updatedWorkspaces]);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSpace = async () => {
    const activeWorkspace = workspaces[activeWorkspaceIndex];
    if (!activeWorkspace.id) {
      setError('Workspace not initialized');
      return;
    }

    setLoading(true);
    try {
      // Trigger agent generation
      await agentAPI.generateAll(activeWorkspace.id);
      // Navigate to workspace page
      navigate(`/workspace/${activeWorkspace.id}`);
    } catch (err) {
      console.error('Failed to create workspace:', err);
      setError('Failed to generate agent insights');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/auth');
  };

  const handleSelectWorkspace = async (index) => {
    setActiveWorkspaceIndex(index);
    const workspace = workspaces[index];
    if (workspace.id && workspace.messages.length === 0) {
      await loadMessages(index, workspace.id);
    }
  };

  if (workspaces.length === 0) {
    return <div className="flex items-center justify-center h-screen bg-[#0B0B0F] text-white">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-[#0B0B0F]">
      {error && (
        <div className="absolute top-4 right-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 z-50">
          {error}
        </div>
      )}
      <IdeaSidebar
        ideas={workspaces}
        activeIdeaIndex={activeWorkspaceIndex}
        onSelectIdea={handleSelectWorkspace}
        onNewIdea={addNewIdea}
        onLogout={handleLogout}
      />
      <IdeaChat
        idea={workspaces[activeWorkspaceIndex]}
        onSendMessage={updateMessages}
        onCreateSpace={handleCreateSpace}
        loading={loading}
      />
    </div>
  );
}

export default Home;