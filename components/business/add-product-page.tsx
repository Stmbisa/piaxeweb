"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { shoppingInventoryAPI } from "@/lib/api/shopping-inventory";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Package, PlusSquare, Barcode, Tag } from "lucide-react";

export default function AddProductPage({ storeId }: { storeId: string }) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    base_price: "",
    currency: "UGX",
    quantity: 0,
    location_id: storeId,
    product_code: "",
    barcode: "",
    low_stock_threshold: 5,
  });

  const handleAddProduct = async () => {
    if (!token) return;

    // Basic validation
    if (!formData.name || !formData.base_price) {
      toast({
        title: "Validation Error",
        description: "Product name and price are required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await shoppingInventoryAPI.createProduct(token, storeId, formData);
      toast({
        title: "Success",
        description: "Product added successfully.",
      });

      // Reset form after successful submission
      setFormData({
        name: "",
        description: "",
        base_price: "",
        currency: "UGX",
        quantity: 0,
        location_id: storeId,
        product_code: "",
        barcode: "",
        low_stock_threshold: 5,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add product.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSKU = () => {
    const sku = "SKU" + Math.random().toString(36).substr(2, 9).toUpperCase();
    setFormData({ ...formData, product_code: sku });
  };

  return (
    <div className="p-6" style={{ width: "100%" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Product</h1>
          <p className="text-muted-foreground mt-1">
            Create a new product in your inventory
          </p>
        </div>
        <Package className="h-10 w-10 text-primary" />
      </div>

      <div style={{ width: "100%" }}>
        <Card style={{ width: "100%", maxWidth: "none" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusSquare className="h-5 w-5" />
              Product Information
            </CardTitle>
            <CardDescription>
              Fill in the details to add a new product to your store.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter product name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="base_price">Price *</Label>
                  <Input
                    id="base_price"
                    type="number"
                    value={formData.base_price}
                    onChange={(e) =>
                      setFormData({ ...formData, base_price: e.target.value })
                    }
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Initial Stock</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your product"
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="product_code"
                  className="flex items-center justify-between"
                >
                  <span>SKU/Product Code</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={generateSKU}
                    className="h-6 text-xs"
                  >
                    Generate
                  </Button>
                </Label>
                <Input
                  id="product_code"
                  value={formData.product_code}
                  onChange={(e) =>
                    setFormData({ ...formData, product_code: e.target.value })
                  }
                  placeholder="Enter product code"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="barcode" className="flex items-center gap-1">
                  <Barcode className="h-3.5 w-3.5" />
                  <span>Barcode</span>
                </Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) =>
                    setFormData({ ...formData, barcode: e.target.value })
                  }
                  placeholder="Enter product barcode"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="low_stock_threshold"
                className="flex items-center gap-1"
              >
                <Tag className="h-3.5 w-3.5" />
                <span>Low Stock Alert Threshold</span>
              </Label>
              <Input
                id="low_stock_threshold"
                type="number"
                value={formData.low_stock_threshold}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    low_stock_threshold: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="5"
                className="max-w-xs"
              />
              <p className="text-sm text-muted-foreground">
                You'll be alerted when stock falls below this number
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button
              onClick={handleAddProduct}
              disabled={loading}
              className="min-w-32"
            >
              {loading ? "Adding..." : "Add Product"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
