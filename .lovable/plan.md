

## Plan: Improve `escapeXml` and add markdown stripping in RSS feed

### Changes to `supabase/functions/rss-feed/index.ts`

1. **Replace `escapeXml`** with the improved version that handles control characters, newlines, and includes a null guard.

2. **Add `stripMarkdown` helper** to remove `#`, `**`, `__`, `*`, `_`, `[text](url)` link syntax, and other markdown formatting before escaping.

3. **Apply `stripMarkdown` to `excerpt`** (and `title` for safety) before passing to `escapeXml`.

4. **Wrap the entire RSS generation** (from Supabase query through response) in a `try/catch` that returns a 500 with CORS headers on unexpected errors.

No other files affected.

