import { GameEvent, Character } from '../types/game';

interface EventTemplate {
  title: string;
  description: string;
  statChanges: Partial<Character['stats']>;
  type: 'positive' | 'negative' | 'neutral';
  ageRange: [number, number];
  probability: number;
}

const EVENT_TEMPLATES: EventTemplate[] = [
  // Childhood Events (0-12)
  {
    title: 'Caught a Cold',
    description: 'You came down with a nasty cold and had to stay home from school for a week.',
    statChanges: { health: -5, happiness: -3 },
    type: 'negative',
    ageRange: [1, 12],
    probability: 0.15
  },
  {
    title: 'Made a Best Friend',
    description: 'You met someone special at school who became your best friend!',
    statChanges: { happiness: 8, smarts: 2 },
    type: 'positive',
    ageRange: [3, 12],
    probability: 0.12
  },
  {
    title: 'Won a School Competition',
    description: 'Your hard work paid off when you won first place in the school science fair!',
    statChanges: { smarts: 6, happiness: 5 },
    type: 'positive',
    ageRange: [6, 12],
    probability: 0.08
  },
  {
    title: 'Got into a Fight',
    description: 'You got into a playground fight and both of you got in trouble.',
    statChanges: { happiness: -4, health: -3 },
    type: 'negative',
    ageRange: [4, 12],
    probability: 0.1
  },
  {
    title: 'Family Vacation',
    description: 'Your family went on an amazing vacation to the beach!',
    statChanges: { happiness: 10, health: 3 },
    type: 'positive',
    ageRange: [2, 12],
    probability: 0.06
  },
  {
    title: 'Started Reading Books',
    description: 'You discovered a love for reading and spent hours at the library.',
    statChanges: { smarts: 5, happiness: 3 },
    type: 'positive',
    ageRange: [4, 12],
    probability: 0.1
  },
  {
    title: 'Broke Your Arm',
    description: 'You fell off your bike and broke your arm. It took weeks to heal.',
    statChanges: { health: -10, happiness: -5 },
    type: 'negative',
    ageRange: [3, 12],
    probability: 0.05
  },
  {
    title: 'Adopted a Pet',
    description: 'Your family adopted a cute puppy who became your loyal companion.',
    statChanges: { happiness: 12, health: 2 },
    type: 'positive',
    ageRange: [2, 12],
    probability: 0.07
  },

  // Teen Events (13-17)
  {
    title: 'First Crush',
    description: 'You developed your first crush and felt butterflies in your stomach.',
    statChanges: { happiness: 6, looks: 2 },
    type: 'positive',
    ageRange: [13, 17],
    probability: 0.15
  },
  {
    title: 'Failed a Test',
    description: 'You failed an important test and your parents were disappointed.',
    statChanges: { smarts: -3, happiness: -8 },
    type: 'negative',
    ageRange: [13, 17],
    probability: 0.12
  },
  {
    title: 'Joined Sports Team',
    description: 'You made it onto the school basketball team and got into great shape!',
    statChanges: { health: 8, happiness: 6, looks: 3 },
    type: 'positive',
    ageRange: [13, 17],
    probability: 0.1
  },
  {
    title: 'Got Acne',
    description: 'Teenage hormones hit hard and you broke out in acne.',
    statChanges: { looks: -6, happiness: -4 },
    type: 'negative',
    ageRange: [13, 17],
    probability: 0.2
  },
  {
    title: 'Won Prom King/Queen',
    description: 'You were voted Prom King/Queen by your classmates!',
    statChanges: { happiness: 15, looks: 5 },
    type: 'positive',
    ageRange: [16, 17],
    probability: 0.03
  },
  {
    title: 'Got First Job',
    description: 'You got your first part-time job at a local store.',
    statChanges: { smarts: 3, happiness: 4 },
    type: 'positive',
    ageRange: [15, 17],
    probability: 0.08
  },

  // Adult Events (18+)
  {
    title: 'Graduated College',
    description: 'You worked hard and graduated with your degree!',
    statChanges: { smarts: 10, happiness: 12 },
    type: 'positive',
    ageRange: [21, 25],
    probability: 0.15
  },
  {
    title: 'Got Promoted',
    description: 'Your hard work was recognized and you got a promotion at work!',
    statChanges: { happiness: 8, smarts: 3 },
    type: 'positive',
    ageRange: [22, 65],
    probability: 0.1
  },
  {
    title: 'Car Accident',
    description: 'You were in a minor car accident but thankfully only got bruised.',
    statChanges: { health: -8, happiness: -5 },
    type: 'negative',
    ageRange: [18, 80],
    probability: 0.06
  },
  {
    title: 'Fell in Love',
    description: 'You met someone special and fell deeply in love!',
    statChanges: { happiness: 15, health: 3 },
    type: 'positive',
    ageRange: [18, 40],
    probability: 0.08
  },
  {
    title: 'Started Exercising',
    description: 'You decided to get in shape and started a regular exercise routine.',
    statChanges: { health: 10, looks: 5, happiness: 4 },
    type: 'positive',
    ageRange: [18, 60],
    probability: 0.09
  },

  // General aging events
  {
    title: 'Another Year Older',
    description: 'You celebrated another birthday with family and friends.',
    statChanges: { happiness: 2 },
    type: 'neutral',
    ageRange: [1, 100],
    probability: 0.3
  },
  {
    title: 'Feeling Older',
    description: 'The years are starting to catch up with you.',
    statChanges: { health: -1, looks: -1 },
    type: 'negative',
    ageRange: [30, 100],
    probability: 0.2
  }
];

export function generateRandomEvent(character: Character): GameEvent | null {
  const availableEvents = EVENT_TEMPLATES.filter(
    template => character.age >= template.ageRange[0] && 
                character.age <= template.ageRange[1] &&
                Math.random() < template.probability
  );

  if (availableEvents.length === 0) return null;

  const template = availableEvents[Math.floor(Math.random() * availableEvents.length)];
  
  return {
    id: crypto.randomUUID(),
    age: character.age,
    title: template.title,
    description: template.description,
    statChanges: template.statChanges,
    timestamp: new Date(),
    type: template.type
  };
}

export function applyStatChanges(character: Character, statChanges: Partial<Character['stats']>): Character {
  const newStats = { ...character.stats };
  
  Object.entries(statChanges).forEach(([stat, change]) => {
    if (typeof change === 'number') {
      newStats[stat as keyof Character['stats']] = Math.max(0, Math.min(100, newStats[stat as keyof Character['stats']] + change));
    }
  });

  return {
    ...character,
    stats: newStats
  };
}
