import React from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { getSubcategoryTheme, TOP_LEVEL_META, TOP_LEVEL_CATEGORIES } from '../data/categories.js';

export const SwipeCard = ({
  activity,
  onSwipe, // (direction: 'left' | 'right') => void
  isFront = true,
}) => {
  if (!activity) return null;

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-16, 16]);
  const opacity = useTransform(x, [-250, -150, 0, 150, 250], [0.4, 1, 1, 1, 0.4]);

  // Visual stamps opacity
  const likeOpacity = useTransform(x, [25, 95], [0, 1]);
  const nopeOpacity = useTransform(x, [-25, -95], [0, 1]);

  const handleDragEnd = (_, info) => {
    const threshold = 90;
    if (info.offset.x > threshold) {
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      onSwipe('left');
    }
  };

  const topLevel = activity.topLevelCategory || TOP_LEVEL_CATEGORIES.LIFE;
  const topMeta = TOP_LEVEL_META[topLevel] || TOP_LEVEL_META[TOP_LEVEL_CATEGORIES.LIFE];
  const theme = getSubcategoryTheme(activity.subcategory);

  const durationText = activity.durationLabel || (activity.durations && activity.durations[0]) || '1 hour';
  const locationText = Array.isArray(activity.contexts?.location)
    ? (activity.contexts.location.includes('any') ? 'Flexible' : activity.contexts.location.join(' / '))
    : (activity.locationContext || 'Home');
  const socialText = Array.isArray(activity.contexts?.social)
    ? (activity.contexts.social.includes('solo') ? 'Solo' : activity.contexts.social.join(', '))
    : (activity.socialContext === 'alone' ? 'Solo' : activity.socialContext || 'Solo');

  const metadataLine = `${durationText} · ${locationText} · ${socialText}`;

  return (
    <motion.div
      id={`swipe-card-${activity.id}`}
      style={{
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
        opacity: isFront ? opacity : 0.95,
        cursor: isFront ? 'grab' : 'default',
      }}
      drag={isFront ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing', scale: 1.02 }}
      className={`absolute inset-0 bg-white rounded-3xl p-6 sm:p-8 border-2 ${
        isFront ? 'border-[#EBE3E7] shadow-xl' : 'border-[#F2E8EC] shadow-md scale-95 translate-y-3'
      } flex flex-col justify-between select-none touch-none transition-shadow`}
    >
      {/* Visual Stamps Overlay during drag */}
      {isFront && (
        <>
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-6 left-6 z-20 border-3 border-[#059669] text-[#059669] px-4 py-1.5 rounded-xl font-display font-black text-xl tracking-wider uppercase rotate-[-12deg] bg-white/95 shadow-sm pointer-events-none"
          >
            INTERESTED
          </motion.div>

          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-6 right-6 z-20 border-3 border-[#E11D48] text-[#E11D48] px-4 py-1.5 rounded-xl font-display font-black text-xl tracking-wider uppercase rotate-[12deg] bg-white/95 shadow-sm pointer-events-none"
          >
            NOT NOW
          </motion.div>
        </>
      )}

      {/* Top Details with Explicit Hierarchy */}
      <div>
        <div className="space-y-1 mb-4">
          <div className="flex items-center gap-2">
            <span
              style={{ color: topMeta.accentColor }}
              className="text-[11px] font-extrabold uppercase tracking-widest"
            >
              {topLevel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              style={{ color: theme.accent, backgroundColor: theme.bg, borderColor: theme.border }}
              className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border"
            >
              {activity.subcategory || 'General'}
            </span>
          </div>
        </div>

        <h2 className="font-display font-black text-2xl sm:text-3xl text-[#21181D] tracking-tight leading-snug">
          {activity.name}
        </h2>

        <p className="text-sm text-[#665760] mt-3 leading-relaxed">
          {activity.description}
        </p>

        {activity.notes && (
          <p className="text-xs text-[#8A7983] italic mt-3 bg-[#FAF7F8] p-3 rounded-xl border border-[#F2E8EC]">
            "{activity.notes}"
          </p>
        )}
      </div>

      {/* Clean Single Metadata Row & Bottom Hint */}
      <div>
        <div className="pt-4 border-t border-[#F2E8EC]">
          <p className="text-xs text-[#8A7983] font-medium text-center">
            {metadataLine}
          </p>
        </div>

        {/* Drag Hint */}
        <p className="text-center text-[11px] text-[#A89AA2] mt-4">
          Drag right for Interested · Drag left for Not now
        </p>
      </div>
    </motion.div>
  );
};
