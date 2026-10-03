import type { SkillAnswerOption, MappingResult } from '../types';

export function calculateSelfDeclarationScore(answers: Record<string, SkillAnswerOption>): number {
  const keys = Object.keys(answers);
  if (keys.length === 0) return 0;

  let totalPoints = 0;
  const maxPossible = keys.length * 10;

  for (const key of keys) {
    const val = answers[key];
    if (val === 'can_do_independently') totalPoints += 10;
    else if (val === 'can_do_with_help') totalPoints += 6;
    else if (val === 'have_seen') totalPoints += 2.5;
    else totalPoints += 0;
  }

  return Math.round((totalPoints / maxPossible) * 100);
}

export function computeQualificationMapping(
  answers: Record<string, SkillAnswerOption>,
  yearsExp: number
): MappingResult {
  const score = calculateSelfDeclarationScore(answers);

  const skillsFound: string[] = [];
  const skillsRequiringVerification: string[] = [];

  const keyMap: Record<string, string> = {
    tools: 'Tool identification (Tester, Screwdriver, Pliers, Stripper)',
    switchInstall: 'Switch installation & wiring',
    bulbHolder: 'Bulb holder terminal wiring',
    socketInstall: 'Socket & earthing installation',
    houseWiring: 'Basic single-phase house wiring',
    circuitTest: 'Circuit safety & continuity testing',
    powerCutOff: 'Power cut-off & Lockout procedure',
    ppeSafety: 'PPE usage (Insulated gloves & shoes)',
    independentWork: 'Independent troubleshooting & layout reading'
  };

  Object.entries(keyMap).forEach(([key, title]) => {
    const ans = answers[key];
    if (ans === 'can_do_independently') {
      skillsFound.push(title);
      skillsRequiringVerification.push(`${title} (Practical Verification Required)`);
    } else if (ans === 'can_do_with_help') {
      skillsFound.push(`${title} (Needs Guidance)`);
      skillsRequiringVerification.push(`${title} (Assessor Verification Required)`);
    } else {
      skillsRequiringVerification.push(`${title} (Gap Training Recommended)`);
    }
  });

  // Calculate domain breakdown
  const toolScore = answers['tools'] === 'can_do_independently' ? 95 : answers['tools'] === 'can_do_with_help' ? 70 : 40;
  const safetyScore = Math.round(
    ((answers['powerCutOff'] === 'can_do_independently' ? 10 : 4) +
     (answers['ppeSafety'] === 'can_do_independently' ? 10 : 4)) * 5
  );
  const wiringScore = Math.round(
    ((answers['switchInstall'] === 'can_do_independently' ? 10 : 5) +
     (answers['bulbHolder'] === 'can_do_independently' ? 10 : 5) +
     (answers['houseWiring'] === 'can_do_independently' ? 10 : 5)) * 3.33
  );
  const testingScore = answers['circuitTest'] === 'can_do_independently' ? 90 : answers['circuitTest'] === 'can_do_with_help' ? 65 : 30;
  const expScore = Math.min(100, yearsExp * 15);

  let confidence: 'High' | 'Medium' | 'Low' = 'Low';
  if (score >= 75 && yearsExp >= 3) {
    confidence = 'High';
  } else if (score >= 50) {
    confidence = 'Medium';
  }

  return {
    suggestedQualification: 'Assistant Electrician',
    suggestedNSQFLevel: 'Level 3',
    matchPercentage: Math.min(98, Math.max(35, Math.round(score * 0.9 + yearsExp * 1.5))),
    confidence,
    skillsFound,
    skillsRequiringVerification,
    domainBreakdown: {
      toolKnowledge: toolScore,
      safetyKnowledge: safetyScore,
      wiringSkills: wiringScore,
      testingSkills: testingScore,
      experienceScore: expScore
    }
  };
}
