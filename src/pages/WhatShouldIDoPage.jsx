import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Clock,
  MapPin,
  Users,
  Zap,
  Target,
  Gem,
  CheckCircle2,
  RotateCcw,
  Compass,
  ArrowRight,
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
  const defaultTime = currentHour >= 18 || currentHour < 6 ? 'night' : 'day';

  // State for all 7 criteria dimensions
  const [timeContext, setTimeContext] = useState(defaultTime); // 'day' | 'night'
  const [locationContext, setLocationContext] = useState('home'); // 'home' | 'outside'
  const [socialContext, setSocialContext] = useState('alone'); // 'alone' | 'family' | 'friends' | 'partner' | 'group'
  const [energyLevel, setEnergyLevel] = useState('moderate'); // 'low' | 'moderate' | 'high'
  const [duration, setDuration] = useState('1h'); // 'quick' | '1h' | '2h' | 'afternoon'
  const [intent, setIntent] = useState(initialIntent || 'create'); // 'create' | 'develop' | 'reflect' | 'connect' | 'entertain' | 'rest' | 'experience' | 'surprise'
  const [leaveSomethingBehind, setLeaveSomethingBehind] = useState('either'); // 'yes' | 'no' | 'either'

  // Calculated recommendations result: { bestMatch, differentDirection, wildcard }
  const [recommendations, setRecommendations] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  // Sync initialIntent if passed
  useEffect(() => {
    if (initialIntent) {
      setIntent(initialIntent);
    }
  }, [initialIntent]);

  // Recalculate recommendations
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

  // Auto-run when criteria change
  useEffect(() => {
    runRecommendation();
  }, [timeContext, locationContext, socialContext, energyLevel, duration, intent, leaveSomethingBehind]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE5EF] text-[#FF2E79] text-xs font-black tracking-wider uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Decision Flow</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2D262A] tracking-tight">
          What Should I Do?
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5E66] mt-1">
          Tell Cue your current context. Cue evaluates your library to offer 3 tailored options.
        </p>
      </div>

      {/* Interactive Criteria Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#FAD2E1] shadow-xs space-y-6">
        {/* 1. Time of Day & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Time of Day */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-2">
              Time of Day
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'day', label: 'Day' },
                { id: 'night', label: 'Night' },
              ].map((t) => (
                <button
                  key={t.id}
                  id={`time-${t.id}`}
                  type="button"
                  onClick={() => setTimeContext(t.id)}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    timeContext === t.id
                      ? 'bg-[#FF2E79] text-white border-[#FF2E79] shadow-xs'
                      : 'bg-[#FFFDFE] text-[#6B5E66] border-[#F5E6EC] hover:bg-[#FFE5EF]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-2">
              Location
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'home', label: 'Home' },
                { id: 'outside', label: 'Outside' },
              ].map((loc) => (
                <button
                  key={loc.id}
                  id={`location-${loc.id}`}
                  type="button"
                  onClick={() => setLocationContext(loc.id)}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    locationContext === loc.id
                      ? 'bg-[#FF2E79] text-white border-[#FF2E79] shadow-xs'
                      : 'bg-[#FFFDFE] text-[#6B5E66] border-[#F5E6EC] hover:bg-[#FFE5EF]'
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Social Setting */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-2">
            Social Setting
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {[
              { id: 'alone', label: 'Alone' },
              { id: 'family', label: 'Family' },
              { id: 'friends', label: 'Friends' },
              { id: 'partner', label: 'Partner' },
              { id: 'group', label: 'Group' },
            ].map((soc) => (
              <button
                key={soc.id}
                id={`social-${soc.id}`}
                type="button"
                onClick={() => setSocialContext(soc.id)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  socialContext === soc.id
                    ? 'bg-[#2D262A] text-white border-[#2D262A] shadow-xs'
                    : 'bg-[#FFFDFE] text-[#6B5E66] border-[#F5E6EC] hover:bg-gray-100'
                }`}
              >
                {soc.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Energy & Time Available */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Energy */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-2">
              Energy Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'low', label: 'Low' },
                { id: 'moderate', label: 'Moderate' },
                { id: 'high', label: 'High' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  id={`energy-${lvl.id}`}
                  type="button"
                  onClick={() => setEnergyLevel(lvl.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    energyLevel === lvl.id
                      ? 'bg-[#FFB703] text-[#4A3200] border-[#FFB703] shadow-xs'
                      : 'bg-[#FFFDFE] text-[#6B5E66] border-[#F5E6EC] hover:bg-[#FFF8E1]'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Available */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-2">
              Time Available
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'quick', label: '15–30m' },
                { id: '1h', label: '30–60m' },
                { id: '2h', label: '1–2 hrs' },
                { id: 'afternoon', label: '2+ hrs' },
              ].map((d) => (
                <button
                  key={d.id}
                  id={`duration-${d.id}`}
                  type="button"
                  onClick={() => setDuration(d.id)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    duration === d.id
                      ? 'bg-[#70C1B3] text-white border-[#70C1B3] shadow-xs'
                      : 'bg-[#FFFDFE] text-[#6B5E66] border-[#F5E6EC] hover:bg-[#E0F2F1]'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Intention */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-2">
            Intention
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'create', label: 'Create' },
              { id: 'develop', label: 'Develop' },
              { id: 'reflect', label: 'Reflect' },
              { id: 'connect', label: 'Connect' },
              { id: 'entertain', label: 'Entertain' },
              { id: 'rest', label: 'Rest' },
              { id: 'experience', label: 'Experience' },
              { id: 'surprise', label: 'Surprise me' },
            ].map((it) => (
              <button
                key={it.id}
                id={`intent-${it.id}`}
                type="button"
                onClick={() => setIntent(it.id)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  intent === it.id
                    ? 'bg-[#FF5C8A] text-white border-[#FF5C8A] shadow-xs'
                    : 'bg-[#FFFDFE] text-[#6B5E66] border-[#F5E6EC] hover:bg-[#FFE5EF]'
                }`}
              >
                {it.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Leave Something Behind (Physical/digital artifact or skill) */}
        <div className="pt-2 border-t border-[#FBF0F4]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block">
                Leave Something Behind?
              </span>
              <span className="text-xs text-[#6B5E66]">
                Prioritize activities that produce finished work, artifacts, or skills.
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
                      ? 'bg-[#00897B] text-white border-[#00897B]'
                      : 'bg-[#FFFDFE] text-[#6B5E66] border-[#F5E6EC] hover:bg-[#E0F2F1]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Results (Three distinct choices) */}
      {hasCalculated && recommendations && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-black text-2xl text-[#2D262A]">
              3 Pathways For Right Now
            </h2>
            <button
              id="recalculate-btn"
              type="button"
              onClick={runRecommendation}
              className="text-xs font-bold text-[#FF2E79] flex items-center gap-1.5 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Shuffle Options</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Best Match */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-black uppercase tracking-wider">
                  ★ Best Match
                </span>
                <span className="text-[11px] text-[#6B5E66] truncate">
                  {recommendations.bestMatch.matchReason}
                </span>
              </div>
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
                <span className="px-3 py-1 rounded-full bg-[#E0F2F1] text-[#00897B] text-xs font-black uppercase tracking-wider">
                  ✦ Different Direction
                </span>
                <span className="text-[11px] text-[#6B5E66] truncate">
                  {recommendations.differentDirection.matchReason}
                </span>
              </div>
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
                <span className="px-3 py-1 rounded-full bg-[#FFF0F5] text-[#FF4D8D] text-xs font-black uppercase tracking-wider">
                  ⚡ Wildcard
                </span>
                <span className="text-[11px] text-[#6B5E66] truncate">
                  {recommendations.wildcard.matchReason}
                </span>
              </div>
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
