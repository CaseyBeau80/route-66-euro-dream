import React, { useState } from 'react';
import { Camera, Users, Trophy, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSocialPhotoUpload } from '../hooks/useSocialPhotoUpload';
import CommunityStats from './CommunityStats';
import { DragDropFileUpload } from '@/components/TestUpload/components/DragDropFileUpload';
import { StatusAlert } from '@/components/TestUpload/components/StatusAlert';
import { LoadingSpinner } from '@/components/TestUpload/components/LoadingSpinner';
import { UploadedImageDisplay } from '@/components/TestUpload/components/UploadedImageDisplay';
import TrailblazerCelebration from '@/components/TestUpload/components/TrailblazerCelebration';
import CommunityGallery from './CommunityGallery';

interface PhotoUploadSectionProps {
  language: string;
}

const content = {
  en: {
    title: "Share Your Adventure",
    subtitle: "Upload photos from your Route 66 journey",
    uploadPrompt: "Capture and share your Route 66 moments",
    galleryTitle: "Community Gallery",
    trailblazerTitle: "Become a Trailblazer"
  },
  de: {
    title: "Teilen Sie Ihr Abenteuer",
    subtitle: "Laden Sie Fotos von Ihrer Route 66 Reise hoch",
    uploadPrompt: "Erfassen und teilen Sie Ihre Route 66 Momente",
    galleryTitle: "Gemeinschaftsgalerie",
    trailblazerTitle: "Werden Sie ein Wegbereiter"
  },
  fr: {
    title: "Partagez votre aventure",
    subtitle: "Téléchargez des photos de votre voyage sur la Route 66",
    uploadPrompt: "Capturez et partagez vos moments Route 66",
    galleryTitle: "Galerie communautaire",
    trailblazerTitle: "Devenez un pionnier"
  },
  'pt-BR': {
    title: "Compartilhe sua aventura",
    subtitle: "Envie fotos da sua jornada pela Rota 66",
    uploadPrompt: "Capture e compartilhe seus momentos da Rota 66",
    galleryTitle: "Galeria da comunidade",
    trailblazerTitle: "Torne-se um desbravador"
  }
};

const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({ language }) => {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedStopId] = useState('social-photo-spot');
  const [selectedLocationName] = useState('Route 66 Community');
  
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

  const sectionContent = content[language as keyof typeof content] || content.en;

  return (
    <div className="space-y-4">
      {/* Community Stats */}
      <CommunityStats language={language} />
      {/* Photo Upload Call to Action */}
      <Card className="bg-gradient-to-r from-route66-primary/5 to-route66-accent/5 border-route66-border">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-route66-primary/10 rounded-full mb-3">
              <Camera className="h-6 w-6 text-route66-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-route66-text-primary">
              {sectionContent.title}
            </h3>
            <p className="text-route66-text-secondary mb-4 max-w-md mx-auto text-sm">
              {sectionContent.subtitle}
            </p>
            
            {!showUpload ? (
              <Button 
                onClick={() => setShowUpload(true)}
                className="bg-route66-primary hover:bg-route66-primary/90 text-white px-8 py-3 text-lg"
              >
                <Upload className="h-5 w-5 mr-2" />
                {sectionContent.uploadPrompt}
              </Button>
            ) : (
              <div className="space-y-6">
                <DragDropFileUpload 
                  onFileSelect={handleUpload}
                  disabled={loading}
                />
                
                {loading && <LoadingSpinner loading={loading} />}
                
                {status && (
                  <StatusAlert 
                    status={status}
                  />
                )}
                
                {photoUrl && (
                  <UploadedImageDisplay 
                    photoUrl={photoUrl}
                    isTrailblazer={isTrailblazer}
                    onReplacePhoto={() => {
                      setShowUpload(false);
                      resetUpload();
                    }}
                  />
                )}

                <div ref={resultsRef} />

                {showTrailblazerCelebration && (
                  <TrailblazerCelebration 
                    isVisible={showTrailblazerCelebration}
                    onClose={closeTrailblazerCelebration}
                    locationName={selectedLocationName}
                  />
                )}

                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowUpload(false);
                    resetUpload();
                  }}
                  className="border-route66-border text-route66-text-secondary hover:bg-route66-background"
                >
                  Upload Another Photo
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Community Gallery */}
      <CommunityGallery language={language} />
    </div>
  );
};

export default PhotoUploadSection;