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