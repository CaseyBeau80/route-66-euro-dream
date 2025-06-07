
import { Globe } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { languageOptions } from "../constants/navigationConfig";

type LanguageSelectorProps = {
  language: string;
  setLanguage: (lang: "en" | "de" | "fr" | "nl") => void;
};

const LanguageSelector = ({ language, setLanguage }: LanguageSelectorProps) => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center space-x-2 bg-route66-background-alt hover:bg-route66-primary hover:text-white border border-route66-border transition-all duration-300">
            <Globe size={16} />
            <span>{languageOptions.find(l => l.code === language)?.flag}</span>
            <span className="hidden sm:inline">{languageOptions.find(l => l.code === language)?.name}</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="p-2 w-48">
              {languageOptions.map((option) => (
                <NavigationMenuLink
                  key={option.code}
                  className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md text-sm cursor-pointer transition-all duration-200 hover:bg-route66-primary/10 ${
                    language === option.code ? 'bg-route66-primary text-white font-medium' : 'text-route66-text-secondary'
                  }`}
                  onClick={() => setLanguage(option.code as "en" | "de" | "fr" | "nl")}
                >
                  <span className="text-lg">{option.flag}</span>
                  <span>{option.name}</span>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default LanguageSelector;
