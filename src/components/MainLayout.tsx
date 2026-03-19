
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
      {/* Navigation Bar with modern React Router styling */}
      <NavigationBar />
      
      {/* Main Content with proper spacing for fixed navigation */}
      <div className="pt-20">
        {children}
      </div>
      
      {/* Footer with React Router Links */}
      <Footer />

      {/* Big Bo Ramble Chatbot */}
      <TripPlannerChatWidget />
    </div>
  );
};

export default MainLayout;
