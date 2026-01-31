import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiCategories } from "@/lib/api";

const AdminCategories = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [cats, setCats] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await apiCategories();
        setCats(data);
      } catch (e: any) {
        toast({ title: "Failed to load categories", description: e?.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-muted-foreground">
                <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                <p className="mt-2">Loading…</p>
              </div>
            ) : (
              <div className="space-y-6">
                {cats.map((c) => (
                  <div key={c.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-lg">{c.name}</div>
                        <div className="text-sm text-muted-foreground">{c.description}</div>
                      </div>
                      <Badge variant="outline">{c.id}</Badge>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {c.subcategories?.map((s: any) => (
                        <div key={s.id} className="rounded-md border p-3">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{s.name}</div>
                            <Badge variant="outline">₹{s.basePrice}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">{s.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {cats.length === 0 ? (
                  <div className="py-10 text-center text-muted-foreground">No categories found.</div>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;
