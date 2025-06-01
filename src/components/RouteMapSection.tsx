
import Route66Map from "./Route66Map";

const RouteMapSection = () => {
  console.log("🗺️ RouteMapSection: Rendering map section with vintage travel poster styling");
  
  return (
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
  );
};

export default RouteMapSection;
