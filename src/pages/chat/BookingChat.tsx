import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { apiGetOrCreateThread, apiListMessages, apiSendMessage } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const BookingChat = () => {
  const { bookingId } = useParams();
  const [thread, setThread] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!bookingId) return;
    let mounted = true;
    (async () => {
      try {
        const t = await apiGetOrCreateThread(bookingId);
        if (!mounted) return;
        setThread(t);
        const ms = await apiListMessages(t._id);
        setMessages(ms || []);
      } catch (e) {
        // ignore
      }
    })();

    return () => { mounted = false; };
  }, [bookingId]);

  useEffect(() => {
    // simple polling
    if (!thread) return;
    const id = setInterval(async () => {
      const ms = await apiListMessages(thread._id);
      setMessages(ms || []);
    }, 2000);
    return () => clearInterval(id);
  }, [thread]);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!thread || !text.trim()) return;
    try {
      await apiSendMessage(thread._id, text.trim());
      setText("");
      const ms = await apiListMessages(thread._id);
      setMessages(ms || []);
    } catch (e) {
      // ignore
    }
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Booking Chat</CardTitle>
          </CardHeader>
          <CardContent>
            {!thread ? (
              <p className="text-muted-foreground">Loading chat…</p>
            ) : (
              <div className="space-y-4">
                <div ref={messagesRef} className="max-h-96 overflow-y-auto space-y-3 p-2 border rounded-md bg-background">
                  {messages.map((m) => (
                    <div key={m._id} className={`p-2 rounded ${m.senderRole === 'vendor' ? 'bg-accent/10 self-end' : 'bg-muted/10'}`}>
                      <div className="text-sm text-muted-foreground">{m.senderRole}</div>
                      <div className="mt-1">{m.text}</div>
                      <div className="text-xs text-muted-foreground mt-1">{new Date(m.createdAt).toLocaleTimeString()}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-2">
                  <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" />
                  <div className="mt-2 flex justify-end">
                    <Button onClick={send}>Send</Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default BookingChat;
