
export class PDFStylesService {
  private static instance: PDFStylesService;

  static getInstance(): PDFStylesService {
    if (!PDFStylesService.instance) {
      PDFStylesService.instance = new PDFStylesService();
    }
    return PDFStylesService.instance;
  }

  generatePDFStyles(): string {
    return `
      @media print {
        .no-page-break {
          page-break-inside: avoid;
          break-inside: avoid;
        }
        
        .pdf-day-segment {
          margin-bottom: 20px;
        }
        
        .pdf-header, .pdf-footer {
          font-size: 12px;
        }
      }
    `;
  }

  injectPDFStyles(): void {
    const styleId = 'pdf-export-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = this.generatePDFStyles();
      document.head.appendChild(style);
    }
  }

  removePDFStyles(): void {
    const styleElement = document.getElementById('pdf-export-styles');
    if (styleElement) {
      styleElement.remove();
    }
  }
}
