# Download reduction
- [x] Replace storage logo/header references with supplied local WebP files and favicon.
- [x] Optimize remote images and social previews with responsive sizing and original-image fallback.
- [x] Narrow public list queries, fix drive-in detail lookup, and remove data-hook debug logs.
- [x] Share public-read caching and defer homepage data until sections approach the viewport.
- [x] Run focused tests and verify home, Explore, detail, Events, and Blog with images.

Verification: 12 new tests passed; desktop/mobile pages and repeat-list caching verified. Existing planner smoke file is not a Vitest suite and its Los Angeles fixture has no matching live city. Existing ItineraryCard suite: 18 passed, one stale “Coming Soon” assertion failed; application behavior left unchanged.

# App-only security hardening
- [x] Switch trip save/load/view operations and blog detail to existing RPCs; audit other reads.
- [x] Remove missing community photo query, retaining attraction fallback.
- [x] Add regression tests, run existing tests, and verify blog, shared planner trip, and homepage photos.

Verification: build OK; 47 tests passed, one existing ItineraryCard “Coming Soon” assertion failed (unchanged). Live blog list/detail and four homepage photos rendered. Created a Chicago-to-St. Louis trip (insert 201 without row return), opened its share link, and confirmed share/view RPC calls with no direct trip GETs or browser exceptions.