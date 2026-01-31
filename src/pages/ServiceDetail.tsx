import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin, Clock, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiCreateBooking, apiListServices, ServiceDoc } from "@/lib/api";

const ServiceDetail = () => {
  const { categoryId, serviceId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  const selectedCategory = SERVICE_CATEGORIES.find((c) => c.id === categoryId);
  const selectedSub = selectedCategory?.subcategories.find((s) => s.id === serviceId);

  const [loading, setLoading] = useState(true);
  const [offerings, setOfferings] = useState<ServiceDoc[]>([]);
  const [selectedOfferingId, setSelectedOfferingId] = useState<string>("");

  // booking form
  const [scheduledAt, setScheduledAt] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const title = selectedSub?.name || "Service";
  const categoryName = selectedCategory?.name || "Category";

  const subcategoryBackendId = useMemo(() => {
    // your backend uses string subcategory like "plumber"
    // your frontend subcategory id is same (plumber/electrician etc.)
    return serviceId || "";
  }, [serviceId]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await apiListServices({
          category: categoryId,
          subcategory: subcategoryBackendId,
          page: 1,
          limit: 50,
        });
        setOfferings(res.items || []);
        if (res.items?.length) setSelectedOfferingId(res.items[0]._id);
      } catch (e: any) {
        toast({ title: "Failed to load services", description: e?.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    if (categoryId && subcategoryBackendId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, subcategoryBackendId]);

  const selectedOffering = offerings.find((o) => o._id === selectedOfferingId);

  const onBook = async () => {
    if (!isAuthenticated) {
      toast({ title: "Login required", description: "Please login to book a service.", variant: "destructive" });
      navigate("/login");
      return;
    }

    if (user?.role !== "customer") {
      toast({ title: "Only customers can book", description: "Switch to customer account.", variant: "destructive" });
      return;
    }

    if (!selectedOfferingId) {
      toast({ title: "Select a provider", description: "Please choose a vendor service.", variant: "destructive" });
      return;
    }

    if (!scheduledAt) {
      toast({ title: "Select date & time", description: "Choose schedule time.", variant: "destructive" });
      return;
    }

    if (!address.trim()) {
      toast({ title: "Address required", description: "Enter service address.", variant: "destructive" });
      return;
    }

    try {
      setSubmitting(true);
      const booking = await apiCreateBooking({
        serviceId: selectedOfferingId,
        scheduledAt: new Date(scheduledAt).toISOString(),
        address: address.trim(),
        notes: notes.trim() || undefined,
      });

      toast({ title: "Booking created!", description: "You can track progress in chat.", });
      navigate(`/customer/bookings?bookingId=${booking._id}`);
    } catch (e: any) {
      toast({ title: "Booking failed", description: e?.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (!selectedCategory || !selectedSub) {
    return (
      <MainLayout>
        <div className="container py-10">
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground">Service not found.</p>
              <Button asChild className="mt-4">
                <Link to="/services">Back to Services</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/services" className="hover:underline">Services</Link>
            <span>/</span>
            <Link to={`/services/${categoryId}`} className="hover:underline">{categoryName}</Link>
            <span>/</span>
            <span className="text-foreground">{title}</span>
          </div>

          <h1 className="font-heading text-3xl font-bold mt-2">{title}</h1>
          <p className="text-muted-foreground mt-2">{selectedSub.description}</p>

          <div className="mt-3 flex gap-2 flex-wrap">
            <Badge variant="outline">{categoryName}</Badge>
            <Badge variant="outline">Base ₹{selectedSub.basePrice}</Badge>
          </div>
        </div>

        {/* Offerings */}
        <Card>
          <CardHeader>
            <CardTitle>Available Providers</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-10 text-center text-muted-foreground">
                <Loader2 className="mx-auto h-7 w-7 animate-spin" />
                <p className="mt-2">Loading providers…</p>
              </div>
            ) : offerings.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-muted-foreground">
                  No vendor offerings yet for this service.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Tip: login as Vendor and add a service in Vendor Dashboard.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {offerings.map((o) => {
                  const vendorName =
                    o.vendor?.user?.businessName ||
                    o.vendor?.businessName ||
                    o.vendor?.user?.name ||
                    "Vendor";

                  return (
                    <button
                      key={o._id}
                      onClick={() => setSelectedOfferingId(o._id)}
                      className={`text-left rounded-lg border p-4 transition ${
                        selectedOfferingId === o._id ? "border-primary ring-2 ring-primary/20" : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold">{o.name}</div>
                          <div className="text-sm text-muted-foreground mt-1">{vendorName}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold flex items-center justify-end gap-1">
                            <IndianRupee className="h-4 w-4" />
                            {o.price}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center justify-end gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            {o.durationMinutes || 60} min
                          </div>
                        </div>
                      </div>

                      {o.description ? (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{o.description}</p>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking */}
        <Card>
          <CardHeader>
            <CardTitle>Book This Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-9" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Your address" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special instructions…" />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="text-sm text-muted-foreground">
                Selected:{" "}
                <span className="text-foreground font-medium">
                  {selectedOffering ? `${selectedOffering.name} (₹${selectedOffering.price})` : "None"}
                </span>
              </div>

              <Button onClick={onBook} disabled={submitting || offerings.length === 0}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Confirm Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ServiceDetail;
