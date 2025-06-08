
import React from 'react';
import { Play } from 'lucide-react';

interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  className?: string;
  autoplay?: boolean;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ 
  videoId, 
  title = "YouTube video", 
  className = "",
  autoplay = false 
}) => {
  const embedUrl = `https://www.youtube.com/embed/${videoId}${autoplay ? '?autoplay=1' : ''}`;

  return (
    <div className={`relative w-full ${className}`}>
      <div className="aspect-video relative rounded-lg overflow-hidden shadow-lg border border-route66-border">
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
        
        {/* Optional overlay for styling */}
        <div className="absolute inset-0 pointer-events-none border-2 border-route66-primary/20 rounded-lg"></div>
      </div>
      
      {/* Video caption */}
      {title && (
        <div className="mt-2 flex items-center gap-2 text-sm text-route66-text-secondary">
          <Play className="h-4 w-4 text-route66-primary" />
          <span>{title}</span>
        </div>
      )}
    </div>
  );
};

export default YouTubeEmbed;
