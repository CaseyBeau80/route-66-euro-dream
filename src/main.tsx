import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Strip static SEO fallback tags from index.html so React Helmet's per-route
// tags are the only ones present after hydration. index.html keeps them for
// pre-JS crawlers; prerendered dist/blog/* pages have their own tags baked in.
const stripStaticSeoFallbacks = () => {
  try {
    const head = document.head;
    if (!head) return;

    // Remove the SOCIAL-META-START ... SOCIAL-META-END block
    const walker = document.createNodeIterator(head, NodeFilter.SHOW_COMMENT);
    let start: Comment | null = null;
    let end: Comment | null = null;
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const c = node as Comment;
      if (c.nodeValue?.includes('SOCIAL-META-START')) start = c;
      else if (c.nodeValue?.includes('SOCIAL-META-END')) end = c;
    }
    if (start && end) {
      let cur: Node | null = start.nextSibling;
      while (cur && cur !== end) {
        const next: Node | null = cur.nextSibling;
        head.removeChild(cur);
        cur = next;
      }
    }

    // Remove static description and robots so Helmet's per-route versions win
    head.querySelectorAll('meta[name="description"], meta[name="robots"]').forEach((el) => {
      el.parentNode?.removeChild(el);
    });
  } catch {
    /* no-op */
  }
};

stripStaticSeoFallbacks();

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  
  // Hide loading skeleton immediately when React starts
  const skeleton = document.getElementById('loading-skeleton');
  if (skeleton) {
    skeleton.style.display = 'none';
  }
  document.body.classList.add('react-loaded');
  
  // Render app directly for faster FCP
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}