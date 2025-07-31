import { Character, FamilyMember } from '../types/game';

const FIRST_NAMES = {
  male: ['James', 'John', 'Robert', 'Michael', 'David', 'William', 'Richard', 'Joseph', 'Thomas', 'Christopher', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua'],
  female: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle']
};

const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Italy', 'Spain', 'Japan', 'South Korea', 'Brazil', 'Mexico', 'Argentina', 'India', 'China', 'Russia', 'Sweden', 'Norway', 'Denmark', 'Netherlands'];

const PERSONALITIES = ['strict', 'loving', 'distant', 'supportive', 'rebellious'] as const;

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

export function generateRandomCharacter(): Character {
  const gender = Math.random() < 0.5 ? 'male' : 'female';
  const firstName = FIRST_NAMES[gender][Math.floor(Math.random() * FIRST_NAMES[gender].length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  
  // Generate family members
  const mother = generateFamilyMember('mother', lastName, 0);
  const father = generateFamilyMember('father', lastName, 0);
  
  const siblings: FamilyMember[] = [];
  const siblingCount = Math.floor(Math.random() * 4); // 0-3 siblings
  
  for (let i = 0; i < siblingCount; i++) {
    siblings.push(generateFamilyMember('sibling', lastName, 0));
  }

  return {
    id: crypto.randomUUID(),
    name: `${firstName} ${lastName}`,
    gender,
    age: 0,
    country: COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)],
    stats: {
      health: Math.floor(Math.random() * 50) + 50, // 50-100
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
    finances: {
      savings: 0,
      debt: 0,
      investments: 0,
      monthlyExpenses: 200,
      assets: []
    }
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