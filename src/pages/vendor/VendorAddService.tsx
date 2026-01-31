import { useEffect, useMemo, useState } from "react";
import { VendorLayout } from "@/components/layout/VendorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { apiGetService, apiVendorCreateService, apiVendorUpdateService } from "@/lib/api";

const VendorAddService = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const editId = sp.get("edit");

  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(!!editId);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("home-services");
  const [subcategory, setSubcategory] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [durationMinutes, setDurationMinutes] = useState<number>(60);

  const subcategories = useMemo(() => {
    const cat = SERVICE_CATEGORIES.find((c) => c.id === category);
    return cat?.subcategories || [];
  }, [category]);

  useEffect(() => {
    if (!subcategory && subcategories.length) setSubcategory(subcategories[0].id);
  }, [subcategories, subcategory]);

  useEffect(() => {
    async function init() {
      if (!editId) return;
      try {
        setInitializing(true);
        const s = await apiGetService(editId);
        setName(s.name || "");
        setDescription(s.description || "");
        setCategory(s.category || "home-services");
        setSubcategory(s.subcategory || "");
        setPrice(s.price || 0);
        setDurationMinutes(s.durationMinutes || 60);
      } catch (e: any) {
        toast({ title: "Failed to load service", description: e?.message, variant: "destructive" });
      } finally {
        setInitializing(false);
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  const submit = async () => {
    if (!name.trim()) {
      toast({ title: "Name required", description: "Enter service name.", variant: "destructive" });
      return;
    }
    if (!subcategory) {
      toast({ title: "Select subcategory", description: "Choose subcategory.", variant: "destructive" });
      return;
    }
    if (!price || price < 0) {
      toast({ title: "Invalid price", description: "Enter a valid price.", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: name.trim(),
        description: description.trim(),
        category,
        subcategory,
        price,
        durationMinutes,
      };

      if (editId) {
        await apiVendorUpdateService(editId, payload);
        toast({ title: "Updated", description: "Service updated successfully." });
      } else {
        await apiVendorCreateService(payload);
        toast({ title: "Created", description: "Service created successfully." });
      }

      navigate("/vendor/services");
    } catch (e: any) {
      toast({ title: "Save failed", description: e?.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VendorLayout>
      <div className="max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>{editId ? "Edit Service" : "Add New Service"}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {initializing ? (
              <div className="py-10 text-center text-muted-foreground">
                <Loader2 className="mx-auto h-7 w-7 animate-spin" />
                <p className="mt-2">Loading…</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Service Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Eg: Premium AC Service" />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Explain what you provide..."
                    rows={4}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <select
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {SERVICE_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Subcategory</Label>
                    <select
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                    >
                      {subcategories.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      min={0}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      min={15}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => navigate("/vendor/services")}>Cancel</Button>
                  <Button onClick={submit} disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    {editId ? "Update Service" : "Create Service"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </VendorLayout>
  );
};

export default VendorAddService;
