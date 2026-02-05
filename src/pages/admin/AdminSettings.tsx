import { useState, useEffect } from "react";
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
import {
  Building,
  Bell,
  Shield,
  CreditCard,
  Palette,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import {
  apiGetSettings,
  apiUpdateGeneralSettings,
  apiUpdateNotificationSettings,
  apiUpdateCommissionSettings,
  apiUpdateSecuritySettings,
  apiUpdateAppearanceSettings,
} from "@/lib/api";

const AdminSettings = () => {
  const [isLoading, setIsLoading] = useState(false);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    platformName: "Service Provider",
    tagline: "Your one-stop solution for all services",
    contactEmail: "support@serviceprovider.com",
    contactPhone: "+1 555-0100",
    address: "123 Business St, New York, NY 10001",
    currency: "USD",
    timezone: "America/New_York",
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newBookingAlert: true,
    vendorApprovalAlert: true,
    paymentAlert: true,
    weeklyReport: true,
    monthlyReport: false,
  });

  // Commission Settings
  const [commissionSettings, setCommissionSettings] = useState({
    platformFee: "10",
    minBookingAmount: "20",
    paymentMethods: ["card", "bank"],
    autoPayouts: true,
    payoutSchedule: "weekly",
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordPolicy: "strong",
    loginAttempts: "5",
  });

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    primaryColor: "#4F46E5",
    accentColor: "#F59E0B",
    darkMode: false,
    showBanner: true,
    bannerText: "Welcome to Service Provider - Your trusted service booking platform!",
  });

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const settings = await apiGetSettings();
        
        setGeneralSettings({
          platformName: settings.platformName,
          tagline: settings.tagline,
          contactEmail: settings.contactEmail,
          contactPhone: settings.contactPhone,
          address: settings.address,
          currency: settings.currency,
          timezone: settings.timezone,
        });

        setNotificationSettings({
          emailNotifications: settings.emailNotifications,
          newBookingAlert: settings.newBookingAlert,
          vendorApprovalAlert: settings.vendorApprovalAlert,
          paymentAlert: settings.paymentAlert,
          weeklyReport: settings.weeklyReport,
          monthlyReport: settings.monthlyReport,
        });

        setCommissionSettings({
          platformFee: String(settings.platformFee),
          minBookingAmount: String(settings.minBookingAmount),
          paymentMethods: settings.paymentMethods,
          autoPayouts: settings.autoPayouts,
          payoutSchedule: settings.payoutSchedule,
        });

        setSecuritySettings({
          twoFactorAuth: settings.twoFactorAuth,
          sessionTimeout: String(settings.sessionTimeout),
          passwordPolicy: settings.passwordPolicy,
          loginAttempts: String(settings.loginAttempts),
        });

        setAppearanceSettings({
          primaryColor: settings.primaryColor,
          accentColor: settings.accentColor,
          darkMode: settings.darkMode,
          showBanner: settings.showBanner,
          bannerText: settings.bannerText,
        });
      } catch (error) {
        console.error("Failed to load settings:", error);
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSaveGeneral = async () => {
    try {
      setIsLoading(true);
      await apiUpdateGeneralSettings(generalSettings);
      toast.success("General settings saved successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setIsLoading(true);
      await apiUpdateNotificationSettings(notificationSettings);
      toast.success("Notification settings saved successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCommission = async () => {
    try {
      setIsLoading(true);
      await apiUpdateCommissionSettings({
        platformFee: Number(commissionSettings.platformFee),
        minBookingAmount: Number(commissionSettings.minBookingAmount),
        paymentMethods: commissionSettings.paymentMethods,
        autoPayouts: commissionSettings.autoPayouts,
        payoutSchedule: commissionSettings.payoutSchedule,
      });
      toast.success("Commission settings saved successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSecurity = async () => {
    try {
      setIsLoading(true);
      await apiUpdateSecuritySettings({
        twoFactorAuth: securitySettings.twoFactorAuth,
        sessionTimeout: Number(securitySettings.sessionTimeout),
        passwordPolicy: securitySettings.passwordPolicy,
        loginAttempts: Number(securitySettings.loginAttempts),
      });
      toast.success("Security settings saved successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAppearance = async () => {
    try {
      setIsLoading(true);
      await apiUpdateAppearanceSettings(appearanceSettings);
      toast.success("Appearance settings saved successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your platform settings and preferences
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="flex-wrap gap-2">
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

          <GeneralTab
            settings={generalSettings}
            onSettingsChange={setGeneralSettings}
            isLoading={isLoading}
            onSave={handleSaveGeneral}
          />

          <NotificationsTab
            settings={notificationSettings}
            onSettingsChange={setNotificationSettings}
            isLoading={isLoading}
            onSave={handleSaveNotifications}
          />

          <CommissionTab
            settings={commissionSettings}
            onSettingsChange={setCommissionSettings}
            isLoading={isLoading}
            onSave={handleSaveCommission}
          />

          <SecurityTab
            settings={securitySettings}
            onSettingsChange={setSecuritySettings}
            isLoading={isLoading}
            onSave={handleSaveSecurity}
          />

          <AppearanceTab
            settings={appearanceSettings}
            onSettingsChange={setAppearanceSettings}
            isLoading={isLoading}
            onSave={handleSaveAppearance}
          />
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;

const GeneralTab = ({
  settings,
  onSettingsChange,
  isLoading,
  onSave,
}: any) => (
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
              value={settings.platformName}
              onChange={(e) =>
                onSettingsChange((prev: any) => ({
                  ...prev,
                  platformName: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={settings.tagline}
              onChange={(e) =>
                onSettingsChange((prev: any) => ({
                  ...prev,
                  tagline: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input
              id="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={(e) =>
                onSettingsChange((prev: any) => ({
                  ...prev,
                  contactEmail: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input
              id="contactPhone"
              value={settings.contactPhone}
              onChange={(e) =>
                onSettingsChange((prev: any) => ({
                  ...prev,
                  contactPhone: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={settings.address}
              onChange={(e) =>
                onSettingsChange((prev: any) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={settings.currency}
              onValueChange={(value) =>
                onSettingsChange((prev: any) => ({
                  ...prev,
                  currency: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="INR">INR (₹)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select
              value={settings.timezone}
              onValueChange={(value) =>
                onSettingsChange((prev: any) => ({
                  ...prev,
                  timezone: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">Eastern Time</SelectItem>
                <SelectItem value="America/Chicago">Central Time</SelectItem>
                <SelectItem value="America/Denver">Mountain Time</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                <SelectItem value="Europe/London">London</SelectItem>
                <SelectItem value="Asia/Kolkata">India</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={onSave} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  </TabsContent>
);

const NotificationsTab = ({
  settings,
  onSettingsChange,
  isLoading,
  onSave,
}: any) => (
  <TabsContent value="notifications">
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Configure how you receive notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {[
            {
              key: "emailNotifications",
              title: "Email Notifications",
              desc: "Receive notifications via email",
            },
            {
              key: "newBookingAlert",
              title: "New Booking Alerts",
              desc: "Get notified when a new booking is made",
            },
            {
              key: "vendorApprovalAlert",
              title: "Vendor Approval Alerts",
              desc: "Get notified when a vendor requests approval",
            },
            {
              key: "paymentAlert",
              title: "Payment Alerts",
              desc: "Get notified about payment transactions",
            },
            {
              key: "weeklyReport",
              title: "Weekly Report",
              desc: "Receive weekly summary reports",
            },
            {
              key: "monthlyReport",
              title: "Monthly Report",
              desc: "Receive monthly summary reports",
            },
          ].map((item, idx) => (
            <div
              key={item.key}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
                <Switch
                  checked={(settings as any)[item.key]}
                  onCheckedChange={(checked) =>
                    onSettingsChange((prev: any) => ({
                      ...prev,
                      [item.key]: checked,
                    }))
                  }
                />
              </div>
              {idx < 5 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button onClick={onSave} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  </TabsContent>
);

const CommissionTab = ({
  settings,
  onSettingsChange,
  isLoading,
  onSave,
}: any) => (
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
              value={settings.platformFee}
              onChange={(e) =>
                onSettingsChange((prev: any) => ({
                  ...prev,
                  platformFee: e.target.value,
                }))
              }
            />
            <p className="text-xs text-muted-foreground">Commission charged on each booking</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="minBookingAmount">Minimum Booking Amount (₹)</Label>
            <Input
              id="minBookingAmount"
              type="number"
              min="0"
              value={settings.minBookingAmount}
              onChange={(e) =>
                onSettingsChange((prev: any) => ({
                  ...prev,
                  minBookingAmount: e.target.value,
                }))
              }
            />
            <p className="text-xs text-muted-foreground">Minimum amount for a booking</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="payoutSchedule">Payout Schedule</Label>
            <Select
              value={settings.payoutSchedule}
              onValueChange={(value) =>
                onSettingsChange((prev: any) => ({
                  ...prev,
                  payoutSchedule: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
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
                checked={settings.autoPayouts}
                onCheckedChange={(checked) =>
                  onSettingsChange((prev: any) => ({
                    ...prev,
                    autoPayouts: checked,
                  }))
                }
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
                  checked={settings.paymentMethods.includes(method.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onSettingsChange((prev: any) => ({
                        ...prev,
                        paymentMethods: [...prev.paymentMethods, method.id],
                      }));
                    } else {
                      onSettingsChange((prev: any) => ({
                        ...prev,
                        paymentMethods: prev.paymentMethods.filter((m: string) => m !== method.id),
                      }));
                    }
                  }}
                  className="h-4 w-4 rounded border-border"
                />
                <Label htmlFor={method.id}>{method.label}</Label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={onSave} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  </TabsContent>
);

const SecurityTab = ({
  settings,
  onSettingsChange,
  isLoading,
  onSave,
}: any) => (
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
              <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) =>
                onSettingsChange((prev: any) => ({
                  ...prev,
                  twoFactorAuth: checked,
                }))
              }
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
                value={settings.sessionTimeout}
                onChange={(e) =>
                  onSettingsChange((prev: any) => ({
                    ...prev,
                    sessionTimeout: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loginAttempts">Max Login Attempts</Label>
              <Input
                id="loginAttempts"
                type="number"
                min="3"
                max="10"
                value={settings.loginAttempts}
                onChange={(e) =>
                  onSettingsChange((prev: any) => ({
                    ...prev,
                    loginAttempts: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordPolicy">Password Policy</Label>
              <Select
                value={settings.passwordPolicy}
                onValueChange={(value) =>
                  onSettingsChange((prev: any) => ({
                    ...prev,
                    passwordPolicy: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                  <SelectItem value="medium">Medium (8+ chars, mixed case)</SelectItem>
                  <SelectItem value="strong">Strong (8+ chars, mixed case, numbers, symbols)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={onSave} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  </TabsContent>
);

const AppearanceTab = ({
  settings,
  onSettingsChange,
  isLoading,
  onSave,
}: any) => (
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
                value={settings.primaryColor}
                onChange={(e) =>
                  onSettingsChange((prev: any) => ({
                    ...prev,
                    primaryColor: e.target.value,
                  }))
                }
                className="h-10 w-20 cursor-pointer"
              />
              <Input
                value={settings.primaryColor}
                onChange={(e) =>
                  onSettingsChange((prev: any) => ({
                    ...prev,
                    primaryColor: e.target.value,
                  }))
                }
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accentColor">Accent Color</Label>
            <div className="flex gap-2">
              <Input
                id="accentColor"
                type="color"
                value={settings.accentColor}
                onChange={(e) =>
                  onSettingsChange((prev: any) => ({
                    ...prev,
                    accentColor: e.target.value,
                  }))
                }
                className="h-10 w-20 cursor-pointer"
              />
              <Input
                value={settings.accentColor}
                onChange={(e) =>
                  onSettingsChange((prev: any) => ({
                    ...prev,
                    accentColor: e.target.value,
                  }))
                }
                className="flex-1"
              />
            </div>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Enable dark mode for the admin panel</p>
            </div>
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(checked) =>
                onSettingsChange((prev: any) => ({
                  ...prev,
                  darkMode: checked,
                }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Show Banner</p>
              <p className="text-sm text-muted-foreground">Display announcement banner on the homepage</p>
            </div>
            <Switch
              checked={settings.showBanner}
              onCheckedChange={(checked) =>
                onSettingsChange((prev: any) => ({
                  ...prev,
                  showBanner: checked,
                }))
              }
            />
          </div>
          {settings.showBanner && (
            <div className="space-y-2">
              <Label htmlFor="bannerText">Banner Text</Label>
              <Textarea
                id="bannerText"
                value={settings.bannerText}
                onChange={(e) =>
                  onSettingsChange((prev: any) => ({
                    ...prev,
                    bannerText: e.target.value,
                  }))
                }
              />
            </div>
          )}
        </div>
        <div className="flex justify-end">
          <Button onClick={onSave} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  </TabsContent>
);
