
import React from 'react';
import { Link } from "react-router-dom";
import { PictureOptimized } from "@/components/ui/PictureOptimized";

const Footer = () => {
  return (
    <footer className="bg-route66-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1">
            <div className="flex items-center mb-4">
              <div className="mr-3 p-1 bg-white rounded-md">
                <PictureOptimized 
                  src="https://xbwaphzntaxmdfzfsmvt.supabase.co/storage/v1/object/public/route66-assets/Logo_1_Ramble_66.png" 
                  alt="Ramble Route 66 Logo" 
                  className="w-8 h-8 object-contain"
                  width={32}
                  height={32}
                  sizes="32px"
                  loading="lazy"
                />
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
                <Link to="/" className="text-white/70 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-white/70 hover:text-white transition-colors text-sm">
                  All 240 Stops
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-white/70 hover:text-white transition-colors text-sm">
                  Events Calendar
                </Link>
              </li>
              <li>
                <Link to="/planner" className="text-white/70 hover:text-white transition-colors text-sm">
                  Trip Planner
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/70 hover:text-white transition-colors text-sm">
                  About Route 66
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="col-span-1">
            <h3 className="font-bold mb-4 text-lg text-white">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/photo-wall" className="text-white/70 hover:text-white transition-colors text-sm">
                  Photo Wall
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-white/70 hover:text-white transition-colors text-sm">
                  Blog & News
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-white/70 hover:text-white transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/trivia" className="text-white/70 hover:text-white transition-colors text-sm">
                  Trivia Game
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="font-bold mb-4 text-lg text-white">
              <Link to="/contact" className="text-white hover:text-route66-red transition-colors">
                Contact
              </Link>
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:hello@ramble66.com" className="text-white/70 hover:text-white transition-colors text-sm">
                  hello@ramble66.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between">
          <div className="text-white/60 text-sm mb-4 md:mb-0">
            © 2025 Ramble66 | Contact: <a href="mailto:hello@ramble66.com" className="text-white/70 hover:text-white transition-colors">hello@ramble66.com</a>
          </div>
          <div>
            <Link to="/privacy" className="text-white/60 text-sm hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
