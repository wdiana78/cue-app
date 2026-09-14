import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Heart,
  Sparkles,
  CheckCircle2,
  Play,
  Clock,
  RotateCcw,
  Check,
  Lightbulb,
  Youtube,
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { StorageService } from '../services/storage.js';
import { ActivityEnhancer } from '../services/activityEnhancer.js';
import { EnhancementContent } from './MyPlanPage.jsx';
import { getSubcategoryTheme } from '../data/categories.js';

export const ActivityDetailPage = ({
  activity,
  onBack,
  onCommit,
  onNavigateToUpNext,
}) => {
  if (!activity) return null;

  const [currentActivity, setCurrentActivity] = useState(activity);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeEnhance, setActiveEnhance] = useState(null); // 'ideas' | 'start' | 'videos' | 'location'

  const loadCurrent = () => {
    const fresh = StorageService.getActivityById(activity.id);
    if (fresh) setCurrentActivity(fresh);
    const plans = StorageService.getPlans();
    const existing = plans.find((p) => p.activityId === activity.id);
    setSelectedPlan(existing || null);
  };

  useEffect(() => {
    loadCurrent();
    return StorageService.subscribe(loadCurrent);
  }, [activity.id]);

  const isChosen = Boolean(selectedPlan);
  const isInProgress = selectedPlan?.status === 'in_progress';
  const isFavorite = Boolean(currentActivity.favorite || currentActivity.isFavorite);
  const theme = getSubcategoryTheme(currentActivity.subcategory);
  const caps = ActivityEnhancer.getCapabilities(currentActivity);

  const durationText = currentActivity.durationLabel || (currentActivity.durations && currentActivity.durations[0]) || '1–2 hours';
  const locationText = Array.isArray(currentActivity.contexts?.location)
    ? (currentActivity.contexts.location.includes('any') ? 'Flexible location' : currentActivity.contexts.location.join(' / '))
    : (currentActivity.locationContext || 'Home');
  const socialText = Array.isArray(currentActivity.contexts?.social)
    ? (currentActivity.contexts.social.includes('solo') ? 'Solo' : currentActivity.contexts.social.join(', '))
    : (currentActivity.socialContext === 'alone' ? 'Solo' : currentActivity.socialContext || 'Solo');
  const energyText = Array.isArray(currentActivity.energyLevels)
    ? currentActivity.energyLevels.join(', ')
    : (currentActivity.energyLevel || 'Moderate');

  const handleSelectThis = () => {
    onCommit && onCommit(currentActivity);
  };

  const handleStart = () => {
    if (selectedPlan) {
      StorageService.startPlan(selectedPlan.id);
    } else {
      const newPlan = StorageService.addPlan(currentActivity);
      StorageService.startPlan(newPlan.id);
    }
    onNavigateToUpNext && onNavigateToUpNext();
  };

  const handleChange = () => {
    if (selectedPlan) {
      StorageService.removePlan(selectedPlan.id);
    }
  };

  const toggleEnhancement = (type) => {
    setActiveEnhance((prev) => (prev === type ? null : type));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Back button */}
      <button
        id="detail-back-btn"
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#8A7983] hover:text-[#21181D] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to collection</span>
      </button>

      {/* Main Detail Container */}
      <div className="bg-white rounded-3xl border-2 border-[#21181D] p-6 sm:p-10 shadow-sm relative space-y-8">
        {/* Header Badge & Favorite */}
        <div className="flex items-center justify-between gap-3 border-b border-[#F5EDF0] pb-4">
          <span
            style={{ color: theme.accent }}
            className="text-xs font-black uppercase tracking-wider"
          >
            {theme.shortName || currentActivity.subcategory || 'Personal Choice'}
          </span>

          <button
            id="detail-favorite-toggle"
            type="button"
            onClick={() => StorageService.toggleFavorite(currentActivity.id)}
            className="p-2 rounded-full hover:bg-black/5 transition-colors cursor-pointer text-[#8A7983]"
            aria-label="Toggle Favorite"
          >
            <Heart
              className={`w-5 h-5 transition-transform ${
                isFavorite ? 'fill-[#FF2E79] text-[#FF2E79] scale-110' : 'text-[#B8AAB1] hover:text-[#FF2E79]'
              }`}
            />
          </button>
        </div>

        {/* 1. WHAT I CHOSE */}
        <div className="space-y-3">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#8A7983] block">
            What I Chose
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#21181D] tracking-tight leading-tight uppercase">
            {currentActivity.name}
          </h1>

          <p className="text-base text-[#55474F] leading-relaxed">
            {currentActivity.description}
          </p>

          {currentActivity.notes && (
            <p className="text-xs text-[#8A7983] italic border-l-2 border-[#FF2E79] pl-3 py-1 mt-2">
              "{currentActivity.notes}"
            </p>
          )}
        </div>

        {/* 2. WHY IT FITS */}
        <div className="space-y-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#8A7983] block">
            Why It Fits
          </span>
          <div className="p-4 rounded-2xl bg-[#FCF9F6] border border-[#F0E6EC] flex items-center gap-3 text-xs font-semibold text-[#52444C] flex-wrap">
            <span className="capitalize">{locationText}</span>
            <span>·</span>
            <span className="capitalize">{socialText}</span>
            <span>·</span>
            <span>{durationText}</span>
            <span>·</span>
            <span className="capitalize">{energyText} energy</span>
          </div>

          {/* Leaves something behind */}
          {currentActivity.leavesSomethingBehind && (
            <div className="p-3.5 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center gap-2 text-xs font-bold text-[#059669]">
              <Sparkles className="w-4 h-4 text-[#059669]" />
              <span>Leaves something behind: A physical creation or lasting personal artifact</span>
            </div>
          )}
        </div>

        {/* 3. WHAT I CAN DO NEXT */}
        <div className="space-y-4 pt-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#8A7983] block">
            What I Can Do Next
          </span>

          {isChosen ? (
            <div className="p-5 rounded-2xl bg-[#FFE5EF] border border-[#FFB8D2] flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#FF2E79] text-white flex items-center justify-center font-bold">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#FF2E79] block">
                    YOU CHOSE {currentActivity.name.toUpperCase()}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-[#21181D]">
                    Saved to My Plan · {isInProgress ? 'Currently In Progress' : 'Ready to begin'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isInProgress && (
                  <button
                    type="button"
                    onClick={handleStart}
                    className="px-5 py-2.5 bg-[#FF2E79] hover:bg-[#E01A63] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Start Activity</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleChange}
                  className="px-3.5 py-2.5 bg-white text-[#8A7983] hover:text-[#21181D] text-xs font-bold rounded-xl border border-[#F0E6EC] transition-colors cursor-pointer"
                >
                  Change Choice
                </button>
              </div>
            </div>
          ) : (
            <button
              id="detail-choose-this-btn"
              type="button"
              onClick={handleSelectThis}
              className="w-full sm:w-auto px-8 py-4 bg-[#FF2E79] hover:bg-[#E01A63] text-white text-sm font-black rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>I'm Doing This</span>
            </button>
          )}
        </div>

        {/* 4. OPTIONAL: MAKE THE EXPERIENCE BETTER */}
        <div className="space-y-3 pt-4 border-t border-[#F5EDF0]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#8A7983] block">
                Optional Enhancement
              </span>
              <h3 className="font-display font-bold text-sm sm:text-base text-[#21181D]">
                Make The Experience Better
              </h3>
            </div>
            <span className="text-[11px] text-[#A89AA2]">Tap any for tailored suggestions</span>
          </div>

          {/* Enhancement Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => toggleEnhancement('ideas')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                activeEnhance === 'ideas'
                  ? 'bg-[#FFE5EF] text-[#FF2E79] border-[#FFD6E5]'
                  : 'bg-[#FAF7F8] text-[#55474F] border-[#EBE3E7] hover:bg-[#FFE5EF]'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-[#FF2E79]" />
              <span>Give me ideas</span>
            </button>

            <button
              type="button"
              onClick={() => toggleEnhancement('start')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                activeEnhance === 'start'
                  ? 'bg-[#FFE5EF] text-[#FF2E79] border-[#FFD6E5]'
                  : 'bg-[#FAF7F8] text-[#55474F] border-[#EBE3E7] hover:bg-[#FFE5EF]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>Help me get started</span>
            </button>

            {caps.canFindResources && (
              <button
                type="button"
                onClick={() => toggleEnhancement('videos')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  activeEnhance === 'videos'
                    ? 'bg-[#FFE5EF] text-[#FF2E79] border-[#FFD6E5]'
                    : 'bg-[#FAF7F8] text-[#55474F] border-[#EBE3E7] hover:bg-[#FFE5EF]'
                }`}
              >
                <Youtube className="w-3.5 h-3.5 text-[#E11D48]" />
                <span>Find resources & inspiration</span>
              </button>
            )}

            {caps.canFindLocations && (
              <button
                type="button"
                onClick={() => toggleEnhancement('location')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  activeEnhance === 'location'
                    ? 'bg-[#FFE5EF] text-[#FF2E79] border-[#FFD6E5]'
                    : 'bg-[#FAF7F8] text-[#55474F] border-[#EBE3E7] hover:bg-[#FFE5EF]'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-[#059669]" />
                <span>Find somewhere to do this</span>
              </button>
            )}
          </div>

          {/* Active Enhancement Content Container */}
          {activeEnhance && (
            <div className="p-5 rounded-2xl bg-[#FCF9F6] border border-[#F0E6EC] mt-3 animate-in fade-in duration-200">
              <EnhancementContent
                activity={currentActivity}
                enhanceType={activeEnhance}
                onClose={() => setActiveEnhance(null)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
