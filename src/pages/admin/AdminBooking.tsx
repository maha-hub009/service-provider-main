import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiAdminBookings, apiAdminUpdateBookingStatus, Booking } from "@/lib/api";

const AdminBookings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [data, setData] = useState<{ items: Booking[]; total: number; totalPages: number }>({
    items: [],
    total: 0,
    totalPages: 1,
  });

  const load = async (p = page) => {
    try {
      setLoading(true);
      const res = await apiAdminBookings({ page: p, limit });
      setData({ items: res.items, total: res.total, totalPages: res.totalPages });
      setPage(res.page);
    } catch (e: any) {
      toast({ title: "Failed to load bookings", description: e?.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setStatus = async (id: string, status: string) => {
    try {
      const updated = await apiAdminUpdateBookingStatus(id, status);
      setData((prev) => ({
        ...prev,
        items: prev.items.map((b) => (b._id === id ? updated : b)),
      }));
      toast({ title: "Updated", description: "Booking status updated." });
    } catch (e: any) {
      toast({ title: "Update failed", description: e?.message, variant: "destructive" });
    }
  };

  const statusBadge = (s: string) => {
    if (s === "pending") return <Badge variant="outline">Pending</Badge>;
    if (s === "accepted") return <Badge>Accepted</Badge>;
    if (s === "completed") return <Badge className="bg-green-600 text-white">Completed</Badge>;
    if (s === "cancelled") return <Badge variant="destructive">Cancelled</Badge>;
    return <Badge variant="outline">{s}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <CardTitle>Bookings</CardTitle>
            <div className="text-sm text-muted-foreground">
              Total: {data.total}
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">
                <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                <p className="mt-2">Loading…</p>
              </div>
            ) : (
              <>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {data.items.map((b) => (
                        <TableRow key={b._id}>
                          <TableCell className="font-medium">{b.service?.name || "Service"}</TableCell>
                          <TableCell>{b.user?.name || "User"}</TableCell>
                          <TableCell>{b.vendor?.user?.name || b.vendor?.businessName || "Vendor"}</TableCell>
                          <TableCell>{statusBadge(b.status)}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button size="sm" variant="outline" onClick={() => setStatus(b._id, "accepted")}>
                              Accept
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setStatus(b._id, "completed")}>
                              Complete
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => setStatus(b._id, "cancelled")}>
                              Cancel
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}

                      {data.items.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                            No bookings found.
                          </TableCell>
                        </TableRow>
                      ) : null}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <Button variant="outline" disabled={page <= 1} onClick={() => load(page - 1)}>
                    Prev
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Page {page} / {data.totalPages}
                  </div>
                  <Button variant="outline" disabled={page >= data.totalPages} onClick={() => load(page + 1)}>
                    Next
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;
