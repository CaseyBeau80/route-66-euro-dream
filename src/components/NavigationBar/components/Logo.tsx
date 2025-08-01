
import { Link, useLocation } from "react-router-dom";
import { smoothScrollToTop } from "@/utils/smoothScroll";

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
        <img 
          src="/lovable-uploads/708f8a62-5f36-4d4d-b6b0-35b556d22fba.png" 
          alt="Ramble Route 66 Logo" 
          className="w-10 h-10 object-contain transition-all duration-300 group-hover:brightness-110" 
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
