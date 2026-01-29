"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import UgxOnlyCurrencySelector from "@/components/common/UgxOnlyCurrencySelector";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth/context";
import { shoppingInventoryAPI, type Store } from "@/lib/api/shopping-inventory";
import {
  Settings,
  Store as StoreIcon,
  CreditCard,
  Bell,
  Shield,
  Globe,
  Users,
  Package,
  Save,
  RefreshCw,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react";

interface BusinessSettings {
  business_name: string;
  business_description: string;
  business_type: string;
  website?: string;
  logo?: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  tax_id?: string;
  currency: string;
  timezone: string;
  language: string;
}

interface NotificationSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  order_alerts: boolean;
  low_stock_alerts: boolean;
  payment_alerts: boolean;
  customer_alerts: boolean;
  marketing_emails: boolean;
}

interface SecuritySettings {
  two_factor_enabled: boolean;
  session_timeout: number;
  password_requirements: {
    min_length: number;
    require_uppercase: boolean;
    require_lowercase: boolean;
    require_numbers: boolean;
    require_symbols: boolean;
  };
  allowed_ips: string[];
}

const CURRENCIES = [
  { code: "UGX", name: "Ugandan Shilling" },
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
];

const TIMEZONES = [
  { value: "Africa/Kampala", name: "East Africa Time (UTC+3)" },
  { value: "UTC", name: "UTC" },
  { value: "America/New_York", name: "Eastern Time" },
  { value: "Europe/London", name: "GMT" },
];

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "sw", name: "Swahili" },
  { code: "lg", name: "Luganda" },
];

export function SettingsManager() {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    business_name: "",
    business_description: "",
    business_type: "",
    website: "",
    logo: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    tax_id: "",
    currency: "UGX",
    timezone: "Africa/Kampala",
    language: "en",
  });
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      email_notifications: true,
      sms_notifications: true,
      push_notifications: true,
      order_alerts: true,
      low_stock_alerts: true,
      payment_alerts: true,
      customer_alerts: false,
      marketing_emails: false,
    });
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    two_factor_enabled: false,
    session_timeout: 30,
    password_requirements: {
      min_length: 8,
      require_uppercase: true,
      require_lowercase: true,
      require_numbers: true,
      require_symbols: false,
    },
    allowed_ips: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey] = useState(
    "pk_live_51K3..." + Math.random().toString(36).substr(2, 24)
  );

  const { user, token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!token) return;

    try {
      setLoading(true);

      // Load stores
      const storesData = await shoppingInventoryAPI.getStores(token);
      setStores(storesData);

      // Load settings for first store if available
      if (storesData.length > 0) {
        const firstStore = storesData[0];
        setSelectedStore(firstStore.id);

        // Map store data to business settings
        setBusinessSettings({
          business_name: firstStore.name,
          business_description: firstStore.description,
          business_type: "Retail Store",
          website: "",
          logo: "",
          contact_email: firstStore.contact_email,
          contact_phone: firstStore.contact_phone,
          address: firstStore.address,
          tax_id: "",
          currency: "UGX",
          timezone: "Africa/Kampala",
          language: "en",
        });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStoreChange = async (storeId: string) => {
    const store = stores.find((s) => s.id === storeId);
    if (!store) return;

    setSelectedStore(storeId);
    setBusinessSettings({
      business_name: store.name,
      business_description: store.description,
      business_type: "Retail Store",
      website: "",
      logo: "",
      contact_email: store.contact_email,
      contact_phone: store.contact_phone,
      address: store.address,
      tax_id: "",
      currency: "UGX",
      timezone: "Africa/Kampala",
      language: "en",
    });
  };

  const saveBusinessSettings = async () => {
    if (!token || !selectedStore) return;

    try {
      setSaving(true);

      // Update store with business settings
      await shoppingInventoryAPI.updateStore(token, selectedStore, {
        name: businessSettings.business_name,
        description: businessSettings.business_description,
        address: businessSettings.address,
        contact_email: businessSettings.contact_email,
        contact_phone: businessSettings.contact_phone,
        business_hours: {},
        notification_preferences: {},
      });

      toast({
        title: "Success",
        description: "Business settings saved successfully",
      });
    } catch (error) {
      console.error("Error saving business settings:", error);
      toast({
        title: "Error",
        description: "Failed to save business settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveNotificationSettings = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    toast({
      title: "Success",
      description: "Notification settings saved successfully",
    });
  };

  const saveSecuritySettings = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    toast({
      title: "Success",
      description: "Security settings saved successfully",
    });
  };

  const regenerateApiKey = () => {
    toast({
      title: "API Key Regenerated",
      description:
        "Your new API key has been generated. Please update your integrations.",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Business Settings</h1>
          <p className="text-muted-foreground">
            Manage your business configuration and preferences
          </p>
        </div>
        <Button
          onClick={loadData}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Store Selection */}
      {stores.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <label htmlFor="store-select" className="font-medium">
                Configure Store:
              </label>
              <Select value={selectedStore} onValueChange={handleStoreChange}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Choose a store" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings Tabs */}
      <Tabs defaultValue="business" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="business" className="flex items-center gap-2">
            <StoreIcon className="w-4 h-4" />
            Business
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            API & Integrations
          </TabsTrigger>
        </TabsList>

        {/* Business Settings */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Update your business details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="business_name">Business Name</Label>
                  <Input
                    id="business_name"
                    value={businessSettings.business_name}
                    onChange={(e) =>
                      setBusinessSettings((prev) => ({
                        ...prev,
                        business_name: e.target.value,
                      }))
                    }
                    placeholder="Enter business name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business_type">Business Type</Label>
                  <Select
                    value={businessSettings.business_type}
                    onValueChange={(value) =>
                      setBusinessSettings((prev) => ({
                        ...prev,
                        business_type: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Retail Store">Retail Store</SelectItem>
                      <SelectItem value="Restaurant">Restaurant</SelectItem>
                      <SelectItem value="Grocery Store">
                        Grocery Store
                      </SelectItem>
                      <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Fashion & Clothing">
                        Fashion & Clothing
                      </SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="business_description">
                    Business Description
                  </Label>
                  <Textarea
                    id="business_description"
                    value={businessSettings.business_description}
                    onChange={(e) =>
                      setBusinessSettings((prev) => ({
                        ...prev,
                        business_description: e.target.value,
                      }))
                    }
                    placeholder="Describe your business"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={businessSettings.contact_email}
                    onChange={(e) =>
                      setBusinessSettings((prev) => ({
                        ...prev,
                        contact_email: e.target.value,
                      }))
                    }
                    placeholder="business@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Contact Phone</Label>
                  <Input
                    id="contact_phone"
                    value={businessSettings.contact_phone}
                    onChange={(e) =>
                      setBusinessSettings((prev) => ({
                        ...prev,
                        contact_phone: e.target.value,
                      }))
                    }
                    placeholder="+256 XXX XXX XXX"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Textarea
                    id="address"
                    value={businessSettings.address}
                    onChange={(e) =>
                      setBusinessSettings((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    placeholder="Enter complete business address"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    value={businessSettings.website || ""}
                    onChange={(e) =>
                      setBusinessSettings((prev) => ({
                        ...prev,
                        website: e.target.value,
                      }))
                    }
                    placeholder="https://www.yourbusiness.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax_id">Tax ID</Label>
                  <Input
                    id="tax_id"
                    value={businessSettings.tax_id || ""}
                    onChange={(e) =>
                      setBusinessSettings((prev) => ({
                        ...prev,
                        tax_id: e.target.value,
                      }))
                    }
                    placeholder="Enter tax identification number"
                  />
                </div>

                <div className="space-y-2">
                  <UgxOnlyCurrencySelector
                    title="Default Currency"
                    currencies={CURRENCIES}
                    value={businessSettings.currency || "UGX"}
                    onChange={(value) =>
                      setBusinessSettings((prev) => ({
                        ...prev,
                        currency: value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={businessSettings.timezone}
                    onValueChange={(value) =>
                      setBusinessSettings((prev) => ({
                        ...prev,
                        timezone: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMEZONES.map((timezone) => (
                        <SelectItem key={timezone.value} value={timezone.value}>
                          {timezone.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Logo Upload */}
              <div className="space-y-2">
                <Label>Business Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    {businessSettings.logo ? (
                      <img
                        src={businessSettings.logo}
                        alt="Logo"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Logo
                  </Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={saveBusinessSettings}
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Communication Channels</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email_notifications">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      id="email_notifications"
                      checked={notificationSettings.email_notifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          email_notifications: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms_notifications">
                        SMS Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via SMS
                      </p>
                    </div>
                    <Switch
                      id="sms_notifications"
                      checked={notificationSettings.sms_notifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          sms_notifications: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push_notifications">
                        Push Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive browser push notifications
                      </p>
                    </div>
                    <Switch
                      id="push_notifications"
                      checked={notificationSettings.push_notifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          push_notifications: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Alert Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="order_alerts">Order Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        New orders and order updates
                      </p>
                    </div>
                    <Switch
                      id="order_alerts"
                      checked={notificationSettings.order_alerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          order_alerts: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="low_stock_alerts">Low Stock Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        When products are running low
                      </p>
                    </div>
                    <Switch
                      id="low_stock_alerts"
                      checked={notificationSettings.low_stock_alerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          low_stock_alerts: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="payment_alerts">Payment Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Payment confirmations and failures
                      </p>
                    </div>
                    <Switch
                      id="payment_alerts"
                      checked={notificationSettings.payment_alerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          payment_alerts: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="customer_alerts">Customer Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        New customer registrations
                      </p>
                    </div>
                    <Switch
                      id="customer_alerts"
                      checked={notificationSettings.customer_alerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          customer_alerts: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing_emails">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Product updates and promotions
                      </p>
                    </div>
                    <Switch
                      id="marketing_emails"
                      checked={notificationSettings.marketing_emails}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          marketing_emails: checked,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={saveNotificationSettings}
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Changes"}
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
              <CardDescription>
                Configure security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Authentication</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two_factor">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Switch
                    id="two_factor"
                    checked={securitySettings.two_factor_enabled}
                    onCheckedChange={(checked) =>
                      setSecuritySettings((prev) => ({
                        ...prev,
                        two_factor_enabled: checked,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="session_timeout">
                    Session Timeout (minutes)
                  </Label>
                  <Select
                    value={securitySettings.session_timeout.toString()}
                    onValueChange={(value) =>
                      setSecuritySettings((prev) => ({
                        ...prev,
                        session_timeout: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Password Requirements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min_length">Minimum Length</Label>
                    <Input
                      id="min_length"
                      type="number"
                      min="6"
                      max="32"
                      value={securitySettings.password_requirements.min_length}
                      onChange={(e) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          password_requirements: {
                            ...prev.password_requirements,
                            min_length: parseInt(e.target.value),
                          },
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="require_uppercase">
                      Require Uppercase Letters
                    </Label>
                    <Switch
                      id="require_uppercase"
                      checked={
                        securitySettings.password_requirements.require_uppercase
                      }
                      onCheckedChange={(checked) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          password_requirements: {
                            ...prev.password_requirements,
                            require_uppercase: checked,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="require_lowercase">
                      Require Lowercase Letters
                    </Label>
                    <Switch
                      id="require_lowercase"
                      checked={
                        securitySettings.password_requirements.require_lowercase
                      }
                      onCheckedChange={(checked) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          password_requirements: {
                            ...prev.password_requirements,
                            require_lowercase: checked,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="require_numbers">Require Numbers</Label>
                    <Switch
                      id="require_numbers"
                      checked={
                        securitySettings.password_requirements.require_numbers
                      }
                      onCheckedChange={(checked) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          password_requirements: {
                            ...prev.password_requirements,
                            require_numbers: checked,
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="require_symbols">
                      Require Special Characters
                    </Label>
                    <Switch
                      id="require_symbols"
                      checked={
                        securitySettings.password_requirements.require_symbols
                      }
                      onCheckedChange={(checked) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          password_requirements: {
                            ...prev.password_requirements,
                            require_symbols: checked,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={saveSecuritySettings}
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API & Integrations */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API & Integrations</CardTitle>
              <CardDescription>
                Manage API keys and third-party integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">API Access</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="api_key">API Key</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        id="api_key"
                        type={showApiKey ? "text" : "password"}
                        value={apiKey}
                        readOnly
                        className="font-mono"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={regenerateApiKey}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Use this key to authenticate API requests. Keep it secure!
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="webhook_url">Webhook URL</Label>
                    <Input
                      id="webhook_url"
                      placeholder="https://yoursite.com/webhook"
                      className="mt-2"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      URL to receive webhook notifications for events
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Integration Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium">Payment Gateway</p>
                        <p className="text-sm text-muted-foreground">
                          Mobile Money & Cards
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      Connected
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Order & Payment Alerts
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">
                      Connected
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium">Inventory Sync</p>
                        <p className="text-sm text-muted-foreground">
                          External inventory systems
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Not Connected</Badge>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  API Documentation
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  Learn how to integrate with our APIs to build custom
                  solutions.
                </p>
                <Button variant="outline" size="sm">
                  View Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
