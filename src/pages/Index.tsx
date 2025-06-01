
import Route66Map from "../components/Route66Map";
import { Link } from "react-router-dom";

const Index = () => {
  console.log("🏠 Index page: Rendering with AUTHENTIC vintage travel poster theme");
  return <div className="min-h-screen bg-gradient-to-br from-route66-cream via-route66-tan to-route66-vintage-beige vintage-paper-texture">
      {/* Route 66 Highway Header with Real Road Perspective */}
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

      {/* Enhanced Map Section with Travel Poster Styling */}
      <div className="w-full px-2 sm:px-3 py-3">
        <div className="relative w-full route66-authentic">
          {/* Vintage travel poster frame decoration */}
          <div className="absolute -inset-2 bg-gradient-to-r from-route66-vintage-brown via-route66-rust to-route66-vintage-brown rounded-xl opacity-80 vintage-paper-texture"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-route66-vintage-yellow via-route66-cream to-route66-vintage-yellow rounded-lg opacity-60"></div>
          
          <div className="relative bg-route66-cream rounded-lg p-2 border-4 border-route66-vintage-brown shadow-postcard vintage-paper-texture">
            {/* Map title bar with black asphalt styling and Route 66 shield bookends */}
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-3 px-4 rounded-t-lg mb-2 travel-poster-edge">
              <div className="flex items-center justify-center gap-4">
                {/* Left Route 66 Shield Bookend */}
                <div className="flex-shrink-0">
                  <img 
                    src="/lovable-uploads/cb155b0c-3bb5-4095-8150-9fb36bcb52b2.png" 
                    alt="Route 66 Shield" 
                    className="w-10 h-10 object-contain"
                  />
                </div>
                
                <h2 className="font-travel text-lg font-bold tracking-wider text-center">ROUTE 66 INTERACTIVE MAP</h2>
                
                {/* Right Route 66 Shield Bookend */}
                <div className="flex-shrink-0">
                  <img 
                    src="/lovable-uploads/cb155b0c-3bb5-4095-8150-9fb36bcb52b2.png" 
                    alt="Route 66 Shield" 
                    className="w-10 h-10 object-contain"
                  />
                </div>
              </div>
            </div>
            
            <Route66Map />
            
            {/* Vintage map legend */}
            <div className="mt-2 bg-route66-vintage-beige rounded-lg p-3 border-2 border-route66-vintage-brown vintage-paper-texture">
              <div className="flex flex-wrap justify-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-route66-vintage-red rounded-full"></div>
                  <span className="font-travel text-route66-vintage-brown">Historic Towns</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-route66-orange rounded"></div>
                  <span className="font-travel text-route66-vintage-brown">Route 66 Path</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-route66-vintage-turquoise rounded-full"></div>
                  <span className="font-travel text-route66-vintage-brown">Hidden Gems</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vintage Travel Poster Footer */}
      <div className="bg-gradient-to-r from-route66-navy via-route66-vintage-blue to-route66-navy text-white py-8 mt-6 relative overflow-hidden travel-poster-edge">
        {/* Vintage pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
          backgroundImage: `
              radial-gradient(circle at 30% 70%, white 3px, transparent 3px),
              radial-gradient(circle at 70% 30%, rgba(244,208,63,0.8) 2px, transparent 2px)
            `,
          backgroundSize: '40px 40px, 60px 60px'
        }}></div>
        </div>
        
        <div className="w-full px-6 text-center relative z-10">
          {/* Vintage city route markers */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-6">
            <div className="flex flex-wrap justify-center gap-2">
              {[{
              city: 'CHICAGO',
              state: 'IL'
            }, {
              city: 'ST. LOUIS',
              state: 'MO'
            }, {
              city: 'TULSA',
              state: 'OK'
            }, {
              city: 'AMARILLO',
              state: 'TX'
            }, {
              city: 'ALBUQUERQUE',
              state: 'NM'
            }, {
              city: 'FLAGSTAFF',
              state: 'AZ'
            }, {
              city: 'SANTA MONICA',
              state: 'CA'
            }].map((location, index) => <div key={location.city} className="vintage-postcard px-3 py-2 text-route66-vintage-brown transform hover:rotate-1 transition-transform">
                  <div className="font-americana text-xs font-bold">{location.city}</div>
                  <div className="font-travel text-xs opacity-80">{location.state}</div>
                </div>)}
            </div>
          </div>
          
          {/* Vintage divider */}
          <div className="border-t-4 border-route66-vintage-yellow pt-6 mb-4">
            <div className="flex justify-center mb-3">
              <div className="bg-route66-vintage-yellow text-route66-navy px-6 py-2 rounded-full font-bold stamp-effect">
                <span className="font-americana">GET YOUR KICKS ON ROUTE 66!</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <p className="font-vintage text-route66-cream text-lg font-bold">
              © 2024 Route 66 Explorer • Preserving America's Highway Heritage
            </p>
            <p className="text-route66-tan text-sm handwritten-style">
              "The road that built America, mile by mile, story by story"
            </p>
            <div className="flex justify-center gap-4 text-xs opacity-80">
              <span className="font-travel">Est. 1926</span>
              <span>•</span>
              <span className="font-travel">2,448 Miles</span>
              <span>•</span>
              <span className="font-travel">8 States</span>
              <span>•</span>
              <span className="font-travel">Endless Adventure</span>
            </div>
          </div>
        </div>
        
        {/* Bottom vintage stripe */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-route66-vintage-red via-route66-vintage-yellow to-route66-vintage-red"></div>
      </div>
    </div>;
};
export default Index;
