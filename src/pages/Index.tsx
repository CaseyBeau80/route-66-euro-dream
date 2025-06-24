
import { useState } from 'react';
import EnhancedHero from "../components/Hero/EnhancedHero";
import InteractiveMapSection from "../components/InteractiveMapSection/InteractiveMapSection";
import TripPlannerFormSection from "../components/TripPlannerFormSection/TripPlannerFormSection";
import SocialGallerySection from "../components/SocialGallerySection/SocialGallerySection";
import ExploreDirectorySection from "../components/ExploreDirectorySection/ExploreDirectorySection";
import TollRoadTipsSection from "../components/TollRoadTipsSection/TollRoadTipsSection";
import CentennialCelebrationSection from "../components/CentennialCelebrationSection/CentennialCelebrationSection";
import FinalCallToActionSection from "../components/FinalCallToActionSection/FinalCallToActionSection";
import MainLayout from "../components/MainLayout";
import FadeInSection from "../components/FadeInSection";
import BackToTopButton from "../components/BackToTopButton";

const Index = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "pt-BR">("en");
  
  console.log("🏠 Index page: Rendering with vertical scrollable Route 66 experience");

  return (
    <MainLayout language={language} setLanguage={setLanguage}>
      {/* Hero Section */}
      <section id="hero">
        <EnhancedHero language={language} />
      </section>

      {/* Interactive Map Section */}
      <FadeInSection id="map" delay={100}>
        <InteractiveMapSection />
      </FadeInSection>

      {/* Trip Planner Form Section */}
      <FadeInSection id="trip-planner" delay={150}>
        <TripPlannerFormSection />
      </FadeInSection>

      {/* Social Gallery Section */}
      <FadeInSection id="social-gallery" delay={200}>
        <SocialGallerySection />
      </FadeInSection>

      {/* Explore Directory Section */}
      <FadeInSection id="explore-directory" delay={250}>
        <ExploreDirectorySection />
      </FadeInSection>

      {/* Toll Road Tips Section */}
      <FadeInSection id="toll-road-tips" delay={300}>
        <TollRoadTipsSection language={language} />
      </FadeInSection>

      {/* Centennial Celebration Section */}
      <FadeInSection id="centennial-celebration" delay={350}>
        <CentennialCelebrationSection />
      </FadeInSection>

      {/* Final Call to Action Section */}
      <FadeInSection id="final-cta" delay={400}>
        <FinalCallToActionSection />
      </FadeInSection>

      {/* Back to Top Button */}
      <BackToTopButton />
    </MainLayout>
  );
};

export default Index;
