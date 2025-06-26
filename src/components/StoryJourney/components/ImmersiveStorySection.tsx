
import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, MapPin, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import type { TimelineMilestone } from '@/data/timelineData';
import { TimelineImage } from './TimelineImage';
import { ImageValidationService } from '../services/ImageValidationService';
import { AudioService } from '../services/AudioService';

interface ImmersiveStorySectionProps {
  milestone: TimelineMilestone;
  index: number;
  isActive: boolean;
  onBecomeActive: () => void;
}

export const ImmersiveStorySection: React.FC<ImmersiveStorySectionProps> = ({
  milestone,
  index,
  isActive,
  onBecomeActive
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { 
    amount: 0.5, 
    margin: "-10% 0px -10% 0px" 
  });
  
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  
  // Auto-activate when in view
  useEffect(() => {
    if (isInView && !isActive) {
      onBecomeActive();
    }
  }, [isInView, isActive, onBecomeActive]);

  // Validate image URL on mount
  useEffect(() => {
    if (milestone.imageUrl && !ImageValidationService.isValidImageUrl(milestone.imageUrl)) {
      console.warn(`⚠️ Timeline image validation failed for ${milestone.title}:`, {
        url: milestone.imageUrl,
        year: milestone.year,
        supportedFormats: ['.jpg', '.jpeg', '.png']
      });
    }
  }, [milestone.imageUrl, milestone.title, milestone.year]);

  // Cleanup audio when component unmounts or changes
  useEffect(() => {
    return () => {
      if (audioRef) {
        audioRef.pause();
        audioRef.currentTime = 0;
      }
    };
  }, [audioRef]);

  const handleAudioToggle = async () => {
    if (isAudioPlaying) {
      audioRef?.pause();
      setIsAudioPlaying(false);
      return;
    }

    if (!audioRef) {
      setAudioLoading(true);
      try {
        const audio = await AudioService.createAudioForMilestone(milestone.year);
        if (audio) {
          audio.addEventListener('ended', () => setIsAudioPlaying(false));
          audio.addEventListener('pause', () => setIsAudioPlaying(false));
          setAudioRef(audio);
          await audio.play();
          setIsAudioPlaying(true);
        } else {
          console.log('No audio available for this milestone');
        }
      } catch (error) {
        console.log('Audio playback failed:', error);
      } finally {
        setAudioLoading(false);
      }
    } else {
      try {
        await audioRef.play();
        setIsAudioPlaying(true);
      } catch (error) {
        console.log('Audio playback failed:', error);
      }
    }
  };

  const getCategoryStyle = () => {
    switch (milestone.category) {
      case 'establishment':
        return {
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          borderColor: 'rgba(34, 197, 94, 0.2)'
        };
      case 'cultural':
        return {
          background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          borderColor: 'rgba(147, 51, 234, 0.2)'
        };
      case 'decline':
        return {
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          borderColor: 'rgba(249, 115, 22, 0.2)'
        };
      case 'modern':
        return {
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          borderColor: 'rgba(59, 130, 246, 0.2)'
        };
      default:
        return {
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          borderColor: 'rgba(59, 130, 246, 0.2)'
        };
    }
  };

  const categoryStyle = getCategoryStyle();

  return (
    <motion.section
      ref={sectionRef}
      id={`timeline-${milestone.year}`}
      className="min-h-screen flex items-center justify-center px-4 py-20 relative"
      style={{ background: categoryStyle.background }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0.7 }}
      transition={{ duration: 0.8 }}
    >
      {/* Content Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">
        
        {/* Text Content */}
        <motion.div
          className="space-y-8 lg:pr-8"
          initial={{ x: -50, opacity: 0 }}
          animate={{ 
            x: isActive ? 0 : -20, 
            opacity: isActive ? 1 : 0.8 
          }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Year Header */}
          <div className="flex items-center gap-6">
            <div className="text-7xl md:text-8xl lg:text-9xl font-bold text-route66-primary/20 leading-none">
              {milestone.year}
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-sm text-route66-text-muted uppercase tracking-wider font-semibold">
                {milestone.category.replace('_', ' ')}
              </div>
              <div className="flex items-center gap-2 text-route66-text-secondary mt-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{milestone.year}</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-route66-text-primary leading-tight"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isActive ? 0 : 10, opacity: isActive ? 1 : 0.8 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {milestone.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-xl md:text-2xl text-route66-text-secondary leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isActive ? 0 : 10, opacity: isActive ? 1 : 0.8 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {milestone.description}
          </motion.p>

          {/* Details */}
          {milestone.details && milestone.details.length > 0 && (
            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border"
              style={{ borderColor: categoryStyle.borderColor }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: isActive ? 0 : 10, opacity: isActive ? 1 : 0.8 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h3 className="text-lg font-semibold text-route66-text-primary mb-4 flex items-center gap-3">
                <span className="text-2xl">{milestone.icon}</span>
                Key Details
              </h3>
              <ul className="space-y-3">
                {milestone.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-start gap-3">
                    <ArrowRight className="w-4 h-4 text-route66-primary mt-1 flex-shrink-0" />
                    <span className="text-route66-text-secondary">{detail}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Audio Control */}
          <motion.button
            onClick={handleAudioToggle}
            disabled={audioLoading}
            className="flex items-center gap-3 px-6 py-3 bg-route66-primary/10 hover:bg-route66-primary/20 rounded-full transition-colors duration-300 disabled:opacity-50"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isActive ? 0 : 10, opacity: isActive ? 1 : 0.8 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            {audioLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-route66-primary"></div>
            ) : isAudioPlaying ? (
              <VolumeX className="w-5 h-5 text-route66-primary" />
            ) : (
              <Volume2 className="w-5 h-5 text-route66-primary" />
            )}
            <span className="text-route66-text-primary font-medium">
              {audioLoading ? 'Loading...' : isAudioPlaying ? 'Stop Audio' : 'Listen to Story'}
            </span>
          </motion.button>
        </motion.div>

        {/* Visual Content */}
        <motion.div
          className="relative"
          initial={{ x: 50, opacity: 0 }}
          animate={{ 
            x: isActive ? 0 : 20, 
            opacity: isActive ? 1 : 0.8 
          }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <TimelineImage
            imageUrl={milestone.imageUrl}
            title={milestone.title}
            year={milestone.year}
            icon={milestone.icon}
            category={milestone.category}
            className="transform hover:scale-105 transition-transform duration-500"
          />

          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-route66-accent-gold/30 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-route66-accent-red/30 rounded-full animate-pulse delay-1000"></div>
        </motion.div>
      </div>

      {/* Navigation hint */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <motion.div
          className="text-center text-route66-text-muted"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isActive ? 1 : 0.5, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <p className="text-sm">Scroll to continue the journey</p>
          <motion.div
            className="w-px h-8 bg-route66-primary/30 mx-auto mt-2"
            animate={{ scaleY: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </motion.section>
  );
};
