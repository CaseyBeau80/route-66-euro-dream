import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CommunityStats from './CommunityStats';
import CarouselPhotoGallery from './CarouselPhotoGallery';
// No props needed - English only
const content = {
  en: {
    title: "Community Gallery",
    subtitle: "Latest photos from Route 66 travelers",
    trailblazer: "Trailblazer",
    noPhotos: "Be the first to share a photo!",
    loading: "Loading photos..."
  },
  de: {
    title: "Gemeinschaftsgalerie",
    subtitle: "Neueste Fotos von Route 66 Reisenden",
    trailblazer: "Wegbereiter",
    noPhotos: "Seien Sie der Erste, der ein Foto teilt!",
    loading: "Fotos werden geladen..."
  },
  fr: {
    title: "Galerie communautaire",
    subtitle: "Dernières photos des voyageurs de la Route 66",
    trailblazer: "Pionnier",
    noPhotos: "Soyez le premier à partager une photo !",
    loading: "Chargement des photos..."
  },
  'pt-BR': {
    title: "Galeria da comunidade",
    subtitle: "Fotos mais recentes de viajantes da Rota 66",
    trailblazer: "Desbravador",
    noPhotos: "Seja o primeiro a compartilhar uma foto!",
    loading: "Carregando fotos..."
  }
};
const CommunityGallery: React.FC = () => {
  const sectionContent = content.en; // Always use English
  return (
    <div className="space-y-4">
      <Card className="border-route66-border">
        <CardContent className="p-8">
          <CarouselPhotoGallery />
        </CardContent>
      </Card>
      
      {/* Community Stats */}
      <CommunityStats />
    </div>
  );
};

export default CommunityGallery;