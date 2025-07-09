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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth/context";
import {
  shoppingInventoryAPI,
  type Product,
  type Store,
  type Category,
} from "@/lib/api/shopping-inventory";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Package,
  Camera,
  Upload,
  Download,
  Filter,
  ScanLine,
  RefreshCw,
  MoreHorizontal,
  Star,
  Eye,
  Copy,
  X,
  Boxes,
  AlertTriangle,
  PackageX,
  Banknote,
  FileUp,
  PlusSquare,
  Scan,
  ImageIcon,
} from "lucide-react";
import { API_ENDPOINTS } from "@/lib/config/env";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

const PRODUCT_STATUS_COLORS: { [key: string]: string } = {
  active: "bg-green-100 text-green-700 border-green-200",
  inactive: "bg-gray-100 text-gray-700 border-gray-200",
  out_of_stock: "bg-red-100 text-red-700 border-red-200",
  default: "bg-gray-100 text-gray-700 border-gray-200", // Default style
};

interface ProductFormData {
  name: string;
  description: string;
  base_price: string;
  quantity: number;
  low_stock_threshold: number;
  product_code?: string;
  barcode?: string;
  qr_code?: string;
  location_id: string;
  manual_price?: string;
  store_price?: string;
  images?: string[];
}

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    base_price: "0",
    quantity: 0,
    low_stock_threshold: 5,
    product_code: "",
    barcode: "",
    qr_code: "",
    location_id: "",
    manual_price: "",
    store_price: "",
    images: [],
  });
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const { token } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Update filtered products whenever products, searchTerm, categoryFilter, or statusFilter changes
    const filtered = (products || []).filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes((searchTerm || "").toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes((searchTerm || "").toLowerCase()) ||
        (product.product_code &&
          product.product_code
            .toLowerCase()
            .includes((searchTerm || "").toLowerCase()));
      const matchesCategory =
        !categoryFilter ||
        categoryFilter === "all" ||
        product.location.name === categoryFilter;
      const matchesStatus =
        !statusFilter ||
        statusFilter === "all" ||
        product.is_active === (statusFilter === "active");

      return matchesSearch && matchesCategory && matchesStatus;
    });
    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const loadData = async () => {
    if (!token) return;

    try {
      setLoading(true);

      // Load stores first
      const storesData = await shoppingInventoryAPI.getStores(token);
      setStores(storesData);

      // Load products and categories for the first store if available
      if (storesData.length > 0) {
        const firstStoreId = storesData[0].id;
        setSelectedStore(firstStoreId);
        await loadProducts(firstStoreId);
        await loadCategories(firstStoreId);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load products data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async (storeId: string) => {
    if (!token) return;

    try {
      setLoading(true);
      const params: any = {};
      if (categoryFilter && categoryFilter !== "all")
        params.location = categoryFilter;
      if (statusFilter && statusFilter !== "all")
        params.is_active = statusFilter === "active";
      if (searchTerm) params.search = searchTerm;

      const productsResponse = await shoppingInventoryAPI.getProducts(
        token,
        storeId,
        params
      );
      setProducts(productsResponse?.products || []);
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]); // Set empty array on error
      toast({
        title: "Error",
        description: "Failed to load products. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async (storeId: string) => {
    if (!token) return;

    try {
      setLoadingCategories(true);
      const categoriesData = await shoppingInventoryAPI.getCategories(token);
      // Filter categories for the current store if needed
      const storeCategories = categoriesData.filter(
        (cat) => !cat.store_id || cat.store_id === storeId
      );
      setCategories(storeCategories || []); // Ensure we always set an array, even if empty
    } catch (error) {
      console.error("Error loading categories:", error);
      setCategories([]); // Set empty array on error
      toast({
        title: "Warning",
        description: "Failed to load categories. Some features may be limited.",
        variant: "destructive",
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleStoreChange = async (storeId: string) => {
    setSelectedStore(storeId);
    await loadProducts(storeId);
    await loadCategories(storeId);
  };

  const handleAddProduct = async () => {
    if (!token || !selectedStore) return;

    try {
      const productData = {
        ...formData,
        currency: "UGX",
      };

      await shoppingInventoryAPI.createProduct(
        token,
        selectedStore,
        productData
      );
      await loadProducts(selectedStore);

      setShowAddOptions(false);
      resetForm();

      toast({
        title: "Success",
        description: "Product added successfully",
      });
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const handleStockUpdate = async (productId: string, newQuantity: number) => {
    if (!token || !selectedStore) return;

    try {
      await shoppingInventoryAPI.updateStock(
        token,
        selectedStore,
        productId,
        newQuantity,
        "set"
      );
      await loadProducts(selectedStore);

      toast({
        title: "Success",
        description: "Stock updated successfully",
      });
    } catch (error) {
      console.error("Error updating stock:", error);
      toast({
        title: "Error",
        description: "Failed to update stock",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      base_price: "0",
      quantity: 0,
      low_stock_threshold: 5,
      product_code: "",
      barcode: "",
      qr_code: "",
      location_id: "",
      manual_price: "",
      store_price: "",
      images: [],
    });
  };

  const generateSKU = () => {
    const sku = "SKU" + Math.random().toString(36).substr(2, 9).toUpperCase();
    setFormData((prev) => ({ ...prev, product_code: sku }));
  };

  const simulateBarcodeScanning = () => {
    // Simulate barcode scanning - in real app, this would use camera
    const mockBarcode = Math.floor(Math.random() * 1000000000000).toString();
    setFormData((prev) => ({ ...prev, barcode: mockBarcode }));
    setShowBarcodeScanner(false);
    toast({
      title: "Barcode Scanned",
      description: `Barcode ${mockBarcode} has been added to the product`,
    });
  };

  const exportProducts = () => {
    const csvContent =
      "Product Name,Description,Price,Stock,Category,SKU,Status,Image URL\n" +
      products
        .map(
          (p) =>
            `"${p.name}","${p.description}",${p.base_price},${p.quantity},"${
              p.location.name
            }","${p.product_code || ""}","${
              p.is_active ? "Active" : "Inactive"
            }","${p.images && p.images.length > 0 ? p.images[0] : ""}"`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Products exported successfully",
    });
  };

  const getStockStatusColor = (quantity: number, threshold: number) => {
    if (quantity === 0) return "text-red-600";
    if (quantity <= threshold) return "text-yellow-600";
    return "text-green-600";
  };

  // Add a helper function to format currency
  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return !isNaN(numAmount) ? numAmount.toLocaleString() : "0";
  };

  const handleDeleteConfirm = async () => {
    if (!token || !selectedStore || !deletingProduct) return;

    try {
      await shoppingInventoryAPI.deleteProduct(
        token,
        selectedStore,
        deletingProduct.product_id
      );
      await loadProducts(selectedStore);
      setDeletingProduct(null);

      toast({
        title: "Success",
        description: "Product deleted successfully",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const DeleteConfirmDialog = () => (
    <Dialog
      open={!!deletingProduct}
      onOpenChange={(open) => !open && setDeletingProduct(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{deletingProduct?.name}"? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={() => setDeletingProduct(null)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  if (loading && stores.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Products Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your product catalog and inventory
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={exportProducts}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Dialog open={showAddOptions} onOpenChange={setShowAddOptions}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px]">
              <DialogHeader>
                <DialogTitle>Choose an Add Product Method</DialogTitle>
                <DialogDescription>
                  Select a method for adding products to your inventory.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
                <Card
                  className="p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors duration-200 h-full"
                  onClick={() =>
                    router.push(
                      `/business/dashboard/products/add?store_id=${selectedStore}`
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      router.push(
                        `/business/dashboard/products/add?store_id=${selectedStore}`
                      );
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <PlusSquare className="w-10 h-10 mb-4 text-primary" />
                  <p className="font-semibold text-lg">Batch Add</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add one or more products at a time.
                  </p>
                </Card>
                <Card
                  className="p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors duration-200 h-full"
                  onClick={() =>
                    router.push(
                      `/business/dashboard/products/scan?store_id=${selectedStore}`
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      router.push(
                        `/business/dashboard/products/scan?store_id=${selectedStore}`
                      );
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <Scan className="w-10 h-10 mb-4 text-primary" />
                  <p className="font-semibold text-lg">Scan Barcode</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add products using a barcode scanner.
                  </p>
                </Card>
                <Card
                  className="p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors duration-200 h-full"
                  onClick={() =>
                    router.push(
                      `/business/dashboard/products/import?store_id=${selectedStore}`
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      router.push(
                        `/business/dashboard/products/import?store_id=${selectedStore}`
                      );
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <FileUp className="w-10 h-10 mb-4 text-primary" />
                  <p className="font-semibold text-lg">Import from File</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload a CSV/Excel file.
                  </p>
                </Card>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Store Selection */}
      {Array.isArray(stores) && stores.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <label
                htmlFor="store-select"
                className="font-medium whitespace-nowrap"
              >
                Select Store:
              </label>
              <Select value={selectedStore} onValueChange={handleStoreChange}>
                <SelectTrigger className="w-[300px]">
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

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Products
                </p>
                <p className="text-3xl font-bold text-blue-500">
                  {(filteredProducts || []).length}
                </p>
              </div>
              <Boxes className="w-8 h-8 text-blue-500" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Low Stock
                </p>
                <p className="text-3xl font-bold text-yellow-500">
                  {
                    (filteredProducts || []).filter(
                      (p) =>
                        p.quantity > 0 && p.quantity <= p.low_stock_threshold
                    ).length
                  }
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Out of Stock
                </p>
                <p className="text-3xl font-bold text-red-500">
                  {
                    (filteredProducts || []).filter((p) => p.quantity === 0)
                      .length
                  }
                </p>
              </div>
              <PackageX className="w-8 h-8 text-red-500" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-600"></div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Value
                </p>
                <p className="text-3xl font-bold text-green-500">
                  UGX{" "}
                  {formatCurrency(
                    (filteredProducts || []).reduce(
                      (sum, p) =>
                        sum +
                        parseFloat(p.base_price || "0") * (p.quantity || 0),
                      0
                    )
                  )}
                </p>
              </div>
              <Banknote className="w-8 h-8 text-green-500" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="relative flex-1">
              {searchTerm.length === 0 && (
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
              )}
              <Input
                placeholder="Search products by name, description, or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-10"
                style={{
                  paddingLeft: searchTerm.length === 0 ? "2.5rem" : "0.75rem",
                }}
              />
            </div>

            <div className="flex items-center justify-center gap-4">
              <div className="h-10 flex items-center">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                  disabled={loadingCategories}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue
                      placeholder={
                        loadingCategories ? "Loading..." : "All Categories"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {(categories || []).map((category) => (
                      <SelectItem
                        key={category?.id || "default"}
                        value={category?.name || "unknown"}
                      >
                        {category?.name || "Unknown Category"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="h-10 flex items-center">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                onClick={() => loadProducts(selectedStore)}
                className="flex items-center gap-2 whitespace-nowrap h-10"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            {(filteredProducts || []).length} products found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (filteredProducts || []).length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || categoryFilter || statusFilter
                  ? "Try adjusting your search criteria"
                  : "Get started by adding your first product"}
              </p>
              <Button
                onClick={() => {
                  resetForm();
                  setShowAddOptions(true);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {(filteredProducts || []).map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors group relative"
                  role="button"
                  onClick={() =>
                    router.push(
                      `/business/dashboard/products/${
                        product.product_id || product.id
                      }?store_id=${selectedStore}`
                    )
                  }
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            // Fallback to icon if image fails to load
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement?.classList.add(
                              "flex"
                            );
                            e.currentTarget.parentElement?.classList.add(
                              "items-center"
                            );
                            e.currentTarget.parentElement?.classList.add(
                              "justify-center"
                            );
                          }}
                        />
                      ) : (
                        <Package className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <Badge
                      variant={product.is_active ? "default" : "secondary"}
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <h4 className="font-semibold truncate">{product.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-lg">
                          {product.currency}{" "}
                          {formatCurrency(product.base_price)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {product.location.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${getStockStatusColor(
                            product.quantity,
                            product.low_stock_threshold
                          )}`}
                        >
                          {product.quantity} units
                        </p>
                        {product.product_code && (
                          <p className="text-xs text-muted-foreground">
                            Code: {product.product_code}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/business/dashboard/products/${
                              product.product_id || product.id
                            }?store_id=${selectedStore}`
                          );
                        }}
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingProduct(product);
                        }}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Barcode Scanner Modal */}
      {showBarcodeScanner && (
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
                  onClick={() => setShowBarcodeScanner(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={simulateBarcodeScanning} className="flex-1">
                  Simulate Scan
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {DeleteConfirmDialog()}
    </div>
  );
}
