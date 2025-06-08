
import { useNavigationState } from "./hooks/useNavigationState";
import Logo from "./components/Logo";
import DesktopNavigation from "./components/DesktopNavigation";
import MobileNavigation from "./components/MobileNavigation";

type NavigationBarProps = {
  language: string;
  setLanguage: (lang: "en" | "de" | "fr" | "pt-BR") => void;
};

const NavigationBar = ({ language, setLanguage }: NavigationBarProps) => {
  const { isMenuOpen, setIsMenuOpen, scrolled, isActiveRoute } = useNavigationState();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-route66-primary/20' 
        : 'bg-transparent backdrop-blur-none shadow-none'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Logo />

          {/* Desktop Navigation */}
          <DesktopNavigation 
            isActiveRoute={isActiveRoute}
            language={language}
            setLanguage={setLanguage}
          />

          {/* Mobile Navigation */}
          <MobileNavigation
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            isActiveRoute={isActiveRoute}
            language={language}
            setLanguage={setLanguage}
          />
        </div>
      </div>

      {/* Decorative bottom border - only visible when scrolled */}
      <div className={`h-1 bg-gradient-to-r from-route66-primary via-route66-primary-light to-route66-primary transition-opacity duration-500 ${
        scrolled ? 'opacity-80' : 'opacity-0'
      }`}></div>
    </nav>
  );
};

export default NavigationBar;
