import React, { useState, useEffect, useRef } from 'react';
import { Camera, MapPin, Hash, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSocialPhotoUpload } from '../hooks/useSocialPhotoUpload';
import { DragDropFileUpload } from '@/components/TestUpload/components/DragDropFileUpload';
import { StatusAlert } from '@/components/TestUpload/components/StatusAlert';
import { LoadingSpinner } from '@/components/TestUpload/components/LoadingSpinner';
import TrailblazerCelebration from '@/components/TestUpload/components/TrailblazerCelebration';
import UploadSuccessCelebration from './UploadSuccessCelebration';
import { Profanity } from '@2toad/profanity';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhotoGalleryRefresh } from '../context/PhotoGalleryContext';

// Initialize profanity filter
const profanity = new Profanity({ wholeWord: false });

const content = {
  title: "Share Your Adventure",
  subtitle: "Upload photos from your Route 66 journey",
  uploadPrompt: "Post Your Route 66 Photo",
  galleryTitle: "Community Gallery",
  trailblazerTitle: "Become a Trailblazer"
};

const PhotoUploadSection: React.FC = () => {
  const { triggerRefresh } = usePhotoGalleryRefresh();
  
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [hashtag, setHashtag] = useState('');
  const [textErrors, setTextErrors] = useState<{ location?: string; hashtag?: string }>({});
  const [isConfirming, setIsConfirming] = useState(false);
  const [showSuccessCelebration, setShowSuccessCelebration] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState(false);
  const [uploadedLocation, setUploadedLocation] = useState('');
  const [uploadedHashtag, setUploadedHashtag] = useState('');
  
  const locationInputRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  
  const selectedLocationName = 'Route 66 Community';
  
  const {
    status,
    loading,
    moderationResults,
    photoUrl,
    isTrailblazer,
    showTrailblazerCelebration,
    uploadedPhotos,
    handleUpload,
    resetUpload,
    closeTrailblazerCelebration,
    resultsRef
  } = useSocialPhotoUpload();

  // Auto-focus location input when confirmation mode starts
  useEffect(() => {
    if (pendingConfirmation && locationInputRef.current) {
      setTimeout(() => locationInputRef.current?.focus(), 100);
    }
  }, [pendingConfirmation]);

  // Create preview URL when file is selected
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const validateTextField = (value: string, field: 'location' | 'hashtag'): boolean => {
    if (value && profanity.exists(value)) {
      setTextErrors(prev => ({
        ...prev,
        [field]: `${field === 'location' ? 'Location' : 'Hashtag'} contains inappropriate language`
      }));
      return false;
    }
    setTextErrors(prev => ({ ...prev, [field]: undefined }));
    return true;
  };

  const handleLocationChange = (value: string) => {
    const trimmed = value.slice(0, 60);
    setLocation(trimmed);
    if (trimmed) validateTextField(trimmed, 'location');
    else setTextErrors(prev => ({ ...prev, location: undefined }));
  };

  const handleHashtagChange = (value: string) => {
    // Remove ALL # characters first (we'll add our own)
    let cleaned = value.replace(/#/g, '');
    
    // Remove any characters that aren't alphanumeric or underscore
    cleaned = cleaned.replace(/[^a-zA-Z0-9_]/g, '');
    
    // Always prefix with # if there's content, otherwise allow empty
    const normalized = cleaned ? '#' + cleaned : '';
    
    // Apply length limit (30 chars including the #)
    const final = normalized.slice(0, 30);
    
    setHashtag(final);
    
    if (final) {
      validateTextField(final, 'hashtag');
    } else {
      setTextErrors(prev => ({ ...prev, hashtag: undefined }));
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setPendingConfirmation(true);
    setLocation('');
    setHashtag('');
    setTextErrors({});
  };

  const handleConfirmSubmission = async () => {
    if (!selectedFile) return;
    
    // Validate text fields before submission
    const locationValid = !location || validateTextField(location, 'location');
    const hashtagValid = !hashtag || validateTextField(hashtag, 'hashtag');
    
    if (!locationValid || !hashtagValid) {
      return;
    }

    setIsConfirming(true);
    
    try {
      console.log('📸 Uploading photo with metadata:', { location, hashtag });
      const result = await handleUpload(selectedFile, location, hashtag);
      
      if (result.success && 'allowed' in result && result.allowed) {
        setUploadedLocation(location);
        setUploadedHashtag(hashtag);
        setPendingConfirmation(false);
        setSelectedFile(null);
        
        // Trigger gallery refresh immediately after successful upload
        triggerRefresh();
        
        // Show success celebration (unless trailblazer celebration takes priority)
        if (!('isTrailblazer' in result && result.isTrailblazer)) {
          setShowSuccessCelebration(true);
        }
      }
    } finally {
      setIsConfirming(false);
    }
  };

  const handleChangePhoto = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPendingConfirmation(false);
    // Keep location/hashtag values for next attempt
  };

  const handleCancelUpload = () => {
    setShowUpload(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setPendingConfirmation(false);
    setLocation('');
    setHashtag('');
    setTextErrors({});
    resetUpload();
  };

  const handleViewGallery = () => {
    setShowSuccessCelebration(false);
    // Scroll to gallery section
    if (galleryRef.current) {
      galleryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleUploadAnother = () => {
    setShowSuccessCelebration(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setLocation('');
    setHashtag('');
    setTextErrors({});
    resetUpload();
    setShowUpload(true);
  };

  const hasTextErrors = !!(textErrors.location || textErrors.hashtag);

  const getCharacterCountColor = (current: number, max: number) => {
    const percentage = current / max;
    if (percentage >= 1) return 'text-destructive';
    if (percentage >= 0.8) return 'text-yellow-600';
    return 'text-muted-foreground';
  };

  return (
    <div className="space-y-8">
      {/* Photo Upload Call to Action */}
      <Card className="bg-gradient-to-r from-route66-primary/5 to-route66-accent/5 border-route66-border">
        <CardContent className="p-4">
          <div className="text-center">
            {!showUpload ? (
              <Button 
                onClick={() => setShowUpload(true)} 
                className="bg-route66-primary hover:bg-route66-primary/90 text-white px-8 py-4 text-lg min-h-[50px] w-full sm:w-auto"
              >
                <Camera className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-center">{content.uploadPrompt}</span>
              </Button>
            ) : (
              <div className="space-y-6">
                {/* Step 1: File Selection (hidden when in confirmation mode) */}
                {!pendingConfirmation && (
                  <>
                    <DragDropFileUpload onFileSelect={handleFileSelect} disabled={loading} />
                    
                    {loading && <LoadingSpinner loading={loading} />}
                    
                    {status && <StatusAlert status={status} />}
                    
                    <div ref={resultsRef} />
                  </>
                )}

                {/* Step 2: Confirmation with Location/Hashtag */}
                <AnimatePresence>
                  {pendingConfirmation && previewUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {/* Large Photo Preview */}
                      <div className="relative max-w-lg mx-auto">
                        <div className="aspect-square rounded-xl overflow-hidden bg-route66-background shadow-lg">
                          <img
                            src={previewUrl}
                            alt="Photo preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Change Photo Button */}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleChangePhoto}
                          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white shadow-md"
                        >
                          Change Photo
                        </Button>
                      </div>

                      {/* Location & Hashtag Inputs */}
                      <div className="max-w-lg mx-auto space-y-4 text-left">
                        {/* Location Input */}
                        <div className="space-y-2">
                          <Label htmlFor="location" className="flex items-center gap-2 text-route66-text-secondary">
                            <MapPin className="h-4 w-4" />
                            Location (optional)
                          </Label>
                          <div className="relative">
                            <Input
                              ref={locationInputRef}
                              id="location"
                              type="text"
                              placeholder="Where on Route 66? (e.g., Cadillac Ranch)"
                              value={location}
                              onChange={(e) => handleLocationChange(e.target.value)}
                              maxLength={60}
                              className={`pr-16 ${
                                textErrors.location 
                                  ? 'border-destructive focus-visible:ring-destructive animate-shake' 
                                  : ''
                              }`}
                            />
                            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${getCharacterCountColor(location.length, 60)}`}>
                              {location.length}/60
                            </span>
                          </div>
                          {textErrors.location && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-sm text-destructive flex items-center gap-1"
                            >
                              <AlertCircle className="h-3 w-3" />
                              {textErrors.location}
                            </motion.p>
                          )}
                        </div>

                        {/* Hashtag Input */}
                        <div className="space-y-2">
                          <Label htmlFor="hashtag" className="flex items-center gap-2 text-route66-text-secondary">
                            <Hash className="h-4 w-4" />
                            Hashtag (optional)
                          </Label>
                          <div className="relative">
                            <Input
                              id="hashtag"
                              type="text"
                              placeholder="#Route66Centennial"
                              value={hashtag}
                              onChange={(e) => handleHashtagChange(e.target.value)}
                              maxLength={30}
                              className={`pr-16 ${
                                textErrors.hashtag 
                                  ? 'border-destructive focus-visible:ring-destructive animate-shake' 
                                  : ''
                              }`}
                            />
                            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${getCharacterCountColor(hashtag.length, 30)}`}>
                              {hashtag.length}/30
                            </span>
                          </div>
                          {textErrors.hashtag && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-sm text-destructive flex items-center gap-1"
                            >
                              <AlertCircle className="h-3 w-3" />
                              {textErrors.hashtag}
                            </motion.p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Try #Route66Centennial or #MotherRoadMemories
                          </p>
                        </div>

                        {/* Public Notice */}
                        <p className="text-sm text-muted-foreground bg-route66-background rounded-lg p-3 flex items-center gap-2">
                          <Check className="h-4 w-4 text-route66-primary flex-shrink-0" />
                          Photo will be visible to all Route 66 travelers
                        </p>

                        {/* Loading/Status */}
                        {(loading || isConfirming) && (
                          <div className="text-center py-2">
                            <LoadingSpinner loading={true} />
                            <p className="text-sm text-route66-text-secondary mt-2">
                              Submitting to the Photo Wall...
                            </p>
                          </div>
                        )}

                        {status && !loading && !isConfirming && (
                          <StatusAlert status={status} />
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <Button
                            variant="outline"
                            onClick={handleCancelUpload}
                            disabled={loading || isConfirming}
                            className="flex-1 border-route66-border"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleConfirmSubmission}
                            disabled={loading || isConfirming || hasTextErrors}
                            className="flex-1 bg-route66-primary hover:bg-route66-primary/90 text-white"
                          >
                            {isConfirming ? 'Submitting...' : 'Confirm Submission'}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Trailblazer Celebration (from base hook) */}
                {showTrailblazerCelebration && (
                  <TrailblazerCelebration 
                    isVisible={showTrailblazerCelebration} 
                    onClose={closeTrailblazerCelebration} 
                    locationName={selectedLocationName} 
                  />
                )}

                {/* Non-trailblazer upload button (when upload complete but not in confirmation) */}
                {!pendingConfirmation && photoUrl && !showTrailblazerCelebration && (
                  <Button 
                    variant="outline" 
                    onClick={handleUploadAnother}
                    className="border-route66-border text-route66-text-secondary hover:bg-route66-background min-h-[44px] w-full sm:w-auto px-6"
                  >
                    Upload Another Photo
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Success Celebration */}
      <UploadSuccessCelebration
        isVisible={showSuccessCelebration}
        isTrailblazer={isTrailblazer}
        locationName={uploadedLocation}
        hashtag={uploadedHashtag}
        onViewGallery={handleViewGallery}
        onUploadAnother={handleUploadAnother}
        onClose={() => setShowSuccessCelebration(false)}
      />

      {/* Gallery ref for scrolling */}
      <div ref={galleryRef} />
    </div>
  );
};

export default PhotoUploadSection;
