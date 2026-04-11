

## Plan: Deploy Trust Fixes (Terms page, security.txt, headers)

Three changes I can implement in Lovable, plus notes on the two external items.

---

### 1. Create Terms of Service page (`/terms`)

**New file: `src/pages/TermsOfServicePage.tsx`**
- Clone the exact layout/structure from `PrivacyPolicyPage.tsx` (MainLayout, SocialMetaTags, red hero banner, prose content section)
- Render the Terms of Service content as proper HTML sections matching the Privacy page styling

**Edit: `src/App.tsx`**
- Add lazy-loaded route for `/terms` → `TermsOfServicePage`

**Edit: `src/components/Footer.tsx`**
- Add "Terms of Service" link next to the existing "Privacy Policy" link in the bottom bar

**Edit: `src/utils/sitemapGenerator.ts`** (if it exists)
- Add `/terms` to the static routes list

---

### 2. Create `security.txt`

**New file: `public/.well-known/security.txt`**
- Plain text file with Contact, Expires (2027-04-11), Preferred-Languages, Canonical, and Policy fields per RFC 9116

---

### 3. Add `_headers` file

**New file: `public/_headers`**
- `X-Frame-Options: SAMEORIGIN`
- `Permissions-Policy` restricting camera, microphone, etc.
- `Content-Security-Policy-Report-Only` (report-only mode — won't break anything)
- Content-Type override for `/.well-known/security.txt`
- Does NOT touch existing HSTS, X-Content-Type-Options, or Referrer-Policy

**Note:** Lovable deploys to its own infrastructure. The `_headers` file works on Netlify/Cloudflare Pages but may not be respected by Lovable's hosting. If headers don't take effect after deploy, this would need to be handled via Cloudflare dashboard or a different mechanism. I'll create the file regardless — it's zero-risk and will work if/when the hosting supports it.

---

### 4 & 5. External items (not Lovable changes)

- **SSL/TLS upgrade (B → A):** Set Minimum TLS Version to 1.2 in Cloudflare dashboard → SSL/TLS → Edge Certificates. No code change needed.
- **Google Search Console / Bing:** Verify domain ownership via DNS TXT record, then submit sitemap. No code change needed.

I'll note these in the response after implementation so you have the checklist handy.

---

### Files touched
- `src/pages/TermsOfServicePage.tsx` — new
- `src/App.tsx` — add route
- `src/components/Footer.tsx` — add link
- `public/.well-known/security.txt` — new
- `public/_headers` — new

### Content needed
The user's message references `terms-of-service.md` but didn't paste the contents. I'll need to ask for it, or draft standard Terms of Service content matching the site's context.

