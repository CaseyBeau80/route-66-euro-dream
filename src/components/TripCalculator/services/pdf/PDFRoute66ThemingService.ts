
export class PDFRoute66ThemingService {
  /**
   * Route 66 Color Palette for PDF Export
   */
  static colors = {
    // Primary Route 66 Colors
    primary: '#C41E3A',           // Route 66 Red
    primaryLight: '#E53935',      // Lighter Red
    primaryDark: '#B71C1C',       // Darker Red
    
    // Vintage Colors
    vintageRed: '#C41E3A',        // Classic Route 66 Red
    vintageBrown: '#8B4513',      // Saddle Brown
    vintageBeige: '#F5F5DC',      // Beige
    vintageYellow: '#FFD700',     // Gold
    
    // Background Colors
    cream: '#FFF8DC',             // Cornsilk
    tan: '#D2B48C',               // Tan
    
    // Text Colors
    navy: '#2C3E50',              // Dark Blue
    textSecondary: '#6B7280',     // Gray-500
    
    // Border Colors
    border: '#D1D5DB',            // Gray-300
    borderDark: '#9CA3AF'         // Gray-400
  };

  /**
   * Typography styles for PDF
   */
  static typography = {
    fontFamilies: {
      route66: 'font-route66',     // Custom Route 66 font
      travel: 'font-travel',       // Travel/adventure font
      body: 'font-sans'            // Default body font
    },
    
    sizes: {
      title: 'text-3xl',
      subtitle: 'text-xl',
      heading: 'text-lg',
      body: 'text-sm',
      caption: 'text-xs'
    }
  };

  /**
   * Layout spacing and sizing
   */
  static layout = {
    spacing: {
      page: 'p-8',
      section: 'mb-6',
      card: 'p-4',
      compact: 'p-2'
    },
    
    borders: {
      thick: 'border-4',
      medium: 'border-2',
      thin: 'border'
    },
    
    radius: {
      large: 'rounded-lg',
      medium: 'rounded',
      small: 'rounded-sm',
      full: 'rounded-full'
    }
  };

  /**
   * Component-specific styling
   */
  static components = {
    header: {
      background: 'bg-gradient-to-r from-route66-cream via-route66-vintage-beige to-route66-cream',
      border: 'border-4 border-route66-vintage-brown',
      title: 'text-4xl font-bold text-route66-vintage-red font-route66',
      subtitle: 'text-xl text-route66-vintage-brown font-travel italic'
    },
    
    dayCard: {
      background: 'bg-white',
      border: 'border-2 border-route66-border',
      header: 'bg-gradient-to-r from-route66-primary to-route66-primary-light text-white',
      title: 'text-lg font-bold font-route66'
    },
    
    weatherCard: {
      background: 'bg-route66-vintage-beige',
      border: 'border border-route66-tan',
      text: 'text-route66-navy'
    },
    
    stopsCard: {
      background: 'bg-route66-cream',
      border: 'border border-route66-border',
      item: 'bg-white border border-route66-tan rounded p-2'
    }
  };

  /**
   * Get CSS classes for a specific component
   */
  static getComponentClasses(component: keyof typeof PDFRoute66ThemingService.components, element?: string): string {
    const componentStyles = this.components[component];
    if (element && componentStyles[element as keyof typeof componentStyles]) {
      return componentStyles[element as keyof typeof componentStyles] as string;
    }
    return Object.values(componentStyles).join(' ');
  }

  /**
   * Generate print-specific CSS styles
   */
  static generatePrintStyles(): string {
    return `
      @media print {
        .pdf-container {
          color-adjust: exact !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        .route66-gradient {
          background: linear-gradient(135deg, ${this.colors.vintageBeige} 0%, ${this.colors.cream} 50%, ${this.colors.vintageYellow} 100%) !important;
        }
        
        .route66-primary-bg {
          background-color: ${this.colors.primary} !important;
        }
        
        .route66-vintage-bg {
          background-color: ${this.colors.vintageBeige} !important;
        }
        
        .route66-border {
          border-color: ${this.colors.border} !important;
        }
        
        .route66-text-primary {
          color: ${this.colors.primary} !important;
        }
        
        .route66-text-navy {
          color: ${this.colors.navy} !important;
        }
        
        .no-page-break {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        .page-break-before {
          page-break-before: always !important;
          break-before: page !important;
        }
      }
    `;
  }
}
