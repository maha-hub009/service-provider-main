/* =========================
   CustomerBookings.tsx (FULL UPDATED)
   - Adds Customer ↔ Vendor Chat per booking
   - Adds Review & Rating after COMPLETED
   - Doesn’t break existing booking flow
========================= */

import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, Loader2, MessageSquare, Send, Star, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  apiCustomerBookings,
  Booking,
  apiGetOrCreateThread,
  apiListMessages,
  apiSendMessage,
  ChatMessage,
  apiCreateReview,
} from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

function fmtTime(ts: string) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function MessageBubble({ m }: { m: ChatMessage }) {
  const mine = m.senderRole === "user"; // customer side
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

function ChatDialog({
  open,
  onOpenChange,
  booking,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  booking: Booking | null;
}) {
  const { toast } = useToast();
  const [threadId, setThreadId] = useState<string>("");
  const [items, setItems] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const load = async () => {
    if (!booking?._id) return;
    try {
      setLoading(true);
      const thread = await apiGetOrCreateThread(booking._id);
      setThreadId(thread._id);
      const msgs = await apiListMessages(thread._id);
      setItems(msgs);
    } catch (e: any) {
      toast({ title: "Chat error", description: e?.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, booking?._id]);

  const send = async () => {
    if (!threadId || !text.trim()) return;
    try {
      setSending(true);
      const msg = await apiSendMessage(threadId, text.trim());
      setItems((p) => [...p, msg]);
      setText("");
    } catch (e: any) {
      toast({ title: "Send failed", description: e?.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat with Vendor
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <div className="rounded-lg border bg-background">
            <div className="flex items-center justify-between border-b px-3 py-2">
              <div className="text-sm">
                <span className="font-medium">
                  {booking?.vendor?.user?.businessName || "Vendor"}
                </span>
                <span className="text-muted-foreground"> • {booking?.service?.name || "Service"}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
                <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            <div className="h-[340px] overflow-auto p-3 space-y-2">
              {loading ? (
                <div className="py-10 text-center text-sm text-muted-foreground">Loading chat…</div>
              ) : items.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No messages yet. Ask about timing, price, details…
                </div>
              ) : (
                items.map((m) => <MessageBubble key={m._id} m={m} />)
              )}
            </div>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message…"
              className="min-h-[44px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <Button onClick={send} disabled={sending || !text.trim()}>
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="rounded p-1"
          aria-label={`${n} star`}
        >
          <Star className={`h-5 w-5 ${n <= value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} />
        </button>
      ))}
    </div>
  );
}

const CustomerBookings = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [chatOpen, setChatOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // local “already reviewed” tracker (since no list endpoint shown)
  const reviewedKey = "reviewed_booking_ids_v1";
  const [reviewedIds, setReviewedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(reviewedKey) || "[]");
    } catch {
      return [];
    }
  });

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiCustomerBookings();
        setItems(data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const saveReviewed = (next: string[]) => {
    setReviewedIds(next);
    localStorage.setItem(reviewedKey, JSON.stringify(next));
  };

  const openChat = (b: Booking) => {
    setSelectedBooking(b);
    setChatOpen(true);
  };

  const openReview = (b: Booking) => {
    setSelectedBooking(b);
    setRating(5);
    setComment("");
    setReviewOpen(true);
  };

  const submitReview = async () => {
    if (!selectedBooking?._id) return;
    try {
      setSubmittingReview(true);
      await apiCreateReview({
        bookingId: selectedBooking._id,
        rating,
        comment: comment.trim() || undefined,
      });

      const next = Array.from(new Set([...reviewedIds, selectedBooking._id]));
      saveReviewed(next);

      toast({ title: "Thanks!", description: "Your review has been submitted." });
      setReviewOpen(false);
    } catch (e: any) {
      toast({ title: "Review failed", description: e?.message, variant: "destructive" });
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
            <Loader2 className="h-3 w-3 animate-spin" />
            Pending
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Clock className="h-3 w-3" />
            Accepted
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
            <XCircle className="h-3 w-3" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const canReview = useMemo(() => {
    if (!selectedBooking?._id) return false;
    return selectedBooking.status === "completed" && !reviewedIds.includes(selectedBooking._id);
  }, [selectedBooking, reviewedIds]);

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Track all your service bookings here.
          </p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-3 text-muted-foreground">Loading bookings…</p>
            </CardContent>
          </Card>
        ) : items.length > 0 ? (
          <div className="space-y-4">
            {items.map((b) => {
              const date = new Date(b.scheduledAt);
              const vendorName = b.vendor?.user?.businessName || "Vendor";
              const alreadyReviewed = reviewedIds.includes(b._id);

              return (
                <Card key={b._id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-heading text-lg font-semibold">
                            {b.service?.name || "Service"}
                          </h3>
                          {getStatusBadge(b.status)}
                          {b.status === "completed" && alreadyReviewed && (
                            <span className="text-xs text-muted-foreground">• Reviewed</span>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground">by {vendorName}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {date.toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {b.address}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="font-heading text-xl font-bold">₹{b.totalPrice}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" onClick={() => openChat(b)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Chat
                          </Button>

                          <Button
                            onClick={() => openReview(b)}
                            disabled={b.status !== "completed" || alreadyReviewed}
                          >
                            <Star className="mr-2 h-4 w-4" />
                            {alreadyReviewed ? "Reviewed" : "Rate & Review"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-heading text-lg font-semibold">No bookings yet</h3>
              <p className="mt-2 text-muted-foreground">Start by booking your first service!</p>
              <Button asChild className="mt-4" variant="gradient">
                <Link to="/services">Browse Services</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Chat Modal */}
      <ChatDialog open={chatOpen} onOpenChange={setChatOpen} booking={selectedBooking} />

      {/* Review Modal */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Rate & Review</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-sm">
              <div className="font-medium">{selectedBooking?.service?.name || "Service"}</div>
              <div className="text-muted-foreground">
                Vendor: {selectedBooking?.vendor?.user?.businessName || "Vendor"}
              </div>
            </div>

            {selectedBooking?.status !== "completed" ? (
              <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
                You can leave a review only after the service is marked <strong>Completed</strong>.
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Your Rating</div>
                  <StarPicker value={rating} onChange={setRating} />
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Comment (optional)</div>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience…"
                  />
                </div>

                {!canReview && selectedBooking?._id && (
                  <div className="text-xs text-muted-foreground">
                    You already reviewed this booking.
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReviewOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={submitReview}
              disabled={submittingReview || !canReview || selectedBooking?.status !== "completed"}
            >
              {submittingReview ? "Submitting…" : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default CustomerBookings;
