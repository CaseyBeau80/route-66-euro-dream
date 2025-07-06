import LogoImage from "./shared/LogoImage";
const Footer = () => {
  console.log('🏁 Footer: Rendering with LogoImage component');
  return <footer className="bg-route66-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="mr-3">
                <img src="/lovable-uploads/708f8a62-5f36-4d4d-b6b0-35b556d22fba.png" alt="Ramble Route 66 Logo" className="w-10 h-10 object-contain" />
              </div>
              <span className="font-route66 text-xl text-white">RAMBLE 66</span>
            </div>
            <p className="text-white/70 text-sm">
              Your ultimate Route 66 travel companion
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="font-bold mb-4 text-lg text-white">Explore</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-white/70 hover:text-white transition-colors text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-white/70 hover:text-white transition-colors text-sm">
                  About Route 66
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="font-bold mb-4 text-lg text-white">
              <a href="/contact" className="text-white hover:text-route66-red transition-colors">
                Contact
              </a>
            </h3>
            <ul className="space-y-2">
              <li>
                
              </li>
              <li>
                <a href="mailto:info@ramble66.com" className="text-white/70 hover:text-white transition-colors text-sm">
                  info@ramble66.com
                </a>
              </li>
            </ul>
          </div>

        </div>
        
        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between">
          <div className="text-white/60 text-sm mb-4 md:mb-0">
            © 2025 Ramble66 | Contact: <a href="mailto:info@ramble66.com" className="text-white/70 hover:text-white transition-colors">info@ramble66.com</a>
          </div>
          <div>
            <a href="#" className="text-white/60 text-sm hover:text-white transition-colors">
              Terms & Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;