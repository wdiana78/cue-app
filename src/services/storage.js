import { SEED_ACTIVITIES } from '../data/seedActivities.js';

const STORAGE_KEYS = {
  ACTIVITIES: 'cue_activities_v2',
  SWIPES: 'cue_swipes_v2',
  LOGS: 'cue_activity_logs_v2',
  PROJECTS: 'cue_projects_v2',
  REFLECTIONS: 'cue_reflections_v2',
  ACTIVE_COMMITMENT: 'cue_active_commitment_v2',
  OLLAMA_CONFIG: 'cue_ollama_config_v2',
};

// Simple subscription mechanism to notify components of local storage updates
const listeners = new Set();

function notifyListeners() {
  listeners.forEach((callback) => {
    try {
      callback();
    } catch (err) {
      console.error('Error notifying storage listener:', err);
    }
  });
}

export const StorageService = {
  /**
   * Subscribe to storage updates
   */
  subscribe(callback) {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  },

  // ----------------------------------------------------
  // ACTIVITIES (Sparks' authentic activity library)
  // ----------------------------------------------------
  getActivities() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (!raw) {
        localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(SEED_ACTIVITIES));
        return SEED_ACTIVITIES;
      }
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse activities from localStorage', e);
      return SEED_ACTIVITIES;
    }
  },

  getActivityById(id) {
    const list = this.getActivities();
    return list.find((a) => a.id === id) || null;
  },

  saveActivities(activities) {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    notifyListeners();
  },

  addActivity(activity) {
    const list = this.getActivities();
    const newActivity = {
      ...activity,
      id: activity.id || 'custom-' + Date.now(),
      isCustom: true,
      createdAt: new Date().toISOString(),
    };
    this.saveActivities([newActivity, ...list]);
    return newActivity;
  },

  updateActivity(activity) {
    const list = this.getActivities();
    const updated = list.map((a) => (a.id === activity.id ? { ...a, ...activity } : a));
    this.saveActivities(updated);
  },

  toggleFavorite(activityId) {
    const list = this.getActivities();
    const updated = list.map((a) => {
      if (a.id === activityId) {
        return { ...a, isFavorite: !a.isFavorite };
      }
      return a;
    });
    this.saveActivities(updated);
  },

  // ----------------------------------------------------
  // SWIPE HISTORY & CONTEXTUAL PREFERENCES
  // ----------------------------------------------------
  getSwipes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SWIPES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  recordSwipe({
    activityId,
    activityName,
    direction,
    context = {},
    reason = '',
    notes = '',
    isPermanentDislike = false,
  }) {
    const swipeEvent = {
      id: 'sw-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      activityId,
      activityName,
      direction, // 'right' or 'left'
      timestamp: new Date().toISOString(),
      timeContext: context.timeContext || 'day',
      locationContext: context.locationContext || 'home',
      socialContext: context.socialContext || 'alone',
      energyLevel: context.energyLevel || 'moderate',
      reason,
      notes,
      isPermanentDislike: isPermanentDislike || reason === 'Not my thing',
    };

    const current = this.getSwipes();
    const updated = [swipeEvent, ...current];
    localStorage.setItem(STORAGE_KEYS.SWIPES, JSON.stringify(updated));

    // If swiped right, also ensure activity is marked or known
    notifyListeners();
    return swipeEvent;
  },

  clearSwipes() {
    localStorage.setItem(STORAGE_KEYS.SWIPES, JSON.stringify([]));
    notifyListeners();
  },

  // ----------------------------------------------------
  // ACTIVITY COMPLETIONS & FEEDBACK HISTORY
  // ----------------------------------------------------
  getLogs() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  recordLog({
    activityId,
    activityName,
    status, // 'done', 'didnt_happen', 'changed_mind'
    feedback = null, // 'loved', 'good', 'fine', 'not_really', 'never_again'
    notes = '',
  }) {
    const logItem = {
      id: 'log-' + Date.now(),
      activityId,
      activityName,
      timestamp: new Date().toISOString(),
      status,
      feedback,
      notes,
    };

    const current = this.getLogs();
    const updated = [logItem, ...current];
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));

    // Also update activity's last completed date if status is done
    if (status === 'done') {
      const activities = this.getActivities();
      const actIndex = activities.findIndex((a) => a.id === activityId);
      if (actIndex !== -1) {
        activities[actIndex].lastCompletedDate = new Date().toISOString();
        this.saveActivities(activities);
      }
    }

    notifyListeners();
    return logItem;
  },

  // ----------------------------------------------------
  // ACTIVE COMMITMENT ("I'll do this")
  // ----------------------------------------------------
  getActiveCommitment() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_COMMITMENT);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setActiveCommitment(activity, projectId = null) {
    const commitment = {
      activityId: typeof activity === 'object' ? activity.id : activity,
      activityName: typeof activity === 'object' ? activity.name : 'Activity',
      startedAt: new Date().toISOString(),
      projectLinkedId: projectId,
    };
    localStorage.setItem(STORAGE_KEYS.ACTIVE_COMMITMENT, JSON.stringify(commitment));
    notifyListeners();
  },

  clearActiveCommitment() {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_COMMITMENT);
    notifyListeners();
  },

  // ----------------------------------------------------
  // PROJECTS (Starts strictly empty: 0 fake projects)
  // ----------------------------------------------------
  getProjects() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      // Clean slate: empty array initially
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveProjects(projects) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    notifyListeners();
  },

  addProject({
    title,
    description = '',
    category = 'creative',
    linkedActivityId = null,
    currentStep = '',
  }) {
    const newProject = {
      id: 'proj-' + Date.now(),
      title,
      description,
      category,
      status: 'in_progress', // 'in_progress' or 'completed'
      linkedActivityId,
      currentStep,
      sessionsCount: 0,
      createdAt: new Date().toISOString(),
      lastWorkedOn: null,
    };
    const current = this.getProjects();
    this.saveProjects([newProject, ...current]);
    return newProject;
  },

  updateProject(id, updates) {
    const current = this.getProjects();
    const updated = current.map((p) => (p.id === id ? { ...p, ...updates } : p));
    this.saveProjects(updated);
  },

  incrementProjectSession(id) {
    const current = this.getProjects();
    const updated = current.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          sessionsCount: (p.sessionsCount || 0) + 1,
          lastWorkedOn: new Date().toISOString(),
        };
      }
      return p;
    });
    this.saveProjects(updated);
  },

  deleteProject(id) {
    const current = this.getProjects();
    this.saveProjects(current.filter((p) => p.id !== id));
  },

  // ----------------------------------------------------
  // REFLECTIONS (Starts strictly empty: 0 fake reflections)
  // ----------------------------------------------------
  getReflections() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REFLECTIONS);
      // Clean slate: empty array initially
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  addReflection({ prompt, content, mood = 'peaceful', tags = [] }) {
    const newEntry = {
      id: 'ref-' + Date.now(),
      date: new Date().toISOString(),
      prompt,
      content,
      mood,
      tags,
    };
    const current = this.getReflections();
    const updated = [newEntry, ...current];
    localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(updated));
    notifyListeners();
    return newEntry;
  },

  deleteReflection(id) {
    const current = this.getReflections();
    const updated = current.filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(updated));
    notifyListeners();
  },

  // ----------------------------------------------------
  // RESET / CLEAN SLATE
  // ----------------------------------------------------
  resetToCleanState() {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(SEED_ACTIVITIES));
    localStorage.setItem(STORAGE_KEYS.SWIPES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify([]));
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_COMMITMENT);
    notifyListeners();
  },
};
