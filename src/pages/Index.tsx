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
  ComponentLoadingFallback
} from "../components/LazyComponents";

const Index = () => {
  console.log("🏠 Index page: Rendering with restored directory view");

  // Progressive mounting to reduce main-thread blocking
  const { shouldMount } = useProgressiveMount(5, 100, 2);

  return (
    <MainLayout>
      <SocialMetaTags title="Ramble 66" description="Plan your ultimate Route 66 road trip with our interactive map and comprehensive guide. Discover hidden gems, classic diners, retro motels, ..." />
      
      {/* Hero Section - Always render immediately */}
      <section id="hero">
        <HeroSection />
      </section>

      {/* Interactive Map Section - Time-sliced mounting */}
      {shouldMount(0) && (
        <TimeSlicedComponent priority="high" delay={200}>
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
        </TimeSlicedComponent>
      )}

      {/* Trip Planner Section - Time-sliced mounting */}
      {shouldMount(1) && (
        <TimeSlicedComponent priority="normal" delay={300}>
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
        </TimeSlicedComponent>
      )}

      {/* Below-the-fold content - Load only when browser is idle with time-slicing */}
      <IdleLoader timeout={400}>
        {/* Unified Route 66 Directory - Progressive mounting */}
        {shouldMount(2) && (
          <TimeSlicedComponent priority="normal" delay={500}>
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

        {/* Fun Section - Progressive mounting */}
        {shouldMount(4) && (
          <TimeSlicedComponent priority="low" delay={900}>
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