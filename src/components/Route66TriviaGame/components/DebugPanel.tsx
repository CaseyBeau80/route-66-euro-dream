
import React, { useState } from 'react';
import { GameSession } from '../types';
import { validateTriviaDatabase } from '../data/triviaDatabase';
import { TriviaGameService } from '../services/TriviaGameService';

interface DebugPanelProps {
  gameSession: GameSession | null;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ gameSession }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const validation = validateTriviaDatabase();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-2 rounded-lg text-xs font-mono z-50 opacity-50 hover:opacity-100"
      >
        🐛 Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-gray-300 rounded-lg p-4 max-w-md max-h-96 overflow-y-auto z-50 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-gray-800">Debug Panel</h4>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      {/* Database Validation */}
      <div className="mb-4">
        <button
          onClick={() => setShowValidation(!showValidation)}
          className="text-sm font-bold text-blue-600 hover:text-blue-800"
        >
          Database Validation {showValidation ? '▼' : '▶'}
        </button>
        {showValidation && (
          <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
            <div className={validation.isValid ? 'text-green-600' : 'text-red-600'}>
              Status: {validation.isValid ? '✅ Valid' : '❌ Invalid'}
            </div>
            {validation.errors.length > 0 && (
              <div className="mt-2">
                <strong>Errors:</strong>
                <ul className="list-disc list-inside">
                  {validation.errors.map((error, index) => (
                    <li key={index} className="text-red-600">{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Current Game State */}
      {gameSession && (
        <div className="mb-4">
          <h5 className="font-bold text-sm text-gray-700 mb-2">Current Game</h5>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Session ID: {gameSession.sessionId}</div>
            <div>Question: {gameSession.gameState.currentQuestionIndex + 1} / {gameSession.questions.length}</div>
            <div>Score: {gameSession.gameState.score}</div>
            <div>Complete: {gameSession.gameState.isGameComplete ? 'Yes' : 'No'}</div>
            
            {/* Current Question Debug */}
            {!gameSession.gameState.isGameComplete && (
              <div className="mt-2 p-2 bg-blue-50 rounded">
                <div className="font-bold">Current Question:</div>
                <div>ID: {gameSession.questions[gameSession.gameState.currentQuestionIndex]?.id}</div>
                <div>Correct: {gameSession.questions[gameSession.gameState.currentQuestionIndex]?.correctAnswer}</div>
                <div>Text: {gameSession.questions[gameSession.gameState.currentQuestionIndex]?.options[gameSession.questions[gameSession.gameState.currentQuestionIndex]?.correctAnswer]}</div>
              </div>
            )}
            
            {/* Answer History */}
            {gameSession.gameState.selectedAnswers.length > 0 && (
              <div className="mt-2">
                <div className="font-bold">Answer History:</div>
                {gameSession.gameState.selectedAnswers.map((answer, index) => (
                  <div key={answer.questionId} className="flex gap-2">
                    <span>Q{index + 1}:</span>
                    <span>{answer.selectedOption}</span>
                    <span className={answer.isCorrect ? 'text-green-600' : 'text-red-600'}>
                      {answer.isCorrect ? '✓' : '✗'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Test All Questions */}
      <div className="mb-4">
        <button
          onClick={() => {
            console.log('🧪 Testing all questions...');
            validateTriviaDatabase();
          }}
          className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Test All Questions
        </button>
      </div>
    </div>
  );
};

export default DebugPanel;
