// src/components/chat/ChatBox.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { RefreshCcw, Send, MessageSquare } from "lucide-react";
import {
  apiGetOrCreateThread,
  apiListMessages,
  apiSendMessage,
  ChatMessage,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type Props = {
  bookingId: string;
  title?: string;
  subtitle?: string;
  /** "customer" | "vendor" - only used for bubble alignment */
  side?: "customer" | "vendor";
  /** optional: show top header bar */
  showHeader?: boolean;
  className?: string;
};

function fmtTime(ts: string) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function Bubble({ m, side }: { m: ChatMessage; side: "customer" | "vendor" }) {
  const mine =
    side === "customer" ? m.senderRole === "user" : m.senderRole === "vendor" || m.senderRole === "admin";

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm",
          mine ? "bg-primary text-primary-foreground" : "bg-muted",
        ].join(" ")}
      >
        <div className="whitespace-pre-wrap">{m.text}</div>
        <div className={`mt-1 text-[10px] ${mine ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
          {fmtTime(m.createdAt)}
        </div>
      </div>
    </div>
  );
}

export default function ChatBox({
  bookingId,
  title = "Chat",
  subtitle,
  side = "customer",
  showHeader = true,
  className = "",
}: Props) {
  const { toast } = useToast();

  const [threadId, setThreadId] = useState("");
  const [items, setItems] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(() => text.trim().length > 0 && !!threadId, [text, threadId]);

  const scrollToBottom = () => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  };

  const load = async () => {
    if (!bookingId) return;
    try {
      setLoading(true);
      const thread = await apiGetOrCreateThread(bookingId);
      setThreadId(thread._id);
      const msgs = await apiListMessages(thread._id);
      setItems(msgs);
      // wait for paint then scroll
      setTimeout(scrollToBottom, 0);
    } catch (e: any) {
      toast({
        title: "Chat error",
        description: e?.message || "Failed to load chat",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  useEffect(() => {
    // auto scroll on new messages
    setTimeout(scrollToBottom, 0);
  }, [items.length]);

  const send = async () => {
    if (!canSend) return;
    const msgText = text.trim();
    try {
      setSending(true);
      const msg = await apiSendMessage(threadId, msgText);
      setItems((p) => [...p, msg]);
      setText("");
    } catch (e: any) {
      toast({
        title: "Send failed",
        description: e?.message || "Could not send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={["rounded-xl border bg-background", className].join(" ")}>
      {showHeader && (
        <>
          <div className="flex items-center justify-between px-3 py-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <div className="truncate text-sm font-medium">{title}</div>
              </div>
              {subtitle ? <div className="truncate text-xs text-muted-foreground">{subtitle}</div> : null}
            </div>

            <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
              <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
          <Separator />
        </>
      )}

      <div
        ref={listRef}
        className="h-[340px] overflow-auto p-3 space-y-2"
      >
        {loading ? (
          <div className="py-10 text-center text-sm text-muted-foreground">Loading chat…</div>
        ) : items.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No messages yet. Start the conversation 👋
          </div>
        ) : (
          items.map((m) => <Bubble key={m._id} m={m} side={side} />)
        )}
      </div>

      <Separator />

      <div className="flex gap-2 p-3">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
          className="min-h-[44px] resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          disabled={loading}
        />
        <Button onClick={send} disabled={sending || !text.trim() || !threadId}>
          <Send className="mr-2 h-4 w-4" />
          Send
        </Button>
      </div>
    </div>
  );
}
