
import React from 'react';

interface CompactLayoutSectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  sectionId?: string;
  background?: string;
}

const CompactLayoutSection: React.FC<CompactLayoutSectionProps> = ({
  children,
  title,
  subtitle,
  className = "",
  sectionId,
  background = "bg-white"
}) => {
  return (
    <section id={sectionId} className={`py-16 ${background} ${className}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-route66-primary mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-route66-text-secondary max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default CompactLayoutSection;
