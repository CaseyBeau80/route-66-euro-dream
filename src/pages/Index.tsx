import { useEffect } from "react";
import $ from "jquery";
import "jvectormap-next"; // ✅ Correct version
import "jvectormap-content/maps/us-aea-en.js";
import "jvectormap-next/jquery-jvectormap.css";


type Language = "en" | "de" | "fr" | "nl";

const Index = () => {
  const [language, setLanguage] = useState<Language>("en");

  return (
    <div className="min-h-screen bg-route66-cream">
      <Navbar language={language} setLanguage={setLanguage} />
      <Hero language={language} />
      <Route66Map /> {/* <-- new map component */}
      <ItinerarySection language={language} />
      <FeaturedListings language={language} />
      <TravelResources language={language} />
      <EmailCapture language={language} />
      <Footer language={language} />
    </div>
  );
};

export default Index;
