
import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause } from 'lucide-react';
import VideoHoverHandler from './VideoHoverHandler';

interface VideoPlayerComponentProps {
  src: string;
  poster?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  playsInline?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
}

const VideoPlayerComponent: React.FC<VideoPlayerComponentProps> = ({
  src,
  poster,
  className = '',
  onLoad,
  onError,
  autoPlay = false,
  muted = true,
  loop = true,
  controls = false,
  playsInline = true,
  preload = 'metadata'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const [canPlay, setCanPlay] = useState(false);

  console.log(`🎬 VideoPlayerComponent initialized with src: ${src}`);

  const handleVideoLoad = () => {
    console.log('✅ Video loaded successfully:', src);
    setCanPlay(true);
    onLoad?.();
  };

  const handleVideoError = () => {
    console.error('❌ Video failed to load:', src);
    onError?.();
  };

  const handleVideoCanPlay = () => {
    console.log('✅ Video can play:', src);
    setCanPlay(true);
  };

  const handlePlay = () => {
    console.log('▶️ Video started playing');
    setIsPlaying(true);
    setHasStartedPlaying(true);
  };

  const handlePause = () => {
    console.log('⏸️ Video paused');
    setIsPlaying(false);
  };

  const handleHoverStart = async () => {
    console.log('🖱️ Hover started on video');
    setIsHovered(true);
    
    if (videoRef.current && !isPlaying && canPlay) {
      try {
        console.log('🎬 Attempting to play video on hover...');
        await videoRef.current.play();
        console.log('🎬 Video started playing on hover');
      } catch (error) {
        console.warn('⚠️ Could not auto-play video on hover:', error);
        // Try to load the video first
        if (videoRef.current) {
          videoRef.current.load();
          setTimeout(async () => {
            try {
              await videoRef.current?.play();
              console.log('🎬 Video started playing after reload');
            } catch (retryError) {
              console.warn('⚠️ Still could not play video after reload:', retryError);
            }
          }, 100);
        }
      }
    } else {
      console.log('🚫 Cannot play video:', { 
        hasVideo: !!videoRef.current, 
        isPlaying, 
        canPlay 
      });
    }
  };

  const handleHoverEnd = () => {
    console.log('🖱️ Hover ended on video');
    setIsHovered(false);
    
    if (videoRef.current && isPlaying && hasStartedPlaying) {
      videoRef.current.pause();
      // Reset to beginning for next hover
      videoRef.current.currentTime = 0;
      console.log('⏸️ Video paused and reset on hover end');
    }
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('🖱️ Video clicked');
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.warn);
      }
    }
  };

  const handleReactVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('❌ Video failed to load (React event):', e);
    onError?.();
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      console.log('🔧 Setting up video event listeners');
      
      video.addEventListener('loadeddata', handleVideoLoad);
      video.addEventListener('canplay', handleVideoCanPlay);
      video.addEventListener('error', handleVideoError);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);

      return () => {
        video.removeEventListener('loadeddata', handleVideoLoad);
        video.removeEventListener('canplay', handleVideoCanPlay);
        video.removeEventListener('error', handleVideoError);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
      };
    }
  }, [src]);

  return (
    <VideoHoverHandler
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
    >
      <div className="relative w-full h-full group">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className={`w-full h-full object-cover transition-transform duration-300 ${className}`}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          controls={controls}
          playsInline={playsInline}
          preload={preload}
          onClick={handleVideoClick}
          onError={handleReactVideoError}
          crossOrigin="anonymous"
        />
        
        {/* Play/Pause overlay - only show when not hovered and not playing */}
        {!isHovered && !isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-white bg-opacity-90 rounded-full p-3">
              <Play className="w-6 h-6 text-route66-rust" fill="currentColor" />
            </div>
          </div>
        )}

        {/* Pause overlay - show when playing and hovered */}
        {isHovered && isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-white bg-opacity-90 rounded-full p-3">
              <Pause className="w-6 h-6 text-route66-rust" fill="currentColor" />
            </div>
          </div>
        )}

        {/* Hover indicator */}
        {isHovered && (
          <div className="absolute bottom-2 left-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
            <span>🎬</span> HOVER TO LOOP
          </div>
        )}

        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
            {isPlaying ? '▶️' : '⏸️'} {canPlay ? '✅' : '⏳'} {isHovered ? '🖱️' : ''}
          </div>
        )}
      </div>
    </VideoHoverHandler>
  );
};

export default VideoPlayerComponent;
