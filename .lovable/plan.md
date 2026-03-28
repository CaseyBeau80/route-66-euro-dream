

# Hero Section Polish

Five targeted improvements to `src/components/Hero/HeroSection.tsx`:

## Changes

1. **Countdown badge** — Change `bg-black/50` to `bg-[#3D2B1F]` (opaque dark brown), bump text to `text-base`, increase padding to `px-5 py-2`. Change "Celebrations underway!" text and dot to `text-amber-400` / `bg-amber-400` for brighter gold.

2. **"Start Exploring" button** — Replace with `bg-[#C0392B] text-white rounded-full px-8 py-3 hover:scale-105 transition-transform`. Remove `ArrowDown` icon, add `ArrowRight` (→) icon instead. Drop the offset box-shadow and border styling.

3. **Subtitle** — Bump to `text-xl lg:text-2xl xl:text-3xl`, add `tracking-wide`, keep color as `text-[#E8C27A]` (warm gold).

4. **Gradient overlay** — Replace the existing `bg-gradient-to-b` div with `bg-gradient-to-t from-black/60 via-black/20 to-transparent` to darken from the bottom up, keeping the sky visible.

5. **Title text** — Change from `RAMBLE 66` (all-caps) to `Ramble 66` in mixed case. Switch font class to Playfair Display (`font-serif` or a custom class). Remove `uppercase` and `tracking-wider`, use `tracking-wide` instead.

## Technical

- Single file edit: `src/components/Hero/HeroSection.tsx`
- Swap `ArrowDown` import to `ArrowRight` from lucide-react
- All other components unchanged

