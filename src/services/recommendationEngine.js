/**
 * recommendationEngine.js
 * 
 * A transparent, deterministic scoring engine for Cue.
 * Calculates recommendations based on Sparks' current context, intention,
 * leave-something-behind preference, swipe history, and completion feedback.
 * 
 * Formula:
 *   score = contextMatch + socialMatch + energyMatch + durationMatch 
 *         + intentionMatch + outcomeMatch + personalPreference + noveltyBonus 
 *         - recentActivityPenalty
 */

/**
 * Score an individual activity against user criteria
 */
export function scoreActivity(activity, criteria, swipes = [], logs = []) {
  let score = 0;
  const reasons = [];

  // ----------------------------------------------------
  // 1. TIME OF DAY MATCH (Day vs. Night)
  // ----------------------------------------------------
  if (activity.timeContext === 'any' || activity.timeContext === criteria.timeContext) {
    score += 20;
    if (activity.timeContext === criteria.timeContext) {
      reasons.push(`Perfect for ${criteria.timeContext}time`);
    }
  } else {
    // Soft mismatch penalty (e.g. asking for night and activity is day-only)
    score -= 15;
  }

  // ----------------------------------------------------
  // 2. LOCATION MATCH (Home vs. Outside)
  // ----------------------------------------------------
  if (activity.locationContext === 'any' || activity.locationContext === criteria.locationContext) {
    score += 20;
    if (activity.locationContext === criteria.locationContext) {
      reasons.push(`Suits staying ${criteria.locationContext}`);
    }
  } else {
    // Definite mismatch (e.g. you're at home, but activity is gym/outside)
    score -= 30;
  }

  // ----------------------------------------------------
  // 3. SOCIAL CONTEXT MATCH (Alone, Friends, Partner, etc.)
  // ----------------------------------------------------
  if (activity.socialContext === 'any' || activity.socialContext === criteria.socialContext) {
    score += 15;
    if (activity.socialContext === criteria.socialContext) {
      reasons.push(`Fits your ${criteria.socialContext} vibe`);
    }
  } else if (criteria.socialContext === 'alone' && activity.socialContext !== 'alone') {
    // You want solo time, but activity requires group
    score -= 20;
  }

  // ----------------------------------------------------
  // 4. ENERGY LEVEL MATCH (Low, Moderate, High)
  // ----------------------------------------------------
  const energyLevels = ['low', 'moderate', 'high'];
  const actEnergyIdx = energyLevels.indexOf(activity.energyLevel || 'moderate');
  const userEnergyIdx = energyLevels.indexOf(criteria.energyLevel || 'moderate');
  const energyDiff = Math.abs(actEnergyIdx - userEnergyIdx);

  if (energyDiff === 0) {
    score += 15;
    reasons.push(`Matches your ${criteria.energyLevel} energy`);
  } else if (energyDiff === 1) {
    score += 5; // Close enough
  } else {
    // Big mismatch (e.g. low energy user vs high energy gym)
    score -= 20;
  }

  // ----------------------------------------------------
  // 5. DURATION MATCH (quick, 1h, 2h, afternoon)
  // ----------------------------------------------------
  if (activity.duration === criteria.duration) {
    score += 15;
    reasons.push(`Fits your available time window`);
  } else {
    // Compatible duration approximations
    const durationMap = { quick: 1, '1h': 2, '2h': 3, afternoon: 4 };
    const diff = Math.abs((durationMap[activity.duration] || 2) - (durationMap[criteria.duration] || 2));
    if (diff === 1) {
      score += 6;
    } else {
      score -= 10;
    }
  }

  // ----------------------------------------------------
  // 6. INTENTION MATCH (Create, Develop, Reflect, Rest, etc.)
  // ----------------------------------------------------
  const outcomes = activity.outcomes || [];
  if (criteria.intent === 'create') {
    if (activity.category === 'creative_make' || outcomes.includes('artifact') || outcomes.includes('digital-artifact')) {
      score += 25;
      reasons.push('Fulfills your desire to create');
    }
  } else if (criteria.intent === 'develop') {
    if (outcomes.includes('skill') || outcomes.includes('knowledge')) {
      score += 25;
      reasons.push('Builds a real skill or knowledge');
    }
  } else if (criteria.intent === 'reflect') {
    if (outcomes.includes('memory') || activity.category === 'core_responsibility') {
      score += 25;
      reasons.push('Offers thoughtful, centering space');
    }
  } else if (criteria.intent === 'connect') {
    if (outcomes.includes('connection') || activity.socialContext !== 'alone') {
      score += 25;
      reasons.push('Great for meaningful social connection');
    }
  } else if (criteria.intent === 'rest') {
    if (outcomes.includes('relaxation') || activity.energyLevel === 'low') {
      score += 25;
      reasons.push('Calming and restorative');
    }
  } else if (criteria.intent === 'entertain') {
    if (outcomes.includes('entertainment') || outcomes.includes('experience')) {
      score += 20;
      reasons.push('Fun and engaging');
    }
  } else if (criteria.intent === 'experience') {
    if (outcomes.includes('experience') || activity.category === 'life_experiences') {
      score += 25;
      reasons.push('A memorable lived experience');
    }
  } else if (criteria.intent === 'surprise') {
    // Small random boost to inject serendipity
    score += Math.floor(Math.random() * 20);
    reasons.push('A spontaneous spark for you');
  }

  // ----------------------------------------------------
  // 7. "LEAVE SOMETHING BEHIND" (Physical/digital artifact or skill)
  // ----------------------------------------------------
  if (criteria.leaveSomethingBehind === 'yes') {
    if (activity.leavesSomethingBehind) {
      score += 30;
      reasons.push('Leaves behind a tangible artifact or skill');
    } else {
      score -= 35; // User specifically asked to leave something behind
    }
  } else if (criteria.leaveSomethingBehind === 'no') {
    if (!activity.leavesSomethingBehind) {
      score += 15;
    }
  }

  // ----------------------------------------------------
  // 8. PERSONAL PREFERENCES (Favorites & Swipe History)
  // ----------------------------------------------------
  if (activity.isFavorite) {
    score += 15;
    reasons.push('One of your starred favorites');
  }

  // Check swipe history
  const activitySwipes = swipes.filter((s) => s.activityId === activity.id);
  const recentSwipe = activitySwipes[0]; // Most recent

  if (recentSwipe) {
    if (recentSwipe.direction === 'right') {
      score += 15;
      reasons.push("You've expressed interest in this");
    } else if (recentSwipe.direction === 'left') {
      if (recentSwipe.isPermanentDislike || recentSwipe.reason === 'Not my thing') {
        score -= 80; // Heavy penalty for genuine disinterest
      } else {
        // Contextual rejection (e.g. "not tonight", "too tired")
        // Only penalize if current context matches the swipe rejection context
        if (recentSwipe.timeContext === criteria.timeContext) {
          score -= 10;
        }
      }
    }
  }

  // ----------------------------------------------------
  // 9. COMPLETION LOGS & FEEDBACK
  // ----------------------------------------------------
  const activityLogs = logs.filter((l) => l.activityId === activity.id);
  if (activityLogs.length > 0) {
    const lastLog = activityLogs[0];
    // Feedback weighting
    if (lastLog.feedback === 'loved') score += 20;
    else if (lastLog.feedback === 'good') score += 10;
    else if (lastLog.feedback === 'not_really') score -= 15;
    else if (lastLog.feedback === 'never_again') score -= 100;

    // Recency penalty: if done in the last 2 days, deprioritize so user gets variety
    const hoursSinceDone = (Date.now() - new Date(lastLog.timestamp).getTime()) / (1000 * 60 * 60);
    if (hoursSinceDone < 48) {
      score -= 25;
    }
  } else {
    // Novelty bonus for untried activities
    score += 8;
  }

  return {
    activity,
    score,
    reasons: reasons.slice(0, 3), // Keep top 3 crisp reasons
  };
}

/**
 * Generate 3 distinct recommendations:
 * 1. Best Match: Highest calculated score
 * 2. Different Direction: Next highest score from a different category or outcome
 * 3. Wildcard: A refreshing or novel option from the library
 */
export function getRecommendations(activities, criteria, swipes = [], logs = []) {
  if (!activities || activities.length === 0) {
    return null;
  }

  // Score all candidate activities
  const scored = activities.map((act) => scoreActivity(act, criteria, swipes, logs));

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  // 1. BEST MATCH
  const bestMatch = scored[0] || { activity: activities[0], score: 50, reasons: ['Great fit for your current moment'] };

  // 2. DIFFERENT DIRECTION:
  // Must be a different activity, ideally from a different category or outcome
  const diffCandidates = scored.slice(1).filter((item) => {
    return (
      item.activity.id !== bestMatch.activity.id &&
      (item.activity.category !== bestMatch.activity.category ||
        item.activity.leavesSomethingBehind !== bestMatch.activity.leavesSomethingBehind)
    );
  });
  const differentDirection = diffCandidates[0] || scored[1] || scored[0];

  // 3. WILDCARD:
  // Must be distinct from both bestMatch and differentDirection, preferably untried or surprising
  const wildcardCandidates = scored.slice(1).filter((item) => {
    return (
      item.activity.id !== bestMatch.activity.id &&
      item.activity.id !== differentDirection.activity.id
    );
  });

  // Pick an interesting wildcard from candidates
  const wildcard = wildcardCandidates[Math.min(1, wildcardCandidates.length - 1)] || scored[2] || scored[0];

  return {
    bestMatch: {
      ...bestMatch.activity,
      matchReason: bestMatch.reasons.join(' · ') || 'Aligned with your context',
      score: bestMatch.score,
    },
    differentDirection: {
      ...differentDirection.activity,
      matchReason: differentDirection.reasons.join(' · ') || 'A fresh alternative',
      score: differentDirection.score,
    },
    wildcard: {
      ...wildcard.activity,
      matchReason: wildcard.reasons.join(' · ') || 'Spontaneous option to inspire you',
      score: wildcard.score,
    },
  };
}
