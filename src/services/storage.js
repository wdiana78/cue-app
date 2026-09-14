import { SEED_ACTIVITIES } from '../data/seedActivities.js';
import { TOP_LEVEL_CATEGORIES } from '../data/categories.js';

const STORAGE_KEYS = {
  ACTIVITIES: 'cue_activities_v3',
  SWIPES: 'cue_swipes_v3',
  LOGS: 'cue_activity_logs_v3',
  PROJECTS: 'cue_projects_v3',
  REFLECTIONS: 'cue_reflections_v3',
  ACTIVE_COMMITMENT: 'cue_active_commitment_v3',
  SELECTED_PLAN: 'cue_selected_plan_v4',
  PLANS_LIST: 'cue_plans_list_v5',
  OLLAMA_CONFIG: 'cue_ollama_config_v3',
};

// Safe storage wrapper (falls back to memory if localStorage is unavailable)
const memStorage = new Map();
const safeStorage = {
  getItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {}
    return memStorage.get(key) || null;
  },
  setItem: (key, value) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, String(value));
        return;
      }
    } catch {}
    memStorage.set(key, String(value));
  },
  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch {}
    memStorage.delete(key);
  },
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
      const raw = safeStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (!raw) {
        safeStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(SEED_ACTIVITIES));
        return SEED_ACTIVITIES;
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0 || !parsed[0].topLevelCategory) {
        safeStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(SEED_ACTIVITIES));
        return SEED_ACTIVITIES;
      }
      return parsed;
    } catch (e) {
      console.error('Failed to parse activities from storage', e);
      return SEED_ACTIVITIES;
    }
  },

  getActivityById(id) {
    const list = this.getActivities();
    return list.find((a) => a.id === id) || null;
  },

  saveActivities(activities) {
    safeStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    notifyListeners();
  },

  addActivity(activity) {
    const list = this.getActivities();
    const newActivity = {
      ...activity,
      id: activity.id || 'custom-' + Date.now(),
      isCustom: true,
      topLevelCategory: activity.topLevelCategory || TOP_LEVEL_CATEGORIES.LIFE,
      subcategory: activity.subcategory || 'CREATIVE / MAKE',
      contexts: activity.contexts || {
        timeOfDay: ['day', 'night'],
        location: ['home'],
        social: ['solo'],
      },
      energyLevels: activity.energyLevels || ['moderate'],
      durations: activity.durations || ['1h'],
      outcomes: activity.outcomes || ['experience'],
      requiresMaterials: Boolean(activity.requiresMaterials),
      potentiallySellable: Boolean(activity.potentiallySellable),
      skillBuilding: Boolean(activity.skillBuilding),
      leavesSomethingBehind: Boolean(activity.leavesSomethingBehind),
      favorite: false,
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
        const isFav = a.favorite !== undefined ? !a.favorite : !a.isFavorite;
        return { ...a, favorite: isFav, isFavorite: isFav };
      }
      return a;
    });
    this.saveActivities(updated);
  },

  // ----------------------------------------------------
  // SWIPE HISTORY & MULTI-LEVEL PREFERENCE LEARNING
  // ----------------------------------------------------
  getSwipes() {
    try {
      const raw = safeStorage.getItem(STORAGE_KEYS.SWIPES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  recordSwipe({
    activityId,
    activityName,
    topLevelCategory,
    subcategory,
    direction,
    context = {},
    reason = '',
    notes = '',
    isPermanentDislike = false,
  }) {
    const activity = this.getActivityById(activityId);
    const resolvedTop = topLevelCategory || (activity ? activity.topLevelCategory : null);
    const resolvedSub = subcategory || (activity ? activity.subcategory : null);

    const swipeEvent = {
      id: 'sw-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      activityId,
      activityName: activityName || (activity ? activity.name : 'Unknown'),
      topLevelCategory: resolvedTop,
      subcategory: resolvedSub,
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
    safeStorage.setItem(STORAGE_KEYS.SWIPES, JSON.stringify(updated));

    notifyListeners();
    return swipeEvent;
  },

  clearSwipes() {
    safeStorage.setItem(STORAGE_KEYS.SWIPES, JSON.stringify([]));
    notifyListeners();
  },

  getLearnedPreferences() {
    const swipes = this.getSwipes();
    const logs = this.getLogs();

    // 1. Top-Level Affinities
    const topLevelStats = {
      [TOP_LEVEL_CATEGORIES.CORE]: { right: 0, total: 0 },
      [TOP_LEVEL_CATEGORIES.LIFE]: { right: 0, total: 0 },
    };

    // 2. Subcategory Affinities
    const subcategoryStats = {};

    swipes.forEach((s) => {
      if (s.topLevelCategory && topLevelStats[s.topLevelCategory]) {
        topLevelStats[s.topLevelCategory].total += 1;
        if (s.direction === 'right') {
          topLevelStats[s.topLevelCategory].right += 1;
        }
      }

      if (s.subcategory) {
        if (!subcategoryStats[s.subcategory]) {
          subcategoryStats[s.subcategory] = { right: 0, total: 0, topLevel: s.topLevelCategory };
        }
        subcategoryStats[s.subcategory].total += 1;
        if (s.direction === 'right') {
          subcategoryStats[s.subcategory].right += 1;
        }
      }
    });

    const subcategoryList = Object.entries(subcategoryStats).map(([name, stats]) => ({
      name,
      topLevel: stats.topLevel,
      right: stats.right,
      total: stats.total,
      affinityRatio: stats.total > 0 ? stats.right / stats.total : 0,
    }));

    subcategoryList.sort((a, b) => {
      if (b.affinityRatio !== a.affinityRatio) {
        return b.affinityRatio - a.affinityRatio;
      }
      return b.right - a.right;
    });

    return {
      topLevelStats,
      subcategoryAffinity: subcategoryList,
      totalSwipes: swipes.length,
      lovedCompletions: logs.filter((l) => l.feedback === 'loved').length,
    };
  },

  // ----------------------------------------------------
  // ACTIVITY COMPLETIONS & FEEDBACK HISTORY
  // ----------------------------------------------------
  getLogs() {
    try {
      const raw = safeStorage.getItem(STORAGE_KEYS.LOGS);
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
    const activity = this.getActivityById(activityId);
    const logItem = {
      id: 'log-' + Date.now(),
      activityId,
      activityName: activityName || (activity ? activity.name : 'Unknown'),
      topLevelCategory: activity ? activity.topLevelCategory : null,
      subcategory: activity ? activity.subcategory : null,
      timestamp: new Date().toISOString(),
      status: status || 'done',
      feedback,
      notes,
    };

    const current = this.getLogs();
    const updated = [logItem, ...current];
    safeStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));

    if (feedback === 'loved' && activity) {
      const activities = this.getActivities();
      const target = activities.find((a) => a.id === activity.id);
      if (target && !target.favorite && !target.isFavorite) {
        target.favorite = true;
        target.isFavorite = true;
        this.saveActivities(activities);
      }
    }

    notifyListeners();
    return logItem;
  },

  // ----------------------------------------------------
  // MY PLAN ("Sparks' Chosen Activity Flow: Pending, In Progress, Completed")
  // ----------------------------------------------------
  getPlans() {
    try {
      const raw = safeStorage.getItem(STORAGE_KEYS.PLANS_LIST);
      let list = [];
      if (raw) {
        list = JSON.parse(raw);
      } else {
        // Check if there is an existing single plan from legacy storage
        const legacy = safeStorage.getItem(STORAGE_KEYS.SELECTED_PLAN);
        if (legacy) {
          const parsed = JSON.parse(legacy);
          if (parsed && parsed.activityId) {
            const fresh = this.getActivityById(parsed.activityId) || parsed.activity;
            list = [{
              ...parsed,
              activity: fresh,
              status: parsed.status === 'in_progress' ? 'in_progress' : 'pending',
            }];
            safeStorage.setItem(STORAGE_KEYS.PLANS_LIST, JSON.stringify(list));
          }
        }
      }

      // Ensure fresh activity data and backward-compatibility
      return list.map((p) => {
        const fresh = this.getActivityById(p.activityId) || p.activity;
        return {
          ...p,
          status: p.status === 'selected' ? 'pending' : (p.status || 'pending'),
          activity: fresh,
        };
      });
    } catch {
      return [];
    }
  },

  savePlans(plans) {
    safeStorage.setItem(STORAGE_KEYS.PLANS_LIST, JSON.stringify(plans));
    // Keep legacy single SELECTED_PLAN in sync for any quick readers
    const active = plans.find((p) => p.status === 'in_progress') || plans.find((p) => p.status === 'pending');
    if (active) {
      safeStorage.setItem(STORAGE_KEYS.SELECTED_PLAN, JSON.stringify(active));
    } else {
      safeStorage.removeItem(STORAGE_KEYS.SELECTED_PLAN);
    }
    notifyListeners();
  },

  getPlanById(id) {
    const plans = this.getPlans();
    return plans.find((p) => p.id === id) || null;
  },

  addPlan(activity, targetTime = null) {
    if (!activity) return null;
    const act = typeof activity === 'string' ? this.getActivityById(activity) : activity;
    if (!act) return null;

    const currentHour = new Date().getHours();
    const defaultTime = currentHour >= 18 || currentHour < 5 ? 'Tonight' : 'Today';

    const currentPlans = this.getPlans();
    // Check if this activity is already pending or in progress
    const existing = currentPlans.find(
      (p) => p.activityId === act.id && (p.status === 'pending' || p.status === 'in_progress')
    );
    if (existing) {
      return existing;
    }

    const newPlan = {
      id: 'plan-' + Date.now(),
      activityId: act.id,
      activity: act,
      selectedAt: new Date().toISOString(),
      targetTime: targetTime || defaultTime,
      status: 'pending', // 'pending' | 'in_progress' | 'completed'
      startedAt: null,
      completedAt: null,
      notes: '',
      feedback: null,
    };

    const updated = [newPlan, ...currentPlans];
    this.savePlans(updated);
    this.setActiveCommitment(act);
    return newPlan;
  },

  getSelectedPlan() {
    const plans = this.getPlans();
    // Prefer in_progress, then first pending
    const inProgress = plans.find((p) => p.status === 'in_progress');
    if (inProgress) return inProgress;
    const pending = plans.find((p) => p.status === 'pending');
    if (pending) return pending;
    return null;
  },

  setSelectedPlan(activity, targetTime = null) {
    return this.addPlan(activity, targetTime);
  },

  startPlan(planId = null) {
    const plans = this.getPlans();
    let target = null;
    if (planId) {
      target = plans.find((p) => p.id === planId);
    } else {
      target = plans.find((p) => p.status === 'in_progress') || plans.find((p) => p.status === 'pending');
    }

    if (!target) return null;

    const updated = plans.map((p) => {
      if (p.id === target.id) {
        return {
          ...p,
          status: 'in_progress',
          startedAt: p.startedAt || new Date().toISOString(),
        };
      }
      return p;
    });

    this.savePlans(updated);
    const active = updated.find((p) => p.id === target.id);
    return active;
  },

  completePlan(planIdOrOptions = null, options = {}) {
    let planId = null;
    let feedback = 'loved';
    let notes = '';

    if (typeof planIdOrOptions === 'string') {
      planId = planIdOrOptions;
      if (options.feedback) feedback = options.feedback;
      if (options.notes) notes = options.notes;
    } else if (typeof planIdOrOptions === 'object' && planIdOrOptions !== null) {
      if (planIdOrOptions.feedback) feedback = planIdOrOptions.feedback;
      if (planIdOrOptions.notes) notes = planIdOrOptions.notes;
    }

    const plans = this.getPlans();
    let target = null;
    if (planId) {
      target = plans.find((p) => p.id === planId);
    } else {
      target = plans.find((p) => p.status === 'in_progress') || plans.find((p) => p.status === 'pending');
    }

    if (!target) return null;

    // Record into log history
    const log = this.recordLog({
      activityId: target.activityId,
      activityName: target.activity?.name || 'Activity',
      status: 'done',
      feedback,
      notes,
    });

    const completedAt = new Date().toISOString();
    const updated = plans.map((p) => {
      if (p.id === target.id) {
        return {
          ...p,
          status: 'completed',
          completedAt,
          feedback,
          notes,
        };
      }
      return p;
    });

    this.savePlans(updated);
    this.clearActiveCommitment();
    return log;
  },

  removePlan(planId) {
    const plans = this.getPlans();
    const updated = plans.filter((p) => p.id !== planId);
    this.savePlans(updated);
  },

  clearCompletedPlans() {
    const plans = this.getPlans();
    const updated = plans.filter((p) => p.status !== 'completed');
    this.savePlans(updated);
  },

  clearSelectedPlan(planId = null) {
    if (planId) {
      this.removePlan(planId);
      return;
    }
    const plans = this.getPlans();
    const target = plans.find((p) => p.status === 'in_progress') || plans.find((p) => p.status === 'pending');
    if (target) {
      this.removePlan(target.id);
    } else {
      safeStorage.removeItem(STORAGE_KEYS.SELECTED_PLAN);
      notifyListeners();
    }
    this.clearActiveCommitment();
  },

  // ----------------------------------------------------
  // ACTIVE COMMITMENT ("I'll do this" legacy sync)
  // ----------------------------------------------------
  getActiveCommitment() {
    try {
      const raw = safeStorage.getItem(STORAGE_KEYS.ACTIVE_COMMITMENT);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setActiveCommitment(activity, projectId = null) {
    const actId = typeof activity === 'object' ? activity.id : activity;
    const actName = typeof activity === 'object' ? activity.name : 'Activity';
    const commitment = {
      activityId: actId,
      activityName: actName,
      startedAt: new Date().toISOString(),
      projectLinkedId: projectId,
    };
    safeStorage.setItem(STORAGE_KEYS.ACTIVE_COMMITMENT, JSON.stringify(commitment));
    notifyListeners();
  },

  clearActiveCommitment() {
    safeStorage.removeItem(STORAGE_KEYS.ACTIVE_COMMITMENT);
    notifyListeners();
  },

  // ----------------------------------------------------
  // PROJECTS (Starts strictly empty: 0 fake projects)
  // ----------------------------------------------------
  getProjects() {
    try {
      const raw = safeStorage.getItem(STORAGE_KEYS.PROJECTS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveProjects(projects) {
    safeStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    notifyListeners();
  },

  addProject({
    title,
    description = '',
    subcategory = 'CREATIVE / MAKE',
    topLevelCategory = TOP_LEVEL_CATEGORIES.LIFE,
    linkedActivityId = null,
    currentStep = '',
    tangibleOutcome = '',
    steps = [],
  }) {
    const newProject = {
      id: 'proj-' + Date.now(),
      title,
      description,
      subcategory,
      topLevelCategory,
      status: 'in_progress',
      linkedActivityId,
      currentStep: currentStep || (steps.length > 0 ? steps[0].text : ''),
      tangibleOutcome,
      steps: steps.length > 0 ? steps : [
        { id: `s-${Date.now()}-1`, text: 'Plan outline and gather materials', completed: false },
        { id: `s-${Date.now()}-2`, text: 'Focused execution session', completed: false },
        { id: `s-${Date.now()}-3`, text: 'Finalize and refine artifact', completed: false },
      ],
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

  deleteProject(id) {
    const current = this.getProjects();
    this.saveProjects(current.filter((p) => p.id !== id));
  },

  // ----------------------------------------------------
  // REFLECTIONS (Starts strictly empty: 0 fake reflections)
  // ----------------------------------------------------
  getReflections() {
    try {
      const raw = safeStorage.getItem(STORAGE_KEYS.REFLECTIONS);
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
    safeStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(updated));
    notifyListeners();
    return newEntry;
  },

  deleteReflection(id) {
    const current = this.getReflections();
    const updated = current.filter((r) => r.id !== id);
    safeStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(updated));
    notifyListeners();
  },

  // ----------------------------------------------------
  // RESET TO CLEAN SAMPLE SEED
  // ----------------------------------------------------
  resetToCleanState() {
    safeStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(SEED_ACTIVITIES));
    safeStorage.setItem(STORAGE_KEYS.SWIPES, JSON.stringify([]));
    safeStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([]));
    safeStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify([]));
    safeStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify([]));
    safeStorage.removeItem(STORAGE_KEYS.ACTIVE_COMMITMENT);
    safeStorage.removeItem(STORAGE_KEYS.SELECTED_PLAN);
    safeStorage.removeItem(STORAGE_KEYS.PLANS_LIST);
    notifyListeners();
  },

  resetToSeed() {
    safeStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(SEED_ACTIVITIES));
    notifyListeners();
  },
};
