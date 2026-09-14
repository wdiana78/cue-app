import React, { useState, useEffect } from 'react';
import { Flame, X, Heart, Sparkles, RotateCcw, ArrowRight, Filter } from 'lucide-react';
import { StorageService } from '../services/storage.js';
import { SwipeCard } from '../components/SwipeCard.jsx';
import { SwipeReasonModal } from '../components/SwipeReasonModal.jsx';
import { TOP_LEVEL_CATEGORIES } from '../data/categories.js';

export const TrainCuePage = ({ onSelectActivity, onNavigateToRecommend }) => {
  const [allActivities, setAllActivities] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' | CORE | LIFE | 'CREATIVE / MAKE'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipes, setSwipes] = useState([]);

  // Modal for optional reason feedback
  const [lastSwipedActivity, setLastSwipedActivity] = useState(null);
  const [lastDirection, setLastDirection] = useState(null);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);

  const loadData = () => {
    const actList = StorageService.getActivities();
    const storedSwipes = StorageService.getSwipes();
    setAllActivities(actList);
    setSwipes(storedSwipes);
  };

  useEffect(() => {
    loadData();
    return StorageService.subscribe(loadData);
  }, []);

  // Filter activities for the training deck
  const activeDeck = allActivities.filter((a) => {
    if (filterCategory === 'all') return true;
    if (filterCategory === TOP_LEVEL_CATEGORIES.CORE) {
      return a.topLevelCategory === TOP_LEVEL_CATEGORIES.CORE;
    }
    if (filterCategory === TOP_LEVEL_CATEGORIES.LIFE) {
      return a.topLevelCategory === TOP_LEVEL_CATEGORIES.LIFE;
    }
    if (filterCategory === 'CREATIVE / MAKE') {
      return a.subcategory === 'CREATIVE / MAKE';
    }
    return true;
  });

  const exploredCount = swipes.length;
  const interestedCount = swipes.filter((s) => s.direction === 'right').length;
  const notNowCount = swipes.filter((s) => s.direction === 'left').length;

  const currentActivity = activeDeck[currentIndex] || null;
  const nextActivity = activeDeck[currentIndex + 1] || null;

  // Handle swipe decision
  const handleSwipe = (direction) => {
    if (!currentActivity) return;

    const currentHour = new Date().getHours();
    const timeContext = currentHour >= 18 || currentHour < 5 ? 'night' : 'day';

    // Record swipe with explicit hierarchy to storage
    StorageService.recordSwipe({
      activityId: currentActivity.id,
      activityName: currentActivity.name,
      topLevelCategory: currentActivity.topLevelCategory,
      subcategory: currentActivity.subcategory,
      direction,
      context: {
        timeContext,
        locationContext: 'home',
        socialContext: 'alone',
        energyLevel: 'moderate',
      },
    });

    // Queue optional reason modal
    setLastSwipedActivity(currentActivity);
    setLastDirection(direction);
    setIsReasonModalOpen(true);

    // Advance card
    setCurrentIndex((prev) => prev + 1);
  };

  const handleReasonSelected = (reason) => {
    if (lastSwipedActivity) {
      const allSwipes = StorageService.getSwipes();
      if (allSwipes.length > 0) {
        allSwipes[0].reason = reason;
        if (reason === 'Not my thing') {
          allSwipes[0].isPermanentDislike = true;
        }
        localStorage.setItem('cue_swipes_v3', JSON.stringify(allSwipes));
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
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE5EF] text-[#FF2E79] text-xs font-black uppercase tracking-widest">
          <Flame className="w-3.5 h-3.5" />
          <span>Train Your Cue</span>
        </div>
        <h1 className="font-display font-black text-3xl text-[#21181D] tracking-tight">
          Teach Cue what you love.
        </h1>
        <p className="text-xs sm:text-sm text-[#665760]">
          Cue learns your preferences across categories, subcategories, and current contexts.
        </p>
      </div>

      {/* Deck Filter Tabs */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {[
          { id: 'all', label: 'All Activities' },
          { id: TOP_LEVEL_CATEGORIES.LIFE, label: 'Life & Experiences' },
          { id: 'CREATIVE / MAKE', label: 'Creative / Make' },
          { id: TOP_LEVEL_CATEGORIES.CORE, label: 'Core Responsibility' },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`deck-filter-${tab.id.replace(/\s+/g, '-').toLowerCase()}`}
            type="button"
            onClick={() => {
              setFilterCategory(tab.id);
              setCurrentIndex(0);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterCategory === tab.id
                ? 'bg-[#21181D] text-white shadow-xs'
                : 'bg-white text-[#665760] border border-[#EBE3E7] hover:bg-[#FFE5EF]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Real Stats Bar */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-[#EBE3E7] text-xs">
        <div>
          <span className="text-[#8A7983] font-bold block text-[10px] uppercase">Explored</span>
          <span className="font-display font-black text-base text-[#21181D]">{exploredCount}</span>
        </div>
        <div className="border-l border-[#EBE3E7] pl-3">
          <span className="text-[#059669] font-bold block text-[10px] uppercase">Interested</span>
          <span className="font-display font-black text-base text-[#059669]">{interestedCount}</span>
        </div>
        <div className="border-l border-[#EBE3E7] pl-3">
          <span className="text-[#E11D48] font-bold block text-[10px] uppercase">Not Now</span>
          <span className="font-display font-black text-base text-[#E11D48]">{notNowCount}</span>
        </div>
        <div className="border-l border-[#EBE3E7] pl-3 text-right">
          <span className="text-[#8A7983] font-bold block text-[10px] uppercase">Deck</span>
          <span className="font-display font-bold text-xs text-[#21181D]">
            {activeDeck.length > 0 ? `${Math.min(currentIndex + 1, activeDeck.length)} of ${activeDeck.length}` : '0'}
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
          <div className="absolute inset-0 bg-white rounded-3xl p-8 border-2 border-dashed border-[#FFB8D2] flex flex-col items-center justify-center text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE5EF] text-[#FF2E79] flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#21181D]">
                You've completed this deck!
              </h3>
              <p className="text-xs text-[#665760] mt-1">
                Cue has recorded {exploredCount} preferences across your life library.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleResetDeck}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#21181D] text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Deck</span>
              </button>
              {onNavigateToRecommend && (
                <button
                  type="button"
                  onClick={onNavigateToRecommend}
                  className="px-4 py-2 bg-[#21181D] hover:bg-[#FF2E79] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
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
          <button
            id="swipe-left-btn"
            type="button"
            onClick={() => handleSwipe('left')}
            className="w-14 h-14 rounded-full bg-white border-2 border-[#FECDD3] hover:border-[#E11D48] text-[#E11D48] hover:bg-[#FFF1F2] shadow-md flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Not for me right now"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>

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

      {/* Optional Reason Feedback Modal */}
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
