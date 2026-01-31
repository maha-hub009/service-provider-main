import { VendorLayout } from "@/components/layout/VendorLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Calendar, DollarSign, Star, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const VendorDashboard = () => {
  const { user } = useAuth();
  
  const stats = [
    { label: "Active Services", value: "8", icon: Package, change: "+2 this month", color: "from-blue-50 to-blue-100 border-blue-200" },
    { label: "Total Bookings", value: "127", icon: Calendar, change: "+15 this week", color: "from-green-50 to-green-100 border-green-200" },
    { label: "Earnings", value: "₹45,800", icon: DollarSign, change: "+₹8,900 this month", color: "from-purple-50 to-purple-100 border-purple-200" },
    { label: "Rating", value: "4.8", icon: Star, change: "Based on 89 reviews", color: "from-orange-50 to-orange-100 border-orange-200" },
  ];

  const recentBookings = [
    { service: "Plumbing Repair", customer: "Sarah Johnson", date: "Today, 2:00 PM", status: "pending" },
    { service: "Pipe Installation", customer: "Mike Brown", date: "Tomorrow, 10:00 AM", status: "accepted" },
    { service: "Drain Cleaning", customer: "Emily Davis", date: "Jan 12, 3:00 PM", status: "completed" },
  ];

  return (
    <VendorLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 border border-blue-100">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back, {user?.businessName || user?.name}! 👋
          </h1>
          <p className="text-lg text-gray-600 mt-2">Here's your business performance at a glance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className={`bg-gradient-to-br ${stat.color} hover:shadow-lg transition-all`}>
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
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <TrendingUp className="h-3 w-3" />
                      <span>{stat.change}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
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

        {/* Recent Bookings */}
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
            <div className="space-y-3">
              {recentBookings.map((booking, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{booking.service}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {booking.customer} • {booking.date}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-4 py-1 text-xs font-semibold whitespace-nowrap ml-4 ${
                      booking.status === "pending"
                        ? "bg-warning/10 text-warning border border-warning/20"
                        : booking.status === "accepted"
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-success/10 text-success border border-success/20"
                    }`}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
};

export default VendorDashboard;
