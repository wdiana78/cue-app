import React from 'react';
import { Heart, CheckCircle2 } from 'lucide-react';
import { getSubcategoryTheme } from '../data/categories.js';

export const ActivityCard = ({
  activity,
  onSelect,
  onCommit,
  onToggleFavorite,
  isCommitted = false,
}) => {
  if (!activity) return null;

  const isFav = Boolean(activity.favorite || activity.isFavorite);
  const theme = getSubcategoryTheme(activity.subcategory);

  // Format the single clean metadata line: "1–2 hours · Home · Solo"
  const durationText = activity.durationLabel || (activity.durations && activity.durations[0]) || '1 hour';
  
  const locationText = Array.isArray(activity.contexts?.location)
    ? (activity.contexts.location.includes('any') ? 'Flexible' : activity.contexts.location.join(' / '))
    : (activity.locationContext || 'Home');
    
  const socialText = Array.isArray(activity.contexts?.social)
    ? (activity.contexts.social.includes('solo') ? 'Solo' : activity.contexts.social.join(', '))
    : (activity.socialContext === 'alone' ? 'Solo' : activity.socialContext || 'Solo');

  const metadataLine = `${durationText} · ${locationText} · ${socialText}`;

  // Primary outcome descriptor in simple clean uppercase
  const outcomeText = activity.outcomes && activity.outcomes.length > 0
    ? activity.outcomes[0].replace('-', ' ').toUpperCase()
    : (activity.leavesSomethingBehind ? 'ARTIFACT' : 'EXPERIENCE');

  return (
    <div
      id={`activity-card-${activity.id}`}
      className="bg-white rounded-2xl border border-[#EBE3E7] hover:border-[#D6C7CF] p-6 transition-all duration-200 hover:shadow-md flex flex-col justify-between group"
    >
      <div>
        {/* Subtle subcategory label and heart */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            style={{ color: theme.accent }}
            className="text-[11px] font-bold tracking-wider uppercase"
          >
            {theme.shortName || activity.subcategory || activity.topLevelCategory}
          </span>

          <button
            id={`fav-btn-${activity.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite && onToggleFavorite(activity.id);
            }}
            aria-label="Toggle Favorite"
            className="p-1.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer text-[#9B8E96]"
          >
            <Heart
              className={`w-4 h-4 transition-transform ${
                isFav ? 'fill-[#FF2E79] text-[#FF2E79] scale-110' : 'text-[#B8AAB1] hover:text-[#FF2E79]'
              }`}
            />
          </button>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelect && onSelect(activity)}
          className="font-display font-bold text-xl text-[#21181D] tracking-tight group-hover:text-[#FF2E79] transition-colors cursor-pointer leading-snug"
        >
          {activity.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-[#665760] mt-2 leading-relaxed line-clamp-2">
          {activity.notes ? `"${activity.notes}"` : activity.description}
        </p>

        {/* The clean single-line metadata: "1–2 hours · Home · Solo" */}
        <p className="text-xs text-[#8A7983] mt-3.5 font-medium tracking-wide">
          {metadataLine}
        </p>

        {/* Primary outcome clean text */}
        <div className="mt-3">
          <span
            style={{ color: theme.accent, backgroundColor: theme.bg, borderColor: theme.border }}
            className="inline-block text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded border"
          >
            {outcomeText}
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-3.5 border-t border-[#F5EDF0] flex items-center justify-between gap-3">
        <button
          id={`view-details-${activity.id}`}
          type="button"
          onClick={() => onSelect && onSelect(activity)}
          className="text-xs font-semibold text-[#665760] hover:text-[#21181D] py-1.5 px-2 rounded hover:bg-black/5 transition-colors cursor-pointer"
        >
          Details
        </button>

        <button
          id={`commit-btn-${activity.id}`}
          type="button"
          onClick={() => onCommit && onCommit(activity)}
          className={`text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            isCommitted
              ? 'bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]'
              : 'bg-[#21181D] text-white hover:bg-[#FF2E79] shadow-xs'
          }`}
        >
          {isCommitted ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Committed</span>
            </>
          ) : (
            <span>Let's do this</span>
          )}
        </button>
      </div>
    </div>
  );
};
