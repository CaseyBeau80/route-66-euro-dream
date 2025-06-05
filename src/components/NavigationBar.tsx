
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MapPin, Calculator, Home, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

type NavigationBarProps = {
  language: string;
  setLanguage: (lang: "en" | "de" | "fr" | "nl") => void;
};

const NavigationBar = ({ language, setLanguage }: NavigationBarProps) => {
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

  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Trip Calculator", href: "/trip-calculator", icon: Calculator },
  ];

  const languageOptions = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-route66-primary/20' 
        : 'bg-white/90 backdrop-blur-sm shadow-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?auto=format&fit=crop&w=40&h=40&q=80" 
                alt="Route 66 logo" 
                className="w-10 h-10 rounded-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-route66-primary/20 to-route66-primary-light/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span className="font-route66 text-2xl text-route66-primary group-hover:text-route66-primary-dark transition-colors duration-300">
              ROUTE 66
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300 group relative overflow-hidden ${
                    isActiveRoute(item.href)
                      ? 'text-white bg-route66-primary shadow-lg'
                      : 'text-route66-text-secondary hover:text-route66-primary hover:bg-route66-background-alt'
                  }`}
                >
                  <Icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
                  <span className="relative z-10">{item.name}</span>
                  {!isActiveRoute(item.href) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-route66-primary to-route66-primary-light opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
                  )}
                </Link>
              );
            })}

            {/* Quick Actions */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-route66-text-secondary hover:text-route66-primary transition-all duration-300 hover:scale-105"
                onClick={() => document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <MapPin size={18} className="mr-2" />
                Explore Map
              </Button>
            </div>

            {/* Language Selector */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex items-center space-x-2 bg-route66-background-alt hover:bg-route66-primary hover:text-white border border-route66-border transition-all duration-300">
                    <Globe size={16} />
                    <span>{languageOptions.find(l => l.code === language)?.flag}</span>
                    <span className="hidden sm:inline">{languageOptions.find(l => l.code === language)?.name}</span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="p-2 w-48">
                      {languageOptions.map((option) => (
                        <NavigationMenuLink
                          key={option.code}
                          className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md text-sm cursor-pointer transition-all duration-200 hover:bg-route66-primary/10 ${
                            language === option.code ? 'bg-route66-primary text-white font-medium' : 'text-route66-text-secondary'
                          }`}
                          onClick={() => setLanguage(option.code as "en" | "de" | "fr" | "nl")}
                        >
                          <span className="text-lg">{option.flag}</span>
                          <span>{option.name}</span>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-route66-text-secondary hover:text-route66-primary transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="relative w-6 h-6">
              <Menu 
                size={24} 
                className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}`} 
              />
              <X 
                size={24} 
                className={`absolute inset-0 transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`} 
              />
            </div>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-3 border-t border-route66-primary/20 mt-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isActiveRoute(item.href)
                      ? 'text-white bg-route66-primary shadow-md'
                      : 'text-route66-text-secondary hover:text-route66-primary hover:bg-route66-background-alt'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <div className="border-t border-route66-primary/20 pt-4 mt-4">
              <p className="text-sm text-route66-text-secondary mb-3 px-4 font-medium">Language</p>
              <div className="grid grid-cols-2 gap-2 px-4">
                {languageOptions.map((option) => (
                  <button
                    key={option.code}
                    onClick={() => setLanguage(option.code as "en" | "de" | "fr" | "nl")}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      language === option.code
                        ? 'bg-route66-primary text-white shadow-md'
                        : 'bg-route66-background-alt text-route66-text-secondary hover:bg-route66-primary/10'
                    }`}
                  >
                    <span>{option.flag}</span>
                    <span>{option.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-route66-primary via-route66-primary-light to-route66-primary opacity-80"></div>
    </nav>
  );
};

export default NavigationBar;
