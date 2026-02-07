/* =========================
   VendorBookings.tsx (FULL UPDATED)
   - Adds Customer ↔ Vendor Chat per booking
   - Keeps existing flow (status update)
========================= */

import { useEffect, useMemo, useState } from "react";
import { VendorLayout } from "@/components/layout/VendorLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Send,
  RefreshCcw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  apiVendorBookings,
  apiVendorUpdateBookingStatus,
  Booking,
  apiGetOrCreateThread,
  apiListMessages,
  apiSendMessage,
  ChatMessage,
} from "@/lib/api";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pending", color: "border-warning text-warning", icon: Clock },
  accepted: { label: "Accepted", color: "bg-primary text-primary-foreground", icon: CheckCircle },
  completed: { label: "Completed", color: "bg-green-600 text-white", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-destructive text-destructive-foreground", icon: XCircle },
};

function fmtTime(ts: string) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function fmtDateTime(ts: string) {
  const d = new Date(ts);
  return `${d.toLocaleDateString()} • ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

function MessageBubble({ m }: { m: ChatMessage }) {
  const mine = m.senderRole === "vendor" || m.senderRole === "admin"; // vendor side
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm",
          mine ? "bg-primary text-primary-foreground" : "bg-muted",
        ].join(" ")}
      >
        <div className="whitespace-pre-wrap">{m.text}</div>
        <div className={`mt-1 text-[10px] ${mine ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
          {fmtTime(m.createdAt)}
        </div>
      </div>
    </div>
  );
}

function ChatDialog({
  open,
  onOpenChange,
  booking,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  booking: Booking | null;
}) {
  const { toast } = useToast();
  const [threadId, setThreadId] = useState<string>("");
  const [items, setItems] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const load = async () => {
    if (!booking?._id) return;
    try {
      setLoading(true);
      const thread = await apiGetOrCreateThread(booking._id);
      setThreadId(thread._id);
      const msgs = await apiListMessages(thread._id);
      setItems(msgs);
    } catch (e: any) {
      toast({ title: "Chat error", description: e?.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, booking?._id]);

  const send = async () => {
    if (!threadId || !text.trim()) return;
    try {
      setSending(true);
      const msg = await apiSendMessage(threadId, text.trim());
      setItems((p) => [...p, msg]);
      setText("");
    } catch (e: any) {
      toast({ title: "Send failed", description: e?.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Chat with Customer
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <div className="rounded-lg border bg-background">
            <div className="flex items-center justify-between border-b px-3 py-2">
              <div className="text-sm">
                <span className="font-medium">{booking?.user?.name || "Customer"}</span>
                <span className="text-muted-foreground"> • {booking?.service?.name || "Service"}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
                <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            <div className="h-[340px] overflow-auto p-3 space-y-2">
              {loading ? (
                <div className="py-10 text-center text-sm text-muted-foreground">Loading chat…</div>
              ) : items.length === 0 ? (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  No messages yet. Say hi 👋
                </div>
              ) : (
                items.map((m) => <MessageBubble key={m._id} m={m} />)
              )}
            </div>
          </div>

          <Separator />

          <div className="flex gap-2">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message…"
              className="min-h-[44px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <Button onClick={send} disabled={sending || !text.trim()}>
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const VendorBookings = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await apiVendorBookings();
        setBookings(data);
      } catch (e: any) {
        toast({ title: "Failed to load bookings", description: e?.message, variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const serviceName = b.service?.name || "";
      const customerName = b.user?.name || "";
      const matchesSearch =
        serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" ? true : b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  const openView = (b: Booking) => {
    setSelectedBooking(b);
    setViewModalOpen(true);
  };

  const openUpdate = (b: Booking) => {
    setSelectedBooking(b);
    setNewStatus(b.status);
    setUpdateModalOpen(true);
  };

  const openChat = (b: Booking) => {
    setSelectedBooking(b);
    setChatOpen(true);
  };

  const saveStatus = async () => {
    if (!selectedBooking?._id) return;
    try {
      const updated = await apiVendorUpdateBookingStatus(selectedBooking._id, newStatus);
      setBookings((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
      toast({ title: "Updated", description: "Booking status updated successfully." });
      setUpdateModalOpen(false);
    } catch (e: any) {
      toast({ title: "Update failed", description: e?.message, variant: "destructive" });
    }
  };

  const renderStatus = (status: string) => {
    const cfg =
      statusConfig[status] || { label: status, color: "border-muted text-muted-foreground", icon: Clock };
    const Icon = cfg.icon;
    return (
      <Badge variant={status === "accepted" || status === "completed" ? "default" : "outline"} className={cfg.color}>
        <Icon className="h-3 w-3 mr-1" />
        {cfg.label}
      </Badge>
    );
  };

  return (
    <VendorLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by service or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="w-full md:w-56">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Schedule</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                            Loading…
                          </TableCell>
                        </TableRow>
                      ) : filteredBookings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                            No bookings found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredBookings.map((b) => (
                          <TableRow key={b._id}>
                            <TableCell className="font-medium">{b.service?.name || "Service"}</TableCell>
                            <TableCell>{b.user?.name || "Customer"}</TableCell>
                            <TableCell>{fmtDateTime(b.scheduledAt)}</TableCell>
                            <TableCell>{renderStatus(b.status)}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openView(b)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                  </DropdownMenuItem>

                                  <DropdownMenuItem onClick={() => openChat(b)}>
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Chat
                                  </DropdownMenuItem>

                                  <DropdownMenuItem onClick={() => openUpdate(b)}>
                                    Update Status
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* View Modal */}
        <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>

            {selectedBooking && (
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Service:</strong> {selectedBooking.service?.name}
                </div>
                <div>
                  <strong>Customer:</strong> {selectedBooking.user?.name} ({selectedBooking.user?.phone})
                </div>
                <div>
                  <strong>Address:</strong> {selectedBooking.address}
                </div>
                <div>
                  <strong>Status:</strong> {renderStatus(selectedBooking.status)}
                </div>
                <div>
                  <strong>Total:</strong> ₹{selectedBooking.totalPrice}
                </div>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                Close
              </Button>
              {selectedBooking && (
                <Button onClick={() => openChat(selectedBooking)}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Chat
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Update Modal */}
        <Dialog open={updateModalOpen} onOpenChange={setUpdateModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Status</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setUpdateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveStatus}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Chat Modal */}
        <ChatDialog open={chatOpen} onOpenChange={setChatOpen} booking={selectedBooking} />
      </div>
    </VendorLayout>
  );
};

export default VendorBookings;
