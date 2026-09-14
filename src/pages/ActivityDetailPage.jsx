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
} from 'lucide-react';
import { StorageService } from '../services/storage.js';
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

  const loadCurrent = () => {
    const fresh = StorageService.getActivityById(activity.id);
    if (fresh) setCurrentActivity(fresh);
    setSelectedPlan(StorageService.getSelectedPlan());
  };

  useEffect(() => {
    loadCurrent();
    return StorageService.subscribe(loadCurrent);
  }, [activity.id]);

  const isChosen = selectedPlan?.activityId === currentActivity.id;
  const isFavorite = Boolean(currentActivity.favorite || currentActivity.isFavorite);
  const theme = getSubcategoryTheme(currentActivity.subcategory);

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
    StorageService.startPlan();
    onNavigateToUpNext && onNavigateToUpNext();
  };

  const handleChange = () => {
    StorageService.clearSelectedPlan();
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
        {/* Header Badge */}
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

        {/* Selected State Banner if user chose this */}
        {isChosen && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FFE5EF] border border-[#FFB8D2] flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FF2E79] text-white flex items-center justify-center font-bold">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#FF2E79] block">
                  YOU CHOSE THIS
                </span>
                <p className="text-xs sm:text-sm font-bold text-[#21181D]">
                  {selectedPlan.targetTime || 'Tonight'}'s plan · Saved to Up Next
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleStart}
                className="px-4 py-2 bg-[#FF2E79] hover:bg-[#E01A63] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start</span>
              </button>
              <button
                type="button"
                onClick={handleChange}
                className="px-3 py-2 bg-white text-[#8A7983] hover:text-[#21181D] text-xs font-bold rounded-xl border border-[#F0E6EC] transition-colors cursor-pointer"
              >
                Change
              </button>
            </div>
          </div>
        )}

        {/* Activity Name & Description */}
        <div className="space-y-3">
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

        {/* Clean Context Line: Home · Solo · 1–2 hours · Moderate energy */}
        <div className="p-4 rounded-2xl bg-[#FCF9F6] border border-[#F0E6EC] flex items-center gap-3 text-xs font-semibold text-[#52444C] flex-wrap">
          <span className="capitalize">{locationText}</span>
          <span>·</span>
          <span className="capitalize">{socialText}</span>
          <span>·</span>
          <span>{durationText}</span>
          <span>·</span>
          <span className="capitalize">{energyText} energy</span>
        </div>

        {/* Leaves something behind attribute */}
        {currentActivity.leavesSomethingBehind && (
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#8A7983] uppercase tracking-wider block">
              Leaves something behind
            </span>
            <p className="text-xs sm:text-sm font-semibold text-[#137333]">
              Physical creation or lasting personal artifact
            </p>
          </div>
        )}

        {/* Main Action Bar */}
        <div className="pt-6 border-t border-[#F5EDF0] flex items-center justify-between gap-4">
          {isChosen ? (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleStart}
                className="flex-1 sm:flex-none px-6 py-3.5 bg-[#21181D] hover:bg-[#FF2E79] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Activity</span>
              </button>
              <button
                type="button"
                onClick={handleChange}
                className="px-4 py-3.5 bg-[#F5EDF0] hover:bg-[#EBE3E7] text-[#21181D] text-xs font-bold rounded-2xl transition-colors cursor-pointer"
              >
                Change Choice
              </button>
            </div>
          ) : (
            <button
              id="detail-choose-this-btn"
              type="button"
              onClick={handleSelectThis}
              className="w-full sm:w-auto px-8 py-4 bg-[#FF2E79] hover:bg-[#E01A63] text-white text-sm font-black rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>I'm Doing This</span>
            </button>
          )}

          <button
            type="button"
            onClick={onBack}
            className="text-xs font-bold text-[#8A7983] hover:text-[#21181D] cursor-pointer"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};
