
import { useNavigationState } from "./hooks/useNavigationState";
import Logo from "./components/Logo";
import DesktopNavigation from "./components/DesktopNavigation";
import MobileNavigation from "./components/MobileNavigation";

const NavigationBar = () => {
  const { isMenuOpen, setIsMenuOpen, scrolled, isActiveRoute } = useNavigationState();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-route66-primary/20' 
        : 'bg-white/90 backdrop-blur-sm shadow-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Logo />

          {/* Desktop Navigation */}
          <DesktopNavigation 
            isActiveRoute={isActiveRoute}
          />

          {/* Mobile Navigation */}
          <MobileNavigation
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            isActiveRoute={isActiveRoute}
          />
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-route66-primary via-route66-primary-light to-route66-primary opacity-80"></div>
    </nav>
  );
};

export default NavigationBar;
