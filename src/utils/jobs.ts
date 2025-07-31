import { Character, GameEvent, Job, EducationLevel } from '../types/game';

export const AVAILABLE_JOBS: Job[] = [
  // Entry Level Jobs (No education required)
  {
    id: 'cashier',
    title: 'Cashier',
    category: 'entry',
    requirements: {},
    salary: { min: 20000, max: 25000 },
    description: 'Handle customer transactions at a retail store.',
    careerPath: ['Shift Supervisor', 'Assistant Manager', 'Store Manager']
  },
  {
    id: 'waiter',
    title: 'Waiter/Waitress',
    category: 'entry',
    requirements: {},
    salary: { min: 18000, max: 30000 },
    description: 'Serve customers at a restaurant.',
    careerPath: ['Head Waiter', 'Restaurant Supervisor', 'Restaurant Manager']
  },
  {
    id: 'janitor',
    title: 'Janitor',
    category: 'entry',
    requirements: {},
    salary: { min: 22000, max: 28000 },
    description: 'Maintain cleanliness in office buildings.',
    careerPath: ['Cleaning Supervisor', 'Facility Manager']
  },
  
  // Skilled Jobs (High school required)
  {
    id: 'mechanic',
    title: 'Auto Mechanic',
    category: 'skilled',
    requirements: { education: 'graduated' },
    salary: { min: 35000, max: 55000 },
    description: 'Repair and maintain vehicles.',
    careerPath: ['Senior Mechanic', 'Shop Foreman', 'Shop Owner']
  },
  {
    id: 'electrician',
    title: 'Electrician',
    category: 'skilled',
    requirements: { education: 'graduated' },
    salary: { min: 40000, max: 65000 },
    description: 'Install and repair electrical systems.',
    careerPath: ['Master Electrician', 'Electrical Contractor']
  },
  
  // Professional Jobs (College required)
  {
    id: 'teacher',
    title: 'Teacher',
    category: 'professional',
    requirements: { education: 'graduated', stats: { smarts: 70 } },
    salary: { min: 45000, max: 65000 },
    description: 'Educate students in elementary or high school.',
    careerPath: ['Department Head', 'Vice Principal', 'Principal']
  },
  {
    id: 'nurse',
    title: 'Registered Nurse',
    category: 'professional',
    requirements: { education: 'graduated', stats: { smarts: 75, health: 60 } },
    salary: { min: 55000, max: 80000 },
    description: 'Provide medical care to patients.',
    careerPath: ['Charge Nurse', 'Nurse Manager', 'Director of Nursing']
  },
  {
    id: 'accountant',
    title: 'Accountant',
    category: 'professional',
    requirements: { education: 'graduated', stats: { smarts: 80 } },
    salary: { min: 50000, max: 75000 },
    description: 'Manage financial records and taxes.',
    careerPath: ['Senior Accountant', 'Accounting Manager', 'CFO']
  },
  {
    id: 'software_engineer',
    title: 'Software Engineer',
    category: 'professional',
    requirements: { education: 'graduated', stats: { smarts: 85 } },
    salary: { min: 70000, max: 120000 },
    description: 'Develop software applications and systems.',
    careerPath: ['Senior Engineer', 'Tech Lead', 'Engineering Manager']
  },
  
  // Executive Jobs (High experience required)
  {
    id: 'ceo',
    title: 'CEO',
    category: 'executive',
    requirements: { education: 'graduated', experience: 15, stats: { smarts: 90, reputation: 80 } },
    salary: { min: 200000, max: 500000 },
    description: 'Lead a major corporation.',
    careerPath: []
  }
];

export const COLLEGE_MAJORS = [
  { name: 'Business', tuition: 40000, jobBonus: ['accountant', 'ceo'] },
  { name: 'Computer Science', tuition: 45000, jobBonus: ['software_engineer'] },
  { name: 'Education', tuition: 35000, jobBonus: ['teacher'] },
  { name: 'Nursing', tuition: 50000, jobBonus: ['nurse'] },
  { name: 'Engineering', tuition: 48000, jobBonus: ['electrician'] },
  { name: 'Liberal Arts', tuition: 38000, jobBonus: [] }
];

export function getAvailableJobs(character: Character): Job[] {
  return AVAILABLE_JOBS.filter(job => {
    // Check education requirement
    if (job.requirements.education && character.education.currentLevel !== job.requirements.education) {
      return false;
    }
    
    // Check experience requirement
    if (job.requirements.experience && (character.workExperience || 0) < job.requirements.experience) {
      return false;
    }
    
    // Check stat requirements
    if (job.requirements.stats) {
      for (const [stat, required] of Object.entries(job.requirements.stats)) {
        if (character.stats[stat as keyof Character['stats']] < required) {
          return false;
        }
      }
    }
    
    return true;
  });
}

export function applyForJob(character: Character, jobId: string): { character: Character; event: GameEvent; success: boolean } {
  const job = AVAILABLE_JOBS.find(j => j.id === jobId);
  if (!job) {
    throw new Error('Job not found');
  }

  // Calculate success chance based on qualifications
  let successChance = 0.5;
  
  if (job.requirements.stats) {
    for (const [stat, required] of Object.entries(job.requirements.stats)) {
      const characterStat = character.stats[stat as keyof Character['stats']];
      if (characterStat >= required + 20) successChance += 0.2;
      else if (characterStat >= required + 10) successChance += 0.1;
    }
  }
  
  if (character.workExperience && character.workExperience > 0) {
    successChance += Math.min(0.3, character.workExperience * 0.02);
  }

  const success = Math.random() < successChance;
  
  if (success) {
    const salary = Math.floor(Math.random() * (job.salary.max - job.salary.min) + job.salary.min);
    
    const updatedCharacter = {
      ...character,
      hasJob: true,
      jobTitle: job.title,
      jobLevel: 1,
      jobPerformance: 50,
      salary,
      workExperience: (character.workExperience || 0) + 1
    };

    const event: GameEvent = {
      id: crypto.randomUUID(),
      age: character.age,
      title: 'Got Hired!',
      description: `You were hired as a ${job.title} with a starting salary of $${salary.toLocaleString()}/year!`,
      statChanges: { happiness: 10, money: 1000 },
      timestamp: new Date(),
      type: 'positive',
      category: 'general'
    };

    return { character: updatedCharacter, event, success: true };
  } else {
    const event: GameEvent = {
      id: crypto.randomUUID(),
      age: character.age,
      title: 'Job Application Rejected',
      description: `Your application for ${job.title} was rejected. Keep trying!`,
      statChanges: { happiness: -5 },
      timestamp: new Date(),
      type: 'negative',
      category: 'general'
    };

    return { character, event, success: false };
  }
}

export function workAction(
  character: Character, 
  action: 'work_harder' | 'slack_off' | 'ask_promotion' | 'quit'
): { character: Character; event: GameEvent } {
  if (!character.hasJob) {
    throw new Error('Character is not employed');
  }

  let updatedCharacter = { ...character };
  let event: GameEvent;

  switch (action) {
    case 'work_harder':
      const performanceGain = Math.floor(Math.random() * 15) + 10;
      updatedCharacter.jobPerformance = Math.min(100, (character.jobPerformance || 50) + performanceGain);
      
      event = {
        id: crypto.randomUUID(),
        age: character.age,
        title: 'Worked Harder',
        description: 'You put in extra effort at work. Your boss noticed your dedication!',
        statChanges: { happiness: -2, money: 200 },
        timestamp: new Date(),
        type: 'positive',
        category: 'general'
      };
      break;

    case 'slack_off':
      const performanceLoss = Math.floor(Math.random() * 20) + 10;
      updatedCharacter.jobPerformance = Math.max(0, (character.jobPerformance || 50) - performanceLoss);
      
      event = {
        id: crypto.randomUUID(),
        age: character.age,
        title: 'Slacked Off',
        description: 'You took it easy at work today. It felt good but your performance suffered.',
        statChanges: { happiness: 5, money: -100 },
        timestamp: new Date(),
        type: 'negative',
        category: 'general'
      };
      break;

    case 'ask_promotion':
      const promotionChance = (character.jobPerformance || 50) / 100 * 0.6;
      const gotPromotion = Math.random() < promotionChance;
      
      if (gotPromotion) {
        const salaryIncrease = Math.floor((character.salary || 30000) * 0.2);
        updatedCharacter.salary = (character.salary || 30000) + salaryIncrease;
        updatedCharacter.jobLevel = (character.jobLevel || 1) + 1;
        
        event = {
          id: crypto.randomUUID(),
          age: character.age,
          title: 'Got Promoted!',
          description: `Congratulations! You got promoted and received a $${salaryIncrease.toLocaleString()} raise!`,
          statChanges: { happiness: 15, money: 2000 },
          timestamp: new Date(),
          type: 'positive',
          category: 'general'
        };
      } else {
        event = {
          id: crypto.randomUUID(),
          age: character.age,
          title: 'Promotion Denied',
          description: 'Your request for a promotion was denied. Maybe work harder next time.',
          statChanges: { happiness: -8 },
          timestamp: new Date(),
          type: 'negative',
          category: 'general'
        };
      }
      break;

    case 'quit':
      updatedCharacter = {
        ...character,
        hasJob: false,
        jobTitle: undefined,
        jobLevel: undefined,
        jobPerformance: undefined,
        salary: undefined
      };
      
      event = {
        id: crypto.randomUUID(),
        age: character.age,
        title: 'Quit Job',
        description: `You quit your job as a ${character.jobTitle}. Time for a new chapter!`,
        statChanges: { happiness: 5, money: -500 },
        timestamp: new Date(),
        type: 'neutral',
        category: 'general'
      };
      break;

    default:
      throw new Error('Invalid work action');
  }

  return { character: updatedCharacter, event };
}

export function enrollInCollege(character: Character, major: string): { character: Character; event: GameEvent } {
  const collegeMajor = COLLEGE_MAJORS.find(m => m.name === major);
  if (!collegeMajor) {
    throw new Error('Major not found');
  }

  const scholarshipAmount = Math.floor(Math.random() * 15000); // 0-15k scholarship
  const loanAmount = Math.max(0, collegeMajor.tuition - scholarshipAmount - (character.stats.money || 0));

  const updatedCharacter = {
    ...character,
    college: {
      isEnrolled: true,
      major,
      year: 1,
      gpa: 3.0,
      tuition: collegeMajor.tuition,
      scholarships: scholarshipAmount,
      loans: loanAmount
    },
    stats: {
      ...character.stats,
      money: Math.max(0, character.stats.money - (collegeMajor.tuition - scholarshipAmount - loanAmount))
    },
    finances: {
      ...character.finances,
      debt: (character.finances?.debt || 0) + loanAmount
    }
  };

  const event: GameEvent = {
    id: crypto.randomUUID(),
    age: character.age,
    title: 'Enrolled in College',
    description: `You enrolled in college majoring in ${major}! Tuition: $${collegeMajor.tuition.toLocaleString()}, Scholarship: $${scholarshipAmount.toLocaleString()}, Loans: $${loanAmount.toLocaleString()}`,
    statChanges: { happiness: 8, smarts: 5 },
    timestamp: new Date(),
    type: 'positive',
    category: 'education'
  };

  return { character: updatedCharacter, event };
}

export function generateJobEvent(character: Character): GameEvent | null {
  if (!character.hasJob) return null;

  const events = [
    {
      title: 'Got a Raise',
      description: 'Your hard work paid off! You received an unexpected raise.',
      statChanges: { happiness: 8, money: 1500 },
      type: 'positive' as const,
      probability: 0.05,
      effect: (char: Character) => ({
        ...char,
        salary: (char.salary || 30000) * 1.1
      })
    },
    {
      title: 'Workplace Conflict',
      description: 'You had a disagreement with a coworker that affected your mood.',
      statChanges: { happiness: -6, reputation: -3 },
      type: 'negative' as const,
      probability: 0.08
    },
    {
      title: 'Completed Big Project',
      description: 'You successfully completed a major project at work!',
      statChanges: { happiness: 6, reputation: 5 },
      type: 'positive' as const,
      probability: 0.06,
      effect: (char: Character) => ({
        ...char,
        jobPerformance: Math.min(100, (char.jobPerformance || 50) + 10)
      })
    },
    {
      title: 'Work Stress',
      description: 'The pressure at work is getting to you.',
      statChanges: { happiness: -5, health: -3 },
      type: 'negative' as const,
      probability: 0.1
    },
    {
      title: 'Job Offer from Rival Company',
      description: 'A competing company offered you a position with 20% higher salary!',
      statChanges: { happiness: 10 },
      type: 'positive' as const,
      probability: 0.03
    }
  ];

  // Performance affects event probability
  const performanceMultiplier = (character.jobPerformance || 50) / 50;
  
  const availableEvents = events.filter(event => 
    Math.random() < event.probability * performanceMultiplier
  );

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