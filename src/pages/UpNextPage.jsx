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
  X,
  BookOpen,
} from 'lucide-react';
import { StorageService } from '../services/storage.js';
import { getSubcategoryTheme } from '../data/categories.js';

export const UpNextPage = ({
  onNavigate,
  onSelectActivity,
  onOpenCompletionModal,
}) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  const loadData = () => {
    const plan = StorageService.getSelectedPlan();
    setSelectedPlan(plan);
    setRecentLogs(StorageService.getLogs().slice(0, 5));
  };

  useEffect(() => {
    loadData();
    return StorageService.subscribe(loadData);
  }, []);

  // Update timer if in progress
  useEffect(() => {
    if (selectedPlan?.status === 'in_progress' && selectedPlan?.startedAt) {
      const calcElapsed = () => {
        const start = new Date(selectedPlan.startedAt).getTime();
        const now = Date.now();
        const mins = Math.max(0, Math.floor((now - start) / 60000));
        setElapsedMinutes(mins);
      };
      calcElapsed();
      const interval = setInterval(calcElapsed, 30000);
      return () => clearInterval(interval);
    }
  }, [selectedPlan]);

  const handleStart = () => {
    StorageService.startPlan();
  };

  const handleChange = () => {
    if (window.confirm('Change your chosen activity? You can pick another option.')) {
      StorageService.clearSelectedPlan();
      onNavigate && onNavigate('recommend');
    }
  };

  const handleComplete = () => {
    if (selectedPlan) {
      onOpenCompletionModal && onOpenCompletionModal(selectedPlan.activity.name);
    }
  };

  const activity = selectedPlan?.activity;
  const theme = activity ? getSubcategoryTheme(activity.subcategory) : null;

  // Metadata line
  const durationText = activity?.durationLabel || (activity?.durations && activity?.durations[0]) || '1 hour';
  const locationText = Array.isArray(activity?.contexts?.location)
    ? (activity.contexts.location.includes('any') ? 'Flexible' : activity.contexts.location.join(' / '))
    : (activity?.locationContext || 'Home');
  const socialText = Array.isArray(activity?.contexts?.social)
    ? (activity.contexts.social.includes('solo') ? 'Solo' : activity.contexts.social.join(', '))
    : (activity?.socialContext === 'alone' ? 'Solo' : 'Solo');
  const energyText = Array.isArray(activity?.energyLevels)
    ? activity.energyLevels[0]
    : (activity?.energyLevel || 'Moderate');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      {/* Header */}
      <div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#FF2E79]">
          Current Focus
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#21181D] tracking-tight mt-1">
          UP NEXT
        </h1>
        <p className="text-sm text-[#665760] mt-1">
          Sparks decides what belongs in her life. Here is what you have chosen to do.
        </p>
      </div>

      {/* Main Choice Card */}
      {selectedPlan && activity ? (
        <div className="bg-white rounded-3xl border-2 border-[#21181D] shadow-md p-6 sm:p-10 space-y-8 relative overflow-hidden">
          {/* Top Label & Status */}
          <div className="flex items-center justify-between gap-4 border-b border-[#F5EDF0] pb-5 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1 rounded-full bg-[#21181D] text-white text-xs font-black uppercase tracking-wider">
                {selectedPlan.targetTime || 'Tonight'}
              </span>
              <span
                style={{ color: theme?.accent }}
                className="text-xs font-bold uppercase tracking-wider"
              >
                {theme?.shortName || activity.subcategory || 'Personal Choice'}
              </span>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2">
              {selectedPlan.status === 'in_progress' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF5FF] text-[#0066CC] text-xs font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-[#0066CC]"></span>
                  In Progress ({elapsedMinutes}m)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE5EF] text-[#FF2E79] text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#FF2E79]"></span>
                  Ready to Start
                </span>
              )}
            </div>
          </div>

          {/* Activity Information */}
          <div className="space-y-4">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#21181D] tracking-tight leading-tight">
              {activity.name}
            </h2>

            <p className="text-base text-[#665760] leading-relaxed max-w-2xl">
              {activity.description}
            </p>

            {activity.notes && (
              <p className="text-sm italic text-[#8A7983] border-l-2 border-[#FF2E79] pl-3 py-0.5">
                "{activity.notes}"
              </p>
            )}

            {/* Clean metadata line */}
            <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-[#52444C] flex-wrap">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#FF2E79]" />
                {durationText}
              </span>
              <span>·</span>
              <span>{locationText}</span>
              <span>·</span>
              <span>{socialText}</span>
              <span>·</span>
              <span className="capitalize">{energyText} energy</span>
            </div>

            {/* Artifact note if applicable */}
            {activity.leavesSomethingBehind && (
              <div className="pt-2">
                <span className="inline-block text-xs font-bold text-[#137333] bg-[#E6F4EA] border border-[#CEEAD6] px-3 py-1 rounded-lg">
                  Leaves something behind: Physical or digital artifact
                </span>
              </div>
            )}
          </div>

          {/* Action Button Bar */}
          <div className="pt-6 border-t border-[#F5EDF0] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {selectedPlan.status === 'in_progress' ? (
                <button
                  id="complete-plan-btn"
                  type="button"
                  onClick={handleComplete}
                  className="px-6 py-3 bg-[#137333] hover:bg-[#0E5826] text-white text-sm font-bold rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Mark as Completed</span>
                </button>
              ) : (
                <button
                  id="start-plan-btn"
                  type="button"
                  onClick={handleStart}
                  className="px-8 py-3.5 bg-[#FF2E79] hover:bg-[#E01A63] text-white text-sm font-black rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Activity</span>
                </button>
              )}

              <button
                id="view-plan-details-btn"
                type="button"
                onClick={() => onSelectActivity && onSelectActivity(activity)}
                className="px-4 py-3 bg-[#F5EDF0] hover:bg-[#EBE3E7] text-[#21181D] text-xs font-bold rounded-2xl transition-colors cursor-pointer text-center"
              >
                View Full Details
              </button>
            </div>

            <button
              id="change-plan-btn"
              type="button"
              onClick={handleChange}
              className="text-xs font-bold text-[#8A7983] hover:text-[#FF2E79] transition-colors cursor-pointer text-center py-2"
            >
              Change activity
            </button>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-[#F0E6EC] space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-[#FFE5EF] text-[#FF2E79] flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="font-display font-bold text-2xl text-[#21181D]">
              No activity selected right now
            </h2>
            <p className="text-sm text-[#665760] leading-relaxed">
              When you're ready, let Cue recommend options based on your current situation, or pick directly from your personal library.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="empty-plan-recommend-btn"
              type="button"
              onClick={() => onNavigate && onNavigate('recommend')}
              className="w-full sm:w-auto px-6 py-3 bg-[#21181D] hover:bg-[#FF2E79] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>What Should I Do?</span>
            </button>

            <button
              id="empty-plan-explore-btn"
              type="button"
              onClick={() => onNavigate && onNavigate('explore')}
              className="w-full sm:w-auto px-6 py-3 bg-[#F5EDF0] hover:bg-[#EBE3E7] text-[#21181D] text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse My Life Library</span>
            </button>
          </div>
        </div>
      )}

      {/* Recent Completions / History */}
      {recentLogs.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="font-display font-bold text-lg text-[#21181D] tracking-tight">
            Recent Completions & History
          </h3>
          <div className="space-y-2.5">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="bg-white rounded-2xl p-4 border border-[#F0E6EC] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#E6F4EA] text-[#137333] flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#21181D]">
                      {log.activityName}
                    </h4>
                    <p className="text-xs text-[#8A7983]">
                      {new Date(log.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                      {log.feedback && ` · Feedback: ${log.feedback}`}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#137333] bg-[#E6F4EA] px-2.5 py-1 rounded-lg shrink-0">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
