
import { CactiState } from './types/cactiTypes';

export interface TriviaQuestion {
  id: string;
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
  };
  correctAnswer: 'a' | 'b' | 'c';
  explanation: string;
  category: 'history' | 'culture' | 'attractions' | 'pop-culture' | 'quirky';
}

export interface GameState {
  currentQuestionIndex: number;
  score: number;
  selectedAnswers: Array<{
    questionId: string;
    selectedOption: 'a' | 'b' | 'c';
    isCorrect: boolean;
  }>;
  isGameComplete: boolean;
  showExplanation: boolean;
  cactiState: CactiState;
}

export interface GameSession {
  questions: TriviaQuestion[];
  gameState: GameState;
  sessionId: string;
}
