import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const escapeXml = (str: string): string => {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '')
    .replace(/\r\n|\r|\n/g, ' ')
    .trim()
}

const stripMarkdown = (str: string): string => {
  if (!str) return ''
  return str
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')  // [text](url) → text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')  // ![alt](url) → alt
    .replace(/#{1,6}\s?/g, '')                  // # headings
    .replace(/(\*\*|__)(.*?)\1/g, '$2')         // **bold** / __bold__
    .replace(/(\*|_)(.*?)\1/g, '$2')            // *italic* / _italic_
    .replace(/~~(.*?)~~/g, '$1')                // ~~strikethrough~~
    .replace(/`{1,3}[^`]*`{1,3}/g, '')         // inline code / code blocks
    .replace(/^[-*+]\s/gm, '')                  // unordered list markers
    .replace(/^\d+\.\s/gm, '')                  // ordered list markers
    .replace(/^>\s?/gm, '')                     // blockquotes
    .replace(/---/g, '')                        // horizontal rules
    .replace(/\s{2,}/g, ' ')                    // collapse whitespace
    .trim()
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      'https://xbwaphzntaxmdfzfsmvt.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhid2FwaHpudGF4bWRmemZzbXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NjUzMzYsImV4cCI6MjA2NDE0MTMzNn0.51l87ERSx19vVQytYAEgt5HKMjLhC86_tdF_2HxrPjo'
    )

    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('title, slug, excerpt, author_name, published_at, tags, featured_image_url')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('RSS feed error:', JSON.stringify(error))
      return new Response(`Error fetching posts: ${JSON.stringify(error)}`, {
        status: 500,
        headers: corsHeaders,
      })
    }

    const items = posts.map(post => {
      const url = `https://ramble66.com/blog/${post.slug}`
      const pubDate = new Date(post.published_at).toUTCString()
      const description = escapeXml(stripMarkdown(post.excerpt || ''))
      const title = escapeXml(stripMarkdown(post.title || ''))
      const imageTag = post.featured_image_url
        ? `<enclosure url="${escapeXml(post.featured_image_url)}" type="image/jpeg" length="0"/>`
        : ''

      return `
    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      <author>hello@ramble66.com (${escapeXml(stripMarkdown(post.author_name || 'Big Bo Ramble'))})</author>
      ${imageTag}
    </item>`
    }).join('')

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ramble 66 — Route 66 Road Guide</title>
    <link>https://ramble66.com</link>
    <description>Route 66 road trip guides, centennial events, hidden gems, and Big Bo's weekly Mother Road dispatch.</description>
    <language>en-us</language>
    <atom:link href="https://xbwaphzntaxmdfzfsmvt.supabase.co/functions/v1/rss-feed" rel="self" type="application/rss+xml"/>
    <image>
      <url>https://ramble66.com/icons/ramble66-icon.png</url>
      <title>Ramble 66</title>
      <link>https://ramble66.com</link>
    </image>
    ${items}
  </channel>
</rss>`

    return new Response(rss, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (err) {
    console.error('RSS feed unexpected error:', err)
    return new Response('Internal server error', {
      status: 500,
      headers: corsHeaders,
    })
  }
})
