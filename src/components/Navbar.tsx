
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { getRambleLogoUrl, getRambleLogoAlt } from "../utils/logoConfig";

type NavbarProps = {
  language: string;
  setLanguage: (lang: "en" | "de" | "fr" | "nl") => void;
};

const Navbar = ({ language, setLanguage }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-2">
            <img 
              src={getRambleLogoUrl()}
              alt={getRambleLogoAlt('navigation')}
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <span className="font-route66 text-2xl text-route66-red">ROUTE 66</span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#map" className="text-route66-gray hover:text-route66-red transition-colors">Discover</a>
          <a href="#itineraries" className="text-route66-gray hover:text-route66-red transition-colors">Itineraries</a>
          <a href="#listings" className="text-route66-gray hover:text-route66-red transition-colors">Listings</a>
          <a href="#resources" className="text-route66-gray hover:text-route66-red transition-colors">Resources</a>
          
          <div className="border-l border-gray-300 h-6 mx-2"></div>
          
          {/* Language Selection */}
          <div className="flex space-x-2">
            <button 
              onClick={() => setLanguage("en")} 
              className={`text-sm px-2 py-1 rounded ${language === "en" ? "bg-route66-red text-white" : "text-route66-gray"}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage("de")} 
              className={`text-sm px-2 py-1 rounded ${language === "de" ? "bg-route66-red text-white" : "text-route66-gray"}`}
            >
              DE
            </button>
            <button 
              onClick={() => setLanguage("fr")} 
              className={`text-sm px-2 py-1 rounded ${language === "fr" ? "bg-route66-red text-white" : "text-route66-gray"}`}
            >
              FR
            </button>
            <button 
              onClick={() => setLanguage("nl")} 
              className={`text-sm px-2 py-1 rounded ${language === "nl" ? "bg-route66-red text-white" : "text-route66-gray"}`}
            >
              NL
            </button>
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="text-route66-gray focus:outline-none"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-6 shadow-lg animate-fade-in">
          <div className="flex flex-col space-y-4">
            <a 
              href="#map" 
              className="text-route66-gray hover:text-route66-red transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Discover
            </a>
            <a 
              href="#itineraries" 
              className="text-route66-gray hover:text-route66-red transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Itineraries
            </a>
            <a 
              href="#listings" 
              className="text-route66-gray hover:text-route66-red transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Listings
            </a>
            <a 
              href="#resources" 
              className="text-route66-gray hover:text-route66-red transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </a>
            
            <div className="border-t border-gray-200 pt-4 mt-2">
              <p className="text-sm text-gray-500 mb-2">Language</p>
              <div className="flex space-x-2">
                <button 
                  onClick={() => {setLanguage("en"); setIsMenuOpen(false);}} 
                  className={`text-sm px-3 py-1 rounded ${language === "en" ? "bg-route66-red text-white" : "bg-gray-100 text-route66-gray"}`}
                >
                  English
                </button>
                <button 
                  onClick={() => {setLanguage("de"); setIsMenuOpen(false);}} 
                  className={`text-sm px-3 py-1 rounded ${language === "de" ? "bg-route66-red text-white" : "bg-gray-100 text-route66-gray"}`}
                >
                  Deutsch
                </button>
              </div>
              <div className="flex space-x-2 mt-2">
                <button 
                  onClick={() => {setLanguage("fr"); setIsMenuOpen(false);}} 
                  className={`text-sm px-3 py-1 rounded ${language === "fr" ? "bg-route66-red text-white" : "bg-gray-100 text-route66-gray"}`}
                >
                  Français
                </button>
                <button 
                  onClick={() => {setLanguage("nl"); setIsMenuOpen(false);}} 
                  className={`text-sm px-3 py-1 rounded ${language === "nl" ? "bg-route66-red text-white" : "bg-gray-100 text-route66-gray"}`}
                >
                  Nederlands
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
