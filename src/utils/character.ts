import { Character, FamilyMember } from '../types/game';

const FIRST_NAMES = {
  male: ['James', 'John', 'Robert', 'Michael', 'David', 'William', 'Richard', 'Joseph', 'Thomas', 'Christopher', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua'],
  female: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle']
};

const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Italy', 'Spain', 'Japan', 'South Korea', 'Brazil', 'Mexico', 'Argentina', 'India', 'China', 'Russia', 'Sweden', 'Norway', 'Denmark', 'Netherlands'];

const PERSONALITIES = ['strict', 'loving', 'distant', 'supportive', 'rebellious'] as const;

function generateGenetics(): Character['genetics'] {
  return {
    healthPredisposition: Math.floor(Math.random() * 50) + 50,
    mentalHealthPredisposition: Math.floor(Math.random() * 50) + 50,
    addictionPredisposition: Math.floor(Math.random() * 30) + 10,
    longevityGenes: Math.floor(Math.random() * 40) + 60,
    diseaseResistance: {
      cancer: Math.floor(Math.random() * 50) + 25,
      heartDisease: Math.floor(Math.random() * 50) + 25,
      diabetes: Math.floor(Math.random() * 50) + 25,
      mentalIllness: Math.floor(Math.random() * 50) + 25
    }
  };
}

function generateFamilyMember(
  relation: 'mother' | 'father' | 'sibling',
  lastName: string,
  characterAge: number = 0
): FamilyMember {
  const gender = relation === 'mother' ? 'female' : 
                 relation === 'father' ? 'male' : 
                 Math.random() < 0.5 ? 'male' : 'female';
  
  const firstName = FIRST_NAMES[gender][Math.floor(Math.random() * FIRST_NAMES[gender].length)];
  
  let age: number;
  if (relation === 'mother' || relation === 'father') {
    age = characterAge + Math.floor(Math.random() * 20) + 20; // 20-40 years older
  } else {
    // Sibling: can be older or younger by 1-10 years
    const ageGap = Math.floor(Math.random() * 10) + 1;
    age = Math.random() < 0.5 ? characterAge + ageGap : Math.max(0, characterAge - ageGap);
  }
  
  return {
    id: crypto.randomUUID(),
    name: `${firstName} ${lastName}`,
    relation,
    age,
    closeness: Math.floor(Math.random() * 40) + 60, // Start with 60-100 closeness
    isAlive: true,
    personality: PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)]
  };
}

export function generateRandomCharacter(customName?: string, customGender?: 'male' | 'female', customCountry?: string): Character {
  const gender = customGender || (Math.random() < 0.5 ? 'male' : 'female');
  const firstName = customName ? customName.split(' ')[0] : FIRST_NAMES[gender][Math.floor(Math.random() * FIRST_NAMES[gender].length)];
  const lastName = customName && customName.split(' ').length > 1 ? customName.split(' ').slice(1).join(' ') : LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  const fullName = customName || `${firstName} ${lastName}`;
  
  // Generate family members
  const mother = generateFamilyMember('mother', lastName.split(' ').pop() || lastName, 0);
  const father = generateFamilyMember('father', lastName.split(' ').pop() || lastName, 0);
  
  const siblings: FamilyMember[] = [];
  const siblingCount = Math.floor(Math.random() * 4); // 0-3 siblings
  
  for (let i = 0; i < siblingCount; i++) {
    siblings.push(generateFamilyMember('sibling', lastName.split(' ').pop() || lastName, 0));
  }

  const genetics = generateGenetics();

  return {
    id: crypto.randomUUID(),
    name: fullName,
    gender,
    age: 0,
    country: customCountry || COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)],
    children: [],
    will: {
      beneficiaries: [],
      charityDonations: []
    },
    legacyScore: 0,
    stats: {
      health: Math.floor(Math.random() * 50) + 50, // 50-100
      physicalHealth: Math.floor(Math.random() * 30) + 70, // 70-100
      mentalHealth: Math.floor(Math.random() * 30) + 70, // 70-100
      addictions: 0, // Start with no addictions
      smarts: Math.floor(Math.random() * 50) + 50, // 50-100
      looks: Math.floor(Math.random() * 50) + 50, // 50-100
      happiness: Math.floor(Math.random() * 50) + 50, // 50-100
      reputation: Math.floor(Math.random() * 30) + 70, // 70-100 (start with good reputation)
      money: Math.floor(Math.random() * 1000) + 500, // $500-1500 starting money
    },
    family: {
      mother,
      father,
      siblings,
    },
    isAlive: true,
    createdAt: new Date(),
    education: {
      currentLevel: 'none',
      grades: {},
      gpa: 0,
      clubs: [],
      achievements: []
    },
    achievements: [],
    relationships: [],
    criminalRecord: [],
    riskMeter: 0,
    isGrounded: false,
    groundedUntilAge: 0,
    hasJob: false,
    isPregnant: false,
    diseases: [],
    insurance: {
      type: 'government',
      coverage: 60,
      monthlyPremium: 0,
      deductible: 1000
    },
    genetics,
    finances: {
      savings: 0,
      debt: 0,
      investments: 0,
      monthlyExpenses: 200,
      assets: []
    },
    ownedAssets: [],
    criminalStatus: {
      wantedLevel: 0,
      activeWarrants: [],
      totalCrimesCommitted: 0,
      timesSentenced: 0,
      totalJailTime: 0,
      isOnTrial: false,
      hasLawyer: false,
      lawyerQuality: 'public_defender'
    },
    prisonRecord: [],
    isInPrison: false
  };
}

export function getStatColor(value: number): string {
  if (value >= 80) return 'text-green-500';
  if (value >= 60) return 'text-yellow-500';
  if (value >= 40) return 'text-orange-500';
  return 'text-red-500';
}

export function getStatBarColor(value: number): string {
  if (value >= 80) return 'bg-green-500';
  if (value >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
}