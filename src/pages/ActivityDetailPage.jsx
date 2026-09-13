import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Heart,
  Sparkles,
  Clock,
  Zap,
  MapPin,
  Sun,
  Moon,
  Users,
  User,
  CheckCircle2,
  FolderPlus,
  Calendar,
} from 'lucide-react';
import { StorageService } from '../services/storage.js';

export const ActivityDetailPage = ({
  activity,
  onBack,
  onCommit,
  onStartProject,
}) => {
  if (!activity) return null;

  const [currentActivity, setCurrentActivity] = useState(activity);

  const loadCurrent = () => {
    const fresh = StorageService.getActivityById(activity.id);
    if (fresh) setCurrentActivity(fresh);
  };

  useEffect(() => {
    loadCurrent();
    return StorageService.subscribe(loadCurrent);
  }, [activity.id]);

  const isFavorite = Boolean(currentActivity.isFavorite);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-in fade-in">
      {/* Back button */}
      <button
        id="back-to-library-btn"
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#8A7983] hover:text-[#2D262A] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to collection</span>
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-[#FAD2E1] p-6 sm:p-8 shadow-xs relative overflow-hidden space-y-6">
        {/* Category & Action Top Bar */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#FFE5EF] text-[#FF2E79]">
            {currentActivity.category === 'creative_make'
              ? 'Creative / Make'
              : currentActivity.category === 'core_responsibility'
              ? 'Core Responsibility'
              : 'Life & Experience'}
          </span>

          <button
            id="detail-fav-btn"
            type="button"
            onClick={() => StorageService.toggleFavorite(currentActivity.id)}
            className={`p-2 rounded-2xl border transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-[#FFE5EF] border-[#FFB8D2] text-[#FF2E79]'
                : 'bg-white border-gray-200 text-gray-400 hover:text-[#FF2E79]'
            }`}
            aria-label="Toggle Favorite"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Title & Description */}
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#2D262A] tracking-tight">
            {currentActivity.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#55474F] mt-2.5 leading-relaxed">
            {currentActivity.description}
          </p>

          {currentActivity.notes && (
            <p className="text-xs text-[#8A7983] italic mt-3 bg-[#FFF8FA] p-3 rounded-xl border border-[#FDE8EF]">
              "{currentActivity.notes}"
            </p>
          )}
        </div>

        {/* Tangible Banner */}
        {currentActivity.leavesSomethingBehind && (
          <div className="p-4 rounded-2xl bg-[#E0F2F1] border border-[#B2DFDB] flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#00897B] text-white shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-[#00796B]">
                Leaves Something Tangible Behind
              </h4>
              <p className="text-xs text-[#00695C] mt-0.5 leading-relaxed">
                This activity produces an enduring artifact, manuscript, deepened skill, or finished piece.
              </p>
            </div>
          </div>
        )}

        {/* Context Grid */}
        <div className="pt-4 border-t border-[#F7E5EC]">
          <h3 className="text-xs font-bold text-[#8A7983] uppercase tracking-wider mb-3">
            Ideal Context
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#FFF8FA] p-3 rounded-2xl border border-[#FDE8EF]">
              <span className="text-[11px] text-[#8A7983] block">Time</span>
              <p className="font-bold text-xs text-[#2D262A] capitalize">
                {currentActivity.timeContext === 'any' ? 'Day or Night' : currentActivity.timeContext}
              </p>
            </div>

            <div className="bg-[#FFF8FA] p-3 rounded-2xl border border-[#FDE8EF]">
              <span className="text-[11px] text-[#8A7983] block">Location</span>
              <p className="font-bold text-xs text-[#2D262A] capitalize">
                {currentActivity.locationContext}
              </p>
            </div>

            <div className="bg-[#FFF8FA] p-3 rounded-2xl border border-[#FDE8EF]">
              <span className="text-[11px] text-[#8A7983] block">Social</span>
              <p className="font-bold text-xs text-[#2D262A] capitalize">
                {currentActivity.socialContext === 'alone' ? 'Solo' : currentActivity.socialContext}
              </p>
            </div>

            <div className="bg-[#FFF8FA] p-3 rounded-2xl border border-[#FDE8EF]">
              <span className="text-[11px] text-[#8A7983] block">Energy & Time</span>
              <p className="font-bold text-xs text-[#2D262A] capitalize">
                {currentActivity.energyLevel} · {currentActivity.durationLabel || currentActivity.duration}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-[#F7E5EC] flex flex-col sm:flex-row items-center gap-3">
          <button
            id="detail-commit-btn"
            type="button"
            onClick={() => onCommit(currentActivity)}
            className="w-full sm:flex-1 py-3.5 rounded-2xl bg-[#FF2E79] hover:bg-[#E01A63] text-white text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>I'll do this right now</span>
          </button>

          <button
            id="detail-turn-project-btn"
            type="button"
            onClick={() => onStartProject(currentActivity)}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl border border-[#D1C4E9] text-[#7A52B3] bg-[#FAF8FC] hover:bg-[#EDE7F6] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Turn into a Project</span>
          </button>
        </div>
      </div>
    </div>
  );
};
