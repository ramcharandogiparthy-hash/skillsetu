import type { PracticalCriterion } from '../types';

export const PRACTICAL_CRITERIA: PracticalCriterion[] = [
  {
    id: 'c1',
    title: 'Identifies Required Tools',
    description: 'Selects tester, insulated pliers, wire stripper, screwdrivers, and insulation tape.',
    maxScore: 5,
    category: 'tools'
  },
  {
    id: 'c2',
    title: 'Uses Safety Gloves & PPE',
    description: 'Wears safety gloves, rubber-soled footwear, and eye protection before starting.',
    maxScore: 5,
    category: 'safety'
  },
  {
    id: 'c3',
    title: 'Switches Off Main Power Source',
    description: 'Verifies main MCB/switch is off and tags circuit safely before touch.',
    maxScore: 10,
    category: 'safety'
  },
  {
    id: 'c4',
    title: 'Strips Wire Insulation Correctly',
    description: 'Strips copper conductor without nicking or damaging internal wire core.',
    maxScore: 10,
    category: 'wiring'
  },
  {
    id: 'c5',
    title: 'Connects Switch & Bulb Holder Wires',
    description: 'Connects Phase (Live) wire to switch terminal and Neutral to bulb holder terminal with tight screws.',
    maxScore: 25,
    category: 'wiring'
  },
  {
    id: 'c6',
    title: 'Insulates Exposed Wire Connections',
    description: 'Applies electrical insulation tape securely over joints and bare conductor ends.',
    maxScore: 10,
    category: 'wiring'
  },
  {
    id: 'c7',
    title: 'Tests Electrical Circuit Safely',
    description: 'Uses neon tester or multimeter to check continuity and voltage after restoring power.',
    maxScore: 15,
    category: 'testing'
  },
  {
    id: 'c8',
    title: 'Maintains Clean & Safe Work Area',
    description: 'Organizes tools, disposes wire clippings, and keeps area dry and hazard-free.',
    maxScore: 10,
    category: 'safety'
  }
];

export function calculateCriterionScore(
  maxScore: number, 
  level?: 'not_demonstrated' | 'needs_support' | 'demonstrated_independently'
): number {
  if (!level || level === 'not_demonstrated') return 0;
  if (level === 'needs_support') return Math.round(maxScore * 0.5);
  if (level === 'demonstrated_independently') return maxScore;
  return 0;
}

export function calculateTotalPracticalScore(
  scoringLevels: Record<string, 'not_demonstrated' | 'needs_support' | 'demonstrated_independently'>
): number {
  let total = 0;
  for (const criterion of PRACTICAL_CRITERIA) {
    const level = scoringLevels[criterion.id];
    total += calculateCriterionScore(criterion.maxScore, level);
  }
  return total;
}
