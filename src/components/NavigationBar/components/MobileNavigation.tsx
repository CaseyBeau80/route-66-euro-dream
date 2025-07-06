
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigationItems } from "../constants/navigationConfig";

type MobileNavigationProps = {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isActiveRoute: (href: string) => boolean;
};

const MobileNavigation = ({ 
  isMenuOpen, 
  setIsMenuOpen, 
  isActiveRoute
}: MobileNavigationProps) => {
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
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
