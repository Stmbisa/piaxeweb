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
import { ScanLine, Plus, Trash2, Camera, Barcode } from "lucide-react";

interface ProductForm {
  name: string;
  description: string;
  base_price: string;
  barcode?: string;
}

export default function ScanProductsPage({ storeId }: { storeId: string }) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scanningForIndex, setScanningForIndex] = useState<number | null>(null);
  const [products, setProducts] = useState<ProductForm[]>([
    { name: "", description: "", base_price: "", barcode: "" },
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
    setProducts([
      ...products,
      { name: "", description: "", base_price: "", barcode: "" },
    ]);
  };

  const removeProduct = (index: number) => {
    if (products.length === 1) {
      // If it's the last product, just reset it
      setProducts([{ name: "", description: "", base_price: "", barcode: "" }]);
    } else {
      const newProducts = [...products];
      newProducts.splice(index, 1);
      setProducts(newProducts);
    }
  };

  const startScanning = (index: number) => {
    setScanningForIndex(index);
    setShowScanner(true);
    // In a real implementation, this would activate the camera
  };

  const simulateBarcodeScan = () => {
    if (scanningForIndex !== null) {
      // Generate a random barcode for demo purposes
      const mockBarcode = Math.floor(Math.random() * 1000000000000).toString();
      handleProductChange(scanningForIndex, "barcode", mockBarcode);

      // In a real implementation, you would fetch product details based on the barcode
      toast({
        title: "Barcode Scanned",
        description: `Barcode ${mockBarcode} has been added to the product`,
      });

      setShowScanner(false);
      setScanningForIndex(null);
    }
  };

  const handleSubmit = async () => {
    if (!token) return;

    // Validate products
    const invalidProducts = products.filter((p) => !p.name || !p.base_price);
    if (invalidProducts.length > 0) {
      toast({
        title: "Validation Error",
        description: "All products must have a name and price",
        variant: "destructive",
      });
      return;
    }

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
        description: `${products.length} product${
          products.length > 1 ? "s" : ""
        } added successfully.`,
      });

      // Reset form after successful submission
      setProducts([{ name: "", description: "", base_price: "", barcode: "" }]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add products.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6" style={{ width: "100%" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scan Products</h1>
          <p className="text-muted-foreground mt-1">
            Add products by scanning barcodes or entering details manually
          </p>
        </div>
        <ScanLine className="h-10 w-10 text-primary" />
      </div>

      <div style={{ width: "100%" }}>
        <Card style={{ width: "100%", maxWidth: "none" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Barcode className="h-5 w-5" />
              Add Products with Barcode Scanner
            </CardTitle>
            <CardDescription>
              Scan product barcodes or enter product details manually. You can
              add multiple products at once.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {products.map((product, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Product {index + 1}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProduct(index)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${index}`}>Product Name</Label>
                    <Input
                      id={`name-${index}`}
                      value={product.name}
                      onChange={(e) =>
                        handleProductChange(index, "name", e.target.value)
                      }
                      placeholder="Enter product name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`price-${index}`}>Price</Label>
                    <Input
                      id={`price-${index}`}
                      type="number"
                      value={product.base_price}
                      onChange={(e) =>
                        handleProductChange(index, "base_price", e.target.value)
                      }
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`description-${index}`}>Description</Label>
                  <Textarea
                    id={`description-${index}`}
                    value={product.description}
                    onChange={(e) =>
                      handleProductChange(index, "description", e.target.value)
                    }
                    placeholder="Product description"
                    className="resize-none"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`barcode-${index}`}>Barcode</Label>
                  <div className="flex gap-2">
                    <Input
                      id={`barcode-${index}`}
                      value={product.barcode}
                      onChange={(e) =>
                        handleProductChange(index, "barcode", e.target.value)
                      }
                      placeholder="Enter or scan barcode"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => startScanning(index)}
                      className="flex items-center gap-1"
                    >
                      <Camera className="h-4 w-4" />
                      Scan
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={addProduct}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Another Product
            </Button>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="min-w-32"
            >
              {loading ? "Submitting..." : "Save Products"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4">
            <div className="text-center space-y-4">
              <ScanLine className="w-16 h-16 mx-auto text-primary" />
              <h3 className="text-lg font-semibold">Barcode Scanner</h3>
              <p className="text-muted-foreground">
                Position the barcode within the camera view to scan
              </p>
              <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">
                  Camera view would appear here
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowScanner(false);
                    setScanningForIndex(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={simulateBarcodeScan} className="flex-1">
                  Simulate Scan
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
