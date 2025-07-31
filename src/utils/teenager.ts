import { Character, GameEvent, Relationship, CriminalRecord } from '../types/game';

const FIRST_NAMES = {
  male: ['Alex', 'Jake', 'Ryan', 'Tyler', 'Brandon', 'Justin', 'Kevin', 'Chris', 'Matt', 'Nick'],
  female: ['Ashley', 'Jessica', 'Sarah', 'Emily', 'Amanda', 'Brittany', 'Samantha', 'Rachel', 'Lauren', 'Megan']
};

const LAST_NAMES = ['Johnson', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas'];

const JOB_TITLES = [
  'Cashier at Local Store',
  'Fast Food Worker',
  'Movie Theater Usher',
  'Babysitter',
  'Dog Walker',
  'Lawn Care Assistant',
  'Library Helper',
  'Grocery Bagger'
];

const CRIMES = [
  { name: 'Shoplifting', severity: 'minor', punishment: 'Community Service' },
  { name: 'Vandalism', severity: 'minor', punishment: 'Grounded for 2 years' },
  { name: 'Underage Drinking', severity: 'minor', punishment: 'Suspended from School' },
  { name: 'Fighting', severity: 'moderate', punishment: 'Detention' },
  { name: 'Drug Possession', severity: 'serious', punishment: 'Juvenile Detention' },
  { name: 'Car Theft', severity: 'serious', punishment: 'Probation' }
];

export function generateRandomPartner(characterAge: number): Relationship {
  const gender = Math.random() < 0.5 ? 'male' : 'female';
  const firstName = FIRST_NAMES[gender][Math.floor(Math.random() * FIRST_NAMES[gender].length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  
  // Partner age should be close to character age (±2 years)
  const ageGap = Math.floor(Math.random() * 5) - 2; // -2 to +2
  const partnerAge = Math.max(13, Math.min(18, characterAge + ageGap));

  return {
    id: crypto.randomUUID(),
    name: `${firstName} ${lastName}`,
    type: 'dating',
    age: partnerAge,
    stats: {
      trust: Math.floor(Math.random() * 30) + 60, // 60-90
      attraction: Math.floor(Math.random() * 30) + 60, // 60-90
      loyalty: Math.floor(Math.random() * 30) + 60, // 60-90
    },
    startedAt: characterAge,
    isActive: true
  };
}

export function startDating(character: Character): { character: Character; event: GameEvent } {
  // Check if already dating someone
  const hasActiveRelationship = character.relationships.some(r => r.isActive);
  if (hasActiveRelationship) {
    throw new Error('Already in a relationship');
  }

  const partner = generateRandomPartner(character.age);
  const updatedCharacter = {
    ...character,
    relationships: [...character.relationships, partner]
  };

  const event: GameEvent = {
    id: crypto.randomUUID(),
    age: character.age,
    title: 'Started Dating',
    description: `You started dating ${partner.name}! They're ${partner.age} years old and you really hit it off.`,
    statChanges: { happiness: 8, reputation: 2 },
    timestamp: new Date(),
    type: 'positive' as const,
    category: 'general'
  };

  return { character: updatedCharacter, event };
}

export function breakUp(character: Character, relationshipId: string): { character: Character; event: GameEvent } {
  const relationship = character.relationships.find(r => r.id === relationshipId);
  if (!relationship || !relationship.isActive) {
    throw new Error('Relationship not found or already ended');
  }

  const updatedRelationships = character.relationships.map(r =>
    r.id === relationshipId ? { ...r, isActive: false, endedAt: character.age } : r
  );

  const updatedCharacter = {
    ...character,
    relationships: updatedRelationships
  };

  const event: GameEvent = {
    id: crypto.randomUUID(),
    age: character.age,
    title: 'Broke Up',
    description: `You and ${relationship.name} decided to break up. It was emotional but probably for the best.`,
    statChanges: { happiness: -10, reputation: -1 },
    timestamp: new Date(),
    type: 'negative' as const,
    category: 'general'
  };

  return { character: updatedCharacter, event };
}

export function cheatOnPartner(character: Character, relationshipId: string): { character: Character; event: GameEvent } {
  const relationship = character.relationships.find(r => r.id === relationshipId);
  if (!relationship || !relationship.isActive) {
    throw new Error('Relationship not found or not active');
  }

  const caught = Math.random() < 0.4; // 40% chance of getting caught
  
  let updatedRelationships = character.relationships;
  let statChanges = {};
  let description = '';
  let eventType: 'positive' | 'negative' = 'negative';

  if (caught) {
    // Relationship ends, major trust loss
    updatedRelationships = character.relationships.map(r =>
      r.id === relationshipId ? { ...r, isActive: false, endedAt: character.age } : r
    );
    statChanges = { happiness: -15, reputation: -10 };
    description = `You cheated on ${relationship.name} and got caught! They broke up with you immediately and word spread around school.`;
  } else {
    // Relationship continues but with reduced trust
    updatedRelationships = character.relationships.map(r =>
      r.id === relationshipId ? { 
        ...r, 
        stats: { 
          ...r.stats, 
          trust: Math.max(0, r.stats.trust - 20),
          loyalty: Math.max(0, r.stats.loyalty - 15)
        } 
      } : r
    );
    statChanges = { happiness: 5, reputation: -2 };
    description = `You cheated on ${relationship.name} but didn't get caught. You feel guilty about it though.`;
  }

  const updatedCharacter = {
    ...character,
    relationships: updatedRelationships,
    riskMeter: Math.min(100, character.riskMeter + 15)
  };

  const event: GameEvent = {
    id: crypto.randomUUID(),
    age: character.age,
    title: caught ? 'Caught Cheating' : 'Cheated',
    description,
    statChanges,
    timestamp: new Date(),
    type: eventType,
    category: 'general'
  };

  return { character: updatedCharacter, event };
}

export function giveGift(character: Character, relationshipId: string): { character: Character; event: GameEvent } {
  const relationship = character.relationships.find(r => r.id === relationshipId);
  if (!relationship || !relationship.isActive) {
    throw new Error('Relationship not found or not active');
  }

  const giftCost = Math.floor(Math.random() * 50) + 10; // $10-60
  if (character.money < giftCost) {
    throw new Error('Not enough money for a gift');
  }

  const updatedRelationships = character.relationships.map(r =>
    r.id === relationshipId ? {
      ...r,
      stats: {
        ...r.stats,
        trust: Math.min(100, r.stats.trust + 5),
        attraction: Math.min(100, r.stats.attraction + 3),
        loyalty: Math.min(100, r.stats.loyalty + 4)
      }
    } : r
  );

  const updatedCharacter = {
    ...character,
    relationships: updatedRelationships,
    money: character.money - giftCost
  };

  const event: GameEvent = {
    id: crypto.randomUUID(),
    age: character.age,
    title: 'Gave Gift',
    description: `You bought ${relationship.name} a thoughtful gift for $${giftCost}. They loved it!`,
    statChanges: { happiness: 4 },
    timestamp: new Date(),
    type: 'positive' as const,
    category: 'general'
  };

  return { character: updatedCharacter, event };
}

export function flirtWithPartner(
  character: Character, 
  relationshipId: string, 
  flirtText: string, 
  success: boolean, 
  statChanges: { trust: number; attraction: number; loyalty: number }
): { character: Character; event: GameEvent } {
  const relationship = character.relationships.find(r => r.id === relationshipId);
  if (!relationship || !relationship.isActive) {
    throw new Error('Relationship not found or not active');
  }

  const updatedRelationships = character.relationships.map(r =>
    r.id === relationshipId ? {
      ...r,
      stats: {
        trust: Math.max(0, Math.min(100, r.stats.trust + statChanges.trust)),
        attraction: Math.max(0, Math.min(100, r.stats.attraction + statChanges.attraction)),
        loyalty: Math.max(0, Math.min(100, r.stats.loyalty + statChanges.loyalty))
      }
    } : r
  );

  const updatedCharacter = {
    ...character,
    relationships: updatedRelationships
  };

  const event: GameEvent = {
    id: crypto.randomUUID(),
    age: character.age,
    title: success ? 'Successful Flirt' : 'Awkward Flirt',
    description: success 
      ? `You tried "${flirtText}" with ${relationship.name} and they loved it!`
      : `You tried "${flirtText}" with ${relationship.name} but it came off awkward.`,
    statChanges: { happiness: success ? 3 : -2 },
    timestamp: new Date(),
    type: success ? 'positive' as const : 'negative' as const,
    category: 'general'
  };

  return { character: updatedCharacter, event };
}

export function getFirstJob(character: Character): { character: Character; event: GameEvent } {
  if (character.hasJob) {
    throw new Error('Already has a job');
  }

  const jobTitle = JOB_TITLES[Math.floor(Math.random() * JOB_TITLES.length)];
  const updatedCharacter = {
    ...character,
    hasJob: true,
    jobTitle,
    stats: {
      ...character.stats,
      money: character.stats.money + 50 // Starting bonus
    }
  };

  const event: GameEvent = {
    id: crypto.randomUUID(),
    age: character.age,
    title: 'Got First Job',
    description: `You got your first job as a ${jobTitle}! You're excited to start earning your own money.`,
    statChanges: { happiness: 6, smarts: 2 },
    timestamp: new Date(),
    type: 'positive' as const,
    category: 'general'
  };

  return { character: updatedCharacter, event };
}

export function commitCrime(character: Character): { character: Character; event: GameEvent } {
  const crime = CRIMES[Math.floor(Math.random() * CRIMES.length)];
  const caught = Math.random() < 0.6; // 60% chance of getting caught
  
  let updatedCharacter = { ...character };
  let statChanges = {};
  let description = '';
  let eventType: 'positive' | 'negative' = 'negative';

  if (caught) {
    const criminalRecord: CriminalRecord = {
      id: crypto.randomUUID(),
      crime: crime.name,
      age: character.age,
      punishment: crime.punishment,
      timestamp: new Date()
    };

    updatedCharacter = {
      ...character,
      criminalRecord: [...character.criminalRecord, criminalRecord],
      riskMeter: Math.min(100, character.riskMeter + 20)
    };

    // Apply punishment
    if (crime.punishment.includes('Grounded')) {
      updatedCharacter.isGrounded = true;
      updatedCharacter.groundedUntilAge = character.age + 2;
    }

    statChanges = { happiness: -10, reputation: -15, health: -5 };
    description = `You were caught committing ${crime.name.toLowerCase()}! Your punishment: ${crime.punishment}.`;
  } else {
    updatedCharacter.riskMeter = Math.min(100, character.riskMeter + 10);
    statChanges = { happiness: 3, reputation: -2 };
    description = `You committed ${crime.name.toLowerCase()} and got away with it, but you feel guilty.`;
  }

  const event: GameEvent = {
    id: crypto.randomUUID(),
    age: character.age,
    title: caught ? `Caught: ${crime.name}` : crime.name,
    description,
    statChanges,
    timestamp: new Date(),
    type: eventType,
    category: 'general'
  };

  return { character: updatedCharacter, event };
}

export function tryDrugs(character: Character): { character: Character; event: GameEvent } {
  const caught = Math.random() < 0.3; // 30% chance of getting caught
  const badReaction = Math.random() < 0.2; // 20% chance of bad reaction
  
  let updatedCharacter = {
    ...character,
    riskMeter: Math.min(100, character.riskMeter + 25)
  };
  
  let statChanges = {};
  let description = '';
  let eventType: 'positive' | 'negative' = 'negative';

  if (caught) {
    const criminalRecord: CriminalRecord = {
      id: crypto.randomUUID(),
      crime: 'Drug Use',
      age: character.age,
      punishment: 'Suspended from School',
      timestamp: new Date()
    };

    updatedCharacter = {
      ...updatedCharacter,
      criminalRecord: [...character.criminalRecord, criminalRecord],
      isGrounded: true,
      groundedUntilAge: character.age + 1
    };

    statChanges = { happiness: -15, reputation: -20, health: -10 };
    description = 'You tried drugs but got caught by school authorities. You were suspended and your parents grounded you.';
  } else if (badReaction) {
    statChanges = { happiness: -8, health: -15, reputation: -5 };
    description = 'You tried drugs but had a bad reaction. You felt sick and regretted the decision.';
  } else {
    statChanges = { happiness: 5, health: -3, reputation: -2 };
    description = 'You experimented with drugs. It was a temporary high but you know it was risky.';
  }

  const event: GameEvent = {
    id: crypto.randomUUID(),
    age: character.age,
    title: caught ? 'Caught Using Drugs' : badReaction ? 'Bad Drug Experience' : 'Tried Drugs',
    description,
    statChanges,
    timestamp: new Date(),
    type: eventType,
    category: 'general'
  };

  return { character: updatedCharacter, event };
}

export function sneakOut(character: Character): { character: Character; event: GameEvent } {
  const caught = Math.random() < 0.4; // 40% chance of getting caught
  
  let updatedCharacter = {
    ...character,
    riskMeter: Math.min(100, character.riskMeter + 10)
  };
  
  let statChanges = {};
  let description = '';
  let eventType: 'positive' | 'negative' = 'positive';

  if (caught) {
    updatedCharacter = {
      ...updatedCharacter,
      isGrounded: true,
      groundedUntilAge: character.age + 1
    };

    statChanges = { happiness: -8, reputation: -3 };
    description = 'You tried to sneak out but your parents caught you! You\'re grounded for a year.';
    eventType = 'negative';
  } else {
    statChanges = { happiness: 8, reputation: 2 };
    description = 'You successfully snuck out and had an amazing night with friends!';
  }

  const event: GameEvent = {
    id: crypto.randomUUID(),
    age: character.age,
    title: caught ? 'Caught Sneaking Out' : 'Snuck Out',
    description,
    statChanges,
    timestamp: new Date(),
    type: eventType,
    category: 'general'
  };

  return { character: updatedCharacter, event };
}

export function checkPregnancy(character: Character): { character: Character; event: GameEvent | null } {
  // Only for female characters in relationships
  if (character.gender !== 'female' || character.age < 16) return { character, event: null };
  
  const hasActiveRelationship = character.relationships.some(r => r.isActive);
  if (!hasActiveRelationship || character.isPregnant) return { character, event: null };

  // Small chance of pregnancy
  const pregnancyChance = 0.02; // 2% chance per year
  if (Math.random() > pregnancyChance) return { character, event: null };

  const updatedCharacter = {
    ...character,
    isPregnant: true,
    pregnancyDueAge: character.age + 1
  };

  const event: GameEvent = {
    id: crypto.randomUUID(),
    age: character.age,
    title: 'Pregnant',
    description: 'You discovered you\'re pregnant! This will change everything.',
    statChanges: { happiness: -10, health: -5, reputation: -15 },
    timestamp: new Date(),
    type: 'negative' as const,
    category: 'general'
  };

  return { character: updatedCharacter, event };
}

export function updateGroundedStatus(character: Character): Character {
  if (character.isGrounded && character.age >= character.groundedUntilAge) {
    return {
      ...character,
      isGrounded: false,
      groundedUntilAge: 0
    };
  }
  return character;
}

export function generateTeenagerEvent(character: Character): GameEvent | null {
  if (character.age < 13) return null;

  // Higher chance of events based on risk meter
  const riskMultiplier = 1 + (character.riskMeter / 100);
  
  const events = [
    {
      title: 'Peer Pressure',
      description: 'Some friends tried to pressure you into doing something you weren\'t comfortable with.',
      statChanges: { happiness: -3, reputation: Math.random() < 0.5 ? -2 : 2 },
      type: 'negative' as const,
      probability: 0.08 * riskMultiplier
    },
    {
      title: 'School Dance',
      description: 'You went to the school dance and had a great time!',
      statChanges: { happiness: 8, reputation: 3 },
      type: 'positive' as const,
      probability: 0.06
    },
    {
      title: 'Got in Trouble',
      description: 'You got in trouble at school for talking back to a teacher.',
      statChanges: { happiness: -5, reputation: -8 },
      type: 'negative' as const,
      probability: 0.1 * riskMultiplier
    },
    {
      title: 'Popular Crowd',
      description: 'You started hanging out with the popular kids at school.',
      statChanges: { happiness: 6, reputation: 10, looks: 2 },
      type: 'positive' as const,
      probability: 0.05
    }
  ];

  const availableEvents = events.filter(event => Math.random() < event.probability);
  if (availableEvents.length === 0) return null;

  const selectedEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];

  return {
    id: crypto.randomUUID(),
    age: character.age,
    title: selectedEvent.title,
    description: selectedEvent.description,
    statChanges: selectedEvent.statChanges,
    timestamp: new Date(),
    type: selectedEvent.type,
    category: 'general'
  };
}