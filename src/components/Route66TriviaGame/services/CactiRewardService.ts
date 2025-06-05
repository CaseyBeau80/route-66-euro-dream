
import { CACTUS_GROWTH_STAGES, CactiState } from '../types/cactiTypes';

export class CactiRewardService {
  /**
   * Create initial cacti state
   */
  static createInitialState(): CactiState {
    return {
      currentStage: 0,
      correctAnswers: 0,
      unlockedStages: [CACTUS_GROWTH_STAGES[0]], // Start with seed stage
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
   * Get achievement message based on growth
   */
  static getAchievementMessage(correctAnswers: number): string {
    const stage = this.getCurrentStage(correctAnswers);
    
    switch (stage.id) {
      case 'sprout':
        return "🌱 Your first sprout appears in the desert soil!";
      case 'young':
        return "🌵 A young cactus emerges under the Arizona sun!";
      case 'mature':
        return "🌵 Your cactus stands tall like a Route 66 sentinel!";
      case 'blooming':
        return "🌸 Beautiful desert blooms crown your magnificent cactus!";
      case 'master':
        return "👑 You've grown the ultimate Route 66 desert guardian!";
      default:
        return "🌱 Every desert journey begins with a single seed...";
    }
  }
}
