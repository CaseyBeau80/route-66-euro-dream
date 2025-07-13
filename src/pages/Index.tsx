
import MainLayout from "../components/MainLayout";
import FadeInSection from "../components/FadeInSection";
import BackToTopButton from "../components/BackToTopButton";
import HeroSection from "../components/Hero/HeroSection";
import HeroSectionMinimal from "../components/Hero/HeroSectionMinimal";
import ErrorBoundary from "../components/ErrorBoundary";
import InteractiveMapSection from "../components/InteractiveMap/InteractiveMapSection";
import UnifiedRoute66Carousel from "../components/UnifiedRoute66Carousel";
import TripPlannerSection from "../components/TripPlannerSection";
import SocialSection from "../components/SocialSection/SocialSection";
import TollRoads from "../components/TollRoads";
import FunSection from "../components/FunSection/FunSection";

const Index = () => {
  console.log("🏠 Index page: Rendering with restored directory view");

  return (
    <MainLayout>
      {/* Hero Section - Full viewport height with two-column layout */}
      <section id="hero">
        <ErrorBoundary fallback={<HeroSectionMinimal />}>
          <HeroSection />
        </ErrorBoundary>
      </section>

      {/* Interactive Map Section with fade-in */}
      <FadeInSection id="interactive-map" delay={200}>
        <InteractiveMapSection />
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
        <SocialSection />
      </FadeInSection>

      {/* Fun Section with fade-in */}
      <FadeInSection id="fun" delay={450}>
        <FunSection />
      </FadeInSection>

      {/* Toll Roads Advisory Section with fade-in */}
      <FadeInSection id="toll-roads" delay={500}>
        <TollRoads />
      </FadeInSection>

      {/* Back to Top Button */}
      <BackToTopButton />
    </MainLayout>
  );
};

export default Index;
