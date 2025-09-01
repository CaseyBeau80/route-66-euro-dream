import { Suspense } from "react";
import MainLayout from "../components/MainLayout";
import FadeInSection from "../components/FadeInSection";
import BackToTopButton from "../components/BackToTopButton";
import HeroSection from "../components/Hero/HeroSection";
import SocialMetaTags from "../components/shared/SocialMetaTags";
import {
  LazyInteractiveMapSection,
  LazyUnifiedRoute66Carousel,
  LazyTripPlannerSection,
  LazySocialSection,
  LazyFunSection,
  LazyTollRoads,
  ComponentLoadingFallback
} from "../components/LazyComponents";

const Index = () => {
  console.log("🏠 Index page: Rendering with restored directory view");

  return (
    <MainLayout>
      <SocialMetaTags title="Ramble 66" description="Plan your ultimate Route 66 road trip with our interactive map and comprehensive guide. Discover hidden gems, classic diners, retro motels, ..." />
      
      {/* Hero Section - Full viewport height with two-column layout */}
      <section id="hero">
        <HeroSection />
      </section>

      {/* Interactive Map Section with fade-in and lazy loading */}
      <FadeInSection id="interactive-map" delay={200}>
        <Suspense fallback={<ComponentLoadingFallback />}>
          <LazyInteractiveMapSection />
        </Suspense>
      </FadeInSection>

      {/* Trip Planner Section with fade-in and lazy loading */}
      <FadeInSection id="trip-planner" delay={300}>
        <Suspense fallback={<ComponentLoadingFallback />}>
          <LazyTripPlannerSection />
        </Suspense>
      </FadeInSection>

      {/* Unified Route 66 Directory with lazy loading */}
      <FadeInSection id="route66-directory" delay={350}>
        <Suspense fallback={<ComponentLoadingFallback />}>
          <LazyUnifiedRoute66Carousel className="bg-route66-background-section" />
        </Suspense>
      </FadeInSection>

      {/* Social Section with fade-in and lazy loading */}
      <FadeInSection id="social" delay={400}>
        <Suspense fallback={<ComponentLoadingFallback />}>
          <LazySocialSection />
        </Suspense>
      </FadeInSection>

      {/* Fun Section with fade-in and lazy loading */}
      <FadeInSection id="fun" delay={450}>
        <Suspense fallback={<ComponentLoadingFallback />}>
          <LazyFunSection />
        </Suspense>
      </FadeInSection>

      {/* Toll Roads Advisory Section with fade-in and lazy loading */}
      <FadeInSection id="toll-roads" delay={500}>
        <Suspense fallback={<ComponentLoadingFallback />}>
          <LazyTollRoads />
        </Suspense>
      </FadeInSection>

      {/* Back to Top Button */}
      <BackToTopButton />
    </MainLayout>
  );
};

export default Index;