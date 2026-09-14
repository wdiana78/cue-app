import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Heart,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import { StorageService } from '../services/storage.js';
import { ActivityCard } from '../components/ActivityCard.jsx';

export const ExplorePage = ({
  onSelectActivity,
  onCommitActivity,
  onNavigateToCreate,
}) => {
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, creative, home, outside, solo, social, artifact, favorites
  const [selectedPlan, setSelectedPlan] = useState(null);

  const loadData = () => {
    setActivities(StorageService.getActivities());
    setSelectedPlan(StorageService.getSelectedPlan());
  };

  useEffect(() => {
    loadData();
    return StorageService.subscribe(loadData);
  }, []);

  const handleToggleFavorite = (activityId) => {
    const updated = activities.map((a) =>
      a.id === activityId
        ? { ...a, favorite: !a.favorite, isFavorite: !a.favorite }
        : a
    );
    setActivities(updated);
    StorageService.saveActivities(updated);
  };

  // Filter options as clean optional narrowing buttons
  const filterOptions = [
    { id: 'all', label: 'All Activities' },
    { id: 'creative', label: 'Creative / Make' },
    { id: 'home', label: 'At Home' },
    { id: 'outside', label: 'Outside' },
    { id: 'solo', label: 'Solo' },
    { id: 'social', label: 'With People' },
    { id: 'artifact', label: 'Leaves an Artifact' },
    { id: 'favorites', label: 'Favorites' },
  ];

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = act.name?.toLowerCase().includes(q);
      const matchDesc = act.description?.toLowerCase().includes(q);
      const matchNotes = act.notes?.toLowerCase().includes(q);
      const matchSub = act.subcategory?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchNotes && !matchSub) return false;
    }

    // Optional Filter
    if (selectedFilter === 'creative') {
      const isCreative =
        act.subcategory === 'CREATIVE / MAKE' ||
        (act.outcomes && (act.outcomes.includes('artifact') || act.outcomes.includes('digital-artifact'))) ||
        act.leavesSomethingBehind;
      if (!isCreative) return false;
    } else if (selectedFilter === 'home') {
      const locs = act.contexts?.location || [act.locationContext || 'any'];
      if (!locs.includes('home') && !locs.includes('any')) return false;
    } else if (selectedFilter === 'outside') {
      const locs = act.contexts?.location || [act.locationContext || 'any'];
      if (!locs.includes('outside') && !locs.includes('any')) return false;
    } else if (selectedFilter === 'solo') {
      const soc = act.contexts?.social || [act.socialContext || 'any'];
      if (!soc.includes('solo') && !soc.includes('alone') && !soc.includes('any')) return false;
    } else if (selectedFilter === 'social') {
      const soc = act.contexts?.social || [act.socialContext || 'any'];
      const isSocial = soc.includes('friends') || soc.includes('group') || soc.includes('partner') || soc.includes('family');
      if (!isSocial) return false;
    } else if (selectedFilter === 'artifact') {
      if (!act.leavesSomethingBehind) return false;
    } else if (selectedFilter === 'favorites') {
      if (!act.favorite && !act.isFavorite) return false;
    }

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#F0E6EC]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#FF2E79]">
            Personal Life Library
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#21181D] tracking-tight mt-1">
            MY LIFE
          </h1>
          <p className="text-sm text-[#665760] mt-1 font-medium">
            All the things I've chosen · <span className="text-[#21181D] font-bold">{activities.length} activities</span> in total
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            id="create-new-activity-btn"
            type="button"
            onClick={onNavigateToCreate}
            className="px-4 py-2.5 bg-[#21181D] hover:bg-[#FF2E79] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Activity</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-[#A89AA2] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="life-library-search"
            type="text"
            placeholder="Search activities, crafts, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 text-xs rounded-xl border border-[#EBE3E7] bg-white text-[#21181D] focus:outline-hidden focus:ring-2 focus:ring-[#FF2E79] placeholder:text-[#A89AA2]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A7983] hover:text-[#21181D]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Optional Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-wrap">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A7983] mr-1 hidden sm:inline">
            Filter:
          </span>
          {filterOptions.map((filter) => {
            const isSelected = selectedFilter === filter.id;
            return (
              <button
                key={filter.id}
                id={`filter-btn-${filter.id}`}
                type="button"
                onClick={() => setSelectedFilter(filter.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#21181D] text-white shadow-xs'
                    : 'bg-white text-[#665760] border border-[#EBE3E7] hover:border-[#D6C7CF] hover:text-[#21181D]'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Complete Collection Grid: [activity] [activity] [activity] */}
      {filteredActivities.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#F0E6EC] space-y-3">
          <p className="font-display font-bold text-lg text-[#21181D]">
            No activities match your current filter.
          </p>
          <p className="text-xs text-[#8A7983]">
            Try adjusting your search terms or selecting "All Activities".
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedFilter('all');
              setSearchQuery('');
            }}
            className="mt-2 px-4 py-2 bg-[#F5EDF0] hover:bg-[#FFE5EF] text-[#21181D] text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between text-xs text-[#8A7983] mb-4">
            <span>
              Showing <strong className="text-[#21181D]">{filteredActivities.length}</strong> of {activities.length} activities
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((act) => {
              const isCommitted = selectedPlan?.activityId === act.id;
              return (
                <ActivityCard
                  key={act.id}
                  activity={act}
                  isCommitted={isCommitted}
                  onSelect={onSelectActivity}
                  onCommit={onCommitActivity}
                  onToggleFavorite={handleToggleFavorite}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
