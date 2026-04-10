import { Suspense } from "react";
import MainLayout from "../components/MainLayout";
import FadeInSection from "../components/FadeInSection";
import BackToTopButton from "../components/BackToTopButton";
import HeroSection from "../components/Hero/HeroSection";
import SocialMetaTags from "../components/shared/SocialMetaTags";
import { DeferredComponent } from "../components/performance/DeferredComponent";
import {
  LazyInteractiveMapSection,
  ComponentLoadingFallback
} from "../components/LazyComponents";
import EventsTeaser from "../components/HomePageTeasers/EventsTeaser";
import BrowseByStateGrid from "../components/HomePageTeasers/BrowseByStateGrid";
import FeaturedStopsTeaser from "../components/HomePageTeasers/FeaturedStopsTeaser";
import PhotoWallTeaser from "../components/HomePageTeasers/PhotoWallTeaser";

const Index = () => {
  return (
    <MainLayout>
      <SocialMetaTags 
        path="/" 
        title="Ramble 66 — Route 66 Interactive Map & Trip Planner" 
        description="Plan your ultimate Route 66 road trip with our Interactive Route 66 Google Map and Shareable Travel Planner. Discover hidden gems, classic diners, retro motels, and iconic attractions."
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

      {/* Events Teaser */}
      <DeferredComponent fallback={<ComponentLoadingFallback />} rootMargin="600px" delay={0}>
        <FadeInSection id="events-teaser" delay={200}>
          <EventsTeaser />
        </FadeInSection>
      </DeferredComponent>

      {/* Browse by State Grid */}
      <DeferredComponent fallback={<ComponentLoadingFallback />} rootMargin="600px" delay={0}>
        <FadeInSection id="browse-states" delay={200}>
          <BrowseByStateGrid />
        </FadeInSection>
      </DeferredComponent>

      {/* Featured Stops Teaser */}
      <DeferredComponent fallback={<ComponentLoadingFallback />} rootMargin="600px" delay={0}>
        <FadeInSection id="featured-stops" delay={200}>
          <FeaturedStopsTeaser />
        </FadeInSection>
      </DeferredComponent>

      {/* Photo Wall Teaser */}
      <DeferredComponent fallback={<ComponentLoadingFallback />} rootMargin="600px" delay={0}>
        <FadeInSection id="photo-wall" delay={200}>
          <PhotoWallTeaser />
        </FadeInSection>
      </DeferredComponent>

      {/* Back to Top Button */}
      <BackToTopButton />
    </MainLayout>
  );
};

export default Index;
