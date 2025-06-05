
import React, { useState, useEffect } from 'react';
import CompactCentennialButton from './CompactCentennialButton';

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
      <CompactCentennialButton onClick={scrollToSection} />
    </div>
  );
};

export default ScrollIndicator;
