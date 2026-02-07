import { useEffect, useMemo, useState } from "react";
import { VendorLayout } from "@/components/layout/VendorLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  Building2,
  Bell,
  Shield,
  CreditCard,
  Camera,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiGetSettings, apiUpdateSettings } from "@/lib/api";

type VendorProfile = {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  website: string;
  // optional (if backend stores)
  avatarDataUrl?: string;
};

type VendorBusiness = {
  serviceRadius: string;
  currency: string;
  timezone: string;
  workingHours: { start: string; end: string };
  workingDays: string[];
};

type VendorNotifications = {
  emailBookings: boolean;
  emailMarketing: boolean;
  smsBookings: boolean;
  smsReminders: boolean;
  pushNotifications: boolean;
};

type VendorPayment = {
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  payoutSchedule: string;
};

type VendorSettingsDoc = {
  profile?: Partial<VendorProfile>;
  business?: Partial<VendorBusiness>;
  notifications?: Partial<VendorNotifications>;
  payment?: Partial<VendorPayment>;
  // security is usually not stored here (handled via dedicated endpoint)
};

const emptyProfile: VendorProfile = {
  businessName: "",
  ownerName: "",
  email: "",
  phone: "",
  address: "",
  bio: "",
  website: "",
};

const emptyBusiness: VendorBusiness = {
  serviceRadius: "",
  currency: "",
  timezone: "",
  workingHours: { start: "", end: "" },
  workingDays: [],
};

const emptyNotifications: VendorNotifications = {
  emailBookings: false,
  emailMarketing: false,
  smsBookings: false,
  smsReminders: false,
  pushNotifications: false,
};

const emptyPayment: VendorPayment = {
  bankName: "",
  accountNumber: "",
  routingNumber: "",
  payoutSchedule: "",
};

function toStringSafe(v: any) {
  if (v === null || v === undefined) return "";
  return String(v);
}

function mergeLoaded<T extends Record<string, any>>(base: T, loaded?: Partial<T>): T {
  if (!loaded) return base;
  const out: any = Array.isArray(base) ? [...(base as any)] : { ...base };

  for (const k of Object.keys(base)) {
    const bv = (base as any)[k];
    const lv = (loaded as any)[k];

    if (lv === undefined || lv === null) continue;

    if (Array.isArray(bv)) out[k] = Array.isArray(lv) ? lv : bv;
    else if (typeof bv === "boolean") out[k] = Boolean(lv);
    else if (typeof bv === "object" && bv && !Array.isArray(bv)) {
      out[k] = mergeLoaded(bv, lv);
    } else out[k] = toStringSafe(lv);
  }

  // keep extra fields from backend (future-proof)
  for (const k of Object.keys(loaded)) {
    if (!(k in out)) out[k] = (loaded as any)[k];
  }

  return out as T;
}

const VendorSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<null | string>(null);

  // states (NO hardcoded defaults)
  const [profileForm, setProfileForm] = useState<VendorProfile>(emptyProfile);
  const [businessSettings, setBusinessSettings] = useState<VendorBusiness>(emptyBusiness);
  const [notifications, setNotifications] = useState<VendorNotifications>(emptyNotifications);
  const [paymentSettings, setPaymentSettings] = useState<VendorPayment>(emptyPayment);

  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // store last loaded doc so saving a section doesn't wipe others
  const [loadedDoc, setLoadedDoc] = useState<VendorSettingsDoc>({});

  const daysOfWeek = useMemo(
    () => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    []
  );

  const disabled = useMemo(() => loading || !!savingKey, [loading, savingKey]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const settings = await apiGetSettings("vendor"); // returns "settings" object
        const doc = (settings || {}) as VendorSettingsDoc;
        setLoadedDoc(doc);

        // Prefer DB values; if missing, fall back to auth user (ONLY for name/email/businessName)
        const profileMerged = mergeLoaded(emptyProfile, doc.profile);
        const withAuth = {
          ...profileMerged,
          ownerName: profileMerged.ownerName || (user?.name || ""),
          email: profileMerged.email || (user?.email || ""),
          businessName: profileMerged.businessName || (user?.businessName || ""),
        };

        setProfileForm(withAuth);
        setBusinessSettings(mergeLoaded(emptyBusiness, doc.business));
        setNotifications(mergeLoaded(emptyNotifications, doc.notifications));
        setPaymentSettings(mergeLoaded(emptyPayment, doc.payment));

        const avatar = (doc.profile as any)?.avatarDataUrl;
        if (avatar) setAvatarPreview(String(avatar));
      } catch (e: any) {
        toast({
          title: "Failed to load settings",
          description: e?.message || "Please try again",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast, user?.name, user?.email, user?.businessName]);

  const saveSection = async (section: keyof VendorSettingsDoc) => {
    try {
      setSavingKey(section);

      const nextDoc: VendorSettingsDoc = {
        ...loadedDoc,
        profile: section === "profile" ? { ...profileForm, avatarDataUrl: avatarPreview || undefined } : loadedDoc.profile,
        business: section === "business" ? businessSettings : loadedDoc.business,
        notifications: section === "notifications" ? notifications : loadedDoc.notifications,
        payment: section === "payment" ? paymentSettings : loadedDoc.payment,
      };

      const updated = await apiUpdateSettings("vendor", nextDoc as any);
      const doc = (updated || nextDoc) as VendorSettingsDoc;
      setLoadedDoc(doc);

      // re-merge/normalize
      const profileMerged = mergeLoaded(emptyProfile, doc.profile);
      const withAuth = {
        ...profileMerged,
        ownerName: profileMerged.ownerName || (user?.name || ""),
        email: profileMerged.email || (user?.email || ""),
        businessName: profileMerged.businessName || (user?.businessName || ""),
      };

      setProfileForm(withAuth);
      setBusinessSettings(mergeLoaded(emptyBusiness, doc.business));
      setNotifications(mergeLoaded(emptyNotifications, doc.notifications));
      setPaymentSettings(mergeLoaded(emptyPayment, doc.payment));

      toast({
        title: "Saved",
        description: "Your settings have been updated successfully.",
      });
    } catch (e: any) {
      toast({
        title: "Save failed",
        description: e?.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setSavingKey(null);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Small safety: allow only <= 1.5MB to avoid huge localStorage/db payload
    if (file.size > 1.5 * 1024 * 1024) {
      toast({
        title: "Image too large",
        description: "Please upload an image under 1.5MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleChangePassword = () => {
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    if (securityForm.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters.",
        variant: "destructive",
      });
      return;
    }

    // NOTE: Your backend password update endpoint is not shown in api.ts.
    // If you have /auth/change-password, call it here.
    toast({
      title: "Password Change",
      description:
        "Frontend validation passed. Connect your backend change-password endpoint to finalize.",
    });

    setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion Requested",
      description: "We'll process your request as per policy.",
      variant: "destructive",
    });
    setDeleteModalOpen(false);
  };

  return (
    <VendorLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and business preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="business" className="gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Business</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Payment</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your business profile and contact details</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-muted">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
                      ) : (
                        <User className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                        disabled={disabled}
                      />
                    </label>
                  </div>

                  <div>
                    <p className="font-medium">Business Photo</p>
                    <p className="text-sm text-muted-foreground">Upload a logo or profile image</p>
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={profileForm.businessName}
                      onChange={(e) => setProfileForm({ ...profileForm, businessName: e.target.value })}
                      disabled={disabled}
                      placeholder="Your business name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <Input
                      id="ownerName"
                      value={profileForm.ownerName}
                      onChange={(e) => setProfileForm({ ...profileForm, ownerName: e.target.value })}
                      disabled={disabled}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      disabled={disabled}
                      placeholder="email@domain.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      disabled={disabled}
                      placeholder="+91..."
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Input
                      id="address"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      disabled={disabled}
                      placeholder="Address"
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="bio">Business Description</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      disabled={disabled}
                      placeholder="Describe your services..."
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                      id="website"
                      type="url"
                      value={profileForm.website}
                      onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                      disabled={disabled}
                      placeholder="https://"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => saveSection("profile")} disabled={disabled}>
                    <Save className="mr-2 h-4 w-4" />
                    {savingKey === "profile" ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Tab */}
          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Settings</CardTitle>
                <CardDescription>Configure your service area and working hours</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Service Radius (km)</Label>
                    <Input
                      type="number"
                      value={businessSettings.serviceRadius}
                      onChange={(e) =>
                        setBusinessSettings({ ...businessSettings, serviceRadius: e.target.value })
                      }
                      disabled={disabled}
                      placeholder="e.g. 25"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select
                      value={businessSettings.currency || undefined}
                      onValueChange={(value) =>
                        setBusinessSettings({ ...businessSettings, currency: value })
                      }
                      disabled={disabled}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={loading ? "Loading..." : "Select currency"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select
                      value={businessSettings.timezone || undefined}
                      onValueChange={(value) =>
                        setBusinessSettings({ ...businessSettings, timezone: value })
                      }
                      disabled={disabled}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={loading ? "Loading..." : "Select timezone"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">India (Asia/Kolkata)</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Working Hours</Label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Start Time</Label>
                      <Input
                        type="time"
                        value={businessSettings.workingHours.start}
                        onChange={(e) =>
                          setBusinessSettings({
                            ...businessSettings,
                            workingHours: { ...businessSettings.workingHours, start: e.target.value },
                          })
                        }
                        disabled={disabled}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">End Time</Label>
                      <Input
                        type="time"
                        value={businessSettings.workingHours.end}
                        onChange={(e) =>
                          setBusinessSettings({
                            ...businessSettings,
                            workingHours: { ...businessSettings.workingHours, end: e.target.value },
                          })
                        }
                        disabled={disabled}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Working Days</Label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                      <Button
                        key={day}
                        type="button"
                        variant={businessSettings.workingDays.includes(day) ? "default" : "outline"}
                        size="sm"
                        disabled={disabled}
                        onClick={() =>
                          setBusinessSettings((prev) => ({
                            ...prev,
                            workingDays: prev.workingDays.includes(day)
                              ? prev.workingDays.filter((d) => d !== day)
                              : [...prev.workingDays, day],
                          }))
                        }
                      >
                        {day.slice(0, 3)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => saveSection("business")} disabled={disabled}>
                    <Save className="mr-2 h-4 w-4" />
                    {savingKey === "business" ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to be notified</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Email Notifications</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Booking Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified about new bookings and status changes
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailBookings}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, emailBookings: checked })
                        }
                        disabled={disabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing & Promotions</p>
                        <p className="text-sm text-muted-foreground">
                          Receive tips, updates, and promotional content
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailMarketing}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, emailMarketing: checked })
                        }
                        disabled={disabled}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">SMS Notifications</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">New Bookings</p>
                        <p className="text-sm text-muted-foreground">
                          Instant SMS for new booking requests
                        </p>
                      </div>
                      <Switch
                        checked={notifications.smsBookings}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, smsBookings: checked })
                        }
                        disabled={disabled}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Booking Reminders</p>
                        <p className="text-sm text-muted-foreground">
                          Reminders before scheduled appointments
                        </p>
                      </div>
                      <Switch
                        checked={notifications.smsReminders}
                        onCheckedChange={(checked) =>
                          setNotifications({ ...notifications, smsReminders: checked })
                        }
                        disabled={disabled}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Push Notifications</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable Push Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive real-time notifications in your browser
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, pushNotifications: checked })
                      }
                      disabled={disabled}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => saveSection("notifications")} disabled={disabled}>
                    <Save className="mr-2 h-4 w-4" />
                    {savingKey === "notifications" ? "Saving..." : "Save Preferences"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPasswords.current ? "text" : "password"}
                      value={securityForm.currentPassword}
                      onChange={(e) =>
                        setSecurityForm({ ...securityForm, currentPassword: e.target.value })
                      }
                      disabled={disabled}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0"
                      onClick={() => setShowPasswords((p) => ({ ...p, current: !p.current }))}
                      disabled={disabled}
                    >
                      {showPasswords.current ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPasswords.new ? "text" : "password"}
                      value={securityForm.newPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                      disabled={disabled}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0"
                      onClick={() => setShowPasswords((p) => ({ ...p, new: !p.new }))}
                      disabled={disabled}
                    >
                      {showPasswords.new ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPasswords.confirm ? "text" : "password"}
                      value={securityForm.confirmPassword}
                      onChange={(e) =>
                        setSecurityForm({ ...securityForm, confirmPassword: e.target.value })
                      }
                      disabled={disabled}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0"
                      onClick={() => setShowPasswords((p) => ({ ...p, confirm: !p.confirm }))}
                      disabled={disabled}
                    >
                      {showPasswords.confirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleChangePassword} disabled={disabled}>
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Permanently delete your account and all associated data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={() => setDeleteModalOpen(true)} disabled={disabled}>
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Manage your payout information</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Bank Name</Label>
                    <Input
                      value={paymentSettings.bankName}
                      onChange={(e) =>
                        setPaymentSettings({ ...paymentSettings, bankName: e.target.value })
                      }
                      disabled={disabled}
                      placeholder="Bank name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Account Number</Label>
                    <Input
                      value={paymentSettings.accountNumber}
                      onChange={(e) =>
                        setPaymentSettings({ ...paymentSettings, accountNumber: e.target.value })
                      }
                      disabled={disabled}
                      placeholder="Account number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Routing Number</Label>
                    <Input
                      value={paymentSettings.routingNumber}
                      onChange={(e) =>
                        setPaymentSettings({ ...paymentSettings, routingNumber: e.target.value })
                      }
                      disabled={disabled}
                      placeholder="Routing/IFSC"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Payout Schedule</Label>
                    <Select
                      value={paymentSettings.payoutSchedule || undefined}
                      onValueChange={(value) =>
                        setPaymentSettings({ ...paymentSettings, payoutSchedule: value })
                      }
                      disabled={disabled}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={loading ? "Loading..." : "Select schedule"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => saveSection("payment")} disabled={disabled}>
                    <Save className="mr-2 h-4 w-4" />
                    {savingKey === "payment" ? "Saving..." : "Save Payment Info"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Account Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All your services, bookings, and data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please type <strong>DELETE</strong> to confirm.
            </p>
            <Input placeholder="Type DELETE to confirm" disabled={disabled} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)} disabled={disabled}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={disabled}>
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </VendorLayout>
  );
};

export default VendorSettings;
