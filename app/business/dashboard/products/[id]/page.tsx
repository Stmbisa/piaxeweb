"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { shoppingInventoryAPI } from "@/lib/api/shopping-inventory";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Package,
  Edit2,
  Trash2,
  ArrowLeft,
  QrCode,
  Barcode,
  Tag,
  Calendar,
  Clock,
  DollarSign,
  Box,
  AlertTriangle,
  Image as ImageIcon,
  X,
} from "lucide-react";
import Image from "next/image";

interface ProductDetails {
  product_id: string;
  name: string;
  description: string;
  sku: string | null;
  barcode: string | null;
  product_code: string | null;
  piaxe_token: string | null;
  qr_code: string | null;
  external_qr_code: string | null;
  category: {
    name: string;
    description?: string;
    id: string;
  } | null;
  base_price: string;
  manual_price: string | null;
  currency: string;
  store_price: string | null;
  in_stock_quantity: number;
  total_quantity_in_store: number;
  low_stock_threshold: number;
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  specifications: Record<string, any>;
  variants: any[];
}

export default function ProductDetails() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { token } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    base_price: "",
    manual_price: "",
    sku: "",
    barcode: "",
    currency: "",
    category_id: "",
    low_stock_threshold: 0,
    is_active: true,
    images: [] as string[],
    specifications: {} as Record<string, any>,
    variants: [] as string[],
    store_price: "",
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const storeId = searchParams.get("store_id");
    if (!storeId) {
      toast({
        title: "Error",
        description: "Store ID is required",
        variant: "destructive",
      });
      router.push("/business/dashboard/products");
      return;
    }
    loadProductDetails(storeId);
    loadCategories(storeId);
  }, [params.id, searchParams]);

  const loadCategories = async (storeId: string) => {
    if (!token) return;
    try {
      const categoriesData = await shoppingInventoryAPI.getCategories(token);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadProductDetails = async (storeId: string) => {
    if (!token || !params.id) return;

    try {
      setLoading(true);
      const data = await shoppingInventoryAPI.getProduct(
        token,
        storeId,
        params.id as string
      );
      setProduct(data as unknown as ProductDetails);
      if (data.images?.length > 0) {
        setSelectedImage(data.images[0]);
      }
      // Initialize edit form with current values
      setEditForm({
        name: data.name,
        description: data.description,
        base_price: data.base_price,
        manual_price: data.manual_price || "",
        sku: data.sku || "",
        barcode: data.barcode || "",
        currency: data.currency,
        category_id: data.category?.id || "",
        low_stock_threshold: data.low_stock_threshold,
        is_active: data.is_active,
        images: data.images || [],
        specifications: data.specifications || {},
        variants: data.variants || [],
        store_price: data.store_price || "",
      });
    } catch (error) {
      console.error("Error loading product details:", error);
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive",
      });
      router.push("/business/dashboard/products");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    const storeId = searchParams.get("store_id");
    if (!token || !params.id || !storeId) return;

    try {
      setUpdateLoading(true);
      // Format the data according to the API's expected structure
      const updateData = {
        name: editForm.name,
        description: editForm.description,
        base_price: editForm.base_price.toString(),
        manual_price: editForm.manual_price
          ? editForm.manual_price.toString()
          : undefined,
        store_price: editForm.store_price
          ? editForm.store_price.toString()
          : undefined,
        sku: editForm.sku || undefined,
        barcode: editForm.barcode || undefined,
        currency: editForm.currency,
        category_id: editForm.category_id || undefined,
        low_stock_threshold: editForm.low_stock_threshold,
        is_active: editForm.is_active,
        images: editForm.images,
        specifications: editForm.specifications || {},
        variants: editForm.variants || [],
      };

      const updatedProduct = await shoppingInventoryAPI.updateProduct(
        token,
        storeId,
        params.id as string,
        updateData
      );
      setProduct(updatedProduct as unknown as ProductDetails);
      setShowEditDialog(false);
      toast({
        title: "Success",
        description: "Product updated successfully",
        variant: "default",
      });
      loadProductDetails(storeId);
    } catch (error: any) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    const storeId = searchParams.get("store_id");
    if (!token || !params.id || !storeId) return;

    try {
      await shoppingInventoryAPI.deleteProduct(
        token,
        storeId,
        params.id as string
      );
      toast({
        title: "Success",
        description: "Product deleted successfully",
        variant: "default",
      });
      router.push("/business/dashboard/products");
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStockStatusColor = (quantity: number, threshold: number) => {
    if (quantity === 0) return "text-red-600 dark:text-red-400";
    if (quantity <= threshold) return "text-yellow-600 dark:text-yellow-400";
    return "text-green-600 dark:text-green-400";
  };

  // Add Edit Dialog Component
  const EditDialog = () => (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to your product here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={editForm.category_id}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, category_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="base_price">Base Price</Label>
              <Input
                id="base_price"
                type="number"
                value={editForm.base_price}
                onChange={(e) =>
                  setEditForm({ ...editForm, base_price: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manual_price">Manual Price</Label>
              <Input
                id="manual_price"
                type="number"
                value={editForm.manual_price}
                onChange={(e) =>
                  setEditForm({ ...editForm, manual_price: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="store_price">Store Price</Label>
              <Input
                id="store_price"
                type="number"
                value={editForm.store_price}
                onChange={(e) =>
                  setEditForm({ ...editForm, store_price: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={editForm.currency}
                onChange={(e) =>
                  setEditForm({ ...editForm, currency: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={editForm.sku}
                onChange={(e) =>
                  setEditForm({ ...editForm, sku: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                value={editForm.barcode}
                onChange={(e) =>
                  setEditForm({ ...editForm, barcode: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="low_stock_threshold">Low Stock Threshold</Label>
              <Input
                id="low_stock_threshold"
                type="number"
                value={editForm.low_stock_threshold}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    low_stock_threshold: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="is_active">Status</Label>
              <Select
                value={editForm.is_active ? "active" : "inactive"}
                onValueChange={(value) =>
                  setEditForm({ ...editForm, is_active: value === "active" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => setShowEditDialog(false)}
            disabled={updateLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleEdit} disabled={updateLoading}>
            {updateLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Package className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push("/business/dashboard/products")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/business/dashboard/products")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {product.name}
            </h1>
            <p className="text-muted-foreground">{product.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setShowEditDialog(true)}
            className="flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  product and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent>
            {product.images && product.images.length > 0 ? (
              <div className="space-y-4">
                <div className="aspect-square relative rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={selectedImage || product.images[0]}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className={`aspect-square relative rounded-lg overflow-hidden bg-muted ${
                          selectedImage === image ? "ring-2 ring-primary" : ""
                        }`}
                        aria-label={`View ${product.name} image ${index + 1}`}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square flex items-center justify-center bg-muted rounded-lg">
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No images available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Status and Price */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <Badge variant={product.is_active ? "default" : "secondary"}>
                  {product.is_active ? "Active" : "Inactive"}
                </Badge>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-2xl font-bold">
                    {product.currency}{" "}
                    {parseFloat(product.base_price).toLocaleString()}
                  </p>
                  {product.store_price &&
                    product.store_price !== product.base_price && (
                      <p className="text-sm text-muted-foreground">
                        Store Price: {product.currency}{" "}
                        {parseFloat(product.store_price).toLocaleString()}
                      </p>
                    )}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Stock Information */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">In Stock</span>
                  <span
                    className={`font-semibold ${getStockStatusColor(
                      product.in_stock_quantity,
                      product.low_stock_threshold
                    )}`}
                  >
                    {product.in_stock_quantity} units
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total in Store</span>
                  <span className="font-semibold">
                    {product.total_quantity_in_store} units
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Low Stock Alert</span>
                  <span className="font-semibold">
                    {product.low_stock_threshold} units
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {product.category && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{product.category.name}</p>
                  </div>
                </div>
              )}

              {product.product_code && (
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Product Code
                    </p>
                    <p className="font-medium">{product.product_code}</p>
                  </div>
                </div>
              )}

              {product.barcode && (
                <div className="flex items-center gap-2">
                  <Barcode className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Barcode</p>
                    <p className="font-medium">{product.barcode}</p>
                  </div>
                </div>
              )}

              {product.qr_code && (
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">QR Code</p>
                    <p className="font-medium">{product.qr_code}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {formatDate(product.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {formatDate(product.updated_at)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          {Object.keys(product.specifications).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          {key}
                        </span>
                        <span className="font-medium">{value as string}</span>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {EditDialog()}
    </div>
  );
}
