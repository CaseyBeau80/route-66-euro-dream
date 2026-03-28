
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigationItems } from "../constants/navigationConfig";

type MobileNavigationProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isActiveRoute: (href: string) => boolean;
  renderMenuOnly?: boolean;
};

const MobileNavigation = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  isActiveRoute,
  renderMenuOnly = false,
}: MobileNavigationProps) => {
  // Render only the dropdown menu panel
  if (renderMenuOnly) {
    return (
      <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
        isMenuOpen ? 'max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-white border-t border-route66-primary/20 px-4 py-4 space-y-1 shadow-lg">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-sm font-medium transition-all duration-300 ${
                  isActiveRoute(item.href)
                    ? 'text-white bg-route66-primary shadow-md'
                    : 'text-route66-brown hover:text-route66-primary hover:bg-route66-cream'
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // Render only the hamburger button
  return (
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
  );
};

export default MobileNavigation;
