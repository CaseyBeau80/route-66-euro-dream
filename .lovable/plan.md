

## Plan: Stack Event Fields Vertically

**File:** `src/components/Blog/BlogPostContent.tsx`

### Change (lines 179–186)

Replace the field block container and row layout:

**From:**
```tsx
<div className="mb-4 divide-y divide-route66-sand/30">
  {eventFields.fields.map((field, i) => (
    <div key={i} className="flex gap-3 py-2">
      <span className="text-route66-rust text-sm font-bold w-24 shrink-0">{field.label}</span>
      <span className="text-route66-brown text-sm flex-1">{field.value}</span>
    </div>
  ))}
</div>
```

**To:**
```tsx
<div className="mb-4 flex flex-col gap-2">
  {eventFields.fields.map((field, i) => (
    <div key={i} className="flex items-start gap-2">
      <span className="text-route66-rust text-sm font-bold shrink-0 w-28">{field.label}</span>
      <span className="text-route66-brown text-sm flex-1">{field.value}</span>
    </div>
  ))}
</div>
```

**Summary of differences:**
- Container: `divide-y divide-route66-sand/30` → `flex flex-col gap-2` (removes border separators, adds vertical stacking)
- Row: `flex gap-3 py-2` → `flex items-start gap-2` (aligns top, tighter gap, no padding)
- Label: `w-24` → `w-28` (slightly wider label column)

One file, 8 lines changed.

