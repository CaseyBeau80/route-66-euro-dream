
export interface PDFTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  headerBg: string;
  tabActiveColor: string;
  badgeColors: {
    primary: { bg: string; text: string };
    secondary: { bg: string; text: string };
  };
}

export class PDFThemingService {
  private static instance: PDFThemingService;

  static getInstance(): PDFThemingService {
    if (!PDFThemingService.instance) {
      PDFThemingService.instance = new PDFThemingService();
    }
    return PDFThemingService.instance;
  }

  getRoute66Theme(): PDFTheme {
    return {
      primaryColor: '#3b82f6', // Blue theme to match app
      secondaryColor: '#6b7280',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      borderColor: '#e5e7eb',
      headerBg: '#eff6ff',
      tabActiveColor: '#1d4ed8',
      badgeColors: {
        primary: { bg: '#dbeafe', text: '#1d4ed8' },
        secondary: { bg: '#f3f4f6', text: '#4b5563' }
      }
    };
  }

  applyThemeToPDF(theme: PDFTheme): void {
    const themeStyles = `
      :root {
        --pdf-primary: ${theme.primaryColor};
        --pdf-secondary: ${theme.secondaryColor};
        --pdf-bg: ${theme.backgroundColor};
        --pdf-text: ${theme.textColor};
        --pdf-border: ${theme.borderColor};
        --pdf-header-bg: ${theme.headerBg};
        --pdf-tab-active: ${theme.tabActiveColor};
        --pdf-badge-primary-bg: ${theme.badgeColors.primary.bg};
        --pdf-badge-primary-text: ${theme.badgeColors.primary.text};
      }

      @media print {
        .pdf-tab-header.active {
          background-color: var(--pdf-header-bg) !important;
          color: var(--pdf-tab-active) !important;
          border-top-color: var(--pdf-primary) !important;
        }

        .pdf-day-badge {
          background-color: var(--pdf-badge-primary-bg) !important;
          color: var(--pdf-badge-primary-text) !important;
        }

        .pdf-section-header {
          color: var(--pdf-tab-active) !important;
        }

        .pdf-weather-card {
          background-color: var(--pdf-header-bg) !important;
          border-color: var(--pdf-primary) !important;
        }
      }
    `;

    const themeStyleElement = document.createElement('style');
    themeStyleElement.id = 'pdf-theme-styles';
    themeStyleElement.textContent = themeStyles;
    document.head.appendChild(themeStyleElement);
  }

  removeThemeStyles(): void {
    const themeElement = document.getElementById('pdf-theme-styles');
    if (themeElement) {
      themeElement.remove();
    }
  }
}
