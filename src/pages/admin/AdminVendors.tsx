import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Search, ShieldCheck, ShieldX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiAdminUnverifyVendor, apiAdminVendors, apiAdminVerifyVendor } from "@/lib/api";

const AdminVendors = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await apiAdminVendors();
        setItems(data);
      } catch (e: any) {
        toast({ title: "Failed to load vendors", description: e?.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((v) =>
      `${v.businessName} ${v.user?.name} ${v.user?.email} ${v.user?.phone}`.toLowerCase().includes(s)
    );
  }, [items, q]);

  const toggleVerify = async (v: any) => {
    try {
      if (!v.isVerified) {
        await apiAdminVerifyVendor(v._id);
        setItems((prev) => prev.map((x) => (x._id === v._id ? { ...x, isVerified: true } : x)));
        toast({ title: "Vendor verified" });
      } else {
        await apiAdminUnverifyVendor(v._id);
        setItems((prev) => prev.map((x) => (x._id === v._id ? { ...x, isVerified: false } : x)));
        toast({ title: "Vendor unverified" });
      }
    } catch (e: any) {
      toast({ title: "Action failed", description: e?.message, variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle>Vendors</CardTitle>
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" />
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">
                <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                <p className="mt-2">Loading…</p>
              </div>
            ) : (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filtered.map((v) => (
                      <TableRow key={v._id}>
                        <TableCell className="font-medium">{v.businessName}</TableCell>
                        <TableCell>{v.user?.name}</TableCell>
                        <TableCell>{v.user?.phone}</TableCell>
                        <TableCell>
                          <Badge variant={v.isVerified ? "default" : "outline"}>
                            {v.isVerified ? "Verified" : "Not verified"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => toggleVerify(v)}>
                            {v.isVerified ? (
                              <>
                                <ShieldX className="h-4 w-4 mr-2" /> Unverify
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="h-4 w-4 mr-2" /> Verify
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}

                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                          No vendors found.
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminVendors;
