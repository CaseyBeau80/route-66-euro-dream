import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { generateSitemapFile } from "@/utils/sitemapGenerator";
import { supabase } from "@/lib/supabase";

export default function SitemapXmlPage() {
  const [xml, setXml] = useState(() => generateSitemapFile());

  useEffect(() => {
    const fetchAllSlugs = async () => {
      const [attractions, hiddenGems, blogPosts] = await Promise.all([
        supabase.from('attractions').select('slug'),
        supabase.from('hidden_gems').select('slug'),
        supabase.from('blog_posts').select('slug').eq('is_published', true).lte('published_at', new Date().toISOString()),
      ]);

      setXml(generateSitemapFile({
        attractionSlugs: attractions.data?.map((r: any) => r.slug) ?? [],
        hiddenGemSlugs: hiddenGems.data?.map((r: any) => r.slug) ?? [],
        blogSlugs: blogPosts.data?.map((r: any) => r.slug) ?? [],
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
