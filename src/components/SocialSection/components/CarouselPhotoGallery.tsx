import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { Trophy, Calendar, RotateCcw, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TrailblazerService } from '@/services/trailblazerService';
import { usePhotoRotation } from '../hooks/usePhotoRotation';

interface CarouselPhotoGalleryProps {
  language: string;
}

const content = {
  en: {
    trailblazer: "Trailblazer",
    noPhotos: "Be the first to share a photo!",
    loading: "Loading photos...",
    refreshPhotos: "Refresh Photos",
    pauseRotation: "Pause Rotation",
    resumeRotation: "Resume Rotation",
    photosOf: "of",
    autoRotating: "Auto-rotating every 8 seconds"
  },
  de: {
    trailblazer: "Wegbereiter",
    noPhotos: "Seien Sie der Erste, der ein Foto teilt!",
    loading: "Fotos werden geladen...",
    refreshPhotos: "Fotos aktualisieren",  
    pauseRotation: "Rotation pausieren",
    resumeRotation: "Rotation fortsetzen",
    photosOf: "von",
    autoRotating: "Automatische Rotation alle 8 Sekunden"
  },
  fr: {
    trailblazer: "Pionnier",
    noPhotos: "Soyez le premier à partager une photo !",
    loading: "Chargement des photos...",
    refreshPhotos: "Actualiser les photos",
    pauseRotation: "Pause de rotation", 
    resumeRotation: "Reprendre la rotation",
    photosOf: "de",
    autoRotating: "Rotation automatique toutes les 8 secondes"
  },
  'pt-BR': {
    trailblazer: "Desbravador",
    noPhotos: "Seja o primeiro a compartilhar uma foto!",
    loading: "Carregando fotos...",
    refreshPhotos: "Atualizar fotos",
    pauseRotation: "Pausar rotação",
    resumeRotation: "Retomar rotação", 
    photosOf: "de",
    autoRotating: "Rotação automática a cada 8 segundos"
  }
};

const CarouselPhotoGallery: React.FC<CarouselPhotoGalleryProps> = ({ language }) => {
  const galleryContent = content[language as keyof typeof content] || content.en;
  
  const {
    photos,
    allPhotosCount,
    loading,
    error,
    isRotating,
    currentRotationIndex,
    controls,
  } = usePhotoRotation({
    totalPhotos: 30,
    displayCount: 6,
    rotationInterval: 8000,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatUserSessionId = (sessionId: string) => {
    return TrailblazerService.formatSessionId(sessionId);
  };

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-route66-primary mx-auto mb-4"></div>
        <p className="text-route66-text-secondary">{galleryContent.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-route66-text-secondary">{error}</p>
        <Button 
          onClick={controls.refresh}
          variant="outline"
          className="mt-4"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          {galleryContent.refreshPhotos}
        </Button>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-route66-text-secondary text-lg">
          {galleryContent.noPhotos}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls and Stats */}
      <div className="flex items-center justify-between text-sm text-route66-text-secondary">
        <div className="flex items-center gap-4">
          <span>
            {photos.length} {galleryContent.photosOf} {allPhotosCount} photos
          </span>
          {allPhotosCount > photos.length && (
            <span className="flex items-center gap-1">
              {isRotating ? (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              ) : (
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
              )}
              {isRotating ? galleryContent.autoRotating : "Rotation paused"}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {allPhotosCount > photos.length && (
            <Button
              onClick={isRotating ? controls.stopRotation : controls.startRotation}
              variant="ghost"
              size="sm"
              className="text-xs"
            >
              {isRotating ? (
                <>
                  <Pause className="h-3 w-3 mr-1" />
                  {galleryContent.pauseRotation}
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 mr-1" />
                  {galleryContent.resumeRotation}
                </>
              )}
            </Button>
          )}
          
          <Button
            onClick={controls.manualRotate}
            variant="ghost"
            size="sm"
            className="text-xs"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            {galleryContent.refreshPhotos}
          </Button>
        </div>
      </div>

      {/* Photo Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {photos.map((photo, index) => (
            <CarouselItem key={`${photo.id}-${currentRotationIndex}`} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
              <div className="group relative">
                <div className="aspect-square rounded-lg overflow-hidden bg-route66-background">
                  <img
                    src={photo.photo_url}
                    alt={`Route 66 photo from ${photo.stop_id}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg">
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-route66-text-primary">
                          {formatUserSessionId(photo.user_session_id || '')}
                        </span>
                        {photo.is_trailblazer && (
                          <Badge className="bg-route66-accent text-white">
                            <Trophy className="h-3 w-3 mr-1" />
                            {galleryContent.trailblazer}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-route66-text-secondary">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(photo.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex -left-4" />
        <CarouselNext className="hidden sm:flex -right-4" />
      </Carousel>
    </div>
  );
};

export default CarouselPhotoGallery;