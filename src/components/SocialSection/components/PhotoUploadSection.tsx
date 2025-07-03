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
const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({
  language
}) => {
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
  return <div className="space-y-4">
      {/* Community Stats */}
      <CommunityStats language={language} />
      {/* Photo Upload Call to Action */}
      

      {/* Community Gallery */}
      <CommunityGallery language={language} />
    </div>;
};
export default PhotoUploadSection;