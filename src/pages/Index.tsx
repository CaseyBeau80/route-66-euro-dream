
import { useState } from 'react';
import Hero from "../components/Hero";
import MapSection from "../components/MapSection";
import CentennialSection from "../components/CentennialSection";
import ComprehensiveListings from "../components/ComprehensiveListings";
import TripPlannerSection from "../components/TripPlannerSection";
import TravelResources from "../components/TravelResources";
import MainLayout from "../components/MainLayout";
import FadeInSection from "../components/FadeInSection";
import BackToTopButton from "../components/BackToTopButton";
import SimpleInstagramCarousel from "../components/InstagramCarousel/components/SimpleInstagramCarousel";

const Index = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "nl">("en");
  const [isMapOpen, setIsMapOpen] = useState(true);
  
  console.log("🏠 Index page: Rendering with reorganized layout - Hero, Centennial, Instagram, Map, Trip Planner, Adventures, Resources");

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

      {/* Centennial Countdown Section with fade-in */}
      <FadeInSection id="centennial" delay={200}>
        <CentennialSection />
      </FadeInSection>

      {/* Instagram Carousel Section with fade-in */}
      <FadeInSection id="instagram" delay={300}>
        <SimpleInstagramCarousel />
      </FadeInSection>

      {/* Interactive Map Section with fade-in */}
      <FadeInSection id="map" delay={400}>
        <MapSection isMapOpen={isMapOpen} setIsMapOpen={setIsMapOpen} />
      </FadeInSection>

      {/* Trip Planner Section with fade-in */}
      <FadeInSection id="trip-planner" delay={500}>
        <TripPlannerSection />
      </FadeInSection>

      {/* Route 66 Adventures Section with fade-in */}
      <FadeInSection id="adventures" delay={600}>
        <ComprehensiveListings />
      </FadeInSection>

      {/* Travel Resources Section with fade-in - moved to bottom */}
      <FadeInSection id="resources" delay={700}>
        <TravelResources language={language} />
      </FadeInSection>

      {/* Back to Top Button */}
      <BackToTopButton />
    </MainLayout>
  );
};

export default Index;
