
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
import SocialMetaTags from "../components/shared/SocialMetaTags";

const Index = () => {
  console.log("🏠 Index page: Rendering with restored directory view");

  return (
    <MainLayout>
      <SocialMetaTags />
      
      {/* Hero Section - Full viewport height with two-column layout */}
      <section id="hero">
        <HeroSection />
      </section>

      {/* Interactive Map Section with fade-in and H2 heading */}
      <FadeInSection id="interactive-map" delay={200}>
        <div className="container mx-auto px-4 pt-8 pb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-route66-text-primary text-center mb-8">
            Explore Route 66 with Our Interactive Map
          </h2>
        </div>
        <InteractiveMapSection />
      </FadeInSection>

      {/* Trip Planner Section with fade-in and H2 heading */}
      <FadeInSection id="trip-planner" delay={300}>
        <div className="container mx-auto px-4 pt-8 pb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-route66-text-primary text-center mb-8">
            Plan Your Custom Route 66 Trip
          </h2>
        </div>
        <TripPlannerSection />
      </FadeInSection>

      {/* Unified Route 66 Directory with H2 heading - Restored comprehensive directory view */}
      <FadeInSection id="route66-directory" delay={350}>
        <div className="container mx-auto px-4 pt-8 pb-4">
          <h2 className="text-3xl md:text-4xl font-bold text-route66-text-primary text-center mb-8">
            Route 66 Attractions & Hidden Gems Directory
          </h2>
        </div>
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
