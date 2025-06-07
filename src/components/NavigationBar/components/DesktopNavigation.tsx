
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigationItems } from "../constants/navigationConfig";
import LanguageSelector from "./LanguageSelector";

type DesktopNavigationProps = {
  isActiveRoute: (href: string) => boolean;
  language: string;
  setLanguage: (lang: "en" | "de" | "fr" | "nl") => void;
};

const DesktopNavigation = ({ isActiveRoute, language, setLanguage }: DesktopNavigationProps) => {
  return (
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
      <LanguageSelector language={language} setLanguage={setLanguage} />
    </div>
  );
};

export default DesktopNavigation;
