import { Character, GameEvent, LifeSummary } from '../types/game';

export function calculateLegacyScore(character: Character, events: GameEvent[]): number {
  let score = 0;

  // Base longevity score
  score += character.age * 2;

  // Wealth contribution
  const netWorth = character.stats.money + (character.finances?.savings || 0) - (character.finances?.debt || 0);
  score += Math.floor(netWorth / 10000); // 1 point per $10k

  // Family relationships
  const familyMembers = [character.family.mother, character.family.father, ...character.family.siblings];
  const avgFamilyCloseness = familyMembers.reduce((sum, member) => sum + member.closeness, 0) / familyMembers.length;
  score += Math.floor(avgFamilyCloseness / 10);

  // Children impact
  score += character.children.length * 15; // Having children is significant
  const avgChildRelationship = character.children.length > 0 
    ? character.children.reduce((sum, child) => sum + child.relationship, 0) / character.children.length 
    : 0;
  score += Math.floor(avgChildRelationship / 5);

  // Career achievements
  if (character.workExperience) {
    score += character.workExperience * 3;
  }
  if (character.jobLevel && character.jobLevel > 1) {
    score += (character.jobLevel - 1) * 5;
  }

  // Education
  if (character.education.currentLevel === 'graduated') {
    score += 20;
  }
  if (character.college?.isEnrolled || character.education.gpa > 3.5) {
    score += 15;
  }

  // Achievements
  score += character.achievements.length * 10;

  // Relationships
  score += character.relationships.length * 5;

  // Criminal record (negative impact)
  score -= character.criminalRecord.length * 10;
  score -= character.criminalStatus.totalJailTime * 5;

  // Health and lifestyle
  if (character.stats.addictions < 20) {
    score += 10; // Clean living bonus
  } else {
    score -= Math.floor(character.stats.addictions / 5); // Addiction penalty
  }

  // Positive life events
  const positiveEvents = events.filter(e => e.type === 'positive').length;
  const negativeEvents = events.filter(e => e.type === 'negative').length;
  score += positiveEvents * 2;
  score -= negativeEvents;

  // Charitable giving (if implemented in will)
  const totalCharityDonations = character.will.charityDonations.reduce((sum, donation) => sum + donation.amount, 0);
  score += Math.floor(totalCharityDonations / 1000);

  return Math.max(0, score);
}

export function generateLegacyDescription(character: Character, events: GameEvent[]): string {
  const legacyScore = character.legacyScore || calculateLegacyScore(character, events);
  
  if (legacyScore >= 500) {
    return "A legendary figure who will be remembered for generations. Their impact on the world was profound and lasting.";
  } else if (legacyScore >= 300) {
    return "A remarkable person who made significant contributions to their community and family. They lived a life worth celebrating.";
  } else if (legacyScore >= 200) {
    return "A good person who touched many lives. They will be fondly remembered by those who knew them.";
  } else if (legacyScore >= 100) {
    return "Someone who lived an ordinary but meaningful life. They had their ups and downs but made their mark.";
  } else if (legacyScore >= 50) {
    return "A person who struggled through life but persevered. They faced many challenges but never gave up.";
  } else {
    return "A troubled soul who faced many difficulties. Despite their struggles, they were still loved by some.";
  }
}

export function generateLegacyTimeline(events: GameEvent[]): GameEvent[] {
  // Filter and sort major life events for the timeline
  const majorEvents = events.filter(event => 
    event.title.includes('Born') ||
    event.title.includes('Graduated') ||
    event.title.includes('Married') ||
    event.title.includes('Had a Baby') ||
    event.title.includes('Got Hired') ||
    event.title.includes('Promoted') ||
    event.title.includes('Achievement') ||
    event.title.includes('Retired') ||
    event.title.includes('Died') ||
    event.type === 'positive' && Math.abs(Object.values(event.statChanges).reduce((sum, change) => sum + (change as number), 0)) >= 10
  );

  return majorEvents.sort((a, b) => a.age - b.age).slice(0, 20); // Top 20 events
}

export function createWill(character: Character): Character {
  // Auto-generate a basic will if none exists
  if (character.will.beneficiaries.length === 0 && character.will.charityDonations.length === 0) {
    const beneficiaries = [];
    
    // Add children as primary beneficiaries
    if (character.children.length > 0) {
      const childPercentage = Math.floor(80 / character.children.length);
      character.children.forEach(child => {
        if (child.isAlive) {
          beneficiaries.push({
            id: crypto.randomUUID(),
            name: child.name,
            relationship: 'Child',
            percentage: childPercentage,
            specificAssets: []
          });
        }
      });
    }

    // Add spouse if in active relationship
    const activeRelationship = character.relationships.find(r => r.isActive);
    if (activeRelationship) {
      beneficiaries.push({
        id: crypto.randomUUID(),
        name: activeRelationship.name,
        relationship: 'Spouse/Partner',
        percentage: character.children.length > 0 ? 20 : 50,
        specificAssets: []
      });
    }

    // Add parents if no children or spouse
    if (beneficiaries.length === 0) {
      if (character.family.mother.isAlive) {
        beneficiaries.push({
          id: crypto.randomUUID(),
          name: character.family.mother.name,
          relationship: 'Mother',
          percentage: character.family.father.isAlive ? 50 : 100,
          specificAssets: []
        });
      }
      if (character.family.father.isAlive) {
        beneficiaries.push({
          id: crypto.randomUUID(),
          name: character.family.father.name,
          relationship: 'Father',
          percentage: character.family.mother.isAlive ? 50 : 100,
          specificAssets: []
        });
      }
    }

    return {
      ...character,
      will: {
        beneficiaries,
        charityDonations: [],
        lastUpdated: character.age
      }
    };
  }

  return character;
}