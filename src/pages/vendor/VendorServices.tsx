import { useEffect, useMemo, useState } from "react";
import { VendorLayout } from "@/components/layout/VendorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Loader2, Plus, Trash2, Pencil, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiVendorDeleteService, apiVendorMyServices, apiVendorUpdateService, ServiceDoc } from "@/lib/api";

const VendorServices = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ServiceDoc[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await apiVendorMyServices();
        setItems(data);
      } catch (e: any) {
        toast({ title: "Failed to load services", description: e?.message, variant: "destructive" });
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
    return items.filter((x) =>
      `${x.name} ${x.category} ${x.subcategory}`.toLowerCase().includes(s)
    );
  }, [items, q]);

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const updated = await apiVendorUpdateService(id, { isActive: !isActive });
      setItems((prev) => prev.map((x) => (x._id === id ? updated : x)));
      toast({ title: "Updated", description: `Service is now ${updated.isActive ? "Active" : "Inactive"}` });
    } catch (e: any) {
      toast({ title: "Update failed", description: e?.message, variant: "destructive" });
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this service?")) return;
    try {
      await apiVendorDeleteService(id);
      setItems((prev) => prev.filter((x) => x._id !== id));
      toast({ title: "Removed", description: "Service removed." });
    } catch (e: any) {
      toast({ title: "Delete failed", description: e?.message, variant: "destructive" });
    }
  };

  return (
    <VendorLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>My Services</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Manage your service offerings.</p>
            </div>
            <Button asChild>
              <Link to="/vendor/add-service">
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Link>
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search services…" />
            </div>

            {loading ? (
              <div className="py-10 text-center text-muted-foreground">
                <Loader2 className="mx-auto h-7 w-7 animate-spin" />
                <p className="mt-2">Loading…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-muted-foreground">No services yet.</p>
                <Button asChild className="mt-4">
                  <Link to="/vendor/services/add">Add your first service</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filtered.map((s) => (
                  <Card key={s._id} className="border">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold">{s.name}</div>
                          <div className="text-sm text-muted-foreground">{s.category} / {s.subcategory}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">₹{s.price}</div>
                          <Badge variant={s.isActive ? "default" : "outline"} className="mt-2">
                            {s.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>

                      {s.description ? <p className="text-sm text-muted-foreground line-clamp-2">{s.description}</p> : null}

                      <div className="flex items-center justify-between">
                        <Button variant="outline" size="sm" onClick={() => toggleActive(s._id, s.isActive)}>
                          {s.isActive ? "Deactivate" : "Activate"}
                        </Button>

                        <div className="flex gap-2">
                          <Button variant="outline" size="icon" asChild>
                            <Link to={`/vendor/add-service?edit=${s._id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => remove(s._id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
};

export default VendorServices;
