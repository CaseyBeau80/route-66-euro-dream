
import { ReactNode } from 'react';
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-route66-background">
      {/* Navigation Bar with modern styling */}
      <NavigationBar />
      
      {/* Main Content */}
      {children}
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
