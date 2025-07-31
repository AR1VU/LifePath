import { Character, GameEvent, Disease, HospitalVisit, LifeSummary } from '../types/game';

export const DISEASES = [
  // Physical Diseases
  {
    name: 'Common Cold',
    type: 'physical' as const,
    severity: 'mild' as const,
    isCurable: true,
    isFatal: false,
    treatmentCost: 50,
    statEffects: { physicalHealth: -5, happiness: -3 },
    description: 'A viral infection causing runny nose and fatigue.',
    symptoms: ['Runny nose', 'Cough', 'Fatigue'],
    probability: 0.15
  },
  {
    name: 'Flu',
    type: 'physical' as const,
    severity: 'moderate' as const,
    isCurable: true,
    isFatal: false,
    treatmentCost: 150,
    statEffects: { physicalHealth: -15, happiness: -8 },
    description: 'Influenza virus causing fever and body aches.',
    symptoms: ['Fever', 'Body aches', 'Severe fatigue'],
    probability: 0.08
  },
  {
    name: 'Pneumonia',
    type: 'physical' as const,
    severity: 'severe' as const,
    isCurable: true,
    isFatal: true,
    treatmentCost: 2500,
    statEffects: { physicalHealth: -25, happiness: -15 },
    description: 'Serious lung infection requiring immediate treatment.',
    symptoms: ['Difficulty breathing', 'Chest pain', 'High fever'],
    probability: 0.03
  },
  {
    name: 'Cancer',
    type: 'physical' as const,
    severity: 'terminal' as const,
    isCurable: false,
    isFatal: true,
    treatmentCost: 50000,
    statEffects: { physicalHealth: -40, happiness: -25, money: -10000 },
    description: 'Malignant tumor requiring extensive treatment.',
    symptoms: ['Unexplained weight loss', 'Fatigue', 'Pain'],
    probability: 0.01
  },
  {
    name: 'Heart Disease',
    type: 'physical' as const,
    severity: 'severe' as const,
    isCurable: false,
    isFatal: true,
    treatmentCost: 15000,
    statEffects: { physicalHealth: -30, happiness: -10 },
    description: 'Cardiovascular condition affecting heart function.',
    symptoms: ['Chest pain', 'Shortness of breath', 'Fatigue'],
    probability: 0.02
  },
  
  // Mental Health
  {
    name: 'Depression',
    type: 'mental' as const,
    severity: 'moderate' as const,
    isCurable: true,
    isFatal: false,
    treatmentCost: 1200,
    statEffects: { mentalHealth: -20, happiness: -25 },
    description: 'Persistent sadness and loss of interest.',
    symptoms: ['Persistent sadness', 'Loss of interest', 'Sleep problems'],
    probability: 0.06
  },
  {
    name: 'Anxiety Disorder',
    type: 'mental' as const,
    severity: 'moderate' as const,
    isCurable: true,
    isFatal: false,
    treatmentCost: 1000,
    statEffects: { mentalHealth: -15, happiness: -15 },
    description: 'Excessive worry and fear affecting daily life.',
    symptoms: ['Excessive worry', 'Panic attacks', 'Restlessness'],
    probability: 0.08
  },
  {
    name: 'Bipolar Disorder',
    type: 'mental' as const,
    severity: 'severe' as const,
    isCurable: false,
    isFatal: false,
    treatmentCost: 2500,
    statEffects: { mentalHealth: -25, happiness: -20, reputation: -5 },
    description: 'Extreme mood swings between mania and depression.',
    symptoms: ['Extreme mood swings', 'Manic episodes', 'Depression'],
    probability: 0.02
  },
  
  // Addictions
  {
    name: 'Alcohol Addiction',
    type: 'addiction' as const,
    severity: 'severe' as const,
    isCurable: true,
    isFatal: false,
    treatmentCost: 5000,
    statEffects: { addictions: 30, physicalHealth: -15, mentalHealth: -10 },
    description: 'Dependency on alcohol affecting health and relationships.',
    symptoms: ['Craving alcohol', 'Withdrawal symptoms', 'Loss of control'],
    probability: 0.04
  },
  {
    name: 'Drug Addiction',
    type: 'addiction' as const,
    severity: 'severe' as const,
    isCurable: true,
    isFatal: true,
    treatmentCost: 8000,
    statEffects: { addictions: 40, physicalHealth: -20, mentalHealth: -15, reputation: -20 },
    description: 'Dependency on illegal substances.',
    symptoms: ['Drug cravings', 'Risky behavior', 'Social isolation'],
    probability: 0.02
  },
  
  // STDs
  {
    name: 'Chlamydia',
    type: 'std' as const,
    severity: 'mild' as const,
    isCurable: true,
    isFatal: false,
    treatmentCost: 200,
    statEffects: { physicalHealth: -5, reputation: -10 },
    description: 'Common sexually transmitted infection.',
    symptoms: ['Burning sensation', 'Discharge', 'Pain'],
    probability: 0.03
  },
  {
    name: 'HIV',
    type: 'std' as const,
    severity: 'terminal' as const,
    isCurable: false,
    isFatal: true,
    treatmentCost: 25000,
    statEffects: { physicalHealth: -35, mentalHealth: -20, reputation: -15 },
    description: 'Human immunodeficiency virus affecting immune system.',
    symptoms: ['Fatigue', 'Weight loss', 'Frequent infections'],
    probability: 0.005
  }
];

export function generateRandomDisease(character: Character): Disease | null {
  const availableDiseases = DISEASES.filter(disease => {
    // Check genetic predisposition
    const geneticResistance = character.genetics.diseaseResistance[disease.name.toLowerCase().replace(' ', '')] || 50;
    const adjustedProbability = disease.probability * (1 - geneticResistance / 100);
    
    // Age factors
    let ageFactor = 1;
    if (character.age > 60) ageFactor = 2;
    else if (character.age > 40) ageFactor = 1.5;
    else if (character.age < 18) ageFactor = 0.5;
    
    // Health factors
    const healthFactor = (100 - character.stats.physicalHealth) / 100 + 1;
    
    return Math.random() < adjustedProbability * ageFactor * healthFactor;
  });

  if (availableDiseases.length === 0) return null;

  const selectedDisease = availableDiseases[Math.floor(Math.random() * availableDiseases.length)];
  
  return {
    id: crypto.randomUUID(),
    name: selectedDisease.name,
    type: selectedDisease.type,
    severity: selectedDisease.severity,
    contractedAt: character.age,
    isCurable: selectedDisease.isCurable,
    isFatal: selectedDisease.isFatal,
    treatmentCost: selectedDisease.treatmentCost,
    statEffects: selectedDisease.statEffects,
    description: selectedDisease.description,
    symptoms: selectedDisease.symptoms
  };
}

export function visitHospital(
  character: Character,
  visitType: 'checkup' | 'surgery' | 'therapy' | 'rehab' | 'emergency'
): { character: Character; event: GameEvent; visit: HospitalVisit } {
  let cost = 0;
  let success = true;
  let description = '';
  let statChanges = {};

  switch (visitType) {
    case 'checkup':
      cost = 200;
      success = true;
      description = 'You had a routine medical checkup. Everything looks good!';
      statChanges = { physicalHealth: 5, happiness: 2 };
      break;
      
    case 'surgery':
      cost = 15000;
      success = Math.random() > 0.1; // 90% success rate
      if (success) {
        description = 'Your surgery was successful! You feel much better.';
        statChanges = { physicalHealth: 20, happiness: 10 };
      } else {
        description = 'Unfortunately, there were complications during surgery.';
        statChanges = { physicalHealth: -10, happiness: -15 };
      }
      break;
      
    case 'therapy':
      cost = 150;
      success = Math.random() > 0.2; // 80% success rate
      if (success) {
        description = 'Therapy session went well. You feel more balanced.';
        statChanges = { mentalHealth: 10, happiness: 8 };
      } else {
        description = 'Therapy was difficult today, but that\'s part of the process.';
        statChanges = { mentalHealth: 2, happiness: -2 };
      }
      break;
      
    case 'rehab':
      cost = 8000;
      success = Math.random() > 0.3; // 70% success rate
      if (success) {
        description = 'Rehabilitation program was successful! You feel in control again.';
        statChanges = { addictions: -25, mentalHealth: 15, physicalHealth: 10 };
      } else {
        description = 'Rehab was challenging and you relapsed, but you\'re not giving up.';
        statChanges = { addictions: -5, mentalHealth: 5 };
      }
      break;
      
    case 'emergency':
      cost = 5000;
      success = Math.random() > 0.05; // 95% success rate
      if (success) {
        description = 'Emergency treatment saved your life! You\'re stable now.';
        statChanges = { physicalHealth: 15, happiness: -5 };
      } else {
        description = 'Despite emergency treatment, your condition worsened.';
        statChanges = { physicalHealth: -20, happiness: -20 };
      }
      break;
  }

  // Apply insurance coverage
  const insuranceCoverage = character.insurance.coverage / 100;
  const finalCost = Math.max(character.insurance.deductible, cost * (1 - insuranceCoverage));

  const visit: HospitalVisit = {
    id: crypto.randomUUID(),
    type: visitType,
    cost: finalCost,
    success,
    description,
    age: character.age
  };

  const updatedCharacter = {
    ...character,
    stats: {
      ...character.stats,
      money: Math.max(0, character.stats.money - finalCost),
      ...Object.fromEntries(
        Object.entries(statChanges).map(([stat, change]) => [
          stat,
          Math.max(0, Math.min(100, character.stats[stat as keyof Character['stats']] + (change as number)))
        ])
      )
    }
  };

  const event: GameEvent = {
    id: crypto.randomUUID(),
    age: character.age,
    title: `Hospital Visit: ${visitType.charAt(0).toUpperCase() + visitType.slice(1)}`,
    description: `${description} Cost: $${finalCost.toLocaleString()}`,
    statChanges,
    timestamp: new Date(),
    type: success ? 'positive' : 'negative',
    category: 'general'
  };

  return { character: updatedCharacter, event, visit };
}

export function checkForDeath(character: Character): { isDead: boolean; cause?: string } {
  // Age-based death probability
  let deathProbability = 0;
  
  if (character.age > 90) deathProbability = 0.15;
  else if (character.age > 80) deathProbability = 0.08;
  else if (character.age > 70) deathProbability = 0.04;
  else if (character.age > 60) deathProbability = 0.02;
  else if (character.age > 40) deathProbability = 0.01;
  else deathProbability = 0.005;

  // Health-based modifiers
  if (character.stats.physicalHealth < 20) deathProbability *= 3;
  else if (character.stats.physicalHealth < 40) deathProbability *= 2;
  
  if (character.stats.mentalHealth < 20) deathProbability *= 1.5; // Suicide risk
  
  // Disease-based death
  const fatalDiseases = character.diseases.filter(d => d.isFatal);
  if (fatalDiseases.length > 0) {
    deathProbability += fatalDiseases.length * 0.02;
  }

  // Addiction-based death
  if (character.stats.addictions > 80) deathProbability *= 2;

  // Genetics factor
  const longevityFactor = character.genetics.longevityGenes / 100;
  deathProbability *= (2 - longevityFactor);

  if (Math.random() < deathProbability) {
    // Determine cause of death
    let cause = 'Natural causes';
    
    if (fatalDiseases.length > 0) {
      cause = fatalDiseases[0].name;
    } else if (character.stats.addictions > 80) {
      cause = 'Drug overdose';
    } else if (character.stats.mentalHealth < 20 && Math.random() < 0.3) {
      cause = 'Suicide';
    } else if (character.age < 60 && Math.random() < 0.4) {
      const accidents = ['Car accident', 'Heart attack', 'Stroke', 'Accident'];
      cause = accidents[Math.floor(Math.random() * accidents.length)];
    }
    
    return { isDead: true, cause };
  }

  return { isDead: false };
}

export function generateLifeSummary(character: Character, events: GameEvent[]): LifeSummary {
  const jobsHeld = [...new Set(events
    .filter(e => e.title.includes('Got Hired') || e.title.includes('Job'))
    .map(e => e.description.match(/as a (.+?)(?:\s|!|\.)/)?.[1] || 'Unknown')
  )];

  const keyEvents = events
    .filter(e => 
      e.type === 'positive' && (
        e.title.includes('Achievement') ||
        e.title.includes('Graduated') ||
        e.title.includes('Married') ||
        e.title.includes('Born') ||
        e.title.includes('Promoted')
      )
    )
    .slice(0, 10);

  const totalWealth = character.stats.money + 
    (character.finances?.savings || 0) + 
    (character.finances?.investments || 0) -
    (character.finances?.debt || 0);

  const legacyScore = Math.floor(
    (character.achievements.length * 10) +
    (totalWealth / 1000) +
    (character.relationships.length * 5) +
    (jobsHeld.length * 3) +
    (character.age * 0.5)
  );

  return {
    totalYearsLived: character.age,
    causeOfDeath: character.deathCause || 'Unknown',
    totalWealth,
    jobsHeld,
    relationshipsCount: character.relationships.length,
    childrenCount: 0, // TODO: Implement children system
    crimesCommitted: character.criminalRecord.length,
    achievementsUnlocked: character.achievements.length,
    legacyScore,
    keyEvents,
    finalStats: character.stats
  };
}

export function generateFuneralEvents(character: Character): GameEvent[] {
  const events: GameEvent[] = [];
  
  // Family reactions
  const familyMembers = [character.family.mother, character.family.father, ...character.family.siblings];
  familyMembers.forEach(member => {
    if (member.isAlive) {
      events.push({
        id: crypto.randomUUID(),
        age: character.age,
        title: `${member.name}'s Grief`,
        description: `${member.name} was devastated by your death and spoke beautifully at your funeral.`,
        statChanges: {},
        timestamp: new Date(),
        type: 'neutral',
        category: 'family'
      });
    }
  });

  // Relationship reactions
  character.relationships.filter(r => r.isActive).forEach(relationship => {
    events.push({
      id: crypto.randomUUID(),
      age: character.age,
      title: `${relationship.name}'s Farewell`,
      description: `${relationship.name} was heartbroken and left flowers at your grave.`,
      statChanges: {},
      timestamp: new Date(),
      type: 'neutral',
      category: 'general'
    });
  });

  return events;
}