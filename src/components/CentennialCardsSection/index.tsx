
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, BookOpen, Trophy, ArrowRight, Star } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CentennialCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  gradient: string;
  accentColor: string;
  content: React.ReactNode;
}

const CentennialCardsSection: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Route 66 Centennial date - November 11, 2026
  const centennialDate = new Date('2026-11-11T00:00:00');

  // Calculate time remaining
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = centennialDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const centennialCards: CentennialCard[] = [
    {
      id: 'countdown',
      title: 'Centennial Countdown',
      subtitle: 'Days Until Celebration',
      description: 'Count down to Route 66\'s 100th anniversary with live updates and celebration milestones.',
      icon: <Clock className="h-6 w-6" />,
      route: '/countdown',
      gradient: 'from-route66-accent-red to-route66-accent-gold',
      accentColor: 'border-route66-accent-red hover:border-route66-accent-red',
      content: (
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold text-route66-accent-red">
            {timeLeft.days.toLocaleString()}
          </div>
          <div className="text-sm text-route66-text-muted">
            Days to go
          </div>
          <div className="flex justify-center gap-4 text-xs">
            <span>{timeLeft.hours}h</span>
            <span>{timeLeft.minutes}m</span>
            <span>{timeLeft.seconds}s</span>
          </div>
        </div>
      )
    },
    {
      id: 'timeline',
      title: 'Historic Timeline',
      subtitle: '1926 - 2026',
      description: 'Explore 100 years of Route 66 history through major milestones and cultural moments.',
      icon: <Calendar className="h-6 w-6" />,
      route: '/timeline',
      gradient: 'from-route66-primary to-route66-primary-light',
      accentColor: 'border-route66-primary hover:border-route66-primary',
      content: (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-route66-primary rounded-full"></div>
            <span className="text-route66-text-muted">1926: Highway designated</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-route66-accent-gold rounded-full"></div>
            <span className="text-route66-text-muted">1985: Decommissioned</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-route66-accent-red rounded-full"></div>
            <span className="text-route66-text-muted">2026: 100th Anniversary</span>
          </div>
        </div>
      )
    },
    {
      id: 'fun-facts',
      title: 'Daily Fun Facts',
      subtitle: 'Route 66 Stories',
      description: 'Discover fascinating stories and little-known facts about America\'s most famous highway.',
      icon: <BookOpen className="h-6 w-6" />,
      route: '/fun-facts',
      gradient: 'from-route66-accent-success to-route66-primary-light',
      accentColor: 'border-route66-accent-success hover:border-route66-accent-success',
      content: (
        <div className="space-y-2">
          <div className="text-sm text-route66-text-muted italic">
            "Did you know Route 66 was the first highway to be completely paved?"
          </div>
          <div className="flex items-center gap-1 text-xs text-route66-text-secondary">
            <Star className="h-3 w-3 fill-current text-route66-accent-gold" />
            <span>Daily facts updated</span>
          </div>
        </div>
      )
    },
    {
      id: 'trivia',
      title: 'Route 66 Trivia',
      subtitle: 'Test Your Knowledge',
      description: 'Challenge yourself with interactive trivia covering Route 66 history, culture, and landmarks.',
      icon: <Trophy className="h-6 w-6" />,
      route: '/trivia',
      gradient: 'from-route66-accent-gold to-route66-accent-red',
      accentColor: 'border-route66-accent-gold hover:border-route66-accent-gold',
      content: (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-route66-text-muted">Questions:</span>
            <span className="font-semibold text-route66-text-primary">50+</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-route66-text-muted">Categories:</span>
            <span className="font-semibold text-route66-text-primary">8</span>
          </div>
          <div className="text-xs text-route66-accent-gold text-center">
            🏆 Play & Earn Badges
          </div>
        </div>
      )
    }
  ];

  const handleCardClick = (route: string) => {
    // For now, scroll to existing sections on the same page
    const sectionMap: { [key: string]: string } = {
      '/countdown': 'centennial',
      '/timeline': 'centennial',
      '/fun-facts': 'fun-facts',
      '/trivia': 'trivia-game'
    };
    
    const targetSection = sectionMap[route];
    if (targetSection) {
      const element = document.getElementById(targetSection);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="py-20 lg:py-24 bg-gradient-to-br from-route66-background via-route66-background-alt to-route66-background-section relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(220, 38, 38, 0.1) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(29, 78, 216, 0.1) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(220, 38, 38, 0.1) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(29, 78, 216, 0.1) 75%)
            `,
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px'
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          {/* Patriotic Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 via-white to-blue-600 text-route66-text-primary px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-2xl border-2 border-white">
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
            CENTENNIAL CELEBRATION
            <Star className="w-5 h-5 text-yellow-500 fill-current" />
          </div>

          <h2 
            className="text-4xl md:text-6xl lg:text-7xl font-black text-center mb-6 leading-tight"
            style={{
              fontFamily: "'Bungee Shade', 'Impact', sans-serif",
              background: `
                linear-gradient(45deg, 
                  #dc2626 0%, #ffffff 25%, #1d4ed8 50%, #ffffff 75%, #dc2626 100%
                )
              `,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: `
                2px 2px 0px rgba(0,0,0,0.8),
                4px 4px 8px rgba(0,0,0,0.6)
              `,
              filter: 'drop-shadow(0 0 15px rgba(255, 255, 255, 0.6))'
            }}
          >
            ROUTE 66 CENTENNIAL
          </h2>
          
          <p className="text-xl md:text-2xl text-route66-text-secondary max-w-4xl mx-auto leading-relaxed font-semibold">
            Celebrating 100 years of America's most iconic highway
          </p>
        </div>

        {/* Enhanced Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {centennialCards.map((card) => (
            <Card
              key={card.id}
              className={`h-full overflow-hidden hover:shadow-2xl transition-all duration-500 group border-2 ${card.accentColor} bg-route66-background hover:scale-[1.02] cursor-pointer relative`}
              onClick={() => handleCardClick(card.route)}
            >
              {/* Enhanced Icon Header with Gradient */}
              <div className={`relative h-32 bg-gradient-to-br ${card.gradient} flex flex-col items-center justify-center text-white overflow-hidden`}>
                {/* Animated Background */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500"></div>
                
                {/* Floating Icon */}
                <div className="relative z-10 group-hover:scale-110 transition-transform duration-500 mb-2">
                  {card.icon}
                </div>
                
                {/* Subtitle */}
                <div className="relative z-10 text-xs font-semibold text-center opacity-90">
                  {card.subtitle}
                </div>

                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-8 h-8 bg-white/20 transform rotate-45 translate-x-4 -translate-y-4"></div>
              </div>

              <CardContent className="p-6 flex-1 flex flex-col">
                {/* Enhanced Title */}
                <h3 className="font-bold text-lg text-route66-text-primary mb-3 line-clamp-2 group-hover:text-route66-primary transition-colors duration-300">
                  {card.title}
                </h3>

                {/* Dynamic Content */}
                <div className="mb-4 flex-1">
                  {card.content}
                </div>

                {/* Description */}
                <p className="text-sm text-route66-text-muted mb-6 line-clamp-3">
                  {card.description}
                </p>

                {/* Enhanced Action Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-11 border-2 border-route66-border text-route66-text-secondary hover:bg-route66-primary hover:text-white hover:border-route66-primary transition-all duration-300 shadow-md hover:shadow-lg group/button font-semibold"
                >
                  <span>Explore</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover/button:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Bottom CTA */}
        <div className="text-center">
          <div className="inline-block relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-route66-accent-red/20 via-route66-accent-gold/20 to-route66-primary/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-route66-background border-2 border-route66-border rounded-xl p-8 shadow-xl">
              <p className="text-route66-text-muted mb-6 text-lg">
                Be part of the Route 66 Centennial celebration
              </p>
              <Button
                className="bg-gradient-to-r from-route66-primary to-route66-primary-dark text-white hover:from-route66-primary-dark hover:to-route66-primary transition-all duration-300 shadow-lg hover:shadow-xl px-10 py-4 text-xl font-bold border-2 border-white/20"
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
        </div>

        {/* Decorative Elements */}
        <div className="mt-16 flex justify-center items-center gap-8">
          <div className="w-24 h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full"></div>
          <div className="w-8 h-8 bg-white rounded-full border-4 border-red-500 shadow-lg"></div>
          <div className="w-16 h-2 bg-gradient-to-r from-red-500 via-white to-blue-500 rounded-full"></div>
          <div className="w-8 h-8 bg-white rounded-full border-4 border-blue-500 shadow-lg"></div>
          <div className="w-24 h-2 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default CentennialCardsSection;
