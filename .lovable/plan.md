

# Add Author Card to BlogPostContent.tsx

Insert the provided author card JSX after the "Big Bo Author Note" `</div>` (currently around line 209), inside the `max-w-[680px]` wrapper.

**File:** `src/components/Blog/BlogPostContent.tsx`

**Location:** After the closing `</div>` of the "Big Bo Ramble here" author note block, before the wrapper's closing `</div>`.

**Insert:**
```jsx
{/* Author Card */}
<div className="mt-8 flex items-start gap-4 border-l-4 border-route66-rust bg-route66-cream/40 p-5 rounded-r-sm">
  <img
    src="/lovable-uploads/56c17d61-50a4-49c7-a00f-e49e4806a4b3.png"
    alt="Big Bo Ramble"
    className="h-16 w-16 rounded-full border-2 border-route66-rust/40 object-cover shrink-0"
  />
  <div>
    <span className="font-playfair font-bold text-lg text-route66-brown">Big Bo Ramble</span>
    <p className="mt-1 font-lora text-[15px] leading-relaxed text-route66-brown/70 italic">
      Born with road dust in his boots and a Route 66 atlas on the dash. Big Bo's been chasing neon signs and small-town diners since before GPS ruined the adventure.
    </p>
  </div>
</div>
```

No other files touched.

