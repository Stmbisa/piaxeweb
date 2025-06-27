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
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  });

  const handleAddProduct = async () => {
    if (!token) return;
    setLoading(true);
    try {
      await shoppingInventoryAPI.createProduct(token, storeId, formData);
      toast({
        title: "Success",
        description: "Product added successfully.",
      });
      // Optionally reset form or redirect
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a New Product</CardTitle>
        <CardDescription>
          Fill in the details to add a new product to your store.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="base_price">Price</Label>
            <Input
              id="base_price"
              type="number"
              value={formData.base_price}
              onChange={(e) =>
                setFormData({ ...formData, base_price: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: parseInt(e.target.value),
                })
              }
            />
          </div>
        </div>
        <Button onClick={handleAddProduct} disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </Button>
      </CardContent>
    </Card>
  );
}
