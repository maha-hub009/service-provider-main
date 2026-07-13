import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Users, Briefcase, ClipboardList, Wrench, TrendingUp, Activity, Bell, Settings, BarChart3, UserCheck, Calendar, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { apiAdminBookings, apiAdminServices, apiAdminUsers, apiAdminVendors, Booking } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const [usersCount, setUsersCount] = useState(0);
  const [vendorsCount, setVendorsCount] = useState(0);
  const [servicesCount, setServicesCount] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [pendingVendors, setPendingVendors] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [users, vendors, services, bookings, recent] = await Promise.all([
          apiAdminUsers(),
          apiAdminVendors(),
          apiAdminServices(),
          apiAdminBookings({ page: 1, limit: 1 }),
          apiAdminBookings({ page: 1, limit: 5 }),
        ]);

        setUsersCount(users.filter((u) => u.role === "user").length);
        setVendorsCount(vendors.length);
        setServicesCount(services.length);
        setBookingsCount(bookings.total || 0);
        setRecentBookings(recent.items || []);
        setPendingVendors(vendors.filter((v) => !v.isVerified).length);
      } catch (e: any) {
        toast({ title: "Failed to load dashboard", description: e?.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cards = useMemo(
    () => [
      { title: "Customers", value: usersCount, icon: Users, color: "from-pink-500/10 to-pink-600/10", borderColor: "border-pink-200" },
      { title: "Vendors", value: vendorsCount, icon: Briefcase, color: "from-pink-600/10 to-pink-700/10", borderColor: "border-pink-200" },
      { title: "Services", value: servicesCount, icon: Wrench, color: "from-orange-500/10 to-orange-600/10", borderColor: "border-orange-200" },
      { title: "Bookings", value: bookingsCount, icon: ClipboardList, color: "from-green-500/10 to-green-600/10", borderColor: "border-green-200" },
    ],
    [usersCount, vendorsCount, servicesCount, bookingsCount]
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <h1 className="font-heading text-4xl font-bold">Welcome, {user?.name}! 👋</h1>
          </div>
          <p className="text-muted-foreground">Monitor your platform's performance and key metrics</p>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Loader2 className="mx-auto h-8 w-8 animate-spin" />
              <p className="mt-2">Loading stats…</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((c) => {
              const Icon = c.icon;
              return (
                <Card key={c.title} className={`relative overflow-hidden border-l-4 hover:shadow-lg transition-all duration-300 ${c.color}`}>
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/20" />
                  <CardHeader className="pb-2 relative z-10">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-muted-foreground">
                        {c.title}
                      </CardTitle>
                      <div className="rounded-lg bg-white/50 p-2">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="flex flex-col gap-2">
                      <div className="text-4xl font-bold">{c.value}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        <span>Active on platform</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Charts Section */}
        {!loading && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Customers', value: usersCount, fill: '#ec4899' },
                        { name: 'Vendors', value: vendorsCount, fill: '#f97316' },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell key="cell-0" fill="#ec4899" />
                      <Cell key="cell-1" fill="#f97316" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { name: 'Users', value: usersCount },
                    { name: 'Vendors', value: vendorsCount },
                    { name: 'Services', value: servicesCount },
                    { name: 'Bookings', value: bookingsCount },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Stats Summary */}
        {!loading && (
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Platform Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Total Ecosystem Value</p>
                  <p className="text-2xl font-bold">{usersCount + vendorsCount + servicesCount} Active Items</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Platform Traffic</p>
                  <p className="text-2xl font-bold">{bookingsCount} Total Transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activities */}
        {!loading && recentBookings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.slice(0, 5).map((booking: Booking) => (
                  <div key={booking._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{booking.service?.name || "Service"}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.user?.name || "Customer"} - {new Date(booking.scheduledAt).toLocaleDateString()}
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

        {/* Quick Actions */}
        {!loading && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button asChild className="h-auto p-4 flex flex-col items-center gap-2">
                  <Link to="/admin/users">
                    <UserCheck className="h-6 w-6" />
                    Manage Users
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Link to="/admin/vendors">
                    <Briefcase className="h-6 w-6" />
                    Manage Vendors
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Link to="/admin/services">
                    <Wrench className="h-6 w-6" />
                    Manage Services
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Link to="/admin/bookings">
                    <Calendar className="h-6 w-6" />
                    View Bookings
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notifications/Alerts */}
        {!loading && pendingVendors > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">{pendingVendors} vendor(s) pending approval</span>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link to="/admin/vendors">Review Vendors</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
