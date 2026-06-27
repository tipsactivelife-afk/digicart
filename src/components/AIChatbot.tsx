import { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  RotateCcw,
  Minimize2,
} from 'lucide-react';
import { useStore } from '../store';

export default function AIChatbot() {
  const { state, dispatch, sendChatMessage } = useStore();
  const { chatbot } = state.adminSettings;
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Don't render if chatbot is disabled
  if (!chatbot.enabled) return null;

  // Check if should show on current page
  const shouldShow = chatbot.showOnPages.includes(state.currentPage) || chatbot.showOnPages.includes('all');
  if (!shouldShow && state.currentPage !== 'admin') return null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [state.chatMessages]);

  useEffect(() => {
    if (state.isChatOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [state.isChatOpen]);

  const handleSend = async () => {
    if (!input.trim() || state.isChatLoading) return;
    const message = input.trim();
    setInput('');
    await sendChatMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = async (reply: string) => {
    await sendChatMessage(reply);
  };

  const positionClass = chatbot.position === 'left' ? 'left-4' : 'right-4';

  return (
    <div className={`fixed bottom-4 ${positionClass} z-[60]`}>
      {/* Chat Window */}
      {state.isChatOpen && (
        <div
          className="mb-3 w-[380px] max-w-[calc(100vw-2rem)] rounded-3xl border border-gray-200 bg-white shadow-2xl overflow-hidden animate-bounce-in flex flex-col"
          style={{ height: '520px', maxHeight: 'calc(100vh - 120px)' }}
        >
          {/* Header */}
          <div
            className="px-5 py-4 text-white flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${chatbot.primaryColor}, ${chatbot.primaryColor}dd)` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> DigiCraft AI
                  </p>
                  <p className="text-xs opacity-80">Usually replies instantly</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => dispatch({ type: 'CLEAR_CHAT' })}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                  title="Clear chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => dispatch({ type: 'CLOSE_CHAT' })}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {/* Welcome message */}
            {state.chatMessages.length === 0 && (
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${chatbot.primaryColor}20` }}
                  >
                    <Bot className="w-4 h-4" style={{ color: chatbot.primaryColor }} />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-100 max-w-[80%]">
                    <p className="text-sm text-gray-700">{chatbot.welcomeMessage}</p>
                  </div>
                </div>

                {/* Quick Replies */}
                {chatbot.quickReplies.length > 0 && (
                  <div className="flex flex-wrap gap-2 pl-11">
                    {chatbot.quickReplies.map((reply, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickReply(reply)}
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:border-primary-300 hover:text-primary-600 transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Chat messages */}
            {state.chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-gray-200'
                      : ''
                  }`}
                  style={message.role === 'assistant' ? { backgroundColor: `${chatbot.primaryColor}20` } : {}}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Bot className="w-4 h-4" style={{ color: chatbot.primaryColor }} />
                  )}
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white rounded-tr-md'
                      : 'bg-white shadow-sm border border-gray-100 rounded-tl-md'
                  }`}
                  style={message.role === 'user' ? { backgroundColor: chatbot.primaryColor } : {}}
                >
                  <p className={`text-sm whitespace-pre-wrap ${message.role === 'user' ? '' : 'text-gray-700'}`}>
                    {message.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {state.isChatLoading && (
              <div className="flex gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${chatbot.primaryColor}20` }}
                >
                  <Bot className="w-4 h-4" style={{ color: chatbot.primaryColor }} />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-100">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 bg-white flex-shrink-0">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={chatbot.placeholderText}
                disabled={state.isChatLoading}
                className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-primary-100 focus:border-primary-300 outline-none disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || state.isChatLoading}
                className="px-4 py-3 rounded-xl text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: chatbot.primaryColor }}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              Powered by AI • May produce inaccurate responses
            </p>
          </div>
        </div>
      )}

      {/* Chat Toggle Button */}
      <button
        onClick={() => dispatch({ type: 'TOGGLE_CHAT' })}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl hover:scale-105 transition-transform"
        style={{
          background: `linear-gradient(135deg, ${chatbot.primaryColor}, ${chatbot.primaryColor}dd)`,
          boxShadow: `0 10px 40px ${chatbot.primaryColor}40`,
        }}
        aria-label={state.isChatOpen ? 'Close chat' : 'Open chat'}
      >
        {state.isChatOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
