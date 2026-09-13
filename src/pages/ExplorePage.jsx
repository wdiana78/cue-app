import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Heart,
  Sparkles,
  Filter,
  BookOpen,
  MapPin,
  Clock,
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
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'creative_make' | 'core_responsibility' | 'life_experiences'
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [onlyTangible, setOnlyTangible] = useState(false);
  const [locationFilter, setLocationFilter] = useState('all'); // 'all' | 'home' | 'outside'

  const loadActivities = () => {
    setActivities(StorageService.getActivities());
  };

  useEffect(() => {
    loadActivities();
    return StorageService.subscribe(loadActivities);
  }, []);

  // Filter activities
  const filtered = activities.filter((act) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = act.name.toLowerCase().includes(q);
      const matchDesc = (act.description || '').toLowerCase().includes(q);
      const matchNotes = (act.notes || '').toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchNotes) return false;
    }

    // Category
    if (selectedCategory !== 'all') {
      if (act.category !== selectedCategory) return false;
    }

    // Favorites
    if (onlyFavorites && !act.isFavorite) {
      return false;
    }

    // Tangible (Leaves something behind)
    if (onlyTangible && !act.leavesSomethingBehind) {
      return false;
    }

    // Location
    if (locationFilter !== 'all') {
      if (act.locationContext !== 'any' && act.locationContext !== locationFilter) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE5EF] text-[#FF2E79] text-xs font-black tracking-wider uppercase mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>My Life Library</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#2D262A] tracking-tight">
            Explore My Life
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5E66] mt-1">
            {activities.length} total activities curated for your growth, craft, and restoration.
          </p>
        </div>

        {/* Add Activity Button */}
        <button
          id="add-activity-btn"
          type="button"
          onClick={onNavigateToCreate}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#FF2E79] hover:bg-[#E01A63] text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Activity</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-3xl p-5 border border-[#F5E6EC] space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#AFA2A9] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="library-search-input"
            type="text"
            placeholder="Search activities by name, craft, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-[#FAD2E1] focus:outline-hidden focus:ring-2 focus:ring-[#FF4D8D] placeholder:text-[#AFA2A9]"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#FBF0F4]">
          {/* Category Tabs */}
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'creative_make', label: 'Creative / Make' },
            { id: 'core_responsibility', label: 'Core Responsibility' },
            { id: 'life_experiences', label: 'Life & Experiences' },
          ].map((cat) => (
            <button
              key={cat.id}
              id={`filter-cat-${cat.id}`}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#2D262A] text-white shadow-xs'
                  : 'bg-[#FFF8FA] text-[#6B5E66] border border-[#F5E6EC] hover:bg-[#FFE5EF]'
              }`}
            >
              {cat.label}
            </button>
          ))}

          <div className="h-5 w-px bg-gray-200 hidden sm:block mx-1" />

          {/* Quick Toggles */}
          <button
            id="filter-favorites-toggle"
            type="button"
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              onlyFavorites
                ? 'bg-[#FF2E79] text-white'
                : 'bg-[#FFF8FA] text-[#6B5E66] border border-[#F5E6EC] hover:bg-[#FFE5EF]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-white' : ''}`} />
            <span>Favorites</span>
          </button>

          <button
            id="filter-tangible-toggle"
            type="button"
            onClick={() => setOnlyTangible(!onlyTangible)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              onlyTangible
                ? 'bg-[#00897B] text-white'
                : 'bg-[#FFF8FA] text-[#6B5E66] border border-[#F5E6EC] hover:bg-[#E0F2F1]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Leaves Artifact / Skill</span>
          </button>
        </div>
      </div>

      {/* Activities Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onSelect={onSelectActivity}
              onCommit={onCommitActivity}
              onToggleFavorite={() => StorageService.toggleFavorite(activity.id)}
            />
          ))}
        </div>
      ) : (
        /* Empty Filter State */
        <div className="bg-white rounded-3xl p-12 border border-[#F5E6EC] text-center space-y-3">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-display font-bold text-base text-[#2D262A]">
            No matching activities found
          </h3>
          <p className="text-xs text-[#8A7983] max-w-sm mx-auto">
            Try adjusting your search terms or filters, or add a custom activity to your library.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setOnlyFavorites(false);
              setOnlyTangible(false);
            }}
            className="text-xs font-bold text-[#FF2E79] underline cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
