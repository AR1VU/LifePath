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
    mother: FamilyMember;
    father: FamilyMember;
    siblings: FamilyMember[];
  };
  money: number;
  isAlive: boolean;
  createdAt: Date;
  education: {
    currentLevel: EducationLevel;
    grades: { [subject: string]: number };
    gpa: number;
    clubs: string[];
    achievements: string[];
  };
  achievements: Achievement[];
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: 'mother' | 'father' | 'sibling';
  age: number;
  closeness: number; // 0-100
  isAlive: boolean;
  personality: 'strict' | 'loving' | 'distant' | 'supportive' | 'rebellious';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: Date;
  icon: string;
}

export type EducationLevel = 'none' | 'preschool' | 'elementary' | 'middle' | 'high' | 'graduated';

export interface GameEvent {
  id: string;
  age: number;
  title: string;
  description: string;
  statChanges: Partial<Character['stats']>;
  timestamp: Date;
  type: 'positive' | 'negative' | 'neutral';
  category: 'general' | 'family' | 'education' | 'achievement';
  familyMemberInvolved?: string;
}

export interface GameState {
  character: Character | null;
  events: GameEvent[];
  isPlaying: boolean;
  currentTab: 'stats' | 'family' | 'education' | 'achievements';
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