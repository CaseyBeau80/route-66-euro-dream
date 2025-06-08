
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import QuitConfirmationModal from './QuitConfirmationModal';

interface GameControlsProps {
  onRestart: () => void;
  onQuit: () => void;
  currentScore: number;
  totalQuestions: number;
  className?: string;
}

const GameControls: React.FC<GameControlsProps> = ({
  onRestart,
  onQuit,
  currentScore,
  totalQuestions,
  className = ""
}) => {
  const [showQuitModal, setShowQuitModal] = useState(false);

  const handleQuitClick = () => {
    setShowQuitModal(true);
  };

  const handleQuitConfirm = () => {
    onQuit();
  };

  const handleRestartClick = () => {
    onRestart();
  };

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRestartClick}
          className="group border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 font-bold transition-all duration-200 transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-blue-300"
          aria-label="Restart trivia game (R key)"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
          <span className="relative flex items-center gap-1.5">
            <span className="animate-spin-slow">🔄</span>
            <span className="hidden sm:inline">Restart</span>
          </span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleQuitClick}
          className="group border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 font-bold transition-all duration-200 transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-red-300"
          aria-label="Quit trivia game (Q key)"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
          <span className="relative flex items-center gap-1.5">
            <span>🚪</span>
            <span className="hidden sm:inline">Exit</span>
          </span>
        </Button>
      </div>

      <QuitConfirmationModal
        isOpen={showQuitModal}
        onClose={() => setShowQuitModal(false)}
        onConfirm={handleQuitConfirm}
        currentScore={currentScore}
        totalQuestions={totalQuestions}
      />
    </>
  );
};

export default GameControls;
