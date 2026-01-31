import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Zap, Clock, Shield, MapPin, BarChart3, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { useEffect, useState } from "react";
import { apiCustomerBookings, Booking } from "@/lib/api";

const CustomerHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiCustomerBookings();
        setRecentBookings(data.slice(0, 3));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <MainLayout>
      {/* Welcome Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12 md:py-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-4 top-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -right-4 bottom-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        </div>

        <div className="container relative">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Zap className="h-4 w-4 fill-primary" />
                <span>Welcome back, {user?.name?.split(" ")[0]}!</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Your Trusted Service Hub
              </h1>

              <p className="text-lg text-muted-foreground max-w-lg">
                Access your bookings, schedule new services, and manage everything in one convenient place.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row pt-4">
                <Button size="lg" asChild>
                  <Link to="/services">
                    Book a Service
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/customer/bookings">View All Bookings</Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="border-0 bg-card/50 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Bookings</p>
                      <p className="text-2xl font-bold">{recentBookings.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-card/50 backdrop-blur">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-success/10 p-3">
                      <Shield className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="text-2xl font-bold text-success">Active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Services */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Quick Access Services</h2>
            <p className="mt-2 text-muted-foreground">Browse popular services you might need</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICE_CATEGORIES.slice(0, 3).map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="rounded-lg bg-gradient-primary p-2">
                      <category.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle className="text-xl">{category.name}</CardTitle>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full" asChild>
                    <Link to={`/services/${category.id}`}>
                      Browse Services
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button variant="outline" size="lg" className="w-full mt-6" asChild>
            <Link to="/services">
              View All Categories
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Recent Bookings */}
      {!loading && recentBookings.length > 0 && (
        <section className="py-16 lg:py-24 bg-muted/50">
          <div className="container">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">Recent Bookings</h2>
                <p className="mt-2 text-muted-foreground">Your latest service requests</p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/customer/bookings">View All</Link>
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentBookings.map((booking) => (
                <Card key={booking._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{booking.service?.name || "Service"}</CardTitle>
                        <CardDescription>{booking.vendor?.businessName || "Vendor"}</CardDescription>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        booking.status === "completed" ? "bg-success/10 text-success" :
                        booking.status === "accepted" ? "bg-primary/10 text-primary" :
                        "bg-warning/10 text-warning"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(booking.scheduledAt).toLocaleDateString()}</span>
                    </div>
                    {booking.address && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{booking.address}</span>
                      </div>
                    )}
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to="/customer/bookings">View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Why Choose Us</h2>
            <p className="mt-4 text-lg text-muted-foreground">Everything you need for quality home services</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Verified Professionals",
                description: "All our service providers are verified and rated by customers."
              },
              {
                icon: Clock,
                title: "Fast Scheduling",
                description: "Book services in minutes with same-day or next-day availability."
              },
              {
                icon: Zap,
                title: "Easy Management",
                description: "Track your bookings and communicate with service providers effortlessly."
              }
            ].map((feature, index) => (
              <Card key={index} className="border-0 bg-card/50">
                <CardContent className="pt-6">
                  <div className="rounded-lg bg-primary/10 w-fit p-3 mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default CustomerHome;
