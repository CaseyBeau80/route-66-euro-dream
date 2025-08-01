import React from 'react';
import { Instagram, Users, Heart, MessageCircle } from 'lucide-react';
import SimpleInstagramCarousel from '../InstagramCarousel/components/SimpleInstagramCarousel';
import PhotoUploadSection from './components/PhotoUploadSection';
import CommunityGallery from './components/CommunityGallery';
// No props needed - English only
const socialContent = {
  en: {
    badge: "Join the Community",
    title: "Share Your Route 66 Adventure",
    subtitle: "Connect with fellow travelers and share your journey",
    description: "Join thousands of Route 66 enthusiasts sharing their experiences, tips, and memorable moments from America's most famous highway.",
    hashtagTitle: "Use our hashtag",
    hashtag: "#Ramble66",
    stats: [{
      icon: Users,
      number: "20K+",
      label: "Travelers"
    }, {
      icon: Heart,
      number: "150K+",
      label: "Photos Shared"
    }, {
      icon: MessageCircle,
      number: "5K+",
      label: "Trip Stories"
    }]
  },
  de: {
    badge: "Tritt der Community bei",
    title: "Teile dein Route 66 Abenteuer",
    subtitle: "Verbinde dich mit anderen Reisenden und teile deine Reise",
    description: "Schließe dich Tausenden von Route 66-Enthusiasten an, die ihre Erfahrungen, Tipps und unvergesslichen Momente von Amerikas berühmtester Straße teilen.",
    hashtagTitle: "Verwende unseren Hashtag",
    hashtag: "#Ramble66",
    stats: [{
      icon: Users,
      number: "20K+",
      label: "Reisende"
    }, {
      icon: Heart,
      number: "150K+",
      label: "Geteilte Fotos"
    }, {
      icon: MessageCircle,
      number: "5K+",
      label: "Reisegeschichten"
    }]
  },
  fr: {
    badge: "Rejoignez la Communauté",
    title: "Partagez votre Aventure Route 66",
    subtitle: "Connectez-vous avec d'autres voyageurs et partagez votre voyage",
    description: "Rejoignez des milliers d'enthousiastes de la Route 66 qui partagent leurs expériences, conseils et moments mémorables de la route la plus célèbre d'Amérique.",
    hashtagTitle: "Utilisez notre hashtag",
    hashtag: "#Ramble66",
    stats: [{
      icon: Users,
      number: "20K+",
      label: "Voyageurs"
    }, {
      icon: Heart,
      number: "150K+",
      label: "Photos Partagées"
    }, {
      icon: MessageCircle,
      number: "5K+",
      label: "Histoires de Voyage"
    }]
  },
  "pt-BR": {
    badge: "Junte-se à Comunidade",
    title: "Compartilhe sua Aventura na Rota 66",
    subtitle: "Conecte-se com outros viajantes e compartilhe sua jornada",
    description: "Junte-se a milhares de entusiastas da Rota 66 compartilhando suas experiências, dicas e momentos memoráveis da rodovia mais famosa da América.",
    hashtagTitle: "Use nossa hashtag",
    hashtag: "#Ramble66",
    stats: [{
      icon: Users,
      number: "20K+",
      label: "Viajantes"
    }, {
      icon: Heart,
      number: "150K+",
      label: "Fotos Compartilhadas"
    }, {
      icon: MessageCircle,
      number: "5K+",
      label: "Histórias de Viagem"
    }]
  }
};
const SocialSection: React.FC = () => {
  const content = socialContent.en; // Always use English
  return <section className="py-6 bg-route66-background-alt">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-4">
          <div className="bg-white rounded-xl border-2 border-route66-primary p-2 text-center">
            <h2 className="text-lg md:text-xl font-bold uppercase text-route66-primary">
              Join the Photo Wall
            </h2>
          </div>
        </div>

        {/* Community Gallery */}
        <div className="mb-4">
          <CommunityGallery />
        </div>

        {/* Photo Upload Section */}
        <div className="mb-4">
          <PhotoUploadSection />
        </div>

        {/* Instagram Carousel */}
        <div className="bg-white p-4 rounded-xl border-2 border-route66-border shadow-lg">
          <SimpleInstagramCarousel />
        </div>
      </div>
    </section>;
};
export default SocialSection;