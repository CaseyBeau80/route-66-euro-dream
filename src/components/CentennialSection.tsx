
import Route66Countdown from "./Route66Countdown";
import Route66FunFacts from "./Route66Countdown/Route66FunFacts";
import Route66Timeline from "./Route66Countdown/Route66Timeline";
import NostalgicBadge from "./Route66Countdown/NostalgicBadge";
import AnimatedConfetti from "./Route66Countdown/AnimatedConfetti";
import WavingFlag from "./Route66Countdown/WavingFlag";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Route } from "lucide-react";

const CentennialSection = () => {
  return (
    <section className="w-full relative overflow-hidden">
      {/* Full-width Hero Background */}
      <div 
        className="relative min-h-screen bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?auto=format&fit=crop&w=1920&h=1080&q=80')`
        }}
      >
        {/* Dark Gradient Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.7) 100%),
              radial-gradient(circle at center, rgba(220, 38, 38, 0.2) 0%, transparent 70%)
            `
          }}
        />

        {/* Animated Confetti */}
        <AnimatedConfetti />

        {/* Main Content Container */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Section Header with Nostalgic Badge */}
          <div className="text-center mb-16">
            <div className="flex justify-center items-center gap-4 mb-8">
              <NostalgicBadge />
              <WavingFlag />
            </div>
            
            <h2 
              className="text-5xl md:text-7xl font-black text-white mb-6 tracking-wider"
              style={{
                fontFamily: "'Black Ops One', 'Impact', sans-serif",
                textShadow: `
                  3px 3px 0px #dc2626,
                  6px 6px 0px #1d4ed8,
                  9px 9px 12px rgba(0,0,0,0.8),
                  0 0 25px rgba(220, 38, 38, 0.8),
                  0 0 50px rgba(29, 78, 216, 0.6)
                `,
                animation: 'patriotic-glow 3s ease-in-out infinite alternate'
              }}
            >
              100 YEARS OF ADVENTURE
            </h2>
            
            <p 
              className="text-2xl md:text-3xl text-white max-w-4xl mx-auto leading-relaxed font-bold"
              style={{
                fontFamily: "'Russo One', 'Arial Black', sans-serif",
                textShadow: `
                  2px 2px 0px #000000,
                  4px 4px 8px rgba(0,0,0,0.8),
                  0 0 20px rgba(255, 255, 255, 0.8)
                `
              }}
            >
              Join us in celebrating America's most beloved highway
            </p>
          </div>

          {/* Desktop Layout - Three Columns */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-12 lg:items-start mb-16">
            {/* Left Column - Fun Facts Carousel */}
            <div className="lg:col-span-3">
              <Route66FunFacts />
            </div>
            
            {/* Center Column - Countdown */}
            <div className="lg:col-span-6 text-center">
              <Route66Countdown />
              
              {/* Trip Planning Button */}
              <div className="mt-12 space-y-4">
                <p 
                  className="text-xl text-white font-bold"
                  style={{
                    fontFamily: "'Russo One', 'Arial Black', sans-serif",
                    textShadow: `
                      2px 2px 0px #000000,
                      4px 4px 6px rgba(0,0,0,0.8),
                      0 0 15px rgba(255, 255, 255, 0.8)
                    `
                  }}
                >
                  Ready to hit the road?
                </p>
                <Link to="/trip-calculator">
                  <Button 
                    className="bg-gradient-to-r from-route66-primary to-route66-primary-dark hover:from-route66-primary-dark hover:to-route66-primary text-white border-0 font-bold py-6 px-12 text-xl rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-2xl"
                    style={{
                      fontFamily: "'Russo One', 'Arial Black', sans-serif",
                      boxShadow: `
                        0 8px 16px rgba(0,0,0,0.4),
                        0 0 30px rgba(37, 99, 235, 0.6),
                        inset 0 2px 8px rgba(255,255,255,0.2)
                      `
                    }}
                  >
                    Start Planning Your Adventure
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Right Column - Timeline */}
            <div className="lg:col-span-3">
              <Route66Timeline />
            </div>
          </div>

          {/* Mobile/Tablet Responsive Layout */}
          <div className="lg:hidden space-y-16">
            {/* Countdown First on Mobile */}
            <div className="text-center">
              <Route66Countdown />
              
              {/* Trip Planning Button */}
              <div className="mt-12 space-y-4">
                <p 
                  className="text-xl text-white font-bold"
                  style={{
                    fontFamily: "'Russo One', 'Arial Black', sans-serif",
                    textShadow: `
                      2px 2px 0px #000000,
                      4px 4px 6px rgba(0,0,0,0.8),
                      0 0 15px rgba(255, 255, 255, 0.8)
                    `
                  }}
                >
                  Ready to hit the road?
                </p>
                <Link to="/trip-calculator">
                  <Button 
                    className="bg-gradient-to-r from-route66-primary to-route66-primary-dark hover:from-route66-primary-dark hover:to-route66-primary text-white border-0 font-bold py-6 px-8 text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl w-full md:w-auto"
                    style={{
                      fontFamily: "'Russo One', 'Arial Black', sans-serif",
                      boxShadow: `
                        0 8px 16px rgba(0,0,0,0.4),
                        0 0 30px rgba(37, 99, 235, 0.6),
                        inset 0 2px 8px rgba(255,255,255,0.2)
                      `
                    }}
                  >
                    Start Planning Your Adventure
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Two-column grid for Fun Facts and Timeline on tablets */}
            <div className="grid md:grid-cols-2 gap-8">
              <Route66FunFacts />
              <Route66Timeline />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CentennialSection;
