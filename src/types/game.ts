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
    reputation: number;
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
  relationships: Relationship[];
  criminalRecord: CriminalRecord[];
  riskMeter: number; // 0-100, hidden from player
  isGrounded: boolean;
  groundedUntilAge: number;
  hasJob: boolean;
  jobTitle?: string;
  isPregnant?: boolean;
  pregnancyDueAge?: number;
}

export interface Relationship {
  id: string;
  name: string;
  type: 'dating' | 'ex' | 'crush';
  age: number;
  stats: {
    trust: number; // 0-100
    attraction: number; // 0-100
    loyalty: number; // 0-100
  };
  startedAt: number; // character age when relationship started
  endedAt?: number; // character age when relationship ended
  isActive: boolean;
}

export interface CriminalRecord {
  id: string;
  crime: string;
  age: number;
  punishment: string;
  timestamp: Date;
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
    pregnancyEnabled: boolean;
  };
}

export interface StatChange {
  stat: keyof Character['stats'];
  change: number;
  timestamp: number;
}