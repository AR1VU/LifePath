import { Character, GameEvent, EducationLevel } from '../types/game';

export const EDUCATION_LEVELS: { [key in EducationLevel]: { name: string; ageRange: [number, number] } } = {
  none: { name: 'Not in School', ageRange: [0, 3] },
  preschool: { name: 'Preschool', ageRange: [3, 5] },
  elementary: { name: 'Elementary School', ageRange: [5, 11] },
  middle: { name: 'Middle School', ageRange: [11, 14] },
  high: { name: 'High School', ageRange: [14, 18] },
  graduated: { name: 'Graduated', ageRange: [18, 100] }
};

export const SCHOOL_SUBJECTS = ['Math', 'English', 'Science', 'History', 'Art', 'PE'];

export const SCHOOL_CLUBS = [
  'Drama Club', 'Chess Club', 'Basketball Team', 'Soccer Team', 'Debate Team',
  'Art Club', 'Music Band', 'Science Club', 'Student Council', 'Yearbook Committee'
];

export function getEducationLevel(age: number): EducationLevel {
  if (age < 3) return 'none';
  if (age < 5) return 'preschool';
  if (age < 11) return 'elementary';
  if (age < 14) return 'middle';
  if (age < 18) return 'high';
  return 'graduated';
}

export function generateSchoolEvent(character: Character): GameEvent | null {
  if (character.education.currentLevel === 'none' || character.education.currentLevel === 'graduated') {
    return null;
  }

  const events = [
    // Academic Events
    {
      title: 'Aced a Test',
      description: 'You studied hard and got a perfect score on your math test!',
      statChanges: { smarts: 5, happiness: 3 },
      type: 'positive' as const,
      probability: 0.1
    },
    {
      title: 'Failed a Quiz',
      description: 'You forgot to study and bombed the history quiz.',
      statChanges: { smarts: -2, happiness: -4 },
      type: 'negative' as const,
      probability: 0.08
    },
    {
      title: 'Made Honor Roll',
      description: 'Your excellent grades earned you a spot on the honor roll!',
      statChanges: { smarts: 8, happiness: 6 },
      type: 'positive' as const,
      probability: 0.05
    },
    {
      title: 'Got Detention',
      description: 'You were caught talking in class and got detention.',
      statChanges: { happiness: -5 },
      type: 'negative' as const,
      probability: 0.06
    },
    // Social Events
    {
      title: 'Made New Friends',
      description: 'You hit it off with some classmates during lunch.',
      statChanges: { happiness: 7, looks: 2 },
      type: 'positive' as const,
      probability: 0.12
    },
    {
      title: 'Got Bullied',
      description: 'Some older kids picked on you during recess.',
      statChanges: { happiness: -8, health: -3 },
      type: 'negative' as const,
      probability: 0.07
    },
    {
      title: 'Joined a Club',
      description: `You joined the ${SCHOOL_CLUBS[Math.floor(Math.random() * SCHOOL_CLUBS.length)]}!`,
      statChanges: { happiness: 5, smarts: 2 },
      type: 'positive' as const,
      probability: 0.08
    },
    {
      title: 'Won School Competition',
      description: 'You represented your school in a competition and won first place!',
      statChanges: { smarts: 6, happiness: 8, looks: 3 },
      type: 'positive' as const,
      probability: 0.04
    },
    // Mischief Events
    {
      title: 'Skipped Class',
      description: 'You decided to skip math class and hang out behind the gym.',
      statChanges: { smarts: -3, happiness: 2 },
      type: 'negative' as const,
      probability: 0.05
    },
    {
      title: 'Cheated on Test',
      description: 'You copied answers from your neighbor but felt guilty about it.',
      statChanges: { smarts: 2, happiness: -4 },
      type: 'negative' as const,
      probability: 0.04
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
    category: 'education'
  };
}

export function updateEducationProgress(character: Character): Character {
  const newLevel = getEducationLevel(character.age);
  
  if (newLevel !== character.education.currentLevel) {
    // Initialize grades for new level
    const newGrades: { [subject: string]: number } = {};
    SCHOOL_SUBJECTS.forEach(subject => {
      newGrades[subject] = Math.floor(Math.random() * 40) + 60; // 60-100 starting grades
    });

    return {
      ...character,
      education: {
        ...character.education,
        currentLevel: newLevel,
        grades: newLevel === 'none' || newLevel === 'graduated' ? {} : newGrades,
        gpa: calculateGPA(newGrades)
      }
    };
  }

  return character;
}

export function calculateGPA(grades: { [subject: string]: number }): number {
  const gradeValues = Object.values(grades);
  if (gradeValues.length === 0) return 0;
  
  const average = gradeValues.reduce((sum, grade) => sum + grade, 0) / gradeValues.length;
  return Math.round((average / 25) * 100) / 100; // Convert to 4.0 scale
}