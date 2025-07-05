
import { useState } from 'react';
import MainLayout from "../components/MainLayout";
import FadeInSection from "../components/FadeInSection";
import BackToTopButton from "../components/BackToTopButton";
import HeroSection from "../components/Hero/HeroSection";
import InteractiveMapSection from "../components/InteractiveMap/InteractiveMapSection";
import UnifiedRoute66Carousel from "../components/UnifiedRoute66Carousel";
import TripPlannerSection from "../components/TripPlannerSection";
import SocialSection from "../components/SocialSection/SocialSection";
import TollRoads from "../components/TollRoads";
import FunSection from "../components/FunSection/FunSection";

const Index = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "pt-BR">("en");
  
  return (
    <MainLayout language={language} setLanguage={setLanguage}>
      {/* Hero Section - Full viewport height with two-column layout */}
      <section id="hero">
        <HeroSection language={language} />
      </section>

      {/* Simple test content */}
      <div className="py-16 bg-white text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Route 66 Planning Made Simple
        </h2>
        <p className="text-lg text-gray-600">
          Your complete Route 66 adventure starts here.
        </p>
      </div>

      {/* Back to Top Button */}
      <BackToTopButton />
    </MainLayout>
  );
};

export default Index;
