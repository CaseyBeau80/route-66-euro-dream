import { Suspense } from "react";
import MainLayout from "../components/MainLayout";
import SocialMetaTags from "../components/shared/SocialMetaTags";
import UnifiedRoute66Carousel from "../components/UnifiedRoute66Carousel";

const ExplorePage = () => {
  return (
    <MainLayout>
      <SocialMetaTags
        path="/explore"
        title="Explore Route 66 — All 240 Attractions & Hidden Gems"
        description="Browse the complete directory of Route 66 stops. Filter by category, state, or city to discover classic diners, retro motels, roadside oddities, and iconic attractions along the Mother Road."
      />
      <section className="py-12 bg-route66-background">
        <div className="container mx-auto px-4">
          <h1 className="font-route66 text-3xl md:text-4xl text-route66-brown text-center mb-4">
            Explore Route 66
          </h1>
          <p className="text-center text-route66-brown/70 font-body max-w-2xl mx-auto mb-8">
            From Chicago to Santa Monica — 2,448 miles of classic diners, retro motels, roadside oddities, and iconic American landmarks. Browse all 240 stops or filter by category, state, and city.
          </p>
        </div>
        <UnifiedRoute66Carousel className="bg-route66-background-section" />
      </section>
    </MainLayout>
  );
};

export default ExplorePage;
