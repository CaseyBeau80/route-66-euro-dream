import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { generateSitemapFile } from "@/utils/sitemapGenerator";
import { supabase } from "@/lib/supabase";

export default function SitemapXmlPage() {
  const [xml, setXml] = useState(() => generateSitemapFile());

  useEffect(() => {
    const fetchBlogSlugs = async () => {
      const { data } = await supabase
        .from('blog_posts')
        .select('slug')
        .eq('is_published', true)
        .lte('published_at', new Date().toISOString());

      const slugs = data?.map(p => p.slug) ?? [];
      setXml(generateSitemapFile([], slugs));
    };
    fetchBlogSlugs();
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
