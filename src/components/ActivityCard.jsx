import React from 'react';
import { Heart, Sparkles, Clock, MapPin, Zap, CheckCircle2 } from 'lucide-react';

export const ActivityCard = ({
  activity,
  onSelect,
  onCommit,
  onToggleFavorite,
  isCommitted = false,
}) => {
  if (!activity) return null;

  const isFav = Boolean(activity.isFavorite);

  return (
    <div
      id={`activity-card-${activity.id}`}
      className="bg-white rounded-2xl border border-[#F5E6EC] p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-[#FFB8D2]"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF4D8D]">
              {activity.category === 'creative_make'
                ? 'Creative / Make'
                : activity.category === 'core_responsibility'
                ? 'Core Responsibility'
                : 'Life Experience'}
            </span>
            {activity.leavesSomethingBehind && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00897B] bg-[#E0F2F1] px-2 py-0.5 rounded-md">
                <Sparkles className="w-3 h-3" />
                Tangible
              </span>
            )}
          </div>

          {/* Favorite button */}
          <button
            id={`fav-btn-${activity.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite && onToggleFavorite(activity.id);
            }}
            aria-label="Toggle Favorite"
            className="p-1.5 rounded-full hover:bg-[#FFE5EF] transition-colors cursor-pointer text-[#8A7983]"
          >
            <Heart
              className={`w-4 h-4 transition-transform ${
                isFav ? 'fill-[#FF2E79] text-[#FF2E79] scale-110' : 'text-[#AFA2A9] hover:text-[#FF2E79]'
              }`}
            />
          </button>
        </div>

        <h3
          onClick={() => onSelect && onSelect(activity)}
          className="font-display font-bold text-lg text-[#2D262A] group-hover:text-[#FF2E79] transition-colors cursor-pointer"
        >
          {activity.name}
        </h3>

        <p className="text-xs text-[#6B5E66] mt-1.5 line-clamp-2 leading-relaxed">
          {activity.description}
        </p>

        {/* Crisp metadata row - clean text, no excessive pills */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8A7983] mt-3 pt-2.5 border-t border-[#FBF0F4]">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#FF758F]" />
            {activity.durationLabel || activity.duration}
          </span>
          <span className="flex items-center gap-1 capitalize">
            <MapPin className="w-3.5 h-3.5 text-[#70C1B3]" />
            {activity.locationContext}
          </span>
          <span className="flex items-center gap-1 capitalize">
            <Zap className="w-3.5 h-3.5 text-[#FFB703]" />
            {activity.energyLevel} energy
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 pt-3 border-t border-[#FBF0F4] flex items-center justify-between gap-2">
        <button
          id={`view-details-${activity.id}`}
          type="button"
          onClick={() => onSelect && onSelect(activity)}
          className="text-xs font-bold text-[#6B5E66] hover:text-[#2D262A] py-1.5 px-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Details
        </button>

        <button
          id={`commit-btn-${activity.id}`}
          type="button"
          onClick={() => onCommit && onCommit(activity)}
          className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            isCommitted
              ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]'
              : 'bg-[#FF2E79] text-white hover:bg-[#E01A63] shadow-xs'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{isCommitted ? 'Active Plan' : "I'll do this"}</span>
        </button>
      </div>
    </div>
  );
};
