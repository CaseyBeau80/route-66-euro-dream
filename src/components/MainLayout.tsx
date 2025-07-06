
import { ReactNode } from 'react';
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";
import RouteIndicator from "./RouteIndicator";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-route66-background">
      {/* Navigation Bar with modern styling */}
      <NavigationBar />
      
      {/* Route Indicator */}
      <div className="pt-20 pb-4 container mx-auto px-4">
        <RouteIndicator />
      </div>
      
      {/* Main Content */}
      {children}
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
