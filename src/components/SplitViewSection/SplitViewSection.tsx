
import React from 'react';

interface SplitViewSectionProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
  leftTitle?: string;
  rightTitle?: string;
  className?: string;
  sectionId?: string;
  leftBg?: string;
  rightBg?: string;
  reverseOnMobile?: boolean;
}

const SplitViewSection: React.FC<SplitViewSectionProps> = ({
  leftContent,
  rightContent,
  leftTitle,
  rightTitle,
  className = "",
  sectionId,
  leftBg = "bg-white",
  rightBg = "bg-gray-50",
  reverseOnMobile = false
}) => {
  return (
    <section id={sectionId} className={`min-h-screen ${className}`}>
      <div className={`flex h-full ${reverseOnMobile ? 'flex-col-reverse lg:flex-row' : 'flex-col lg:flex-row'}`}>
        {/* Left Side */}
        <div className={`w-full lg:w-1/2 ${leftBg} border-r border-route66-border`}>
          <div className="h-full overflow-y-auto">
            {leftTitle && (
              <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-route66-border p-6">
                <h2 className="text-2xl font-bold text-route66-primary">
                  {leftTitle}
                </h2>
              </div>
            )}
            <div className="p-6">
              {leftContent}
            </div>
          </div>
        </div>
        
        {/* Right Side */}
        <div className={`w-full lg:w-1/2 ${rightBg}`}>
          <div className="h-full overflow-y-auto">
            {rightTitle && (
              <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-route66-border p-6">
                <h2 className="text-2xl font-bold text-route66-primary">
                  {rightTitle}
                </h2>
              </div>
            )}
            <div className="p-6">
              {rightContent}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SplitViewSection;
