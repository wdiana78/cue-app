import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  RotateCcw,
  Clock,
  MapPin,
  Users,
  Zap,
  ArrowRight,
  CheckCircle2,
  Eye,
  Check,
} from 'lucide-react';
import { StorageService } from '../services/storage.js';
import { getRecommendations } from '../services/recommendationEngine.js';

export const WhatShouldIDoPage = ({
  initialIntent = null,
  onSelectActivity,
  onCommitActivity,
  onOpenCompletionModal,
}) => {
  // Current hour context default
  const currentHour = new Date().getHours();
  const defaultTime = currentHour >= 18 || currentHour < 5 ? 'night' : 'day';

  // Criteria state
  const [timeContext, setTimeContext] = useState(defaultTime);
  const [locationContext, setLocationContext] = useState('home');
  const [socialContext, setSocialContext] = useState('alone'); // 'alone' (solo), 'friends', 'family'
  const [energyLevel, setEnergyLevel] = useState('moderate');
  const [duration, setDuration] = useState('1h');
  const [intent, setIntent] = useState(initialIntent || 'create');
  const [leaveSomethingBehind, setLeaveSomethingBehind] = useState('either');

  const [recommendations, setRecommendations] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isCueing, setIsCueing] = useState(false);

  const resultsRef = useRef(null);

  useEffect(() => {
    if (initialIntent) {
      setIntent(initialIntent);
      // Auto-run if opened from home intent button
      triggerCueMe();
    }
  }, [initialIntent]);

  const triggerCueMe = () => {
    setIsCueing(true);
    const activities = StorageService.getActivities();
    const swipes = StorageService.getSwipes();
    const logs = StorageService.getLogs();

    const criteria = {
      timeContext,
      locationContext,
      socialContext,
      energyLevel,
      duration,
      intent,
      leaveSomethingBehind,
    };

    const results = getRecommendations(activities, criteria, swipes, logs);
    setRecommendations(results);
    setHasCalculated(true);
    setIsCueing(false);

    // Smooth scroll down to results
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE5EF] text-[#FF2E79] text-xs font-black uppercase tracking-widest mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Decision Flow</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#21181D] tracking-tight">
          What Should I Do?
        </h1>
        <p className="text-sm text-[#665760] mt-1 font-medium">
          Set your current context, then tap <strong className="text-[#21181D]">CUE ME</strong> to receive 3 compatible choices from your life library.
        </p>
      </div>

      {/* Context Selection Cards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#21181D] shadow-xs space-y-6">
        {/* 1. When are you choosing for? */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983]">
              1. When are you choosing for?
            </label>
            <span className="text-[11px] text-[#A89AA2] capitalize">Currently: {timeContext}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'day', label: 'Day' },
              { id: 'night', label: 'Night' },
            ].map((t) => (
              <button
                key={t.id}
                id={`time-btn-${t.id}`}
                type="button"
                onClick={() => setTimeContext(t.id)}
                className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                  timeContext === t.id
                    ? 'bg-[#21181D] text-white border-[#21181D] shadow-xs'
                    : 'bg-[#FAF7F8] text-[#665760] border-[#EBE3E7] hover:bg-[#FFE5EF]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Where are you? */}
        <div className="pt-5 border-t border-[#F5EDF0]">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983]">
              2. Where are you?
            </label>
            <span className="text-[11px] text-[#A89AA2] capitalize">
              {locationContext === 'home' ? 'At Home' : 'Outside'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'home', label: 'At Home' },
              { id: 'outside', label: 'Outside' },
            ].map((loc) => (
              <button
                key={loc.id}
                id={`location-btn-${loc.id}`}
                type="button"
                onClick={() => setLocationContext(loc.id)}
                className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                  locationContext === loc.id
                    ? 'bg-[#21181D] text-white border-[#21181D] shadow-xs'
                    : 'bg-[#FAF7F8] text-[#665760] border-[#EBE3E7] hover:bg-[#FFE5EF]'
                }`}
              >
                {loc.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Who is with you? */}
        <div className="pt-5 border-t border-[#F5EDF0]">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983]">
              3. Who is with you?
            </label>
            <span className="text-[11px] text-[#A89AA2] capitalize">
              {socialContext === 'alone' ? 'Solo' : socialContext === 'friends' ? 'With Friends' : 'With Family'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'alone', label: 'Solo' },
              { id: 'friends', label: 'With People' },
              { id: 'family', label: 'Family' },
            ].map((s) => (
              <button
                key={s.id}
                id={`social-btn-${s.id}`}
                type="button"
                onClick={() => setSocialContext(s.id)}
                className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                  socialContext === s.id
                    ? 'bg-[#21181D] text-white border-[#21181D] shadow-xs'
                    : 'bg-[#FAF7F8] text-[#665760] border-[#EBE3E7] hover:bg-[#FFE5EF]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. What is your energy? */}
        <div className="pt-5 border-t border-[#F5EDF0]">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983]">
              4. What is your energy?
            </label>
            <span className="text-[11px] text-[#A89AA2] capitalize">{energyLevel}</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'low', label: 'Low' },
              { id: 'moderate', label: 'Moderate' },
              { id: 'high', label: 'High' },
            ].map((e) => (
              <button
                key={e.id}
                id={`energy-btn-${e.id}`}
                type="button"
                onClick={() => setEnergyLevel(e.id)}
                className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                  energyLevel === e.id
                    ? 'bg-[#21181D] text-white border-[#21181D] shadow-xs'
                    : 'bg-[#FAF7F8] text-[#665760] border-[#EBE3E7] hover:bg-[#FFE5EF]'
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5. How much time? */}
        <div className="pt-5 border-t border-[#F5EDF0]">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983]">
              5. How much time?
            </label>
            <span className="text-[11px] text-[#A89AA2]">
              {duration === 'quick' ? '< 45 mins' : duration === '1h' ? '1–2 hours' : duration === '2h' ? '2 hours' : 'Half day'}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'quick', label: 'Under 45 mins' },
              { id: '1h', label: '1–2 hours' },
              { id: '2h', label: '2 hours' },
              { id: 'afternoon', label: 'Half day' },
            ].map((d) => (
              <button
                key={d.id}
                id={`duration-btn-${d.id}`}
                type="button"
                onClick={() => setDuration(d.id)}
                className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                  duration === d.id
                    ? 'bg-[#21181D] text-white border-[#21181D] shadow-xs'
                    : 'bg-[#FAF7F8] text-[#665760] border-[#EBE3E7] hover:bg-[#FFE5EF]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* 6. What kind of moment? */}
        <div className="pt-5 border-t border-[#F5EDF0]">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983]">
              6. What kind of moment?
            </label>
            <span className="text-[11px] text-[#A89AA2] uppercase font-bold">{intent}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {[
              { id: 'create', label: 'Create', color: '#FF2E79' },
              { id: 'rest', label: 'Rest', color: '#F59E0B' },
              { id: 'connect', label: 'Connect', color: '#EC4899' },
              { id: 'entertain', label: 'Adventure', color: '#0EA5E9' },
              { id: 'reflect', label: 'Reflect', color: '#8B5CF6' },
              { id: 'surprise', label: 'Surprise me', color: '#10B981' },
            ].map((it) => (
              <button
                key={it.id}
                id={`intent-${it.id}`}
                type="button"
                onClick={() => setIntent(it.id)}
                className={`py-3 px-2 text-center rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                  intent === it.id
                    ? 'bg-[#21181D] text-white border-[#21181D] shadow-xs'
                    : 'bg-[#FAF7F8] text-[#665760] border-[#EBE3E7] hover:bg-[#FFE5EF]'
                }`}
              >
                {it.label}
              </button>
            ))}
          </div>
        </div>

        {/* 7. Leave Something Behind */}
        <div className="pt-5 border-t border-[#F5EDF0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block">
              7. Leave something behind?
            </span>
            <span className="text-xs text-[#665760]">
              Prioritize crafts, writing, or lasting physical creations.
            </span>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'yes', label: 'Yes' },
              { id: 'no', label: 'No' },
              { id: 'either', label: 'Either' },
            ].map((opt) => (
              <button
                key={opt.id}
                id={`leave-behind-${opt.id}`}
                type="button"
                onClick={() => setLeaveSomethingBehind(opt.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  leaveSomethingBehind === opt.id
                    ? 'bg-[#10B981] text-white border-[#10B981]'
                    : 'bg-[#FAF7F8] text-[#665760] border-[#EBE3E7] hover:bg-[#ECFDF5]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* PROMINENT ACTION BUTTON: [ CUE ME ] */}
        <div className="pt-6 border-t-2 border-[#21181D]">
          <button
            id="cue-me-action-btn"
            type="button"
            onClick={triggerCueMe}
            disabled={isCueing}
            className="w-full py-4 sm:py-5 px-6 bg-[#FF2E79] hover:bg-[#E01A63] active:scale-[0.99] text-white text-base sm:text-lg font-black uppercase tracking-wider rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Sparkles className="w-5 h-5 fill-white group-hover:rotate-12 transition-transform" />
            <span>CUE ME</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-center text-xs text-[#8A7983] mt-2">
            Applies strict constraints to guarantee only compatible activities are shown.
          </p>
        </div>
      </div>

      {/* 3 Distinct Recommendations Section */}
      <div ref={resultsRef}>
        {hasCalculated && recommendations && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-[#FF2E79] block">
                  CUE'S RECOMMENDATIONS
                </span>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-[#21181D] tracking-tight">
                  3 Compatible Choices
                </h2>
                <p className="text-xs sm:text-sm text-[#665760] mt-0.5">
                  Filtered by your hard constraints and scored by your trained affinities.
                </p>
              </div>

              <button
                id="re-cue-btn"
                type="button"
                onClick={triggerCueMe}
                className="px-3.5 py-2 bg-white text-xs font-bold text-[#FF2E79] border border-[#FFD6E5] hover:bg-[#FFE5EF] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-Cue</span>
              </button>
            </div>

            {/* 3 Columns: Best Match, Different Direction, Wildcard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* 1. Best Match */}
              <RecommendationChoiceCard
                badgeText="★ Best Match"
                badgeClass="bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]"
                choice={recommendations.bestMatch}
                onSelectActivity={onSelectActivity}
                onCommitActivity={onCommitActivity}
              />

              {/* 2. Different Direction */}
              <RecommendationChoiceCard
                badgeText="✦ Different Direction"
                badgeClass="bg-[#F0F9FF] text-[#0284C7] border-[#BAE6FD]"
                choice={recommendations.differentDirection}
                onSelectActivity={onSelectActivity}
                onCommitActivity={onCommitActivity}
              />

              {/* 3. Wildcard */}
              <RecommendationChoiceCard
                badgeText="⚡ Wildcard"
                badgeClass="bg-[#FFF1F2] text-[#E11D48] border-[#FECDD3]"
                choice={recommendations.wildcard}
                onSelectActivity={onSelectActivity}
                onCommitActivity={onCommitActivity}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Card for each of the 3 recommended choices
 */
const RecommendationChoiceCard = ({
  badgeText,
  badgeClass,
  choice,
  onSelectActivity,
  onCommitActivity,
}) => {
  if (!choice) return null;

  const durationText = choice.durationLabel || (choice.durations && choice.durations[0]) || '1–2 hours';
  const energyText = Array.isArray(choice.energyLevels)
    ? choice.energyLevels.join(', ')
    : (choice.energyLevel || 'Moderate');

  return (
    <div className="bg-white rounded-3xl border-2 border-[#21181D] p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow space-y-4">
      <div className="space-y-3">
        {/* Badge */}
        <div className="flex items-center justify-between">
          <span className={`px-2.5 py-1 rounded-full border text-[11px] font-black uppercase tracking-wider ${badgeClass}`}>
            {badgeText}
          </span>
          <span className="text-[11px] font-bold text-[#8A7983] uppercase tracking-wider">
            {choice.subcategory || 'Life'}
          </span>
        </div>

        {/* Activity Name */}
        <h3 className="font-display font-black text-xl sm:text-2xl text-[#21181D] tracking-tight leading-snug">
          {choice.name}
        </h3>

        {/* Why it fits */}
        <div className="p-3 rounded-xl bg-[#FAF7F8] border border-[#F0E6EC] text-xs text-[#55474F] font-medium leading-relaxed italic">
          "{choice.matchReason || 'Matches your current context and library preferences perfectly.'}"
        </div>

        {/* Duration & Energy */}
        <div className="flex items-center gap-3 text-xs text-[#665760] font-semibold pt-1">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#8A7983]" />
            <span>{durationText}</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-[#8A7983]" />
            <span className="capitalize">{energyText} energy</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: [Choose this] and [View details] */}
      <div className="pt-3 border-t border-[#F5EDF0] flex flex-col gap-2">
        <button
          id={`choose-rec-${choice.id}`}
          type="button"
          onClick={() => onCommitActivity(choice)}
          className="w-full py-3 px-4 bg-[#FF2E79] hover:bg-[#E01A63] text-white text-xs sm:text-sm font-black rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>Choose This</span>
        </button>

        <button
          id={`details-rec-${choice.id}`}
          type="button"
          onClick={() => onSelectActivity(choice)}
          className="w-full py-2 px-3 bg-transparent hover:bg-[#FAF7F8] text-[#8A7983] hover:text-[#21181D] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
};
