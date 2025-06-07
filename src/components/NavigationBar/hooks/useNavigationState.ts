
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useNavigationState = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
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
