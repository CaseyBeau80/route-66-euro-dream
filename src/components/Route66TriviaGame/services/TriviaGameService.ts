import { TriviaQuestion, GameSession, GameState } from '../types';
import { triviaDatabase, validateTriviaDatabase } from '../data/triviaDatabase';
import { CactiRewardService } from './CactiRewardService';

export class TriviaGameService {
  private static readonly QUESTIONS_PER_ROUND = 5;

  /**
   * Create a new game session with shuffled questions
   */
  static createNewSession(): GameSession {
    // Validate database before creating session
    const validation = validateTriviaDatabase();
    if (!validation.isValid) {
      console.error('🚨 Trivia Database Validation Failed:', validation.errors);
    } else {
      console.log('✅ Trivia Database Validation Passed');
    }

    const shuffledQuestions = this.shuffleQuestions();
    const selectedQuestions = shuffledQuestions.slice(0, this.QUESTIONS_PER_ROUND);
    
    console.log('🎮 New Game Session Created:');
    console.log('Selected Questions:', selectedQuestions.map(q => ({
      id: q.id,
      question: q.question.substring(0, 50) + '...',
      correctAnswer: q.correctAnswer
    })));
    
    return {
      sessionId: this.generateSessionId(),
      questions: selectedQuestions,
      gameState: {
        currentQuestionIndex: 0,
        score: 0,
        selectedAnswers: [],
        isGameComplete: false,
        showExplanation: false,
        cactiState: CactiRewardService.createInitialState()
      }
    };
  }

  /**
   * Shuffle questions using Fisher-Yates algorithm
   */
  private static shuffleQuestions(): TriviaQuestion[] {
    const questions = [...triviaDatabase];
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions;
  }

  /**
   * Process answer selection with enhanced debugging
   */
  static selectAnswer(
    session: GameSession,
    selectedOption: 'a' | 'b' | 'c'
  ): GameSession {
    const currentQuestion = session.questions[session.gameState.currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    // Enhanced debugging
    console.log('🎯 Answer Selection Debug:');
    console.log('Question ID:', currentQuestion.id);
    console.log('Question:', currentQuestion.question);
    console.log('Selected Option:', selectedOption);
    console.log('Selected Text:', currentQuestion.options[selectedOption]);
    console.log('Correct Answer:', currentQuestion.correctAnswer);
    console.log('Correct Text:', currentQuestion.options[currentQuestion.correctAnswer]);
    console.log('Is Correct:', isCorrect);
    console.log('---');
    
    const updatedAnswers = [
      ...session.gameState.selectedAnswers,
      {
        questionId: currentQuestion.id,
        selectedOption,
        isCorrect
      }
    ];

    const newScore = session.gameState.score + (isCorrect ? 1 : 0);
    
    // Update cacti state if answer is correct
    const updatedCactiState = isCorrect 
      ? CactiRewardService.updateForCorrectAnswer(session.gameState.cactiState)
      : session.gameState.cactiState;
    
    console.log('📊 Updated Game State:');
    console.log('New Score:', newScore);
    console.log('Total Answered:', updatedAnswers.length);
    
    return {
      ...session,
      gameState: {
        ...session.gameState,
        selectedAnswers: updatedAnswers,
        score: newScore,
        showExplanation: true,
        cactiState: updatedCactiState
      }
    };
  }

  /**
   * Validate a specific question for debugging
   */
  static validateQuestion(question: TriviaQuestion): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    if (!question.correctAnswer || !['a', 'b', 'c'].includes(question.correctAnswer)) {
      issues.push(`Invalid correct answer: "${question.correctAnswer}"`);
    }
    
    if (!question.options[question.correctAnswer]) {
      issues.push(`Correct answer option "${question.correctAnswer}" does not exist in options`);
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * Move to next question
   */
  static nextQuestion(session: GameSession): GameSession {
    const nextIndex = session.gameState.currentQuestionIndex + 1;
    const isLastQuestion = nextIndex >= session.questions.length;
    
    // Hide cacti reward when moving to next question
    const updatedCactiState = CactiRewardService.hideReward(session.gameState.cactiState);
    
    console.log('➡️ Moving to next question:', nextIndex + 1, 'of', session.questions.length);
    
    return {
      ...session,
      gameState: {
        ...session.gameState,
        currentQuestionIndex: nextIndex,
        showExplanation: false,
        isGameComplete: isLastQuestion,
        cactiState: updatedCactiState
      }
    };
  }

  /**
   * Get score message based on performance
   */
  static getScoreMessage(score: number, total: number): string {
    const percentage = (score / total) * 100;
    
    if (percentage === 100) {
      return "🏆 Route 66 Expert! You've mastered the Mother Road!";
    } else if (percentage >= 80) {
      return "⭐ Nice work, Roadie! You know your Route 66 history!";
    } else if (percentage >= 60) {
      return "🛣️ Not bad! You're getting the hang of the highway!";
    } else if (percentage >= 40) {
      return "🚗 Keep cruising! Every mile teaches you something new!";
    } else {
      return "🗺️ Time to hit the road and explore more! Every journey starts somewhere!";
    }
  }

  /**
   * Get achievement badge based on score
   */
  static getAchievementBadge(score: number, total: number): string {
    const percentage = (score / total) * 100;
    
    if (percentage === 100) return "66 Master";
    if (percentage >= 80) return "Route Runner";
    if (percentage >= 60) return "Highway Hero";
    if (percentage >= 40) return "Road Tripper";
    return "Motoring Beginner";
  }

  /**
   * Generate a unique session ID
   */
  private static generateSessionId(): string {
    return `trivia_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
