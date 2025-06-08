
import { useState } from 'react';
import Hero from "../components/Hero";
import MapSection from "../components/MapSection";
import CentennialCardsSection from "../components/CentennialCardsSection";
import UnifiedRoute66Carousel from "../components/UnifiedRoute66Carousel";
import TripPlannerSection from "../components/TripPlannerSection";
import TravelResources from "../components/TravelResources";
import MainLayout from "../components/MainLayout";
import FadeInSection from "../components/FadeInSection";
import BackToTopButton from "../components/BackToTopButton";
import SimpleInstagramCarousel from "../components/InstagramCarousel/components/SimpleInstagramCarousel";

const Index = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "pt-BR">("en");
  const [isMapOpen, setIsMapOpen] = useState(true);
  
  console.log("🏠 Index page: Rendering with unified centennial design");

  return (
    <MainLayout language={language} setLanguage={setLanguage}>
      {/* Hero Section - no top padding needed as nav is absolute */}
      <section id="hero">
        <Hero 
          language={language}
          onExploreMap={() => setIsMapOpen(!isMapOpen)}
          isMapOpen={isMapOpen}
        />
      </section>

      {/* Unified Centennial Cards Section with fade-in */}
      <FadeInSection id="centennial" delay={200}>
        <CentennialCardsSection />
      </FadeInSection>

      {/* Instagram Carousel Section with fade-in */}
      <FadeInSection id="instagram" delay={300}>
        <SimpleInstagramCarousel />
      </FadeInSection>

      {/* Interactive Map Section with fade-in */}
      <FadeInSection id="map" delay={350}>
        <MapSection isMapOpen={isMapOpen} setIsMapOpen={setIsMapOpen} />
      </FadeInSection>

      {/* Trip Planner Section with fade-in */}
      <FadeInSection id="trip-planner" delay={400}>
        <TripPlannerSection />
      </FadeInSection>

      {/* Unified Route 66 Carousel Section with fade-in */}
      <FadeInSection id="explore-route66" delay={450}>
        <UnifiedRoute66Carousel />
      </FadeInSection>

      {/* Travel Resources Section with fade-in - moved to bottom */}
      <FadeInSection id="resources" delay={500}>
        <TravelResources language={language} />
      </FadeInSection>

      {/* Back to Top Button */}
      <BackToTopButton />
    </MainLayout>
  );
};

export default Index;
