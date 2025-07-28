import { Character } from '../types/game';

const FIRST_NAMES = {
  male: ['James', 'John', 'Robert', 'Michael', 'David', 'William', 'Richard', 'Joseph', 'Thomas', 'Christopher', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua'],
  female: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle']
};

const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Italy', 'Spain', 'Japan', 'South Korea', 'Brazil', 'Mexico', 'Argentina', 'India', 'China', 'Russia', 'Sweden', 'Norway', 'Denmark', 'Netherlands'];

export function generateRandomCharacter(): Character {
  const gender = Math.random() < 0.5 ? 'male' : 'female';
  const firstName = FIRST_NAMES[gender][Math.floor(Math.random() * FIRST_NAMES[gender].length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  
  // Generate family
  const motherFirstName = FIRST_NAMES.female[Math.floor(Math.random() * FIRST_NAMES.female.length)];
  const fatherFirstName = FIRST_NAMES.male[Math.floor(Math.random() * FIRST_NAMES.male.length)];
  
  const siblings: string[] = [];
  const siblingCount = Math.floor(Math.random() * 4); // 0-3 siblings
  
  for (let i = 0; i < siblingCount; i++) {
    const siblingGender = Math.random() < 0.5 ? 'male' : 'female';
    const siblingName = FIRST_NAMES[siblingGender][Math.floor(Math.random() * FIRST_NAMES[siblingGender].length)];
    siblings.push(siblingName);
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
    },
    family: {
      mother: `${motherFirstName} ${lastName}`,
      father: `${fatherFirstName} ${lastName}`,
      siblings,
    },
    money: 0,
    isAlive: true,
    createdAt: new Date(),
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
  if (value >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}