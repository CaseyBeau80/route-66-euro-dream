
import { Link } from "react-router-dom";

const RouteHeaderSection = () => {
  console.log("🏠 RouteHeaderSection: Rendering header with AUTHENTIC vintage travel poster theme");
  
  return (
    <div className="relative h-96 overflow-hidden">
      {/* Real Route 66 road background */}
      <div className="absolute inset-0">
        <img src="/lovable-uploads/a51e8034-fdbf-4f32-8be1-f184bcc4f908.png" alt="Route 66 road sign painted on asphalt" className="w-full h-full object-cover object-center" />
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
      </div>
      
      {/* Content overlay - positioned to complement the road view */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="w-full px-3 sm:px-6 text-center">
          {/* Main heading positioned above the road */}
          <h1 className="font-route66 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-4 animate-fade-in text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] mt-8">
            THE MOTHER ROAD AWAITS
          </h1>
          
          {/* Highway mile marker style badge */}
          <div className="mb-4">
            
          </div>
          
          {/* Road trip tagline */}
          <p className="font-travel text-xl md:text-2xl mb-6 text-white drop-shadow-lg animate-fade-in leading-relaxed max-w-3xl mx-auto" style={{
            animationDelay: "0.2s"
          }}>
            From Chicago's Skyline to Santa Monica's Sunset • The Ultimate American Road Trip Experience
          </p>
          
          {/* Highway markers positioned to work with the road perspective */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="bg-route66-vintage-yellow text-black px-6 py-2 font-bold text-sm rounded-full border-2 border-black shadow-lg animate-slow-pulse">
              <div className="font-americana">EST. 1926</div>
            </div>
            <div className="bg-route66-orange text-white px-6 py-2 font-bold text-sm rounded-full border-2 border-black shadow-lg animate-slow-pulse" style={{
              animationDelay: "0.5s"
            }}>
              <div className="font-vintage">8 STATES</div>
            </div>
            <div className="bg-route66-vintage-turquoise text-white px-6 py-2 font-bold text-sm rounded-full border-2 border-black shadow-lg animate-slow-pulse" style={{
              animationDelay: "1s"
            }}>
              <div className="font-americana">ENDLESS ADVENTURE</div>
            </div>
          </div>

          {/* Trip Calculator Button */}
          <div className="mt-8">
            <Link 
              to="/trip-calculator"
              className="inline-block vintage-button px-8 py-3 text-lg font-bold"
            >
              PLAN YOUR TRIP
            </Link>
          </div>
        </div>
      </div>
      
      {/* Road continuation effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="h-2 bg-route66-vintage-yellow opacity-80"></div>
        <div className="h-1 bg-white opacity-60"></div>
      </div>
    </div>
  );
};

export default RouteHeaderSection;
