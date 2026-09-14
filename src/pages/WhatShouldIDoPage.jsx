import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RotateCcw,
  Clock,
  MapPin,
  Users,
  Zap,
} from 'lucide-react';
import { StorageService } from '../services/storage.js';
import { getRecommendations } from '../services/recommendationEngine.js';
import { ActivityCard } from '../components/ActivityCard.jsx';

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
  const [socialContext, setSocialContext] = useState('alone');
  const [energyLevel, setEnergyLevel] = useState('moderate');
  const [duration, setDuration] = useState('1h');
  const [intent, setIntent] = useState(initialIntent || 'create');
  const [leaveSomethingBehind, setLeaveSomethingBehind] = useState('either');

  const [recommendations, setRecommendations] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  useEffect(() => {
    if (initialIntent) {
      setIntent(initialIntent);
    }
  }, [initialIntent]);

  const runRecommendation = () => {
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
  };

  useEffect(() => {
    runRecommendation();
  }, [timeContext, locationContext, socialContext, energyLevel, duration, intent, leaveSomethingBehind]);

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
        <p className="text-sm text-[#665760] mt-1">
          Given your current situation, Cue evaluates your personal life library to recommend 3 appropriate options.
        </p>
      </div>

      {/* Interactive Criteria Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE3E7] shadow-xs space-y-6">
        {/* 1. Time & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-2">
              Time of Day
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'day', label: 'Daytime' },
                { id: 'night', label: 'Nighttime' },
              ].map((t) => (
                <button
                  key={t.id}
                  id={`time-btn-${t.id}`}
                  type="button"
                  onClick={() => setTimeContext(t.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    timeContext === t.id
                      ? 'bg-[#21181D] text-white border-[#21181D]'
                      : 'bg-[#FAF7F8] text-[#665760] border-[#EBE3E7] hover:bg-[#FFE5EF]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-2">
              Location
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'home', label: 'At Home' },
                { id: 'outside', label: 'Outside / Out' },
              ].map((loc) => (
                <button
                  key={loc.id}
                  id={`location-btn-${loc.id}`}
                  type="button"
                  onClick={() => setLocationContext(loc.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    locationContext === loc.id
                      ? 'bg-[#21181D] text-white border-[#21181D]'
                      : 'bg-[#FAF7F8] text-[#665760] border-[#EBE3E7] hover:bg-[#FFE5EF]'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Social Setting & Energy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-[#F5EDF0]">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-2">
              Social Setting
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'alone', label: 'Solo' },
                { id: 'friends', label: 'Friends' },
                { id: 'family', label: 'Family' },
              ].map((s) => (
                <button
                  key={s.id}
                  id={`social-btn-${s.id}`}
                  type="button"
                  onClick={() => setSocialContext(s.id)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    socialContext === s.id
                      ? 'bg-[#21181D] text-white border-[#21181D]'
                      : 'bg-[#FAF7F8] text-[#665760] border-[#EBE3E7] hover:bg-[#FFE5EF]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-2">
              Current Energy
            </label>
            <div className="grid grid-cols-3 gap-2">
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
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    energyLevel === e.id
                      ? 'bg-[#21181D] text-white border-[#21181D]'
                      : 'bg-[#FAF7F8] text-[#665760] border-[#EBE3E7] hover:bg-[#FFE5EF]'
                  }`}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Duration */}
        <div className="pt-4 border-t border-[#F5EDF0]">
          <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-2">
            Available Time Window
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'quick', label: '< 45 mins (Quick)' },
              { id: '1h', label: '1 hour' },
              { id: '2h', label: '2 hours' },
              { id: 'afternoon', label: 'Half Day / Open' },
            ].map((d) => (
              <button
                key={d.id}
                id={`duration-btn-${d.id}`}
                type="button"
                onClick={() => setDuration(d.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  duration === d.id
                    ? 'bg-[#21181D] text-white border-[#21181D]'
                    : 'bg-[#FAF7F8] text-[#665760] border-[#EBE3E7] hover:bg-[#FFE5EF]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Intention (The 7 primary intentions) */}
        <div className="pt-4 border-t border-[#F5EDF0]">
          <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-2">
            What kind of experience do you want?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {[
              { id: 'create', label: 'CREATE' },
              { id: 'develop', label: 'DEVELOP' },
              { id: 'reflect', label: 'REFLECT' },
              { id: 'connect', label: 'CONNECT' },
              { id: 'entertain', label: 'ENTERTAIN' },
              { id: 'rest', label: 'REST' },
              { id: 'surprise', label: 'SURPRISE ME' },
            ].map((it) => (
              <button
                key={it.id}
                id={`intent-${it.id}`}
                type="button"
                onClick={() => setIntent(it.id)}
                className={`py-2.5 px-2 text-center rounded-xl text-[11px] font-black tracking-wider border transition-all cursor-pointer ${
                  intent === it.id
                    ? 'bg-[#FF2E79] text-white border-[#FF2E79] shadow-xs'
                    : 'bg-[#FAF7F8] text-[#665760] border-[#EBE3E7] hover:bg-[#FFE5EF]'
                }`}
              >
                {it.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Leaves Something Behind */}
        <div className="pt-4 border-t border-[#F5EDF0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block">
              Leave Something Behind?
            </span>
            <span className="text-xs text-[#665760]">
              Prioritize tangible crafts, written pieces, or artifacts that remain.
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  leaveSomethingBehind === opt.id
                    ? 'bg-[#059669] text-white border-[#059669]'
                    : 'bg-[#FAF7F8] text-[#665760] border-[#EBE3E7] hover:bg-[#ECFDF5]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3 Distinct Recommendations */}
      {hasCalculated && recommendations && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-black text-2xl text-[#21181D]">
                3 Pathways For Right Now
              </h2>
              <p className="text-xs text-[#8A7983] mt-0.5">
                Evaluated against your library, context, and multi-level preferences.
              </p>
            </div>
            <button
              id="recalculate-btn"
              type="button"
              onClick={runRecommendation}
              className="text-xs font-bold text-[#FF2E79] flex items-center gap-1.5 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Shuffle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Best Match */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] text-[11px] font-black uppercase tracking-wider">
                  ★ Best Match
                </span>
              </div>
              <p className="text-[11px] text-[#665760] font-medium italic min-h-[2.5rem]">
                "{recommendations.bestMatch.matchReason}"
              </p>
              <ActivityCard
                activity={recommendations.bestMatch}
                onSelect={onSelectActivity}
                onCommit={onCommitActivity}
                onToggleFavorite={() => StorageService.toggleFavorite(recommendations.bestMatch.id)}
              />
            </div>

            {/* 2. Different Direction */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-[#F0F9FF] text-[#0284C7] border border-[#BAE6FD] text-[11px] font-black uppercase tracking-wider">
                  ✦ Different Direction
                </span>
              </div>
              <p className="text-[11px] text-[#665760] font-medium italic min-h-[2.5rem]">
                "{recommendations.differentDirection.matchReason}"
              </p>
              <ActivityCard
                activity={recommendations.differentDirection}
                onSelect={onSelectActivity}
                onCommit={onCommitActivity}
                onToggleFavorite={() =>
                  StorageService.toggleFavorite(recommendations.differentDirection.id)
                }
              />
            </div>

            {/* 3. Wildcard */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3] text-[11px] font-black uppercase tracking-wider">
                  ⚡ Wildcard
                </span>
              </div>
              <p className="text-[11px] text-[#665760] font-medium italic min-h-[2.5rem]">
                "{recommendations.wildcard.matchReason}"
              </p>
              <ActivityCard
                activity={recommendations.wildcard}
                onSelect={onSelectActivity}
                onCommit={onCommitActivity}
                onToggleFavorite={() => StorageService.toggleFavorite(recommendations.wildcard.id)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
