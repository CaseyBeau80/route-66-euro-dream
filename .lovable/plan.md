

## Fix: Mobile fullscreen map marker clicks

**Problem**: The fullscreen portal wrapper divs intercept pointer events, preventing clicks on Google Maps markers (attractions, hidden gems, drive-ins, native american sites).

**Confirmed**: The minimize button is inside `mapFrame` (line 44-50, inside lines 40-52), so it will inherit `pointer-events-auto` and remain clickable.

### Changes — single file

**File: `src/components/InteractiveMap/components/InteractiveMapDisplay.tsx`**

Three class changes:

1. **Line 41** — `mapFrame` div: add `pointer-events-auto`
```tsx
<div className={`relative h-full bg-route66-background border-2 border-route66-border overflow-hidden pointer-events-auto ${fullscreen ? 'rounded-none' : 'rounded-2xl shadow-2xl'}`}>
```

2. **Line 66** — portal outer wrapper: add `pointer-events-none`
```tsx
<div className="fixed inset-0 z-[2147483647] isolate bg-route66-background pointer-events-none">
```

3. **Line 67** — portal inner wrapper: add `pointer-events-none`
```tsx
<div className="h-full w-full pointer-events-none">
```

Click flow: wrapper divs pass clicks through → `mapFrame` div catches them → Google Maps markers and minimize button all work.

