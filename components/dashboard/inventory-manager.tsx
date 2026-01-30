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
import { useToast } from "@/hooks/use-toast";
import {
  shoppingInventoryAPI,
  type Product as APIProduct,
  type Store,
} from "@/lib/api/shopping-inventory";
import { useAuth } from "@/lib/auth/context";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
  sales: number;
  image?: string;
}

export function InventoryManager() {
  const [products, setProducts] = useState<APIProduct[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvIdempotencyKey, setCsvIdempotencyKey] = useState<string>("");
  const [csvImporting, setCsvImporting] = useState(false);
  const [csvResult, setCsvResult] = useState<{ applied: number; conflicts: number } | null>(null);
  const { user, token } = useAuth();
  const { toast } = useToast();

  // Load stores and products on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!token) return;

    try {
      setLoading(true);

      // Load stores first
      const storesData = await shoppingInventoryAPI.getStores(token);
      setStores(storesData);

      // Load products for the first store if available
      if (storesData.length > 0) {
        const firstStoreId = storesData[0].id;
        setSelectedStore(firstStoreId);
        const productsResponse = await shoppingInventoryAPI.getProducts(
          token,
          firstStoreId
        );
        setProducts(productsResponse.products);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load inventory data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load products when store changes
  const handleStoreChange = async (storeId: string) => {
    if (!token) return;

    try {
      setSelectedStore(storeId);
      setLoading(true);
      const productsResponse = await shoppingInventoryAPI.getProducts(
        token,
        storeId
      );
      setProducts(productsResponse.products);
    } catch (error) {
      console.error("Error loading products:", error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!token || !selectedStore) return;

    try {
      await shoppingInventoryAPI.deleteProduct(token, selectedStore, productId);
      setProducts(products.filter((p) => p.id !== productId));
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.location?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (
    quantity: number
  ): "in-stock" | "low-stock" | "out-of-stock" => {
    if (quantity === 0) return "out-of-stock";
    if (quantity <= 5) return "low-stock";
    return "in-stock";
  };

  const getStatusColor = (quantity: number) => {
    const status = getStockStatus(quantity);
    switch (status) {
      case "in-stock":
        return "bg-green-100 text-green-700 border-green-200";
      case "low-stock":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "out-of-stock":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Format currency helper function
  const formatCurrency = (amount: string | number | undefined) => {
    if (amount === undefined || amount === null) return "0";
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return !isNaN(numAmount) ? numAmount.toLocaleString() : "0";
  };

  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => {
    const quantity = p.quantity || 0;
    return quantity > 0 && quantity <= 5;
  }).length;
  const outOfStockProducts = products.filter(
    (p) => (p.quantity || 0) === 0
  ).length;
  const totalValue = products.reduce((sum, p) => {
    const price =
      typeof p.base_price === "string"
        ? parseFloat(p.base_price || "0")
        : p.base_price || 0;
    const quantity = p.quantity || 0;
    return sum + price * quantity;
  }, 0);

  const handleCsvFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setCsvFile(event.target.files[0]);
      const cryptoObj = globalThis.crypto as
        | (Crypto & { randomUUID?: () => string })
        | undefined;
      const key = cryptoObj?.randomUUID?.() ?? `csv-${Date.now()}`;
      setCsvIdempotencyKey(key);
    }
  };

  const downloadInventoryDeltaTemplate = () => {
    const csv = [
      "product_id,sku,barcode,delta_quantity,store_location_id,reason,occurred_at,external_ref",
      ",SKU-123,,10,,restock,2026-01-30T10:00:00Z,PO-001",
      ",SKU-123,,-2,,sale,2026-01-30T12:00:00Z,SALE-001",
      ",SKU-999,,-1,,adjustment,2026-01-30T18:30:00Z,SHRINK-001",
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory-deltas-template.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const importInventoryDeltasCsv = async () => {
    if (!token || !selectedStore || !csvFile) return;
    setCsvImporting(true);
    setCsvResult(null);

    try {
      const cryptoObj = globalThis.crypto as
        | (Crypto & { randomUUID?: () => string })
        | undefined;
      const key = (csvIdempotencyKey || "").trim() || cryptoObj?.randomUUID?.() || `csv-${Date.now()}`;
      setCsvIdempotencyKey(key);

      const result = await shoppingInventoryAPI.importInventoryDeltasCsv(
        token,
        selectedStore,
        key,
        csvFile
      );

      const appliedCount = Array.isArray(result?.applied) ? result.applied.length : 0;
      const conflictCount = Array.isArray(result?.conflicts)
        ? result.conflicts.length
        : 0;

      setCsvResult({ applied: appliedCount, conflicts: conflictCount });
      toast({
        title: "Import finished",
        description: `Applied: ${appliedCount}, Conflicts: ${conflictCount}`,
      });

      // Refresh products after applying deltas
      const productsResponse = await shoppingInventoryAPI.getProducts(token, selectedStore);
      setProducts(productsResponse.products);
    } catch (error: any) {
      toast({
        title: "Import failed",
        description: error?.message || "Failed to import inventory deltas",
        variant: "destructive",
      });
    } finally {
      setCsvImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Store Selection */}
      {stores.length > 0 && (
        <div className="flex items-center gap-4">
          <Label htmlFor="store-select">Select Store:</Label>
          <select
            id="store-select"
            value={selectedStore}
            onChange={(e) => handleStoreChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
            aria-label="Select Store"
          >
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading inventory...</p>
          </div>
        </div>
      ) : (
        <>
          {/* CSV Import */}
          <Card>
            <CardHeader>
              <CardTitle>Import inventory changes (CSV)</CardTitle>
              <CardDescription>
                Upload a CSV of inventory deltas (sales/restock/adjustments). Required columns: delta_quantity and one of product_id / sku / barcode.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground space-y-1">
                <div>
                  A “delta” is the change to apply: restock is positive (e.g. <span className="font-mono">10</span>), sale/consumption is negative (e.g. <span className="font-mono">-2</span>).
                </div>
                <div>
                  Extra CSV columns are ignored. Unknown products or negative stock results show up as conflicts.
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="inventory-delta-csv">CSV file</Label>
                <Input
                  id="inventory-delta-csv"
                  type="file"
                  accept=".csv"
                  onChange={handleCsvFileChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inventory-delta-idempotency">Idempotency key</Label>
                <Input
                  id="inventory-delta-idempotency"
                  value={csvIdempotencyKey}
                  onChange={(e) => setCsvIdempotencyKey(e.target.value)}
                  placeholder="csv-... (use the same key if you retry the same file)"
                />
              </div>
              <div className="flex items-center gap-3">
                <Button onClick={importInventoryDeltasCsv} disabled={csvImporting || !csvFile || !selectedStore}>
                  {csvImporting ? "Importing…" : "Import CSV"}
                </Button>
                <Button type="button" variant="secondary" onClick={downloadInventoryDeltaTemplate}>
                  Download template
                </Button>
                {csvResult && (
                  <div className="text-sm text-muted-foreground">
                    Applied: {csvResult.applied} • Conflicts: {csvResult.conflicts}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Inventory Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Products
                    </p>
                    <p className="text-2xl font-bold">{totalProducts}</p>
                  </div>
                  <Package className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Low Stock
                    </p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {lowStockProducts}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Out of Stock
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {outOfStockProducts}
                    </p>
                  </div>
                  <Minus className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Inventory Value
                    </p>
                    <p className="text-2xl font-bold">
                      UGX {formatCurrency(totalValue)}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Actions */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>

          {/* Products List */}
          <Card>
            <CardHeader>
              <CardTitle>Products Inventory</CardTitle>
              <CardDescription>
                Manage your product catalog and stock levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {product.location?.name || "No Category"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="font-semibold">
                          UGX {formatCurrency(product.base_price)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {product.product_code
                            ? `SKU: ${product.product_code}`
                            : "No SKU"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold">
                          {product.quantity || 0} units
                        </p>
                        <Badge
                          className={getStatusColor(product.quantity || 0)}
                        >
                          {getStockStatus(product.quantity || 0).replace(
                            "-",
                            " "
                          )}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stock Alerts */}
          {(lowStockProducts > 0 || outOfStockProducts > 0) && (
            <Card className="border-yellow-200 bg-yellow-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-700">
                  <AlertTriangle className="w-5 h-5" />
                  Stock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lowStockProducts > 0 && (
                    <p className="text-sm text-yellow-700">
                      {lowStockProducts} product(s) are running low on stock
                    </p>
                  )}
                  {outOfStockProducts > 0 && (
                    <p className="text-sm text-red-700">
                      {outOfStockProducts} product(s) are out of stock
                    </p>
                  )}
                  <Button variant="outline" size="sm" className="mt-2">
                    Review Stock Levels
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
