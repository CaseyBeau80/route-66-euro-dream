interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export class SitemapGenerator {
  private baseUrl: string;
  private urls: SitemapUrl[] = [];

  constructor(baseUrl: string = 'https://ramble66.com') {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  addUrl(url: SitemapUrl): void {
    this.urls.push({
      ...url,
      loc: url.loc.startsWith('http') ? url.loc : `${this.baseUrl}${url.loc}`
    });
  }

  addStaticRoutes(): void {
    const staticRoutes: SitemapUrl[] = [
      {
        loc: '/',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: 1.0
      },
      {
        loc: '/contact',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        loc: '/about',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.8
      }
    ];

    staticRoutes.forEach(route => this.addUrl(route));
  }

  addTripRoutes(tripCodes: string[]): void {
    tripCodes.forEach(code => {
      this.addUrl({
        loc: `/trip/${code}`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: 0.7
      });
    });
  }

  generateXML(): string {
    const header = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    const footer = '</urlset>';
    
    const urlEntries = this.urls.map(url => {
      let entry = `  <url>\n    <loc>${url.loc}</loc>`;
      
      if (url.lastmod) {
        entry += `\n    <lastmod>${url.lastmod}</lastmod>`;
      }
      
      if (url.changefreq) {
        entry += `\n    <changefreq>${url.changefreq}</changefreq>`;
      }
      
      if (url.priority !== undefined) {
        entry += `\n    <priority>${url.priority}</priority>`;
      }
      
      entry += '\n  </url>';
      return entry;
    }).join('\n');

    return `${header}\n${urlEntries}\n${footer}`;
  }

  clear(): void {
    this.urls = [];
  }
}

// Utility function to generate and download sitemap
export const generateSitemapFile = (tripCodes: string[] = []): string => {
  const generator = new SitemapGenerator();
  generator.addStaticRoutes();
  generator.addTripRoutes(tripCodes);
  return generator.generateXML();
};
