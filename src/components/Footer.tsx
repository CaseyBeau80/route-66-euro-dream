
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

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
    <footer className="bg-route66-gray text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo & Description */}
          <div className="col-span-12 md:col-span-4">
            <div className="flex items-center mb-4">
              <div className="mr-2">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-route66-red rounded-full flex items-center justify-center">
                    <span className="font-route66 text-white text-xs">66</span>
                  </div>
                </div>
              </div>
              <span className="font-route66 text-2xl text-white">ROUTE 66</span>
            </div>
            <p className="text-white/80 mb-6 max-w-md">
              {content.description}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div className="col-span-12 md:col-span-2">
            <h3 className="font-bold mb-4 text-lg">{content.company.title}</h3>
            <ul className="space-y-2">
              {content.company.links.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="col-span-12 md:col-span-2">
            <h3 className="font-bold mb-4 text-lg">{content.resources.title}</h3>
            <ul className="space-y-2">
              {content.resources.links.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="col-span-12 md:col-span-2">
            <h3 className="font-bold mb-4 text-lg">{content.business.title}</h3>
            <ul className="space-y-2">
              {content.business.links.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-white/70 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div className="col-span-12 md:col-span-2">
            <h3 className="font-bold mb-4 text-lg">Contact</h3>
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
          <div className="col-span-12 md:col-span-2">
            <h3 className="font-bold mb-4 text-lg">{content.language}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className={`flex items-center ${language === 'en' ? 'text-white font-medium' : 'text-white/70'}`}>
                  <div className={`w-2 h-2 rounded-full ${language === 'en' ? 'bg-route66-red' : 'bg-transparent border border-white/30'} mr-2`}></div>
                  English
                </a>
              </li>
              <li>
                <a href="#" className={`flex items-center ${language === 'de' ? 'text-white font-medium' : 'text-white/70'}`}>
                  <div className={`w-2 h-2 rounded-full ${language === 'de' ? 'bg-route66-red' : 'bg-transparent border border-white/30'} mr-2`}></div>
                  Deutsch
                </a>
              </li>
              <li>
                <a href="#" className={`flex items-center ${language === 'fr' ? 'text-white font-medium' : 'text-white/70'}`}>
                  <div className={`w-2 h-2 rounded-full ${language === 'fr' ? 'bg-route66-red' : 'bg-transparent border border-white/30'} mr-2`}></div>
                  Français
                </a>
              </li>
              <li>
                <a href="#" className={`flex items-center ${language === 'nl' ? 'text-white font-medium' : 'text-white/70'}`}>
                  <div className={`w-2 h-2 rounded-full ${language === 'nl' ? 'bg-route66-red' : 'bg-transparent border border-white/30'} mr-2`}></div>
                  Nederlands
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between">
          <div className="text-white/60 text-sm mb-4 md:mb-0">
            {content.copyright}
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
