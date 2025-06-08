
import { useState } from 'react';
import Hero from "../components/Hero";
import MapSection from "../components/MapSection";
import CentennialSection from "../components/CentennialSection";
import UnifiedRoute66Carousel from "../components/UnifiedRoute66Carousel";
import TripPlannerSection from "../components/TripPlannerSection";
import TravelResources from "../components/TravelResources";
import MainLayout from "../components/MainLayout";
import FadeInSection from "../components/FadeInSection";
import BackToTopButton from "../components/BackToTopButton";
import SimpleInstagramCarousel from "../components/InstagramCarousel/components/SimpleInstagramCarousel";
import FunFactsOfTheDay from "../components/FunFactsOfTheDay";
import Route66TriviaGame from "../components/Route66TriviaGame";

const Index = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "pt-BR">("en");
  const [isMapOpen, setIsMapOpen] = useState(true);
  
  console.log("🏠 Index page: Rendering with unified Route 66 carousel - Hero, Centennial, Fun Facts, Trivia Game, Instagram, Map, Trip Planner, Unified Carousel, Resources");

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

      {/* Fun Facts of the Day Section with fade-in */}
      <FadeInSection id="fun-facts" delay={250}>
        <FunFactsOfTheDay />
      </FadeInSection>

      {/* Route 66 Trivia Game Section with fade-in */}
      <FadeInSection id="trivia-game" delay={300}>
        <Route66TriviaGame />
      </FadeInSection>

      {/* Instagram Carousel Section with fade-in */}
      <FadeInSection id="instagram" delay={350}>
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

      {/* Unified Route 66 Carousel Section with fade-in - replaces ComprehensiveListings */}
      <FadeInSection id="explore-route66" delay={600}>
        <UnifiedRoute66Carousel />
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
