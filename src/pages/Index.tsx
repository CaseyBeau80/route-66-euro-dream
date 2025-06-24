
import { useState } from 'react';
import EnhancedHero from "../components/Hero/EnhancedHero";
import MapSection from "../components/MapSection";
import CentennialCardsSection from "../components/CentennialCardsSection";
import UnifiedRoute66Carousel from "../components/UnifiedRoute66Carousel";
import TripPlannerSplitView from "../components/TripPlannerSplitView/TripPlannerSplitView";
import SocialPhotoSplitView from "../components/SocialPhotoSplitView/SocialPhotoSplitView";
import TollRoadsTravelTips from "../components/TollRoadsTravelTips/TollRoadsTravelTips";
import TravelResources from "../components/TravelResources";
import MainLayout from "../components/MainLayout";
import FadeInSection from "../components/FadeInSection";
import BackToTopButton from "../components/BackToTopButton";
import CentennialSection from "../components/CentennialSection";

const Index = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "pt-BR">("en");
  const [isMapOpen, setIsMapOpen] = useState(false);
  
  console.log("🏠 Index page: Rendering with enhanced one-page Route 66 experience");

  // Scroll to trip planner function
  const handlePlanTrip = () => {
    const element = document.getElementById('trip-planner-split');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to map function
  const handleExploreMap = () => {
    setIsMapOpen(!isMapOpen);
    const element = document.getElementById('trip-planner-split');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <MainLayout language={language} setLanguage={setLanguage}>
      {/* Enhanced Hero Section */}
      <section id="hero">
        <EnhancedHero 
          language={language}
          onExploreMap={handleExploreMap}
          onPlanTrip={handlePlanTrip}
          isMapOpen={isMapOpen}
        />
      </section>

      {/* Centennial Celebration Section */}
      <FadeInSection id="centennial" delay={200}>
        <CentennialSection />
      </FadeInSection>

      {/* Interactive Map + Trip Planner Split View */}
      <FadeInSection id="trip-planner" delay={300}>
        <TripPlannerSplitView />
      </FadeInSection>

      {/* Social Media + Photo Challenge Split View */}
      <FadeInSection id="social-photo" delay={350}>
        <SocialPhotoSplitView />
      </FadeInSection>

      {/* Route 66 Directory Section */}
      <FadeInSection id="explore-route66" delay={400}>
        <UnifiedRoute66Carousel />
      </FadeInSection>

      {/* Toll Roads & Travel Tips Compact Layout */}
      <FadeInSection id="toll-roads-tips" delay={450}>
        <TollRoadsTravelTips language={language} />
      </FadeInSection>

      {/* Legacy Map Section - Hidden by default, can be toggled */}
      {isMapOpen && (
        <FadeInSection id="map" delay={500}>
          <MapSection isMapOpen={isMapOpen} setIsMapOpen={setIsMapOpen} />
        </FadeInSection>
      )}

      {/* Travel Resources Section */}
      <FadeInSection id="resources" delay={550}>
        <TravelResources language={language} />
      </FadeInSection>

      {/* Back to Top Button */}
      <BackToTopButton />
    </MainLayout>
  );
};

export default Index;
