import { useEffect, useMemo, useState } from "react";
import { VendorLayout } from "@/components/layout/VendorLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  Calendar,
  DollarSign,
  Star,
  TrendingUp,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  apiVendorBookings,
  apiVendorMyServices,
  apiVendorReviews,
  apiVendorChatThreads,
  Booking,
  ServiceDoc,
  ReviewDoc,
} from "@/lib/api";

function formatMoneyINR(amount: number) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${amount}`;
  }
}

function formatWhen(d: Date) {
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  if (sameDay) {
    return `Today, ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const isTomorrow =
    d.getFullYear() === tomorrow.getFullYear() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getDate() === tomorrow.getDate();

  if (isTomorrow) {
    return `Tomorrow, ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }

  return `${d.toLocaleDateString()} • ${d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export default function VendorDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<ServiceDoc[]>([]);
  const [reviews, setReviews] = useState<ReviewDoc[]>([]);
  const [threads, setThreads] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const results = await Promise.allSettled([
          apiVendorBookings(),
          apiVendorMyServices(),
          apiVendorReviews(),
          apiVendorChatThreads(),
        ]);

        const [b, s, r, t] = results;

        if (b.status === "fulfilled") setBookings(b.value);
        if (s.status === "fulfilled") setServices(s.value);
        if (r.status === "fulfilled") setReviews(r.value);
        if (t.status === "fulfilled") setThreads(t.value);

        const failedCount = results.filter((x) => x.status === "rejected").length;
        if (failedCount) {
          toast({
            title: "Dashboard loaded partially",
            description:
              "Some data could not load. Make sure vendor chat/review APIs are added in backend.",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const activeServices = services.filter((s) => s.isActive).length;

    const totalBookings = bookings.length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const accepted = bookings.filter((b) => b.status === "accepted").length;
    const completed = bookings.filter((b) => b.status === "completed").length;

    const earnings = bookings
      .filter((b) => b.status === "completed")
      .reduce((sum, b) => sum + (Number(b.totalPrice) || 0), 0);

    const avgRating =
      reviews.length > 0
        ? Number(
            (
              reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length
            ).toFixed(2)
          )
        : null;

    return {
      activeServices,
      totalBookings,
      pending,
      accepted,
      completed,
      earnings,
      avgRating,
      reviewCount: reviews.length,
      chatCount: threads.length,
    };
  }, [services, bookings, reviews, threads]);

  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort((a, b) => +new Date(b.scheduledAt) - +new Date(a.scheduledAt))
      .slice(0, 5)
      .map((b) => {
        const d = new Date(b.scheduledAt);
        return {
          _id: b._id,
          service: b.service?.name || "Service",
          customer: b.user?.name || "Customer",
          when: formatWhen(d),
          status: b.status,
        };
      });
  }, [bookings]);

  const latestReviews = useMemo(() => {
    return [...reviews]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 5);
  }, [reviews]);

  const latestThreads = useMemo(() => {
    return [...threads]
      .sort((a, b) => +new Date(b.lastMessageAt) - +new Date(a.lastMessageAt))
      .slice(0, 5);
  }, [threads]);

  const statCards = useMemo(() => {
    return [
      {
        label: "Active Services",
        value: loading ? null : String(stats.activeServices),
        icon: Package,
        change: loading ? "" : `${services.length} total`,
        color: "from-blue-50 to-blue-100 border-blue-200",
      },
      {
        label: "Total Bookings",
        value: loading ? null : String(stats.totalBookings),
        icon: Calendar,
        change: loading ? "" : `Pending ${stats.pending} • Accepted ${stats.accepted}`,
        color: "from-green-50 to-green-100 border-green-200",
      },
      {
        label: "Earnings (Completed)",
        value: loading ? null : formatMoneyINR(stats.earnings),
        icon: DollarSign,
        change: loading ? "" : `Completed ${stats.completed}`,
        color: "from-purple-50 to-purple-100 border-purple-200",
      },
      {
        label: "Rating",
        value: loading ? null : stats.avgRating == null ? "—" : String(stats.avgRating),
        icon: Star,
        change: loading ? "" : `${stats.reviewCount} reviews`,
        color: "from-orange-50 to-orange-100 border-orange-200",
      },
    ];
  }, [loading, stats, services.length]);

  const statusBadge = (status: string) => {
    return (
      <span
        className={`rounded-full px-4 py-1 text-xs font-semibold whitespace-nowrap ml-4 ${
          status === "pending"
            ? "bg-warning/10 text-warning border border-warning/20"
            : status === "accepted"
            ? "bg-primary/10 text-primary border border-primary/20"
            : status === "completed"
            ? "bg-success/10 text-success border border-success/20"
            : "bg-destructive/10 text-destructive border border-destructive/20"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <VendorLayout>
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 border border-blue-100">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, {user?.businessName || user?.name}! 👋
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Here&apos;s your business performance at a glance
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className={`bg-gradient-to-br ${stat.color} hover:shadow-lg transition-all`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-gray-700">
                      {stat.label}
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-white/60">
                      <Icon className="h-5 w-5 text-gray-700" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {loading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <TrendingUp className="h-3 w-3" />
                      <span>{loading ? "Loading…" : stat.change}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-2 border-blue-100 hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-blue-600" />
                <span className="text-gray-900">Services</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">Manage and add new services to grow your business</p>
              <div className="space-y-2">
                <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                  <Link to="/vendor/add-service">
                    Add New Service
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full border-blue-200" asChild>
                  <Link to="/vendor/services">View All Services</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span className="text-gray-900">Bookings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">Manage your bookings and schedule</p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
                <Link to="/vendor/bookings">
                  View All Bookings
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 md:w-auto">
            <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card className="hover:shadow-lg transition-all">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Recent Bookings</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Your latest service requests</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/vendor/bookings">View All</Link>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {loading ? (
                  <Skeleton className="h-24 w-full" />
                ) : recentBookings.length === 0 ? (
                  <div className="rounded-md border p-4 text-sm text-muted-foreground">
                    No bookings found yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentBookings.map((booking) => (
                      <div
                        key={booking._id}
                        className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-b-0"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{booking.service}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {booking.customer} • {booking.when}
                          </p>
                        </div>
                        {statusBadge(booking.status)}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <Card className="hover:shadow-lg transition-all">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Chat Threads
                  </CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/vendor/bookings">Open Chat from Booking</Link>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-3">
                {loading ? (
                  <Skeleton className="h-24 w-full" />
                ) : latestThreads.length === 0 ? (
                  <div className="rounded-md border p-4 text-sm text-muted-foreground">
                    No chats yet. Chats appear when customer opens chat in booking.
                  </div>
                ) : (
                  latestThreads.map((t: any) => (
                    <div key={t._id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Booking: {String(t.booking).slice(-6)}</div>
                        <Badge variant="outline">
                          {new Date(t.lastMessageAt).toLocaleString()}
                        </Badge>
                      </div>
                      <Separator className="my-3" />
                      <div className="text-sm text-muted-foreground">
                        To chat, open the booking and click <strong>Chat</strong>.
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card className="hover:shadow-lg transition-all">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Latest Reviews</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {stats.avgRating == null
                        ? "No rating yet"
                        : `Average ${stats.avgRating} • ${stats.reviewCount} reviews`}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {stats.avgRating == null ? "—" : `⭐ ${stats.avgRating}`}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-3">
                {loading ? (
                  <Skeleton className="h-24 w-full" />
                ) : latestReviews.length === 0 ? (
                  <div className="rounded-md border p-4 text-sm text-muted-foreground">
                    No reviews yet. Reviews appear after completed bookings.
                  </div>
                ) : (
                  latestReviews.map((r) => (
                    <div key={r._id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{r.service?.name || "Service"}</div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < r.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        By {r.user?.name || "Customer"} •{" "}
                        {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                      <p className="mt-2 text-sm">
                        {r.comment?.trim() ? (
                          r.comment
                        ) : (
                          <span className="text-muted-foreground">No comment</span>
                        )}
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </VendorLayout>
  );
}
