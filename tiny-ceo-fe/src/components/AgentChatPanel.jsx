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
      <div className="fixed bottom-4 right-4 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-4 cursor-pointer hover:bg-gray-800 transition-all"
           onClick={() => setIsMinimized(false)}>
        <div className="flex items-center gap-2">
          <MessageCircle className={`text-${color}-500`} size={20} />
          <span className="text-white font-medium">{agentNames[agentType]} Agent</span>
          <span className="text-gray-400 text-sm ml-2">{messages.length} messages</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-gray-900 border border-gray-700 rounded-lg shadow-2xl flex flex-col z-50">
      {/* Header */}
      <div className={`p-4 border-b border-gray-700 flex items-center justify-between bg-${color}-600/10`}>
        <div className="flex items-center gap-2">
          <MessageCircle className={`text-${color}-500`} size={20} />
          <div>
            <h3 className="text-white font-semibold">{agentNames[agentType]} Agent</h3>
            <p className="text-gray-400 text-xs">Ask me anything about this section</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-gray-400 hover:text-white transition-colors"
            title="Minimize"
          >
            <Minimize2 size={18} />
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <MessageCircle size={48} className={`text-${color}-500/30 mx-auto mb-4`} />
            <p className="text-sm">Start a conversation with the {agentNames[agentType]} Agent</p>
            <p className="text-xs mt-2 text-gray-500">Ask questions about recommendations, strategies, or get clarifications</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? `bg-${color}-600 text-white`
                  : 'bg-gray-800 text-gray-200'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
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
      <div className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-${color}-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className={`px-4 py-2 bg-${color}-600 hover:bg-${color}-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-all flex items-center gap-2`}
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
}

export default AgentChatPanel;
