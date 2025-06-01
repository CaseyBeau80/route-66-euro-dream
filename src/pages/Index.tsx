
import Route66Map from "../components/Route66Map";

const Index = () => {
  console.log("🏠 Index page: Rendering with nostalgic Route 66 theme - MAXIMIZED MAP");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-route66-cream via-route66-tan to-route66-cream vintage-texture">
      {/* Compact Vintage Header Section */}
      <div className="relative bg-gradient-to-r from-route66-red via-route66-orange to-route66-red text-white py-6 overflow-hidden">
        {/* Vintage texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
        
        {/* Retro pattern background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              rgba(255,255,255,0.1) 20px,
              rgba(255,255,255,0.1) 40px
            )`
          }}></div>
        </div>
        
        <div className="w-full px-2 sm:px-4 text-center relative z-10">
          {/* Compact Route 66 Shield */}
          <div className="flex justify-center mb-3">
            <div className="relative">
              <div className="w-16 h-20 bg-white rounded-lg border-4 border-route66-navy shadow-vintage flex flex-col items-center justify-center route66-shield">
                <div className="bg-route66-red text-white px-2 py-1 text-xs font-bold rounded-t">ROUTE</div>
                <div className="text-route66-navy text-xs font-bold mt-1">US</div>
                <div className="text-route66-navy text-2xl font-black leading-none">66</div>
              </div>
              {/* Vintage glow effect */}
              <div className="absolute inset-0 rounded-lg bg-route66-yellow opacity-20 blur-lg animate-pulse"></div>
            </div>
          </div>
          
          <h1 className="font-route66 text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mb-2 animate-fade-in retro-heading">
            ROUTE 66 EXPLORER
          </h1>
          <div className="highway-sign inline-block mb-2 animate-vintage-flicker">
            <span className="text-sm md:text-lg font-bold">AMERICA'S MAIN STREET</span>
          </div>
          <p className="font-vintage text-sm md:text-lg mb-4 text-route66-cream drop-shadow-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Discover the historic highway and its hidden gems • Est. 1926 • 2,448 Miles of Adventure
          </p>
          
          {/* Compact vintage badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            <div className="bg-route66-yellow text-route66-navy px-3 py-1 rounded-full font-bold text-xs shadow-vintage animate-slow-pulse">
              ⭐ CELEBRATING 100 YEARS ⭐
            </div>
            <div className="bg-route66-navy text-route66-yellow px-3 py-1 rounded-full font-bold text-xs shadow-vintage animate-slow-pulse" style={{ animationDelay: "0.5s" }}>
              🚗 THE MOTHER ROAD 🚗
            </div>
          </div>
        </div>
        
        {/* Decorative bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-route66-yellow via-route66-cream to-route66-yellow"></div>
      </div>

      {/* MAXIMIZED Map Section - Full Width, No Container Limits */}
      <div className="w-full px-1 sm:px-2 py-2">
        <div className="relative w-full">
          {/* Minimal vintage frame decoration */}
          <div className="absolute -inset-1 bg-gradient-to-r from-route66-brown via-route66-rust to-route66-brown rounded-lg opacity-80"></div>
          <div className="relative bg-route66-cream rounded-lg p-1 border-2 border-route66-yellow shadow-retro">
            <Route66Map />
          </div>
        </div>
      </div>

      {/* Compact Vintage Footer Section */}
      <div className="bg-gradient-to-r from-route66-navy via-route66-brown to-route66-navy text-white py-6 mt-4 relative overflow-hidden">
        {/* Vintage pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, white 2px, transparent 2px)`,
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        <div className="w-full px-4 text-center relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
            {/* Compact route markers */}
            <div className="flex flex-wrap justify-center gap-2">
              {['CHICAGO', 'ST. LOUIS', 'TULSA', 'AMARILLO', 'ALBUQUERQUE', 'FLAGSTAFF', 'SANTA MONICA'].map((city, index) => (
                <div key={city} className="bg-route66-red text-route66-cream px-2 py-1 rounded text-xs font-bold highway-sign transform rotate-1 hover:rotate-0 transition-transform">
                  {city}
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t-2 border-route66-yellow pt-4">
            <p className="font-vintage text-route66-cream text-sm mb-1">
              © 2024 Route 66 Explorer • Get Your Kicks on Route 66!
            </p>
            <p className="text-route66-tan text-xs">
              "The road beckons, the highway calls. Answer the call of the Mother Road."
            </p>
          </div>
        </div>
        
        {/* Bottom stripe */}
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-route66-red via-route66-yellow to-route66-red"></div>
      </div>
    </div>
  );
};

export default Index;
