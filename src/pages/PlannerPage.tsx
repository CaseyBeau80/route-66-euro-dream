import { Suspense } from "react";
import MainLayout from "../components/MainLayout";
import SocialMetaTags from "../components/shared/SocialMetaTags";
import TripPlannerSection from "../components/TripPlannerSection";

const PlannerPage = () => {
  return (
    <MainLayout>
      <SocialMetaTags
        path="/planner"
        title="Route 66 Trip Planner — Build & Share Your Road Trip"
        description="Plan your Route 66 journey with our interactive trip planner. Add stops, customize your itinerary, and share your road trip plan with friends and family."
      />
      <section className="py-12 bg-route66-background">
        <div className="container mx-auto px-4">
          <h1 className="font-route66 text-3xl md:text-4xl text-route66-brown text-center mb-4">
            Route 66 Trip Planner
          </h1>
          <p className="text-center text-route66-brown/70 font-body max-w-2xl mx-auto mb-8">
            Build your perfect Mother Road itinerary. Add stops, plan your route, and share your trip with fellow travelers.
          </p>
        </div>
        <TripPlannerSection />
      </section>
    </MainLayout>
  );
};

export default PlannerPage;
