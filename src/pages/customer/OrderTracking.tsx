import { useParams, useNavigate, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  MapPin,
  User,
  Phone,
  ArrowLeft,
  Truck,
  Wrench,
  Star,
  Brain
} from "lucide-react";
import { useState, useEffect } from "react";

// Mock order tracking data
const mockOrderTracking = {
  id: "ORD-2026-001",
  serviceName: "Plumbing Repair",
  vendorName: "John's Plumbing",
  vendorPhone: "+1 (555) 123-4567",
  date: "January 15, 2026",
  time: "10:00 AM",
  address: "123 Main St, City, ST 12345",
  status: "in_progress",
  price: 199,
  estimatedCompletion: "11:30 AM",
  aiInsights: {
    eta: "11:45 AM",
    confidence: 92,
    factors: ["Traffic conditions", "Service complexity", "Vendor experience"],
    recommendations: ["Vendor is 15 min ahead of schedule", "Weather conditions optimal"]
  },
  timeline: [
    {
      status: "booked",
      timestamp: "2026-01-12T08:00:00Z",
      description: "Service booked successfully",
      completed: true
    },
    {
      status: "confirmed",
      timestamp: "2026-01-12T08:15:00Z",
      description: "Vendor confirmed appointment",
      completed: true
    },
    {
      status: "en_route",
      timestamp: "2026-01-15T09:30:00Z",
      description: "Vendor is on the way to your location",
      completed: true
    },
    {
      status: "arrived",
      timestamp: "2026-01-15T09:55:00Z",
      description: "Vendor has arrived at your location",
      completed: true
    },
    {
      status: "in_progress",
      timestamp: "2026-01-15T10:05:00Z",
      description: "Service is currently in progress",
      completed: true
    },
    {
      status: "completed",
      timestamp: null,
      description: "Service completed successfully",
      completed: false
    }
  ]
};

const OrderTracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute for live updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getStatusProgress = (status: string) => {
    const statusOrder = ["booked", "confirmed", "en_route", "arrived", "in_progress", "completed"];
    const currentIndex = statusOrder.indexOf(status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "booked": return "bg-blue-500";
      case "confirmed": return "bg-yellow-500";
      case "en_route": return "bg-orange-500";
      case "arrived": return "bg-purple-500";
      case "in_progress": return "bg-green-500";
      case "completed": return "bg-emerald-500";
      default: return "bg-gray-500";
    }
  };

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return "Pending";
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/customer/bookings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Link>
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Tracking Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Order #{mockOrderTracking.id}</CardTitle>
                    <p className="text-muted-foreground">{mockOrderTracking.serviceName}</p>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {mockOrderTracking.status.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>Progress</span>
                      <span>{Math.round(getStatusProgress(mockOrderTracking.status))}%</span>
                    </div>
                    <Progress value={getStatusProgress(mockOrderTracking.status)} className="h-3" />
                  </div>

                  {/* AI Insights */}
                  <div className="rounded-lg bg-gradient-to-r from-pink-50 to-rose-50 p-4 border">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">AI Insights</h3>
                      <Badge variant="outline" className="text-xs">
                        {mockOrderTracking.aiInsights.confidence}% confidence
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-blue-800">
                        <strong>Estimated Completion:</strong> {mockOrderTracking.aiInsights.eta}
                      </p>
                      <div>
                        <p className="text-blue-800 font-medium mb-1">Key Factors:</p>
                        <ul className="text-blue-700 space-y-1">
                          {mockOrderTracking.aiInsights.factors.map((factor, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-blue-800 font-medium mb-1">AI Recommendations:</p>
                        <ul className="text-blue-700 space-y-1">
                          {mockOrderTracking.aiInsights.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <Star className="h-3 w-3 text-yellow-500" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h3 className="font-semibold mb-4">Order Timeline</h3>
                    <div className="space-y-4">
                      {mockOrderTracking.timeline.map((event, index) => (
                        <div key={index} className="flex gap-4">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            event.completed ? getStatusColor(event.status) : 'bg-gray-200'
                          }`}>
                            {event.completed ? (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            ) : (
                              <Clock className="h-4 w-4 text-gray-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${event.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {event.description}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatTime(event.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Service Details */}
            <Card>
              <CardHeader>
                <CardTitle>Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Wrench className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{mockOrderTracking.serviceName}</p>
                    <p className="text-sm text-muted-foreground">{mockOrderTracking.vendorName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm">{mockOrderTracking.date}</p>
                    <p className="text-sm text-muted-foreground">{mockOrderTracking.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <p className="text-sm">{mockOrderTracking.address}</p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-lg font-semibold">₹{mockOrderTracking.price}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Vendor */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Vendor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <span className="text-sm">{mockOrderTracking.vendorName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="text-sm">{mockOrderTracking.vendorPhone}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Truck className="h-4 w-4 mr-2" />
                  Reschedule Service
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Rate Service
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderTracking;