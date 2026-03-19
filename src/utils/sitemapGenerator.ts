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
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  addUrl(url: SitemapUrl): void {
    this.urls.push({
      ...url,
      loc: url.loc.startsWith('http') ? url.loc : `${this.baseUrl}${url.loc}`
    });
  }

  addStaticRoutes(): void {
    const today = new Date().toISOString().split('T')[0];
    const staticRoutes: SitemapUrl[] = [
      { loc: '/', lastmod: today, changefreq: 'weekly', priority: 1.0 },
      { loc: '/blog', lastmod: today, changefreq: 'weekly', priority: 0.8 },
      { loc: '/attractions', lastmod: today, changefreq: 'weekly', priority: 0.9 },
      { loc: '/events', lastmod: today, changefreq: 'daily', priority: 0.8 },
      { loc: '/hidden-gems', lastmod: today, changefreq: 'weekly', priority: 0.8 },
      { loc: '/about', lastmod: today, changefreq: 'yearly', priority: 0.6 },
      { loc: '/contact', lastmod: today, changefreq: 'yearly', priority: 0.5 },
      // State pages
      { loc: '/illinois', lastmod: today, changefreq: 'weekly', priority: 0.9 },
      { loc: '/missouri', lastmod: today, changefreq: 'weekly', priority: 0.9 },
      { loc: '/kansas', lastmod: today, changefreq: 'weekly', priority: 0.9 },
      { loc: '/oklahoma', lastmod: today, changefreq: 'weekly', priority: 0.9 },
      { loc: '/texas', lastmod: today, changefreq: 'weekly', priority: 0.9 },
      { loc: '/new-mexico', lastmod: today, changefreq: 'weekly', priority: 0.9 },
      { loc: '/arizona', lastmod: today, changefreq: 'weekly', priority: 0.9 },
      { loc: '/california', lastmod: today, changefreq: 'weekly', priority: 0.9 },
    ];
    staticRoutes.forEach(route => this.addUrl(route));
  }

  addAttractionRoutes(slugs: string[]): void {
    const today = new Date().toISOString().split('T')[0];
    slugs.forEach(slug => {
      this.addUrl({ loc: `/attractions/${slug}`, lastmod: today, changefreq: 'weekly', priority: 0.7 });
    });
  }

  addHiddenGemRoutes(slugs: string[]): void {
    const today = new Date().toISOString().split('T')[0];
    slugs.forEach(slug => {
      this.addUrl({ loc: `/hidden-gems/${slug}`, lastmod: today, changefreq: 'weekly', priority: 0.7 });
    });
  }

  addBlogRoutes(slugs: string[]): void {
    const today = new Date().toISOString().split('T')[0];
    slugs.forEach(slug => {
      this.addUrl({ loc: `/blog/${slug}`, lastmod: today, changefreq: 'weekly', priority: 0.7 });
    });
  }

  addEventRoutes(eventIds: string[]): void {
    const today = new Date().toISOString().split('T')[0];
    eventIds.forEach(id => {
      this.addUrl({ loc: `/events/${id}`, lastmod: today, changefreq: 'weekly', priority: 0.7 });
    });
  }

  addNativeSiteRoutes(slugs: string[]): void {
    const today = new Date().toISOString().split('T')[0];
    slugs.forEach(slug => {
      this.addUrl({ loc: `/native-sites/${slug}`, lastmod: today, changefreq: 'weekly', priority: 0.7 });
    });
  }

  addTripRoutes(tripCodes: string[]): void {
    const today = new Date().toISOString().split('T')[0];
    tripCodes.forEach(code => {
      this.addUrl({ loc: `/trip/${code}`, lastmod: today, changefreq: 'monthly', priority: 0.7 });
    });
  }

  generateXML(): string {
    const header = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    const footer = '</urlset>';

    const urlEntries = this.urls.map(url => {
      let entry = `  <url>\n    <loc>${url.loc}</loc>`;
      if (url.lastmod) entry += `\n    <lastmod>${url.lastmod}</lastmod>`;
      if (url.changefreq) entry += `\n    <changefreq>${url.changefreq}</changefreq>`;
      if (url.priority !== undefined) entry += `\n    <priority>${url.priority}</priority>`;
      entry += '\n  </url>';
      return entry;
    }).join('\n');

    return `${header}\n${urlEntries}\n${footer}`;
  }

  clear(): void {
    this.urls = [];
  }
}

export interface SitemapData {
  attractionSlugs?: string[];
  hiddenGemSlugs?: string[];
  blogSlugs?: string[];
  eventIds?: string[];
  nativeSiteSlugs?: string[];
  tripCodes?: string[];
}

export const generateSitemapFile = (data: SitemapData = {}): string => {
  const generator = new SitemapGenerator();
  generator.addStaticRoutes();
  if (data.attractionSlugs?.length) generator.addAttractionRoutes(data.attractionSlugs);
  if (data.hiddenGemSlugs?.length) generator.addHiddenGemRoutes(data.hiddenGemSlugs);
  if (data.blogSlugs?.length) generator.addBlogRoutes(data.blogSlugs);
  if (data.eventIds?.length) generator.addEventRoutes(data.eventIds);
  if (data.nativeSiteSlugs?.length) generator.addNativeSiteRoutes(data.nativeSiteSlugs);
  if (data.tripCodes?.length) generator.addTripRoutes(data.tripCodes);
  return generator.generateXML();
};
