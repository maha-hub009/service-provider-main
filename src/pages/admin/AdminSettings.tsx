import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Building, Bell, Shield, CreditCard, Palette, Save } from "lucide-react";
import { toast } from "sonner";
import { apiGetSettings, apiUpdateSettings } from "@/lib/api";

type GeneralSettings = {
  platformName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  currency: string;
  timezone: string;
};

type NotificationSettings = {
  emailNotifications: boolean;
  newBookingAlert: boolean;
  vendorApprovalAlert: boolean;
  paymentAlert: boolean;
  weeklyReport: boolean;
  monthlyReport: boolean;
};

type CommissionSettings = {
  platformFee: string;
  minBookingAmount: string;
  paymentMethods: string[];
  autoPayouts: boolean;
  payoutSchedule: string;
};

type SecuritySettings = {
  twoFactorAuth: boolean;
  sessionTimeout: string;
  passwordPolicy: string;
  loginAttempts: string;
};

type AppearanceSettings = {
  primaryColor: string;
  accentColor: string;
  darkMode: boolean;
  showBanner: boolean;
  bannerText: string;
};

type AdminSettingsDoc = {
  general?: Partial<GeneralSettings>;
  notifications?: Partial<NotificationSettings>;
  commission?: Partial<CommissionSettings>;
  security?: Partial<SecuritySettings>;
  appearance?: Partial<AppearanceSettings>;
};

const emptyGeneral: GeneralSettings = {
  platformName: "",
  tagline: "",
  contactEmail: "",
  contactPhone: "",
  address: "",
  currency: "",
  timezone: "",
};

const emptyNotifications: NotificationSettings = {
  emailNotifications: false,
  newBookingAlert: false,
  vendorApprovalAlert: false,
  paymentAlert: false,
  weeklyReport: false,
  monthlyReport: false,
};

const emptyCommission: CommissionSettings = {
  platformFee: "",
  minBookingAmount: "",
  paymentMethods: [],
  autoPayouts: false,
  payoutSchedule: "",
};

const emptySecurity: SecuritySettings = {
  twoFactorAuth: false,
  sessionTimeout: "",
  passwordPolicy: "",
  loginAttempts: "",
};

const emptyAppearance: AppearanceSettings = {
  primaryColor: "",
  accentColor: "",
  darkMode: false,
  showBanner: false,
  bannerText: "",
};

function toStringSafe(v: any) {
  if (v === null || v === undefined) return "";
  return String(v);
}

function mergeLoaded<T extends Record<string, any>>(base: T, loaded?: Partial<T>): T {
  if (!loaded) return base;
  const out: any = { ...base };
  for (const k of Object.keys(base)) {
    const lv = (loaded as any)[k];
    if (lv === undefined || lv === null) continue;

    if (Array.isArray(base[k])) out[k] = Array.isArray(lv) ? lv : base[k];
    else if (typeof base[k] === "boolean") out[k] = Boolean(lv);
    else out[k] = toStringSafe(lv);
  }
  // include any extra keys from backend without breaking
  for (const k of Object.keys(loaded)) {
    if (!(k in out)) out[k] = (loaded as any)[k];
  }
  return out as T;
}

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<null | string>(null);

  // states (no hardcoded default values; only loaded from DB or blank)
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(emptyGeneral);
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>(emptyNotifications);
  const [commissionSettings, setCommissionSettings] =
    useState<CommissionSettings>(emptyCommission);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(emptySecurity);
  const [appearanceSettings, setAppearanceSettings] =
    useState<AppearanceSettings>(emptyAppearance);

  // keep last loaded raw doc to avoid overwriting other sections when saving
  const [loadedDoc, setLoadedDoc] = useState<AdminSettingsDoc>({});

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const settings = await apiGetSettings("admin"); // returns AppSettings object (we store nested keys)
        const doc = (settings || {}) as AdminSettingsDoc;
        setLoadedDoc(doc);

        setGeneralSettings(mergeLoaded(emptyGeneral, doc.general));
        setNotificationSettings(mergeLoaded(emptyNotifications, doc.notifications));
        setCommissionSettings(mergeLoaded(emptyCommission, doc.commission));
        setSecuritySettings(mergeLoaded(emptySecurity, doc.security));
        setAppearanceSettings(mergeLoaded(emptyAppearance, doc.appearance));
      } catch (e: any) {
        toast.error(e?.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const disabled = useMemo(() => loading || !!savingKey, [loading, savingKey]);

  const saveSection = async (section: keyof AdminSettingsDoc) => {
    try {
      setSavingKey(section);

      const nextDoc: AdminSettingsDoc = {
        ...loadedDoc,
        [section]:
          section === "general"
            ? generalSettings
            : section === "notifications"
              ? notificationSettings
              : section === "commission"
                ? commissionSettings
                : section === "security"
                  ? securitySettings
                  : appearanceSettings,
      };

      // persist full doc (safe; prevents losing other keys)
      const updated = await apiUpdateSettings("admin", nextDoc as any);

      // reflect saved server state
      const doc = (updated || nextDoc) as AdminSettingsDoc;
      setLoadedDoc(doc);

      // re-merge to ensure booleans/arrays normalized
      setGeneralSettings(mergeLoaded(emptyGeneral, doc.general));
      setNotificationSettings(mergeLoaded(emptyNotifications, doc.notifications));
      setCommissionSettings(mergeLoaded(emptyCommission, doc.commission));
      setSecuritySettings(mergeLoaded(emptySecurity, doc.security));
      setAppearanceSettings(mergeLoaded(emptyAppearance, doc.appearance));

      toast.success("Settings saved successfully");
    } catch (e: any) {
      toast.error(e?.message || "Failed to save settings");
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your platform settings and preferences</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="flex-wrap">
            <TabsTrigger value="general" className="gap-2">
              <Building className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="commission" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Commission
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure your platform's basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input
                      id="platformName"
                      value={generalSettings.platformName}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({ ...prev, platformName: e.target.value }))
                      }
                      disabled={disabled}
                      placeholder="e.g. Service Provider"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={generalSettings.tagline}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({ ...prev, tagline: e.target.value }))
                      }
                      disabled={disabled}
                      placeholder="e.g. Your one-stop solution"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({ ...prev, contactEmail: e.target.value }))
                      }
                      disabled={disabled}
                      placeholder="support@yourapp.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      value={generalSettings.contactPhone}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({ ...prev, contactPhone: e.target.value }))
                      }
                      disabled={disabled}
                      placeholder="+91 ..."
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={generalSettings.address}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({ ...prev, address: e.target.value }))
                      }
                      disabled={disabled}
                      placeholder="Office / Support address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={generalSettings.currency || undefined}
                      onValueChange={(value) =>
                        setGeneralSettings((prev) => ({ ...prev, currency: value }))
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
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={generalSettings.timezone || undefined}
                      onValueChange={(value) =>
                        setGeneralSettings((prev) => ({ ...prev, timezone: value }))
                      }
                      disabled={disabled}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={loading ? "Loading..." : "Select timezone"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">India (Asia/Kolkata)</SelectItem>
                        <SelectItem value="America/New_York">Eastern (US)</SelectItem>
                        <SelectItem value="America/Chicago">Central (US)</SelectItem>
                        <SelectItem value="America/Denver">Mountain (US)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific (US)</SelectItem>
                        <SelectItem value="Europe/London">London</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => saveSection("general")} disabled={disabled}>
                    <Save className="mr-2 h-4 w-4" />
                    {savingKey === "general" ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          emailNotifications: checked,
                        }))
                      }
                      disabled={disabled}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Booking Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when a new booking is made
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.newBookingAlert}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          newBookingAlert: checked,
                        }))
                      }
                      disabled={disabled}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Vendor Approval Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when a vendor requests approval
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.vendorApprovalAlert}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          vendorApprovalAlert: checked,
                        }))
                      }
                      disabled={disabled}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment Alerts</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified about payment transactions
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.paymentAlert}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          paymentAlert: checked,
                        }))
                      }
                      disabled={disabled}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Weekly Report</p>
                      <p className="text-sm text-muted-foreground">
                        Receive weekly summary reports
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyReport}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          weeklyReport: checked,
                        }))
                      }
                      disabled={disabled}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Monthly Report</p>
                      <p className="text-sm text-muted-foreground">
                        Receive monthly summary reports
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.monthlyReport}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          monthlyReport: checked,
                        }))
                      }
                      disabled={disabled}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => saveSection("notifications")} disabled={disabled}>
                    <Save className="mr-2 h-4 w-4" />
                    {savingKey === "notifications" ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commission Settings */}
          <TabsContent value="commission">
            <Card>
              <CardHeader>
                <CardTitle>Commission & Payment Settings</CardTitle>
                <CardDescription>Configure platform fees and payment options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="platformFee">Platform Fee (%)</Label>
                    <Input
                      id="platformFee"
                      type="number"
                      min="0"
                      max="100"
                      value={commissionSettings.platformFee}
                      onChange={(e) =>
                        setCommissionSettings((prev) => ({
                          ...prev,
                          platformFee: e.target.value,
                        }))
                      }
                      disabled={disabled}
                      placeholder="e.g. 10"
                    />
                    <p className="text-xs text-muted-foreground">
                      Commission charged on each booking
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minBookingAmount">Minimum Booking Amount</Label>
                    <Input
                      id="minBookingAmount"
                      type="number"
                      min="0"
                      value={commissionSettings.minBookingAmount}
                      onChange={(e) =>
                        setCommissionSettings((prev) => ({
                          ...prev,
                          minBookingAmount: e.target.value,
                        }))
                      }
                      disabled={disabled}
                      placeholder="e.g. 200"
                    />
                    <p className="text-xs text-muted-foreground">Minimum amount for a booking</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payoutSchedule">Payout Schedule</Label>
                    <Select
                      value={commissionSettings.payoutSchedule || undefined}
                      onValueChange={(value) =>
                        setCommissionSettings((prev) => ({
                          ...prev,
                          payoutSchedule: value,
                        }))
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

                  <div className="flex items-end">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="autoPayouts"
                        checked={commissionSettings.autoPayouts}
                        onCheckedChange={(checked) =>
                          setCommissionSettings((prev) => ({
                            ...prev,
                            autoPayouts: checked,
                          }))
                        }
                        disabled={disabled}
                      />
                      <Label htmlFor="autoPayouts">Automatic Payouts</Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Accepted Payment Methods</Label>
                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      { id: "card", label: "Credit/Debit Card" },
                      { id: "bank", label: "Bank Transfer" },
                      { id: "wallet", label: "Digital Wallet" },
                    ].map((method) => (
                      <div key={method.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={method.id}
                          checked={commissionSettings.paymentMethods.includes(method.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCommissionSettings((prev) => ({
                                ...prev,
                                paymentMethods: [...prev.paymentMethods, method.id],
                              }));
                            } else {
                              setCommissionSettings((prev) => ({
                                ...prev,
                                paymentMethods: prev.paymentMethods.filter((m) => m !== method.id),
                              }));
                            }
                          }}
                          className="h-4 w-4 rounded border-border"
                          disabled={disabled}
                        />
                        <Label htmlFor={method.id}>{method.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => saveSection("commission")} disabled={disabled}>
                    <Save className="mr-2 h-4 w-4" />
                    {savingKey === "commission" ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security and authentication options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for admin accounts
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          twoFactorAuth: checked,
                        }))
                      }
                      disabled={disabled}
                    />
                  </div>

                  <Separator />

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        min="5"
                        max="120"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            sessionTimeout: e.target.value,
                          }))
                        }
                        disabled={disabled}
                        placeholder="e.g. 30"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                      <Input
                        id="loginAttempts"
                        type="number"
                        min="3"
                        max="10"
                        value={securitySettings.loginAttempts}
                        onChange={(e) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            loginAttempts: e.target.value,
                          }))
                        }
                        disabled={disabled}
                        placeholder="e.g. 5"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="passwordPolicy">Password Policy</Label>
                      <Select
                        value={securitySettings.passwordPolicy || undefined}
                        onValueChange={(value) =>
                          setSecuritySettings((prev) => ({
                            ...prev,
                            passwordPolicy: value,
                          }))
                        }
                        disabled={disabled}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={loading ? "Loading..." : "Select policy"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                          <SelectItem value="medium">Medium (mixed case)</SelectItem>
                          <SelectItem value="strong">Strong (symbols + numbers)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => saveSection("security")} disabled={disabled}>
                    <Save className="mr-2 h-4 w-4" />
                    {savingKey === "security" ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of your platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={appearanceSettings.primaryColor || "#000000"}
                        onChange={(e) =>
                          setAppearanceSettings((prev) => ({
                            ...prev,
                            primaryColor: e.target.value,
                          }))
                        }
                        className="h-10 w-20 cursor-pointer"
                        disabled={disabled}
                      />
                      <Input
                        value={appearanceSettings.primaryColor}
                        onChange={(e) =>
                          setAppearanceSettings((prev) => ({
                            ...prev,
                            primaryColor: e.target.value,
                          }))
                        }
                        className="flex-1"
                        disabled={disabled}
                        placeholder="#4F46E5"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accentColor"
                        type="color"
                        value={appearanceSettings.accentColor || "#000000"}
                        onChange={(e) =>
                          setAppearanceSettings((prev) => ({
                            ...prev,
                            accentColor: e.target.value,
                          }))
                        }
                        className="h-10 w-20 cursor-pointer"
                        disabled={disabled}
                      />
                      <Input
                        value={appearanceSettings.accentColor}
                        onChange={(e) =>
                          setAppearanceSettings((prev) => ({
                            ...prev,
                            accentColor: e.target.value,
                          }))
                        }
                        className="flex-1"
                        disabled={disabled}
                        placeholder="#F59E0B"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">
                        Enable dark mode for the admin panel
                      </p>
                    </div>
                    <Switch
                      checked={appearanceSettings.darkMode}
                      onCheckedChange={(checked) =>
                        setAppearanceSettings((prev) => ({
                          ...prev,
                          darkMode: checked,
                        }))
                      }
                      disabled={disabled}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Banner</p>
                      <p className="text-sm text-muted-foreground">
                        Display announcement banner on the homepage
                      </p>
                    </div>
                    <Switch
                      checked={appearanceSettings.showBanner}
                      onCheckedChange={(checked) =>
                        setAppearanceSettings((prev) => ({
                          ...prev,
                          showBanner: checked,
                        }))
                      }
                      disabled={disabled}
                    />
                  </div>

                  {appearanceSettings.showBanner && (
                    <div className="space-y-2">
                      <Label htmlFor="bannerText">Banner Text</Label>
                      <Textarea
                        id="bannerText"
                        value={appearanceSettings.bannerText}
                        onChange={(e) =>
                          setAppearanceSettings((prev) => ({
                            ...prev,
                            bannerText: e.target.value,
                          }))
                        }
                        disabled={disabled}
                        placeholder="Announcement text..."
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => saveSection("appearance")} disabled={disabled}>
                    <Save className="mr-2 h-4 w-4" />
                    {savingKey === "appearance" ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
