import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const EXTERNAL_SUPABASE_URL = "https://xbwaphzntaxmdfzfsmvt.supabase.co";
const EXTERNAL_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhid2FwaHpudGF4bWRmemZzbXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1NjUzMzYsImV4cCI6MjA2NDE0MTMzNn0.51l87ERSx19vVQytYAEgt5HKMjLhC86_tdF_2HxrPjo";

const STATE_MAP: Record<string, string> = {
  illinois: "IL", missouri: "MO", kansas: "KS", oklahoma: "OK",
  texas: "TX", "new mexico": "NM", arizona: "AZ", california: "CA",
};

const SYSTEM_PROMPT = `You are Big Bo Ramble — the enthusiastic, knowledgeable guide for ramble66.com, a Route 66 trip planning website.

VOICE: Warm, road-trip-lover's energy. First person. Conversational, a little irreverent. Like a trusted friend who's driven Route 66 a dozen times. Not a press release.

STYLE RULES:
- Bold place names using **name** syntax
- Keep responses under 250 words unless a full itinerary is requested
- Use short paragraphs or brief lists for stop recommendations
- Note urgency when relevant ("this Saturday!", "coming up fast")
- End with a follow-up nudge to keep the conversation going
- Never make up fake places — if data isn't available, say so honestly

ROUTE 66 FACTS (weave in naturally when relevant):
- Route 66 runs 2,448 miles from Chicago, IL to Santa Monica, CA
- Passes through 8 states: IL, MO, KS, OK, TX, NM, AZ, CA
- Known as "The Mother Road" (Steinbeck's Grapes of Wrath)
- The Route 66 Centennial is November 11, 2026 — celebrations all year
- Officially decommissioned in 1985 but lives on as a historic highway`;

function detectState(text: string): string | null {
  const lower = text.toLowerCase();
  for (const [name, abbr] of Object.entries(STATE_MAP)) {
    if (lower.includes(name) || lower.includes(abbr.toLowerCase())) return abbr;
  }
  return null;
}

async function buildContext(userMessage: string): Promise<string> {
  const extClient = createClient(EXTERNAL_SUPABASE_URL, EXTERNAL_SUPABASE_ANON_KEY);
  const cloudClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );

  const state = detectState(userMessage);
  const lower = userMessage.toLowerCase();
  const isEventQuery = ["event", "festival", "upcoming", "car show", "happening", "schedule", "centennial", "celebration"].some(w => lower.includes(w));
  const sections: string[] = [];

  // Attractions from external DB
  try {
    let query = extClient
      .from("attractions")
      .select("name,city_name,state,category,description,tags,featured")
      .order("featured", { ascending: false })
      .limit(6);
    if (state) query = query.eq("state", state);
    const { data } = await query;
    if (data?.length) {
      sections.push(
        "ATTRACTIONS FROM DATABASE:\n" +
        data.map((r: any) => `- **${r.name}** (${r.city_name}, ${r.state}) [${r.category}]: ${r.description?.slice(0, 120)}...`).join("\n")
      );
    }
  } catch (_) { /* skip */ }

  // Hidden gems from external DB
  try {
    let query = extClient
      .from("hidden_gems")
      .select("title,city_name,state,category,description,featured")
      .order("featured", { ascending: false })
      .limit(5);
    if (state) query = query.eq("state", state);
    const { data } = await query;
    if (data?.length) {
      sections.push(
        "HIDDEN GEMS FROM DATABASE:\n" +
        data.map((r: any) => `- **${r.title}** (${r.city_name}): ${r.description?.slice(0, 120)}...`).join("\n")
      );
    }
  } catch (_) { /* skip */ }

  // Events from Lovable Cloud
  if (isEventQuery) {
    try {
      const today = new Date().toISOString().slice(0, 10);
      let query = cloudClient
        .from("centennial_events")
        .select("title,date_display,location,state,description,category,official_url")
        .gte("date_start", today)
        .order("date_start", { ascending: true })
        .limit(6);
      if (state) query = query.eq("state", state);
      const { data } = await query;
      if (data?.length) {
        sections.push(
          "UPCOMING EVENTS FROM DATABASE:\n" +
          data.map((r: any) => `- **${r.title}** | ${r.date_display} | ${r.location}, ${r.state} [${r.category}]${r.official_url ? ` → ${r.official_url}` : ""}`).join("\n")
        );
      }
    } catch (_) { /* skip */ }
  }

  return sections.length
    ? sections.join("\n\n")
    : "No specific database results found — answer from general Route 66 knowledge.";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Get the latest user message for context building
    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user");
    const context = lastUserMsg ? await buildContext(lastUserMsg.content) : "";

    const systemWithContext = `${SYSTEM_PROMPT}\n\nDATA CONTEXT (from ramble66.com database — use this to ground your answers):\n${context}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemWithContext },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("trip-planner-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
