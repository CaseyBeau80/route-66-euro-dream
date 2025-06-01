
const FooterContentSection = () => {
  console.log("📄 FooterContentSection: Rendering footer content with vintage styling");
  
  return (
    <>
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
    </>
  );
};

export default FooterContentSection;
