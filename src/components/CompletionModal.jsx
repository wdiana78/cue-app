import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, XCircle, RotateCcw, X, Heart } from 'lucide-react';

const FEEDBACK_OPTIONS = [
  { id: 'loved', label: 'Loved it', emoji: '😍' },
  { id: 'good', label: 'Good', emoji: '🙂' },
  { id: 'fine', label: 'Fine', emoji: '😐' },
  { id: 'not_really', label: 'Not really', emoji: '😕' },
  { id: 'never_again', label: 'Never again', emoji: '😩' },
];

export const CompletionModal = ({
  isOpen,
  activityName,
  onComplete, // (status: 'done' | 'didnt_happen' | 'changed_mind', feedback?: string, notes?: string) => void
  onClose,
}) => {
  const [step, setStep] = useState('status'); // 'status' | 'feedback'
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF2E79', '#2AC59B', '#FFB703', '#A084E8'],
      });
    } catch {
      // safe fallback if canvas is restricted
    }
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    if (status === 'done') {
      triggerConfetti();
      setStep('feedback');
    } else {
      // Immediately finalize if didn't happen or changed mind
      onComplete(status, null, '');
      resetAndClose();
    }
  };

  const handleFinishFeedback = () => {
    onComplete(selectedStatus, feedback, notes);
    resetAndClose();
  };

  const resetAndClose = () => {
    setStep('status');
    setSelectedStatus(null);
    setFeedback(null);
    setNotes('');
    onClose();
  };

  return (
    <div
      id="completion-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#FAD2E1] space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF4D8D]">
            <Sparkles className="w-4 h-4" />
            <span>Activity Check-in</span>
          </div>

          <button
            id="close-completion-btn"
            type="button"
            onClick={resetAndClose}
            className="p-1 rounded-full text-[#8A7983] hover:text-[#2D262A] hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h2 className="font-display font-extrabold text-2xl text-[#2D262A]">
            {step === 'status' ? 'How did it go?' : 'How was it?'}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5E66] mt-1">
            {step === 'status' ? (
              <>
                Checking in on <span className="font-semibold text-[#2D262A]">"{activityName}"</span>
              </>
            ) : (
              'Your honest feedback teaches Cue what brings you real delight.'
            )}
          </p>
        </div>

        {/* Step 1: Status Selection */}
        {step === 'status' && (
          <div className="space-y-3">
            <button
              id="status-done-btn"
              type="button"
              onClick={() => handleStatusSelect('done')}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#1B5E20] border border-[#A5D6A7] transition-all cursor-pointer text-left"
            >
              <CheckCircle2 className="w-6 h-6 text-[#2E7D32] shrink-0" />
              <div>
                <span className="font-display font-bold text-base block">Done!</span>
                <span className="text-xs text-[#2E7D32]">I spent time on this today.</span>
              </div>
            </button>

            <button
              id="status-didnt-happen-btn"
              type="button"
              onClick={() => handleStatusSelect('didnt_happen')}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-[#FFF8FA] hover:bg-[#FFE5EF] text-[#6B5E66] border border-[#FAD2E1] transition-all cursor-pointer text-left"
            >
              <RotateCcw className="w-6 h-6 text-[#8A7983] shrink-0" />
              <div>
                <span className="font-display font-bold text-base block">Didn't happen</span>
                <span className="text-xs text-[#8A7983]">Life got in the way, maybe next time.</span>
              </div>
            </button>

            <button
              id="status-changed-mind-btn"
              type="button"
              onClick={() => handleStatusSelect('changed_mind')}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 text-[#6B5E66] border border-gray-200 transition-all cursor-pointer text-left"
            >
              <XCircle className="w-6 h-6 text-[#8A7983] shrink-0" />
              <div>
                <span className="font-display font-bold text-base block">Changed my mind</span>
                <span className="text-xs text-[#8A7983]">Decided on something else.</span>
              </div>
            </button>
          </div>
        )}

        {/* Step 2: Optional Feedback */}
        {step === 'feedback' && (
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-1.5">
              {FEEDBACK_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  id={`feedback-${opt.id}`}
                  type="button"
                  onClick={() => setFeedback(opt.id)}
                  className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    feedback === opt.id
                      ? 'border-[#FF2E79] bg-[#FFE5EF] ring-2 ring-[#FF2E79]/20'
                      : 'border-[#F5E6EC] bg-white hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl block mb-1">{opt.emoji}</span>
                  <span className="text-[10px] font-bold text-[#4A3E45] block truncate">
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>

            <textarea
              placeholder="Any quick notes or reflections? (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full text-xs p-3 rounded-xl border border-[#FAD2E1] focus:outline-hidden focus:ring-2 focus:ring-[#FF4D8D]"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleFinishFeedback}
                className="w-full py-3 bg-[#FF2E79] hover:bg-[#E01A63] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Save & Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
