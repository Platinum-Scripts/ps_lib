type SkillCheckDifficulty = 'easy' | 'medium' | 'hard' | { areaSize: number; speedMultiplier: number };

export const skillCheck = (difficulty: SkillCheckDifficulty | SkillCheckDifficulty[], inputs?: string[]) =>
  exports.ps_lib.skillCheck(difficulty);
