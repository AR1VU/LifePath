import { create } from 'zustand';
import { GameState, Character, GameEvent, StatChange, FamilyMember, Disease } from '../types/game';
import { generateRandomCharacter } from '../utils/character';
import { generateRandomEvent, applyStatChanges } from '../utils/events';
import { generateFamilyEvent, interactWithFamily, ageFamilyMembers } from '../utils/family';
import { generateSchoolEvent, updateEducationProgress } from '../utils/education';
import { generateRandomDisease, checkForDeath, generateLifeSummary, generateFuneralEvents } from '../utils/health';
import { updateAssetValues, getMonthlyAssetExpenses } from '../utils/assets';
import { generatePrisonEvent, checkPrisonRelease } from '../utils/criminal';
import { 
  startDating as startDatingUtil, 
  breakUp as breakUpUtil, 
  cheatOnPartner as cheatUtil, 
  giveGift as giveGiftUtil, 
  flirtWithPartner as flirtUtil,
  getFirstJob,
  commitCrime,
  tryDrugs,
  sneakOut,
  checkPregnancy,
  updateGroundedStatus,
  generateTeenagerEvent
} from '../utils/teenager';
import { checkAchievements } from '../utils/achievements';
import { saveGameState, loadGameState } from '../utils/storage';

interface GameStore extends GameState {
  statChanges: StatChange[];
  
  // Actions
  startNewLife: () => void;
  ageUp: () => void;
  setCurrentTab: (tab: GameState['currentTab']) => void;
  interactWithFamilyMember: (familyMemberId: string, action: 'talk' | 'compliment' | 'insult' | 'ask_money') => void;
  
  // Teenager actions
  startDating: () => void;
  breakUp: (relationshipId: string) => void;
  cheatOnPartner: (relationshipId: string) => void;
  giveGift: (relationshipId: string) => void;
  flirtWithPartner: (relationshipId: string, flirtText: string, success: boolean, statChanges: { trust: number; attraction: number; loyalty: number }) => void;
  getFirstJob: () => void;
  joinGang: () => void;
  tryDrugs: () => void;
  sneakOut: () => void;
  
  // Settings
  toggleDarkMode: () => void;
  toggleAutoSave: () => void;
  toggleNotifications: () => void;
  togglePregnancy: () => void;
  loadGame: () => void;
  saveGame: () => void;
  resetGame: () => void;
  addStatChange: (stat: keyof Character['stats'], change: number) => void;
  clearOldStatChanges: () => void;
  setCharacter: (character: Character) => void;
  addEvent: (event: GameEvent) => void;
}

const initialState: GameState = {
  character: null,
  events: [],
  isPlaying: false,
  currentTab: 'stats',
  settings: {
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    autoSave: true,
    notifications: true,
    pregnancyEnabled: true,
  },
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  statChanges: [],

  startNewLife: () => {
    const character = generateRandomCharacter();
    const birthEvent: GameEvent = {
      id: crypto.randomUUID(),
      age: 0,
      title: 'Born!',
      description: `You were born in ${character.country} to ${character.family.mother.name} and ${character.family.father.name}.`,
      statChanges: {},
      timestamp: new Date(),
      type: 'positive',
      category: 'general'
    };

    set({
      character,
      events: [birthEvent],
      isPlaying: true,
      currentTab: 'stats'
    });

    if (get().settings.autoSave) {
      get().saveGame();
    }
  },

  ageUp: () => {
    const { character, events, settings } = get();
    if (!character || !character.isAlive) return;

    // Check if character is dead - prevent any actions
    if (!character.isAlive) return;

    const newAge = character.age + 1;
    let updatedCharacter = { ...character, age: newAge };
    let newEvents = [...events];

    // Check for prison release first
    const prisonReleaseResult = checkPrisonRelease(updatedCharacter);
    updatedCharacter = prisonReleaseResult.character;
    if (prisonReleaseResult.event) {
      newEvents.push(prisonReleaseResult.event);
    }

    // Update asset values
    updatedCharacter = updateAssetValues(updatedCharacter);

    // Age family members
    updatedCharacter = ageFamilyMembers(updatedCharacter);

    // Update education level
    updatedCharacter = updateEducationProgress(updatedCharacter);

    // Check for new diseases
    const newDisease = generateRandomDisease(updatedCharacter);
    if (newDisease) {
      updatedCharacter = {
        ...updatedCharacter,
        diseases: [...updatedCharacter.diseases, newDisease],
        stats: {
          ...updatedCharacter.stats,
          ...Object.fromEntries(
            Object.entries(newDisease.statEffects).map(([stat, change]) => [
              stat,
              Math.max(0, Math.min(100, updatedCharacter.stats[stat as keyof Character['stats']] + (change as number)))
            ])
          )
        }
      };

      const diseaseEvent: GameEvent = {
        id: crypto.randomUUID(),
        age: newAge,
        title: `Diagnosed with ${newDisease.name}`,
        description: `You were diagnosed with ${newDisease.name}. ${newDisease.description}`,
        statChanges: newDisease.statEffects,
        timestamp: new Date(),
        type: 'negative',
        category: 'general'
      };
      newEvents.push(diseaseEvent);

      Object.entries(newDisease.statEffects).forEach(([stat, change]) => {
        if (typeof change === 'number' && change !== 0) {
          get().addStatChange(stat as keyof Character['stats'], change);
        }
      });
    }

    // Generate prison events if in prison
    if (updatedCharacter.isInPrison) {
      const prisonEvent = generatePrisonEvent(updatedCharacter);
      if (prisonEvent) {
        updatedCharacter = applyStatChanges(updatedCharacter, prisonEvent.statChanges);
        newEvents.push(prisonEvent);

        Object.entries(prisonEvent.statChanges).forEach(([stat, change]) => {
          if (typeof change === 'number' && change !== 0) {
            get().addStatChange(stat as keyof Character['stats'], change);
          }
        });
      }
    }

    // Check for death
    const deathCheck = checkForDeath(updatedCharacter);
    if (deathCheck.isDead) {
      updatedCharacter = {
        ...updatedCharacter,
        isAlive: false,
        deathCause: deathCheck.cause,
        deathAge: newAge,
        lifeSummary: generateLifeSummary(updatedCharacter, newEvents)
      };

      const deathEvent: GameEvent = {
        id: crypto.randomUUID(),
        age: newAge,
        title: 'Died',
        description: `Your life has come to an end. Cause of death: ${deathCheck.cause}`,
        statChanges: {},
        timestamp: new Date(),
        type: 'negative',
        category: 'general'
      };
      newEvents.push(deathEvent);

      // Add funeral events
      const funeralEvents = generateFuneralEvents(updatedCharacter);
      newEvents.push(...funeralEvents);

      set({
        character: updatedCharacter,
        events: newEvents,
      });

      if (settings.autoSave) {
        get().saveGame();
      }
      return;
    }

    // Check for pregnancy events
    if (settings.pregnancyEnabled) {
      const pregnancyResult = checkPregnancy(updatedCharacter);
      updatedCharacter = pregnancyResult.character;
      if (pregnancyResult.event) {
        newEvents.push(pregnancyResult.event);
        Object.entries(pregnancyResult.event.statChanges).forEach(([stat, change]) => {
          if (typeof change === 'number' && change !== 0) {
            get().addStatChange(stat as keyof Character['stats'], change);
          }
        });
      }
    }

    // Handle pregnancy due
    if (updatedCharacter.isPregnant && updatedCharacter.age >= updatedCharacter.pregnancyDueAge!) {
      updatedCharacter = {
        ...updatedCharacter,
        isPregnant: false,
        pregnancyDueAge: undefined
      };
      
      const birthEvent: GameEvent = {
        id: crypto.randomUUID(),
        age: newAge,
        title: 'Gave Birth',
        description: 'You gave birth to a healthy baby! Your life has changed forever.',
        statChanges: { happiness: 5, health: -10 },
        timestamp: new Date(),
        type: 'positive',
        category: 'general'
      };
      newEvents.push(birthEvent);
    }

    // Generate random events
    const randomEvent = generateRandomEvent(updatedCharacter);
    if (randomEvent) {
      // Apply stat changes
      updatedCharacter = applyStatChanges(updatedCharacter, randomEvent.statChanges);
      newEvents.push(randomEvent);

      // Add stat change animations
      Object.entries(randomEvent.statChanges).forEach(([stat, change]) => {
        if (typeof change === 'number' && change !== 0) {
          get().addStatChange(stat as keyof Character['stats'], change);
        }
      });
    }

    // Generate family events
    const familyEvent = generateFamilyEvent(updatedCharacter);
    if (familyEvent) {
      updatedCharacter = applyStatChanges(updatedCharacter, familyEvent.statChanges);
      newEvents.push(familyEvent);

      Object.entries(familyEvent.statChanges).forEach(([stat, change]) => {
        if (typeof change === 'number' && change !== 0) {
          get().addStatChange(stat as keyof Character['stats'], change);
        }
      });
    }

    // Generate school events
    const schoolEvent = generateSchoolEvent(updatedCharacter);
    if (schoolEvent) {
      updatedCharacter = applyStatChanges(updatedCharacter, schoolEvent.statChanges);
      newEvents.push(schoolEvent);

      Object.entries(schoolEvent.statChanges).forEach(([stat, change]) => {
        if (typeof change === 'number' && change !== 0) {
          get().addStatChange(stat as keyof Character['stats'], change);
        }
      });
    }

    // Generate teenager events
    const teenEvent = generateTeenagerEvent(updatedCharacter);
    if (teenEvent) {
      updatedCharacter = applyStatChanges(updatedCharacter, teenEvent.statChanges);
      newEvents.push(teenEvent);

      Object.entries(teenEvent.statChanges).forEach(([stat, change]) => {
        if (typeof change === 'number' && change !== 0) {
          get().addStatChange(stat as keyof Character['stats'], change);
        }
      });
    }
    // Check for new achievements
    const newAchievements = checkAchievements(updatedCharacter, newEvents);
    if (newAchievements.length > 0) {
      updatedCharacter = {
        ...updatedCharacter,
        achievements: [...updatedCharacter.achievements, ...newAchievements]
      };

      // Add achievement events
      newAchievements.forEach(achievement => {
        const achievementEvent: GameEvent = {
          id: crypto.randomUUID(),
          age: newAge,
          title: `Achievement Unlocked: ${achievement.title}`,
          description: achievement.description,
          statChanges: { happiness: 5 },
          timestamp: new Date(),
          type: 'positive',
          category: 'achievement'
        };
        newEvents.push(achievementEvent);
      });
    }

    // Natural aging effects
    if (newAge > 40) {
      const agingChange = Math.floor(Math.random() * 2);
      if (agingChange > 0) {
        updatedCharacter.stats.physicalHealth = Math.max(0, updatedCharacter.stats.physicalHealth - agingChange);
        updatedCharacter.stats.looks = Math.max(0, updatedCharacter.stats.looks - agingChange);
      }
    }

    // Add job income
    if (updatedCharacter.hasJob) {
      const monthlyIncome = Math.floor((updatedCharacter.salary || 30000) / 12);
      const baseExpenses = updatedCharacter.finances?.monthlyExpenses || 200;
      const assetExpenses = getMonthlyAssetExpenses(updatedCharacter);
      const expenses = baseExpenses + assetExpenses;
      const netIncome = monthlyIncome - expenses;
      updatedCharacter.stats.money = Math.max(0, updatedCharacter.stats.money + netIncome);
    }

    // College expenses
    if (updatedCharacter.college?.isEnrolled) {
      const monthlyTuition = (updatedCharacter.college.tuition || 40000) / 12;
      updatedCharacter.stats.money = Math.max(0, updatedCharacter.stats.money - monthlyTuition);
    }

    // Insurance premiums
    if (updatedCharacter.insurance.monthlyPremium > 0) {
      updatedCharacter.stats.money = Math.max(0, updatedCharacter.stats.money - updatedCharacter.insurance.monthlyPremium);
    }

    // Asset maintenance costs (if not employed)
    if (!updatedCharacter.hasJob) {
      const assetExpenses = getMonthlyAssetExpenses(updatedCharacter);
      updatedCharacter.stats.money = Math.max(0, updatedCharacter.stats.money - assetExpenses);
    }

    set({
      character: updatedCharacter,
      events: newEvents,
    });

    if (settings.autoSave) {
      get().saveGame();
    }
  },

  setCurrentTab: (tab) => {
    set({ currentTab: tab });
  },

  interactWithFamilyMember: (familyMemberId, action) => {
    const { character, events } = get();
    if (!character) return;

    try {
      const { character: updatedCharacter, event } = interactWithFamily(character, familyMemberId, action);
      
      set({
        character: updatedCharacter,
        events: [...events, event]
      });

      // Add stat change animation if applicable
      Object.entries(event.statChanges).forEach(([stat, change]) => {
        if (typeof change === 'number' && change !== 0) {
          get().addStatChange(stat as keyof Character['stats'], change);
        }
      });

      if (get().settings.autoSave) {
        get().saveGame();
      }
    } catch (error) {
      console.error('Failed to interact with family member:', error);
    }
  },

  // Teenager actions
  startDating: () => {
    const { character, events } = get();
    if (!character || character.age < 13) return;

    try {
      const { character: updatedCharacter, event } = startDatingUtil(character);
      
      set({
        character: updatedCharacter,
        events: [...events, event]
      });

      Object.entries(event.statChanges).forEach(([stat, change]) => {
        if (typeof change === 'number' && change !== 0) {
          get().addStatChange(stat as keyof Character['stats'], change);
        }
      });

      if (get().settings.autoSave) {
        get().saveGame();
      }
    } catch (error) {
      console.error('Failed to start dating:', error);
    }
  },

  breakUp: (relationshipId) => {
    const { character, events } = get();
    if (!character) return;

    try {
      const { character: updatedCharacter, event } = breakUpUtil(character, relationshipId);
      
      set({
        character: updatedCharacter,
        events: [...events, event]
      });

      Object.entries(event.statChanges).forEach(([stat, change]) => {
        if (typeof change === 'number' && change !== 0) {
          get().addStatChange(stat as keyof Character['stats'], change);
        }
      });

      if (get().settings.autoSave) {
        get().saveGame();
      }
    } catch (error) {
      console.error('Failed to break up:', error);
    }
  },

  cheatOnPartner: (relationshipId) => {
    const { character, events } = get();
    if (!character) return;

    try {
      const { character: updatedCharacter, event } = cheatUtil(character, relationshipId);
      
      set({
        character: updatedCharacter,
        events: [...events, event]
      });

      Object.entries(event.statChanges).forEach(([stat, change]) => {
        if (typeof change === 'number' && change !== 0) {
          get().addStatChange(stat as keyof Character['stats'], change);
        }
      });

      if (get().settings.autoSave) {
        get().saveGame();
      }
    } catch (error) {
      console.error('Failed to cheat:', error);
    }
  },

  giveGift: (relationshipId) => {
    const { character, events } = get();
    if (!character) return;

    try {
      const { character: updatedCharacter, event } = giveGiftUtil(character, relationshipId);
      
      set({
        character: updatedCharacter,
        events: [...events, event]
      });

      Object.entries(event.statChanges).forEach(([stat, change]) => {
        if (typeof change === 'number' && change !== 0) {
          get().addStatChange(stat as keyof Character['stats'], change);
        }
      });

      if (get().settings.autoSave) {
        get().saveGame();
      }
    } catch (error) {
      console.error('Failed to give gift:', error);
    }
  },

  flirtWithPartner: (relationshipId, flirtText, success, statChanges) => {
    const { character, events } = get();
    if (!character) return;

    try {
      const { character: updatedCharacter, event } = flirtUtil(character, relationshipId, flirtText, success, statChanges);
      
      set({
        character: updatedCharacter,
        events: [...events, event]
      });

      Object.entries(event.statChanges).forEach(([stat, change]) => {
        if (typeof change === 'number' && change !== 0) {
          get().addStatChange(stat as keyof Character['stats'], change);
        }
      });

      if (get().settings.autoSave) {
        get().saveGame();
      }
    } catch (error) {
      console.error('Failed to flirt:', error);
    }
  },

  getFirstJob: () => {
    const { character, events } = get();
    if (!character || character.age < 15) return;

    try {
      const { character: updatedCharacter, event } = getFirstJob(character);
      
      set({
        character: updatedCharacter,
        events: [...events, event]
      });

      Object.entries(event.statChanges).forEach(([stat, change]) => {
        if (typeof change === 'number' && change !== 0) {
          get().addStatChange(stat as keyof Character['stats'], change);
        }
      });

      if (get().settings.autoSave) {
        get().saveGame();
      }
    } catch (error) {
      console.error('Failed to get job:', error);
    }
  },

  joinGang: () => {
    const { character, events } = get();
    if (!character || character.age < 13 || !character.isAlive || character.isInPrison) return;

    try {
      const { character: updatedCharacter, event } = commitCrime(character);
      
      set({
        character: updatedCharacter,
        events: [...events, event]
      });

      Object.entries(event.statChanges).forEach(([stat, change]) => {
        if (typeof change === 'number' && change !== 0) {
          get().addStatChange(stat as keyof Character['stats'], change);
        }
      });

      if (get().settings.autoSave) {
        get().saveGame();
      }
    } catch (error) {
      console.error('Failed to commit crime:', error);
    }
  },

  tryDrugs: () => {
    const { character, events } = get();
    if (!character || character.age < 13 || !character.isAlive || character.isInPrison) return;

    try {
      const { character: updatedCharacter, event } = tryDrugs(character);
      
      set({
        character: updatedCharacter,
        events: [...events, event]
      });

      Object.entries(event.statChanges).forEach(([stat, change]) => {
        if (typeof change === 'number' && change !== 0) {
          get().addStatChange(stat as keyof Character['stats'], change);
        }
      });

      if (get().settings.autoSave) {
        get().saveGame();
      }
    } catch (error) {
      console.error('Failed to try drugs:', error);
    }
  },

  sneakOut: () => {
    const { character, events } = get();
    if (!character || character.age < 13 || !character.isAlive || character.isInPrison) return;

    try {
      const { character: updatedCharacter, event } = sneakOut(character);
      
      set({
        character: updatedCharacter,
        events: [...events, event]
      });

      Object.entries(event.statChanges).forEach(([stat, change]) => {
        if (typeof change === 'number' && change !== 0) {
          get().addStatChange(stat as keyof Character['stats'], change);
        }
      });

      if (get().settings.autoSave) {
        get().saveGame();
      }
    } catch (error) {
      console.error('Failed to sneak out:', error);
    }
  },
  addStatChange: (stat, change) => {
    set(state => ({
      statChanges: [...state.statChanges, {
        stat,
        change,
        timestamp: Date.now()
      }]
    }));

    // Clear old stat changes after 2 seconds
    setTimeout(() => {
      get().clearOldStatChanges();
    }, 2000);
  },

  clearOldStatChanges: () => {
    const now = Date.now();
    set(state => ({
      statChanges: state.statChanges.filter(sc => now - sc.timestamp < 2000)
    }));
  },

  toggleDarkMode: () => {
    set(state => ({
      settings: { ...state.settings, darkMode: !state.settings.darkMode }
    }));
    get().saveGame();
  },

  toggleAutoSave: () => {
    set(state => ({
      settings: { ...state.settings, autoSave: !state.settings.autoSave }
    }));
  },

  toggleNotifications: () => {
    set(state => ({
      settings: { ...state.settings, notifications: !state.settings.notifications }
    }));
    get().saveGame();
  },

  togglePregnancy: () => {
    set(state => ({
      settings: { ...state.settings, pregnancyEnabled: !state.settings.pregnancyEnabled }
    }));
    get().saveGame();
  },
  loadGame: () => {
    const savedState = loadGameState();
    if (savedState) {
      set(savedState);
    }
  },

  saveGame: () => {
    const state = get();
    saveGameState({
      character: state.character,
      events: state.events,
      isPlaying: state.isPlaying,
      currentTab: state.currentTab,
      settings: state.settings,
    });
  },

  resetGame: () => {
    set({
      ...initialState,
      settings: get().settings, // Keep settings
      statChanges: [],
    });
    get().saveGame();
  },

  setCharacter: (character) => {
    set({ character });
  },

  addEvent: (event) => {
    set(state => ({
      events: [...state.events, event]
    }));
  },
}));