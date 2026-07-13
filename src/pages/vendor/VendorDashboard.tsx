import { useEffect, useState } from "react";
import { VendorLayout } from "@/components/layout/VendorLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Calendar, DollarSign, Loader2, ArrowRight, TrendingUp, Star, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from "@/hooks/use-toast";
import { apiVendorStats, Booking } from "@/lib/api";

const VendorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeServices: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [] as Booking[],
    totalEarnings: 0,
    averageRating: 0,
    completionRate: 0,
  });

  const earningsData = [
    { month: 'Jan', earnings: 1200 },
    { month: 'Feb', earnings: 1900 },
    { month: 'Mar', earnings: 3000 },
    { month: 'Apr', earnings: 5000 },
    { month: 'May', earnings: 4500 },
    { month: 'Jun', earnings: stats.totalEarnings },
  ];

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await apiVendorStats();
        setStats({
          ...data,
          totalEarnings: data.totalEarnings || 0,
          averageRating: data.averageRating || 0,
          completionRate: data.completionRate || 0,
        });
      } catch (error) {
        toast({
          title: "Failed to load statistics",
          description: error instanceof Error ? error.message : "Unknown error",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [toast]);

  const statCards = [
    {
      label: "Active Services",
      value: stats.activeServices,
      icon: Package,
      color: "from-blue-50 to-blue-100 border-blue-200",
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings,
      icon: Calendar,
      color: "from-green-50 to-green-100 border-green-200",
    },
    {
      label: "Pending",
      value: stats.pendingBookings,
      icon: Clock,
      color: "from-purple-50 to-purple-100 border-purple-200",
    },
    {
      label: "Completed",
      value: stats.completedBookings,
      icon: CheckCircle,
      color: "from-orange-50 to-orange-100 border-orange-200",
    },
  ];

  const upcomingBookings = stats.recentBookings.filter((booking) => new Date(booking.scheduledAt) > new Date());
  const recentCompletedBookings = stats.recentBookings.filter((booking) => booking.status === "completed").slice(0, 3);

  if (loading) {
    return (
      <VendorLayout>
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-4xl font-bold">
            Welcome back, {user?.businessName || user?.name}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's your business performance at a glance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className={`${stat.color}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">
                      {stat.label}
                    </CardTitle>
                    <div className="p-2 rounded-lg bg-white/60">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Revenue and Performance */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Earnings Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Earnings</span>
                <span className="text-2xl font-bold">${stats.totalEarnings}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${Math.min((stats.totalEarnings / 5000) * 100, 100)}%` }}></div>
              </div>
              <p className="text-xs text-muted-foreground">Monthly goal: $5,000</p>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{stats.averageRating.toFixed(1)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completion Rate</span>
                <span className="font-semibold">{stats.completionRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                <span className="font-semibold text-green-600">High</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Manage and add new services to grow your business
              </p>
              <div className="space-y-2">
                <Button className="w-full" asChild>
                  <Link to="/vendor/add-service">
                    Add New Service
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/vendor/services">View All Services</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Bookings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Manage your bookings and schedule
              </p>
              <Button className="w-full" asChild>
                <Link to="/vendor/bookings">
                  View All Bookings
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        {recentCompletedBookings && recentCompletedBookings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Completed Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCompletedBookings.map((booking: Booking) => (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{booking.service?.name || "Service"}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.user?.name || "Customer"} - {new Date(booking.scheduledAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Amount: ${booking.amount}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">4.5</span>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Bookings */}
        {upcomingBookings && upcomingBookings.length > 0 && (
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <AlertCircle className="h-5 w-5" />
                Upcoming Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingBookings.slice(0, 3).map((booking: Booking) => (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-white"
                  >
                    <div>
                      <p className="font-medium">{booking.service?.name || "Service"}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.user?.name || "Customer"} - {new Date(booking.scheduledAt).toLocaleString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      Upcoming
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </VendorLayout>
  );
};

export default VendorDashboard;
