
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useNavigationState = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect with smoother transition
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 10); // Trigger earlier for smoother effect
    };
    
    // Check initial scroll position
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  return {
    isMenuOpen,
    setIsMenuOpen,
    scrolled,
    isActiveRoute,
  };
};
