

## Plan: Fix static SEO tags in `index.html`

### Changes to `index.html` (lines 107–112)

1. **Remove** the static `<link rel="canonical" href="https://ramble66.com" />` on line 110 — it overrides React Helmet's per-route canonicals, pointing every page to the homepage.

2. **Add** `<meta name="robots" content="index, follow" />` as the default fallback, so crawlers that render before JS executes see an indexable directive.

The updated block (lines 107–112) becomes:
```html
<!-- Static fallback SEO for crawlers before JS executes; React Helmet overrides per-route -->
<title>Ramble 66 — Route 66 Interactive Map & Trip Planner</title>
<meta name="description" content="Plan your ultimate Route 66 road trip with Ramble 66: Interactive Route 66 Google Map, Shareable Travel Planner, Route 66 Events Calendar, and Route 66 Blog & News." />
<meta name="robots" content="index, follow" />
<!-- Theme color only - all other meta tags handled by React Helmet -->
<meta name="theme-color" content="#1B60A3">
```

No other files affected.

