import { Character, Achievement, GameEvent } from '../types/game';

const ACHIEVEMENT_DEFINITIONS = [
  {
    id: 'troublemaker',
    title: 'Troublemaker',
    description: 'Got grounded 3 times in a row',
    icon: '😈',
    check: (character: Character, events: GameEvent[]) => {
      const groundedEvents = events.filter(e => e.title === 'Got Grounded').slice(-3);
      return groundedEvents.length === 3;
    }
  },
  {
    id: 'honor_student',
    title: 'Honor Student',
    description: 'Made honor roll 5 times',
    icon: '🎓',
    check: (character: Character, events: GameEvent[]) => {
      const honorRollEvents = events.filter(e => e.title === 'Made Honor Roll');
      return honorRollEvents.length >= 5;
    }
  },
  {
    id: 'family_favorite',
    title: 'Family Favorite',
    description: 'Maintain 90+ closeness with all family members',
    icon: '👨‍👩‍👧‍👦',
    check: (character: Character, events: GameEvent[]) => {
      const allFamily = [character.family.mother, character.family.father, ...character.family.siblings];
      return allFamily.every(member => member.closeness >= 90);
    }
  },
  {
    id: 'rebel',
    title: 'Rebel',
    description: 'Skipped class 10 times',
    icon: '🚫',
    check: (character: Character, events: GameEvent[]) => {
      const skippedEvents = events.filter(e => e.title === 'Skipped Class');
      return skippedEvents.length >= 10;
    }
  },
  {
    id: 'social_butterfly',
    title: 'Social Butterfly',
    description: 'Made new friends 15 times',
    icon: '🦋',
    check: (character: Character, events: GameEvent[]) => {
      const friendEvents = events.filter(e => e.title === 'Made New Friends');
      return friendEvents.length >= 15;
    }
  },
  {
    id: 'survivor',
    title: 'Survivor',
    description: 'Lived to age 80',
    icon: '🏆',
    check: (character: Character, events: GameEvent[]) => {
      return character.age >= 80 && character.isAlive;
    }
  },
  {
    id: 'genius',
    title: 'Genius',
    description: 'Maintain 95+ smarts for 10 years',
    icon: '🧠',
    check: (character: Character, events: GameEvent[]) => {
      // This would need more complex tracking, simplified for now
      return character.stats.smarts >= 95 && character.age >= 10;
    }
  },
  {
    id: 'money_bags',
    title: 'Money Bags',
    description: 'Successfully asked family for money 20 times',
    icon: '💰',
    check: (character: Character, events: GameEvent[]) => {
      const moneyEvents = events.filter(e => 
        e.title.includes('Asked') && e.title.includes('for Money') && e.type === 'positive'
      );
      return moneyEvents.length >= 20;
    }
  }
];

export function checkAchievements(character: Character, events: GameEvent[]): Achievement[] {
  const newAchievements: Achievement[] = [];
  const existingAchievementIds = character.achievements.map(a => a.id);

  ACHIEVEMENT_DEFINITIONS.forEach(def => {
    if (!existingAchievementIds.includes(def.id) && def.check(character, events)) {
      newAchievements.push({
        id: def.id,
        title: def.title,
        description: def.description,
        icon: def.icon,
        unlockedAt: new Date()
      });
    }
  });

  return newAchievements;
}