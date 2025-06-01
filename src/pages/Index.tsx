
import InstagramStyleFeed from "../components/InstagramStyleFeed";
import RouteHeaderSection from "../components/RouteHeaderSection";
import RouteMapSection from "../components/RouteMapSection";
import RouteFooterSection from "../components/RouteFooterSection";

const Index = () => {
  console.log("🏠 Index page: Rendering with AUTHENTIC vintage travel poster theme");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-route66-cream via-route66-tan to-route66-vintage-beige vintage-paper-texture">
      {/* Route 66 Highway Header with Real Road Perspective */}
      <RouteHeaderSection />

      {/* Enhanced Map Section with Travel Poster Styling */}
      <RouteMapSection />

      {/* Instagram-Style Social Feed Section */}
      <InstagramStyleFeed />

      {/* Vintage Travel Poster Footer */}
      <RouteFooterSection />
    </div>
  );
};

export default Index;
