
import React from 'react';
import { Instagram, Users, Heart, MessageCircle } from 'lucide-react';
import SimpleInstagramCarousel from '../InstagramCarousel/components/SimpleInstagramCarousel';
import PhotoUploadSection from './components/PhotoUploadSection';

interface SocialSectionProps {
  language: string;
}

const socialContent = {
  en: {
    badge: "Join the Community",
    title: "Share Your Route 66 Adventure",
    subtitle: "Connect with fellow travelers and share your journey",
    description: "Join thousands of Route 66 enthusiasts sharing their experiences, tips, and memorable moments from America's most famous highway.",
    hashtagTitle: "Use our hashtag",
    hashtag: "#Ramble66",
    stats: [
      { icon: Users, number: "25K+", label: "Travelers" },
      { icon: Heart, number: "150K+", label: "Photos Shared" },
      { icon: MessageCircle, number: "5K+", label: "Trip Stories" }
    ]
  },
  de: {
    badge: "Tritt der Community bei",
    title: "Teile dein Route 66 Abenteuer",
    subtitle: "Verbinde dich mit anderen Reisenden und teile deine Reise",
    description: "Schließe dich Tausenden von Route 66-Enthusiasten an, die ihre Erfahrungen, Tipps und unvergesslichen Momente von Amerikas berühmtester Straße teilen.",
    hashtagTitle: "Verwende unseren Hashtag",
    hashtag: "#Ramble66",
    stats: [
      { icon: Users, number: "25K+", label: "Reisende" },
      { icon: Heart, number: "150K+", label: "Geteilte Fotos" },
      { icon: MessageCircle, number: "5K+", label: "Reisegeschichten" }
    ]
  },
  fr: {
    badge: "Rejoignez la Communauté",
    title: "Partagez votre Aventure Route 66",
    subtitle: "Connectez-vous avec d'autres voyageurs et partagez votre voyage",
    description: "Rejoignez des milliers d'enthousiastes de la Route 66 qui partagent leurs expériences, conseils et moments mémorables de la route la plus célèbre d'Amérique.",
    hashtagTitle: "Utilisez notre hashtag",
    hashtag: "#Ramble66",
    stats: [
      { icon: Users, number: "25K+", label: "Voyageurs" },
      { icon: Heart, number: "150K+", label: "Photos Partagées" },
      { icon: MessageCircle, number: "5K+", label: "Histoires de Voyage" }
    ]
  },
  "pt-BR": {
    badge: "Junte-se à Comunidade",
    title: "Compartilhe sua Aventura na Rota 66",
    subtitle: "Conecte-se com outros viajantes e compartilhe sua jornada",
    description: "Junte-se a milhares de entusiastas da Rota 66 compartilhando suas experiências, dicas e momentos memoráveis da rodovia mais famosa da América.",
    hashtagTitle: "Use nossa hashtag",
    hashtag: "#Ramble66",
    stats: [
      { icon: Users, number: "25K+", label: "Viajantes" },
      { icon: Heart, number: "150K+", label: "Fotos Compartilhadas" },
      { icon: MessageCircle, number: "5K+", label: "Histórias de Viagem" }
    ]
  }
};

const SocialSection: React.FC<SocialSectionProps> = ({ language }) => {
  const content = socialContent[language as keyof typeof socialContent] || socialContent.en;

  return (
    <section className="py-20 bg-route66-background-alt">
      <div className="container mx-auto px-4">
        {/* Header - Matching Trip Planner Format */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-white rounded-2xl border-4 border-route66-primary p-8 text-center">
            <div className="inline-flex items-center gap-2 bg-route66-primary text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Instagram className="w-4 h-4" />
              {content.badge}
            </div>
            <h2 className="text-4xl md:text-5xl font-route66 font-bold uppercase text-route66-primary mb-6">
              {content.title}
            </h2>
            <p className="text-xl text-route66-text-secondary max-w-3xl mx-auto mb-8">
              {content.subtitle}
            </p>
            <p className="text-lg text-route66-text-muted max-w-4xl mx-auto leading-relaxed mb-8">
              {content.description}
            </p>

            {/* Hashtag */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-route66-primary to-route66-accent-red text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg">
              <span>{content.hashtagTitle}:</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">{content.hashtag}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {content.stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-xl border-2 border-route66-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-route66-primary mb-4 flex justify-center">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-3xl font-route66 font-bold text-route66-text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-route66-text-secondary font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Photo Upload Section */}
        <div className="mb-12">
          <PhotoUploadSection language={language} />
        </div>

        {/* Instagram Carousel */}
        <div className="bg-white p-8 rounded-2xl border-2 border-route66-border shadow-lg">
          <SimpleInstagramCarousel />
        </div>
      </div>
    </section>
  );
};

export default SocialSection;
