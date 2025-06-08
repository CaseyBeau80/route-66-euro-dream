
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, BookOpen, Trophy, ArrowRight } from 'lucide-react';

interface CentennialCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  gradient: string;
  accentColor: string;
}

const CentennialCardsSection: React.FC = () => {
  const centennialCards: CentennialCard[] = [
    {
      id: 'countdown',
      title: 'Centennial Countdown',
      description: 'Count down to Route 66\'s 100th anniversary with our interactive timer and celebration features.',
      icon: <Clock className="h-8 w-8" />,
      route: '/countdown',
      gradient: 'from-route66-accent-red to-route66-accent-gold',
      accentColor: 'border-route66-accent-red hover:border-route66-accent-red'
    },
    {
      id: 'timeline',
      title: 'Historic Timeline',
      description: 'Explore the rich history of Route 66 from its inception in 1926 to the present day.',
      icon: <Calendar className="h-8 w-8" />,
      route: '/timeline',
      gradient: 'from-route66-primary to-route66-primary-light',
      accentColor: 'border-route66-primary hover:border-route66-primary'
    },
    {
      id: 'fun-facts',
      title: 'Daily Fun Facts',
      description: 'Discover fascinating stories and little-known facts about America\'s most famous highway.',
      icon: <BookOpen className="h-8 w-8" />,
      route: '/fun-facts',
      gradient: 'from-route66-accent-success to-route66-primary-light',
      accentColor: 'border-route66-accent-success hover:border-route66-accent-success'
    },
    {
      id: 'trivia',
      title: 'Route 66 Trivia',
      description: 'Test your knowledge with our interactive trivia game featuring Route 66 history and culture.',
      icon: <Trophy className="h-8 w-8" />,
      route: '/trivia',
      gradient: 'from-route66-accent-gold to-route66-accent-red',
      accentColor: 'border-route66-accent-gold hover:border-route66-accent-gold'
    }
  ];

  const handleCardClick = (route: string) => {
    // For now, scroll to the section on the same page
    const element = document.getElementById(route.replace('/', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 lg:py-20 bg-route66-background-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-route66 text-route66-primary mb-4 font-bold">
            Route 66 Centennial Celebration
          </h2>
          <p className="text-xl text-route66-text-secondary max-w-3xl mx-auto font-semibold">
            Join us in celebrating 100 years of America's most iconic highway with interactive experiences and historical insights
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {centennialCards.map((card) => (
            <Card
              key={card.id}
              className={`h-full overflow-hidden hover:shadow-lg transition-all duration-300 group border-route66-border ${card.accentColor} bg-route66-background hover:scale-[1.02] cursor-pointer`}
              onClick={() => handleCardClick(card.route)}
            >
              {/* Icon Header with Gradient */}
              <div className={`relative h-24 bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white`}>
                <div className="group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </div>
                
                {/* Decorative overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-300"></div>
              </div>

              <CardContent className="p-6 flex-1 flex flex-col">
                {/* Title */}
                <h3 className="font-semibold text-lg text-route66-text-primary mb-3 line-clamp-2 group-hover:text-route66-primary transition-colors">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-route66-text-muted mb-6 line-clamp-4 flex-1">
                  {card.description}
                </p>

                {/* Action Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-10 border-route66-border text-route66-text-secondary hover:bg-route66-primary hover:text-white hover:border-route66-primary transition-all duration-200 shadow-sm group/button"
                >
                  <span>Explore</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover/button:translate-x-1 transition-transform duration-200" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-route66-text-muted mb-4">
            Be part of the Route 66 Centennial celebration
          </p>
          <Button
            className="bg-route66-primary text-white hover:bg-route66-primary-dark transition-all duration-200 shadow-lg hover:shadow-xl px-8 py-3 text-lg font-semibold"
            onClick={() => {
              const element = document.getElementById('centennial');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Join the Celebration
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CentennialCardsSection;
