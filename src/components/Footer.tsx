
import React from 'react';
import { Heart, Github, Mail } from 'lucide-react';

interface FooterProps {
  language: string;
}

const footerContent = {
  en: {
    description: "Discover America's Main Street with the ultimate Route 66 adventure guide",
    madeWith: "Made with",
    forTravelers: "for Route 66 travelers",
    copyright: "All rights reserved.",
    links: {
      about: "About",
      privacy: "Privacy",
      terms: "Terms",
      contact: "Contact"
    }
  },
  de: {
    description: "Entdecken Sie Amerikas Hauptstraße mit dem ultimativen Route 66 Abenteuer-Guide",
    madeWith: "Gemacht mit",
    forTravelers: "für Route 66 Reisende",
    copyright: "Alle Rechte vorbehalten.",
    links: {
      about: "Über uns",
      privacy: "Datenschutz",
      terms: "Bedingungen",
      contact: "Kontakt"
    }
  },
  fr: {
    description: "Découvrez la Route Principale de l'Amérique avec le guide d'aventure ultime de la Route 66",
    madeWith: "Fait avec",
    forTravelers: "pour les voyageurs de la Route 66",
    copyright: "Tous droits réservés.",
    links: {
      about: "À propos",
      privacy: "Confidentialité",
      terms: "Conditions",
      contact: "Contact"
    }
  },
  "pt-BR": {
    description: "Descubra a Rua Principal da América com o guia de aventura definitivo da Rota 66",
    madeWith: "Feito com",
    forTravelers: "para viajantes da Rota 66",
    copyright: "Todos os direitos reservados.",
    links: {
      about: "Sobre",
      privacy: "Privacidade",
      terms: "Termos",
      contact: "Contato"
    }
  }
};

const Footer: React.FC<FooterProps> = ({ language }) => {
  const content = footerContent[language as keyof typeof footerContent] || footerContent.en;

  return (
    <footer className="bg-route66-text-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">RAMBLE 66</h3>
            <p className="text-gray-300 mb-4">
              {content.description}
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span>{content.madeWith}</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>{content.forTravelers}</span>
            </div>
          </div>

          {/* Links Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  {content.links.about}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  {content.links.privacy}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  {content.links.terms}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  {content.links.contact}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 RAMBLE 66. {content.copyright}
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
