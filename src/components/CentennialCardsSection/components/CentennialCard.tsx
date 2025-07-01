
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

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
  sparkleColor,
  index
}) => {
  const navigate = useNavigate();

  const handleCardClick = (route: string) => {
    // Make facts card non-clickable for navigation
    if (id !== 'facts') {
      navigate(route);
    }
  };

  const getAriaLabel = () => {
    if (id === 'facts') {
      return `Fun facts card - ${title} with daily Route 66 stories`;
    }
    return `Navigate to ${title} - ${description}`;
  };

  const isClickable = id !== 'facts';

  return (
    <Card
      className={`group overflow-hidden bg-white/95 backdrop-blur-sm border-2 border-slate-200 hover:border-blue-400 ${isClickable ? 'cursor-pointer' : ''} relative border-l-4 ${accentColor} shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 animate-fade-in`}
      onClick={() => handleCardClick(route)}
      style={{
        animationDelay: `${index * 150}ms`
      }}
      role="region"
      aria-labelledby={`card-title-${id}`}
      tabIndex={isClickable ? 0 : -1}
      aria-label={getAriaLabel()}
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
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

      <CardContent className="p-4">
        {/* Dynamic Content */}
        <div className="mb-4">
          {content}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-3 group-hover:text-slate-700 transition-colors duration-300">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export default CentennialCard;
