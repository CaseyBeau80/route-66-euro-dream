
import { ReactNode } from 'react';
import NavigationBar from "./NavigationBar";

interface MainLayoutProps {
  children: ReactNode;
  language: "en" | "de" | "fr" | "nl";
  setLanguage: (language: "en" | "de" | "fr" | "nl") => void;
}

const MainLayout = ({ children, language, setLanguage }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-route66-background">
      {/* Navigation Bar with modern styling */}
      <NavigationBar language={language} setLanguage={setLanguage} />
      
      {/* Main Content */}
      {children}
    </div>
  );
};

export default MainLayout;
