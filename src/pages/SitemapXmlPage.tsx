import React from "react";
import { Helmet } from "react-helmet-async";
import { generateSitemapFile } from "@/utils/sitemapGenerator";

const xml = generateSitemapFile();

export default function SitemapXmlPage() {
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
