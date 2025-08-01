import { Character, GameEvent } from '../types/game';

export function applyAgingEffects(character: Character): { character: Character; events: GameEvent[] } {
  const events: GameEvent[] = [];
  let updatedCharacter = { ...character };

  // Aging effects start becoming noticeable after 40
  if (character.age >= 40) {
    const agingIntensity = Math.floor((character.age - 40) / 10); // 0-6 intensity levels
    
    // Physical health decline
    const healthDecline = Math.floor(Math.random() * (agingIntensity + 1));
    if (healthDecline > 0) {
      updatedCharacter.stats.physicalHealth = Math.max(10, updatedCharacter.stats.physicalHealth - healthDecline);
      
      if (healthDecline >= 3) {
        events.push({
          id: crypto.randomUUID(),
          age: character.age,
          title: 'Feeling Your Age',
          description: 'You\'re starting to feel the effects of aging. Your body isn\'t what it used to be.',
          statChanges: { physicalHealth: -healthDecline },
          timestamp: new Date(),
          type: 'negative',
          category: 'general'
        });
      }
    }

    // Looks decline (slower than health)
    if (character.age >= 50 && Math.random() < 0.3) {
      const looksDecline = Math.floor(Math.random() * 2) + 1;
      updatedCharacter.stats.looks = Math.max(10, updatedCharacter.stats.looks - looksDecline);
    }

    // Memory/cognitive effects after 60
    if (character.age >= 60 && Math.random() < 0.2) {
      const cognitiveDecline = Math.floor(Math.random() * 2) + 1;
      updatedCharacter.stats.smarts = Math.max(20, updatedCharacter.stats.smarts - cognitiveDecline);
      
      events.push({
        id: crypto.randomUUID(),
        age: character.age,
        title: 'Memory Lapses',
        description: 'You\'ve been having some minor memory lapses lately. It\'s probably just normal aging.',
        statChanges: { smarts: -cognitiveDecline },
        timestamp: new Date(),
        type: 'negative',
        category: 'general'
      });
    }

    // Wisdom/experience gains (positive aging effect)
    if (character.age >= 50 && Math.random() < 0.15) {
      const wisdomGain = Math.floor(Math.random() * 3) + 1;
      updatedCharacter.stats.reputation = Math.min(100, updatedCharacter.stats.reputation + wisdomGain);
      
      events.push({
        id: crypto.randomUUID(),
        age: character.age,
        title: 'Gained Wisdom',
        description: 'Your life experience has made you wiser and more respected in your community.',
        statChanges: { reputation: wisdomGain },
        timestamp: new Date(),
        type: 'positive',
        category: 'general'
      });
    }
  }

  // Retirement considerations
  if (character.age >= 65 && character.hasJob && Math.random() < 0.3) {
    const retirementPension = Math.floor((character.salary || 30000) * 0.6); // 60% of salary
    updatedCharacter = {
      ...updatedCharacter,
      hasJob: false,
      jobTitle: undefined,
      salary: undefined,
      stats: {
        ...updatedCharacter.stats,
        money: updatedCharacter.stats.money + retirementPension,
        happiness: updatedCharacter.stats.happiness + 10
      }
    };

    events.push({
      id: crypto.randomUUID(),
      age: character.age,
      title: 'Retired',
      description: `You decided to retire and enjoy your golden years. You received a retirement package of $${retirementPension.toLocaleString()}.`,
      statChanges: { happiness: 10, money: retirementPension },
      timestamp: new Date(),
      type: 'positive',
      category: 'general'
    });
  }

  return { character: updatedCharacter, events };
}