import React, { useState, useEffect } from 'react';
import {
  User,
  Heart,
  Sparkles,
  BookOpen,
  Award,
  Gem,
  Users,
  CheckCircle2,
  FolderKanban,
  RotateCcw,
} from 'lucide-react';
import { StorageService } from '../services/storage.js';
import { ActivityCard } from '../components/ActivityCard.jsx';

export const MyCuePage = ({
  onSelectActivity,
  onCommitActivity,
}) => {
  const [activities, setActivities] = useState([]);
  const [swipes, setSwipes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeSection, setActiveSection] = useState('love');

  const loadData = () => {
    setActivities(StorageService.getActivities());
    setSwipes(StorageService.getSwipes());
    setProjects(StorageService.getProjects());
    setLogs(StorageService.getLogs());
  };

  useEffect(() => {
    loadData();
    return StorageService.subscribe(loadData);
  }, []);

  // Swiped right IDs
  const rightSwipedIds = new Set(
    swipes.filter((s) => s.direction === 'right').map((s) => s.activityId)
  );

  // Sections
  const thingsILove = activities.filter(
    (a) => a.isFavorite || rightSwipedIds.has(a.id)
  );

  const thingsIWantToMake = activities.filter(
    (a) =>
      a.category === 'creative_make' ||
      (a.outcomes || []).includes('artifact') ||
      (a.outcomes || []).includes('digital-artifact')
  );

  const thingsIWantToLearn = activities.filter(
    (a) =>
      (a.outcomes || []).includes('skill') ||
      (a.outcomes || []).includes('knowledge')
  );

  const thingsIWantToExperience = activities.filter(
    (a) =>
      a.category === 'life_experiences' ||
      (a.outcomes || []).includes('experience')
  );

  const thingsWithPeople = activities.filter((a) => a.socialContext !== 'alone');

  const completedActivities = activities.filter((a) => a.lastCompletedDate);

  // Real Stats
  const totalActivities = activities.length;
  const leaveBehindCount = activities.filter((a) => a.leavesSomethingBehind).length;
  const leaveBehindPct =
    totalActivities > 0 ? Math.round((leaveBehindCount / totalActivities) * 100) : 0;
  const completedSessionsCount = logs.filter((l) => l.status === 'done').length;

  const getSectionActivities = () => {
    switch (activeSection) {
      case 'love':
        return thingsILove;
      case 'make':
        return thingsIWantToMake;
      case 'learn':
        return thingsIWantToLearn;
      case 'experience':
        return thingsIWantToExperience;
      case 'social':
        return thingsWithPeople;
      case 'completed':
        return completedActivities;
      default:
        return thingsILove;
    }
  };

  const currentList = getSectionActivities();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE5EF] text-[#FF2E79] text-xs font-black tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sparks’ Personal Compass</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2D262A] tracking-tight">
            My Cue
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5E66] mt-1">
            What Cue currently understands about your aspirations, habits, and passions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (confirm('Reset Cue data to the clean default seed activities?')) {
              StorageService.resetToSeed();
            }
          }}
          className="text-xs font-bold text-[#8A7983] hover:text-[#FF2E79] flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sample Library</span>
        </button>
      </div>

      {/* Real Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#FAD2E1] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-[#8A7983] font-bold mb-1">
            <Heart className="w-4 h-4 text-[#FF4D8D]" />
            <span>Things I Love</span>
          </div>
          <p className="font-display font-black text-2xl text-[#2D262A]">
            {thingsILove.length}
          </p>
          <p className="text-[11px] text-[#8A7983] mt-0.5">Favorites & swiped yes</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#FAD2E1] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-[#8A7983] font-bold mb-1">
            <Gem className="w-4 h-4 text-[#00897B]" />
            <span>Leave Behind</span>
          </div>
          <p className="font-display font-black text-2xl text-[#00897B]">
            {leaveBehindPct}%
          </p>
          <p className="text-[11px] text-[#8A7983] mt-0.5">Produces lasting value</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#FAD2E1] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-[#8A7983] font-bold mb-1">
            <FolderKanban className="w-4 h-4 text-[#7A52B3]" />
            <span>Active Projects</span>
          </div>
          <p className="font-display font-black text-2xl text-[#7A52B3]">
            {projects.filter((p) => p.status === 'in_progress').length}
          </p>
          <p className="text-[11px] text-[#8A7983] mt-0.5">Multi-session endeavors</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#FAD2E1] shadow-xs">
          <div className="flex items-center gap-1.5 text-xs text-[#8A7983] font-bold mb-1">
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
            <span>Sessions Done</span>
          </div>
          <p className="font-display font-black text-2xl text-[#2E7D32]">
            {completedSessionsCount}
          </p>
          <p className="text-[11px] text-[#8A7983] mt-0.5">Logged completions</p>
        </div>
      </div>

      {/* Navigable Dimensions */}
      <div className="space-y-5">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#F7E5EC]">
          {[
            { id: 'love', label: `Things I Love (${thingsILove.length})` },
            { id: 'make', label: `Want to Make (${thingsIWantToMake.length})` },
            { id: 'learn', label: `Want to Learn (${thingsIWantToLearn.length})` },
            { id: 'experience', label: `Want to Experience (${thingsIWantToExperience.length})` },
            { id: 'social', label: `With People (${thingsWithPeople.length})` },
            { id: 'completed', label: `Recently Done (${completedActivities.length})` },
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeSection === sec.id
                  ? 'bg-[#2D262A] text-white shadow-xs'
                  : 'bg-white text-[#6B5E66] border border-[#F5E6EC] hover:bg-[#FFE5EF]'
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
          <div className="bg-white rounded-3xl border border-[#FAD2E1] p-12 text-center space-y-2">
            <p className="font-display font-bold text-base text-[#2D262A]">
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
