import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, AlertCircle } from 'lucide-react';
import { AiService } from '../services/aiService.js';

export const AiAssistantModal = ({
  isOpen,
  onClose,
  onNavigateToRecommend,
}) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'cue',
      text: "Hi Sparks! Ask me anything about what to do right now (e.g., 'I have 1 hour and want to make something tangible at home').",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userText = query.trim();
    setQuery('');
    setMessages((prev) => [...prev, { sender: 'sparks', text: userText }]);
    setIsLoading(true);

    try {
      const response = await AiService.askCue(userText);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'cue',
          text: response.text,
          source: response.source,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'cue',
          text: "Couldn't complete request. The 'What Should I Do?' questionnaire is always ready to give you instant recommendations.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="ask-cue-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-[#FAD2E1] flex flex-col h-[520px]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F7E5EC]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#FFE5EF] text-[#FF2E79] flex items-center justify-center">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#2D262A]">
                Ask Cue
              </h3>
              <p className="text-[11px] text-[#8A7983]">
                Conversational companion for your life library
              </p>
            </div>
          </div>

          <button
            id="close-ask-cue-btn"
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-[#8A7983] hover:text-[#2D262A] hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === 'sparks' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'sparks'
                    ? 'bg-[#FF2E79] text-white'
                    : 'bg-[#FFF8FA] text-[#2D262A] border border-[#FAD2E1]'
                }`}
              >
                <p>{msg.text}</p>
                {msg.source === 'local_engine' && (
                  <div className="mt-2 pt-1.5 border-t border-[#FAD2E1] flex items-center justify-between gap-2">
                    <span className="text-[10px] text-[#8A7983] flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-500" />
                      Local mode active
                    </span>
                    {onNavigateToRecommend && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onNavigateToRecommend();
                        }}
                        className="text-[10px] font-bold text-[#FF2E79] underline cursor-pointer"
                      >
                        Open Questionnaire
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#FFF8FA] border border-[#FAD2E1] rounded-2xl px-4 py-2.5 text-xs text-[#8A7983]">
                Cue is checking your library...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="pt-3 border-t border-[#F7E5EC] flex gap-2">
          <input
            type="text"
            placeholder="Tell Cue your situation (e.g. 'Low energy, 30m, at home')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-[#FAD2E1] focus:outline-hidden focus:ring-2 focus:ring-[#FF4D8D]"
          />
          <button
            id="send-ask-cue-btn"
            type="submit"
            disabled={!query.trim() || isLoading}
            className="px-4 py-2.5 bg-[#FF2E79] disabled:bg-gray-200 text-white text-xs font-bold rounded-xl hover:bg-[#E01A63] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
