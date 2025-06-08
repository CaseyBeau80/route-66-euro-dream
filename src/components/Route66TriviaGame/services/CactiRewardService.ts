
import { CACTUS_GROWTH_STAGES, CactiState } from '../types/cactiTypes';

export class CactiRewardService {
  /**
   * Create initial cacti state
   */
  static createInitialState(): CactiState {
    return {
      currentStage: 0,
      correctAnswers: 0,
      unlockedStages: [CACTUS_GROWTH_STAGES[0]], // Start with seedling stage
      showReward: false
    };
  }

  /**
   * Update cacti state when a correct answer is given
   */
  static updateForCorrectAnswer(currentState: CactiState): CactiState {
    const newCorrectAnswers = currentState.correctAnswers + 1;
    const newStageIndex = Math.min(newCorrectAnswers, CACTUS_GROWTH_STAGES.length - 1);
    
    const unlockedStages = CACTUS_GROWTH_STAGES.filter(
      stage => stage.minCorrectAnswers <= newCorrectAnswers
    );

    return {
      ...currentState,
      currentStage: newStageIndex,
      correctAnswers: newCorrectAnswers,
      unlockedStages,
      showReward: true
    };
  }

  /**
   * Hide the reward animation
   */
  static hideReward(currentState: CactiState): CactiState {
    return {
      ...currentState,
      showReward: false
    };
  }

  /**
   * Reset cacti state for new game
   */
  static resetState(): CactiState {
    return this.createInitialState();
  }

  /**
   * Get current cactus growth stage
   */
  static getCurrentStage(correctAnswers: number) {
    const stageIndex = Math.min(correctAnswers, CACTUS_GROWTH_STAGES.length - 1);
    return CACTUS_GROWTH_STAGES[stageIndex];
  }

  /**
   * Get desert-themed achievement message based on growth
   */
  static getAchievementMessage(correctAnswers: number): string {
    const stage = this.getCurrentStage(correctAnswers);
    
    switch (stage.id) {
      case 'sprout':
        return "🌱 Your first desert sprout emerges from the Arizona soil!";
      case 'barrel':
        return "🌵 A sturdy barrel cactus takes root in the Sonoran Desert!";
      case 'cholla':
        return "🌵 You've grown as resilient as the jumping cholla of New Mexico!";
      case 'prickly-pear':
        return "🌺 Beautiful desert blooms crown your Texas Panhandle knowledge!";
      case 'saguaro':
        return "👑 You've become a majestic Saguaro sentinel of Route 66 wisdom!";
      default:
        return "🌱 Every desert journey begins with a seed in the Mojave sand...";
    }
  }

  /**
   * Get regional context for current stage
   */
  static getRegionalContext(correctAnswers: number): string {
    const stage = this.getCurrentStage(correctAnswers);
    return stage.region;
  }

  /**
   * Get desert-themed flavor text
   */
  static getFlavorText(correctAnswers: number): string {
    const stage = this.getCurrentStage(correctAnswers);
    return stage.flavorText;
  }
}
