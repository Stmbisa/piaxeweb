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

interface ProductForm {
  name: string;
  description: string;
  base_price: string;
}

export default function BulkScanPage({ storeId }: { storeId: string }) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductForm[]>([
    { name: "", description: "", base_price: "" },
  ]);

  const handleProductChange = (
    index: number,
    field: keyof ProductForm,
    value: string
  ) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const addProduct = () => {
    setProducts([...products, { name: "", description: "", base_price: "" }]);
  };

  const handleSubmit = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const formattedProducts = products.map((p) => ({
        ...p,
        currency: "UGX",
        location_id: storeId,
        quantity: 1, // Default quantity
      }));
      await shoppingInventoryAPI.batchAddProducts(
        token,
        storeId,
        formattedProducts
      );
      toast({
        title: "Success",
        description: "Products added in batch successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add products in batch.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch Add Products</CardTitle>
        <CardDescription>Add multiple products at once.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-2">
            <h3 className="font-semibold">Product {index + 1}</h3>
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={product.name}
                onChange={(e) =>
                  handleProductChange(index, "name", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={product.description}
                onChange={(e) =>
                  handleProductChange(index, "description", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                type="number"
                value={product.base_price}
                onChange={(e) =>
                  handleProductChange(index, "base_price", e.target.value)
                }
              />
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={addProduct}>
          Add Another Product
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit Batch"}
        </Button>
      </CardContent>
    </Card>
  );
}
