
import { useState } from 'react';
import Hero from "../components/Hero";
import MapSection from "../components/MapSection";
import CentennialSection from "../components/CentennialSection";
import MainLayout from "../components/MainLayout";
import FadeInSection from "../components/FadeInSection";
import BackToTopButton from "../components/BackToTopButton";

const Index = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "nl">("en");
  const [isMapOpen, setIsMapOpen] = useState(true);
  
  console.log("🏠 Index page: Rendering with modern design system and enhanced scroll features");

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

      {/* Interactive Map Section with fade-in */}
      <FadeInSection id="map" delay={200}>
        <MapSection isMapOpen={isMapOpen} setIsMapOpen={setIsMapOpen} />
      </FadeInSection>

      {/* Countdown & Quick Facts Section with fade-in */}
      <FadeInSection id="centennial" delay={400}>
        <CentennialSection />
      </FadeInSection>

      {/* Back to Top Button */}
      <BackToTopButton />
    </MainLayout>
  );
};

export default Index;
