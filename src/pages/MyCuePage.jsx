import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  Gem,
  FolderKanban,
  CheckCircle2,
  RotateCcw,
  TrendingUp,
} from 'lucide-react';
import { StorageService } from '../services/storage.js';
import { ActivityCard } from '../components/ActivityCard.jsx';
import { TOP_LEVEL_CATEGORIES, getSubcategoryTheme } from '../data/categories.js';

export const MyCuePage = ({
  onSelectActivity,
  onCommitActivity,
}) => {
  const [activities, setActivities] = useState([]);
  const [swipes, setSwipes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [logs, setLogs] = useState([]);
  const [learned, setLearned] = useState({ topLevelAffinities: {}, subcategoryAffinities: {} });
  const [activeSection, setActiveSection] = useState('love');

  const loadData = () => {
    setActivities(StorageService.getActivities());
    setSwipes(StorageService.getSwipes());
    setProjects(StorageService.getProjects());
    setLogs(StorageService.getLogs());
    setLearned(StorageService.getLearnedPreferences());
  };

  useEffect(() => {
    loadData();
    return StorageService.subscribe(loadData);
  }, []);

  const rightSwipedIds = new Set(
    swipes.filter((s) => s.direction === 'right').map((s) => s.activityId)
  );

  const thingsILove = activities.filter(
    (a) => a.favorite || a.isFavorite || rightSwipedIds.has(a.id)
  );

  const thingsCreative = activities.filter(
    (a) => a.subcategory === 'CREATIVE / MAKE' || a.leavesSomethingBehind
  );

  const thingsCore = activities.filter(
    (a) => a.topLevelCategory === TOP_LEVEL_CATEGORIES.CORE
  );

  const thingsLife = activities.filter(
    (a) => a.topLevelCategory === TOP_LEVEL_CATEGORIES.LIFE
  );

  const completedActivities = activities.filter((a) => a.lastCompletedDate);

  // Top learned subcategories sorted by ratio
  const learnedSubcategories = Object.entries(learned.subcategoryAffinities || {})
    .filter(([_, stats]) => stats.total >= 2)
    .sort((a, b) => b[1].ratio - a[1].ratio)
    .slice(0, 5);

  const totalActivities = activities.length;
  const leaveBehindCount = activities.filter((a) => a.leavesSomethingBehind).length;
  const leaveBehindPct =
    totalActivities > 0 ? Math.round((leaveBehindCount / totalActivities) * 100) : 0;
  const completedSessionsCount = logs.filter((l) => l.status === 'done').length;

  const getSectionActivities = () => {
    switch (activeSection) {
      case 'love':
        return thingsILove;
      case 'creative':
        return thingsCreative;
      case 'core':
        return thingsCore;
      case 'life':
        return thingsLife;
      case 'completed':
        return completedActivities;
      default:
        return thingsILove;
    }
  };

  const currentList = getSectionActivities();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE5EF] text-[#FF2E79] text-xs font-black uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personal Compass</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#21181D] tracking-tight">
            My Cue
          </h1>
          <p className="text-xs sm:text-sm text-[#665760] mt-1">
            What Cue understands about your aspirations, patterns, and current affinities.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (window.confirm('Reset Cue data to the clean default seed activities?')) {
              StorageService.resetToSeed();
            }
          }}
          className="text-xs font-bold text-[#8A7983] hover:text-[#FF2E79] flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Library</span>
        </button>
      </div>

      {/* Learned Affinities Panel (If user has swiped) */}
      {learnedSubcategories.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border border-[#EBE3E7] shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#FF2E79]" />
            <h3 className="font-display font-bold text-sm text-[#21181D] uppercase tracking-wider">
              Learned Interests & Affinities
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {learnedSubcategories.map(([subName, stats]) => {
              const theme = getSubcategoryTheme(subName);
              const pct = Math.round(stats.ratio * 100);
              return (
                <div
                  key={subName}
                  className="p-3 rounded-2xl border"
                  style={{ backgroundColor: theme.bg, borderColor: theme.border }}
                >
                  <span
                    style={{ color: theme.accent }}
                    className="text-[10px] font-black uppercase tracking-wider block truncate"
                  >
                    {subName}
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-display font-black text-lg text-[#21181D]">
                      {pct}%
                    </span>
                    <span className="text-[10px] text-[#665760]">interest</span>
                  </div>
                  <span className="text-[10px] text-[#8A7983] block">
                    {stats.rights} of {stats.total} swiped
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EBE3E7] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-[#8A7983] font-bold mb-1">
            <Heart className="w-4 h-4 text-[#FF2E79]" />
            <span>Things I Love</span>
          </div>
          <p className="font-display font-black text-2xl text-[#21181D]">
            {thingsILove.length}
          </p>
          <p className="text-[11px] text-[#8A7983] mt-0.5">Favorites & swiped yes</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBE3E7] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-[#8A7983] font-bold mb-1">
            <Gem className="w-4 h-4 text-[#059669]" />
            <span>Leave Behind</span>
          </div>
          <p className="font-display font-black text-2xl text-[#059669]">
            {leaveBehindPct}%
          </p>
          <p className="text-[11px] text-[#8A7983] mt-0.5">Produces lasting artifact</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBE3E7] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-[#8A7983] font-bold mb-1">
            <FolderKanban className="w-4 h-4 text-[#7C3AED]" />
            <span>Active Projects</span>
          </div>
          <p className="font-display font-black text-2xl text-[#7C3AED]">
            {projects.filter((p) => p.status === 'in_progress').length}
          </p>
          <p className="text-[11px] text-[#8A7983] mt-0.5">Multi-session endeavors</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBE3E7] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-[#8A7983] font-bold mb-1">
            <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
            <span>Sessions Done</span>
          </div>
          <p className="font-display font-black text-2xl text-[#0284C7]">
            {completedSessionsCount}
          </p>
          <p className="text-[11px] text-[#8A7983] mt-0.5">Logged completions</p>
        </div>
      </div>

      {/* Navigable Dimensions */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#F2E8EC]">
          {[
            { id: 'love', label: `Things I Love (${thingsILove.length})` },
            { id: 'creative', label: `Creative & Artifacts (${thingsCreative.length})` },
            { id: 'core', label: `Core Responsibility (${thingsCore.length})` },
            { id: 'life', label: `Life & Experiences (${thingsLife.length})` },
            { id: 'completed', label: `Recently Done (${completedActivities.length})` },
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeSection === sec.id
                  ? 'bg-[#21181D] text-white shadow-xs'
                  : 'bg-white text-[#665760] border border-[#EBE3E7] hover:bg-[#FFE5EF]'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Dimension Activities Grid */}
        {currentList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentList.map((act) => (
              <ActivityCard
                key={act.id}
                activity={act}
                onSelect={onSelectActivity}
                onCommit={onCommitActivity}
                onToggleFavorite={() => StorageService.toggleFavorite(act.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#EBE3E7] p-12 text-center space-y-2">
            <p className="font-display font-bold text-base text-[#21181D]">
              No items recorded in this section yet
            </p>
            <p className="text-xs text-[#8A7983] max-w-sm mx-auto">
              As you swipe in "Train Your Cue" or favorite activities in your library, they will automatically appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
