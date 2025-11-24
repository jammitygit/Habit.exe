export const XP_PER_LOG = 100;
export const XP_PENALTY_UNLOG = 100;
export const XP_PENALTY_FAIL = 50;
export const STREAK_BONUS_THRESHOLD = 7;
export const STREAK_BONUS_MULTIPLIER = 1.2;

// Progressive XP System
// 30 Ranks total.
export const RANKS = [
  // Tier 1: Recruit
  { title: 'RECRUIT I', minXp: 0 },
  { title: 'RECRUIT II', minXp: 300 },
  { title: 'RECRUIT III', minXp: 700 },
  
  // Tier 2: Private
  { title: 'PRIVATE I', minXp: 1200 },
  { title: 'PRIVATE II', minXp: 1800 },
  { title: 'PRIVATE III', minXp: 2500 },

  // Tier 3: Corporal
  { title: 'CORPORAL I', minXp: 3300 },
  { title: 'CORPORAL II', minXp: 4200 },
  { title: 'CORPORAL III', minXp: 5200 },

  // Tier 4: Sergeant
  { title: 'SERGEANT I', minXp: 6300 },
  { title: 'SERGEANT II', minXp: 7500 },
  { title: 'SERGEANT III', minXp: 8800 },

  // Tier 5: Lieutenant
  { title: 'LIEUTENANT I', minXp: 10200 },
  { title: 'LIEUTENANT II', minXp: 11700 },
  { title: 'LIEUTENANT III', minXp: 13300 },

  // Tier 6: Captain
  { title: 'CAPTAIN I', minXp: 15000 },
  { title: 'CAPTAIN II', minXp: 16800 },
  { title: 'CAPTAIN III', minXp: 18700 },

  // Tier 7: Major
  { title: 'MAJOR I', minXp: 20700 },
  { title: 'MAJOR II', minXp: 22800 },
  { title: 'MAJOR III', minXp: 25000 },

  // Tier 8: Colonel
  { title: 'COLONEL I', minXp: 27300 },
  { title: 'COLONEL II', minXp: 29700 },
  { title: 'COLONEL III', minXp: 32200 },

  // Tier 9: General
  { title: 'GENERAL I', minXp: 34800 },
  { title: 'GENERAL II', minXp: 37500 },
  { title: 'GENERAL III', minXp: 40300 },

  // Tier 10: Warlord
  { title: 'WARLORD I', minXp: 43200 },
  { title: 'WARLORD II', minXp: 46200 },
  { title: 'WARLORD III', minXp: 50000 },
];

export const INITIAL_HABITS = [
  { id: 'h1', name: 'core_hydration_protocol', frequency: 1, history: [], streak: 0 },
  { id: 'h2', name: 'neural_optimization_read', frequency: 1, history: [], streak: 0 },
  { id: 'h3', name: 'physical_maint_drill', frequency: 1, history: [], streak: 0 },
];