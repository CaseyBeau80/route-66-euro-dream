import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import LogoImage from "./shared/LogoImage";

type FooterProps = {
  language: string;
};

const footerContent = {
  en: {
    description: "Route 66 Guide helps European travelers plan their perfect American road trip adventure.",
    company: {
      title: "Company",
      links: ["About Us", "Our Team", "Press", "Testimonials"]
    },
    resources: {
      title: "Resources",
      links: ["Blog", "Route Maps", "Travel Guide", "FAQ"]
    },
    business: {
      title: "Partner with Us",
      links: ["List Your Business", "Advertising", "Affiliate Program", "Contact"]
    },
    language: "Language",
    copyright: "© 2023 Route 66 Guide. All rights reserved.",
    terms: "Terms & Privacy"
  },
  de: {
    description: "Route 66 Guide hilft europäischen Reisenden bei der Planung ihres perfekten amerikanischen Roadtrip-Abenteuers.",
    company: {
      title: "Unternehmen",
      links: ["Über uns", "Unser Team", "Presse", "Erfahrungsberichte"]
    },
    resources: {
      title: "Ressourcen",
      links: ["Blog", "Routenkarten", "Reiseführer", "FAQ"]
    },
    business: {
      title: "Partnerschaften",
      links: ["Ihr Unternehmen eintragen", "Werbung", "Partnerprogramm", "Kontakt"]
    },
    language: "Sprache",
    copyright: "© 2023 Route 66 Guide. Alle Rechte vorbehalten.",
    terms: "Nutzungsbedingungen & Datenschutz"
  },
  fr: {
    description: "Route 66 Guide aide les voyageurs européens à planifier leur parfaite aventure de road trip américain.",
    company: {
      title: "Entreprise",
      links: ["À propos de nous", "Notre équipe", "Presse", "Témoignages"]
    },
    resources: {
      title: "Ressources",
      links: ["Blog", "Cartes de route", "Guide de voyage", "FAQ"]
    },
    business: {
      title: "Partenariat",
      links: ["Référencer votre entreprise", "Publicité", "Programme d'affiliation", "Contact"]
    },
    language: "Langue",
    copyright: "© 2023 Route 66 Guide. Tous droits réservés.",
    terms: "Conditions & Confidentialité"
  },
  nl: {
    description: "Route 66 Guide helpt Europese reizigers bij het plannen van hun perfecte Amerikaanse roadtrip-avontuur.",
    company: {
      title: "Bedrijf",
      links: ["Over ons", "Ons team", "Pers", "Getuigenissen"]
    },
    resources: {
      title: "Bronnen",
      links: ["Blog", "Routekaarten", "Reisgids", "FAQ"]
    },
    business: {
      title: "Partner worden",
      links: ["Uw bedrijf vermelden", "Adverteren", "Partnerprogramma", "Contact"]
    },
    language: "Taal",
    copyright: "© 2023 Route 66 Guide. Alle rechten voorbehouden.",
    terms: "Voorwaarden & Privacy"
  }
};

const Footer = ({ language }: FooterProps) => {
  const content = footerContent[language as keyof typeof footerContent] || footerContent.en;
  
  return (
    <footer className="bg-route66-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="mr-3">
                <LogoImage className="w-10 h-10" alt="Ramble Route 66 Logo" />
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
              <li>
                <a href="/trivia" className="text-white/70 hover:text-white transition-colors text-sm">
                  Trivia Game
                </a>
              </li>
              <li>
                <a href="/fun-facts" className="text-white/70 hover:text-white transition-colors text-sm">
                  Fun Facts
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
                <a href="https://www.ramble66.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors text-sm">
                  www.ramble66.com
                </a>
              </li>
              <li>
                <a href="mailto:info@ramble66.com" className="text-white/70 hover:text-white transition-colors text-sm">
                  info@ramble66.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Follow */}
          <div className="col-span-1">
            <h3 className="font-bold mb-4 text-lg text-white">Follow Us</h3>
            <div className="flex space-x-3 mb-4">
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-route66-red transition-colors">
                <Facebook className="h-4 w-4 text-white" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-route66-red transition-colors">
                <Instagram className="h-4 w-4 text-white" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-route66-red transition-colors">
                <Twitter className="h-4 w-4 text-white" />
              </a>
              <a href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-route66-red transition-colors">
                <Youtube className="h-4 w-4 text-white" />
              </a>
            </div>
            <p className="text-white/70 text-xs">
              Join our community of Route 66 enthusiasts
            </p>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between">
          <div className="text-white/60 text-sm mb-4 md:mb-0">
            © 2025 Ramble66 | Contact: <a href="mailto:info@ramble66.com" className="text-white/70 hover:text-white transition-colors">info@ramble66.com</a>
          </div>
          <div>
            <a href="#" className="text-white/60 text-sm hover:text-white transition-colors">
              {content.terms}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;