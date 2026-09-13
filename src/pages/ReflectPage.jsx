import React, { useState, useEffect } from 'react';
import { PenTool, Check, Trash2, Calendar, Sparkles } from 'lucide-react';
import { StorageService } from '../services/storage.js';

const MOODS = [
  { id: 'peaceful', label: 'Peaceful', emoji: '🌿' },
  { id: 'creative', label: 'Creative', emoji: '🎨' },
  { id: 'thoughtful', label: 'Thoughtful', emoji: '☕' },
  { id: 'energized', label: 'Energized', emoji: '⚡' },
  { id: 'restorative', label: 'Restorative', emoji: '✨' },
];

export const ReflectPage = () => {
  const [reflections, setReflections] = useState([]);
  const [mood, setMood] = useState('peaceful');
  const [content, setContent] = useState('');
  const [isWriting, setIsWriting] = useState(false);

  const loadReflections = () => {
    setReflections(StorageService.getReflections());
  };

  useEffect(() => {
    loadReflections();
    return StorageService.subscribe(loadReflections);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    StorageService.addReflection({
      mood,
      content: content.trim(),
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    });

    setContent('');
    setIsWriting(false);
  };

  const handleDelete = (id) => {
    StorageService.deleteReflection(id);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0F2F1] text-[#00897B] text-xs font-black tracking-wider uppercase mb-1">
            <PenTool className="w-3.5 h-3.5" />
            <span>Evening Reflection</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2D262A] tracking-tight">
            Reflect
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5E66] mt-1">
            A quiet space to capture what brought ease, clarity, or creative flow.
          </p>
        </div>

        {!isWriting && (
          <button
            id="write-reflection-btn"
            type="button"
            onClick={() => setIsWriting(true)}
            className="self-start sm:self-auto px-4 py-2.5 bg-[#00897B] hover:bg-[#00796B] text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <PenTool className="w-4 h-4" />
            <span>Write Entry</span>
          </button>
        )}
      </div>

      {/* Writing Form */}
      {isWriting && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl p-6 sm:p-7 border border-[#B2DFDB] shadow-sm space-y-5 animate-in fade-in duration-150"
        >
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-2">
              How are you feeling right now?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  id={`mood-${m.id}`}
                  type="button"
                  onClick={() => setMood(m.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mood === m.id
                      ? 'bg-[#E0F2F1] text-[#00796B] border-[#00897B]'
                      : 'bg-white text-[#6B5E66] border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-1">
              What felt right, joyful, or centering today?
            </label>
            <textarea
              id="reflection-text-input"
              rows={4}
              placeholder="e.g. Felt calm painting tonight. It took 40 minutes, but stepping away from screens and mixing colors cleared my head..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full text-xs sm:text-sm p-4 rounded-2xl border border-[#B2DFDB] focus:ring-2 focus:ring-[#00897B] focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="px-4 py-2 text-xs font-bold text-[#6B5E66] hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="save-reflection-btn"
              type="submit"
              className="px-5 py-2 bg-[#00897B] hover:bg-[#00796B] text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save Reflection</span>
            </button>
          </div>
        </form>
      )}

      {/* Reflections Log List */}
      {reflections.length > 0 ? (
        <div className="space-y-4">
          {reflections.map((item) => (
            <div
              key={item.id}
              id={`reflection-entry-${item.id}`}
              className="bg-white rounded-3xl p-6 border border-[#E0F2F1] shadow-xs space-y-2 hover:border-[#00897B] transition-colors"
            >
              <div className="flex items-center justify-between text-xs text-[#8A7983]">
                <div className="flex items-center gap-2">
                  <span className="capitalize font-bold text-[#00796B] px-2.5 py-0.5 rounded-full bg-[#E0F2F1]">
                    {item.mood}
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.date}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-[#2D262A] leading-relaxed whitespace-pre-line pt-1">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        /* Zero state when no reflections exist */
        <div className="bg-white rounded-3xl p-12 border border-[#E0F2F1] text-center space-y-3">
          <PenTool className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-display font-bold text-lg text-[#2D262A]">
            No reflections logged yet
          </h3>
          <p className="text-xs text-[#8A7983] max-w-sm mx-auto">
            Cue starts fresh. Whenever you want to reflect on a moment, craft session, or quiet evening, your thoughts will be preserved here.
          </p>
          <button
            type="button"
            onClick={() => setIsWriting(true)}
            className="px-4 py-2 bg-[#00897B] text-white text-xs font-bold rounded-xl hover:bg-[#00796B] transition-colors cursor-pointer"
          >
            Log Your First Reflection
          </button>
        </div>
      )}
    </div>
  );
};
