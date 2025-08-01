import { Character, Child, GameEvent } from '../types/game';

const CHILD_NAMES = {
  male: ['Alexander', 'Benjamin', 'Christopher', 'Daniel', 'Ethan', 'Felix', 'Gabriel', 'Henry', 'Isaac', 'Jacob', 'Kevin', 'Liam', 'Mason', 'Noah', 'Oliver', 'Patrick', 'Quinn', 'Ryan', 'Samuel', 'Thomas'],
  female: ['Abigail', 'Bella', 'Charlotte', 'Diana', 'Emma', 'Faith', 'Grace', 'Hannah', 'Isabella', 'Julia', 'Katherine', 'Luna', 'Mia', 'Natalie', 'Olivia', 'Penelope', 'Quinn', 'Ruby', 'Sophia', 'Taylor']
};

const CHILD_ACTIVITIES = [
  'Playing with toys', 'Reading books', 'Drawing pictures', 'Playing sports', 'Learning music',
  'Studying hard', 'Making friends', 'Exploring nature', 'Building things', 'Helping others',
  'Playing video games', 'Dancing', 'Cooking', 'Gardening', 'Writing stories'
];

export function haveChild(character: Character, partnerName?: string): { character: Character; event: GameEvent } {
  const childGender = Math.random() < 0.5 ? 'male' : 'female';
  const childName = CHILD_NAMES[childGender][Math.floor(Math.random() * CHILD_NAMES[childGender].length)];
  
  // Inherit stats from parents (mix of character's stats and some randomness)
  const inheritedStats = {
    health: Math.max(30, Math.min(100, character.stats.physicalHealth + (Math.random() * 40 - 20))),
    smarts: Math.max(30, Math.min(100, character.stats.smarts + (Math.random() * 40 - 20))),
    looks: Math.max(30, Math.min(100, character.stats.looks + (Math.random() * 40 - 20))),
    happiness: Math.max(50, Math.min(100, character.stats.happiness + (Math.random() * 30 - 15)))
  };

  const newChild: Child = {
    id: crypto.randomUUID(),
    name: childName,
    gender: childGender,
    age: 0,
    bornAt: character.age,
    stats: inheritedStats,
    relationship: 80 + Math.random() * 20, // Start with good relationship
    isAlive: true,
    achievements: [],
    currentActivity: 'Sleeping peacefully',
    genetics: {
      healthPredisposition: character.genetics.healthPredisposition + (Math.random() * 20 - 10),
      longevityGenes: character.genetics.longevityGenes + (Math.random() * 20 - 10)
    },
    otherParent: partnerName
  };

  const updatedCharacter = {
    ...character,
    children: [...character.children, newChild],
    stats: {
      ...character.stats,
      happiness: Math.min(100, character.stats.happiness + 15),
      money: Math.max(0, character.stats.money - 5000) // Hospital costs
    }
  };

  const event: GameEvent = {
    id: crypto.randomUUID(),
    age: character.age,
    title: 'Had a Baby!',
    description: `Congratulations! You welcomed ${childName} into the world. ${partnerName ? `${partnerName} is the other parent.` : 'You\'re raising them as a single parent.'} Hospital costs: $5,000.`,
    statChanges: { happiness: 15, money: -5000 },
    timestamp: new Date(),
    type: 'positive',
    category: 'family'
  };

  return { character: updatedCharacter, event };
}

export function interactWithChild(
  character: Character,
  childId: string,
  action: 'play' | 'teach' | 'punish' | 'support' | 'ignore'
): { character: Character; event: GameEvent } {
  const child = character.children.find(c => c.id === childId);
  if (!child || !child.isAlive) {
    throw new Error('Child not found or not alive');
  }

  let relationshipChange = 0;
  let childStatChanges: Partial<Child['stats']> = {};
  let parentStatChanges: Partial<Character['stats']> = {};
  let title = '';
  let description = '';
  let eventType: 'positive' | 'negative' | 'neutral' = 'neutral';

  switch (action) {
    case 'play':
      relationshipChange = Math.floor(Math.random() * 5) + 3;
      childStatChanges = { happiness: Math.floor(Math.random() * 10) + 5 };
      parentStatChanges = { happiness: 3 };
      title = `Played with ${child.name}`;
      description = `You spent quality time playing with ${child.name}. They loved every minute of it!`;
      eventType = 'positive';
      break;

    case 'teach':
      relationshipChange = Math.floor(Math.random() * 3) + 1;
      childStatChanges = { smarts: Math.floor(Math.random() * 8) + 2 };
      parentStatChanges = { happiness: 2 };
      title = `Taught ${child.name}`;
      description = `You spent time teaching ${child.name} new things. They're getting smarter!`;
      eventType = 'positive';
      break;

    case 'punish':
      relationshipChange = -(Math.floor(Math.random() * 8) + 3);
      childStatChanges = { happiness: -(Math.floor(Math.random() * 15) + 5) };
      parentStatChanges = { happiness: -2 };
      title = `Punished ${child.name}`;
      description = `You had to discipline ${child.name} for misbehaving. They weren't happy about it.`;
      eventType = 'negative';
      break;

    case 'support':
      relationshipChange = Math.floor(Math.random() * 8) + 5;
      childStatChanges = { happiness: Math.floor(Math.random() * 12) + 8 };
      parentStatChanges = { happiness: 5, money: -100 };
      title = `Supported ${child.name}`;
      description = `You provided emotional and financial support to ${child.name}. They feel loved and secure.`;
      eventType = 'positive';
      break;

    case 'ignore':
      relationshipChange = -(Math.floor(Math.random() * 5) + 2);
      childStatChanges = { happiness: -(Math.floor(Math.random() * 8) + 3) };
      title = `Ignored ${child.name}`;
      description = `You were too busy to spend time with ${child.name}. They felt neglected.`;
      eventType = 'negative';
      break;
  }

  // Update child
  const updatedChildren = character.children.map(c => {
    if (c.id === childId) {
      return {
        ...c,
        relationship: Math.max(0, Math.min(100, c.relationship + relationshipChange)),
        stats: {
          ...c.stats,
          health: Math.max(0, Math.min(100, c.stats.health + (childStatChanges.health || 0))),
          smarts: Math.max(0, Math.min(100, c.stats.smarts + (childStatChanges.smarts || 0))),
          looks: Math.max(0, Math.min(100, c.stats.looks + (childStatChanges.looks || 0))),
          happiness: Math.max(0, Math.min(100, c.stats.happiness + (childStatChanges.happiness || 0)))
        }
      };
    }
    return c;
  });

  const updatedCharacter = {
    ...character,
    children: updatedChildren,
    stats: {
      ...character.stats,
      happiness: Math.max(0, Math.min(100, character.stats.happiness + (parentStatChanges.happiness || 0))),
      money: Math.max(0, character.stats.money + (parentStatChanges.money || 0))
    }
  };

  const event: GameEvent = {
    id: crypto.randomUUID(),
    age: character.age,
    title,
    description,
    statChanges: parentStatChanges,
    timestamp: new Date(),
    type: eventType,
    category: 'family'
  };

  return { character: updatedCharacter, event };
}

export function ageChildren(character: Character): Character {
  const updatedChildren = character.children.map(child => {
    if (!child.isAlive) return child;

    const newAge = child.age + 1;
    let newActivity = child.currentActivity;

    // Update activity based on age
    if (newAge >= 3) {
      newActivity = CHILD_ACTIVITIES[Math.floor(Math.random() * CHILD_ACTIVITIES.length)];
    }

    // Random stat changes as they grow
    const statChanges = {
      health: Math.floor(Math.random() * 6) - 3, // -3 to +3
      smarts: Math.floor(Math.random() * 8) - 2, // -2 to +5 (generally positive)
      looks: Math.floor(Math.random() * 4) - 2, // -2 to +2
      happiness: Math.floor(Math.random() * 10) - 5 // -5 to +5
    };

    // Add achievements at certain ages
    const newAchievements = [...child.achievements];
    if (newAge === 5 && !newAchievements.includes('Started School')) {
      newAchievements.push('Started School');
    }
    if (newAge === 10 && child.stats.smarts > 80 && !newAchievements.includes('Honor Student')) {
      newAchievements.push('Honor Student');
    }
    if (newAge === 16 && !newAchievements.includes('Got Driver\'s License')) {
      newAchievements.push('Got Driver\'s License');
    }
    if (newAge === 18 && !newAchievements.includes('Became Adult')) {
      newAchievements.push('Became Adult');
    }

    return {
      ...child,
      age: newAge,
      currentActivity: newActivity,
      achievements: newAchievements,
      stats: {
        health: Math.max(0, Math.min(100, child.stats.health + statChanges.health)),
        smarts: Math.max(0, Math.min(100, child.stats.smarts + statChanges.smarts)),
        looks: Math.max(0, Math.min(100, child.stats.looks + statChanges.looks)),
        happiness: Math.max(0, Math.min(100, child.stats.happiness + statChanges.happiness))
      }
    };
  });

  return {
    ...character,
    children: updatedChildren
  };
}

export function generateChildEvent(character: Character): GameEvent | null {
  if (character.children.length === 0) return null;

  const aliveChildren = character.children.filter(c => c.isAlive);
  if (aliveChildren.length === 0) return null;

  const child = aliveChildren[Math.floor(Math.random() * aliveChildren.length)];

  const events = [
    {
      title: `${child.name}'s Achievement`,
      description: `${child.name} did something amazing! They're growing up so fast.`,
      statChanges: { happiness: 5 },
      type: 'positive' as const,
      probability: 0.1
    },
    {
      title: `${child.name} Got Sick`,
      description: `${child.name} came down with a fever. You took care of them until they felt better.`,
      statChanges: { happiness: -3, money: -200 },
      type: 'negative' as const,
      probability: 0.08
    },
    {
      title: `${child.name}'s School Event`,
      description: `${child.name} participated in a school event. You're so proud of them!`,
      statChanges: { happiness: 4 },
      type: 'positive' as const,
      probability: 0.12
    },
    {
      title: `Quality Time with ${child.name}`,
      description: `You spent a wonderful day with ${child.name}. These moments are precious.`,
      statChanges: { happiness: 6 },
      type: 'positive' as const,
      probability: 0.15
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
    category: 'family'
  };
}