import { Suspense } from "react";
import MainLayout from "../components/MainLayout";
import FadeInSection from "../components/FadeInSection";
import BackToTopButton from "../components/BackToTopButton";
import HeroSection from "../components/Hero/HeroSection";
import SocialMetaTags from "../components/shared/SocialMetaTags";
import { DeferredComponent } from "../components/performance/DeferredComponent";
import { IdleLoader } from "../components/performance/IdleLoader";
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

      {/* Interactive Map Section - Deferred with intersection observer */}
      <DeferredComponent 
        fallback={<ComponentLoadingFallback />}
        rootMargin="200px"
        delay={100}
      >
        <FadeInSection id="interactive-map" delay={200}>
          <Suspense fallback={<ComponentLoadingFallback />}>
            <LazyInteractiveMapSection />
          </Suspense>
        </FadeInSection>
      </DeferredComponent>

      {/* Trip Planner Section - Deferred with intersection observer */}
      <DeferredComponent 
        fallback={<ComponentLoadingFallback />}
        rootMargin="150px"
        delay={150}
      >
        <FadeInSection id="trip-planner" delay={300}>
          <Suspense fallback={<ComponentLoadingFallback />}>
            <LazyTripPlannerSection />
          </Suspense>
        </FadeInSection>
      </DeferredComponent>

      {/* Below-the-fold content - Load only when browser is idle */}
      <IdleLoader timeout={200}>
        {/* Unified Route 66 Directory - Deferred loading */}
        <DeferredComponent 
          fallback={<ComponentLoadingFallback />}
          rootMargin="100px"
          delay={200}
        >
          <FadeInSection id="route66-directory" delay={350}>
            <Suspense fallback={<ComponentLoadingFallback />}>
              <LazyUnifiedRoute66Carousel className="bg-route66-background-section" />
            </Suspense>
          </FadeInSection>
        </DeferredComponent>

        {/* Social Section - Deferred loading */}
        <DeferredComponent 
          fallback={<ComponentLoadingFallback />}
          rootMargin="50px"
          delay={250}
        >
          <FadeInSection id="social" delay={400}>
            <Suspense fallback={<ComponentLoadingFallback />}>
              <LazySocialSection />
            </Suspense>
          </FadeInSection>
        </DeferredComponent>

        {/* Fun Section - Deferred loading */}
        <DeferredComponent 
          fallback={<ComponentLoadingFallback />}
          rootMargin="50px"
          delay={300}
        >
          <FadeInSection id="fun" delay={450}>
            <Suspense fallback={<ComponentLoadingFallback />}>
              <LazyFunSection />
            </Suspense>
          </FadeInSection>
        </DeferredComponent>

        {/* Toll Roads Advisory Section - Deferred loading */}
        <DeferredComponent 
          fallback={<ComponentLoadingFallback />}
          rootMargin="50px"
          delay={350}
        >
          <FadeInSection id="toll-roads" delay={500}>
            <Suspense fallback={<ComponentLoadingFallback />}>
              <LazyTollRoads />
            </Suspense>
          </FadeInSection>
        </DeferredComponent>
      </IdleLoader>

      {/* Back to Top Button */}
      <BackToTopButton />
    </MainLayout>
  );
};

export default Index;