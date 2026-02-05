import { useEffect, useState } from "react";
import { VendorLayout } from "@/components/layout/VendorLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Calendar, DollarSign, Loader2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { apiVendorStats } from "@/lib/api";

const VendorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeServices: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await apiVendorStats();
        setStats(data);
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
      icon: DollarSign,
      color: "from-purple-50 to-purple-100 border-purple-200",
    },
    {
      label: "Completed",
      value: stats.completedBookings,
      icon: Package,
      color: "from-orange-50 to-orange-100 border-orange-200",
    },
  ];

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
              <Card key={stat.label} className={`bg-gradient-to-br ${stat.color}`}>
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
        {stats.recentBookings && stats.recentBookings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentBookings.map((booking: any) => (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{booking.serviceId?.name || "Service"}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.customerId?.name || "Customer"}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {booking.status}
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
