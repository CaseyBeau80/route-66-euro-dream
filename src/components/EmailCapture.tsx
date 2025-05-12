
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type EmailCaptureProps = {
  language: string;
};

const emailContent = {
  en: {
    title: "Get Your Free Route 66 Starter Guide",
    subtitle: "Sign up to receive our 24-page PDF guide with essential tips for European travelers",
    placeholder: "Your email address",
    button: "Get Free Guide",
    includes: "What's included:",
    benefits: [
      "Essential pre-trip planning checklist",
      "Budget calculator for European travelers",
      "Conversion charts (km/miles, €/$ and more)",
      "Route 66 state-by-state overview"
    ],
    success: "Success! Check your email for the download link.",
    error: "Oops! Something went wrong. Please try again."
  },
  de: {
    title: "Holen Sie sich Ihren kostenlosen Route 66 Starter-Guide",
    subtitle: "Melden Sie sich an, um unseren 24-seitigen PDF-Guide mit wesentlichen Tipps für europäische Reisende zu erhalten",
    placeholder: "Ihre E-Mail-Adresse",
    button: "Gratis Guide erhalten",
    includes: "Was enthalten ist:",
    benefits: [
      "Wesentliche Checkliste für die Reiseplanung",
      "Budgetrechner für europäische Reisende",
      "Umrechnungstabellen (km/Meilen, €/$ und mehr)",
      "Route 66 Überblick Bundesstaat für Bundesstaat"
    ],
    success: "Erfolg! Überprüfen Sie Ihre E-Mail auf den Download-Link.",
    error: "Hoppla! Etwas ist schief gelaufen. Bitte versuchen Sie es erneut."
  },
  fr: {
    title: "Obtenez votre guide gratuit de démarrage Route 66",
    subtitle: "Inscrivez-vous pour recevoir notre guide PDF de 24 pages avec des conseils essentiels pour les voyageurs européens",
    placeholder: "Votre adresse e-mail",
    button: "Obtenir le guide gratuit",
    includes: "Ce qui est inclus :",
    benefits: [
      "Liste de contrôle essentielle pour la planification de voyage",
      "Calculateur de budget pour les voyageurs européens",
      "Tableaux de conversion (km/miles, €/$ et plus)",
      "Aperçu de la Route 66 état par état"
    ],
    success: "Succès ! Vérifiez votre e-mail pour le lien de téléchargement.",
    error: "Oups ! Quelque chose s'est mal passé. Veuillez réessayer."
  },
  nl: {
    title: "Krijg uw gratis Route 66 startgids",
    subtitle: "Meld u aan om onze 24-pagina tellende PDF-gids te ontvangen met essentiële tips voor Europese reizigers",
    placeholder: "Uw e-mailadres",
    button: "Ontvang gratis gids",
    includes: "Wat is inbegrepen:",
    benefits: [
      "Essentiële checklist voor reisplanning",
      "Budgetcalculator voor Europese reizigers",
      "Conversietabellen (km/mijl, €/$ en meer)",
      "Route 66 staat-voor-staat overzicht"
    ],
    success: "Succes! Controleer uw e-mail voor de downloadlink.",
    error: "Oeps! Er is iets misgegaan. Probeer het opnieuw."
  }
};

const EmailCapture = ({ language }: EmailCaptureProps) => {
  const content = emailContent[language as keyof typeof emailContent] || emailContent.en;
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast({
        variant: "destructive",
        title: content.error,
        description: "Please enter a valid email address."
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setEmail("");
      toast({
        title: content.success,
      });
    }, 1500);
  };
  
  return (
    <section className="py-16 bg-route66-blue text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-route66 mb-4">{content.title}</h2>
              <p className="text-white/90 mb-8">{content.subtitle}</p>
              
              <form onSubmit={handleSubmit} className="space-y-3 mb-8">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder={content.placeholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white focus-visible:ring-1 focus-visible:ring-white focus-visible:ring-offset-0"
                    required
                  />
                  <Button 
                    type="submit" 
                    className="bg-route66-red hover:bg-route66-red/90 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "..." : content.button}
                  </Button>
                </div>
              </form>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-2">{content.includes}</h3>
                <ul className="space-y-2">
                  {content.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="relative hidden md:flex items-center justify-center">
              <div className="w-64 h-80 bg-white/10 rounded-lg p-4 transform rotate-3 relative">
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-route66-red rounded-full"></div>
                <div className="h-full w-full border-2 border-dashed border-white/40 rounded flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-route66 text-2xl mb-2">ROUTE 66</p>
                    <p className="uppercase tracking-wider">STARTER GUIDE</p>
                    <div className="w-16 h-16 mx-auto my-4 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-12 h-12 bg-route66-red rounded-full flex items-center justify-center">
                        <span className="font-route66">66</span>
                      </div>
                    </div>
                    <p className="text-sm">FOR EUROPEAN TRAVELERS</p>
                  </div>
                </div>
              </div>
              
              <div className="w-64 h-80 bg-white/10 rounded-lg p-4 transform -rotate-3 absolute">
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-route66-cream rounded-full"></div>
                <div className="h-full w-full border-2 border-dashed border-white/40 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailCapture;
