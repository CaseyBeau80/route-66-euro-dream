
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface QuitConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentScore: number;
  totalQuestions: number;
}

const QuitConfirmationModal: React.FC<QuitConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentScore,
  totalQuestions
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md animate-scale-in">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-playfair font-bold text-route66-text-primary flex items-center gap-2">
            <span className="text-red-500">⚠️</span>
            End Route 66 Journey?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-route66-text-secondary font-special-elite">
            Are you sure you want to quit your Route 66 trivia adventure? 
            {currentScore > 0 && (
              <span className="block mt-2 font-bold text-amber-700">
                Current progress: {currentScore}/{totalQuestions} questions correct
              </span>
            )}
            <span className="block mt-2 text-sm italic">
              Your desert cactus will miss you! 🌵
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel 
            onClick={onClose}
            className="border-gray-300 text-gray-700 hover:bg-gray-50 font-bold transition-all duration-200"
          >
            Keep Playing
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700 text-white font-bold transition-all duration-200 transform hover:scale-105"
          >
            <span className="flex items-center gap-2">
              🏁 End Journey
            </span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default QuitConfirmationModal;
