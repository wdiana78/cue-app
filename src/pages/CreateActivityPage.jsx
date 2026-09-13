import React, { useState } from 'react';
import { ArrowLeft, Plus, Sparkles, Check } from 'lucide-react';
import { StorageService } from '../services/storage.js';

export const CreateActivityPage = ({ onBack, onCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('creative_make');
  const [timeContext, setTimeContext] = useState('any');
  const [locationContext, setLocationContext] = useState('home');
  const [socialContext, setSocialContext] = useState('alone');
  const [energyLevel, setEnergyLevel] = useState('moderate');
  const [duration, setDuration] = useState('1h');
  const [durationLabel, setDurationLabel] = useState('30–60 minutes');
  const [outcome, setOutcome] = useState('skill');
  const [leavesSomethingBehind, setLeavesSomethingBehind] = useState(true);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
        category,
        timeContext,
        locationContext,
        socialContext,
        energyLevel,
        duration,
        durationLabel: durationLabel.trim() || '45 mins',
        outcomes: [outcome],
        leavesSomethingBehind: Boolean(leavesSomethingBehind),
        notes: notes.trim(),
        isFavorite: false,
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
          className="p-2 rounded-xl border border-[#F5E6EC] hover:bg-[#FFE5EF] text-[#6B5E66] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#2D262A] tracking-tight">
            Add Custom Activity
          </h1>
          <p className="text-xs text-[#6B5E66]">
            Enrich your personal library with what belongs in your life.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-200">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#FAD2E1] shadow-xs space-y-6">
        {/* Name */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-1.5">
            Activity Name *
          </label>
          <input
            id="create-name-input"
            type="text"
            placeholder="e.g., Practice nail art, Watercolor studies, Film club"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrorMsg('');
            }}
            required
            className="w-full text-sm px-4 py-2.5 rounded-xl border border-[#FAD2E1] focus:outline-hidden focus:ring-2 focus:ring-[#FF4D8D]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-1.5">
            Description
          </label>
          <textarea
            id="create-description-input"
            placeholder="What does doing this entail? What brings you joy in it?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full text-xs px-4 py-2.5 rounded-xl border border-[#FAD2E1] focus:outline-hidden focus:ring-2 focus:ring-[#FF4D8D]"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-2">
            Category
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: 'creative_make', label: 'Creative / Make' },
              { id: 'core_responsibility', label: 'Core Responsibility' },
              { id: 'life_experiences', label: 'Life & Experience' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  category === cat.id
                    ? 'bg-[#FF2E79] text-white border-[#FF2E79]'
                    : 'bg-[#FFF8FA] text-[#6B5E66] border-[#F5E6EC] hover:bg-[#FFE5EF]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Context Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Time Context */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-1.5">
              Time
            </label>
            <select
              id="create-time-select"
              value={timeContext}
              onChange={(e) => setTimeContext(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-[#FAD2E1] bg-white"
            >
              <option value="any">Day or Night</option>
              <option value="day">Day only</option>
              <option value="night">Night only</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-1.5">
              Location
            </label>
            <select
              id="create-location-select"
              value={locationContext}
              onChange={(e) => setLocationContext(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-[#FAD2E1] bg-white"
            >
              <option value="home">Home</option>
              <option value="outside">Outside</option>
              <option value="any">Anywhere</option>
            </select>
          </div>

          {/* Social */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-1.5">
              Social Setting
            </label>
            <select
              id="create-social-select"
              value={socialContext}
              onChange={(e) => setSocialContext(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-[#FAD2E1] bg-white"
            >
              <option value="alone">Solo</option>
              <option value="family">Family</option>
              <option value="friends">Friends</option>
              <option value="partner">Partner</option>
              <option value="group">Group</option>
            </select>
          </div>
        </div>

        {/* Energy & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-1.5">
              Energy Level
            </label>
            <select
              id="create-energy-select"
              value={energyLevel}
              onChange={(e) => setEnergyLevel(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-[#FAD2E1] bg-white"
            >
              <option value="low">Low Energy</option>
              <option value="moderate">Moderate Energy</option>
              <option value="high">High Energy</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-1.5">
              Duration Bucket
            </label>
            <select
              id="create-duration-select"
              value={duration}
              onChange={(e) => {
                setDuration(e.target.value);
                const labels = {
                  quick: '15–30 minutes',
                  '1h': '30–60 minutes',
                  '2h': '1–2 hours',
                  afternoon: '2+ hours',
                };
                setDurationLabel(labels[e.target.value] || '1 hour');
              }}
              className="w-full text-xs p-2.5 rounded-xl border border-[#FAD2E1] bg-white"
            >
              <option value="quick">15–30 minutes</option>
              <option value="1h">30–60 minutes</option>
              <option value="2h">1–2 hours</option>
              <option value="afternoon">2+ hours</option>
            </select>
          </div>
        </div>

        {/* Outcome & Leave Something Behind */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#FBF0F4]">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8A7983] block mb-1.5">
              Primary Outcome
            </label>
            <select
              id="create-outcome-select"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-[#FAD2E1] bg-white"
            >
              <option value="skill">Skill</option>
              <option value="artifact">Physical Artifact</option>
              <option value="digital-artifact">Digital Artifact</option>
              <option value="knowledge">Knowledge</option>
              <option value="experience">Experience</option>
              <option value="relaxation">Relaxation</option>
              <option value="connection">Connection</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl border border-[#FAD2E1] bg-[#FFF8FA]">
              <input
                id="create-leave-behind-checkbox"
                type="checkbox"
                checked={leavesSomethingBehind}
                onChange={(e) => setLeavesSomethingBehind(e.target.checked)}
                className="w-4 h-4 text-[#FF2E79] rounded-sm focus:ring-[#FF4D8D]"
              />
              <span className="text-xs font-bold text-[#2D262A]">
                Leaves something tangible behind
              </span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-3 border-t border-[#FBF0F4] flex justify-end gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 text-xs font-bold text-[#6B5E66] hover:text-[#2D262A] rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            id="submit-create-activity-btn"
            type="submit"
            className="px-6 py-2.5 bg-[#FF2E79] hover:bg-[#E01A63] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Save to Library</span>
          </button>
        </div>
      </form>
    </div>
  );
};
