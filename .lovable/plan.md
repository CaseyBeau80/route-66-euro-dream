

## Plan: Create `rss-feed` Edge Function

### Changes

**1. New file: `supabase/functions/rss-feed/index.ts`**
- Create with the exact function code provided — queries `blog_posts`, generates RSS 2.0 XML feed.

**2. Update `supabase/config.toml`**
- Add `[functions.rss-feed]` block with `verify_jwt = false` so the feed is publicly accessible without authentication.

No database changes required.

