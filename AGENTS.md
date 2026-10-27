# Public delivery
- Public editorial GETs from the external client share the app QueryClient and a versioned, bounded localStorage cache; never cache writes or private/auth data, because caching must not change security or mutation semantics.
- Keep full-row reads on single-record detail routes only; public list fields must be verified against the external schema to avoid nonexistent-column failures.
- Route public remote photos through the shared image URL helper and wrapper-free OptimizedImg, retaining existing placeholders after a one-time original URL fallback to preserve layout and recovery.
- Keep homepage data consumer-driven and viewport deferred; never globally preload all content tables, because visitors should download only sections they approach.
- Drive-in detail slugs resolve against a cached id/name index and load by id, because that table has no slug column.