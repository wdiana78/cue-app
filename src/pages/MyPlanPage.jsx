import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
  RotateCcw,
  Compass,
  Check,
  Calendar,
  Trash2,
  ExternalLink,
  Lightbulb,
  MapPin,
  Youtube,
  ChevronDown,
  ChevronUp,
  Heart,
  Eye,
} from 'lucide-react';
import { StorageService } from '../services/storage.js';
import { ActivityEnhancer } from '../services/activityEnhancer.js';
import { getSubcategoryTheme } from '../data/categories.js';

export const MyPlanPage = ({
  onNavigate,
  onSelectActivity,
  onOpenCompletionModal,
}) => {
  const [plans, setPlans] = useState([]);
  const [activeTabSection, setActiveTabSection] = useState('all'); // 'all', 'in_progress', 'pending', 'completed'
  const [expandedEnhanceId, setExpandedEnhanceId] = useState(null);
  const [activeEnhanceType, setActiveEnhanceType] = useState('ideas'); // 'ideas', 'start', 'videos', 'location'

  const loadPlans = () => {
    setPlans(StorageService.getPlans());
  };

  useEffect(() => {
    loadPlans();
    return StorageService.subscribe(loadPlans);
  }, []);

  const inProgressPlans = plans.filter((p) => p.status === 'in_progress');
  const pendingPlans = plans.filter((p) => p.status === 'pending');
  const completedPlans = plans.filter((p) => p.status === 'completed');

  const handleStart = (planId) => {
    StorageService.startPlan(planId);
  };

  const handleRemove = (planId) => {
    StorageService.removePlan(planId);
  };

  const handleComplete = (plan) => {
    onOpenCompletionModal && onOpenCompletionModal(plan.activity?.name || 'Activity');
  };

  const toggleEnhance = (planId, type = 'ideas') => {
    if (expandedEnhanceId === planId && activeEnhanceType === type) {
      setExpandedEnhanceId(null);
    } else {
      setExpandedEnhanceId(planId);
      setActiveEnhanceType(type);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#F0E6EC] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE5EF] text-[#FF2E79] text-xs font-black uppercase tracking-widest mb-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Selected Activities</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#21181D] tracking-tight">
            MY PLAN
          </h1>
          <p className="text-sm text-[#665760] mt-1 font-medium">
            Your chosen activities organized by state: in progress, pending, and completed.
          </p>
        </div>

        <button
          id="plan-cue-more-btn"
          type="button"
          onClick={() => onNavigate('recommend')}
          className="px-4 py-2.5 bg-[#21181D] hover:bg-[#FF2E79] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 fill-white" />
          <span>Cue An Activity</span>
        </button>
      </div>

      {/* Empty State */}
      {plans.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-[#21181D] p-8 sm:p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFE5EF] text-[#FF2E79] flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-display font-black text-xl text-[#21181D]">
              No activities planned yet
            </h3>
            <p className="text-xs sm:text-sm text-[#665760] leading-relaxed">
              When you use <strong>What Should I Do?</strong> or browse your <strong>Life Library</strong>, choose an activity to add it to your plan here.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('recommend')}
            className="px-6 py-3 bg-[#FF2E79] hover:bg-[#E01A63] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <span>What Should I Do?</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* 1. IN PROGRESS SECTION */}
          {inProgressPlans.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7] animate-pulse"></span>
                  <h2 className="font-display font-black text-lg sm:text-xl text-[#21181D] uppercase tracking-wide">
                    In Progress ({inProgressPlans.length})
                  </h2>
                </div>
                <span className="text-xs text-[#8A7983] font-semibold">Active right now</span>
              </div>

              <div className="space-y-4">
                {inProgressPlans.map((plan) => (
                  <PlanItemCard
                    key={plan.id}
                    plan={plan}
                    onStart={handleStart}
                    onComplete={handleComplete}
                    onRemove={handleRemove}
                    onSelectActivity={onSelectActivity}
                    isExpanded={expandedEnhanceId === plan.id}
                    activeEnhanceType={activeEnhanceType}
                    onToggleEnhance={toggleEnhance}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 2. PENDING SECTION */}
          {pendingPlans.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF2E79]"></span>
                  <h2 className="font-display font-black text-lg sm:text-xl text-[#21181D] uppercase tracking-wide">
                    Pending ({pendingPlans.length})
                  </h2>
                </div>
                <span className="text-xs text-[#8A7983] font-semibold">Chosen, not started yet</span>
              </div>

              <div className="space-y-4">
                {pendingPlans.map((plan) => (
                  <PlanItemCard
                    key={plan.id}
                    plan={plan}
                    onStart={handleStart}
                    onComplete={handleComplete}
                    onRemove={handleRemove}
                    onSelectActivity={onSelectActivity}
                    isExpanded={expandedEnhanceId === plan.id}
                    activeEnhanceType={activeEnhanceType}
                    onToggleEnhance={toggleEnhance}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 3. COMPLETED SECTION */}
          {completedPlans.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-[#F0E6EC]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  <h2 className="font-display font-black text-lg sm:text-xl text-[#21181D] uppercase tracking-wide">
                    Completed ({completedPlans.length})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Clear completed activities from My Plan view? (They remain in your activity logs)')) {
                      StorageService.clearCompletedPlans();
                    }
                  }}
                  className="text-xs font-bold text-[#8A7983] hover:text-[#E11D48] cursor-pointer"
                >
                  Clear Finished
                </button>
              </div>

              <div className="space-y-3">
                {completedPlans.map((plan) => (
                  <CompletedPlanCard
                    key={plan.id}
                    plan={plan}
                    onRemove={handleRemove}
                    onSelectActivity={onSelectActivity}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Plan Item Card for Pending & In Progress states
 */
const PlanItemCard = ({
  plan,
  onStart,
  onComplete,
  onRemove,
  onSelectActivity,
  isExpanded,
  activeEnhanceType,
  onToggleEnhance,
}) => {
  const activity = plan.activity;
  if (!activity) return null;

  const isInProgress = plan.status === 'in_progress';
  const theme = getSubcategoryTheme(activity.subcategory);
  const caps = ActivityEnhancer.getCapabilities(activity);

  // Time elapsed if in progress
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  useEffect(() => {
    if (isInProgress && plan.startedAt) {
      const calc = () => {
        const start = new Date(plan.startedAt).getTime();
        const mins = Math.max(0, Math.floor((Date.now() - start) / 60000));
        setElapsedMinutes(mins);
      };
      calc();
      const timer = setInterval(calc, 30000);
      return () => clearInterval(timer);
    }
  }, [isInProgress, plan.startedAt]);

  const durationText = activity.durationLabel || (activity.durations && activity.durations[0]) || '1 hour';
  const locationText = Array.isArray(activity.contexts?.location)
    ? (activity.contexts.location.includes('any') ? 'Flexible' : activity.contexts.location.join(' / '))
    : (activity.locationContext || 'Home');

  return (
    <div className={`bg-white rounded-3xl border-2 ${isInProgress ? 'border-[#0284C7] shadow-md' : 'border-[#21181D] shadow-xs'} p-6 sm:p-7 space-y-5 transition-all`}>
      {/* Top Meta Line */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
            isInProgress ? 'bg-[#E0F2FE] text-[#0284C7]' : 'bg-[#21181D] text-white'
          }`}>
            {plan.targetTime || 'Tonight'}
          </span>
          <span
            style={{ color: theme.accent }}
            className="text-xs font-bold uppercase tracking-wider"
          >
            {theme.shortName || activity.subcategory || 'Life'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isInProgress ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0F2FE] text-[#0284C7] text-xs font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>In Progress ({elapsedMinutes}m)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE5EF] text-[#FF2E79] text-xs font-bold">
              <span>Pending</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => onRemove(plan.id)}
            className="p-1.5 rounded-lg text-[#8A7983] hover:text-[#E11D48] hover:bg-black/5 transition-colors cursor-pointer"
            title="Remove from plan"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Activity Details */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <h3
            onClick={() => onSelectActivity && onSelectActivity(activity)}
            className="font-display font-black text-2xl sm:text-3xl text-[#21181D] tracking-tight leading-snug hover:text-[#FF2E79] transition-colors cursor-pointer"
          >
            {activity.name}
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-[#55474F] leading-relaxed">
          {activity.description}
        </p>

        <div className="flex items-center gap-3 text-xs text-[#665760] font-semibold pt-1">
          <span>{locationText}</span>
          <span>·</span>
          <span>{durationText}</span>
          {activity.leavesSomethingBehind && (
            <>
              <span>·</span>
              <span className="text-[#059669] font-bold">Leaves an artifact</span>
            </>
          )}
        </div>
      </div>

      {/* Action Controls: [Start Activity] / [Complete] / [Reflect] */}
      <div className="pt-3 border-t border-[#F5EDF0] flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {isInProgress ? (
            <button
              id={`complete-plan-${plan.id}`}
              type="button"
              onClick={() => onComplete(plan)}
              className="px-5 py-2.5 bg-[#059669] hover:bg-[#047857] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete & Reflect</span>
            </button>
          ) : (
            <button
              id={`start-plan-${plan.id}`}
              type="button"
              onClick={() => onStart(plan.id)}
              className="px-5 py-2.5 bg-[#FF2E79] hover:bg-[#E01A63] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Activity</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onSelectActivity && onSelectActivity(activity)}
            className="px-3 py-2 bg-transparent hover:bg-[#FAF7F8] text-[#8A7983] hover:text-[#21181D] text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            View Details
          </button>
        </div>

        {/* Optional Enhancement Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => onToggleEnhance(plan.id, 'ideas')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer border ${
              isExpanded && activeEnhanceType === 'ideas'
                ? 'bg-[#FFE5EF] text-[#FF2E79] border-[#FFD6E5]'
                : 'bg-[#FAF7F8] text-[#665760] border-[#EBE3E7] hover:bg-[#FFE5EF]'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-[#FF2E79]" />
            <span>Ideas</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleEnhance(plan.id, 'start')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer border ${
              isExpanded && activeEnhanceType === 'start'
                ? 'bg-[#FFE5EF] text-[#FF2E79] border-[#FFD6E5]'
                : 'bg-[#FAF7F8] text-[#665760] border-[#EBE3E7] hover:bg-[#FFE5EF]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>Get Started</span>
          </button>

          {caps.canFindResources && (
            <button
              type="button"
              onClick={() => onToggleEnhance(plan.id, 'videos')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer border ${
                isExpanded && activeEnhanceType === 'videos'
                  ? 'bg-[#FFE5EF] text-[#FF2E79] border-[#FFD6E5]'
                  : 'bg-[#FAF7F8] text-[#665760] border-[#EBE3E7] hover:bg-[#FFE5EF]'
              }`}
            >
              <Youtube className="w-3.5 h-3.5 text-[#E11D48]" />
              <span>Inspiration</span>
            </button>
          )}

          {caps.canFindLocations && (
            <button
              type="button"
              onClick={() => onToggleEnhance(plan.id, 'location')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer border ${
                isExpanded && activeEnhanceType === 'location'
                  ? 'bg-[#FFE5EF] text-[#FF2E79] border-[#FFD6E5]'
                  : 'bg-[#FAF7F8] text-[#665760] border-[#EBE3E7] hover:bg-[#FFE5EF]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#059669]" />
              <span>Where To Go</span>
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Enhancement Panel */}
      {isExpanded && (
        <div className="p-5 rounded-2xl bg-[#FCF9F6] border border-[#F0E6EC] mt-3 space-y-4">
          <EnhancementContent
            activity={activity}
            enhanceType={activeEnhanceType}
            onClose={() => onToggleEnhance(plan.id, activeEnhanceType)}
          />
        </div>
      )}
    </div>
  );
};

/**
 * Completed Plan Card
 */
const CompletedPlanCard = ({ plan, onRemove, onSelectActivity }) => {
  const activity = plan.activity;
  if (!activity) return null;

  const completedDate = plan.completedAt ? new Date(plan.completedAt).toLocaleDateString() : 'Recently';

  return (
    <div className="bg-white rounded-2xl border border-[#EBE3E7] p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0">
          <Check className="w-4 h-4" />
        </div>
        <div>
          <h4
            onClick={() => onSelectActivity && onSelectActivity(activity)}
            className="font-display font-bold text-sm sm:text-base text-[#21181D] hover:text-[#FF2E79] cursor-pointer"
          >
            {activity.name}
          </h4>
          <p className="text-[11px] text-[#8A7983]">
            Completed {completedDate} {plan.feedback && `· Felt: ${plan.feedback}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onSelectActivity && onSelectActivity(activity)}
          className="text-xs font-bold text-[#8A7983] hover:text-[#21181D] px-2 py-1 cursor-pointer"
        >
          View
        </button>
        <button
          type="button"
          onClick={() => onRemove(plan.id)}
          className="p-1 rounded text-[#B8AAB1] hover:text-[#E11D48] cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

/**
 * Shared Enhancement Content Panel
 */
export const EnhancementContent = ({ activity, enhanceType, onClose }) => {
  if (enhanceType === 'ideas') {
    const ideas = ActivityEnhancer.getIdeas(activity);
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-[#FF2E79]">
            {ideas.title}
          </span>
          {onClose && (
            <button type="button" onClick={onClose} className="text-xs text-[#8A7983] hover:text-[#21181D] cursor-pointer">
              Close
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ideas.prompts.map((p, idx) => (
            <div key={idx} className="p-3 bg-white rounded-xl border border-[#EBE3E7] space-y-1">
              <h5 className="font-display font-bold text-xs text-[#21181D]">
                {p.title}
              </h5>
              <p className="text-[11px] text-[#665760] leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-[#8A7983] italic">
          Tip: {ideas.tips}
        </p>
      </div>
    );
  }

  if (enhanceType === 'start') {
    const guide = ActivityEnhancer.getStarterGuide(activity);
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-[#0284C7]">
            Getting Started: Zero Friction
          </span>
          {onClose && (
            <button type="button" onClick={onClose} className="text-xs text-[#8A7983] hover:text-[#21181D] cursor-pointer">
              Close
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded-xl border border-[#EBE3E7] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7983] block">
              Materials / Setup Checklist
            </span>
            <ul className="text-xs text-[#55474F] space-y-1">
              {guide.materials.map((m, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]"></span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-white rounded-xl border border-[#EBE3E7] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7983] block">
              First 10 Minutes
            </span>
            <ol className="text-xs text-[#55474F] space-y-1 list-decimal list-inside">
              {guide.steps.map((s, idx) => (
                <li key={idx} className="leading-snug">
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    );
  }

  if (enhanceType === 'videos') {
    const videos = ActivityEnhancer.getVideoResources(activity);
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-[#E11D48]">
            Curated Inspiration & Tutorials
          </span>
          {onClose && (
            <button type="button" onClick={onClose} className="text-xs text-[#8A7983] hover:text-[#21181D] cursor-pointer">
              Close
            </button>
          )}
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#EBE3E7] space-y-3">
          <p className="text-xs text-[#55474F] leading-relaxed">
            Search YouTube directly with high-quality queries curated for {activity.name}:
          </p>

          <div className="flex flex-wrap gap-2">
            {videos.suggestedQueries.map((q, idx) => {
              const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
              return (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF1F2] border border-[#FECDD3] text-xs font-bold text-[#E11D48] hover:bg-[#FFE4E6] transition-colors"
                >
                  <Youtube className="w-3.5 h-3.5" />
                  <span>{q}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              );
            })}
          </div>

          <p className="text-[10px] text-[#A89AA2]">
            {videos.notice}
          </p>
        </div>
      </div>
    );
  }

  if (enhanceType === 'location') {
    const loc = ActivityEnhancer.getLocationFinder(activity);
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-[#059669]">
            Real-World Venue & Location Finder
          </span>
          {onClose && (
            <button type="button" onClick={onClose} className="text-xs text-[#8A7983] hover:text-[#21181D] cursor-pointer">
              Close
            </button>
          )}
        </div>

        <div className="p-4 bg-white rounded-xl border border-[#EBE3E7] space-y-3">
          <p className="text-xs text-[#55474F] leading-relaxed">
            Find actual local venues and screening times nearby without fabricated data:
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href={loc.mapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-xs font-bold text-[#059669] hover:bg-[#D1FAE5] transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Find Nearby on Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={loc.searchEngineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] text-xs font-bold text-[#0284C7] hover:bg-[#E0F2FE] transition-colors"
            >
              <span>Search Web for "{loc.searchTerm}"</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p className="text-[10px] text-[#A89AA2]">
            {loc.notice}
          </p>
        </div>
      </div>
    );
  }

  return null;
};
