import { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ItinerarySection from "../components/ItinerarySection";
import FeaturedListings from "../components/FeaturedListings";
import TravelResources from "../components/TravelResources";
import EmailCapture from "../components/EmailCapture";
import Footer from "../components/Footer";
import Route66Map from "../components/Route66Map"; // <-- new line

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
