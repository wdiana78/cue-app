/**
 * recommendationEngine.js
 * 
 * Transparent, deterministic scoring engine for Cue.
 * Operates with STRICT HARD CONSTRAINTS before any ranking occurs.
 * 
 * If an activity is incompatible with the user's current situation
 * (e.g. requires people when user is alone, or requires outside when user is home),
 * it is REMOVED from the candidate pool completely.
 * 
 * Best Match, Different Direction, and Wildcard ALL obey these hard constraints.
 */

import { TOP_LEVEL_CATEGORIES } from '../data/categories.js';

/**
 * Check whether an activity meets the user's non-negotiable hard constraints.
 * Returns { valid: boolean, reason?: string }
 */
export function checkHardConstraints(activity, criteria) {
  const contexts = activity.contexts || {
    timeOfDay: [activity.timeContext || 'any'],
    location: [activity.locationContext || 'any'],
    social: [activity.socialContext || 'any'],
  };

  const actSocial = contexts.social || ['any'];
  const actLocation = contexts.location || ['any'];
  const actTime = contexts.timeOfDay || ['any'];
  const actDurations = activity.durations || [activity.duration || '1h'];
  const actEnergies = activity.energyLevels || [activity.energyLevel || 'moderate'];

  // ------------------------------------------------------------------
  // 1. SOCIAL HARD CONSTRAINT
  // ------------------------------------------------------------------
  // If user is 'alone' / 'solo', activities requiring other people
  // (e.g. 'friends', 'group', 'partner' without 'solo'/'alone'/'any') MUST BE EXCLUDED!
  if (criteria.socialContext === 'alone' || criteria.socialContext === 'solo') {
    const allowsSolo =
      actSocial.includes('solo') ||
      actSocial.includes('alone') ||
      actSocial.includes('any');
    if (!allowsSolo) {
      return { valid: false, reason: 'Requires other people (social/group only)' };
    }
  } else if (criteria.socialContext === 'friends') {
    const allowsFriends =
      actSocial.includes('friends') ||
      actSocial.includes('group') ||
      actSocial.includes('any') ||
      actSocial.includes('partner');
    if (!allowsFriends) {
      return { valid: false, reason: 'Does not fit friends/social group' };
    }
  } else if (criteria.socialContext === 'family') {
    const allowsFamily =
      actSocial.includes('family') ||
      actSocial.includes('group') ||
      actSocial.includes('any');
    if (!allowsFamily) {
      return { valid: false, reason: 'Does not fit family setting' };
    }
  }

  // ------------------------------------------------------------------
  // 2. LOCATION HARD CONSTRAINT
  // ------------------------------------------------------------------
  // If user is at 'home', exclude activities that inherently require being 'outside'!
  if (criteria.locationContext === 'home') {
    const allowsHome = actLocation.includes('home') || actLocation.includes('any');
    if (!allowsHome) {
      return { valid: false, reason: 'Requires being outside/out' };
    }
  } else if (criteria.locationContext === 'outside') {
    const allowsOutside = actLocation.includes('outside') || actLocation.includes('any');
    if (!allowsOutside) {
      return { valid: false, reason: 'Requires being at home' };
    }
  }

  // ------------------------------------------------------------------
  // 3. DURATION HARD CONSTRAINT
  // ------------------------------------------------------------------
  // If user has 'quick' (under 45m), strictly exclude activities requiring 2+ hours or half day
  if (criteria.duration === 'quick') {
    const strictlyLong = actDurations.every((d) => d === '2h' || d === 'afternoon');
    if (strictlyLong) {
      return { valid: false, reason: 'Requires 2+ hours or full afternoon' };
    }
  } else if (criteria.duration === '1h') {
    // If user has 1 hour, exclude activities that strictly require a half-day or afternoon
    const strictlyAfternoon = actDurations.every((d) => d === 'afternoon');
    if (strictlyAfternoon) {
      return { valid: false, reason: 'Requires an entire afternoon / half-day' };
    }
  }

  // ------------------------------------------------------------------
  // 4. ENERGY HARD CONSTRAINT
  // ------------------------------------------------------------------
  // If user has 'low' energy, strictly exclude high-intensity activities (heavy lifting, intense cardio)
  if (criteria.energyLevel === 'low') {
    const strictlyHigh = actEnergies.every((e) => e === 'high');
    if (strictlyHigh) {
      return { valid: false, reason: 'Requires high energy/strenuous effort' };
    }
  }

  // ------------------------------------------------------------------
  // 5. LEAVE SOMETHING BEHIND CONSTRAINT
  // ------------------------------------------------------------------
  if (criteria.leaveSomethingBehind === 'yes') {
    if (!activity.leavesSomethingBehind) {
      return { valid: false, reason: 'Does not produce an artifact or lasting work' };
    }
  }

  return { valid: true };
}

/**
 * Score an individual activity against context criteria, intention,
 * multi-level swipe history, and completion feedback.
 * Precondition: The activity has already passed checkHardConstraints!
 */
export function scoreActivity(activity, criteria, swipes = [], logs = []) {
  let score = 0;
  const reasons = [];

  const contexts = activity.contexts || {
    timeOfDay: [activity.timeContext || 'any'],
    location: [activity.locationContext || 'any'],
    social: [activity.socialContext || 'any'],
  };

  // ----------------------------------------------------
  // 1. TIME OF DAY FIT (day / night)
  // ----------------------------------------------------
  const actTime = contexts.timeOfDay || ['any'];
  if (actTime.includes(criteria.timeContext)) {
    score += 25;
    reasons.push(`Ideal for ${criteria.timeContext}time`);
  } else if (actTime.includes('any')) {
    score += 15;
  } else {
    score -= 10;
  }

  // ----------------------------------------------------
  // 2. LOCATION PREFERENCE
  // ----------------------------------------------------
  const actLoc = contexts.location || ['any'];
  if (actLoc.includes(criteria.locationContext)) {
    score += 20;
    reasons.push(criteria.locationContext === 'home' ? 'At home comfort' : 'Outside in fresh air');
  }

  // ----------------------------------------------------
  // 3. SOCIAL FIT
  // ----------------------------------------------------
  const actSocial = contexts.social || ['any'];
  if (actSocial.includes(criteria.socialContext)) {
    score += 20;
    reasons.push(criteria.socialContext === 'alone' || criteria.socialContext === 'solo' ? 'Perfect for solo time' : 'Suits your company');
  }

  // ----------------------------------------------------
  // 4. ENERGY LEVEL FIT
  // ----------------------------------------------------
  const actEnergies = activity.energyLevels || [activity.energyLevel || 'moderate'];
  if (actEnergies.includes(criteria.energyLevel)) {
    score += 20;
    reasons.push(`Matches ${criteria.energyLevel} energy`);
  } else {
    score += 5;
  }

  // ----------------------------------------------------
  // 5. DURATION FIT
  // ----------------------------------------------------
  const actDurations = activity.durations || [activity.duration || '1h'];
  if (actDurations.includes(criteria.duration)) {
    score += 15;
    reasons.push('Fits your time window');
  }

  // ----------------------------------------------------
  // 6. INTENTION MATCH
  // ----------------------------------------------------
  const outcomes = activity.outcomes || [];

  if (criteria.intent === 'create') {
    if (
      activity.subcategory === 'CREATIVE / MAKE' ||
      activity.leavesSomethingBehind ||
      outcomes.includes('artifact') ||
      outcomes.includes('digital-artifact')
    ) {
      score += 40;
      reasons.push('Leaves something tangible behind');
    }
  } else if (criteria.intent === 'develop') {
    if (
      activity.topLevelCategory === TOP_LEVEL_CATEGORIES.CORE ||
      activity.skillBuilding ||
      outcomes.includes('skill') ||
      outcomes.includes('knowledge')
    ) {
      score += 40;
      reasons.push('Builds capability & mastery');
    }
  } else if (criteria.intent === 'reflect') {
    if (
      activity.subcategory === 'Personal reflection & inner work' ||
      outcomes.includes('clarity') ||
      outcomes.includes('peace') ||
      outcomes.includes('relaxation')
    ) {
      score += 40;
      reasons.push('Nourishing & contemplative');
    }
  } else if (criteria.intent === 'connect') {
    if (
      activity.topLevelCategory === TOP_LEVEL_CATEGORIES.LIFE ||
      outcomes.includes('connection') ||
      outcomes.includes('warmth') ||
      outcomes.includes('memory')
    ) {
      score += 35;
      reasons.push('Deepens connection');
    }
  } else if (criteria.intent === 'entertain') {
    if (
      activity.subcategory === 'FILM, MUSIC & STORIES' ||
      activity.subcategory === 'SOCIAL & NIGHTLIFE' ||
      outcomes.includes('entertainment')
    ) {
      score += 35;
      reasons.push('Engaging entertainment');
    }
  } else if (criteria.intent === 'rest') {
    if (
      activity.subcategory === 'REST & IDLE TIME' ||
      outcomes.includes('relaxation') ||
      outcomes.includes('peace')
    ) {
      score += 45;
      reasons.push('Guilt-free restorative rest');
    }
  } else if (criteria.intent === 'surprise') {
    // Random spark bonus
    score += Math.floor(Math.random() * 25);
    reasons.push('Unexpected spark');
  }

  // ----------------------------------------------------
  // 7. FAVORITE BONUS
  // ----------------------------------------------------
  if (activity.favorite || activity.isFavorite) {
    score += 15;
    reasons.push('One of your favorites');
  }

  // ----------------------------------------------------
  // 8. SWIPE PREFERENCE LEARNING
  // ----------------------------------------------------
  // Exact activity swipes
  const actSwipes = swipes.filter((s) => s.activityId === activity.id);
  actSwipes.forEach((s) => {
    if (s.direction === 'right') score += 15;
    if (s.direction === 'left') {
      if (s.isPermanentDislike) score -= 50;
      else score -= 15;
    }
  });

  // Subcategory affinity bonus
  if (activity.subcategory) {
    const subSwipes = swipes.filter((s) => s.subcategory === activity.subcategory);
    const rights = subSwipes.filter((s) => s.direction === 'right').length;
    if (subSwipes.length >= 2) {
      const ratio = rights / subSwipes.length;
      if (ratio > 0.7) {
        score += 20;
        reasons.push(`High affinity for ${activity.subcategory}`);
      } else if (ratio < 0.25) {
        score -= 20;
      }
    }
  }

  // ----------------------------------------------------
  // 9. COMPLETION FEEDBACK
  // ----------------------------------------------------
  const actLogs = logs.filter((l) => l.activityId === activity.id);
  actLogs.forEach((l) => {
    if (l.feedback === 'loved') {
      score += 20;
      reasons.push('You loved doing this recently');
    } else if (l.feedback === 'not_really') {
      score -= 25;
    }
  });

  return {
    activity,
    score,
    reasons: reasons.slice(0, 3),
  };
}

/**
 * Generate 3 distinct recommendations:
 * 1. BEST MATCH: Highest contextual + personal fit
 * 2. DIFFERENT DIRECTION: Different subcategory/category, but still appropriate to context
 * 3. WILDCARD: Something less obvious but still compatible
 * 
 * ALL 3 MUST STRICTLY OBEY HARD CONSTRAINTS!
 */
export function getRecommendations(activities, criteria, swipes = [], logs = []) {
  if (!activities || activities.length === 0) {
    return null;
  }

  // STEP 1: HARD CONSTRAINTS FILTERING FIRST!
  // Remove any activity that violates social, location, duration, or energy constraints.
  let validCandidates = activities.filter((act) => {
    const check = checkHardConstraints(act, criteria);
    return check.valid;
  });

  // Fallback guardrail: If the user specified constraints that left fewer than 3 candidates,
  // we do NOT relax social (alone vs group) or location (home vs outside) because those are strict physical realities.
  // Instead, if needed, we allow adjacent durations or energies.
  if (validCandidates.length < 3) {
    const relaxedCriteria = { ...criteria, duration: 'any' };
    const secondPass = activities.filter((act) => {
      // Still strictly enforce social and location!
      const socLocCheck = checkHardConstraints(act, {
        ...relaxedCriteria,
        energyLevel: 'moderate',
      });
      return socLocCheck.valid;
    });
    if (secondPass.length >= validCandidates.length) {
      validCandidates = secondPass;
    }
  }

  // If still empty (e.g. database has 0 items), return null
  if (validCandidates.length === 0) {
    return null;
  }

  // STEP 2: SCORE ALL VALID CANDIDATES
  const scored = validCandidates.map((act) => scoreActivity(act, criteria, swipes, logs));

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // 1. BEST MATCH: Highest scored valid candidate
  const bestMatch = scored[0];

  // 2. DIFFERENT DIRECTION:
  // Must be drawn STRICTLY from valid candidates!
  // Different subcategory or category from bestMatch.
  const diffCandidates = scored.slice(1).filter((item) => {
    return (
      item.activity.id !== bestMatch.activity.id &&
      (item.activity.subcategory !== bestMatch.activity.subcategory ||
       item.activity.topLevelCategory !== bestMatch.activity.topLevelCategory)
    );
  });

  const differentDirection =
    diffCandidates[0] ||
    scored.slice(1).find((i) => i.activity.id !== bestMatch.activity.id) ||
    scored[0];

  // 3. WILDCARD:
  // Must be drawn STRICTLY from valid candidates!
  // Distinct from bestMatch and differentDirection.
  const wildcardCandidates = scored.slice(1).filter((item) => {
    return (
      item.activity.id !== bestMatch.activity.id &&
      item.activity.id !== differentDirection.activity.id
    );
  });

  // Pick a fresh candidate from top alternatives or random from wildcard candidates
  const wildcard =
    wildcardCandidates[Math.floor(Math.random() * Math.min(3, wildcardCandidates.length))] ||
    wildcardCandidates[0] ||
    differentDirection ||
    bestMatch;

  return {
    bestMatch: {
      ...bestMatch.activity,
      matchReason: bestMatch.reasons.join(' · ') || 'Top contextual fit for your current situation',
      score: bestMatch.score,
    },
    differentDirection: {
      ...differentDirection.activity,
      matchReason: differentDirection.reasons.join(' · ') || 'A fresh, distinct direction that fits your conditions',
      score: differentDirection.score,
    },
    wildcard: {
      ...wildcard.activity,
      matchReason: wildcard.reasons.join(' · ') || 'An unexpected choice that matches your situation',
      score: wildcard.score,
    },
  };
}
