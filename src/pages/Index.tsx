
import { useState } from 'react';
import Hero from "../components/Hero";
import MapSection from "../components/MapSection";
import CentennialSection from "../components/CentennialSection";
import MainLayout from "../components/MainLayout";

const Index = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "nl">("en");
  const [isMapOpen, setIsMapOpen] = useState(true);
  
  console.log("🏠 Index page: Rendering with modern design system");

  return (
    <MainLayout language={language} setLanguage={setLanguage}>
      {/* Hero Section - no top padding needed as nav is absolute */}
      <Hero 
        language={language}
        onExploreMap={() => setIsMapOpen(!isMapOpen)}
        isMapOpen={isMapOpen}
      />

      {/* Interactive Map Section */}
      <MapSection isMapOpen={isMapOpen} setIsMapOpen={setIsMapOpen} />

      {/* Countdown & Quick Facts Section */}
      <CentennialSection />
    </MainLayout>
  );
};

export default Index;
