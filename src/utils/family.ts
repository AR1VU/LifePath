import { Character, GameEvent, FamilyMember } from '../types/game';

export function generateFamilyEvent(character: Character): GameEvent | null {
  const familyMembers = [
    character.family.mother,
    character.family.father,
    ...character.family.siblings
  ].filter(member => member.isAlive);

  if (familyMembers.length === 0) return null;

  const events = [
    // Parent Events
    {
      title: 'Family Vacation',
      description: 'Your family went on a wonderful vacation together!',
      statChanges: { happiness: 12, health: 5 },
      type: 'positive' as const,
      probability: 0.06,
      relations: ['mother', 'father']
    },
    {
      title: 'Got Grounded',
      description: 'You got in trouble and were grounded for a week.',
      statChanges: { happiness: -8 },
      type: 'negative' as const,
      probability: 0.08,
      relations: ['mother', 'father']
    },
    {
      title: 'Received Allowance',
      description: 'Your parents gave you your weekly allowance!',
      statChanges: { happiness: 4 },
      type: 'positive' as const,
      probability: 0.15,
      relations: ['mother', 'father']
    },
    {
      title: 'Parents Divorced',
      description: 'Your parents decided to get divorced. It was a difficult time.',
      statChanges: { happiness: -15, health: -5 },
      type: 'negative' as const,
      probability: 0.02,
      relations: ['mother', 'father']
    },
    {
      title: 'Birthday Gift',
      description: 'You received an amazing birthday gift from your family!',
      statChanges: { happiness: 10 },
      type: 'positive' as const,
      probability: 0.1,
      relations: ['mother', 'father', 'sibling']
    },
    // Sibling Events
    {
      title: 'Sibling Fight',
      description: 'You got into a big argument with your sibling.',
      statChanges: { happiness: -6, health: -2 },
      type: 'negative' as const,
      probability: 0.12,
      relations: ['sibling']
    },
    {
      title: 'Sibling Bonding',
      description: 'You and your sibling had a great time together.',
      statChanges: { happiness: 8 },
      type: 'positive' as const,
      probability: 0.1,
      relations: ['sibling']
    },
    {
      title: 'Protected by Sibling',
      description: 'Your older sibling stood up for you when you were in trouble.',
      statChanges: { happiness: 6, health: 3 },
      type: 'positive' as const,
      probability: 0.05,
      relations: ['sibling']
    }
  ];

  const availableEvents = events.filter(event => {
    if (Math.random() >= event.probability) return false;
    
    // Check if we have family members of the required relation
    return event.relations.some(relation => 
      familyMembers.some(member => member.relation === relation)
    );
  });

  if (availableEvents.length === 0) return null;

  const selectedEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
  
  // Find a family member that matches the event
  const eligibleMembers = familyMembers.filter(member => 
    selectedEvent.relations.includes(member.relation)
  );
  
  const involvedMember = eligibleMembers[Math.floor(Math.random() * eligibleMembers.length)];

  return {
    id: crypto.randomUUID(),
    age: character.age,
    title: selectedEvent.title,
    description: selectedEvent.description.replace('your parents', involvedMember.name).replace('your sibling', involvedMember.name),
    statChanges: selectedEvent.statChanges,
    timestamp: new Date(),
    type: selectedEvent.type,
    category: 'family',
    familyMemberInvolved: involvedMember.id
  };
}

export function interactWithFamily(
  character: Character,
  familyMemberId: string,
  action: 'talk' | 'compliment' | 'insult' | 'ask_money'
): { character: Character; event: GameEvent } {
  const allFamily = [character.family.mother, character.family.father, ...character.family.siblings];
  const familyMember = allFamily.find(member => member.id === familyMemberId);
  
  if (!familyMember) {
    throw new Error('Family member not found');
  }

  let statChanges = {};
  let closenessChange = 0;
  let title = '';
  let description = '';
  let type: 'positive' | 'negative' | 'neutral' = 'neutral';

  switch (action) {
    case 'talk':
      closenessChange = Math.floor(Math.random() * 3) + 1;
      statChanges = { happiness: 2 };
      title = `Talked with ${familyMember.name}`;
      description = `You had a nice conversation with ${familyMember.name}.`;
      type = 'positive';
      break;
      
    case 'compliment':
      closenessChange = Math.floor(Math.random() * 5) + 3;
      statChanges = { happiness: 4 };
      title = `Complimented ${familyMember.name}`;
      description = `You gave ${familyMember.name} a heartfelt compliment.`;
      type = 'positive';
      break;
      
    case 'insult':
      closenessChange = -(Math.floor(Math.random() * 8) + 5);
      statChanges = { happiness: -3 };
      title = `Insulted ${familyMember.name}`;
      description = `You said something mean to ${familyMember.name}. They didn't take it well.`;
      type = 'negative';
      break;
      
    case 'ask_money':
      const success = Math.random() < (familyMember.closeness / 100) * 0.7;
      if (success) {
        const amount = Math.floor(Math.random() * 50) + 10;
        closenessChange = -2;
        statChanges = { happiness: 3 };
        title = `Asked ${familyMember.name} for Money`;
        description = `${familyMember.name} gave you $${amount}!`;
        type = 'positive';
        character = { ...character, money: character.money + amount };
      } else {
        closenessChange = -5;
        statChanges = { happiness: -4 };
        title = `Asked ${familyMember.name} for Money`;
        description = `${familyMember.name} refused to give you money.`;
        type = 'negative';
      }
      break;
  }

  // Update family member closeness
  const updatedFamilyMember = {
    ...familyMember,
    closeness: Math.max(0, Math.min(100, familyMember.closeness + closenessChange))
  };

  // Update character's family
  let updatedFamily = { ...character.family };
  if (familyMember.relation === 'mother') {
    updatedFamily.mother = updatedFamilyMember;
  } else if (familyMember.relation === 'father') {
    updatedFamily.father = updatedFamilyMember;
  } else {
    updatedFamily.siblings = updatedFamily.siblings.map(sibling =>
      sibling.id === familyMemberId ? updatedFamilyMember : sibling
    );
  }

  const updatedCharacter = {
    ...character,
    family: updatedFamily,
    stats: {
      ...character.stats,
      happiness: Math.max(0, Math.min(100, character.stats.happiness + (statChanges.happiness || 0)))
    }
  };

  const event: GameEvent = {
    id: crypto.randomUUID(),
    age: character.age,
    title,
    description,
    statChanges,
    timestamp: new Date(),
    type,
    category: 'family',
    familyMemberInvolved: familyMemberId
  };

  return { character: updatedCharacter, event };
}

export function ageFamilyMembers(character: Character): Character {
  return {
    ...character,
    family: {
      mother: { ...character.family.mother, age: character.family.mother.age + 1 },
      father: { ...character.family.father, age: character.family.father.age + 1 },
      siblings: character.family.siblings.map(sibling => ({
        ...sibling,
        age: sibling.age + 1
      }))
    }
  };
}