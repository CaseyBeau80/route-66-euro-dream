
import CityMarkersSection from "./CityMarkersSection";
import FooterContentSection from "./FooterContentSection";

const RouteFooterSection = () => {
  console.log("🎨 RouteFooterSection: Rendering vintage travel poster footer");
  
  return (
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
        <CityMarkersSection />
        
        {/* Footer content */}
        <FooterContentSection />
      </div>
      
      {/* Bottom vintage stripe */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-route66-vintage-red via-route66-vintage-yellow to-route66-vintage-red"></div>
    </div>
  );
};

export default RouteFooterSection;
