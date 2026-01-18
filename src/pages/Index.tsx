import { Suspense } from "react";
import MainLayout from "../components/MainLayout";
import FadeInSection from "../components/FadeInSection";
import BackToTopButton from "../components/BackToTopButton";
import HeroSection from "../components/Hero/HeroSection";
import SocialMetaTags from "../components/shared/SocialMetaTags";
import { DeferredComponent } from "../components/performance/DeferredComponent";
import { IdleLoader } from "../components/performance/IdleLoader";
import { TimeSlicedComponent, useProgressiveMount } from "../components/performance/TimeSlicedComponent";
import {
  LazyInteractiveMapSection,
  LazyUnifiedRoute66Carousel,
  LazyTripPlannerSection,
  LazySocialSection,
  LazyFunSection,
  LazyTollRoads,
  LazyFAQAccordion,
  ComponentLoadingFallback
} from "../components/LazyComponents";

const Index = () => {
  console.log("🏠 Index page: Rendering with restored directory view");

  // Ultra-aggressive progressive mounting for FID optimization
  const { shouldMount } = useProgressiveMount(6, 300, 1); // Mount 6 components including FAQ

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

      {/* Interactive Map Section - Ultra-aggressive time-slicing for FID */}
      {shouldMount(0) && (
        <TimeSlicedComponent priority="high" delay={500}>
          <DeferredComponent 
            fallback={<ComponentLoadingFallback />}
            rootMargin="300px"
            delay={200}
          >
            <FadeInSection id="interactive-map" delay={400}>
              <Suspense fallback={<ComponentLoadingFallback />}>
                <LazyInteractiveMapSection />
              </Suspense>
            </FadeInSection>
          </DeferredComponent>
        </TimeSlicedComponent>
      )}

      {/* Trip Planner Section - Ultra-aggressive time-slicing for FID */}
      {shouldMount(1) && (
        <TimeSlicedComponent priority="normal" delay={800}>
          <DeferredComponent 
            fallback={<ComponentLoadingFallback />}
            rootMargin="400px"
            delay={300}
          >
            <FadeInSection id="trip-planner" delay={600}>
              <Suspense fallback={<ComponentLoadingFallback />}>
                <LazyTripPlannerSection />
              </Suspense>
            </FadeInSection>
          </DeferredComponent>
        </TimeSlicedComponent>
      )}

      {/* Below-the-fold content - Load only when browser is idle with time-slicing */}
      <IdleLoader timeout={1000}>  {/* Increased timeout for FID optimization */}
        {/* Unified Route 66 Directory - Ultra-aggressive time-slicing */}
        {shouldMount(2) && (
          <TimeSlicedComponent priority="normal" delay={1200}>
            <DeferredComponent 
              fallback={<ComponentLoadingFallback />}
              rootMargin="500px"
              delay={400}
            >
              <FadeInSection id="route66-directory" delay={800}>
                <Suspense fallback={<ComponentLoadingFallback />}>
                  <LazyUnifiedRoute66Carousel className="bg-route66-background-section" />
                </Suspense>
              </FadeInSection>
            </DeferredComponent>
          </TimeSlicedComponent>
        )}

        {/* Social Section - Progressive mounting */}
        {shouldMount(3) && (
          <TimeSlicedComponent priority="low" delay={700}>
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
          </TimeSlicedComponent>
        )}

        {/* FAQ Section - Above Fun/Trivia */}
        {shouldMount(4) && (
          <TimeSlicedComponent priority="low" delay={900}>
            <DeferredComponent 
              fallback={<ComponentLoadingFallback />}
              rootMargin="50px"
              delay={300}
            >
              <FadeInSection id="faq" delay={450}>
                <Suspense fallback={<ComponentLoadingFallback />}>
                  <LazyFAQAccordion />
                </Suspense>
              </FadeInSection>
            </DeferredComponent>
          </TimeSlicedComponent>
        )}

        {/* Fun Section - Trivia Game */}
        {shouldMount(5) && (
          <TimeSlicedComponent priority="low" delay={1000}>
            <DeferredComponent 
              fallback={<ComponentLoadingFallback />}
              rootMargin="50px"
              delay={300}
            >
              <FadeInSection id="fun" delay={475}>
                <Suspense fallback={<ComponentLoadingFallback />}>
                  <LazyFunSection />
                </Suspense>
              </FadeInSection>
            </DeferredComponent>
          </TimeSlicedComponent>
        )}

        {/* Toll Roads Advisory Section - Final section */}
        <TimeSlicedComponent priority="low" delay={1100}>
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
        </TimeSlicedComponent>
      </IdleLoader>

      {/* Back to Top Button */}
      <BackToTopButton />
    </MainLayout>
  );
};

export default Index;