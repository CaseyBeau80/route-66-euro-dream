

## Plan: Add "Big Bo Ramble" AI Chatbot to Homepage

### Overview
Convert the uploaded TripPlannerWidget into a floating chatbot on the homepage. The AI calls will be routed through a backend function using Lovable AI (no Anthropic API key needed). The chatbot will pull context from your existing database tables (attractions, hidden gems, events) to ground its answers.

**You don't need to provide any API keys.** Lovable AI handles the AI model calls automatically.

### Architecture

```text
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────┐
│  Floating Chat   │────▶│  Edge Function        │────▶│  Lovable AI │
│  Widget (React)  │◀────│  trip-planner-chat    │◀────│  (Gemini)   │
│                  │     │  - Fetches context    │     └─────────────┘
│  Bottom-right    │     │    from both Supabase │
│  toggle button   │     │    projects           │
└─────────────────┘     └──────────────────────┘
```

### Steps

1. **Create `trip-planner-chat` edge function**
   - Receives user message + conversation history
   - Queries attractions, hidden_gems, centennial_events for RAG context (using the existing external Supabase project credentials for attractions/gems, Lovable Cloud for events)
   - Calls Lovable AI (google/gemini-2.5-flash) with the Big Bo Ramble system prompt + context
   - Returns the AI response

2. **Create `TripPlannerChatWidget` React component**
   - Adapted from the uploaded widget, converted to TypeScript
   - Floating button (bottom-right) with expand/collapse chat panel
   - Quick suggestion chips, typing indicator, auto-scroll
   - Styled to match the Route 66 vintage theme from the uploaded design
   - Calls the edge function instead of Anthropic directly

3. **Add widget to homepage**
   - Import and render `TripPlannerChatWidget` in `Index.tsx` (outside the deferred sections, always available)

### Technical Details

- **AI Model**: `google/gemini-2.5-flash` via Lovable AI gateway — no API key required
- **CORS**: Updated shared CORS headers to include all required Supabase client headers
- **Data sources**: Edge function fetches from the external Supabase project (attractions, hidden_gems) and Lovable Cloud (centennial_events) using existing credentials
- **Security**: AI call happens server-side only; no keys exposed to the client
- **No database changes needed** — uses existing tables

