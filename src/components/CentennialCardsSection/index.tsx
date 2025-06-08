
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, BookOpen, Trophy, ArrowRight, Star, Sparkles, Gift, PartyPopper } from 'lucide-react';

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
  buttonText: string;
  sparkleColor: string;
}

const CentennialCardsSection: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [easterEggActive, setEasterEggActive] = useState(false);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  // Route 66 Centennial date - November 11, 2026
  const centennialDate = new Date('2026-11-11T00:00:00');

  // Konami Code sequence
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];

  // Rotating fun facts
  const rotatingFacts = [
    "Route 66 was the first highway to be completely paved across multiple states.",
    "The highway spans 2,448 miles from Chicago to Santa Monica.",
    "Route 66 was officially established on November 11, 1926.",
    "It crosses through 8 states and 3 time zones.",
    "The Mother Road inspired countless songs, movies, and books."
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

  // Rotate fun facts every 10 seconds
  useEffect(() => {
    const factTimer = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % rotatingFacts.length);
    }, 10000);

    return () => clearInterval(factTimer);
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
      description: 'Track the countdown to Route 66\'s historic 100th anniversary with live updates every second.',
      icon: <Clock className="h-5 w-5" />,
      route: '/countdown',
      buttonText: 'See the Clock',
      accentColor: 'border-l-blue-500',
      sparkleColor: 'text-blue-400',
      content: (
        <div className="text-center space-y-3">
          <div className="text-3xl font-bold text-blue-600 animate-birthday-bounce">
            {timeLeft.days.toLocaleString()}
          </div>
          <div className="text-sm text-slate-600 font-medium">
            Days remaining
          </div>
          <div className="flex justify-center gap-2 text-xs">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full border border-blue-200">
              {timeLeft.hours}h
            </span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full border border-blue-200">
              {timeLeft.minutes}m
            </span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full border border-blue-200">
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
      buttonText: 'Explore the Journey',
      accentColor: 'border-l-indigo-500',
      sparkleColor: 'text-indigo-400',
      content: (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-birthday-sparkle"></div>
            <span className="text-slate-600">1926: Highway designated</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-birthday-sparkle" style={{ animationDelay: '0.5s' }}></div>
            <span className="text-slate-600">1985: Decommissioned</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-birthday-sparkle" style={{ animationDelay: '1s' }}></div>
            <span className="text-slate-600">2026: 100th Anniversary</span>
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
      buttonText: 'Read the Stories',
      accentColor: 'border-l-sky-500',
      sparkleColor: 'text-sky-400',
      content: (
        <div className="space-y-2">
          <div 
            className="text-sm text-slate-600 italic transition-opacity duration-500"
            aria-live="polite"
            aria-label="Rotating Route 66 fun fact"
          >
            "{rotatingFacts[currentFactIndex]}"
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Star className="h-3 w-3 fill-current text-blue-500 animate-birthday-sparkle" />
            <span>Updated every 10 seconds</span>
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
      buttonText: 'Take the Challenge',
      accentColor: 'border-l-blue-600',
      sparkleColor: 'text-blue-400',
      content: (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Questions:</span>
            <span className="font-semibold text-blue-700">50+</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Categories:</span>
            <span className="font-semibold text-blue-700">8</span>
          </div>
          <div className="text-xs text-blue-700 text-center font-medium bg-blue-50 px-2 py-1 rounded-full border border-blue-200">
            Play & Earn Badges
          </div>
        </div>
      )
    }
  ];

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  // Floating sparkles animation
  const FloatingSparkles = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(12)].map((_, i) => (
        <Sparkles
          key={i}
          className={`absolute w-4 h-4 text-blue-400 animate-birthday-sparkle opacity-60`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <section 
      className="relative py-16 sm:py-20 bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50 overflow-hidden"
      role="region"
      aria-labelledby="centennial-heading"
    >
      {/* Floating Sparkles Background */}
      <FloatingSparkles />

      {/* Easter Egg Celebration */}
      {easterEggActive && (
        <div className="fixed inset-0 bg-blue-600/80 flex items-center justify-center z-50 animate-fade-in">
          <div className="text-center space-y-4 animate-scale-in">
            <div className="text-6xl animate-birthday-bounce">🎉</div>
            <div className="text-4xl font-bold text-white">
              Happy 100th Birthday Route 66!
            </div>
            <div className="text-xl text-white opacity-90">
              You found the secret celebration!
            </div>
            <div className="text-6xl animate-birthday-bounce" style={{ animationDelay: '0.5s' }}>🛣️</div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Festive Header */}
        <div className="text-center mb-12">
          {/* Birthday Badge with connecting effect */}
          <div className="relative inline-block mb-6">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg animate-nostalgic-glow">
              <Gift className="h-5 w-5 animate-birthday-bounce" />
              <span>Centennial Birthday Celebration</span>
              <PartyPopper className="h-5 w-5 animate-birthday-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
            {/* Connecting sparkle line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-full">
              <div className="flex items-center justify-center mt-2 mb-2">
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-birthday-sparkle mr-1"></div>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-birthday-sparkle mx-1" style={{ animationDelay: '0.3s' }}></div>
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-birthday-sparkle ml-1" style={{ animationDelay: '0.6s' }}></div>
              </div>
            </div>
          </div>
          
          {/* Main Heading with improved spacing */}
          <h2 
            id="centennial-heading"
            className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent mb-4 leading-tight animate-fade-in tracking-wide text-balance"
          >
            Route 66 Turns 100! <span className="inline-block h-8 w-8 sm:h-10 sm:w-10 animate-pulse">🎂</span>
          </h2>
          
          {/* Subtitle with date emphasis */}
          <p className="text-xl md:text-2xl text-slate-700 max-w-4xl mx-auto leading-relaxed font-medium animate-fade-in mt-4 text-balance" style={{ animationDelay: '0.2s' }}>
            Join us in celebrating America's most famous highway as it reaches its centennial milestone on <strong className="font-bold text-blue-700">November 11, 2026</strong>
          </p>

          {/* Decorative Elements */}
          <div className="flex justify-center items-center gap-4 mt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
            <Sparkles className="h-6 w-6 text-blue-500 animate-birthday-sparkle" />
            <div className="w-16 h-1 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full"></div>
          </div>
        </div>

        {/* 4-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {centennialCards.map((card, index) => (
            <Card
              key={card.id}
              className={`group h-full overflow-hidden bg-white/90 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-300 cursor-pointer relative border-l-4 ${card.accentColor} shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 animate-fade-in`}
              onClick={() => handleCardClick(card.route)}
              style={{
                animationDelay: `${index * 150}ms`
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
              {/* Hover Sparkle Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <Sparkles
                    key={i}
                    className={`absolute w-3 h-3 ${card.sparkleColor} animate-birthday-sparkle`}
                    style={{
                      left: `${20 + Math.random() * 60}%`,
                      top: `${20 + Math.random() * 60}%`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>

              {/* Header with Icon */}
              <div className="bg-gradient-to-r from-blue-50 to-slate-50 p-4 border-b border-blue-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-blue-600 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12">
                    {card.icon}
                  </div>
                  <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                    {card.subtitle}
                  </div>
                </div>
                <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-700 transition-colors duration-300">
                  {card.title}
                </h3>
              </div>

              <CardContent className="p-4 flex-1 flex flex-col">
                {/* Dynamic Content */}
                <div className="mb-4 flex-1">
                  {card.content}
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 mb-4 line-clamp-3 group-hover:text-slate-700 transition-colors duration-300">
                  {card.description}
                </p>

                {/* Action Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-blue-300 text-blue-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white hover:border-blue-500 transition-all duration-300 group/button font-medium"
                  aria-label={`${card.buttonText} for ${card.title}`}
                >
                  <span>{card.buttonText}</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover/button:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Celebration Elements */}
        <div className="mt-12 flex flex-col items-center gap-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="flex items-center gap-4">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"></div>
            <div className="text-4xl animate-birthday-bounce">🎊</div>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full"></div>
          </div>
          <p className="text-blue-600 text-center max-w-md text-sm italic">
            "The Mother Road has been bringing people together for nearly 100 years. Let's celebrate this incredible journey!"
          </p>
        </div>
      </div>
    </section>
  );
};

export default CentennialCardsSection;
