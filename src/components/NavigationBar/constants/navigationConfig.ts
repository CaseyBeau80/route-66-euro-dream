
import { MapPin, Calculator, Calendar, Clock, Lightbulb, HelpCircle, Route } from "lucide-react";

export const navigationItems = [
  {
    href: "#map",
    icon: MapPin,
    labelKey: "map"
  },
  {
    href: "/trip-calculator",
    icon: Calculator,
    labelKey: "tripCalculator"
  },
  {
    href: "/horizontal-journey",
    icon: Route,
    labelKey: "journey"
  },
  {
    href: "/countdown",
    icon: Calendar,
    labelKey: "countdown"
  },
  {
    href: "/timeline",
    icon: Clock,
    labelKey: "timeline"
  },
  {
    href: "/fun-facts",
    icon: Lightbulb,
    labelKey: "funFacts"
  },
  {
    href: "/trivia",
    icon: HelpCircle,
    labelKey: "trivia"
  }
];

export const navigationLabels = {
  en: {
    map: "Map",
    tripCalculator: "Trip Calculator",
    journey: "Journey",
    countdown: "Countdown",
    timeline: "Timeline",
    funFacts: "Fun Facts",
    trivia: "Trivia"
  },
  de: {
    map: "Karte",
    tripCalculator: "Reiseplaner",
    journey: "Reise",
    countdown: "Countdown",
    timeline: "Zeitleiste",
    funFacts: "Wissenswertes",
    trivia: "Quiz"
  },
  fr: {
    map: "Carte",
    tripCalculator: "Calculateur de voyage",
    journey: "Voyage",
    countdown: "Compte à rebours",
    timeline: "Chronologie",
    funFacts: "Le saviez-vous",
    trivia: "Trivia"
  },
  "pt-BR": {
    map: "Mapa",
    tripCalculator: "Calculadora de Viagem",
    journey: "Jornada",
    countdown: "Contagem Regressiva",
    timeline: "Linha do Tempo",
    funFacts: "Curiosidades",
    trivia: "Trivia"
  }
};
