export interface Character {
  id: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  country: string;
  stats: {
    health: number;
    smarts: number;
    looks: number;
    happiness: number;
  };
  family: {
    mother: string;
    father: string;
    siblings: string[];
  };
  money: number;
  isAlive: boolean;
  createdAt: Date;
}

export interface GameEvent {
  id: string;
  age: number;
  title: string;
  description: string;
  statChanges: Partial<Character['stats']>;
  timestamp: Date;
  type: 'positive' | 'negative' | 'neutral';
}

export interface GameState {
  character: Character | null;
  events: GameEvent[];
  isPlaying: boolean;
  settings: {
    darkMode: boolean;
    autoSave: boolean;
    notifications: boolean;
  };
}

export interface StatChange {
  stat: keyof Character['stats'];
  change: number;
  timestamp: number;
}