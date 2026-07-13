import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Settings, Sliders } from "lucide-react";
import { Link } from "react-router-dom";

const AdminHome = () => {
  return (
    <AdminLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              Manage users, block/unblock and review reports.
              <div className="mt-4">
                <Button asChild variant="ghost">
                  <Link to="/admin/users">Open Users</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vendors</CardTitle>
            </CardHeader>
            <CardContent>
              Review vendor applications and verify listings.
              <div className="mt-4">
                <Button asChild variant="ghost">
                  <Link to="/admin/vendors">Open Vendors</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              Platform settings and appearance controls.
              <div className="mt-4">
                <Button asChild variant="ghost">
                  <Link to="/admin/settings">Open Settings</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminHome;
