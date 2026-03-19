import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { generateSitemapFile } from "@/utils/sitemapGenerator";
import { supabase } from "@/lib/supabase";

export default function SitemapXmlPage() {
  const [xml, setXml] = useState(() => generateSitemapFile());

  useEffect(() => {
    const fetchAllSlugs = async () => {
      const [attractions, hiddenGems, blogPosts, events, nativeSites] = await Promise.all([
        supabase.from('attractions').select('slug'),
        supabase.from('hidden_gems').select('slug'),
        supabase.from('blog_posts').select('slug').eq('is_published', true).lte('published_at', new Date().toISOString()),
        supabase.from('centennial_events').select('event_id'),
        supabase.from('native_american_sites').select('slug'),
      ]);

      setXml(generateSitemapFile({
        attractionSlugs: attractions.data?.map(r => r.slug) ?? [],
        hiddenGemSlugs: hiddenGems.data?.map(r => r.slug) ?? [],
        blogSlugs: blogPosts.data?.map(r => r.slug) ?? [],
        eventIds: events.data?.map(r => r.event_id) ?? [],
        nativeSiteSlugs: nativeSites.data?.map(r => r.slug) ?? [],
      }));
    };
    fetchAllSlugs();
  }, []);

  return (
    <>
      <Helmet>
        <title>sitemap.xml</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://ramble66.com/sitemap.xml" />
      </Helmet>
      <main>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{xml}</pre>
      </main>
    </>
  );
}
