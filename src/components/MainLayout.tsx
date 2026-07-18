
import { ReactNode } from 'react';
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";
import TripPlannerChatWidget from "./TripPlannerChatWidget";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-route66-background">
      {/* Skip-to-content link (WCAG 2.4.1) */}
      <a href="#main-content" className="skip-to-content">Skip to main content</a>

      {/* Navigation Bar with modern React Router styling */}
      <NavigationBar />

      {/* Main Content with proper spacing for fixed navigation */}
      <main id="main-content" tabIndex={-1} className="pt-20">
        {children}
      </main>

      {/* Footer with React Router Links */}
      <Footer />

      {/* Big Bo Ramble Chatbot */}
      <TripPlannerChatWidget />
    </div>
  );

};

export default MainLayout;
