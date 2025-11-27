import React, { useState } from 'react';
import { Send, Plus, Sparkles } from 'lucide-react';

// IdeaSidebar Component
function IdeaSidebar({ ideas, activeIdeaIndex, onSelectIdea, onNewIdea }) {
  return (
    <div className="w-64 bg-[#0B0B0F] border-r border-gray-800 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={onNewIdea}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} />
          <span className="font-medium">New Idea</span>
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
function IdeaChat({ idea, onSendMessage, onCreateSpace }) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
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
            disabled={!input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:shadow-none flex items-center gap-2"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Main IdeaPage Component
function Home() {
  const [ideas, setIdeas] = useState([
    { title: 'New Idea', messages: [] }
  ]);
  const [activeIdeaIndex, setActiveIdeaIndex] = useState(0);

  const addNewIdea = () => {
    const newIdea = { title: `New Idea ${ideas.length + 1}`, messages: [] };
    setIdeas([...ideas, newIdea]);
    setActiveIdeaIndex(ideas.length);
  };


  const updateMessages = (message) => {
    const updatedIdeas = [...ideas];
    const activeIdea = updatedIdeas[activeIdeaIndex];
    
    // Add user message
    activeIdea.messages.push({
      sender: 'user',
      text: message
    });

    // Update title based on first message
    if (activeIdea.messages.length === 1) {
      activeIdea.title = message.slice(0, 30) + (message.length > 30 ? '...' : '');
    }

    // Add AI response
    const aiResponses = [
      "Tell me more about that! What makes this idea unique?",
      "Interesting! Who would be your target customers?",
      "Great insight! How do you plan to monetize this?",
      "I love it! What's the biggest challenge you foresee?",
      "Excellent! What resources would you need to get started?"
    ];
    
    activeIdea.messages.push({
      sender: 'ai',
      text: aiResponses[Math.floor(Math.random() * aiResponses.length)]
    });

    setIdeas(updatedIdeas);
  };

  const handleCreateSpace = () => {
    alert('🚀 Creating your Startup Space! (This will connect to the next page)');
    window.location.href = '/workspace';
  };

  return (
    <div className="flex h-screen bg-[#0B0B0F]">
      <IdeaSidebar
        ideas={ideas}
        activeIdeaIndex={activeIdeaIndex}
        onSelectIdea={setActiveIdeaIndex}
        onNewIdea={addNewIdea}
      />
      <IdeaChat
        idea={ideas[activeIdeaIndex]}
        onSendMessage={updateMessages}
        onCreateSpace={handleCreateSpace}
      />
    </div>
  );
}

export default Home;