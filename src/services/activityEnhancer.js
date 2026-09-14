/**
 * activityEnhancer.js
 * 
 * Optional Enhancement Layer for Cue ("Make It Happen").
 * 
 * Invoked ONLY when the user asks for additional help or inspiration.
 * Provides:
 * 1. Concrete project / experience ideas (what to paint, what to cook, craft ideas)
 * 2. Step-by-step starter guidance & materials checklist
 * 3. Real video & tutorial links (direct YouTube search links - zero broken embeds)
 * 4. Real-world location assistance (Google Maps / real search links - zero fabricated venues)
 */

export const ActivityEnhancer = {
  /**
   * Determine available enhancement modules for an activity
   */
  getCapabilities(activity) {
    if (!activity) return {};

    const sub = (activity.subcategory || '').toUpperCase();
    const name = (activity.name || '').toLowerCase();
    const isOutside =
      (activity.contexts?.location && activity.contexts.location.includes('outside')) ||
      activity.locationContext === 'outside' ||
      sub.includes('OUTDOORS') ||
      sub.includes('ADVENTURE') ||
      sub.includes('DINING') ||
      sub.includes('NIGHTLIFE') ||
      sub.includes('ARTS & CULTURE') ||
      name.includes('cinema') ||
      name.includes('restaurant') ||
      name.includes('market') ||
      name.includes('museum') ||
      name.includes('gym') ||
      name.includes('swimming') ||
      name.includes('walk') ||
      name.includes('hike');

    const hasVideoInspiration =
      sub.includes('CREATIVE') ||
      sub.includes('CRAFT') ||
      sub.includes('GYM') ||
      name.includes('paint') ||
      name.includes('diy') ||
      name.includes('cook') ||
      name.includes('bake') ||
      name.includes('dance') ||
      name.includes('guitar') ||
      name.includes('piano') ||
      name.includes('instrument') ||
      name.includes('sewing') ||
      name.includes('crochet') ||
      name.includes('code') ||
      name.includes('sculpt') ||
      name.includes('nail');

    return {
      canGiveIdeas: true,
      canHelpStart: true,
      canFindResources: hasVideoInspiration,
      canFindLocations: isOutside,
      primaryActionLabel: name.includes('cinema') ? 'Show What to Watch' : 'Give Me Ideas',
    };
  },

  /**
   * Curated starter ideas and creative prompts
   */
  getIdeas(activity) {
    const name = (activity.name || '').toLowerCase();
    const sub = (activity.subcategory || '').toUpperCase();

    // Painting / Visual Art
    if (name.includes('paint') || name.includes('sketch') || name.includes('draw') || name.includes('watercolor')) {
      return {
        title: 'Creative Sparks for Painting',
        prompts: [
          { title: 'Atmospheric Dusk', description: 'Paint a simple gradient sunset with silhouette treetops using wet-on-wet blend.' },
          { title: 'Color Theory Botanical', description: 'Select 3 colors only (e.g. coral, mint, ochre) to paint a loose leaf or flower study.' },
          { title: 'Abstract Mood Landscape', description: 'Translate how today felt using broad palette knife strokes or textured sponge dabs.' },
        ],
        variations: ['Expressive abstract', 'Botanical watercolor study', 'Miniature 4x4 inch canvas'],
        tips: 'Do not aim for perfection on the first wash. Lay down base colors and let them dry before details.',
      };
    }

    // DIY & Physical Crafts
    if (name.includes('diy') || name.includes('craft') || name.includes('wood') || name.includes('sewing') || name.includes('pottery') || name.includes('wire')) {
      return {
        title: 'Beginner-Friendly Project Directions',
        prompts: [
          { title: 'Functional Catch-All Tray', description: 'Shape air-dry clay or folded leather into an organic tray for keys and jewelry.' },
          { title: 'Minimalist Wire Wrap', description: 'Wrap a raw sea glass or stone using 20-gauge copper wire into a delicate pendant.' },
          { title: 'Bookbinding / Zine', description: 'Fold a single sheet of heavyweight paper into an 8-page mini notebook with stitched spine.' },
        ],
        variations: ['Quick 30m tactile piece', 'Keepsake gift for a friend', 'Decor accent for your desk'],
        tips: 'Clear your workspace completely before pulling out tools. One finished small piece beats three unfinished huge plans.',
      };
    }

    // Cooking / Baking
    if (name.includes('cook') || name.includes('bake') || name.includes('meal') || sub.includes('FOOD')) {
      return {
        title: 'Culinary Experiment Ideas',
        prompts: [
          { title: 'Hand-Rolled Pasta or Gnocchi', description: '2 ingredients: semolina flour + warm water. Knead, roll, cut into rustic cavatelli.' },
          { title: 'Slow-Simmered Fragrant Curry', description: 'Toast whole cumin, mustard seeds, and coriander before building a rich coconut base.' },
          { title: 'Artisanal Focaccia Canvas', description: 'Decorate focaccia dough with rosemary sprigs, cherry tomatoes, and flaky Maldon salt.' },
        ],
        variations: ['Cozy solo comfort dinner', 'Elevated plating challenge', 'Pantry staples experiment'],
        tips: 'Mise en place: chop and measure everything into small bowls before turning on the burner.',
      };
    }

    // Cinema & Film
    if (name.includes('cinema') || name.includes('film') || name.includes('movie')) {
      return {
        title: 'Film Selection Curations',
        prompts: [
          { title: 'A24 / Neon Modern Indie', description: 'Look for character-driven stories with deliberate cinematography and mood.' },
          { title: 'International Festival Winner', description: 'Pick a recent Cannes or Sundance selection with subtitles and original perspective.' },
          { title: 'Visual Poetry / Classic 35mm', description: 'Choose a restored classic or director retrospective on the big screen.' },
        ],
        variations: ['Solo indie cinema trip', 'Matinee screening with coffee', 'Double feature marathon'],
        tips: 'Arrive 15 minutes before showtime to get fresh warm popcorn and choose an center-middle aisle seat.',
      };
    }

    // Writing / Journaling / Reflection
    if (name.includes('journal') || name.includes('writ') || name.includes('essay') || sub.includes('REFLECTION')) {
      return {
        title: 'Writing Entry Points',
        prompts: [
          { title: 'Uncensored Stream of Consciousness', description: '3 pages without lifting the pen from paper. Write whatever surfaces.' },
          { title: 'Values & Life Phase Clarity', description: 'Answer: "What am I ready to stop tolerating, and what am I actively inviting in?"' },
          { title: 'Letter to Future Sparks', description: 'Write a snapshot of this exact month: sounds, obsessions, hopes, and grounding truths.' },
        ],
        variations: ['Analog fountain pen on heavy cotton paper', 'Short vignette story', 'Core beliefs inventory'],
        tips: 'Resist the urge to edit sentences while drafting. Let the first draft be raw and unfiltered.',
      };
    }

    // Default Fallback
    return {
      title: `Ideas for ${activity.name}`,
      prompts: [
        { title: 'Focused Immersion', description: 'Commit to 45 minutes with phone in another room and ambient instrumental music.' },
        { title: 'Gentle Experimentation', description: 'Try doing one step differently than you usually would.' },
        { title: 'Micro-Milestone', description: 'Define what "done for today" looks like before you begin.' },
      ],
      variations: ['Low-pressure playful session', 'Skill-building challenge', 'Quiet meditative flow'],
      tips: 'Set up your environment first so there is zero friction when you start.',
    };
  },

  /**
   * Step-by-step guidance & checklist to get started
   */
  getStarterGuide(activity) {
    const name = (activity.name || '').toLowerCase();

    if (name.includes('paint') || name.includes('watercolor')) {
      return {
        materials: ['Water bowl & paper towels', 'Watercolor/acrylic palette', 'Heavyweight cold-press paper (300gsm)', 'Round brush size 6 or 8'],
        steps: [
          'Lay down a protective mat and tape down your paper edges.',
          'Mix 3 core color puddles in advance on your palette.',
          'Start with the lightest background wash first.',
          'Step back every 10 minutes to see the whole composition.',
        ],
      };
    }

    if (name.includes('cinema')) {
      return {
        materials: ['Cinema ticket or reservation', 'Comfortable jacket for air-conditioned hall', 'Transit plan'],
        steps: [
          'Check local independent cinema listings below.',
          'Pick a screening starting within the next 1–2 hours.',
          'Leave 20 minutes before showtime to enjoy the stroll and concession stand.',
        ],
      };
    }

    if (name.includes('cook') || name.includes('bake')) {
      return {
        materials: ['Fresh ingredients checked against pantry', 'Sharp chef knife & large cutting board', 'Tasting spoons'],
        steps: [
          'Read the recipe or plan from start to finish once.',
          'Prep, peel, and chop all ingredients before turning on the stove.',
          'Put on a favorite jazz or lo-fi album.',
          'Clean as you go so your counter stays welcoming.',
        ],
      };
    }

    // General starter guide
    return {
      materials: ['Phone on Do Not Disturb', 'Glass of water or warm tea', 'Your chosen notebook/materials ready'],
      steps: [
        'Take 2 minutes to clear the physical surface you will be using.',
        'Set an intentional finish time (e.g. 1 hour from now).',
        'Take three deep breaths to transition into this chosen activity.',
        'Begin the first tiny action without judging speed or outcome.',
      ],
    };
  },

  /**
   * Real video tutorial search queries and verified YouTube links
   * (Does not fabricate fake YouTube video IDs or broken embeds)
   */
  getVideoResources(activity) {
    const query = encodeURIComponent(`${activity.name} beginner tutorial inspiration`);
    const shortName = activity.name;

    return {
      searchQuery: `${activity.name} tutorial`,
      youtubeSearchUrl: `https://www.youtube.com/results?search_query=${query}`,
      suggestedQueries: [
        `${shortName} for beginners`,
        `${shortName} step by step process`,
        `${shortName} aesthetic inspiration`,
      ],
      notice: 'Opens YouTube with curated search terms to avoid distraction algorithms.',
    };
  },

  /**
   * Real-world location assistance (Google Maps real search links)
   * Strictly avoids fabricating fake businesses or showtimes!
   */
  getLocationFinder(activity) {
    const name = (activity.name || '').toLowerCase();
    let queryTerm = activity.name;

    if (name.includes('cinema')) queryTerm = 'independent cinema';
    else if (name.includes('museum')) queryTerm = 'art museum or gallery';
    else if (name.includes('coffee') || name.includes('cafe')) queryTerm = 'specialty coffee shop';
    else if (name.includes('bookstore')) queryTerm = 'independent bookstore';
    else if (name.includes('restaurant')) queryTerm = 'dinner restaurants';
    else if (name.includes('swimming')) queryTerm = 'public swimming pool';
    else if (name.includes('gym')) queryTerm = 'gym physical training';
    else if (name.includes('park') || name.includes('walk')) queryTerm = 'botanical garden or park';

    const encoded = encodeURIComponent(queryTerm);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encoded}`;

    return {
      searchTerm: queryTerm,
      mapsSearchUrl: mapsUrl,
      searchEngineUrl: `https://www.google.com/search?q=${encoded}+near+me`,
      notice: 'Connects directly to live Google Maps to view real, current local venues and verified opening hours.',
    };
  },
};
