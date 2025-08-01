import { Character, GameEvent, CrimeAction, PrisonRecord, PrisonEvent, CriminalRecord } from '../types/game';

export const CRIME_ACTIONS: CrimeAction[] = [
  {
    id: 'steal_car',
    name: 'Steal Car',
    description: 'Attempt to steal a parked car',
    difficulty: 'medium',
    baseSuccessRate: 0.4,
    minReward: 2000,
    maxReward: 15000,
    jailTimeRange: [1, 3],
    requiredStats: { smarts: 30 },
    wantedLevelIncrease: 2
  },
  {
    id: 'rob_bank',
    name: 'Rob Bank',
    description: 'Plan and execute a bank robbery',
    difficulty: 'extreme',
    baseSuccessRate: 0.15,
    minReward: 50000,
    maxReward: 500000,
    jailTimeRange: [10, 25],
    requiredStats: { smarts: 60, health: 70 },
    wantedLevelIncrease: 5
  },
  {
    id: 'murder',
    name: 'Murder',
    description: 'Commit murder (extremely dangerous)',
    difficulty: 'extreme',
    baseSuccessRate: 0.3,
    minReward: 0,
    maxReward: 0,
    jailTimeRange: [25, 50],
    requiredStats: { health: 50 },
    wantedLevelIncrease: 5
  },
  {
    id: 'smuggle_drugs',
    name: 'Smuggle Drugs',
    description: 'Transport illegal substances across borders',
    difficulty: 'hard',
    baseSuccessRate: 0.25,
    minReward: 10000,
    maxReward: 100000,
    jailTimeRange: [5, 15],
    requiredStats: { smarts: 40, reputation: 30 },
    wantedLevelIncrease: 3
  },
  {
    id: 'counterfeit',
    name: 'Counterfeit Money',
    description: 'Create and distribute fake currency',
    difficulty: 'hard',
    baseSuccessRate: 0.35,
    minReward: 5000,
    maxReward: 50000,
    jailTimeRange: [3, 10],
    requiredStats: { smarts: 70 },
    wantedLevelIncrease: 2
  },
  {
    id: 'pickpocket',
    name: 'Pickpocket',
    description: 'Steal from unsuspecting pedestrians',
    difficulty: 'easy',
    baseSuccessRate: 0.6,
    minReward: 50,
    maxReward: 500,
    jailTimeRange: [0.1, 1],
    wantedLevelIncrease: 1
  }
];

export function commitCrime(character: Character, crimeId: string): { character: Character; event: GameEvent } {
  const crime = CRIME_ACTIONS.find(c => c.id === crimeId);
  if (!crime) {
    throw new Error('Crime not found');
  }

  // Calculate success rate based on stats
  let successRate = crime.baseSuccessRate;
  
  if (crime.requiredStats) {
    for (const [stat, required] of Object.entries(crime.requiredStats)) {
      const characterStat = character.stats[stat as keyof Character['stats']];
      if (characterStat >= required + 20) successRate += 0.2;
      else if (characterStat >= required) successRate += 0.1;
      else successRate -= 0.2;
    }
  }

  // Wanted level affects success rate
  successRate -= character.criminalStatus.wantedLevel * 0.05;
  
  const success = Math.random() < Math.max(0.05, successRate);
  const caught = !success || Math.random() < 0.3; // Even successful crimes can lead to capture

  let updatedCharacter = {
    ...character,
    criminalStatus: {
      ...character.criminalStatus,
      totalCrimesCommitted: character.criminalStatus.totalCrimesCommitted + 1
    }
  };

  let event: GameEvent;

  if (success && !caught) {
    // Successful crime
    const reward = Math.floor(Math.random() * (crime.maxReward - crime.minReward) + crime.minReward);
    
    updatedCharacter = {
      ...updatedCharacter,
      stats: {
        ...updatedCharacter.stats,
        money: updatedCharacter.stats.money + reward
      },
      criminalStatus: {
        ...updatedCharacter.criminalStatus,
        wantedLevel: Math.min(5, updatedCharacter.criminalStatus.wantedLevel + crime.wantedLevelIncrease)
      }
    };

    event = {
      id: crypto.randomUUID(),
      age: character.age,
      title: `Successful ${crime.name}`,
      description: `You successfully committed ${crime.name.toLowerCase()} and got away with $${reward.toLocaleString()}!`,
      statChanges: { happiness: 10, reputation: -5 },
      timestamp: new Date(),
      type: 'positive',
      category: 'criminal'
    };
  } else {
    // Caught or failed
    const jailTime = Math.random() * (crime.jailTimeRange[1] - crime.jailTimeRange[0]) + crime.jailTimeRange[0];
    
    const criminalRecord: CriminalRecord = {
      id: crypto.randomUUID(),
      crime: crime.name,
      age: character.age,
      punishment: `${Math.ceil(jailTime)} years in prison`,
      timestamp: new Date()
    };

    updatedCharacter = {
      ...updatedCharacter,
      criminalRecord: [...character.criminalRecord, criminalRecord],
      isInPrison: true,
      prisonReleaseAge: character.age + Math.ceil(jailTime),
      criminalStatus: {
        ...updatedCharacter.criminalStatus,
        timesSentenced: updatedCharacter.criminalStatus.timesSentenced + 1,
        totalJailTime: updatedCharacter.criminalStatus.totalJailTime + jailTime,
        wantedLevel: Math.min(5, updatedCharacter.criminalStatus.wantedLevel + crime.wantedLevelIncrease)
      }
    };

    event = {
      id: crypto.randomUUID(),
      age: character.age,
      title: `Caught: ${crime.name}`,
      description: `You were caught attempting ${crime.name.toLowerCase()} and sentenced to ${Math.ceil(jailTime)} years in prison!`,
      statChanges: { happiness: -20, reputation: -15, health: -5 },
      timestamp: new Date(),
      type: 'negative',
      category: 'criminal'
    };
  }

  return { character: updatedCharacter, event };
}

export function attemptPrisonEscape(character: Character): { character: Character; event: GameEvent } {
  if (!character.isInPrison) {
    throw new Error('Character is not in prison');
  }

  const escapeChance = 0.1 + (character.stats.smarts / 1000) + (character.stats.health / 1000);
  const success = Math.random() < escapeChance;

  let updatedCharacter = { ...character };
  let event: GameEvent;

  if (success) {
    updatedCharacter = {
      ...updatedCharacter,
      isInPrison: false,
      prisonReleaseAge: undefined,
      criminalStatus: {
        ...updatedCharacter.criminalStatus,
        wantedLevel: 5 // Maximum wanted level for escaping
      }
    };

    event = {
      id: crypto.randomUUID(),
      age: character.age,
      title: 'Prison Escape Successful',
      description: 'You successfully escaped from prison! You\'re now a fugitive.',
      statChanges: { happiness: 15, health: -10 },
      timestamp: new Date(),
      type: 'positive',
      category: 'prison'
    };
  } else {
    // Failed escape - extend sentence
    const additionalTime = 1 + Math.random() * 2; // 1-3 additional years
    updatedCharacter = {
      ...updatedCharacter,
      prisonReleaseAge: (character.prisonReleaseAge || character.age) + additionalTime
    };

    event = {
      id: crypto.randomUUID(),
      age: character.age,
      title: 'Prison Escape Failed',
      description: `Your escape attempt failed! Your sentence was extended by ${Math.ceil(additionalTime)} years.`,
      statChanges: { happiness: -15, health: -5 },
      timestamp: new Date(),
      type: 'negative',
      category: 'prison'
    };
  }

  return { character: updatedCharacter, event };
}

export function bribePrisonGuard(character: Character): { character: Character; event: GameEvent } {
  if (!character.isInPrison) {
    throw new Error('Character is not in prison');
  }

  const bribeAmount = 10000 + Math.random() * 20000; // $10k-30k
  
  if (character.stats.money < bribeAmount) {
    const event: GameEvent = {
      id: crypto.randomUUID(),
      age: character.age,
      title: 'Bribery Failed',
      description: `You don't have enough money to bribe the guard. You need $${bribeAmount.toLocaleString()}.`,
      statChanges: { happiness: -5 },
      timestamp: new Date(),
      type: 'negative',
      category: 'prison'
    };
    return { character, event };
  }

  const success = Math.random() < 0.4; // 40% success rate
  
  let updatedCharacter = {
    ...character,
    stats: {
      ...character.stats,
      money: character.stats.money - bribeAmount
    }
  };

  let event: GameEvent;

  if (success) {
    const timeReduction = 1 + Math.random() * 2; // 1-3 years reduced
    updatedCharacter = {
      ...updatedCharacter,
      prisonReleaseAge: Math.max(character.age + 0.5, (character.prisonReleaseAge || character.age) - timeReduction)
    };

    event = {
      id: crypto.randomUUID(),
      age: character.age,
      title: 'Successful Bribery',
      description: `You successfully bribed a guard and reduced your sentence by ${Math.ceil(timeReduction)} years!`,
      statChanges: { happiness: 10 },
      timestamp: new Date(),
      type: 'positive',
      category: 'prison'
    };
  } else {
    // Failed bribery - extend sentence
    const additionalTime = 0.5 + Math.random(); // 0.5-1.5 additional years
    updatedCharacter = {
      ...updatedCharacter,
      prisonReleaseAge: (character.prisonReleaseAge || character.age) + additionalTime
    };

    event = {
      id: crypto.randomUUID(),
      age: character.age,
      title: 'Bribery Backfired',
      description: `The guard reported your bribery attempt! Your sentence was extended by ${Math.ceil(additionalTime * 12)} months.`,
      statChanges: { happiness: -10, reputation: -5 },
      timestamp: new Date(),
      type: 'negative',
      category: 'prison'
    };
  }

  return { character: updatedCharacter, event };
}

export function generatePrisonEvent(character: Character): GameEvent | null {
  if (!character.isInPrison) return null;

  const events = [
    {
      title: 'Prison Fight',
      description: 'You got into a fight with another inmate.',
      statChanges: { health: -10, reputation: 5 },
      type: 'negative' as const,
      probability: 0.15
    },
    {
      title: 'Good Behavior',
      description: 'Your good behavior was noticed by the guards.',
      statChanges: { happiness: 5 },
      type: 'positive' as const,
      probability: 0.1,
      effect: (char: Character) => ({
        ...char,
        prisonReleaseAge: Math.max(char.age + 0.1, (char.prisonReleaseAge || char.age) - 0.2)
      })
    },
    {
      title: 'Contraband Found',
      description: 'Guards found contraband in your cell during a search.',
      statChanges: { happiness: -8 },
      type: 'negative' as const,
      probability: 0.08,
      effect: (char: Character) => ({
        ...char,
        prisonReleaseAge: (char.prisonReleaseAge || char.age) + 0.5
      })
    },
    {
      title: 'Prison Job',
      description: 'You got a job in the prison kitchen.',
      statChanges: { happiness: 3, smarts: 1 },
      type: 'positive' as const,
      probability: 0.12
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
    category: 'prison'
  };
}

export function checkPrisonRelease(character: Character): { character: Character; event: GameEvent | null } {
  if (!character.isInPrison || !character.prisonReleaseAge) {
    return { character, event: null };
  }

  if (character.age >= character.prisonReleaseAge) {
    const updatedCharacter = {
      ...character,
      isInPrison: false,
      prisonReleaseAge: undefined,
      criminalStatus: {
        ...character.criminalStatus,
        wantedLevel: Math.max(0, character.criminalStatus.wantedLevel - 1)
      }
    };

    const event: GameEvent = {
      id: crypto.randomUUID(),
      age: character.age,
      title: 'Released from Prison',
      description: 'You have been released from prison and are ready to start a new chapter in your life.',
      statChanges: { happiness: 20, health: -5 },
      timestamp: new Date(),
      type: 'positive',
      category: 'prison'
    };

    return { character: updatedCharacter, event };
  }

  return { character, event: null };
}