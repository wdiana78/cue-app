import React, { useState } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';

const LEFT_REASONS = [
  'Not tonight',
  'Too tired',
  'Too much effort',
  'Too expensive',
  'Too much time',
  "Don't have what I need",
  'Already did it recently',
  'I like it, just not now',
  'Not my thing',
  'Other',
];

const RIGHT_REASONS = [
  'Sounds fun',
  "I've wanted to try this",
  'I love this',
  'I want to learn this',
  'I want to create something',
  'I want something tangible',
  'I could sell what I make',
  'I want to relax',
  'I want something meaningful',
  'Other',
];

export const SwipeReasonModal = ({
  isOpen,
  activityName,
  direction, // 'left' or 'right'
  onSelectReason,
  onSkip,
}) => {
  const [customText, setCustomText] = useState('');
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  if (!isOpen) return null;

  const isRight = direction === 'right';
  const reasonList = isRight ? RIGHT_REASONS : LEFT_REASONS;

  const handleReasonClick = (reason) => {
    if (reason === 'Other') {
      setIsOtherSelected(true);
    } else {
      onSelectReason(reason);
      setCustomText('');
      setIsOtherSelected(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    onSelectReason(customText.trim() || 'Other');
    setCustomText('');
    setIsOtherSelected(false);
  };

  return (
    <div
      id="swipe-reason-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-[#FAD2E1] space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                isRight ? 'bg-[#2AC59B]' : 'bg-[#FF5C8A]'
              }`}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-[#8A7983]">
              {isRight ? 'Interested' : 'Not right now'}
            </span>
          </div>

          <button
            id="skip-reason-btn"
            type="button"
            onClick={onSkip}
            className="text-xs font-bold text-[#8A7983] hover:text-[#2D262A] px-2.5 py-1 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Skip</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div>
          <h3 className="font-display font-bold text-xl text-[#2D262A]">
            Why?
          </h3>
          <p className="text-xs text-[#6B5E66] mt-1">
            Tap a quick reason for <span className="font-semibold text-[#2D262A]">"{activityName}"</span> so Cue learns your contextual flow.
          </p>
        </div>

        {/* 1-Tap Reasons Grid */}
        <div className="grid grid-cols-2 gap-2">
          {reasonList.map((reason) => (
            <button
              key={reason}
              id={`reason-btn-${reason.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              type="button"
              onClick={() => handleReasonClick(reason)}
              className={`text-left text-xs font-semibold px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer ${
                reason === 'Not my thing'
                  ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                  : 'border-[#F5E6EC] bg-[#FFFBFD] text-[#4A3E45] hover:bg-[#FFE5EF] hover:border-[#FFB8D2]'
              }`}
            >
              {reason}
            </button>
          ))}
        </div>

        {/* Optional Custom Input */}
        {isOtherSelected && (
          <form onSubmit={handleCustomSubmit} className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="Tell Cue your thought..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              autoFocus
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-[#FAD2E1] focus:outline-hidden focus:ring-2 focus:ring-[#FF4D8D]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#FF2E79] text-white text-xs font-bold rounded-xl hover:bg-[#E01A63] cursor-pointer"
            >
              Save
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
