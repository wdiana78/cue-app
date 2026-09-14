import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  CheckCircle2,
  Moon,
  Sun,
  Palette,
  Brain,
  BookHeart,
  Users,
  Film,
  Coffee,
  Wand2,
  ArrowRight,
  Clock,
  BookOpen,
  Flame,
} from 'lucide-react';
import { StorageService } from '../services/storage.js';

export const HomePage = ({
  onNavigate, // (tabName: string) => void
  onSelectActivity,
  onCommitActivity,
  onOpenCompletionModal,
  onLaunchRecommendationWithIntent, // (intent: string) => void
}) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeProjects, setActiveProjects] = useState([]);

  const loadData = () => {
    setSelectedPlan(StorageService.getSelectedPlan());
    const projs = StorageService.getProjects();
    setActiveProjects(projs.filter((p) => p.status === 'in_progress'));
  };

  useEffect(() => {
    loadData();
    return StorageService.subscribe(loadData);
  }, []);

  // Determine current time
  const currentHour = new Date().getHours();
  const isNightTime = currentHour >= 18 || currentHour < 5;
  const isMorning = currentHour >= 5 && currentHour < 12;

  const greeting = isNightTime
    ? 'GOOD EVENING, SPARKS.'
    : isMorning
    ? 'GOOD MORNING, SPARKS.'
    : 'GOOD AFTERNOON, SPARKS.';

  const promptQuestion = isNightTime
    ? 'What kind of night do you want?'
    : 'What do you want right now?';

  // 7 explicit intent buttons with rich deliberate palette colors
  const intentButtons = [
    {
      id: 'create',
      label: 'CREATE',
      subtitle: 'Make an artifact or craft',
      icon: Palette,
      accent: '#E11D48',
      bg: 'hover:bg-[#FFF1F2]',
      border: 'hover:border-[#FECDD3]',
    },
    {
      id: 'develop',
      label: 'DEVELOP',
      subtitle: 'Skills, code & career',
      icon: Brain,
      accent: '#0284C7',
      bg: 'hover:bg-[#F0F9FF]',
      border: 'hover:border-[#BAE6FD]',
    },
    {
      id: 'reflect',
      label: 'REFLECT',
      subtitle: 'Contemplation & journal',
      icon: BookHeart,
      accent: '#7C3AED',
      bg: 'hover:bg-[#F5F3FF]',
      border: 'hover:border-[#DDD6FE]',
    },
    {
      id: 'connect',
      label: 'CONNECT',
      subtitle: 'Friends, family & warmth',
      icon: Users,
      accent: '#EA580C',
      bg: 'hover:bg-[#FFF7ED]',
      border: 'hover:border-[#FED7AA]',
    },
    {
      id: 'entertain',
      label: 'ENTERTAIN',
      subtitle: 'Cinema, music & stories',
      icon: Film,
      accent: '#9333EA',
      bg: 'hover:bg-[#FAF5FF]',
      border: 'hover:border-[#E9D5FF]',
    },
    {
      id: 'rest',
      label: 'REST',
      subtitle: 'Guilt-free restoration',
      icon: Coffee,
      accent: '#0D9488',
      bg: 'hover:bg-[#F0FDFA]',
      border: 'hover:border-[#99F6E4]',
    },
    {
      id: 'surprise',
      label: 'SURPRISE ME',
      subtitle: 'Spontaneous spark',
      icon: Wand2,
      accent: '#D97706',
      bg: 'hover:bg-[#FFFBEB]',
      border: 'hover:border-[#FDE68A]',
    },
  ];

  const handleIntentClick = (intentId) => {
    if (onLaunchRecommendationWithIntent) {
      onLaunchRecommendationWithIntent(intentId);
    } else {
      onNavigate('recommend');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* 1. If an activity is selected: HOME REFLECTS THE CURRENT PLAN */}
      {selectedPlan && selectedPlan.activity ? (
        <div className="bg-white border-2 border-[#21181D] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#FF2E79] px-3 py-1 rounded-full bg-[#FFE5EF]">
              {selectedPlan.targetTime || 'TONIGHT'}
            </span>

            {selectedPlan.status === 'in_progress' ? (
              <span className="text-xs font-bold text-[#0066CC] bg-[#EBF5FF] px-2.5 py-1 rounded-full animate-pulse">
                In Progress
              </span>
            ) : (
              <span className="text-xs font-bold text-[#8A7983]">
                Your Plan
              </span>
            )}
          </div>

          <div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#21181D] tracking-tight uppercase leading-snug">
              {selectedPlan.activity.name}
            </h2>
            <p className="text-sm text-[#665760] mt-1.5 font-medium leading-relaxed">
              Your choice for {selectedPlan.targetTime?.toLowerCase() || 'tonight'}.
              {selectedPlan.activity.durationLabel && ` · ${selectedPlan.activity.durationLabel}`}
              {selectedPlan.activity.locationContext && ` · ${selectedPlan.activity.locationContext}`}
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              id="home-continue-plan-btn"
              type="button"
              onClick={() => onNavigate('up_next')}
              className="px-6 py-3 bg-[#FF2E79] hover:bg-[#E01A63] text-white text-xs sm:text-sm font-black rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Continue</span>
            </button>

            <button
              id="home-change-plan-btn"
              type="button"
              onClick={() => onNavigate('up_next')}
              className="px-4 py-3 bg-[#F5EDF0] hover:bg-[#EBE3E7] text-[#21181D] text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Change
            </button>
          </div>
        </div>
      ) : null}

      {/* 2. Header & Core Question */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0F4] text-[#FF2E79] text-xs font-black uppercase tracking-widest">
          {isNightTime ? <Moon className="w-3.5 h-3.5 text-[#FF2E79]" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
          <span>{isNightTime ? 'Evening Rhythm' : 'Daylight Rhythm'}</span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl text-[#21181D] tracking-tight">
          {greeting}
        </h1>

        <p className="font-display font-extrabold text-xl sm:text-2xl text-[#665760] tracking-tight">
          {promptQuestion}
        </p>

        <p className="text-xs sm:text-sm text-[#8A7983] max-w-md mx-auto">
          Sparks decides what belongs in her life. Cue helps her decide what to do right now.
        </p>
      </div>

      {/* 3. Real Active Project Banner (Only if an actual project exists created by the user!) */}
      {activeProjects.length > 0 && (
        <div
          id="active-project-banner"
          className="bg-white border border-[#DDD6FE] rounded-2xl p-4 shadow-xs flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#7C3AED] block">
                Active Project
              </span>
              <h4 className="font-display font-bold text-sm text-[#21181D]">
                {activeProjects[0].title}
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('projects')}
            className="px-3.5 py-1.5 text-xs font-bold bg-[#7C3AED] text-white rounded-xl hover:bg-[#6D28D9] transition-colors cursor-pointer"
          >
            Resume
          </button>
        </div>
      )}

      {/* 4. The 7 Intention Buttons */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {intentButtons.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={`intent-btn-${item.id}`}
                type="button"
                onClick={() => handleIntentClick(item.id)}
                className={`group bg-white rounded-2xl p-4 border border-[#EBE3E7] ${item.border} ${item.bg} transition-all duration-200 text-left flex items-start gap-3.5 cursor-pointer hover:shadow-xs`}
              >
                <div
                  style={{ color: item.accent }}
                  className="w-10 h-10 rounded-xl bg-[#FAF7F8] group-hover:bg-white flex items-center justify-center shrink-0 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-sm text-[#21181D] tracking-wide">
                    {item.label}
                  </h3>
                  <p className="text-xs text-[#8A7983] mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Custom Context CTA */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F0E6EC] text-center space-y-4">
        <div className="max-w-md mx-auto space-y-1.5">
          <h2 className="font-display font-black text-lg sm:text-xl text-[#21181D]">
            Have specific conditions right now?
          </h2>
          <p className="text-xs text-[#665760] leading-relaxed">
            Specify where you are, who you're with, your energy level, and how much time you have. Cue will find 3 options that strictly fit.
          </p>
        </div>

        <button
          id="home-help-me-choose-btn"
          type="button"
          onClick={() => onNavigate('recommend')}
          className="px-8 py-3.5 bg-[#21181D] hover:bg-[#FF2E79] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Help me choose with custom context</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 6. Quick Links */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onNavigate('explore')}
          className="bg-white p-4 rounded-2xl border border-[#F0E6EC] hover:border-[#D6C7CF] transition-colors text-left flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FFE5EF] text-[#FF2E79] flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-display font-bold text-xs text-[#21181D] group-hover:text-[#FF2E79] transition-colors">
              My Life Library
            </h4>
            <p className="text-[11px] text-[#8A7983]">
              Browse all 68 chosen activities
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('train')}
          className="bg-white p-4 rounded-2xl border border-[#F0E6EC] hover:border-[#D6C7CF] transition-colors text-left flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#FFF0E6] text-[#EA580C] flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-display font-bold text-xs text-[#21181D] group-hover:text-[#EA580C] transition-colors">
              Train My Cue
            </h4>
            <p className="text-[11px] text-[#8A7983]">
              Swipe on ideas to teach Cue
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
