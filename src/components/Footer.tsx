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
const Footer = ({
  language
}: FooterProps) => {
  const content = footerContent[language as keyof typeof footerContent] || footerContent.en;
  return <footer className="bg-route66-dark text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo & Description */}
          <div className="col-span-12 md:col-span-6">
            <div className="flex items-center mb-4">
              <div className="mr-3">
                <LogoImage className="w-10 h-10" alt="Ramble Route 66 Logo" />
              </div>
              <span className="font-route66 text-2xl text-white">RAMBLE 66</span>
            </div>
            
            
          </div>
          
          {/* Contact */}
          <div className="col-span-12 md:col-span-3">
            <h3 className="font-bold mb-4 text-lg">
              <a href="/contact" className="text-white hover:text-route66-red transition-colors">
                Contact
              </a>
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="https://www.ramble66.com" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors">
                  www.ramble66.com
                </a>
              </li>
              <li>
                <a href="mailto:info@ramble66.com" className="text-white/70 hover:text-white transition-colors">
                  info@ramble66.com
                </a>
              </li>
            </ul>
          </div>

          {/* Language */}
          
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
    </footer>;
};
export default Footer;