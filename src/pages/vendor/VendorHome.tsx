import { VendorLayout } from "@/components/layout/VendorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Box, PlusCircle, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const VendorHome = () => {
  return (
    <VendorLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-4">Vendor Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>My Services</CardTitle>
            </CardHeader>
            <CardContent>
              Manage your offered services and pricing.
              <div className="mt-4">
                <Button asChild variant="ghost">
                  <Link to="/vendor/services">Open Services</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              View and accept bookings from customers.
              <div className="mt-4">
                <Button asChild variant="ghost">
                  <Link to="/vendor/bookings">Open Bookings</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Service</CardTitle>
            </CardHeader>
            <CardContent>
              Quickly add new offerings and update availability.
              <div className="mt-4">
                <Button asChild variant="ghost">
                  <Link to="/vendor/add-service">Add Service</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorHome;
