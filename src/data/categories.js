// Categories & Hierarchy for Cue

export const TOP_LEVEL_CATEGORIES = {
  CORE: 'CORE RESPONSIBILITY / ACTIVITY',
  LIFE: 'LIFE & EXPERIENCES',
};

export const TOP_LEVEL_META = {
  [TOP_LEVEL_CATEGORIES.CORE]: {
    id: 'core',
    title: 'CORE RESPONSIBILITY / ACTIVITY',
    subtitle: 'Things that build, maintain and develop my life.',
    description: 'Foundational craft, physical discipline, career mastery, financial growth, and essential relationships.',
    badgeColor: 'text-[#0284C7] bg-[#E0F2FE] border-[#BAE6FD]',
    cardBorder: 'border-[#BAE6FD]',
    accentColor: '#0284C7',
    gradient: 'from-[#0284C7] to-[#0EA5E9]',
    themeBg: 'bg-[#F0F9FF]',
  },
  [TOP_LEVEL_CATEGORIES.LIFE]: {
    id: 'life',
    title: 'LIFE & EXPERIENCES',
    subtitle: 'Things that make life something I actually experience.',
    description: 'Creative making, spontaneous outings, culture, delicious food, deep rest, and outdoor adventures.',
    badgeColor: 'text-[#FF2E79] bg-[#FFE5EF] border-[#FFB8D2]',
    cardBorder: 'border-[#FFB8D2]',
    accentColor: '#FF2E79',
    gradient: 'from-[#FF2E79] to-[#FF6B6B]',
    themeBg: 'bg-[#FFF5F8]',
  },
};

// 14 Core Responsibility Primary Areas
export const CORE_SUBCATEGORIES = [
  'Studying & career (software development)',
  'Networking & mentorship',
  'Gym / physical training',
  'Learning a new language',
  'Financial literacy',
  'Business, marketing & digital marketing',
  'Eloquence training',
  'Reflection / self-understanding',
  'Knowledge acquisition & research',
  'Family time',
  'Friends / social time',
  'Long-form writing toward a finished piece',
  'Learning a craft',
  'Personal projects outside career/business',
];

// 10 Life & Experiences Secondary Categories
export const LIFE_SUBCATEGORIES = [
  'CREATIVE / MAKE',
  'PHYSICAL & ADVENTURE',
  'SOCIAL & NIGHTLIFE',
  'ENTERTAINMENT',
  'FOOD & DINING',
  'ARTS & CULTURE',
  'SHOPPING & PERSONAL',
  'TRAVEL & EXPLORATION',
  'NATURE & OUTDOORS',
  'REST & LEISURE',
];

// Deliberate, rich color system:
// Pink, Coral, Peach, Mint, Pastel green, Aqua, Sky blue, Lavender, Lilac, Butter yellow, Cream
export const SUBCATEGORY_THEMES = {
  // CORE AREAS
  'Studying & career (software development)': {
    accent: '#0284C7', // Sky Blue
    bg: '#F0F9FF',
    border: '#BAE6FD',
    text: '#0369A1',
    iconName: 'Code2',
    shortName: 'Software Dev',
    description: 'Code architecture, web engineering, system design, and algorithmic mastery.',
  },
  'Networking & mentorship': {
    accent: '#4F46E5', // Indigo
    bg: '#EEF2FF',
    border: '#C7D2FE',
    text: '#4338CA',
    iconName: 'Users',
    shortName: 'Networking',
    description: 'Cultivating authentic relationships with mentors, leaders, and ambitious peers.',
  },
  'Gym / physical training': {
    accent: '#059669', // Mint / Pastel green
    bg: '#ECFDF5',
    border: '#A7F3D0',
    text: '#047857',
    iconName: 'Dumbbell',
    shortName: 'Gym & Training',
    description: 'Progressive strength overload, conditioning, and physical vitality.',
  },
  'Learning a new language': {
    accent: '#7C3AED', // Lavender / Violet
    bg: '#F5F3FF',
    border: '#DDD6FE',
    text: '#6D28D9',
    iconName: 'Languages',
    shortName: 'New Language',
    description: 'Grammar mechanics, conversational flow, and vocabulary immersion.',
  },
  'Financial literacy': {
    accent: '#0D9488', // Aqua / Teal
    bg: '#F0FDFA',
    border: '#99F6E4',
    text: '#0F766E',
    iconName: 'TrendingUp',
    shortName: 'Finance',
    description: 'Capital allocation, investment psychology, cash flow, and asset building.',
  },
  'Business, marketing & digital marketing': {
    accent: '#D97706', // Butter yellow / Amber
    bg: '#FFFBEB',
    border: '#FDE68A',
    text: '#B45309',
    iconName: 'Briefcase',
    shortName: 'Business & Mktg',
    description: 'Value creation, distribution channels, copywriting, and growth strategy.',
  },
  'Eloquence training': {
    accent: '#E11D48', // Rose Coral
    bg: '#FFF1F2',
    border: '#FECDD3',
    text: '#BE123C',
    iconName: 'Mic',
    shortName: 'Eloquence',
    description: 'Vocal modulation, rhetoric, articulate speaking, and persuasive pacing.',
  },
  'Reflection / self-understanding': {
    accent: '#9333EA', // Lilac
    bg: '#FAF5FF',
    border: '#E9D5FF',
    text: '#7E22CE',
    iconName: 'Compass',
    shortName: 'Reflection',
    description: 'Journaling, examining mental models, clarifying values, and emotional clarity.',
  },
  'Knowledge acquisition & research': {
    accent: '#0891B2', // Aqua
    bg: '#ECFEFF',
    border: '#A5F3FC',
    text: '#0e7490',
    iconName: 'BookOpen',
    shortName: 'Deep Research',
    description: 'Investigating science, history, philosophical treatises, and systems thinking.',
  },
  'Family time': {
    accent: '#EA580C', // Peach / Warm Coral
    bg: '#FFF7ED',
    border: '#FED7AA',
    text: '#C2410C',
    iconName: 'Heart',
    shortName: 'Family',
    description: 'Deep bonding, long phone calls, shared meals, and familial presence.',
  },
  'Friends / social time': {
    accent: '#F97316', // Coral
    bg: '#FFF7ED',
    border: '#FFEDD5',
    text: '#EA580C',
    iconName: 'Smile',
    shortName: 'Friends',
    description: 'Quality fellowship, shared laughter, heartfelt talks, and supportive camaraderie.',
  },
  'Long-form writing toward a finished piece': {
    accent: '#7E22CE', // Plum
    bg: '#FAF5FF',
    border: '#F3E8FF',
    text: '#6B21A8',
    iconName: 'Feather',
    shortName: 'Long Writing',
    description: 'Essays, manuscripts, chapters, and publications crafted to completion.',
  },
  'Learning a craft': {
    accent: '#C2410C', // Terra Cotta
    bg: '#FFF7ED',
    border: '#FED7AA',
    text: '#9A3412',
    iconName: 'Hammer',
    shortName: 'Craft Mastery',
    description: 'Tactile techniques: leatherwork, joinery, ceramics, bookbinding, or tailoring.',
  },
  'Personal projects outside career/business': {
    accent: '#DB2777', // Pink
    bg: '#FDF2F8',
    border: '#FCE7F3',
    text: '#BE185D',
    iconName: 'Sparkles',
    shortName: 'Side Projects',
    description: 'Passion-driven open-source tinkering, home automations, and personal experiments.',
  },

  // LIFE & EXPERIENCES
  'CREATIVE / MAKE': {
    accent: '#FF2E79', // Vivid Pink / Coral
    bg: '#FFF0F5',
    border: '#FFB8D2',
    text: '#E01A63',
    iconName: 'Palette',
    shortName: 'Creative / Make',
    description: 'Spend time making something tangible that did not exist before.',
  },
  'PHYSICAL & ADVENTURE': {
    accent: '#059669', // Mint / Pastel Green
    bg: '#ECFDF5',
    border: '#A7F3D0',
    text: '#047857',
    iconName: 'Compass',
    shortName: 'Adventure & Sport',
    description: 'Outdoor kinetics: swimming, kayaking, hiking, cycling, and exhilarating sports.',
  },
  'SOCIAL & NIGHTLIFE': {
    accent: '#F43F5E', // Warm Coral / Rose
    bg: '#FFF1F2',
    border: '#FECDD3',
    text: '#E11D48',
    iconName: 'Wine',
    shortName: 'Nightlife & Social',
    description: 'Concerts, karaoke, comedy shows, board game nights, hosting, and evening energy.',
  },
  'ENTERTAINMENT': {
    accent: '#8B5CF6', // Lilac
    bg: '#F5F3FF',
    border: '#DDD6FE',
    text: '#7C3AED',
    iconName: 'Film',
    shortName: 'Entertainment',
    description: 'Cinema, series marathons, audiobooks, podcasts, music albums, and comedy.',
  },
  'FOOD & DINING': {
    accent: '#D97706', // Butter Yellow / Amber
    bg: '#FEF9C3',
    border: '#FEF08A',
    text: '#B45309',
    iconName: 'Utensils',
    shortName: 'Food & Dining',
    description: 'New restaurants, experimental recipes, artisanal coffee, smoothies, and relaxed brunch.',
  },
  'ARTS & CULTURE': {
    accent: '#9333EA', // Purple
    bg: '#FAF5FF',
    border: '#E9D5FF',
    text: '#7E22CE',
    iconName: 'Landmark',
    shortName: 'Arts & Culture',
    description: 'Galleries, museums, live theatre, cultural festivals, and historical landmarks.',
  },
  'SHOPPING & PERSONAL': {
    accent: '#DB2777', // Soft Coral / Pink
    bg: '#FDF2F8',
    border: '#FCE7F3',
    text: '#BE185D',
    iconName: 'Sparkles',
    shortName: 'Personal Care',
    description: 'Bookshop browsing, hair styling, spa sessions, farmers markets, and self-care.',
  },
  'TRAVEL & EXPLORATION': {
    accent: '#0284C7', // Sky Blue / Aqua
    bg: '#F0F9FF',
    border: '#BAE6FD',
    text: '#0369A1',
    iconName: 'Plane',
    shortName: 'Travel',
    description: 'Road trips, weekend getaways, city wandering, beach resorts, and train journeys.',
  },
  'NATURE & OUTDOORS': {
    accent: '#10B981', // Emerald Mint
    bg: '#ECFDF5',
    border: '#A7F3D0',
    text: '#047857',
    iconName: 'Sun',
    shortName: 'Nature & Wild',
    description: 'Beaches, picnics in the grass, botanical sanctuaries, bonfires, and stargazing.',
  },
  'REST & LEISURE': {
    accent: '#64748B', // Soft Lavender / Cloud Slate
    bg: '#F8FAFC',
    border: '#E2E8F0',
    text: '#475569',
    iconName: 'Coffee',
    shortName: 'Rest & Leisure',
    description: 'Doing absolutely nothing, guilt-free naps, fiction novels, and peaceful lingering.',
  },
};

export function getSubcategoryTheme(subcategory) {
  return (
    SUBCATEGORY_THEMES[subcategory] || {
      accent: '#64748B',
      bg: '#F8FAFC',
      border: '#E2E8F0',
      text: '#475569',
      iconName: 'Sparkles',
      shortName: subcategory,
      description: '',
    }
  );
}
