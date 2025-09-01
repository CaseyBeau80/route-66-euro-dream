
import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { smoothScrollToTop } from "@/utils/smoothScroll";
import { OptimizedImage } from "@/components/ui/OptimizedImage";

const Logo = () => {
  const location = useLocation();

  const handleLogoClick = (e: React.MouseEvent) => {
    // If we're already on the homepage, smooth scroll to top instead of navigating
    if (location.pathname === '/') {
      e.preventDefault();
      smoothScrollToTop();
    }
  };

  return (
    <Link 
      to="/" 
      className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105"
      onClick={handleLogoClick}
    >
      <div className="relative">
        <OptimizedImage 
          src="/lovable-uploads/1f36b7c4-6bef-4d38-b35e-ae5e7474ef42.png" 
          alt="Ramble Route 66 Logo" 
          className="w-10 h-10 object-contain transition-all duration-300 group-hover:brightness-110"
          width={40}
          height={40}
          sizes="40px"
          priority={true}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-route66-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
      </div>
      <span className="font-route66 text-xl font-bold bg-gradient-to-r from-route66-primary to-route66-primary-light bg-clip-text text-transparent">
        RAMBLE 66
      </span>
    </Link>
  );
};

export default Logo;
