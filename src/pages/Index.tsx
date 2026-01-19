import { Suspense } from "react";
import MainLayout from "../components/MainLayout";
import FadeInSection from "../components/FadeInSection";
import BackToTopButton from "../components/BackToTopButton";
import HeroSection from "../components/Hero/HeroSection";
import SocialMetaTags from "../components/shared/SocialMetaTags";
import { DeferredComponent } from "../components/performance/DeferredComponent";
import {
  LazyInteractiveMapSection,
  LazyUnifiedRoute66Carousel,
  LazyTripPlannerSection,
  LazySocialSection,
  LazyFunSection,
  LazyTollRoads,
  LazyFAQAccordion,
  LazyCentennialEventsCalendar,
  ComponentLoadingFallback
} from "../components/LazyComponents";

const Index = () => {
  console.log("🏠 Index page: Rendering");

  return (
    <MainLayout>
      <SocialMetaTags 
        path="/" 
        title="Ramble 66" 
        description="Plan your ultimate Route 66 road trip with our interactive map and comprehensive guide. Discover hidden gems, classic diners, retro motels, and iconic attractions."
        includeFaqSchema={true}
        includeHowToSchema={true}
        includeAttractionsSchema={true}
        includeSoftwareAppSchema={true}
      />
      
      {/* Hero Section - Always render immediately */}
      <section id="hero">
        <HeroSection />
      </section>

      {/* Interactive Map Section */}
      <DeferredComponent 
        fallback={<ComponentLoadingFallback />}
        rootMargin="600px"
        delay={0}
      >
        <FadeInSection id="interactive-map" delay={200}>
          <Suspense fallback={<ComponentLoadingFallback />}>
            <LazyInteractiveMapSection />
          </Suspense>
        </FadeInSection>
      </DeferredComponent>

      {/* Trip Planner Section */}
      <DeferredComponent 
        fallback={<ComponentLoadingFallback />}
        rootMargin="600px"
        delay={0}
      >
        <FadeInSection id="trip-planner" delay={200}>
          <Suspense fallback={<ComponentLoadingFallback />}>
            <LazyTripPlannerSection />
          </Suspense>
        </FadeInSection>
      </DeferredComponent>

      {/* Unified Route 66 Directory */}
      <DeferredComponent 
        fallback={<ComponentLoadingFallback />}
        rootMargin="600px"
        delay={0}
      >
        <FadeInSection id="route66-directory" delay={200}>
          <Suspense fallback={<ComponentLoadingFallback />}>
            <LazyUnifiedRoute66Carousel className="bg-route66-background-section" />
          </Suspense>
        </FadeInSection>
      </DeferredComponent>

      {/* Social Section */}
      <DeferredComponent 
        fallback={<ComponentLoadingFallback />}
        rootMargin="600px"
        delay={0}
      >
        <FadeInSection id="social" delay={200}>
          <Suspense fallback={<ComponentLoadingFallback />}>
            <LazySocialSection />
          </Suspense>
        </FadeInSection>
      </DeferredComponent>

      {/* Centennial Events Calendar */}
      <DeferredComponent 
        fallback={<ComponentLoadingFallback />}
        rootMargin="600px"
        delay={0}
      >
        <FadeInSection id="events-calendar" delay={200}>
          <Suspense fallback={<ComponentLoadingFallback />}>
            <LazyCentennialEventsCalendar />
          </Suspense>
        </FadeInSection>
      </DeferredComponent>

      {/* FAQ Section */}
      <DeferredComponent 
        fallback={<ComponentLoadingFallback />}
        rootMargin="600px"
        delay={0}
      >
        <FadeInSection id="faq" delay={200}>
          <Suspense fallback={<ComponentLoadingFallback />}>
            <LazyFAQAccordion />
          </Suspense>
        </FadeInSection>
      </DeferredComponent>

      {/* Fun Section - Trivia Game */}
      <DeferredComponent 
        fallback={<ComponentLoadingFallback />}
        rootMargin="600px"
        delay={0}
      >
        <FadeInSection id="fun" delay={200}>
          <Suspense fallback={<ComponentLoadingFallback />}>
            <LazyFunSection />
          </Suspense>
        </FadeInSection>
      </DeferredComponent>

      {/* Toll Roads Advisory Section */}
      <DeferredComponent 
        fallback={<ComponentLoadingFallback />}
        rootMargin="600px"
        delay={0}
      >
        <FadeInSection id="toll-roads" delay={200}>
          <Suspense fallback={<ComponentLoadingFallback />}>
            <LazyTollRoads />
          </Suspense>
        </FadeInSection>
      </DeferredComponent>

      {/* Back to Top Button */}
      <BackToTopButton />
    </MainLayout>
  );
};

export default Index;
