
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CentennialCardProps {
  id: string;
  title: string;
  subtitle: string | React.ReactNode;
  description: string;
  icon: React.ReactNode;
  route: string;
  content: React.ReactNode;
  accentColor: string;
  buttonText: string;
  sparkleColor: string;
  index: number;
}

const CentennialCard: React.FC<CentennialCardProps> = ({
  id,
  title,
  subtitle,
  description,
  icon,
  route,
  content,
  accentColor,
  buttonText,
  sparkleColor,
  index
}) => {
  const navigate = useNavigate();

  const handleCardClick = (route: string) => {
    // Make countdown card non-clickable for navigation
    if (id !== 'countdown') {
      navigate(route);
    }
  };

  const getAriaLabel = () => {
    if (id === 'countdown') {
      return `Birthday countdown card - ${title} with cake celebration theme`;
    }
    return `Navigate to ${title} - ${description}`;
  };

  return (
    <Card
      className={`group h-full overflow-hidden bg-white/95 backdrop-blur-sm border-2 border-slate-200 hover:border-blue-400 ${id !== 'countdown' ? 'cursor-pointer' : ''} relative border-l-4 ${accentColor} shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 animate-fade-in`}
      onClick={() => handleCardClick(route)}
      style={{
        animationDelay: `${index * 150}ms`
      }}
      role="region"
      aria-labelledby={`card-title-${id}`}
      tabIndex={id !== 'countdown' ? 0 : -1}
      aria-label={getAriaLabel()}
      onKeyDown={(e) => {
        if (id !== 'countdown' && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleCardClick(route);
        }
      }}
    >
      {/* Hover Sparkle Effect with reduced motion consideration */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <Sparkles
            key={i}
            className={`absolute w-3 h-3 ${sparkleColor} motion-safe:animate-birthday-sparkle motion-reduce:hidden`}
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Special cake sparkles for countdown card */}
        {id === 'countdown' && (
          <div className="absolute inset-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={`cake-sparkle-${i}`}
                className="absolute text-yellow-400 text-sm motion-safe:animate-ping motion-reduce:hidden"
                style={{
                  left: `${30 + Math.random() * 40}%`,
                  top: `${30 + Math.random() * 40}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '2s'
                }}
              >
                ✨
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Header with Icon - Centered */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 border-b border-slate-200">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="text-blue-700 group-hover:scale-110 transition-transform duration-300 motion-safe:group-hover:rotate-12 motion-reduce:group-hover:rotate-0">
            {icon}
          </div>
          <div className="text-xs font-medium text-blue-700 uppercase tracking-wide">
            {subtitle}
          </div>
        </div>
        <h3 
          id={`card-title-${id}`}
          className="font-bold text-lg text-slate-800 group-hover:text-blue-800 transition-colors duration-300 text-center"
        >
          {title}
        </h3>
      </div>

      <CardContent className="p-4 flex flex-col h-full">
        {/* Dynamic Content */}
        <div className="mb-3 flex-1">
          {content}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 mb-3 line-clamp-3 group-hover:text-slate-700 transition-colors duration-300">
          {description}
        </p>

        {/* Action Button - Compact with no extra margin */}
        <Button
          variant="outline"
          size="sm"
          className="w-full min-h-[40px] py-2 border-2 border-blue-300 text-blue-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 hover:text-white hover:border-blue-600 transition-colors duration-200 group/button font-medium"
          aria-label={`${buttonText} for ${title}`}
          disabled={id === 'countdown'}
        >
          <span>{buttonText}</span>
          <ArrowRight className="h-4 w-4 ml-2 group-hover/button:translate-x-1 transition-transform duration-300" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default CentennialCard;
