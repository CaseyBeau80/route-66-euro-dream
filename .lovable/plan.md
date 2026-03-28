

# Add Read Time + Date Meta Line — BlogPostContent.tsx

## Changes (single file)

### 1. Remove `Calendar` from imports (line 2)
Change:
```ts
import { Calendar, ArrowLeft, Play } from 'lucide-react';
```
To:
```ts
import { ArrowLeft, Play } from 'lucide-react';
```

### 2. Add `readTime` calculation after the existing `splitEventBlocks` useMemo (~line 143)
```ts
const readTime = useMemo(() => {
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}, [content]);
```

### 3. Replace the "Author and Date" block (lines 172–181)
Remove the existing block with `Calendar` icon, `AuthorBadge`, and date. Replace with:

```jsx
{/* Date and Read Time */}
<div className="flex items-center gap-3 text-route66-brown/50 text-sm mb-4">
  <span>{format(new Date(publishedAt), 'MMMM d, yyyy')}</span>
  <span>·</span>
  <span>🕐 {readTime} min read</span>
</div>

{/* Author */}
<div className="flex items-center gap-3 mb-4 pb-4 border-b border-route66-sand/50">
  <div className="flex items-center gap-3 bg-route66-primary/10 px-4 py-2 rounded-full border border-route66-primary/30">
    <AuthorBadge authorName={authorName} size="lg" />
  </div>
</div>
```

No other files touched.

