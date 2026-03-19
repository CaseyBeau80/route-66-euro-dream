import { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/trip-planner-chat`;

const QUICK_CHIPS = [
  "Best stops in Oklahoma",
  "Upcoming Route 66 events",
  "Hidden gems in New Mexico",
  "Plan a 7-day Route 66 trip",
];

interface Message {
  role: "user" | "assistant";
  content: string;
  showChips?: boolean;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content: `Howdy, road warrior! I'm **Big Bo Ramble** — your guide to the Mother Road.\n\nAsk me about iconic stops, hidden gems, upcoming events, or help planning your Route 66 adventure. What stretch of the road are you dreaming about?`,
  showChips: true,
};

export default function TripPlannerChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text?: string) {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    setLoading(true);

    const userMsg: Message = { role: "user", content: userText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    // Build history for the API (strip showChips)
    const apiMessages = updatedMessages.map(({ role, content }) => ({ role, content }));

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error(`HTTP ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && !last.showChips) {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantSoFar } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      if (!assistantSoFar) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, hit a bump in the road. Try again!" },
        ]);
      }
    } catch (_) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oof, lost the signal out here. Check your connection and try again.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center border-2 border-route66-border shadow-[4px_4px_0_rgba(27,96,163,0.3)] transition-colors bg-route66-primary hover:bg-route66-primary/85 text-white"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] flex flex-col border-2 border-route66-border rounded-sm shadow-[4px_4px_0_#E8D9B8] overflow-hidden"
          style={{ backgroundColor: "#F5EDD8", maxHeight: "min(600px, calc(100vh - 8rem))" }}
        >
          {/* Header */}
          <div className="bg-route66-asphalt border-b-4 border-route66-primary px-4 py-3 text-center relative">
            <div className="absolute bottom-[-10px] left-0 right-0 h-[6px] bg-route66-gold z-10" />
            <p
              className="text-white text-[10px] tracking-[3px] uppercase mb-1"
              style={{ fontFamily: "'Special Elite', cursive" }}
            >
              Est. 1926 — Chicago to Santa Monica
            </p>
            <h2
              className="text-white text-2xl font-black leading-none"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ramble<span className="text-route66-gold">66</span>
            </h2>
            <p
              className="text-white text-[10px] tracking-[2px] mt-1"
              style={{ fontFamily: "'Special Elite', cursive" }}
            >
              Trip Planner — Ask Big Bo Anything
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-[200px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold border-2 border-route66-border ${
                    msg.role === "user"
                      ? "bg-route66-gold text-route66-text"
                      : "bg-route66-primary text-white"
                  }`}
                  style={{ fontFamily: "'Special Elite', cursive" }}
                >
                  {msg.role === "user" ? "You" : "BB"}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[78%] px-3 py-2 rounded-sm text-sm leading-relaxed border ${
                    msg.role === "user"
                      ? "bg-route66-asphalt text-route66-surface border-route66-text"
                      : "bg-route66-surface text-route66-text border-[#E8D9B8]"
                  }`}
                >
                  <div className="prose prose-sm max-w-none [&_p]:m-0 [&_ul]:my-1 [&_li]:my-0">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>

                  {/* Quick chips on welcome */}
                  {msg.showChips && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {QUICK_CHIPS.map((chip) => (
                        <button
                          key={chip}
                          onClick={() => sendMessage(chip)}
                          className="text-xs px-3 py-1.5 border-2 border-route66-primary text-route66-primary rounded-sm hover:bg-route66-primary hover:text-white transition-colors font-medium"
                          style={{
                            fontFamily: "'Libre Baskerville', Georgia, serif",
                          }}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2 items-start">
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold border-2 border-route66-border bg-route66-primary text-white"
                  style={{ fontFamily: "'Special Elite', cursive" }}
                >
                  BB
                </div>
                <div className="bg-route66-surface border border-[#E8D9B8] rounded-sm px-3 py-3 flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-route66-border opacity-30 animate-bounce"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t-2 border-route66-border flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about stops, events, hidden gems..."
              disabled={loading}
              className="flex-1 px-4 py-3 bg-route66-surface text-route66-text text-sm outline-none placeholder-[#7A5C44] italic disabled:opacity-50"
              style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="px-5 py-3 bg-route66-primary text-white text-sm hover:bg-route66-hover disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              style={{ fontFamily: "'Special Elite', cursive", letterSpacing: "1px" }}
            >
              Send →
            </button>
          </div>

          {/* Footer */}
          <p
            className="text-center text-[10px] text-[#7A5C44] italic py-2"
            style={{ fontFamily: "'Libre Baskerville', Georgia, serif" }}
          >
            Powered by ramble66.com
          </p>
        </div>
      )}
    </>
  );
}
