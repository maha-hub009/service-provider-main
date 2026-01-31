import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Search, Ban, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiAdminBlockUser, apiAdminUnblockUser, apiAdminUsers } from "@/lib/api";

const AdminUsers = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await apiAdminUsers();
        setItems(data);
      } catch (e: any) {
        toast({ title: "Failed to load users", description: e?.message, variant: "destructive" });
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
    return items.filter((u) => `${u.name} ${u.email} ${u.phone}`.toLowerCase().includes(s));
  }, [items, q]);

  const toggleBlock = async (u: any) => {
    try {
      if (u.status === "active") {
        await apiAdminBlockUser(u._id);
        setItems((prev) => prev.map((x) => (x._id === u._id ? { ...x, status: "blocked" } : x)));
        toast({ title: "User blocked" });
      } else {
        await apiAdminUnblockUser(u._id);
        setItems((prev) => prev.map((x) => (x._id === u._id ? { ...x, status: "active" } : x)));
        toast({ title: "User unblocked" });
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
            <CardTitle>Users</CardTitle>
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
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filtered.map((u) => (
                      <TableRow key={u._id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>{u.phone}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {u.role === "user" ? "customer" : u.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={u.status === "active" ? "default" : "destructive"}>
                            {u.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => toggleBlock(u)}>
                            {u.status === "active" ? (
                              <>
                                <Ban className="h-4 w-4 mr-2" /> Block
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-2" /> Unblock
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}

                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                          No users found.
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

export default AdminUsers;
