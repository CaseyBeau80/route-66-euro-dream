import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Camera, Trophy, Sparkles } from 'lucide-react';
import AnimatedConfetti from '@/components/Route66Countdown/AnimatedConfetti';

interface UploadSuccessCelebrationProps {
  isVisible: boolean;
  isTrailblazer: boolean;
  locationName?: string;
  hashtag?: string;
  onViewGallery: () => void;
  onUploadAnother: () => void;
  onClose: () => void;
  autoHideDuration?: number;
}

const UploadSuccessCelebration: React.FC<UploadSuccessCelebrationProps> = ({
  isVisible,
  isTrailblazer,
  locationName,
  hashtag,
  onViewGallery,
  onUploadAnother,
  onClose,
  autoHideDuration = 8000
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isVisible) {
      setProgress(100);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / autoHideDuration) * 100);
      setProgress(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onClose();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isVisible, autoHideDuration, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          {/* Confetti for all uploads, extra for trailblazers */}
          <AnimatedConfetti />
          
          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <Card className="max-w-md w-full bg-gradient-to-br from-route66-card via-white to-route66-primary/5 border-2 border-route66-accent/50 shadow-2xl overflow-hidden">
              <CardContent className="p-6 text-center space-y-5">
                {/* Auto-hide progress bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-route66-border">
                  <motion.div
                    className="h-full bg-route66-accent"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Icon/Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
                  className="relative inline-block"
                >
                  {isTrailblazer ? (
                    <div className="relative">
                      <Crown className="h-16 w-16 text-route66-accent mx-auto" />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-2 -right-2" />
                        <Star className="h-4 w-4 text-yellow-400 absolute -bottom-1 -left-2" />
                      </motion.div>
                    </div>
                  ) : (
                    <div className="bg-route66-primary/10 rounded-full p-4">
                      <Camera className="h-12 w-12 text-route66-primary mx-auto" />
                    </div>
                  )}
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  {isTrailblazer ? (
                    <>
                      <h2 className="text-2xl font-bold text-route66-text-primary">
                        🏆 You're a TRAILBLAZER!
                      </h2>
                      <p className="text-route66-text-secondary">
                        First to capture this location!
                      </p>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-route66-text-primary">
                        🎉 Photo Added!
                      </h2>
                      <p className="text-route66-text-secondary">
                        You're now part of the Route 66 Photo Wall!
                      </p>
                    </>
                  )}
                </motion.div>

                {/* Location & Hashtag badges */}
                {(locationName || hashtag) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap justify-center gap-2"
                  >
                    {locationName && (
                      <Badge variant="outline" className="bg-route66-background text-route66-text-secondary">
                        📍 {locationName}
                      </Badge>
                    )}
                    {hashtag && (
                      <Badge className="bg-route66-primary/20 text-route66-primary border-route66-primary/30">
                        {hashtag}
                      </Badge>
                    )}
                  </motion.div>
                )}

                {/* Trailblazer achievement badge */}
                {isTrailblazer && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Badge className="bg-gradient-to-r from-route66-accent to-yellow-500 text-white px-4 py-2 text-sm">
                      <Trophy className="h-4 w-4 mr-2" />
                      Trailblazer Achievement Unlocked!
                    </Badge>
                  </motion.div>
                )}

                {/* Action buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-3 pt-2"
                >
                  <Button
                    onClick={onViewGallery}
                    variant="outline"
                    className="flex-1 border-route66-border hover:bg-route66-background"
                  >
                    View in Gallery
                  </Button>
                  <Button
                    onClick={onUploadAnother}
                    className="flex-1 bg-route66-primary hover:bg-route66-primary/90 text-white"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Share Another
                  </Button>
                </motion.div>

                {/* Tap to dismiss hint */}
                <p className="text-xs text-route66-text-muted">
                  Tap outside to dismiss
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UploadSuccessCelebration;
