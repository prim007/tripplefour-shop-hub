import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Sparkles, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { Analytics, trackEvent } from "@/lib/analytics";
import ChatProductCard from "@/components/ChatProductCard";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cuddles-chat`;

type Msg = { role: "user" | "assistant"; content: string };

const PROMPT_STARTERS = [
  "🌙 Find a strain for deep sleep and relaxation",
  "🎉 Suggest an uplifting sativa for a social night out",
  "🌱 First time trying CBD? Walk me through the basics",
  "💪 Show me high-CBD options for muscle recovery without the heavy high",
  "🔥 What are the trending exotic terpene profiles right now?",
];

// Parse message content and split into text segments and product cards
function parseMessageContent(content: string): Array<{ type: "text"; value: string } | { type: "product"; id: string }> {
  const parts: Array<{ type: "text"; value: string } | { type: "product"; id: string }> = [];
  const regex = /\[PRODUCT:([a-z0-9-]+)\]/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: "product", id: match[1] });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push({ type: "text", value: content.slice(lastIndex) });
  }

  return parts;
}

function AssistantMessage({ content }: { content: string }) {
  const parts = parseMessageContent(content);

  return (
    <>
      {parts.map((part, i) =>
        part.type === "product" ? (
          <ChatProductCard key={`p-${i}`} productId={part.id} />
        ) : (
          <div key={`t-${i}`} className="prose prose-sm max-w-none dark:prose-invert [&>p]:m-0">
            <ReactMarkdown>{part.value.trim()}</ReactMarkdown>
          </div>
        )
      )}
    </>
  );
}

interface CuddlesChatbotProps {
  initialPrompt?: string;
  autoOpen?: boolean;
}

export default function CuddlesChatbot({ initialPrompt, autoOpen }: CuddlesChatbotProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasTrackedInit, setHasTrackedInit] = useState(false);
  // Explicit unavailable/error state — never faked as an assistant reply.
  const [chatError, setChatError] = useState<{ title: string; detail: string; retryable: boolean } | null>(null);
  const [lastUserText, setLastUserText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoOpen) { setOpen(true); return; }
    const seen = sessionStorage.getItem("cuddles-shown");
    if (!seen) {
      const timer = setTimeout(() => {
        setOpen(true);
        sessionStorage.setItem("cuddles-shown", "1");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [autoOpen]);

  useEffect(() => {
    if (initialPrompt && open && messages.length === 0) {
      sendMessage(initialPrompt);
    }
  }, [initialPrompt, open]);

  useEffect(() => {
    if (open && !hasTrackedInit) {
      Analytics.chatInitiated();
      setHasTrackedInit(true);
    }
  }, [open, hasTrackedInit]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Msg = { role: "user", content: text.trim() };
    setInput("");
    setChatError(null);
    setLastUserText(text.trim());
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    Analytics.chatMessageSent(text);

    let assistantSoFar = "";
    const allMessages = [...messages, userMsg];

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({} as { error?: string }));
        if (resp.status === 429) {
          setChatError({
            title: "Cuddles is at capacity",
            detail: "Too many requests right now. Wait about a minute and try again.",
            retryable: true,
          });
        } else if (resp.status === 402) {
          setChatError({
            title: "Cuddles is temporarily unavailable",
            detail: "Our AI service has run out of credits. Browse the shop or WhatsApp us on 064 543 6734 and a human will help.",
            retryable: false,
          });
        } else {
          setChatError({
            title: "Cuddles is unavailable",
            detail: errData.error || `The AI service returned an error (${resp.status}). Nothing was sent to our team — please retry or WhatsApp 064 543 6734.`,
            retryable: true,
          });
        }
        setIsLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;

      while (!streamDone) {
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
          if (jsonStr === "[DONE]") { streamDone = true; break; }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
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

      if (assistantSoFar.toLowerCase().match(/recommend|try|suggest|perfect for/)) {
        Analytics.recommendationGiven();
      }
    } catch (e) {
      console.error("Cuddles chat error:", e);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Oops, something went wrong 😅 Try again or WhatsApp us at wa.me/27645436734 ✌️" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptStarter = (prompt: string) => {
    Analytics.promptStarterClicked(prompt);
    sendMessage(prompt);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl animate-pulse"
        aria-label="Open Cuddles AI chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-[80] flex h-[520px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border-2 border-primary/20 bg-card shadow-2xl animate-scale-in">
          <div className="warm-gradient px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 " />
              <div>
                <h3 className="font-display text-base font-bold">Cuddles AI ✌️</h3>
                <p className="text-xs opacity-80">Your groovy budtender</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-sm text-muted-foreground mt-4">
                <p className="text-3xl mb-2">🌿</p>
                <p className="font-display font-bold text-foreground">What vibe are you after tonight?</p>
                <p className="mt-1 mb-4">Tell me what you're looking for and I'll find the perfect match 👇</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {PROMPT_STARTERS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handlePromptStarter(prompt)}
                      className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-primary/15 hover:border-primary/50 hover:scale-105"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <AssistantMessage content={msg.content} />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-2 text-sm">
                  <span className="animate-pulse">Cuddles is thinking 🌿...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t bg-secondary/30 px-3 py-2">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="w-full gap-1.5 rounded-full text-xs font-semibold border-primary/40 text-primary hover:bg-primary/10"
              onClick={() => trackEvent("cuddles_shop_cta_clicked")}
            >
              <Link to="/shop">
                <ShoppingBag className="h-3.5 w-3.5" /> Shop All Strains & Edibles
              </Link>
            </Button>
          </div>

          <div className="border-t p-3">
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Cuddles anything..."
                className="flex-1 rounded-full border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" aria-label="Send message" disabled={isLoading || !input.trim()} className="rounded-full shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
