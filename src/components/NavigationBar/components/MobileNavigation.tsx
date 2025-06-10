
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigationItems, languageOptions, navigationLabels } from "../constants/navigationConfig";

type MobileNavigationProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isActiveRoute: (href: string) => boolean;
  language: string;
  setLanguage: (lang: "en" | "de" | "fr" | "pt-BR") => void;
};

const MobileNavigation = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  isActiveRoute, 
  language, 
  setLanguage 
}: MobileNavigationProps) => {
  const currentLabels = navigationLabels[language as keyof typeof navigationLabels];

  return (
    <>
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

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
        isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="py-4 space-y-3 border-t border-route66-primary/20 mt-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const displayName = currentLabels[item.labelKey as keyof typeof currentLabels];
            return (
              <Link
                key={item.labelKey}
                to={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                  isActiveRoute(item.href)
                    ? 'text-white bg-route66-primary shadow-md'
                    : 'text-route66-text-secondary hover:text-route66-primary hover:bg-route66-background-alt'
                }`}
              >
                <Icon size={20} />
                <span>{displayName}</span>
              </Link>
            );
          })}

          <div className="border-t border-route66-primary/20 pt-4 mt-4">
            <p className="text-sm text-route66-text-secondary mb-3 px-4 font-medium">Language</p>
            <div className="grid grid-cols-2 gap-2 px-4">
              {languageOptions.map((option) => (
                <button
                  key={option.code}
                  onClick={() => setLanguage(option.code as "en" | "de" | "fr" | "pt-BR")}
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
    </>
  );
};

export default MobileNavigation;
