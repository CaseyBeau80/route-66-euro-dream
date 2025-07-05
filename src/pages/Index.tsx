
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
  
  console.log("🏠 Index page: Rendering with restored directory view");

  return (
    <MainLayout language={language} setLanguage={setLanguage}>
      {/* Hero Section - Full viewport height with two-column layout */}
      <section id="hero">
        <HeroSection language={language} />
      </section>

      {/* Interactive Map Section with fade-in */}
      <FadeInSection id="interactive-map" delay={200}>
        <InteractiveMapSection language={language} />
      </FadeInSection>

      {/* Trip Planner Section with fade-in */}
      <FadeInSection id="trip-planner" delay={300}>
        <TripPlannerSection />
      </FadeInSection>

      {/* Unified Route 66 Directory - Restored comprehensive directory view */}
      <FadeInSection id="route66-directory" delay={350}>
        <UnifiedRoute66Carousel className="bg-route66-background-section" />
      </FadeInSection>

      {/* Social Section with fade-in */}
      <FadeInSection id="social" delay={400}>
        <SocialSection language={language} />
      </FadeInSection>

      {/* Fun Section with fade-in */}
      <FadeInSection id="fun" delay={450}>
        <FunSection language={language} />
      </FadeInSection>

      {/* Toll Roads Advisory Section with fade-in */}
      <FadeInSection id="toll-roads" delay={500}>
        <TollRoads language={language} />
      </FadeInSection>

      {/* Back to Top Button */}
      <BackToTopButton />
    </MainLayout>
  );
};

export default Index;
