
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, RefreshCw, AlertCircle, Image } from 'lucide-react';
import { SupabaseImageService } from '../services/SupabaseImageService';
import { EnhancedImageValidationService } from '../services/EnhancedImageValidationService';

interface EnhancedTimelineImageProps {
  imageUrl?: string;
  title: string;
  year: number;
  icon: string;
  category: string;
  className?: string;
}

export const EnhancedTimelineImage: React.FC<EnhancedTimelineImageProps> = ({
  imageUrl,
  title,
  year,
  icon,
  category,
  className = ""
}) => {
  const [loadState, setLoadState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
  const [imageSource, setImageSource] = useState<'original' | 'migrated' | 'fallback' | 'none'>('none');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const loadImage = async () => {
      console.log(`🖼️ Loading image for ${title} (${year})`);
      setLoadState('loading');

      // Try migrated URL first
      const migratedUrl = SupabaseImageService.migrateTimelineImageUrl(imageUrl, year);
      
      if (migratedUrl && EnhancedImageValidationService.isValidImageUrl(migratedUrl)) {
        console.log(`🔄 Testing migrated URL for ${title}:`, migratedUrl);
        
        const canLoad = await EnhancedImageValidationService.testImageLoad(migratedUrl, 3000);
        
        if (canLoad) {
          console.log(`✅ Migrated image loaded for ${title}`);
          setFinalImageUrl(migratedUrl);
          setImageSource(migratedUrl === imageUrl ? 'original' : 'migrated');
          setLoadState('loaded');
          return;
        }
      }

      // Try fallback image
      const fallbackUrl = EnhancedImageValidationService.getFallbackImageUrl(year);
      
      if (fallbackUrl) {
        console.log(`🔄 Testing fallback URL for ${title}:`, fallbackUrl);
        
        const canLoad = await EnhancedImageValidationService.testImageLoad(fallbackUrl, 3000);
        
        if (canLoad) {
          console.log(`✅ Fallback image loaded for ${title}`);
          setFinalImageUrl(fallbackUrl);
          setImageSource('fallback');
          setLoadState('loaded');
          return;
        }
      }

      // No valid image found
      console.log(`❌ No valid image found for ${title}`);
      setLoadState('error');
      setImageSource('none');
      setErrorMessage(`No valid image available for ${year}`);
    };

    loadImage();
  }, [imageUrl, title, year]);

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

  const getSourceBadgeColor = () => {
    switch (imageSource) {
      case 'original':
        return 'bg-green-500';
      case 'migrated':
        return 'bg-blue-500';
      case 'fallback':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSourceBadgeText = () => {
    switch (imageSource) {
      case 'original':
        return 'Original';
      case 'migrated':
        return 'Supabase';
      case 'fallback':
        return 'Fallback';
      default:
        return 'None';
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

  // Success state - show actual image
  if (loadState === 'loaded' && finalImageUrl) {
    return (
      <div className={`relative rounded-2xl overflow-hidden shadow-2xl ${className}`}>
        <motion.img
          src={finalImageUrl}
          alt={`Historical photo: ${title} (${year})`}
          className="w-full h-96 md:h-[600px] object-cover"
          style={{ filter: getImageFilter() }}
          loading="lazy"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          onError={() => {
            console.error(`❌ Image render failed for ${title}:`, finalImageUrl);
            setLoadState('error');
            setErrorMessage('Image render failed');
          }}
        />
        
        {/* Year overlay */}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
          {year}
        </div>
        
        {/* Source badge */}
        <div className={`absolute top-4 right-4 ${getSourceBadgeColor()} text-white px-2 py-1 rounded text-xs font-medium`}>
          {getSourceBadgeText()}
        </div>
        
        {/* Vintage film effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none" />
      </div>
    );
  }

  // Error state - show fallback
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
                <Image className="w-4 h-4 text-white" />
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
};
