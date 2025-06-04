
import { ReactNode } from 'react';
import NavigationBar from "./NavigationBar";
import SimpleInstagramCarousel from "./InstagramCarousel/components/SimpleInstagramCarousel";
import TravelResources from "./TravelResources";
import ComprehensiveListings from "./ComprehensiveListings";

interface MainLayoutProps {
  children: ReactNode;
  language: "en" | "de" | "fr" | "nl";
  setLanguage: (language: "en" | "de" | "fr" | "nl") => void;
}

const MainLayout = ({ children, language, setLanguage }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-route66-background">
      {/* Navigation Bar with modern styling */}
      <NavigationBar language={language} setLanguage={setLanguage} />
      
      {/* Main Content */}
      {children}

      {/* Instagram Carousel Section */}
      <SimpleInstagramCarousel />

      {/* Travel Resources Section */}
      <TravelResources language={language} />

      {/* Comprehensive Listings Section */}
      <ComprehensiveListings />
    </div>
  );
};

export default MainLayout;
