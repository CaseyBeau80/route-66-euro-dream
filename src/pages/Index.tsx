
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import NavigationBar from "@/components/NavigationBar";
import EnhancedHeroSection from "@/components/Hero/EnhancedHeroSection";
import CentennialSection from "@/components/CentennialSection";
import ComprehensiveListings from "@/components/ComprehensiveListings";
import { StoryJourney } from "@/components/StoryJourney";
import InteractiveMapSection from "@/components/InteractiveMap/InteractiveMapSection";
import FunFactsOfTheDay from "@/components/FunFactsOfTheDay";
import { InstagramCarousel } from "@/components/InstagramCarousel";
import TravelResources from "@/components/TravelResources";
import BackToTopButton from "@/components/BackToTopButton";
import Footer from "@/components/Footer";

const Index = () => {
  const [language, setLanguage] = useState<"en" | "de" | "fr" | "pt-BR">("en");

  return (
    <>
      <Helmet>
        <title>RAMBLE 66 - Your Ultimate Route 66 Adventure Guide</title>
        <meta name="description" content="Discover America's Main Street with RAMBLE 66. Plan your Route 66 journey, explore hidden gems, share photos, and join the community of travelers." />
        <meta name="keywords" content="Route 66, road trip, travel, America, highway, adventure, Chicago, Santa Monica, photo challenge" />
        <meta property="og:title" content="RAMBLE 66 - Your Ultimate Route 66 Adventure Guide" />
        <meta property="og:description" content="Plan your Route 66 journey, share photos, and join the community of travelers on America's Main Street." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://ramble66.com" />
      </Helmet>
      
      <div className="min-h-screen bg-route66-background">
        <NavigationBar language={language} setLanguage={setLanguage} />
        
        {/* Enhanced Hero Section with Photo Upload */}
        <EnhancedHeroSection language={language} />
        
        {/* Centennial Section */}
        <CentennialSection language={language} />
        
        {/* Comprehensive Listings - Remove language prop since component doesn't accept it */}
        <ComprehensiveListings />
        
        {/* Story Journey - Remove language prop since component doesn't accept it */}
        <StoryJourney />
        
        {/* Interactive Map */}
        <InteractiveMapSection language={language} />
        
        {/* Fun Facts */}
        <FunFactsOfTheDay />
        
        {/* Instagram Carousel */}
        <InstagramCarousel />
        
        {/* Travel Resources */}
        <TravelResources language={language} />
        
        {/* Footer */}
        <Footer language={language} />
        
        {/* Back to Top */}
        <BackToTopButton />
      </div>
    </>
  );
};

export default Index;
