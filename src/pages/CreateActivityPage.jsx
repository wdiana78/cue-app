import React, { useState } from 'react';
import { ArrowLeft, Plus, Sparkles, Check } from 'lucide-react';
import { StorageService } from '../services/storage.js';
import {
  TOP_LEVEL_CATEGORIES,
  CORE_SUBCATEGORIES,
  LIFE_SUBCATEGORIES,
} from '../data/categories.js';

export const CreateActivityPage = ({ onBack, onCreated }) => {
  const [topLevelCategory, setTopLevelCategory] = useState(TOP_LEVEL_CATEGORIES.LIFE);
  const [subcategory, setSubcategory] = useState('CREATIVE / MAKE');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');

  // Contexts
  const [timeOfDay, setTimeOfDay] = useState('any'); // 'any', 'day', 'night'
  const [location, setLocation] = useState('home'); // 'home', 'outside', 'any'
  const [social, setSocial] = useState('solo'); // 'solo', 'friends', 'family', 'group', 'any'
  const [energyLevel, setEnergyLevel] = useState('moderate');
  const [duration, setDuration] = useState('1h');
  const [durationLabel, setDurationLabel] = useState('1 hour');

  // Outcomes & Properties
  const [outcome, setOutcome] = useState('artifact');
  const [leavesSomethingBehind, setLeavesSomethingBehind] = useState(true);
  const [requiresMaterials, setRequiresMaterials] = useState(false);
  const [potentiallySellable, setPotentiallySellable] = useState(false);
  const [skillBuilding, setSkillBuilding] = useState(true);

  const [errorMsg, setErrorMsg] = useState('');

  // When top level changes, reset subcategory to first option
  const handleTopLevelChange = (top) => {
    setTopLevelCategory(top);
    if (top === TOP_LEVEL_CATEGORIES.CORE) {
      setSubcategory(CORE_SUBCATEGORIES[0]);
    } else {
      setSubcategory(LIFE_SUBCATEGORIES[0]);
    }
  };

  const availableSubcategories =
    topLevelCategory === TOP_LEVEL_CATEGORIES.CORE
      ? CORE_SUBCATEGORIES
      : LIFE_SUBCATEGORIES;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter an activity name.');
      return;
    }

    try {
      const newActivity = {
        name: name.trim(),
        description: description.trim() || 'A personal activity added to Sparks’ library.',
        topLevelCategory,
        subcategory,
        contexts: {
          timeOfDay: timeOfDay === 'any' ? ['day', 'night'] : [timeOfDay],
          location: location === 'any' ? ['home', 'outside'] : [location],
          social: social === 'any' ? ['solo', 'friends', 'family'] : [social],
        },
        energyLevels: [energyLevel],
        durations: [duration],
        durationLabel: durationLabel.trim() || '1 hour',
        outcomes: [outcome],
        leavesSomethingBehind: Boolean(leavesSomethingBehind),
        requiresMaterials: Boolean(requiresMaterials),
        potentiallySellable: Boolean(potentiallySellable),
        skillBuilding: Boolean(skillBuilding),
        notes: notes.trim(),
        favorite: false,
      };

      const saved = StorageService.addActivity(newActivity);
      if (onCreated) {
        onCreated(saved);
      } else {
        onBack();
      }
    } catch (err) {
      setErrorMsg("Couldn't save activity. Try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header with Back button */}
      <div className="flex items-center gap-3">
        <button
          id="back-from-create-btn"
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl border border-[#EBE3E7] hover:bg-[#FFE5EF] text-[#665760] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#21181D] tracking-tight">
            Add Activity to Library
          </h1>
          <p className="text-xs text-[#665760]">
            Sparks decides what belongs in her life. Place it in the appropriate hierarchy area.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EBE3E7] shadow-xs space-y-6">
        {/* 1. TOP-LEVEL CATEGORY */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-2">
            1. Primary Life Category *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleTopLevelChange(TOP_LEVEL_CATEGORIES.CORE)}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                topLevelCategory === TOP_LEVEL_CATEGORIES.CORE
                  ? 'border-[#0284C7] bg-[#F0F9FF]'
                  : 'border-[#EBE3E7] hover:border-[#BAE6FD]'
              }`}
            >
              <span className="text-xs font-black text-[#0284C7] block uppercase tracking-wider">
                CORE RESPONSIBILITY
              </span>
              <p className="text-xs text-[#52606D] mt-1">
                "Things that build, maintain and develop my life."
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleTopLevelChange(TOP_LEVEL_CATEGORIES.LIFE)}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                topLevelCategory === TOP_LEVEL_CATEGORIES.LIFE
                  ? 'border-[#FF2E79] bg-[#FFF5F8]'
                  : 'border-[#EBE3E7] hover:border-[#FFB8D2]'
              }`}
            >
              <span className="text-xs font-black text-[#FF2E79] block uppercase tracking-wider">
                LIFE & EXPERIENCES
              </span>
              <p className="text-xs text-[#665760] mt-1">
                "Things that make life something I actually experience."
              </p>
            </button>
          </div>
        </div>

        {/* 2. SUBCATEGORY SELECTION */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-1.5">
            2. Secondary Area / Subcategory *
          </label>
          <select
            id="create-subcategory-select"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className="w-full text-xs font-bold px-3.5 py-2.5 rounded-xl border border-[#EBE3E7] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#FF2E79]"
          >
            {availableSubcategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* 3. NAME & DESCRIPTION */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-1.5">
            Activity Name *
          </label>
          <input
            id="create-name-input"
            type="text"
            placeholder="e.g. Sculpted gel nail art, Ceramic handbuilding, Reading fiction"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrorMsg('');
            }}
            required
            className="w-full text-sm px-4 py-2.5 rounded-xl border border-[#EBE3E7] focus:outline-hidden focus:ring-2 focus:ring-[#FF2E79]"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-1.5">
            Description
          </label>
          <textarea
            id="create-description-input"
            rows={2}
            placeholder="Briefly describe what this activity entails..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xs px-4 py-2.5 rounded-xl border border-[#EBE3E7] focus:outline-hidden focus:ring-2 focus:ring-[#FF2E79]"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-1.5">
            Personal Note / Spark (Optional)
          </label>
          <input
            id="create-notes-input"
            type="text"
            placeholder='e.g. "Create something that stays with you."'
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full text-xs px-4 py-2.5 rounded-xl border border-[#EBE3E7] focus:outline-hidden focus:ring-2 focus:ring-[#FF2E79]"
          />
        </div>

        {/* 4. CONTEXT ATTRIBUTES */}
        <div className="pt-4 border-t border-[#F2E8EC] space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A7983]">
            3. Context & Execution Conditions
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#8A7983] block mb-1">Time of Day</label>
              <select
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-[#EBE3E7]"
              >
                <option value="any">Day or Night</option>
                <option value="day">Daytime only</option>
                <option value="night">Nighttime only</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#8A7983] block mb-1">Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-[#EBE3E7]"
              >
                <option value="home">At Home</option>
                <option value="outside">Outside / Out</option>
                <option value="any">Flexible</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#8A7983] block mb-1">Social Setting</label>
              <select
                value={social}
                onChange={(e) => setSocial(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-[#EBE3E7]"
              >
                <option value="solo">Solo</option>
                <option value="friends">Friends</option>
                <option value="family">Family</option>
                <option value="group">Group</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#8A7983] block mb-1">Energy Required</label>
              <select
                value={energyLevel}
                onChange={(e) => setEnergyLevel(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-[#EBE3E7]"
              >
                <option value="low">Low Energy</option>
                <option value="moderate">Moderate Energy</option>
                <option value="high">High Energy</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#8A7983] block mb-1">Typical Duration Label</label>
              <input
                type="text"
                placeholder="e.g., 1–2 hours"
                value={durationLabel}
                onChange={(e) => setDurationLabel(e.target.value)}
                className="w-full text-xs p-2 rounded-xl border border-[#EBE3E7]"
              >
              </input>
            </div>
          </div>
        </div>

        {/* 5. TANGIBLE VALUE & ATTRIBUTES */}
        <div className="pt-4 border-t border-[#F2E8EC] space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A7983]">
            4. Artifacts & Value Toggles
          </h3>

          <div className="space-y-2">
            <label className="flex items-center gap-2.5 text-xs text-[#21181D] cursor-pointer">
              <input
                type="checkbox"
                checked={leavesSomethingBehind}
                onChange={(e) => setLeavesSomethingBehind(e.target.checked)}
                className="w-4 h-4 rounded text-[#FF2E79] focus:ring-[#FF2E79]"
              />
              <span className="font-semibold">Leaves something tangible behind (artifact, writing, physical craft)</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-[#21181D] cursor-pointer">
              <input
                type="checkbox"
                checked={requiresMaterials}
                onChange={(e) => setRequiresMaterials(e.target.checked)}
                className="w-4 h-4 rounded text-[#FF2E79] focus:ring-[#FF2E79]"
              />
              <span>Requires tools, paint, clay, or specific physical materials</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-[#21181D] cursor-pointer">
              <input
                type="checkbox"
                checked={potentiallySellable}
                onChange={(e) => setPotentiallySellable(e.target.checked)}
                className="w-4 h-4 rounded text-[#FF2E79] focus:ring-[#FF2E79]"
              />
              <span>Potentially sellable or giftable craft</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-[#21181D] cursor-pointer">
              <input
                type="checkbox"
                checked={skillBuilding}
                onChange={(e) => setSkillBuilding(e.target.checked)}
                className="w-4 h-4 rounded text-[#FF2E79] focus:ring-[#FF2E79]"
              />
              <span>Builds lifelong skill or expertise</span>
            </label>
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-4 border-t border-[#F2E8EC] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-xs font-bold text-[#665760] hover:text-[#21181D] cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="save-activity-submit-btn"
            type="submit"
            className="px-5 py-2.5 bg-[#21181D] hover:bg-[#FF2E79] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Save Activity to Library
          </button>
        </div>
      </form>
    </div>
  );
};
