
## Plan: Split error vs. not-found branches in `EventDetailPage.tsx`

### Change to `src/pages/EventDetailPage.tsx`

Replace the current combined fallback:

```tsx
if (error || !event) {
  return <NotFound />;
}
```

With two distinct branches:

1. **Transient error branch** (`if (error)`): Render an inline "Event temporarily unavailable" UI wrapped in `MainLayout` (to keep header/footer consistent), with its own `<Helmet>` containing:
   - `<meta name="robots" content="index, follow" />`
   - A title like `"Event Temporarily Unavailable – Ramble 66"`
   - No canonical override (let the page URL stand)
   
   Body: brief message ("We're having trouble loading this event right now. Please try again in a moment.") plus a link back to `/events`.

2. **Genuine not-found branch** (`if (!event)`): Keep `return <NotFound />;` exactly as-is so legitimate missing slugs continue to emit `noindex, nofollow`.

### Why

- Transient Supabase errors (network blips, RLS hiccups) on valid event URLs will no longer ship `noindex` to Googlebot — fixing the 69 affected event pages in Search Console.
- Genuine 404s for nonexistent slugs still correctly emit `noindex` via the existing `NotFound` component.

### Scope

Single file: `src/pages/EventDetailPage.tsx`. No routing, styling system, or other component changes.
