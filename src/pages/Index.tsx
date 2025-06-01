
import Route66Map from "../components/Route66Map";

const Index = () => {
  console.log("🏠 Index page: Rendering with AUTHENTIC vintage travel poster theme");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-route66-cream via-route66-tan to-route66-vintage-beige vintage-paper-texture">
      {/* Vintage Travel Poster Header */}
      <div className="relative bg-gradient-to-r from-route66-vintage-red via-route66-orange to-route66-vintage-burgundy text-white py-8 overflow-hidden travel-poster-edge">
        {/* Authentic vintage texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20"></div>
        
        {/* Classic travel poster pattern background */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 25px,
                rgba(255,255,255,0.1) 25px,
                rgba(255,255,255,0.1) 50px
              ),
              repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 25px,
                rgba(244,208,63,0.1) 25px,
                rgba(244,208,63,0.1) 50px
              )
            `,
          }}></div>
        </div>
        
        {/* Vintage paper texture */}
        <div className="absolute inset-0 vintage-paper-texture opacity-20"></div>
        
        <div className="w-full px-3 sm:px-6 text-center relative z-10">
          {/* Authentic Route 66 Shield Badge */}
          <div className="flex justify-center mb-6">
            <div className="relative travel-stamp">
              <div className="w-20 h-24 bg-white rounded-xl border-4 border-route66-navy shadow-vintage route66-shield flex flex-col items-center justify-center">
                <div className="bg-route66-vintage-red text-white px-3 py-1.5 text-xs font-bold rounded-t-lg w-full text-center font-americana">ROUTE</div>
                <div className="text-route66-navy text-sm font-bold mt-1 font-vintage">US</div>
                <div className="text-route66-navy text-3xl font-black leading-none font-route66">66</div>
                <div className="text-route66-vintage-blue text-xs mt-0.5 font-travel">EST. 1926</div>
              </div>
              {/* Vintage glow and dust effects */}
              <div className="absolute inset-0 rounded-xl bg-route66-vintage-yellow opacity-25 blur-xl animate-pulse"></div>
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-route66-vintage-yellow rounded-full opacity-60 dust-effect"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-route66-orange rounded-full opacity-40 dust-effect" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
          
          <h1 className="font-route66 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-4 animate-fade-in retro-heading">
            HISTORIC ROUTE 66 EXPLORER
          </h1>
          
          {/* Vintage travel poster style tagline */}
          <div className="mb-4">
            <div className="inline-block bg-route66-vintage-yellow text-route66-navy px-6 py-2 rounded-full font-bold text-sm md:text-base highway-sign animate-vintage-flicker transform rotate-1">
              ★ AMERICA'S MOST FAMOUS HIGHWAY ★
            </div>
          </div>
          
          <p className="font-travel text-lg md:text-xl mb-6 text-route66-cream drop-shadow-lg animate-fade-in leading-relaxed" style={{ animationDelay: "0.2s" }}>
            Journey Through Time • Chicago to Santa Monica • 2,448 Miles of Authentic Americana
          </p>
          
          {/* Authentic vintage travel badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <div className="stamp-effect bg-route66-cream text-route66-vintage-red px-4 py-2 font-bold text-xs animate-slow-pulse">
              <div className="handwritten-style">Since 1926</div>
            </div>
            <div className="stamp-effect bg-route66-vintage-yellow text-route66-navy px-4 py-2 font-bold text-xs animate-slow-pulse" style={{ animationDelay: "0.5s" }}>
              <div className="font-americana">THE MOTHER ROAD</div>
            </div>
            <div className="stamp-effect bg-route66-vintage-turquoise text-white px-4 py-2 font-bold text-xs animate-slow-pulse" style={{ animationDelay: "1s" }}>
              <div className="font-vintage">8 STATES</div>
            </div>
          </div>
          
          {/* Vintage postcard style information */}
          <div className="max-w-2xl mx-auto vintage-postcard p-4 mb-4">
            <div className="text-route66-vintage-brown text-sm italic handwritten-style">
              "Discover hidden diners, vintage motels, roadside attractions, and the spirit of the open road..."
            </div>
          </div>
        </div>
        
        {/* Decorative vintage border elements */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-route66-vintage-yellow via-route66-cream to-route66-vintage-yellow"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-route66-vintage-red"></div>
      </div>

      {/* Enhanced Map Section with Travel Poster Styling */}
      <div className="w-full px-2 sm:px-3 py-3">
        <div className="relative w-full route66-authentic">
          {/* Vintage travel poster frame decoration */}
          <div className="absolute -inset-2 bg-gradient-to-r from-route66-vintage-brown via-route66-rust to-route66-vintage-brown rounded-xl opacity-80 vintage-paper-texture"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-route66-vintage-yellow via-route66-cream to-route66-vintage-yellow rounded-lg opacity-60"></div>
          
          <div className="relative bg-route66-cream rounded-lg p-2 border-4 border-route66-vintage-brown shadow-postcard vintage-paper-texture">
            {/* Map title bar with authentic styling */}
            <div className="bg-gradient-to-r from-route66-vintage-red to-route66-vintage-burgundy text-white py-2 px-4 rounded-t-lg mb-2 travel-poster-edge">
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 bg-route66-vintage-yellow rounded-full flex items-center justify-center">
                  <span className="text-route66-navy font-bold text-xs">66</span>
                </div>
                <h2 className="font-travel text-lg font-bold tracking-wider">ROUTE 66 INTERACTIVE MAP</h2>
                <div className="w-6 h-6 bg-route66-vintage-yellow rounded-full flex items-center justify-center">
                  <span className="text-route66-navy font-bold text-xs">★</span>
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
              {[
                { city: 'CHICAGO', state: 'IL' },
                { city: 'ST. LOUIS', state: 'MO' },
                { city: 'TULSA', state: 'OK' },
                { city: 'AMARILLO', state: 'TX' },
                { city: 'ALBUQUERQUE', state: 'NM' },
                { city: 'FLAGSTAFF', state: 'AZ' },
                { city: 'SANTA MONICA', state: 'CA' }
              ].map((location, index) => (
                <div key={location.city} className="vintage-postcard px-3 py-2 text-route66-vintage-brown transform hover:rotate-1 transition-transform">
                  <div className="font-americana text-xs font-bold">{location.city}</div>
                  <div className="font-travel text-xs opacity-80">{location.state}</div>
                </div>
              ))}
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
    </div>
  );
};

export default Index;
