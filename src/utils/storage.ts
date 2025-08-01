import { GameState } from '../types/game';

const STORAGE_KEY = 'lifepath-game-data';

export function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

export function loadGameState(): GameState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    
    const parsed = JSON.parse(saved);
    // Convert date strings back to Date objects
    if (parsed.character) {
      parsed.character.createdAt = new Date(parsed.character.createdAt);
      // Ensure ownedAssets is always an array
      if (!parsed.character.ownedAssets) {
        parsed.character.ownedAssets = [];
      }
      // Ensure children is always an array
      if (!parsed.character.children) {
        parsed.character.children = [];
      }
      // Ensure will exists
      if (!parsed.character.will) {
        parsed.character.will = {
          beneficiaries: [],
          charityDonations: []
        };
      }
      // Ensure legacyScore exists
      if (typeof parsed.character.legacyScore !== 'number') {
        parsed.character.legacyScore = 0;
      }
      // Ensure criminalStatus exists
      if (!parsed.character.criminalStatus) {
        parsed.character.criminalStatus = {
          wantedLevel: 0,
          activeWarrants: [],
          totalCrimesCommitted: 0,
          timesSentenced: 0,
          totalJailTime: 0,
          isOnTrial: false,
          hasLawyer: false,
          lawyerQuality: 'public_defender'
        };
      }
      // Ensure prisonRecord exists
      if (!parsed.character.prisonRecord) {
        parsed.character.prisonRecord = [];
      }
      // Ensure isInPrison exists
      if (typeof parsed.character.isInPrison !== 'boolean') {
        parsed.character.isInPrison = false;
      }
    }
    parsed.events = parsed.events.map((event: any) => ({
      ...event,
      timestamp: new Date(event.timestamp)
    }));
    
    return parsed;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
}

export function clearGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear game state:', error);
  }
}