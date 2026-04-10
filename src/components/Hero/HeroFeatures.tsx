import React, { useEffect, useRef, useState } from 'react';
import { Map, Calendar, Route, Users, Newspaper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { forceIdleLoaderRender } from '@/components/performance/IdleLoader';
import { forceDeferredRender } from '@/components/performance/DeferredComponent';
import { forceTimeSlicedRender } from '@/components/performance/TimeSlicedComponent';
import { navigateToSection } from '@/utils/sectionNavigator';

interface Feature {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}

const forceRenderAllSections = () => {
  forceIdleLoaderRender();
  forceDeferredRender();
  forceTimeSlicedRender();
};

const HeroFeatures: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '50px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const features: Feature[] = [
    {
      icon: <Map className="w-7 h-7" />,
      title: "Interactive Google Map",
      subtitle: "Explore attractions, diners & hidden gems across all 8 states",
      onClick: () => { forceRenderAllSections(); navigateToSection('interactive-map'); },
    },
    {
      icon: <Calendar className="w-7 h-7" />,
      title: "Events Calendar",
      subtitle: "Centennial celebrations, festivals & car shows",
      onClick: () => { navigate('/events'); },
    },
    {
      icon: <Route className="w-7 h-7" />,
      title: "Travel Planner",
      subtitle: "Build custom trips & share with friends",
      onClick: () => { navigate('/planner'); },
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "Community",
      subtitle: "Instagram integration & social features for travelers",
      onClick: () => { navigate('/photo-wall'); },
    },
    {
      icon: <Newspaper className="w-7 h-7" />,
      title: "Blog & News",
      subtitle: "Stories, updates & what's happening on the Mother Road",
      onClick: () => { navigate('/blog'); },
    },
  ];

  return (
    <div ref={sectionRef} className="w-full bg-route66-background py-10 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {features.map((feature, idx) => (
            <button
              key={idx}
              onClick={feature.onClick}
              className={`
                bg-route66-surface border-2 border-route66-border rounded-sm p-5
                shadow-[4px_4px_0_hsl(var(--route66-border))]
                hover:shadow-[2px_2px_0_hsl(var(--route66-border))] hover:translate-x-[2px] hover:translate-y-[2px]
                transition-all duration-500 ease-out cursor-pointer text-left group
                ${isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'}
              `}
              style={{ transitionDelay: isVisible ? `${idx * 100}ms` : '0ms' }}
            >
              <div className="text-route66-primary mb-3 group-hover:text-route66-accent-red transition-colors">
                {feature.icon}
              </div>
              <h3 className="font-highway font-bold text-base text-route66-primary mb-1 group-hover:text-route66-accent-red transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-route66-text-secondary leading-snug">
                {feature.subtitle}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroFeatures;
