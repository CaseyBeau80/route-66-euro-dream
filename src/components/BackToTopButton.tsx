
import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 400;
      setIsVisible(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-40 bg-route66-primary hover:bg-route66-primary-dark text-white p-3 rounded-full shadow-2xl hover:shadow-xl transform hover:scale-110 transition-all duration-300 border-2 border-white/10 backdrop-blur-sm"
      aria-label="Back to top"
    >
      <ChevronUp size={24} />
    </button>
  );
};

export default BackToTopButton;
