
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  content: React.ReactNode;
  accentColor: string;
}

const CentennialCardsSection: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [easterEggActive, setEasterEggActive] = useState(false);

  // Route 66 Centennial date - November 11, 2026
  const centennialDate = new Date('2026-11-11T00:00:00');

  // Konami Code sequence
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];

  // Calculate time remaining
  useEffect(() => {
    setMounted(true);
    
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

  // Konami Code Easter Egg
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === konamiCode[konamiIndex]) {
        const newIndex = konamiIndex + 1;
        setKonamiIndex(newIndex);
        
        if (newIndex === konamiCode.length) {
          setEasterEggActive(true);
          setKonamiIndex(0);
          setTimeout(() => setEasterEggActive(false), 3000);
        }
      } else {
        setKonamiIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex]);

  const centennialCards: CentennialCard[] = [
    {
      id: 'countdown',
      title: 'Centennial Countdown',
      subtitle: 'Days Until Celebration',
      description: 'Track the countdown to Route 66\'s historic 100th anniversary with live updates.',
      icon: <Clock className="h-5 w-5" />,
      route: '/countdown',
      accentColor: 'border-l-route66-accent-red',
      content: (
        <div className="text-center space-y-3">
          <div className="text-2xl font-bold text-route66-primary">
            {timeLeft.days.toLocaleString()}
          </div>
          <div className="text-sm text-route66-text-muted font-medium">
            Days remaining
          </div>
          <div className="flex justify-center gap-2 text-xs">
            <span className="bg-route66-background-alt px-2 py-1 rounded text-route66-text-secondary">
              {timeLeft.hours}h
            </span>
            <span className="bg-route66-background-alt px-2 py-1 rounded text-route66-text-secondary">
              {timeLeft.minutes}m
            </span>
            <span className="bg-route66-background-alt px-2 py-1 rounded text-route66-text-secondary">
              {timeLeft.seconds}s
            </span>
          </div>
        </div>
      )
    },
    {
      id: 'timeline',
      title: 'Historic Timeline',
      subtitle: '1926 - 2026',
      description: 'Explore a century of Route 66 history through major milestones and cultural moments.',
      icon: <Calendar className="h-5 w-5" />,
      route: '/timeline',
      accentColor: 'border-l-route66-primary',
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
      icon: <BookOpen className="h-5 w-5" />,
      route: '/fun-facts',
      accentColor: 'border-l-route66-accent-success',
      content: (
        <div className="space-y-2">
          <div className="text-sm text-route66-text-muted italic">
            "Route 66 was the first highway to be completely paved across multiple states."
          </div>
          <div className="flex items-center gap-1 text-xs text-route66-text-secondary">
            <Star className="h-3 w-3 fill-current text-route66-accent-gold" />
            <span>Updated daily</span>
          </div>
        </div>
      )
    },
    {
      id: 'trivia',
      title: 'Route 66 Trivia',
      subtitle: 'Test Your Knowledge',
      description: 'Challenge yourself with interactive trivia covering Route 66 history and landmarks.',
      icon: <Trophy className="h-5 w-5" />,
      route: '/trivia',
      accentColor: 'border-l-route66-secondary',
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
          <div className="text-xs text-route66-secondary text-center font-medium">
            Play & Earn Badges
          </div>
        </div>
      )
    }
  ];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <section 
      className="relative py-16 lg:py-20 bg-route66-background-section"
      role="region"
      aria-labelledby="centennial-heading"
    >
      {/* Easter Egg Celebration */}
      {easterEggActive && (
        <div className="fixed inset-0 bg-route66-primary/80 flex items-center justify-center z-50 animate-fade-in">
          <div className="text-4xl font-bold text-white text-center animate-scale-in">
            🎉 Happy 100th Birthday Route 66! 🎉
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-route66-primary text-white px-6 py-2 rounded-full text-sm font-semibold mb-6">
            Centennial Celebration
          </div>
          
          <h2 
            id="centennial-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-route66-primary mb-4 leading-tight"
          >
            Route 66 Turns 100
          </h2>
          
          <p className="text-xl text-route66-text-secondary max-w-3xl mx-auto leading-relaxed">
            Join us in celebrating America's most famous highway as it reaches its centennial milestone
          </p>
        </div>

        {/* 4-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {centennialCards.map((card, index) => (
            <Card
              key={card.id}
              className={`h-full overflow-hidden hover:shadow-lg transition-all duration-300 group bg-white border border-route66-border hover:border-route66-primary/20 cursor-pointer relative border-l-4 ${card.accentColor}`}
              onClick={() => handleCardClick(card.route)}
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'fade-in 0.6s ease-out forwards'
              }}
              role="button"
              tabIndex={0}
              aria-label={`Navigate to ${card.title} - ${card.description}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(card.route);
                }
              }}
            >
              {/* Header with Icon */}
              <div className="bg-route66-background-alt p-4 border-b border-route66-border">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-route66-primary group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>
                  <div className="text-xs font-medium text-route66-text-muted uppercase tracking-wide">
                    {card.subtitle}
                  </div>
                </div>
                <h3 className="font-bold text-lg text-route66-text-primary group-hover:text-route66-primary transition-colors duration-300">
                  {card.title}
                </h3>
              </div>

              <CardContent className="p-4 flex-1 flex flex-col">
                {/* Dynamic Content */}
                <div className="mb-4 flex-1">
                  {card.content}
                </div>

                {/* Description */}
                <p className="text-sm text-route66-text-muted mb-4 line-clamp-3">
                  {card.description}
                </p>

                {/* Action Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-route66-border text-route66-text-secondary hover:bg-route66-primary hover:text-white hover:border-route66-primary transition-all duration-300 group/button"
                  aria-label={`Explore ${card.title}`}
                >
                  <span>Explore</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover/button:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Decoration */}
        <div className="mt-12 flex justify-center">
          <div className="w-24 h-1 bg-route66-primary rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default CentennialCardsSection;
