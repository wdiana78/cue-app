import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  BookOpen,
  FolderKanban,
  PenTool,
  User,
  ArrowRight,
  CheckCircle2,
  Moon,
  Sun,
  Palette,
  Brain,
  BookHeart,
  Users,
  Tv,
  Coffee,
  Wand2,
} from 'lucide-react';
import { StorageService } from '../services/storage.js';

export const HomePage = ({
  onNavigate, // (tabName: string) => void
  onSelectActivity,
  onCommitActivity,
  onOpenCompletionModal,
  onLaunchRecommendationWithIntent, // (intent: string) => void
}) => {
  const [activeCommitment, setActiveCommitment] = useState(null);
  const [activeProjects, setActiveProjects] = useState([]);
  const [activitiesCount, setActivitiesCount] = useState(0);

  const loadData = () => {
    setActiveCommitment(StorageService.getActiveCommitment());
    const projs = StorageService.getProjects();
    setActiveProjects(projs.filter((p) => p.status === 'in_progress'));
    setActivitiesCount(StorageService.getActivities().length);
  };

  useEffect(() => {
    loadData();
    return StorageService.subscribe(loadData);
  }, []);

  // Determine day or night
  const currentHour = new Date().getHours();
  const isNightTime = currentHour >= 18 || currentHour < 6;

  const quickIntents = [
    { id: 'create', label: 'CREATE', icon: Palette, color: 'hover:border-pink-300 hover:bg-[#FFE5EF]' },
    { id: 'develop', label: 'DEVELOP', icon: Brain, color: 'hover:border-teal-300 hover:bg-[#E0F2F1]' },
    { id: 'reflect', label: 'REFLECT', icon: BookHeart, color: 'hover:border-purple-300 hover:bg-[#EDE7F6]' },
    { id: 'connect', label: 'CONNECT', icon: Users, color: 'hover:border-blue-300 hover:bg-[#E3F2FD]' },
    { id: 'entertain', label: 'ENTERTAIN', icon: Tv, color: 'hover:border-amber-300 hover:bg-[#FFF8E1]' },
    { id: 'rest', label: 'REST', icon: Coffee, color: 'hover:border-sky-300 hover:bg-[#E1F5FE]' },
    { id: 'surprise', label: 'SURPRISE ME', icon: Wand2, color: 'hover:border-rose-300 hover:bg-[#FFF0F5]' },
  ];

  const handleIntentClick = (intentId) => {
    if (intentId === 'reflect') {
      onNavigate('reflect');
    } else {
      if (onLaunchRecommendationWithIntent) {
        onLaunchRecommendationWithIntent(intentId);
      } else {
        onNavigate('recommend');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* 1. Dynamic Context Greeting */}
      <div className="text-center sm:text-left space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE5EF] text-[#FF2E79] text-xs font-bold tracking-wide">
          {isNightTime ? <Moon className="w-3.5 h-3.5 text-[#FF2E79]" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
          <span>{isNightTime ? 'Evening Rhythm' : 'Daytime Flow'}</span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2D262A] tracking-tight">
          {isNightTime ? 'GOOD EVENING, SPARKS.' : 'HELLO, SPARKS.'}
        </h1>
        <p className="text-sm text-[#6B5E66] max-w-xl">
          Sparks decides what belongs in her life. Cue helps her decide what to do right now.
        </p>
      </div>

      {/* Active Commitment Banner (Only if Sparks chose "I'll do this") */}
      {activeCommitment && (
        <div
          id="active-commitment-banner"
          className="bg-gradient-to-r from-[#FFF0F5] to-[#E8F5E9] border-2 border-[#A5D6A7] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E7D32] block">
                Current Commitment
              </span>
              <h3 className="font-display font-extrabold text-lg text-[#2D262A]">
                {activeCommitment.activityName}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              id="checkin-commitment-btn"
              type="button"
              onClick={() => onOpenCompletionModal(activeCommitment.activityName)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-[#2E7D32] text-white text-xs font-bold rounded-xl hover:bg-[#1B5E20] transition-colors cursor-pointer text-center"
            >
              Check in / Complete
            </button>
            <button
              id="cancel-commitment-btn"
              type="button"
              onClick={() => StorageService.clearActiveCommitment()}
              className="px-3 py-2.5 text-xs text-[#8A7983] hover:text-[#2D262A] rounded-xl hover:bg-white/60 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Real Project Banner (Only if a real project exists!) */}
      {activeProjects.length > 0 && (
        <div
          id="active-project-banner"
          className="bg-white border border-[#FAD2E1] rounded-3xl p-5 shadow-xs flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EDE7F6] text-[#7A52B3] flex items-center justify-center shrink-0">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A52B3] block">
                Continue Your Project?
              </span>
              <h4 className="font-display font-bold text-base text-[#2D262A]">
                {activeProjects[0].title}
              </h4>
              {activeProjects[0].currentStep && (
                <p className="text-xs text-[#6B5E66] mt-0.5">
                  Next: {activeProjects[0].currentStep}
                </p>
              )}
            </div>
          </div>

          <button
            id="open-active-project-btn"
            type="button"
            onClick={() => onNavigate('projects')}
            className="px-3.5 py-2 text-xs font-bold bg-[#7A52B3] text-white rounded-xl hover:bg-[#5C3D88] transition-colors cursor-pointer"
          >
            Open Projects
          </button>
        </div>
      )}

      {/* 2. PRIMARY ACTION: WHAT SHOULD I DO? */}
      <div
        id="primary-action-card"
        className="relative overflow-hidden bg-gradient-to-br from-[#FF2E79] via-[#FF5C8A] to-[#FFA07A] text-white rounded-3xl p-7 sm:p-9 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
        onClick={() => onNavigate('recommend')}
      >
        <div className="relative z-10 max-w-lg space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-black tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 fill-white" />
            <span>Core Decision Pathway</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight leading-tight">
            WHAT SHOULD I DO?
          </h2>

          <p className="text-xs sm:text-sm text-pink-100 leading-relaxed">
            Tell Cue your time, location, social vibe, energy, and intention. Cue scores your personal library and offers 3 intentional choices.
          </p>

          <div className="pt-2">
            <span className="inline-flex items-center gap-2 bg-white text-[#FF2E79] px-5 py-2.5 rounded-2xl font-bold text-xs shadow-xs group-hover:bg-[#FFF0F5] transition-colors">
              <span>Help Me Choose</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>

      {/* 3. Context Intent Buttons (e.g. Good Evening: What kind of night do you want?) */}
      <div className="bg-white rounded-3xl p-6 border border-[#F5E6EC] space-y-3">
        <h3 className="font-display font-bold text-sm text-[#2D262A] uppercase tracking-wider">
          {isNightTime ? 'What kind of night do you want?' : 'What kind of rhythm do you want today?'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {quickIntents.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={`intent-quick-btn-${item.id}`}
                type="button"
                onClick={() => handleIntentClick(item.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border border-[#F5E6EC] bg-[#FFFDFE] transition-all cursor-pointer ${item.color}`}
              >
                <Icon className="w-4 h-4 text-[#6B5E66] mb-1.5" />
                <span className="text-[11px] font-extrabold text-[#2D262A] tracking-wider">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. SECONDARY ACTIONS */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A7983] mb-3">
          Secondary Pathways
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* I Know What I Want -> Explore My Life */}
          <button
            id="home-know-what-i-want-btn"
            type="button"
            onClick={() => onNavigate('explore')}
            className="p-5 rounded-2xl bg-white border border-[#F5E6EC] hover:border-[#FFB8D2] hover:shadow-xs transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#FFE5EF] text-[#FF2E79] flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-[#2D262A] group-hover:text-[#FF2E79] transition-colors">
                I Know What I Want
              </h4>
              <p className="text-xs text-[#6B5E66] mt-1">
                Browse, search, or filter all {activitiesCount} activities directly in your life library.
              </p>
            </div>
            <span className="text-xs font-bold text-[#FF2E79] mt-3 flex items-center gap-1">
              Explore Library →
            </span>
          </button>

          {/* Train My Cue */}
          <button
            id="home-train-cue-btn"
            type="button"
            onClick={() => onNavigate('train')}
            className="p-5 rounded-2xl bg-white border border-[#F5E6EC] hover:border-[#FFB8D2] hover:shadow-xs transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#FFF0F5] text-[#FF5C8A] flex items-center justify-center mb-3">
                <Flame className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-[#2D262A] group-hover:text-[#FF5C8A] transition-colors">
                Train My Cue
              </h4>
              <p className="text-xs text-[#6B5E66] mt-1">
                Interactive swipe game. Teach Cue what you love and what you don't feel like right now.
              </p>
            </div>
            <span className="text-xs font-bold text-[#FF5C8A] mt-3 flex items-center gap-1">
              Start Swiping →
            </span>
          </button>

          {/* My Projects */}
          <button
            id="home-projects-btn"
            type="button"
            onClick={() => onNavigate('projects')}
            className="p-5 rounded-2xl bg-white border border-[#F5E6EC] hover:border-[#D1C4E9] hover:shadow-xs transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#EDE7F6] text-[#7A52B3] flex items-center justify-center mb-3">
                <FolderKanban className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-[#2D262A] group-hover:text-[#7A52B3] transition-colors">
                My Projects
              </h4>
              <p className="text-xs text-[#6B5E66] mt-1">
                Multi-session endeavors that produce artifacts, manuscripts, or tangible skills.
              </p>
            </div>
            <span className="text-xs font-bold text-[#7A52B3] mt-3 flex items-center gap-1">
              View Projects →
            </span>
          </button>

          {/* Reflect */}
          <button
            id="home-reflect-btn"
            type="button"
            onClick={() => onNavigate('reflect')}
            className="p-5 rounded-2xl bg-white border border-[#F5E6EC] hover:border-[#B2DFDB] hover:shadow-xs transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#E0F2F1] text-[#00897B] flex items-center justify-center mb-3">
                <PenTool className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-[#2D262A] group-hover:text-[#00897B] transition-colors">
                Reflect
              </h4>
              <p className="text-xs text-[#6B5E66] mt-1">
                A calm space to journal on what brought ease, delight, or lessons today.
              </p>
            </div>
            <span className="text-xs font-bold text-[#00897B] mt-3 flex items-center gap-1">
              Write Reflection →
            </span>
          </button>

          {/* My Cue */}
          <button
            id="home-my-cue-btn"
            type="button"
            onClick={() => onNavigate('my_cue')}
            className="p-5 rounded-2xl bg-white border border-[#F5E6EC] hover:border-[#FFE082] hover:shadow-xs transition-all text-left flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-9 h-9 rounded-xl bg-[#FFF8E1] text-[#B78103] flex items-center justify-center mb-3">
                <User className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-base text-[#2D262A] group-hover:text-[#B78103] transition-colors">
                My Cue
              </h4>
              <p className="text-xs text-[#6B5E66] mt-1">
                Review what Cue has learned about your genuine interests and rejection patterns.
              </p>
            </div>
            <span className="text-xs font-bold text-[#B78103] mt-3 flex items-center gap-1">
              Personal Compass →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
