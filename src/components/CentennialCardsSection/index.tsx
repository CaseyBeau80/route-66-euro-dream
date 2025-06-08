
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, BookOpen, Trophy, ArrowRight, Star, Sparkles, PartyPopper } from 'lucide-react';

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
  borderColor: string;
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
          setTimeout(() => setEasterEggActive(false), 5000);
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
      description: 'Count down to Route 66\'s 100th anniversary with live updates and celebration milestones.',
      icon: <Clock className="h-6 w-6" />,
      route: '/countdown',
      gradient: 'from-red-600 via-red-500 to-red-400',
      accentColor: 'border-red-500 hover:border-red-400',
      borderColor: 'border-l-red-500',
      content: (
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold text-red-600">
            {timeLeft.days.toLocaleString()}
          </div>
          <div className="text-sm text-route66-text-muted">
            Days to go
          </div>
          <div className="flex justify-center gap-4 text-xs">
            <span className="bg-red-50 px-2 py-1 rounded">{timeLeft.hours}h</span>
            <span className="bg-red-50 px-2 py-1 rounded">{timeLeft.minutes}m</span>
            <span className="bg-red-50 px-2 py-1 rounded">{timeLeft.seconds}s</span>
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
      gradient: 'from-blue-600 via-blue-500 to-blue-400',
      accentColor: 'border-blue-500 hover:border-blue-400',
      borderColor: 'border-l-blue-500',
      content: (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span className="text-route66-text-muted">1926: Highway designated</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-route66-text-muted">1985: Decommissioned</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
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
      gradient: 'from-green-600 via-green-500 to-green-400',
      accentColor: 'border-green-500 hover:border-green-400',
      borderColor: 'border-l-green-500',
      content: (
        <div className="space-y-2">
          <div className="text-sm text-route66-text-muted italic">
            "Did you know Route 66 was the first highway to be completely paved?"
          </div>
          <div className="flex items-center gap-1 text-xs text-route66-text-secondary">
            <Star className="h-3 w-3 fill-current text-yellow-500" />
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
      gradient: 'from-purple-600 via-purple-500 to-purple-400',
      accentColor: 'border-purple-500 hover:border-purple-400',
      borderColor: 'border-l-purple-500',
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
          <div className="text-xs text-purple-600 text-center font-medium">
            🏆 Play & Earn Badges
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
      className="relative py-20 lg:py-24 overflow-hidden"
      role="region"
      aria-labelledby="centennial-heading"
    >
      {/* Celebratory Background - Full Width Birthday Theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-white to-blue-600 opacity-95">
        {/* Birthday Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.4) 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, rgba(220, 38, 38, 0.4) 2px, transparent 2px),
              radial-gradient(circle at 50% 50%, rgba(29, 78, 216, 0.4) 2px, transparent 2px)
            `,
            backgroundSize: '60px 60px, 80px 80px, 100px 100px',
            backgroundPosition: '0 0, 30px 30px, 50px 50px'
          }}
        />
        
        {/* Floating Birthday Elements */}
        <div className="absolute inset-0">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className={`absolute animate-bounce ${
                i % 4 === 0 ? 'text-yellow-400' : 
                i % 4 === 1 ? 'text-red-500' : 
                i % 4 === 2 ? 'text-blue-500' : 'text-green-500'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                fontSize: '1.5rem'
              }}
            >
              {i % 3 === 0 ? '🎉' : i % 3 === 1 ? '🎂' : '🎈'}
            </div>
          ))}
        </div>

        {/* Easter Egg Celebration */}
        {easterEggActive && (
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-blue-500 opacity-80 animate-pulse">
            <div className="flex items-center justify-center h-full">
              <div className="text-6xl animate-bounce">🎊 HAPPY 100TH BIRTHDAY ROUTE 66! 🎊</div>
            </div>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered Header */}
        <div className="text-center mb-16">
          {/* Celebration Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 via-white to-blue-600 text-route66-text-primary px-8 py-4 rounded-full text-sm font-bold mb-8 shadow-2xl border-4 border-white backdrop-blur-sm">
            <PartyPopper className="w-5 h-5 text-red-600" />
            <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
              🎂 CENTENNIAL CELEBRATION 🎂
            </span>
            <Sparkles className="w-5 h-5 text-blue-600" />
          </div>

          {/* Dynamic Title */}
          <h2 
            id="centennial-heading"
            className="text-4xl md:text-6xl lg:text-7xl font-black text-center mb-6 leading-tight animate-bounce"
            style={{
              fontFamily: "'Bungee Shade', 'Impact', sans-serif",
              background: `
                linear-gradient(45deg, 
                  #dc2626 0%, #ffffff 20%, #1d4ed8 40%, #ffffff 60%, #dc2626 80%, #ffffff 100%
                )
              `,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: `
                3px 3px 0px rgba(0,0,0,0.8),
                6px 6px 12px rgba(0,0,0,0.6)
              `,
              filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.8))'
            }}
          >
            ROUTE 66 TURNS 100! 🎉
          </h2>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-route66-text-primary max-w-4xl mx-auto leading-relaxed font-bold">
            Join the biggest birthday party in highway history! 🛣️🎂
          </p>
        </div>

        {/* 4-Card Grid with Staggered Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {centennialCards.map((card, index) => (
            <Card
              key={card.id}
              className={`h-full overflow-hidden hover:shadow-2xl transition-all duration-500 group border-2 ${card.accentColor} bg-white hover:scale-105 cursor-pointer relative transform border-l-4 ${card.borderColor}`}
              onClick={() => handleCardClick(card.route)}
              style={{
                animationDelay: `${index * 150}ms`,
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
              {/* Icon Header with Enhanced Gradient */}
              <div className={`relative h-32 bg-gradient-to-br ${card.gradient} flex flex-col items-center justify-center text-white overflow-hidden`}>
                {/* Animated Background */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors duration-500"></div>
                
                {/* Birthday Sparkles */}
                <div className="absolute inset-0 opacity-30">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Sparkles
                      key={i}
                      className="absolute w-4 h-4 text-white animate-pulse"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${10 + i * 20}%`,
                        animationDelay: `${i * 0.5}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Floating Icon */}
                <div className="relative z-10 group-hover:scale-125 transition-transform duration-500 mb-2 drop-shadow-lg">
                  {card.icon}
                </div>
                
                {/* Subtitle */}
                <div className="relative z-10 text-xs font-bold text-center opacity-95 drop-shadow">
                  {card.subtitle}
                </div>

                {/* Birthday Hat Corner */}
                <div className="absolute top-2 right-2 text-2xl animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                  🎂
                </div>
              </div>

              <CardContent className="p-6 flex-1 flex flex-col">
                {/* Title */}
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
                  className="w-full h-11 border-2 border-route66-border text-route66-text-secondary hover:bg-route66-primary hover:text-white hover:border-route66-primary transition-all duration-300 shadow-md hover:shadow-lg group/button font-bold"
                  aria-label={`Explore ${card.title}`}
                >
                  <span>🎉 Celebrate!</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover/button:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>

              {/* Birthday Ribbon */}
              <div className="absolute top-4 -right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 transform rotate-12 shadow-lg">
                100!
              </div>
            </Card>
          ))}
        </div>

        {/* Enhanced Decorative Elements */}
        <div className="mt-16 flex justify-center items-center gap-8">
          <div className="w-24 h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full animate-pulse"></div>
          <div className="w-8 h-8 bg-white rounded-full border-4 border-red-500 shadow-lg flex items-center justify-center">
            🎂
          </div>
          <div className="w-16 h-2 bg-gradient-to-r from-red-500 via-white to-blue-500 rounded-full animate-pulse"></div>
          <div className="w-8 h-8 bg-white rounded-full border-4 border-blue-500 shadow-lg flex items-center justify-center">
            🎉
          </div>
          <div className="w-24 h-2 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full animate-pulse"></div>
        </div>

        {/* Birthday Message */}
        <div className="text-center mt-12">
          <p className="text-lg font-bold text-route66-text-primary bg-white/80 backdrop-blur-sm rounded-full px-8 py-3 inline-block shadow-lg">
            🎈 Let's make this the most memorable birthday celebration ever! 🎈
          </p>
        </div>
      </div>
    </section>
  );
};

export default CentennialCardsSection;
