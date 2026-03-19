

## Build-Time Dynamic Sitemap Generation

### What This Does
Replaces the current sitemap approach with a build-time script that connects to the external Supabase project and generates a complete `sitemap.xml` with all static and dynamic routes from 5 tables.

### Technical Plan

#### 1. Rewrite `src/utils/sitemapGenerator.ts`
- Update static routes to match the requested list (/, /blog, /attractions, /events