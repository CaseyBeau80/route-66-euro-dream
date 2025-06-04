
import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface ScrollIndicatorProps {
  targetId?: string;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ targetId = 'centennial' }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      setIsVisible(!scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = () => {
    const element = document.getElementById(targetId);
    if (element) {
      // Enhanced smooth scrolling with better mobile support
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
      
      // Fallback for older browsers/devices
      if (!CSS.supports('scroll-behavior', 'smooth')) {
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition - 80; // Account for nav height
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
      <button
        onClick={scrollToSection}
        className="group flex flex-col items-center gap-2 text-white/90 hover:text-white transition-all duration-300 bg-black/20 backdrop-blur-sm rounded-full p-4 hover:bg-black/30 border border-white/20"
        aria-label="Scroll to 100 Years of Adventure section"
      >
        <span className="text-sm font-medium hidden sm:block">100 Years of Adventure</span>
        <ChevronDown 
          size={24} 
          className="animate-pulse group-hover:scale-110 transition-transform duration-300" 
        />
      </button>
    </div>
  );
};

export default ScrollIndicator;
