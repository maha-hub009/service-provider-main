import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, Briefcase, ClipboardList, Wrench, TrendingUp, Activity } from "lucide-react";
import { apiAdminBookings, apiAdminServices, apiAdminUsers, apiAdminVendors } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const [usersCount, setUsersCount] = useState(0);
  const [vendorsCount, setVendorsCount] = useState(0);
  const [servicesCount, setServicesCount] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [users, vendors, services, bookings] = await Promise.all([
          apiAdminUsers(),
          apiAdminVendors(),
          apiAdminServices(),
          apiAdminBookings({ page: 1, limit: 1 }),
        ]);

        setUsersCount(users.filter((u) => u.role === "user").length);
        setVendorsCount(vendors.length);
        setServicesCount(services.length);
        setBookingsCount(bookings.total || 0);
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
                <Card key={c.title} className={`relative overflow-hidden border-l-4 hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${c.color}`}>
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

        {/* Quick Stats Summary */}
        {!loading && (
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
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
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
