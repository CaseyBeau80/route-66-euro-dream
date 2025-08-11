import React from "react";
import { Helmet } from "react-helmet-async";

const robotsContent = `User-agent: *\nAllow: /\nSitemap: https://ramble66.com/sitemap.xml\n`;

export default function RobotsTxtPage() {
  return (
    <>
      <Helmet>
        <title>robots.txt</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://ramble66.com/robots.txt" />
      </Helmet>
      <main>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{robotsContent}</pre>
      </main>
    </>
  );
}
