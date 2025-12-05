import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Minimize2 } from 'lucide-react';
import { apiRequest } from '../utils/api';

function AgentChatPanel({ agentType, workspaceId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await apiRequest(
        `/workspaces/${workspaceId}/agents/${agentType}/chat`,
        {
          method: 'POST',
          body: JSON.stringify({ message: input })
        }
      );

      const assistantMessage = {
        role: 'assistant',
        content: response.response || response.message || 'I understand. How can I help you further?'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const agentNames = {
    ceo: 'CEO Strategy',
    developer: 'Developer',
    finance: 'Finance',
    marketing: 'Marketing',
    sales: 'Sales',
    overview: 'Overview'
  };

  const agentColors = {
    ceo: 'indigo',
    developer: 'blue',
    finance: 'green',
    marketing: 'pink',
    sales: 'purple',
    overview: 'cyan'
  };

  const color = agentColors[agentType] || 'blue';

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-3 cursor-pointer hover:bg-gray-800 transition-all z-50"
           onClick={() => setIsMinimized(false)}>
        <div className="flex items-center gap-2">
          <MessageCircle className={`text-${color}-500`} size={18} />
          <span className="text-white font-medium text-sm">{agentNames[agentType]}</span>
          {messages.length > 0 && (
            <span className="text-gray-400 text-xs ml-1">({messages.length})</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-4 sm:right-4 sm:w-96 sm:max-w-md h-[80vh] sm:h-[600px] sm:max-h-[85vh] bg-gray-900 border-t sm:border border-gray-700 sm:rounded-lg shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className={`p-3 sm:p-4 border-b border-gray-700 flex items-center justify-between bg-${color}-600/10 flex-shrink-0`}>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <MessageCircle className={`text-${color}-500 flex-shrink-0`} size={20} />
          <div className="min-w-0">
            <h3 className="text-white font-semibold text-sm sm:text-base truncate">{agentNames[agentType]} Agent</h3>
            <p className="text-gray-400 text-xs hidden sm:block">Ask me anything</p>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
            title="Minimize"
            aria-label="Minimize chat"
          >
            <Minimize2 size={18} />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-red-900/20 rounded-lg transition-all"
            title="Close"
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 overscroll-contain">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-8 px-4">
            <MessageCircle size={40} className={`text-${color}-500/30 mx-auto mb-3`} />
            <p className="text-sm sm:text-base">Start a conversation with the {agentNames[agentType]} Agent</p>
            <p className="text-xs mt-2 text-gray-500">Ask questions about this section</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[80%] px-3 sm:px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? `bg-${color}-600 text-white`
                  : 'bg-gray-800 text-gray-200'
              }`}
            >
              <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-200 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-pulse">Thinking...</div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 sm:p-4 border-t border-gray-700 flex-shrink-0 bg-[#0B0B0F]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            disabled={loading}
            className="flex-1 px-3 sm:px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-${color}-500 focus:ring-2 focus:ring-${color}-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className={`px-3 sm:px-4 py-2 bg-${color}-600 hover:bg-${color}-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-all flex items-center justify-center flex-shrink-0`}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 hidden sm:block">Press Enter to send</p>
      </div>
    </div>
  );
}

export default AgentChatPanel;
