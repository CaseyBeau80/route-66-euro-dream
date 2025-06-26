
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Heart, Share2, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import type { TimelineMilestone } from '@/data/timelineData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ImmersiveStorySectionProps {
  milestone: TimelineMilestone;
  index: number;
  isActive: boolean;
  onBecomeActive: () => void;
  onFavorite: (milestoneId: string) => void;
  isFavorited: boolean;
}

export const ImmersiveStorySection: React.FC<ImmersiveStorySectionProps> = ({
  milestone,
  index,
  isActive,
  onBecomeActive,
  onFavorite,
  isFavorited
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioRef, setAudioRef] = useState<HTMLAudioElement | null>(null);
  
  const isInView = useInView(sectionRef, { amount: 0.6 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax transforms
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  useEffect(() => {
    if (isInView && !isActive) {
      onBecomeActive();
    }
  }, [isInView, isActive, onBecomeActive]);

  // Debug image URL
  useEffect(() => {
    console.log(`🖼️ ImmersiveStorySection: Image URL for ${milestone.title}:`, {
      imageUrl: milestone.imageUrl,
      hasImage: !!milestone.imageUrl,
      year: milestone.year
    });
  }, [milestone.imageUrl, milestone.title, milestone.year]);

  // Apply visual style filters
  const getImageFilter = () => {
    switch (milestone.visualStyle) {
      case 'black-and-white':
        return 'grayscale(100%) contrast(1.2)';
      case 'sepia':
        return 'sepia(80%) contrast(1.1) brightness(1.1)';
      default:
        return 'none';
    }
  };

  const handleImageLoad = () => {
    console.log(`✅ Image loaded successfully for ${milestone.title}`);
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (error: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error(`❌ Image failed to load for ${milestone.title}:`, {
      src: milestone.imageUrl,
      error: error.currentTarget.src
    });
    setImageError(true);
    setImageLoaded(false);
  };

  const handleAudioToggle = () => {
    if (!milestone.audioNarrationUrl) return;
    
    if (!audioRef) {
      const audio = new Audio(milestone.audioNarrationUrl);
      setAudioRef(audio);
      audio.play();
      setIsAudioPlaying(true);
      
      audio.onended = () => {
        setIsAudioPlaying(false);
      };
    } else {
      if (isAudioPlaying) {
        audioRef.pause();
        setIsAudioPlaying(false);
      } else {
        audioRef.play();
        setIsAudioPlaying(true);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: milestone.title,
          text: milestone.description,
          url: `${window.location.origin}/timeline#${milestone.id}`
        });
      } catch (error) {
        // Fallback to copy to clipboard
        navigator.clipboard.writeText(`${window.location.origin}/timeline#${milestone.id}`);
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/timeline#${milestone.id}`);
    }
  };

  const isEven = index % 2 === 0;

  return (
    <motion.div
      id={milestone.id}
      ref={sectionRef}
      className={`min-h-screen flex items-center py-20 px-4 relative overflow-hidden`}
      style={{
        background: milestone.ambientColor 
          ? `linear-gradient(135deg, ${milestone.ambientColor}10 0%, transparent 100%)`
          : undefined
      }}
    >
      {/* Ambient background effect */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          background: milestone.ambientColor 
            ? `radial-gradient(circle at ${isEven ? '20%' : '80%'} 50%, ${milestone.ambientColor} 0%, transparent 70%)`
            : undefined
        }}
      />

      <div className="max-w-7xl mx-auto w-full">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
          isEven ? '' : 'lg:grid-flow-col-dense'
        }`}>
          
          {/* Content Side */}
          <motion.div
            ref={contentRef}
            style={{ y: contentY }}
            className={`space-y-8 ${isEven ? '' : 'lg:col-start-2'}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {/* Year Badge */}
              <div className="flex items-center gap-4 mb-6">
                <div className="text-8xl md:text-9xl font-bold text-route66-primary/20">
                  {milestone.year}
                </div>
                <div className="flex flex-col">
                  <div className="text-sm text-route66-text-muted uppercase tracking-wider">
                    {milestone.category.replace('_', ' ')}
                  </div>
                  <div className="text-4xl">{milestone.icon}</div>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-6xl font-bold text-route66-text-primary leading-tight mb-6">
                {milestone.title}
              </h2>

              {/* Description */}
              <p className="text-xl md:text-2xl text-route66-text-secondary leading-relaxed mb-8">
                {milestone.description}
              </p>

              {/* Extended Story */}
              {milestone.extendedStory && (
                <Card className="bg-white/80 backdrop-blur-sm p-6 mb-8">
                  <p className="text-lg text-route66-text-secondary leading-relaxed italic">
                    "{milestone.extendedStory}"
                  </p>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {milestone.isFavoritable && (
                  <Button
                    variant={isFavorited ? "default" : "outline"}
                    onClick={() => onFavorite(milestone.id)}
                    className="flex items-center gap-2"
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                    {isFavorited ? 'Favorited' : 'Favorite'}
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>

                {milestone.audioNarrationUrl && (
                  <Button
                    variant="outline"
                    onClick={handleAudioToggle}
                    className="flex items-center gap-2"
                  >
                    {isAudioPlaying ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Pause Story
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Listen to Story
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Details */}
              {milestone.details && milestone.details.length > 0 && (
                <Card className="bg-white/60 backdrop-blur-sm p-6 mt-8">
                  <h3 className="text-lg font-semibold text-route66-text-primary mb-4">
                    Key Details
                  </h3>
                  <ul className="space-y-3">
                    {milestone.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-route66-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-route66-text-secondary">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </motion.div>
          </motion.div>

          {/* Image Side */}
          <motion.div
            style={{ y: imageY, opacity }}
            className={`relative ${isEven ? 'lg:col-start-2' : ''}`}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              viewport={{ once: true }}
              className="relative"
            >
              {milestone.imageUrl ? (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-200">
                  {/* Loading placeholder */}
                  {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-route66-primary"></div>
                    </div>
                  )}
                  
                  {/* Error placeholder */}
                  {imageError && (
                    <div className="w-full h-96 md:h-[600px] flex items-center justify-center bg-gray-200 text-gray-500">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📷</div>
                        <div className="text-sm">Image not available</div>
                        <div className="text-xs mt-1 text-gray-400">
                          {milestone.year}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Actual image */}
                  <img
                    ref={imageRef}
                    src={milestone.imageUrl}
                    alt={milestone.title}
                    className={`w-full h-96 md:h-[600px] object-cover transition-all duration-700 ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ filter: getImageFilter() }}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    loading="lazy"
                  />
                  
                  {/* Image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  
                  {/* Year overlay */}
                  <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-full font-bold">
                    {milestone.year}
                  </div>

                  {/* Caption */}
                  {milestone.imageCaption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                      <p className="text-white text-sm leading-relaxed">
                        {milestone.imageCaption}
                      </p>
                      {milestone.imageSource && (
                        <p className="text-white/70 text-xs mt-2">
                          Source: {milestone.imageSource}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                // Fallback when no image URL is provided
                <div className="w-full h-96 md:h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-route66-primary/20 to-route66-accent-gold/20 flex items-center justify-center">
                  <div className="text-center text-route66-text-muted">
                    <div className="text-6xl mb-4">{milestone.icon}</div>
                    <div className="text-xl font-semibold">{milestone.year}</div>
                    <div className="text-sm mt-2">Historical Photo</div>
                  </div>
                </div>
              )}

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-route66-accent-gold/30 rounded-full animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-route66-accent-red/30 rounded-full animate-pulse delay-1000" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
