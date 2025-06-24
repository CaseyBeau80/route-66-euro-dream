
import React from 'react';
import { Gamepad2, Trophy, Zap, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface FunSectionProps {
  language: string;
}

const funContent = {
  en: {
    badge: "Games & Activities",
    title: "Make Your Journey Even More Fun",
    subtitle: "Interactive experiences and challenges for the whole family",
    description: "Enhance your Route 66 adventure with our collection of games, trivia, and interactive activities designed to make your journey unforgettable.",
    activities: [
      {
        icon: Trophy,
        title: "Route 66 Trivia",
        description: "Test your knowledge about America's most famous highway",
        buttonText: "Play Trivia",
        route: "/trivia",
        color: "from-blue-500 to-blue-600"
      },
      {
        icon: Zap,
        title: "Fun Facts Daily",
        description: "Discover amazing facts and stories from the Mother Road",
        buttonText: "Explore Facts",
        route: "/fun-facts",
        color: "from-green-500 to-green-600"
      },
      {
        icon: Gift,
        title: "Timeline Explorer",
        description: "Journey through Route 66's rich history and milestones",
        buttonText: "View Timeline",
        route: "/timeline",
        color: "from-purple-500 to-purple-600"
      },
      {
        icon: Gamepad2,
        title: "Countdown to Adventure",
        description: "Count down the days until your Route 66 journey begins",
        buttonText: "Start Countdown",
        route: "/countdown",
        color: "from-red-500 to-red-600"
      }
    ]
  },
  de: {
    badge: "Spiele & Aktivitäten",
    title: "Mache deine Reise noch spaßiger",
    subtitle: "Interaktive Erfahrungen und Herausforderungen für die ganze Familie",
    description: "Verbessere dein Route 66-Abenteuer mit unserer Sammlung von Spielen, Quiz und interaktiven Aktivitäten, die deine Reise unvergesslich machen.",
    activities: [
      {
        icon: Trophy,
        title: "Route 66 Quiz",
        description: "Teste dein Wissen über Amerikas berühmteste Straße",
        buttonText: "Quiz Spielen",
        route: "/trivia",
        color: "from-blue-500 to-blue-600"
      },
      {
        icon: Zap,
        title: "Tägliche Fun Facts",
        description: "Entdecke erstaunliche Fakten und Geschichten von der Mother Road",
        buttonText: "Fakten Erkunden",
        route: "/fun-facts",
        color: "from-green-500 to-green-600"
      },
      {
        icon: Gift,
        title: "Timeline Explorer",
        description: "Reise durch die reiche Geschichte und Meilensteine der Route 66",
        buttonText: "Timeline Ansehen",
        route: "/timeline",
        color: "from-purple-500 to-purple-600"
      },
      {
        icon: Gamepad2,
        title: "Countdown zum Abenteuer",
        description: "Zähle die Tage bis deine Route 66-Reise beginnt",
        buttonText: "Countdown Starten",
        route: "/countdown",
        color: "from-red-500 to-red-600"
      }
    ]
  },
  fr: {
    badge: "Jeux & Activités",
    title: "Rendez votre voyage encore plus amusant",
    subtitle: "Expériences interactives et défis pour toute la famille",
    description: "Améliorez votre aventure Route 66 avec notre collection de jeux, quiz et activités interactives conçues pour rendre votre voyage inoubliable.",
    activities: [
      {
        icon: Trophy,
        title: "Quiz Route 66",
        description: "Testez vos connaissances sur la route la plus célèbre d'Amérique",
        buttonText: "Jouer au Quiz",
        route: "/trivia",
        color: "from-blue-500 to-blue-600"
      },
      {
        icon: Zap,
        title: "Fun Facts Quotidiens",
        description: "Découvrez des faits et histoires étonnants de la Mother Road",
        buttonText: "Explorer les Faits",
        route: "/fun-facts",
        color: "from-green-500 to-green-600"
      },
      {
        icon: Gift,
        title: "Explorateur de Timeline",
        description: "Voyagez à travers la riche histoire et les jalons de la Route 66",
        buttonText: "Voir la Timeline",
        route: "/timeline",
        color: "from-purple-500 to-purple-600"
      },
      {
        icon: Gamepad2,
        title: "Compte à Rebours vers l'Aventure",
        description: "Comptez les jours jusqu'au début de votre voyage Route 66",
        buttonText: "Démarrer le Compte à Rebours",
        route: "/countdown",
        color: "from-red-500 to-red-600"
      }
    ]
  },
  "pt-BR": {
    badge: "Jogos & Atividades",
    title: "Torne sua viagem ainda mais divertida",
    subtitle: "Experiências interativas e desafios para toda a família",
    description: "Melhore sua aventura na Rota 66 com nossa coleção de jogos, quiz e atividades interativas projetadas para tornar sua viagem inesquecível.",
    activities: [
      {
        icon: Trophy,
        title: "Quiz Rota 66",
        description: "Teste seus conhecimentos sobre a rodovia mais famosa da América",
        buttonText: "Jogar Quiz",
        route: "/trivia",
        color: "from-blue-500 to-blue-600"
      },
      {
        icon: Zap,
        title: "Curiosidades Diárias",
        description: "Descubra fatos e histórias incríveis da Mother Road",
        buttonText: "Explorar Fatos",
        route: "/fun-facts",
        color: "from-green-500 to-green-600"
      },
      {
        icon: Gift,
        title: "Explorador de Timeline",
        description: "Viaje pela rica história e marcos da Rota 66",
        buttonText: "Ver Timeline",
        route: "/timeline",
        color: "from-purple-500 to-purple-600"
      },
      {
        icon: Gamepad2,
        title: "Contagem Regressiva para Aventura",
        description: "Conte os dias até sua jornada na Rota 66 começar",
        buttonText: "Iniciar Contagem",
        route: "/countdown",
        color: "from-red-500 to-red-600"
      }
    ]
  }
};

const FunSection: React.FC<FunSectionProps> = ({ language }) => {
  const navigate = useNavigate();
  const content = funContent[language as keyof typeof funContent] || funContent.en;

  return (
    <section className="py-20 bg-gradient-to-br from-route66-background to-route66-background-alt">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Gamepad2 className="w-4 h-4" />
            {content.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-route66 font-bold text-route66-text-primary mb-6">
            {content.title}
          </h2>
          <p className="text-xl text-route66-text-secondary max-w-3xl mx-auto mb-8">
            {content.subtitle}
          </p>
          <p className="text-lg text-route66-text-muted max-w-4xl mx-auto leading-relaxed">
            {content.description}
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.activities.map((activity, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg border border-route66-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              {/* Card Header */}
              <div className={`h-32 bg-gradient-to-r ${activity.color} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <activity.icon className="w-12 h-12 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-route66-text-primary mb-3">
                  {activity.title}
                </h3>
                <p className="text-route66-text-secondary mb-6 leading-relaxed">
                  {activity.description}
                </p>
                <Button
                  onClick={() => navigate(activity.route)}
                  className={`w-full bg-gradient-to-r ${activity.color} hover:opacity-90 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300`}
                >
                  {activity.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-route66-border max-w-2xl mx-auto">
            <h3 className="text-2xl font-route66 font-bold text-route66-text-primary mb-4">
              Ready for Your Adventure?
            </h3>
            <p className="text-route66-text-secondary mb-6">
              Start planning your Route 66 journey today and make memories that will last a lifetime!
            </p>
            <Button
              onClick={() => navigate('/trip-calculator')}
              className="bg-route66-primary hover:bg-route66-primary-dark text-white font-bold py-4 px-8 text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Plan Your Route 66 Trip
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FunSection;
