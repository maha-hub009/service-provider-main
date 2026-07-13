import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, CheckCircle2, XCircle, Loader2, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiCustomerBookings, Booking, apiCreateReview } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const CustomerBookings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

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

  const openRatingModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setRating(5);
    setComment("");
    setRatingModalOpen(true);
  };

  const submitRating = async () => {
    if (!selectedBooking?.service?._id) return;
    try {
      await apiCreateReview(selectedBooking.service._id, { rating, comment: comment || undefined });
      toast({ title: "Review submitted", description: "Thank you for your feedback!" });
      setRatingModalOpen(false);
    } catch (e: any) {
      toast({ title: "Failed to submit review", description: e?.message, variant: "destructive" });
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

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold">My Bookings</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}! Track all your service bookings here.</p>
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
              return (
                <Card key={b._id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-heading text-lg font-semibold">{b.service?.name || "Service"}</h3>
                          {getStatusBadge(b.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {b.vendor?.user?.businessName ? `by ${b.vendor.user.businessName}` : "by Vendor"}
                        </p>
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

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="font-heading text-xl font-bold">₹{b.totalPrice}</p>
                        </div>
                        {b.status === 'completed' && (
                          <Button variant="outline" onClick={() => openRatingModal(b)}>
                            Rate Service
                          </Button>
                        )}
                        {(b.status === 'accepted' || b.status === 'completed') && (
                          <Button asChild variant="outline">
                            <Link to={`/chat/booking/${b._id}`}>Chat</Link>
                          </Button>
                        )}
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

        {/* Rating Modal */}
        <Dialog open={ratingModalOpen} onOpenChange={setRatingModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rate Service</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Rating</label>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-1 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <Star className="h-6 w-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Comment (Optional)</label>
                <Textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..."
                  className="mt-1"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setRatingModalOpen(false)}>Cancel</Button>
              <Button onClick={submitRating}>Submit Review</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default CustomerBookings;
