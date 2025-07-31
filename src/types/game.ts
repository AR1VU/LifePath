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
    money: number;
  };
  family: {
    mother: FamilyMember;
    father: FamilyMember;
    siblings: FamilyMember[];
  };
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
  jobLevel?: number;
  jobPerformance?: number;
  salary?: number;
  workExperience?: number;
  isPregnant?: boolean;
  pregnancyDueAge?: number;
  college?: {
    isEnrolled: boolean;
    major?: string;
    year?: number;
    gpa?: number;
    tuition?: number;
    scholarships?: number;
    loans?: number;
  };
  finances?: {
    savings: number;
    debt: number;
    investments: number;
    monthlyExpenses: number;
    assets: Asset[];
  };
}

export interface Asset {
  id: string;
  name: string;
  type: 'car' | 'house' | 'gadget' | 'subscription';
  value: number;
  monthlyFee?: number;
  purchasedAt: number;
}

export interface Job {
  id: string;
  title: string;
  category: 'entry' | 'skilled' | 'professional' | 'executive';
  requirements: {
    education?: EducationLevel;
    experience?: number;
    stats?: Partial<Character['stats']>;
  };
  salary: {
    min: number;
    max: number;
  };
  description: string;
  careerPath?: string[];
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
  currentTab: 'stats' | 'family' | 'education' | 'career' | 'relationships' | 'achievements';
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