
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

  const handleVideoLoad = () => {
    console.log('✅ Video loaded successfully');
    onLoad?.();
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('❌ Video failed to load:', e);
    onError?.();
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setHasStartedPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleHoverStart = async () => {
    setIsHovered(true);
    if (videoRef.current && !isPlaying) {
      try {
        await videoRef.current.play();
        console.log('🎬 Video started playing on hover');
      } catch (error) {
        console.warn('⚠️ Could not auto-play video on hover:', error);
      }
    }
  };

  const handleHoverEnd = () => {
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
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.warn);
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadeddata', handleVideoLoad);
      video.addEventListener('error', handleVideoError);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);

      return () => {
        video.removeEventListener('loadeddata', handleVideoLoad);
        video.removeEventListener('error', handleVideoError);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
      };
    }
  }, []);

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
      </div>
    </VideoHoverHandler>
  );
};

export default VideoPlayerComponent;
