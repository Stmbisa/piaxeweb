"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth/context";
import { type Store } from "@/lib/api/shopping-inventory";
import {
  createStore,
  updateStore,
  deleteStore,
  getStores,
  type StoreResponse,
  type CreateStorePayload,
} from "@/lib/api/store-service";
import {
  Store as StoreIcon,
  Plus,
  Search,
  Edit2,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Globe,
  TrendingUp,
  ShoppingBag,
  Eye,
  Clock,
  BellRing,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// Define a type for days of the week
type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

// Define default business hours
const defaultBusinessHours = {
  Monday: { open: "09:00", close: "17:00", closed: false },
  Tuesday: { open: "09:00", close: "17:00", closed: false },
  Wednesday: { open: "09:00", close: "17:00", closed: false },
  Thursday: { open: "09:00", close: "17:00", closed: false },
  Friday: { open: "09:00", close: "20:00", closed: false },
  Saturday: { open: "10:00", close: "18:00", closed: false },
  Sunday: { open: "closed", close: "closed", closed: true },
};

interface StoreFormData {
  name: string;
  description: string;
  address: string;
  contact_phone: string;
  contact_email: string;
  business_hours: {
    [K in DayOfWeek]?: {
      open: string;
      close: string;
      closed?: boolean;
    };
  };
  notification_preferences: {
    email_new_order: boolean;
    sms_inventory_low: boolean;
    low_stock_alerts: boolean;
    new_order_notifications: boolean;
    customer_cart_alerts: boolean;
    staff_notifications: boolean;
  };
}

export function StoreManager() {
  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<StoreFormData>({
    name: "",
    description: "",
    address: "",
    contact_phone: "",
    contact_email: "",
    business_hours: { ...defaultBusinessHours },
    notification_preferences: {
      email_new_order: true,
      sms_inventory_low: true,
      low_stock_alerts: true,
      new_order_notifications: true,
      customer_cart_alerts: true,
      staff_notifications: true,
    },
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    address: "",
    contact_phone: "",
    contact_email: "",
  });

  const { user, token } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const storesData = await getStores(token);
      setStores(storesData);
    } catch (error) {
      console.error("Error loading stores:", error);
      toast({
        title: "Error",
        description: "Failed to load stores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      name: "",
      address: "",
      contact_phone: "",
      contact_email: "",
    };

    // Validate name
    if (!formData.name.trim()) {
      errors.name = "Store name is required";
      isValid = false;
    }

    // Validate address
    if (!formData.address.trim()) {
      errors.address = "Address is required";
      isValid = false;
    }

    // Validate phone
    if (!formData.contact_phone.trim()) {
      errors.contact_phone = "Phone number is required";
      isValid = false;
    } else if (!formData.contact_phone.startsWith("+")) {
      errors.contact_phone =
        "Phone number should start with + (international format)";
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.contact_email.trim()) {
      errors.contact_email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.contact_email)) {
      errors.contact_email = "Please enter a valid email";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleAddStore = async () => {
    if (!token) return;

    if (!validateForm()) {
      toast({
        title: "Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    try {
      // Clean the business hours data for API submission
      const cleanBusinessHours: Record<
        string,
        { open: string; close: string }
      > = {};
      (Object.keys(formData.business_hours) as DayOfWeek[]).forEach((day) => {
        const dayData = formData.business_hours[day];
        if (dayData && !dayData.closed) {
          cleanBusinessHours[day] = {
            open: dayData.open,
            close: dayData.close,
          };
        } else {
          cleanBusinessHours[day] = {
            open: "closed",
            close: "closed",
          };
        }
      });

      const storePayload: CreateStorePayload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        address: formData.address.trim(),
        contact_phone: formData.contact_phone.trim(),
        contact_email: formData.contact_email.trim(),
        business_hours: cleanBusinessHours,
        notification_preferences: formData.notification_preferences,
      };

      const newStore = await createStore(token, storePayload);
      setStores((prev) => [...prev, newStore]);
      resetForm();
      setShowAddForm(false);

      toast({
        title: "Success",
        description: "Store created successfully",
      });
    } catch (error: any) {
      console.error("Error creating store:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create store",
        variant: "destructive",
      });
    }
  };

  const handleEditStore = (store: StoreResponse) => {
    setEditingStore(store);

    // Convert the store's business hours format to match our form's format
    const businessHours: StoreFormData["business_hours"] = {};
    if (store.business_hours) {
      (Object.keys(store.business_hours) as DayOfWeek[]).forEach((day) => {
        if (store.business_hours?.[day]) {
          const { open, close } = store.business_hours[day];
          businessHours[day] = {
            open,
            close,
            closed: open === "closed" && close === "closed",
          };
        }
      });
    } else {
      // Use default business hours if none are set
      Object.assign(businessHours, defaultBusinessHours);
    }

    // Set form data with the current store's values
    setFormData({
      name: store.name || "",
      description: store.description || "",
      address: store.address || "",
      contact_phone: store.contact_phone || "",
      contact_email: store.contact_email || "",
      business_hours:
        Object.keys(businessHours).length > 0
          ? businessHours
          : { ...defaultBusinessHours },
      notification_preferences: {
        email_new_order:
          store.notification_preferences?.email_new_order ?? true,
        sms_inventory_low:
          store.notification_preferences?.sms_inventory_low ?? true,
        low_stock_alerts:
          store.notification_preferences?.low_stock_alerts ?? true,
        new_order_notifications:
          store.notification_preferences?.new_order_notifications ?? true,
        customer_cart_alerts:
          store.notification_preferences?.customer_cart_alerts ?? true,
        staff_notifications:
          store.notification_preferences?.staff_notifications ?? true,
      },
    });
  };

  const handleUpdateStore = async () => {
    if (!token || !editingStore) return;

    if (!validateForm()) {
      toast({
        title: "Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    try {
      // Clean the business hours data for API submission
      const cleanBusinessHours: Record<
        string,
        { open: string; close: string }
      > = {};
      (Object.keys(formData.business_hours) as DayOfWeek[]).forEach((day) => {
        const dayData = formData.business_hours[day];
        if (dayData && !dayData.closed) {
          cleanBusinessHours[day] = {
            open: dayData.open,
            close: dayData.close,
          };
        } else {
          cleanBusinessHours[day] = {
            open: "closed",
            close: "closed",
          };
        }
      });

      const storePayload: Partial<CreateStorePayload> = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        address: formData.address.trim(),
        contact_phone: formData.contact_phone.trim(),
        contact_email: formData.contact_email.trim(),
        business_hours: cleanBusinessHours,
        notification_preferences: formData.notification_preferences,
      };

      const updatedStore = await updateStore(
        token,
        editingStore.id,
        storePayload
      );

      setStores((prev) =>
        prev.map((store) =>
          store.id === editingStore.id ? updatedStore : store
        )
      );
      resetForm();
      setEditingStore(null);

      toast({
        title: "Success",
        description: "Store updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating store:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update store",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStore = async (storeId: string) => {
    if (!token) return;

    if (
      !window.confirm(
        "Are you sure you want to delete this store? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteStore(token, storeId);
      setStores((prev) => prev.filter((store) => store.id !== storeId));
      toast({
        title: "Success",
        description: "Store deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting store:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete store",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      address: "",
      contact_phone: "",
      contact_email: "",
      business_hours: { ...defaultBusinessHours },
      notification_preferences: {
        email_new_order: true,
        sms_inventory_low: true,
        low_stock_alerts: true,
        new_order_notifications: true,
        customer_cart_alerts: true,
        staff_notifications: true,
      },
    });
    setFormErrors({
      name: "",
      address: "",
      contact_phone: "",
      contact_email: "",
    });
  };

  const handleFormDataChange = (field: string, value: any) => {
    if (field.startsWith("business_hours.")) {
      const parts = field.split(".");
      const day = parts[1] as DayOfWeek;
      const property = parts[2];

      setFormData((prev) => ({
        ...prev,
        business_hours: {
          ...prev.business_hours,
          [day]: {
            ...prev.business_hours[day],
            [property]: value,
          },
        },
      }));
    } else if (field.startsWith("notification_preferences.")) {
      const prefField = field.replace("notification_preferences.", "");
      setFormData((prev) => ({
        ...prev,
        notification_preferences: {
          ...prev.notification_preferences,
          [prefField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error when field is filled
      if (value && formErrors[field as keyof typeof formErrors]) {
        setFormErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }
    }
  };

  const handleToggleBusinessDay = (day: DayOfWeek, closed: boolean) => {
    setFormData((prev) => ({
      ...prev,
      business_hours: {
        ...prev.business_hours,
        [day]: {
          open: closed ? "closed" : "09:00",
          close: closed ? "closed" : "17:00",
          closed,
        },
      },
    }));
  };

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading stores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Store Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="glass-card-enhanced animate-glass-appear"
          style={{
            animationDelay: "0.1s",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "16px",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            padding: "24px",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Stores
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stores.length}
              </p>
            </div>
            <StoreIcon className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div
          className="glass-card-enhanced animate-glass-appear"
          style={{
            animationDelay: "0.2s",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "16px",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            padding: "24px",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Active Stores
              </p>
              <p className="text-2xl font-bold text-green-600">
                {stores.length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div
          className="glass-card-enhanced animate-glass-appear"
          style={{
            animationDelay: "0.3s",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "16px",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            padding: "24px",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Online Orders
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {
                  stores.filter(
                    (store) =>
                      store.notification_preferences
                        ?.new_order_notifications !== false
                  ).length
                }
              </p>
            </div>
            <ShoppingBag className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div
          className="glass-card-enhanced animate-glass-appear"
          style={{
            animationDelay: "0.4s",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            borderRadius: "16px",
            backdropFilter: "blur(20px)",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            padding: "24px",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Delivery Available
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {
                  stores.filter(
                    (store) =>
                      store.notification_preferences?.sms_inventory_low !==
                      false
                  ).length
                }
              </p>
            </div>
            <Globe className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Store Actions */}
      <div
        className="glass-card-enhanced animate-glass-appear"
        style={{
          animationDelay: "0.5s",
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "16px",
          backdropFilter: "blur(20px)",
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
          padding: "24px",
        }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search stores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 glass-input"
              />
            </div>
          </div>
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <button className="glass-button-primary flex items-center gap-2 px-4 py-2">
                <Plus className="w-4 h-4" />
                Add New Store
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Store</DialogTitle>
                <DialogDescription>
                  Create a new store location for your business
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Store Name *</Label>
                  <Input
                    id="store-name"
                    placeholder="Main Store"
                    value={formData.name}
                    onChange={(e) =>
                      handleFormDataChange("name", e.target.value)
                    }
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-description">Description</Label>
                  <Textarea
                    id="store-description"
                    placeholder="Describe your store location..."
                    value={formData.description}
                    onChange={(e) =>
                      handleFormDataChange("description", e.target.value)
                    }
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-address">Address *</Label>
                  <Textarea
                    id="store-address"
                    placeholder="Enter complete store address"
                    value={formData.address}
                    onChange={(e) =>
                      handleFormDataChange("address", e.target.value)
                    }
                    rows={2}
                    error={!!formErrors.address}
                    helperText={formErrors.address}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-phone">Phone Number *</Label>
                    <Input
                      id="store-phone"
                      placeholder="+256701234567"
                      value={formData.contact_phone}
                      onChange={(e) =>
                        handleFormDataChange("contact_phone", e.target.value)
                      }
                      error={!!formErrors.contact_phone}
                      helperText={formErrors.contact_phone}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="store-email">Email Address *</Label>
                    <Input
                      id="store-email"
                      type="email"
                      placeholder="store@business.com"
                      value={formData.contact_email}
                      onChange={(e) =>
                        handleFormDataChange("contact_email", e.target.value)
                      }
                      error={!!formErrors.contact_email}
                      helperText={formErrors.contact_email}
                    />
                  </div>
                </div>

                {/* Business Hours Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Business Hours
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(formData.business_hours).map(
                      ([day, dayData]) => (
                        <div
                          key={day}
                          className="flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-foreground">
                              {day}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {dayData.closed
                                ? "Closed"
                                : `${dayData.open} - ${dayData.close}`}
                            </span>
                            <Switch
                              checked={dayData.closed}
                              onCheckedChange={(checked) =>
                                handleToggleBusinessDay(
                                  day as DayOfWeek,
                                  checked
                                )
                              }
                              aria-label={`Toggle ${day} business hours`}
                            />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Notification Preferences Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Notification Preferences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BellRing className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          New Order Notifications
                        </span>
                      </div>
                      <Switch
                        checked={
                          formData.notification_preferences
                            .new_order_notifications
                        }
                        onCheckedChange={(checked) =>
                          handleFormDataChange(
                            "notification_preferences.new_order_notifications",
                            checked
                          )
                        }
                        aria-label="Toggle new order notifications"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BellRing className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          Low Stock Alerts
                        </span>
                      </div>
                      <Switch
                        checked={
                          formData.notification_preferences.low_stock_alerts
                        }
                        onCheckedChange={(checked) =>
                          handleFormDataChange(
                            "notification_preferences.low_stock_alerts",
                            checked
                          )
                        }
                        aria-label="Toggle low stock alerts"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BellRing className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          SMS Inventory Low
                        </span>
                      </div>
                      <Switch
                        checked={
                          formData.notification_preferences.sms_inventory_low
                        }
                        onCheckedChange={(checked) =>
                          handleFormDataChange(
                            "notification_preferences.sms_inventory_low",
                            checked
                          )
                        }
                        aria-label="Toggle SMS inventory low"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BellRing className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          Customer Cart Alerts
                        </span>
                      </div>
                      <Switch
                        checked={
                          formData.notification_preferences.customer_cart_alerts
                        }
                        onCheckedChange={(checked) =>
                          handleFormDataChange(
                            "notification_preferences.customer_cart_alerts",
                            checked
                          )
                        }
                        aria-label="Toggle customer cart alerts"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BellRing className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          Staff Notifications
                        </span>
                      </div>
                      <Switch
                        checked={
                          formData.notification_preferences.staff_notifications
                        }
                        onCheckedChange={(checked) =>
                          handleFormDataChange(
                            "notification_preferences.staff_notifications",
                            checked
                          )
                        }
                        aria-label="Toggle staff notifications"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddStore}>Create Store</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStores.map((store, index) => (
          <div
            key={store.id}
            className="glass-card-enhanced animate-glass-appear hover:glass-hover transition-all duration-300"
            style={{
              animationDelay: `${0.6 + index * 0.1}s`,
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "16px",
              backdropFilter: "blur(20px)",
              boxShadow:
                "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              padding: "24px",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground">
                {store.name}
              </h3>
              <Badge
                className="bg-green-100 text-green-700 border-green-200"
                style={{
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  color: "rgb(34, 197, 94)",
                }}
              >
                Active
              </Badge>
            </div>
            {store.description && (
              <p className="text-sm text-muted-foreground mb-4">
                {store.description}
              </p>
            )}

            <div className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{store.address}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{store.contact_phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{store.contact_email}</span>
                </div>
              </div>

              <div
                className="pt-3 border-t"
                style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
              >
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">0</p>
                    <p className="text-xs text-muted-foreground">Products</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">0</p>
                    <p className="text-xs text-muted-foreground">Orders</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">UGX 0</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                {store.notification_preferences?.new_order_notifications !==
                  false && (
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{
                      background: "rgba(99, 102, 241, 0.1)",
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                      color: "rgb(99, 102, 241)",
                    }}
                  >
                    New Orders
                  </Badge>
                )}
                {store.notification_preferences?.low_stock_alerts !== false && (
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{
                      background: "rgba(168, 85, 247, 0.1)",
                      border: "1px solid rgba(168, 85, 247, 0.3)",
                      color: "rgb(168, 85, 247)",
                    }}
                  >
                    Low Stock
                  </Badge>
                )}
                {store.notification_preferences?.sms_inventory_low !==
                  false && (
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      color: "rgb(239, 68, 68)",
                    }}
                  >
                    SMS Inventory Low
                  </Badge>
                )}
                {store.notification_preferences?.customer_cart_alerts !==
                  false && (
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{
                      background: "rgba(255, 159, 67, 0.1)",
                      border: "1px solid rgba(255, 159, 67, 0.3)",
                      color: "rgb(255, 159, 67)",
                    }}
                  >
                    Customer Cart
                  </Badge>
                )}
                {store.notification_preferences?.staff_notifications !==
                  false && (
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{
                      background: "rgba(100, 116, 139, 0.1)",
                      border: "1px solid rgba(100, 116, 139, 0.3)",
                      color: "rgb(100, 116, 139)",
                    }}
                  >
                    Staff
                  </Badge>
                )}
              </div>

              {/* Manage Store Button */}
              <div className="pt-4">
                <button
                  className="w-full glass-button-primary flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))",
                    border: "1px solid rgba(99, 102, 241, 0.4)",
                    borderRadius: "12px",
                    backdropFilter: "blur(10px)",
                    color: "rgb(99, 102, 241)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3))";
                    e.currentTarget.style.borderColor =
                      "rgba(99, 102, 241, 0.6)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(99, 102, 241, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))";
                    e.currentTarget.style.borderColor =
                      "rgba(99, 102, 241, 0.4)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 15px rgba(99, 102, 241, 0.2)";
                  }}
                  onClick={() => {
                    // Navigate to store management page
                    window.location.href = `/dashboard/store?id=${store.id}`;
                  }}
                >
                  <StoreIcon className="w-4 h-4" />
                  Manage Store
                </button>
              </div>

              <div
                className="flex items-center justify-between pt-2 border-t"
                style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
              >
                <span className="text-sm font-medium text-foreground">
                  {store.business_hours
                    ? "Business Hours Set"
                    : "Hours Not Set"}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    className="glass-icon-button p-2"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      backdropFilter: "blur(10px)",
                    }}
                    onClick={() => handleEditStore(store)}
                    title="Edit store"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    className="glass-icon-button p-2"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      backdropFilter: "blur(10px)",
                    }}
                    title="View store details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    className="glass-icon-button p-2 text-red-600 hover:text-red-700"
                    style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      borderRadius: "8px",
                      backdropFilter: "blur(10px)",
                      color: "rgb(239, 68, 68)",
                    }}
                    onClick={() => handleDeleteStore(store.id)}
                    title="Delete store"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Store Card */}
        <div
          className="glass-card-dashed animate-glass-appear hover:glass-hover transition-all duration-300 cursor-pointer"
          style={{
            animationDelay: `${0.6 + filteredStores.length * 0.1}s`,
            background: "rgba(255, 255, 255, 0.02)",
            border: "2px dashed rgba(255, 255, 255, 0.2)",
            borderRadius: "16px",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            padding: "24px",
          }}
          onClick={() => setShowAddForm(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.4)";
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow =
              "0 12px 40px rgba(99, 102, 241, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.1)";
          }}
        >
          <div className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
            <Plus className="w-12 h-12 text-muted-foreground/60 mb-4" />
            <h4 className="font-semibold text-foreground mb-2">
              Add New Store
            </h4>
            <p className="text-sm text-muted-foreground">
              Expand your business with additional locations
            </p>
          </div>
        </div>
      </div>

      {filteredStores.length === 0 && searchTerm && (
        <div className="glass-card-enhanced text-center py-8">
          <StoreIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2 text-foreground">
            No stores found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or add a new store
          </p>
        </div>
      )}

      {/* Edit Store Dialog */}
      <Dialog
        open={!!editingStore}
        onOpenChange={(open) => !open && setEditingStore(null)}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Store</DialogTitle>
            <DialogDescription>
              Update store information and settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-store-name">Store Name *</Label>
              <Input
                id="edit-store-name"
                placeholder="Main Store"
                value={formData.name}
                onChange={(e) => handleFormDataChange("name", e.target.value)}
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-store-description">Description</Label>
              <Textarea
                id="edit-store-description"
                placeholder="Describe your store location..."
                value={formData.description}
                onChange={(e) =>
                  handleFormDataChange("description", e.target.value)
                }
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-store-address">Address *</Label>
              <Textarea
                id="edit-store-address"
                placeholder="Enter complete store address"
                value={formData.address}
                onChange={(e) =>
                  handleFormDataChange("address", e.target.value)
                }
                rows={2}
                error={!!formErrors.address}
                helperText={formErrors.address}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-store-phone">Phone Number *</Label>
                <Input
                  id="edit-store-phone"
                  placeholder="+256701234567"
                  value={formData.contact_phone}
                  onChange={(e) =>
                    handleFormDataChange("contact_phone", e.target.value)
                  }
                  error={!!formErrors.contact_phone}
                  helperText={formErrors.contact_phone}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-store-email">Email Address *</Label>
                <Input
                  id="edit-store-email"
                  type="email"
                  placeholder="store@business.com"
                  value={formData.contact_email}
                  onChange={(e) =>
                    handleFormDataChange("contact_email", e.target.value)
                  }
                  error={!!formErrors.contact_email}
                  helperText={formErrors.contact_email}
                />
              </div>
            </div>

            {/* Business Hours Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Business Hours
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(formData.business_hours).map(
                  ([day, dayData]) => (
                    <div
                      key={day}
                      className="flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          {day}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {dayData.closed
                            ? "Closed"
                            : `${dayData.open} - ${dayData.close}`}
                        </span>
                        <Switch
                          checked={dayData.closed}
                          onCheckedChange={(checked) =>
                            handleToggleBusinessDay(day as DayOfWeek, checked)
                          }
                          aria-label={`Toggle ${day} business hours`}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Notification Preferences Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Notification Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      New Order Notifications
                    </span>
                  </div>
                  <Switch
                    checked={
                      formData.notification_preferences.new_order_notifications
                    }
                    onCheckedChange={(checked) =>
                      handleFormDataChange(
                        "notification_preferences.new_order_notifications",
                        checked
                      )
                    }
                    aria-label="Toggle new order notifications"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      Low Stock Alerts
                    </span>
                  </div>
                  <Switch
                    checked={formData.notification_preferences.low_stock_alerts}
                    onCheckedChange={(checked) =>
                      handleFormDataChange(
                        "notification_preferences.low_stock_alerts",
                        checked
                      )
                    }
                    aria-label="Toggle low stock alerts"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      SMS Inventory Low
                    </span>
                  </div>
                  <Switch
                    checked={
                      formData.notification_preferences.sms_inventory_low
                    }
                    onCheckedChange={(checked) =>
                      handleFormDataChange(
                        "notification_preferences.sms_inventory_low",
                        checked
                      )
                    }
                    aria-label="Toggle SMS inventory low"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      Customer Cart Alerts
                    </span>
                  </div>
                  <Switch
                    checked={
                      formData.notification_preferences.customer_cart_alerts
                    }
                    onCheckedChange={(checked) =>
                      handleFormDataChange(
                        "notification_preferences.customer_cart_alerts",
                        checked
                      )
                    }
                    aria-label="Toggle customer cart alerts"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BellRing className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      Staff Notifications
                    </span>
                  </div>
                  <Switch
                    checked={
                      formData.notification_preferences.staff_notifications
                    }
                    onCheckedChange={(checked) =>
                      handleFormDataChange(
                        "notification_preferences.staff_notifications",
                        checked
                      )
                    }
                    aria-label="Toggle staff notifications"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingStore(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateStore}>Update Store</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
