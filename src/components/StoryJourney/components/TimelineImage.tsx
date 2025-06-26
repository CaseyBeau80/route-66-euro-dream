
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, RefreshCw, AlertCircle } from 'lucide-react';

interface TimelineImageProps {
  imageUrl?: string;
  title: string;
  year: number;
  icon: string;
  category: string;
  className?: string;
}

export const TimelineImage: React.FC<TimelineImageProps> = ({
  imageUrl,
  title,
  year,
  icon,
  category,
  className = ""
}) => {
  const [loadState, setLoadState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [actualImageUrl, setActualImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!imageUrl) {
      console.log(`❌ No image URL provided for ${title}`);
      setLoadState('error');
      setErrorMessage('No image URL provided');
      return;
    }

    console.log(`🖼️ Attempting to load image for ${title}:`, imageUrl);
    setLoadState('loading');
    setActualImageUrl(imageUrl);

    // Create a new image element to test loading
    const img = new Image();
    
    img.onload = () => {
      console.log(`✅ Image loaded successfully for ${title}`);
      setLoadState('loaded');
      setErrorMessage('');
    };
    
    img.onerror = (error) => {
      console.error(`❌ Image failed to load for ${title}:`, { url: imageUrl, error });
      setLoadState('error');
      setErrorMessage(`Failed to load: ${imageUrl}`);
    };
    
    // Set the source to trigger loading
    img.src = imageUrl;

    // Cleanup function
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl, title]);

  const getImageFilter = () => {
    switch (category) {
      case 'establishment':
        return 'sepia(0.3) contrast(1.1)';
      case 'decline':
        return 'grayscale(0.2) brightness(0.9)';
      case 'cultural':
        return 'saturate(1.2) contrast(1.05)';
      default:
        return 'none';
    }
  };

  // Loading state
  if (loadState === 'loading') {
    return (
      <div className={`relative rounded-2xl overflow-hidden shadow-2xl bg-gray-200 ${className}`}>
        <div className="w-full h-96 md:h-[600px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-route66-primary mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading image...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state - show fallback
  if (loadState === 'error' || !actualImageUrl) {
    return (
      <div className={`relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-route66-primary/20 to-route66-accent-gold/20 ${className}`}>
        <div className="w-full h-96 md:h-[600px] flex items-center justify-center">
          <div className="text-center text-route66-text-muted p-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="relative">
                <div className="text-6xl mb-2">{icon}</div>
                <div className="absolute -bottom-1 -right-1 bg-gray-400 rounded-full p-1">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <div className="text-xl font-semibold text-route66-text-primary">{year}</div>
                <div className="text-sm mt-1 text-gray-500">Image not available</div>
                {errorMessage && (
                  <div className="text-xs mt-2 text-red-500 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Success state - show actual image
  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-2xl ${className}`}>
      <motion.img
        src={actualImageUrl}
        alt={`Historical photo: ${title} (${year})`}
        className="w-full h-96 md:h-[600px] object-cover"
        style={{ filter: getImageFilter() }}
        loading="lazy"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        onError={() => {
          console.error(`❌ Image render failed for ${title}:`, actualImageUrl);
          setLoadState('error');
          setErrorMessage('Image render failed');
        }}
      />
      
      {/* Image overlay with year */}
      <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
        {year}
      </div>
      
      {/* Vintage film effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
    </div>
  );
};
