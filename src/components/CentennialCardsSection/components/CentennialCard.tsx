
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CentennialCardProps {
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
    navigate(route);
  };

  return (
    <Card
      key={id}
      className={`group h-full overflow-hidden bg-white/90 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-300 cursor-pointer relative border-l-4 ${accentColor} shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 animate-fade-in`}
      onClick={() => handleCardClick(route)}
      style={{
        animationDelay: `${index * 150}ms`
      }}
      role="button"
      tabIndex={0}
      aria-label={`Navigate to ${title} - ${description}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick(route);
        }
      }}
    >
      {/* Hover Sparkle Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <Sparkles
            key={i}
            className={`absolute w-3 h-3 ${sparkleColor} animate-birthday-sparkle`}
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
            {icon}
          </div>
          <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">
            {subtitle}
          </div>
        </div>
        <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-700 transition-colors duration-300">
          {title}
        </h3>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        {/* Dynamic Content */}
        <div className="mb-4 flex-1">
          {content}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-3 group-hover:text-slate-700 transition-colors duration-300">
          {description}
        </p>

        {/* Action Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full border-blue-300 text-blue-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white hover:border-blue-500 transition-all duration-300 group/button font-medium"
          aria-label={`${buttonText} for ${title}`}
        >
          <span>{buttonText}</span>
          <ArrowRight className="h-4 w-4 ml-2 group-hover/button:translate-x-1 transition-transform duration-300" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default CentennialCard;
