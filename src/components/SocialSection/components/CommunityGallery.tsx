import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Calendar, Users } from 'lucide-react';
import { TrailblazerService } from '@/services/trailblazerService';
interface CommunityGalleryProps {
  language: string;
}
interface GalleryPhoto {
  id: string;
  photo_url: string;
  stop_id: string;
  created_at: string;
  is_trailblazer: boolean;
  user_session_id: string;
}
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
const CommunityGallery: React.FC<CommunityGalleryProps> = ({
  language
}) => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const galleryContent = content[language as keyof typeof content] || content.en;
  useEffect(() => {
    fetchRecentPhotos();
  }, []);
  const fetchRecentPhotos = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('photo_challenges').select('*').not('moderation_result', 'is', null).order('created_at', {
        ascending: false
      }).limit(6);
      if (error) {
        console.error('Error fetching photos:', error);
        setError('Failed to load photos');
        return;
      }

      // Filter for approved photos (basic moderation check)
      const approvedPhotos = data?.filter(photo => {
        if (!photo.moderation_result) return false;
        const moderation = photo.moderation_result as any;
        return (moderation.adult === 'VERY_UNLIKELY' || moderation.adult === 'UNLIKELY') && (moderation.violence === 'VERY_UNLIKELY' || moderation.violence === 'UNLIKELY') && (moderation.racy === 'VERY_UNLIKELY' || moderation.racy === 'UNLIKELY');
      }) || [];
      setPhotos(approvedPhotos);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  const formatUserSessionId = (sessionId: string) => {
    return TrailblazerService.formatSessionId(sessionId);
  };
  if (loading) {
    return <Card className="border-route66-border">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-route66-primary mx-auto mb-4"></div>
            <p className="text-route66-text-secondary">{galleryContent.loading}</p>
          </div>
        </CardContent>
      </Card>;
  }
  if (error) {
    return <Card className="border-route66-border">
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-route66-text-secondary">{error}</p>
          </div>
        </CardContent>
      </Card>;
  }
  return <Card className="border-route66-border">
      
    </Card>;
};
export default CommunityGallery;