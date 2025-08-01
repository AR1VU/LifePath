export interface Character {
  id: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  country: string;
  stats: {
    health: number;
    physicalHealth: number;
    mentalHealth: number;
    smarts: number;
    looks: number;
    happiness: number;
    reputation: number;
    addictions: number;
    money: number;
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
  criminalStatus: CriminalStatus;
  prisonRecord: PrisonRecord[];
  riskMeter: number; // 0-100, hidden from player
  isGrounded: boolean;
  groundedUntilAge: number;
  hasJob: boolean;
  jobTitle?: string;
  isPregnant?: boolean;
  pregnancyDueAge?: number;
  isInPrison?: boolean;
  prisonReleaseAge?: number;
  salary?: number;
  jobLevel?: number;
  deathCause?: string;
  deathAge?: number;
  lifeSummary?: LifeSummary;
  college?: {
    isEnrolled: boolean;
    tuition?: number;
    name?: string;
    major?: string;
  };
  diseases: Disease[];
  insurance: Insurance;
  genetics: Genetics;
  finances: {
    savings: number;
    debt: number;
    investments: number;
    monthlyExpenses: number;
    assets: OwnedAsset[];
  };
}

export interface OwnedAsset {
  id: string;
  type: 'real_estate' | 'vehicle' | 'misc';
  name: string;
  purchasePrice: number;
  currentValue: number;
  purchasedAt: number;
  monthlyMaintenance?: number;
  description: string;
  category: string;
}

export interface CriminalStatus {
  wantedLevel: number; // 0-5
  activeWarrants: string[];
  totalCrimesCommitted: number;
  timesSentenced: number;
  totalJailTime: number;
  isOnTrial: boolean;
  hasLawyer: boolean;
  lawyerQuality: 'public_defender' | 'private' | 'elite';
}

export interface PrisonRecord {
  id: string;
  crime: string;
  sentence: number; // in years
  servedTime: number;
  prisonName: string;
  enteredAt: number;
  releasedAt?: number;
  escapeAttempts: number;
  prisonEvents: PrisonEvent[];
}

export interface PrisonEvent {
  id: string;
  type: 'fight' | 'bribery' | 'escape_attempt' | 'good_behavior' | 'gang_activity';
  description: string;
  outcome: 'success' | 'failure' | 'neutral';
  ageOccurred: number;
}

export interface CrimeAction {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  baseSuccessRate: number;
  minReward: number;
  maxReward: number;
  jailTimeRange: [number, number]; // in years
  requiredStats?: Partial<Character['stats']>;
  wantedLevelIncrease: number;
}

export interface AssetTemplate {
  id: string;
  name: string;
  type: 'real_estate' | 'vehicle' | 'misc';
  category: string;
  basePrice: number;
  monthlyMaintenance?: number;
  description: string;
  requirements?: {
    minAge?: number;
    minMoney?: number;
    license?: boolean;
  };
}

export interface Disease {
  id: string;
  name: string;
  type: 'physical' | 'mental' | 'addiction' | 'std';
  severity: 'mild' | 'moderate' | 'severe' | 'terminal';
  contractedAt: number; // age when contracted
  isCurable: boolean;
  isFatal: boolean;
  treatmentCost: number;
  statEffects: Partial<Character['stats']>;
  description: string;
  symptoms: string[];
}

export interface Insurance {
  type: 'government' | 'private' | 'uninsured';
  coverage: number; // 0-100 percentage
  monthlyPremium: number;
  deductible: number;
}

export interface Genetics {
  healthPredisposition: number; // 0-100, inherited from parents
  mentalHealthPredisposition: number;
  addictionPredisposition: number;
  longevityGenes: number;
  diseaseResistance: { [disease: string]: number };
}

export interface LifeSummary {
  totalYearsLived: number;
  causeOfDeath: string;
  totalWealth: number;
  jobsHeld: string[];
  relationshipsCount: number;
  childrenCount: number;
  crimesCommitted: number;
  achievementsUnlocked: number;
  legacyScore: number;
  keyEvents: GameEvent[];
  finalStats: Character['stats'];
}

export interface HospitalVisit {
  id: string;
  type: 'checkup' | 'surgery' | 'therapy' | 'rehab' | 'emergency';
  cost: number;
  success: boolean;
  description: string;
  age: number;
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
  category: 'general' | 'family' | 'education' | 'achievement' | 'criminal' | 'prison' | 'assets';
  familyMemberInvolved?: string;
}

export interface GameState {
  character: Character | null;
  events: GameEvent[];
  isPlaying: boolean;
  currentTab: 'stats' | 'family' | 'education' | 'career' | 'relationships' | 'achievements' | 'health' | 'assets' | 'criminal';
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