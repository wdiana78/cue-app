import React, { useState, useEffect } from 'react';
import { Flame, X, Heart, Sparkles, RotateCcw, ArrowRight } from 'lucide-react';
import { StorageService } from '../services/storage.js';
import { SwipeCard } from '../components/SwipeCard.jsx';
import { SwipeReasonModal } from '../components/SwipeReasonModal.jsx';

export const TrainCuePage = ({ onSelectActivity, onNavigateToRecommend }) => {
  const [activities, setActivities] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipes, setSwipes] = useState([]);

  // Modal for optional reason feedback
  const [lastSwipedActivity, setLastSwipedActivity] = useState(null);
  const [lastDirection, setLastDirection] = useState(null);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);

  const loadData = () => {
    const actList = StorageService.getActivities();
    const storedSwipes = StorageService.getSwipes();
    setActivities(actList);
    setSwipes(storedSwipes);
  };

  useEffect(() => {
    loadData();
    return StorageService.subscribe(loadData);
  }, []);

  // Calculate real metrics from stored swipes
  const exploredCount = swipes.length;
  const interestedCount = swipes.filter((s) => s.direction === 'right').length;
  const notNowCount = swipes.filter((s) => s.direction === 'left').length;

  const currentActivity = activities[currentIndex] || null;
  const nextActivity = activities[currentIndex + 1] || null;

  // Handle swipe decision
  const handleSwipe = (direction) => {
    if (!currentActivity) return;

    const currentHour = new Date().getHours();
    const timeContext = currentHour >= 18 || currentHour < 6 ? 'night' : 'day';

    // Record swipe immediately to storage
    StorageService.recordSwipe({
      activityId: currentActivity.id,
      activityName: currentActivity.name,
      direction,
      context: {
        timeContext,
        locationContext: 'home',
        socialContext: 'alone',
      },
    });

    // Queue optional reason modal
    setLastSwipedActivity(currentActivity);
    setLastDirection(direction);
    setIsReasonModalOpen(true);

    // Advance card immediately so experience feels snappy
    setCurrentIndex((prev) => prev + 1);
  };

  const handleReasonSelected = (reason) => {
    if (lastSwipedActivity) {
      // Update the latest swipe entry with the chosen reason
      const allSwipes = StorageService.getSwipes();
      if (allSwipes.length > 0) {
        allSwipes[0].reason = reason;
        if (reason === 'Not my thing') {
          allSwipes[0].isPermanentDislike = true;
        }
        localStorage.setItem('cue_swipes_v2', JSON.stringify(allSwipes));
        setSwipes(allSwipes);
      }
    }
    setIsReasonModalOpen(false);
  };

  const handleResetDeck = () => {
    setCurrentIndex(0);
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE5EF] text-[#FF2E79] text-xs font-black tracking-wider uppercase mb-1">
          <Flame className="w-3.5 h-3.5" />
          <span>Train Your Cue</span>
        </div>
        <h1 className="font-display font-black text-3xl text-[#2D262A] tracking-tight">
          Teach Cue what you like.
        </h1>
        <p className="text-xs text-[#6B5E66]">
          Swipe right if interested, swipe left if not for right now.
        </p>
      </div>

      {/* Real Stats Bar */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-[#F5E6EC] text-xs">
        <div>
          <span className="text-[#8A7983] font-bold block text-[11px] uppercase">Explored</span>
          <span className="font-display font-black text-lg text-[#2D262A]">{exploredCount}</span>
        </div>
        <div className="border-l border-[#F5E6EC] pl-4">
          <span className="text-[#2AC59B] font-bold block text-[11px] uppercase">Interested</span>
          <span className="font-display font-black text-lg text-[#2AC59B]">{interestedCount}</span>
        </div>
        <div className="border-l border-[#F5E6EC] pl-4">
          <span className="text-[#FF5C8A] font-bold block text-[11px] uppercase">Not Now</span>
          <span className="font-display font-black text-lg text-[#FF5C8A]">{notNowCount}</span>
        </div>
        <div className="border-l border-[#F5E6EC] pl-4 text-right">
          <span className="text-[#8A7983] font-bold block text-[11px] uppercase">Deck</span>
          <span className="font-display font-bold text-sm text-[#2D262A]">
            {Math.min(currentIndex + 1, activities.length)} of {activities.length}
          </span>
        </div>
      </div>

      {/* Interactive Swipe Area */}
      <div className="relative h-[430px] sm:h-[450px] w-full max-w-sm mx-auto">
        {currentActivity ? (
          <>
            {/* Background card preview */}
            {nextActivity && (
              <SwipeCard activity={nextActivity} isFront={false} onSwipe={() => {}} />
            )}

            {/* Foreground interactive card */}
            <SwipeCard
              key={currentActivity.id}
              activity={currentActivity}
              isFront={true}
              onSwipe={handleSwipe}
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-white rounded-3xl p-8 border-2 border-dashed border-[#FAD2E1] flex flex-col items-center justify-center text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE5EF] text-[#FF2E79] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#2D262A]">
                You've completed the deck!
              </h3>
              <p className="text-xs text-[#6B5E66] mt-1">
                Cue has recorded {exploredCount} contextual preferences for your library.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleResetDeck}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#2D262A] text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Shuffle Again</span>
              </button>
              {onNavigateToRecommend && (
                <button
                  type="button"
                  onClick={onNavigateToRecommend}
                  className="px-4 py-2 bg-[#FF2E79] hover:bg-[#E01A63] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Test Recommendations</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tactile Action Buttons below card */}
      {currentActivity && (
        <div className="flex items-center justify-center gap-6 pt-2">
          {/* Left / Not now Button */}
          <button
            id="swipe-left-btn"
            type="button"
            onClick={() => handleSwipe('left')}
            className="w-14 h-14 rounded-full bg-white border-2 border-[#FFD1E3] hover:border-[#FF5C8A] text-[#FF5C8A] hover:bg-[#FFE5EF] shadow-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Not for me right now"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Right / Interested Button */}
          <button
            id="swipe-right-btn"
            type="button"
            onClick={() => handleSwipe('right')}
            className="w-14 h-14 rounded-full bg-[#FF2E79] hover:bg-[#E01A63] text-white shadow-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Interested"
          >
            <Heart className="w-6 h-6 fill-white stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* Optional Reason Feedback Modal (Non-blocking) */}
      <SwipeReasonModal
        isOpen={isReasonModalOpen}
        activityName={lastSwipedActivity ? lastSwipedActivity.name : ''}
        direction={lastDirection}
        onSelectReason={handleReasonSelected}
        onSkip={() => setIsReasonModalOpen(false)}
      />
    </div>
  );
};
