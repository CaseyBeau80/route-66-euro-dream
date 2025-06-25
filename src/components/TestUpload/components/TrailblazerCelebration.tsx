
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, Star, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TrailblazerCelebrationProps {
  isVisible: boolean;
  onClose: () => void;
  locationName?: string;
  autoHide?: boolean;
  duration?: number;
}

const TrailblazerCelebration: React.FC<TrailblazerCelebrationProps> = ({
  isVisible,
  onClose,
  locationName = 'this location',
  autoHide = true,
  duration = 5000
}) => {
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowCelebration(true);
      
      if (autoHide) {
        const timer = setTimeout(() => {
          setShowCelebration(false);
          setTimeout(onClose, 500); // Allow exit animation
        }, duration);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, autoHide, duration, onClose]);

  if (!isVisible && !showCelebration) return null;

  return (
    <AnimatePresence>
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setShowCelebration(false);
            setTimeout(onClose, 500);
          }}
        >
          <Card className="max-w-md mx-4 overflow-hidden">
            <CardContent className="p-8 text-center bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500">
              {/* Animated Crown */}
              <motion.div
                initial={{ rotate: -20, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                className="mb-4"
              >
                <Crown size={64} className="mx-auto text-yellow-200 drop-shadow-lg" />
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="text-3xl font-bold text-white mb-2 drop-shadow-md"
              >
                🏆 TRAILBLAZER! 🏆
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
                className="text-lg text-yellow-100 mb-4 drop-shadow-sm"
              >
                You're the FIRST to capture {locationName}!
              </motion.p>

              {/* Celebration Icons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.4 }}
                className="flex justify-center space-x-4 mb-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Star size={24} className="text-yellow-200" />
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Trophy size={24} className="text-yellow-200" />
                </motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={24} className="text-yellow-200" />
                </motion.div>
              </motion.div>

              {/* Achievement Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.4 }}
                className="text-white/90 text-sm"
              >
                <p className="font-semibold">Achievement Unlocked!</p>
                <p>Your photo will be featured as the first at this spot</p>
              </motion.div>

              {/* Floating Particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TrailblazerCelebration;
