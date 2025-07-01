
import { Home, MapPin, Camera } from "lucide-react";

export const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Trip Planner", href: "/trip-calculator", icon: MapPin },
  { name: "Photo Challenge", href: "/test-upload", icon: Camera },
];

export const languageOptions = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "pt-BR", name: "Português (Brasil)", flag: "🇧🇷" },
];
