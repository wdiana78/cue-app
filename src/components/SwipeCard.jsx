import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { Sparkles, Clock, MapPin, Users, Zap, Check, X, Heart } from 'lucide-react';

export const SwipeCard = ({
  activity,
  onSwipe, // (direction: 'left' | 'right') => void
  isFront = true,
}) => {
  if (!activity) return null;

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-250, -150, 0, 150, 250], [0.4, 1, 1, 1, 0.4]);

  // Visual stamps opacity
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -100], [0, 1]);

  const handleDragEnd = (_, info) => {
    const threshold = 90;
    if (info.offset.x > threshold) {
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      onSwipe('left');
    }
  };

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
        isFront ? 'border-[#FAD2E1] shadow-xl' : 'border-[#F0D5E0] shadow-md scale-95 translate-y-3'
      } flex flex-col justify-between select-none touch-none transition-shadow`}
    >
      {/* Visual Stamps Overlay during drag */}
      {isFront && (
        <>
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-6 left-6 z-20 border-3 border-[#2AC59B] text-[#2AC59B] px-4 py-1.5 rounded-xl font-display font-black text-xl tracking-wider uppercase rotate-[-12deg] bg-white/90 shadow-sm pointer-events-none"
          >
            INTERESTED
          </motion.div>

          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-6 right-6 z-20 border-3 border-[#FF5C8A] text-[#FF5C8A] px-4 py-1.5 rounded-xl font-display font-black text-xl tracking-wider uppercase rotate-[12deg] bg-white/90 shadow-sm pointer-events-none"
          >
            NOT NOW
          </motion.div>
        </>
      )}

      {/* Top Details */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D8D]">
            {activity.category === 'creative_make'
              ? 'Creative / Make'
              : activity.category === 'core_responsibility'
              ? 'Core Responsibility'
              : 'Life Experience'}
          </span>

          {activity.leavesSomethingBehind && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#00897B] bg-[#E0F2F1] px-2.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Leaves tangible value</span>
            </span>
          )}
        </div>

        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#2D262A] tracking-tight leading-snug">
          {activity.name}
        </h2>

        <p className="text-sm text-[#6B5E66] mt-3 leading-relaxed">
          {activity.description}
        </p>

        {activity.notes && (
          <p className="text-xs text-[#8A7983] italic mt-2 bg-[#FFF8FA] p-3 rounded-xl border border-[#FDE8EF]">
            "{activity.notes}"
          </p>
        )}
      </div>

      {/* Structured Context Metadata */}
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-[#F7E5EC]">
          <div className="bg-[#FFF8FA] p-2.5 rounded-xl text-center">
            <span className="text-[11px] text-[#8A7983] block">Time</span>
            <span className="text-xs font-bold text-[#2D262A] capitalize">
              {activity.timeContext === 'any' ? 'Day or Night' : activity.timeContext}
            </span>
          </div>

          <div className="bg-[#FFF8FA] p-2.5 rounded-xl text-center">
            <span className="text-[11px] text-[#8A7983] block">Location</span>
            <span className="text-xs font-bold text-[#2D262A] capitalize">
              {activity.locationContext === 'any' ? 'Flexible' : activity.locationContext}
            </span>
          </div>

          <div className="bg-[#FFF8FA] p-2.5 rounded-xl text-center">
            <span className="text-[11px] text-[#8A7983] block">Social</span>
            <span className="text-xs font-bold text-[#2D262A] capitalize">
              {activity.socialContext === 'alone' ? 'Solo' : activity.socialContext}
            </span>
          </div>

          <div className="bg-[#FFF8FA] p-2.5 rounded-xl text-center">
            <span className="text-[11px] text-[#8A7983] block">Duration</span>
            <span className="text-xs font-bold text-[#2D262A]">
              {activity.durationLabel || activity.duration}
            </span>
          </div>
        </div>

        {/* Drag Hint */}
        <p className="text-center text-[11px] text-[#AFA2A9] mt-4">
          Drag right for Interested · Drag left for Not now
        </p>
      </div>
    </motion.div>
  );
};
