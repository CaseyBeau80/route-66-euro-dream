
import React from "react";
import { AlertTriangle, CreditCard, MapPin, Route } from "lucide-react";
import { TollRoadsContentMap } from "./types";

export const tollRoadsContent: TollRoadsContentMap = {
  en: {
    title: "Toll Roads on Route 66",
    subtitle: "What you need to know about toll roads and payment methods",
    sections: [
      {
        icon: React.createElement(Route, { className: "h-6 w-6 text-route66-red" }),
        title: "Toll Roads Along the Route",
        content: "While historic Route 66 itself was toll-free, modern interstate highways that follow the route may have tolls. Major toll roads include portions of I-44 in Oklahoma, I-55 near Chicago, and some bridges and tunnels."
      },
      {
        icon: React.createElement(CreditCard, { className: "h-6 w-6 text-route66-blue" }),
        title: "Payment Methods",
        content: "Most toll roads accept cash, credit cards, and electronic transponders like E-ZPass, SunPass, or state-specific tags. Many newer toll plazas are cashless and use license plate recognition for billing."
      },
      {
        icon: React.createElement(MapPin, { className: "h-6 w-6 text-route66-red" }),
        title: "State-by-State Breakdown",
        content: "Illinois: Chicago Skyway and some bridges. Missouri: Generally toll-free. Oklahoma: Portions of I-44 Turner Turnpike. Texas, New Mexico, Arizona: Mostly toll-free. California: Some bridges and express lanes may charge tolls."
      },
      {
        icon: React.createElement(AlertTriangle, { className: "h-6 w-6 text-amber-600" }),
        title: "Tips for International Travelers",
        content: "Rental cars may be charged administrative fees for toll violations. Consider getting a rental car with a transponder or ask about toll packages. Keep receipts for expense tracking. Some rental companies offer prepaid toll plans."
      }
    ],
    estimatedCosts: {
      title: "Estimated Toll Costs",
      description: "Budget approximately $20-50 for tolls on the complete Route 66 journey, depending on your specific route and vehicle type. Costs are generally higher for larger vehicles and RVs.",
      details: [
        "Chicago to St. Louis: $5-15",
        "Oklahoma Turnpikes: $10-25", 
        "Bridge tolls: $2-8 each",
        "Express lanes (optional): $1-5 per use"
      ]
    }
  },
  de: {
    title: "Mautstraßen auf der Route 66",
    subtitle: "Was Sie über Mautstraßen und Zahlungsmethoden wissen müssen",
    sections: [
      {
        icon: React.createElement(Route, { className: "h-6 w-6 text-route66-red" }),
        title: "Mautstraßen entlang der Route",
        content: "Während die historische Route 66 selbst mautfrei war, können moderne Interstate-Highways, die der Route folgen, Maut erheben. Große Mautstraßen umfassen Teile der I-44 in Oklahoma, I-55 bei Chicago und einige Brücken und Tunnel."
      },
      {
        icon: React.createElement(CreditCard, { className: "h-6 w-6 text-route66-blue" }),
        title: "Zahlungsmethoden",
        content: "Die meisten Mautstraßen akzeptieren Bargeld, Kreditkarten und elektronische Transponder wie E-ZPass, SunPass oder staatsspezifische Tags. Viele neuere Mautstellen sind bargeldlos und verwenden Kennzeichenerkennung für die Abrechnung."
      },
      {
        icon: React.createElement(MapPin, { className: "h-6 w-6 text-route66-red" }),
        title: "Aufschlüsselung nach Bundesstaaten",
        content: "Illinois: Chicago Skyway und einige Brücken. Missouri: Generell mautfrei. Oklahoma: Teile der I-44 Turner Turnpike. Texas, New Mexico, Arizona: Meist mautfrei. Kalifornien: Einige Brücken und Expressspuren können Maut erheben."
      },
      {
        icon: React.createElement(AlertTriangle, { className: "h-6 w-6 text-amber-600" }),
        title: "Tipps für internationale Reisende",
        content: "Mietwagen können Verwaltungsgebühren für Mautverstöße berechnet bekommen. Erwägen Sie einen Mietwagen mit Transponder oder fragen Sie nach Mautpaketen. Bewahren Sie Quittungen für die Kostenabrechnung auf. Einige Mietwagenfirmen bieten Prepaid-Mautpläne an."
      }
    ],
    estimatedCosts: {
      title: "Geschätzte Mautkosten",
      description: "Budgetieren Sie etwa $20-50 für Maut auf der kompletten Route 66-Reise, abhängig von Ihrer spezifischen Route und Fahrzeugtyp. Die Kosten sind generell höher für größere Fahrzeuge und Wohnmobile.",
      details: [
        "Chicago nach St. Louis: $5-15",
        "Oklahoma Turnpikes: $10-25",
        "Brückenmaut: $2-8 pro Brücke",
        "Expressspuren (optional): $1-5 pro Nutzung"
      ]
    }
  },
  fr: {
    title: "Routes à péage sur la Route 66",
    subtitle: "Ce que vous devez savoir sur les routes à péage et les méthodes de paiement",
    sections: [
      {
        icon: React.createElement(Route, { className: "h-6 w-6 text-route66-red" }),
        title: "Routes à péage le long de l'itinéraire",
        content: "Bien que la Route 66 historique elle-même était gratuite, les autoroutes modernes qui suivent l'itinéraire peuvent avoir des péages. Les principales routes à péage incluent des portions de l'I-44 en Oklahoma, l'I-55 près de Chicago, et certains ponts et tunnels."
      },
      {
        icon: React.createElement(CreditCard, { className: "h-6 w-6 text-route66-blue" }),
        title: "Méthodes de paiement",
        content: "La plupart des routes à péage acceptent l'argent liquide, les cartes de crédit et les transpondeurs électroniques comme E-ZPass, SunPass ou les étiquettes spécifiques à l'état. Beaucoup de nouvelles stations de péage sont sans espèces et utilisent la reconnaissance de plaque d'immatriculation pour la facturation."
      },
      {
        icon: React.createElement(MapPin, { className: "h-6 w-6 text-route66-red" }),
        title: "Répartition par état",
        content: "Illinois : Chicago Skyway et certains ponts. Missouri : Généralement sans péage. Oklahoma : Portions de l'I-44 Turner Turnpike. Texas, Nouveau-Mexique, Arizona : Principalement sans péage. Californie : Certains ponts et voies express peuvent facturer des péages."
      },
      {
        icon: React.createElement(AlertTriangle, { className: "h-6 w-6 text-amber-600" }),
        title: "Conseils pour les voyageurs internationaux",
        content: "Les voitures de location peuvent être facturées des frais administratifs pour les violations de péage. Envisagez une voiture de location avec un transpondeur ou demandez des forfaits péage. Gardez les reçus pour le suivi des dépenses. Certaines entreprises de location offrent des plans de péage prépayés."
      }
    ],
    estimatedCosts: {
      title: "Coûts de péage estimés",
      description: "Budgétez environ $20-50 pour les péages sur le voyage complet de la Route 66, selon votre itinéraire spécifique et le type de véhicule. Les coûts sont généralement plus élevés pour les véhicules plus grands et les camping-cars.",
      details: [
        "Chicago à St. Louis : $5-15",
        "Oklahoma Turnpikes : $10-25",
        "Péages de pont : $2-8 chacun",
        "Voies express (optionnel) : $1-5 par utilisation"
      ]
    }
  },
  nl: {
    title: "Tolwegen op Route 66",
    subtitle: "Wat u moet weten over tolwegen en betaalmethoden",
    sections: [
      {
        icon: React.createElement(Route, { className: "h-6 w-6 text-route66-red" }),
        title: "Tolwegen langs de route",
        content: "Hoewel de historische Route 66 zelf tolvrij was, kunnen moderne interstate highways die de route volgen tol heffen. Belangrijke tolwegen omvatten delen van I-44 in Oklahoma, I-55 bij Chicago, en enkele bruggen en tunnels."
      },
      {
        icon: React.createElement(CreditCard, { className: "h-6 w-6 text-route66-blue" }),
        title: "Betaalmethoden",
        content: "De meeste tolwegen accepteren contant geld, creditcards en elektronische transponders zoals E-ZPass, SunPass of staatsspecifieke tags. Veel nieuwere tolpoorten zijn contantloos en gebruiken nummerplaatherkenning voor facturering."
      },
      {
        icon: React.createElement(MapPin, { className: "h-6 w-6 text-route66-red" }),
        title: "Uitsplitsing per staat",
        content: "Illinois: Chicago Skyway en enkele bruggen. Missouri: Over het algemeen tolvrij. Oklahoma: Delen van I-44 Turner Turnpike. Texas, New Mexico, Arizona: Meestal tolvrij. Californië: Enkele bruggen en express lanes kunnen tol heffen."
      },
      {
        icon: React.createElement(AlertTriangle, { className: "h-6 w-6 text-amber-600" }),
        title: "Tips voor internationale reizigers",
        content: "Huurauto's kunnen administratieve kosten in rekening brengen voor tolovertredingen. Overweeg een huurauto met een transponder of vraag naar tolpakketten. Bewaar bonnetjes voor kostenbeheer. Sommige autoverhuurbedrijven bieden prepaid tolplannen aan."
      }
    ],
    estimatedCosts: {
      title: "Geschatte tolkosten",
      description: "Budgetteer ongeveer $20-50 voor tol op de complete Route 66-reis, afhankelijk van uw specifieke route en voertuigtype. Kosten zijn over het algemeen hoger voor grotere voertuigen en campers.",
      details: [
        "Chicago naar St. Louis: $5-15",
        "Oklahoma Turnpikes: $10-25",
        "Brugtol: $2-8 elk",
        "Express lanes (optioneel): $1-5 per gebruik"
      ]
    }
  }
};
