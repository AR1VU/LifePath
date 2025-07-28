import { create } from 'zustand';
import { GameState, Character, GameEvent, StatChange } from '../types/game';
import { generateRandomCharacter } from '../utils/character';
import { generateRandomEvent, applyStatChanges } from '../utils/events';
import { saveGameState, loadGameState } from '../utils/storage';

interface GameStore extends GameState {
  statChanges: StatChange[];
  
  // Actions
  startNewLife: () => void;
  ageUp: () => void;
  toggleDarkMode: () => void;
  toggleAutoSave: () => void;
  toggleNotifications: () => void;
  loadGame: () => void;
  saveGame: () => void;
  resetGame: () => void;
  addStatChange: (stat: keyof Character['stats'], change: number) => void;
  clearOldStatChanges: () => void;
}

const initialState: GameState = {
  character: null,
  events: [],
  isPlaying: false,
  settings: {
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    autoSave: true,
    notifications: true,
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
      description: `You were born in ${character.country} to ${character.family.mother} and ${character.family.father}.`,
      statChanges: {},
      timestamp: new Date(),
      type: 'positive'
    };

    set({
      character,
      events: [birthEvent],
      isPlaying: true,
    });

    if (get().settings.autoSave) {
      get().saveGame();
    }
  },

  ageUp: () => {
    const { character, events, settings } = get();
    if (!character || !character.isAlive) return;

    const newAge = character.age + 1;
    let updatedCharacter = { ...character, age: newAge };
    let newEvents = [...events];

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

    // Check if character dies (very low health)
    if (updatedCharacter.stats.health <= 0) {
      updatedCharacter.isAlive = false;
      const deathEvent: GameEvent = {
        id: crypto.randomUUID(),
        age: newAge,
        title: 'Died',
        description: 'Your life has come to an end. Rest in peace.',
        statChanges: {},
        timestamp: new Date(),
        type: 'negative'
      };
      newEvents.push(deathEvent);
    }

    // Natural aging effects
    if (newAge > 40) {
      const agingChange = Math.floor(Math.random() * 2);
      if (agingChange > 0) {
        updatedCharacter.stats.health = Math.max(0, updatedCharacter.stats.health - agingChange);
        updatedCharacter.stats.looks = Math.max(0, updatedCharacter.stats.looks - agingChange);
      }
    }

    set({
      character: updatedCharacter,
      events: newEvents,
    });

    if (settings.autoSave) {
      get().saveGame();
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
}));