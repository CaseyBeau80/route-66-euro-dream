import React, { useState } from 'react';
import { Camera, Users, Trophy, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSocialPhotoUpload } from '../hooks/useSocialPhotoUpload';
import { DragDropFileUpload } from '@/components/TestUpload/components/DragDropFileUpload';
import { StatusAlert } from '@/components/TestUpload/components/StatusAlert';
import { LoadingSpinner } from '@/components/TestUpload/components/LoadingSpinner';
import { UploadedImageDisplay } from '@/components/TestUpload/components/UploadedImageDisplay';
import TrailblazerCelebration from '@/components/TestUpload/components/TrailblazerCelebration';
// No props needed - English only
const content = {
  en: {
    title: "Share Your Adventure",
    subtitle: "Upload photos from your Route 66 journey",
    uploadPrompt: "Post Your Route 66 Photo",
    galleryTitle: "Community Gallery",
    trailblazerTitle: "Become a Trailblazer"
  },
  de: {
    title: "Teilen Sie Ihr Abenteuer",
    subtitle: "Laden Sie Fotos von Ihrer Route 66 Reise hoch",
    uploadPrompt: "Post Your Route 66 Photo",
    galleryTitle: "Gemeinschaftsgalerie",
    trailblazerTitle: "Werden Sie ein Wegbereiter"
  },
  fr: {
    title: "Partagez votre aventure",
    subtitle: "Téléchargez des photos de votre voyage sur la Route 66",
    uploadPrompt: "Post Your Route 66 Photo",
    galleryTitle: "Galerie communautaire",
    trailblazerTitle: "Devenez un pionnier"
  },
  'pt-BR': {
    title: "Compartilhe sua aventura",
    subtitle: "Envie fotos da sua jornada pela Rota 66",
    uploadPrompt: "Post Your Route 66 Photo",
    galleryTitle: "Galeria da comunidade",
    trailblazerTitle: "Torne-se um desbravador"
  }
};
const PhotoUploadSection: React.FC = () => {
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
  const sectionContent = content.en; // Always use English
  return <div className="space-y-8">
      {/* Photo Upload Call to Action */}
      <Card className="bg-gradient-to-r from-route66-primary/5 to-route66-accent/5 border-route66-border">
        <CardContent className="p-4">
          <div className="text-center">
            {!showUpload ? <Button onClick={() => setShowUpload(true)} className="bg-route66-primary hover:bg-route66-primary/90 text-white px-8 py-4 text-lg min-h-[50px] w-full sm:w-auto">
                <Camera className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-center">{sectionContent.uploadPrompt}</span>
              </Button> : <div className="space-y-6">
                <DragDropFileUpload onFileSelect={handleUpload} disabled={loading} />
                
                {loading && <LoadingSpinner loading={loading} />}
                
                {status && <StatusAlert status={status} />}
                
                {photoUrl && <UploadedImageDisplay photoUrl={photoUrl} isTrailblazer={isTrailblazer} onReplacePhoto={() => {
              setShowUpload(false);
              resetUpload();
            }} />}

                <div ref={resultsRef} />

                {showTrailblazerCelebration && <TrailblazerCelebration isVisible={showTrailblazerCelebration} onClose={closeTrailblazerCelebration} locationName={selectedLocationName} />}

                <Button variant="outline" onClick={() => {
              setShowUpload(false);
              resetUpload();
            }} className="border-route66-border text-route66-text-secondary hover:bg-route66-background min-h-[44px] w-full sm:w-auto px-6">
                  Upload Another Photo
                </Button>
              </div>}
          </div>
        </CardContent>
      </Card>


    </div>;
};
export default PhotoUploadSection;