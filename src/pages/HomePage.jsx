import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  ArrowRight,
  Palette,
  Coffee,
  Users,
  Compass,
  BookHeart,
  Wand2,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { StorageService } from '../services/storage.js';

export const HomePage = ({
  onNavigate,
  onSelectActivity,
  onCommitActivity,
  onOpenCompletionModal,
  onLaunchRecommendationWithIntent,
}) => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const loadData = () => {
    setSelectedPlan(StorageService.getSelectedPlan());
  };

  useEffect(() => {
    loadData();
    return StorageService.subscribe(loadData);
  }, []);

  // Time-aware greeting
  const currentHour = new Date().getHours();
  const isNight = currentHour >= 18 || currentHour < 5;
  const isMorning = currentHour >= 5 && currentHour < 12;

  const greeting = isNight
    ? 'Good evening, Sparks.'
    : isMorning
    ? 'Good morning, Sparks.'
    : 'Good afternoon, Sparks.';

  // 6 Intention moment pathways
  const momentOptions = [
    {
      id: 'create',
      label: 'Create',
      description: 'Make something tangible with your hands or words',
      icon: Palette,
      themeColor: '#FF2E79',
      bgHover: 'hover:bg-[#FFF0F5] hover:border-[#FFD6E5]',
    },
    {
      id: 'rest',
      label: 'Rest',
      description: 'Guilt-free restoration without screens or pressure',
      icon: Coffee,
      themeColor: '#059669',
      bgHover: 'hover:bg-[#ECFDF5] hover:border-[#A7F3D0]',
    },
    {
      id: 'connect',
      label: 'Connect',
      description: 'Shared warmth, friends, community, or conversation',
      icon: Users,
      themeColor: '#EA580C',
      bgHover: 'hover:bg-[#FFF7ED] hover:border-[#FED7AA]',
    },
    {
      id: 'entertain',
      label: 'Adventure',
      description: 'Independent cinema, discovery, fresh spaces, and out',
      icon: Compass,
      themeColor: '#0284C7',
      bgHover: 'hover:bg-[#F0F9FF] hover:border-[#BAE6FD]',
    },
    {
      id: 'reflect',
      label: 'Reflect',
      description: 'Quiet journaling, tea, and grounding perspective',
      icon: BookHeart,
      themeColor: '#7C3AED',
      bgHover: 'hover:bg-[#F5F3FF] hover:border-[#DDD6FE]',
    },
    {
      id: 'surprise',
      label: 'Surprise Me',
      description: 'Let Cue pull an unexpected wildcard from your library',
      icon: Wand2,
      themeColor: '#D97706',
      bgHover: 'hover:bg-[#FFFBEB] hover:border-[#FDE68A]',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-10">
      {/* 1. If an activity is selected: SHOW CURRENT PLAN */}
      {selectedPlan && selectedPlan.activity && (
        <div className="bg-white border-2 border-[#21181D] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-[#FF2E79] px-3 py-1 rounded-full bg-[#FFE5EF]">
              {selectedPlan.targetTime || 'TONIGHT'}
            </span>
            <span className="text-xs font-bold text-[#8A7983] capitalize">
              {selectedPlan.status === 'in_progress' ? 'In Progress' : 'Selected'}
            </span>
          </div>

          <div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#21181D] tracking-tight uppercase">
              {selectedPlan.activity.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#665760] font-medium mt-1">
              Your choice for {selectedPlan.targetTime?.toLowerCase() || 'tonight'}.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              id="home-continue-plan-btn"
              type="button"
              onClick={() => onNavigate('my_plan')}
              className="px-6 py-3 bg-[#FF2E79] hover:bg-[#E01A63] text-white text-xs sm:text-sm font-black rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Continue</span>
            </button>

            <button
              id="home-change-plan-btn"
              type="button"
              onClick={() => onNavigate('my_plan')}
              className="px-4 py-3 bg-[#F5EDF0] hover:bg-[#EBE3E7] text-[#21181D] text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Change
            </button>
          </div>
        </div>
      )}

      {/* 2. Emotional Prompt Header */}
      <div className="text-center space-y-3">
        <h1 className="font-display font-black text-3xl sm:text-5xl text-[#21181D] tracking-tight">
          {greeting}
        </h1>

        <p className="font-display font-bold text-xl sm:text-2xl text-[#665760] tracking-tight">
          What kind of moment do you want?
        </p>

        <p className="text-xs sm:text-sm text-[#8A7983] max-w-md mx-auto pt-1 leading-relaxed">
          You've already chosen what belongs in your life. When you don't know what to do right now, Cue helps you choose.
        </p>
      </div>

      {/* 3. Obvious Primary Action: [ What Should I Do? ] */}
      <div className="flex flex-col items-center gap-3">
        <button
          id="home-primary-what-should-i-do-btn"
          type="button"
          onClick={() => onNavigate('recommend')}
          className="w-full sm:w-auto px-10 py-5 bg-[#21181D] hover:bg-[#FF2E79] active:scale-[0.99] text-white text-base sm:text-lg font-black uppercase tracking-wider rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer group"
        >
          <Sparkles className="w-5 h-5 fill-white group-hover:rotate-12 transition-transform" />
          <span>What Should I Do?</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <span className="text-xs text-[#8A7983]">
          Gives you 3 compatible choices matched to your current context
        </span>
      </div>

      {/* 4. Or Jump In By Moment Type */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-[#F0E6EC] pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8A7983]">
            Or choose a direction to explore
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {momentOptions.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                id={`moment-btn-${m.id}`}
                type="button"
                onClick={() => {
                  if (onLaunchRecommendationWithIntent) {
                    onLaunchRecommendationWithIntent(m.id);
                  } else {
                    onNavigate('recommend');
                  }
                }}
                className={`bg-white rounded-2xl p-4 border border-[#EBE3E7] ${m.bgHover} text-left transition-all flex flex-col justify-between gap-3 cursor-pointer hover:shadow-xs group`}
              >
                <div className="flex items-center justify-between">
                  <span
                    style={{ color: m.themeColor }}
                    className="font-display font-black text-sm tracking-wide uppercase"
                  >
                    {m.label}
                  </span>
                  <div
                    style={{ color: m.themeColor }}
                    className="w-8 h-8 rounded-xl bg-[#FAF7F8] group-hover:bg-white flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-xs text-[#665760] leading-relaxed">
                  {m.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
