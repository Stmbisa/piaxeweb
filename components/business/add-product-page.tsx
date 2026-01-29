"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";
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
import {
  Package,
  PlusSquare,
  Barcode,
  Tag,
  Plus,
  X,
  Upload,
  RefreshCw,
  CalendarIcon,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import UgxOnlyCurrencySelector, {
  type CurrencyLike,
} from "@/components/common/UgxOnlyCurrencySelector";

// Import the new services
import {
  uploadImageToImageKit,
  cleanupUnusedImages,
} from "@/lib/api/imagekit-service";
import {
  BatchProductInput,
  ProductCategory,
  ProductLocation,
  batchAddProducts,
  getProductCategories,
  getStoreLocations,
} from "@/lib/api/product-service";

// Interfaces for the product form
interface ProductImage {
  localFile?: File;
  imageUrl?: string;
  fileId?: string;
  status: "pending" | "uploaded" | "failed";
}

interface ProductFormData {
  name: string;
  description: string;
  base_price: string;
  currency: string;
  quantity: number;
  location_id: string;
  category_id: string;
  sku: string;
  code: string;
  code_type: string;
  image?: ProductImage;
  image_url: string;
  image_file_id: string;
  expiry_date: string;
  is_ecommerce_enabled: boolean;
  low_stock_threshold: number;
  images: string[]; // Array of image URLs
}

const CURRENCIES: CurrencyLike[] = [
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
];

const emptyProduct: ProductFormData = {
  name: "",
  description: "",
  base_price: "",
  currency: "UGX",
  quantity: 1,
  location_id: "",
  category_id: "",
  sku: "",
  code: "",
  code_type: "barcode",
  image: undefined,
  image_url: "",
  image_file_id: "",
  expiry_date: "",
  is_ecommerce_enabled: true,
  low_stock_threshold: 5,
  images: [], // Initialize empty array for multiple images
};

export default function AddProductPage({ storeId }: { storeId: string }) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductFormData[]>([
    { ...emptyProduct, location_id: storeId },
  ]);
  const [imageUploadingIndex, setImageUploadingIndex] = useState<number | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // State for data that would be from React Query
  const [locations, setLocations] = useState<ProductLocation[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load locations
  useEffect(() => {
    async function fetchLocations() {
      if (!token || !storeId) return;

      try {
        const data = await getStoreLocations(token, storeId);
        setLocations(data);

        if (data.length > 0) {
          setProducts((prev) =>
            prev.map((p) => ({
              ...p,
              location_id: p.location_id || data[0].id,
            }))
          );
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load store locations",
          variant: "destructive",
        });
      }
    }

    fetchLocations();
  }, [token, storeId, toast]);

  // Load categories
  useEffect(() => {
    async function fetchCategories() {
      if (!token) return;

      try {
        const data = await getProductCategories(token);
        setCategories(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load product categories",
          variant: "destructive",
        });
      }
    }

    fetchCategories();
  }, [token, toast]);

  const handleAddProduct = () => {
    setProducts([...products, { ...emptyProduct, location_id: storeId }]);
  };

  const handleRemoveProduct = (idx: number) => {
    if (products.length > 1) {
      setProducts((prev) => prev.filter((_, i) => i !== idx));
    } else {
      // If it's the last product, just reset it instead of removing
      setProducts([{ ...emptyProduct, location_id: storeId }]);
    }
  };

  const handleChange = (idx: number, key: string, value: any) => {
    setProducts((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [key]: value } : p))
    );
  };

  const triggerFileInput = (idx: number) => {
    if (fileInputRef.current) {
      // Store the current product index for later use
      fileInputRef.current.dataset.productIndex = idx.toString();
      fileInputRef.current.click();
    }
  };

  // Add function to handle image deletion
  const handleDeleteImage = async (idx: number) => {
    try {
      const product = products[idx];

      console.log(
        "[Delete Image] Starting image deletion process for product index:",
        idx
      );
      console.log("[Delete Image] Image details:", {
        imageUrl: product.image_url,
        fileId: product.image_file_id,
      });

      // Update the UI immediately for better user experience
      // Store the previous state in case we need to revert
      const previousImage = { ...product.image };
      const previousImageUrl = product.image_url;
      const previousImageFileId = product.image_file_id;
      const previousImages = [...(product.images || [])];

      // Update the product state to remove the image
      handleChange(idx, "image", undefined);
      handleChange(idx, "image_url", "");
      handleChange(idx, "image_file_id", "");

      // Also remove from images array if it exists there
      if (product.images && product.images.includes(product.image_url)) {
        const updatedImages = product.images.filter(
          (img) => img !== product.image_url
        );
        handleChange(idx, "images", updatedImages);
      }

      toast({
        title: "Image Removed",
        description: "The product image has been removed from the form",
      });

      // Try to delete from server in the background
      if (product.image_file_id) {
        console.log(
          "[Delete Image] Attempting server deletion for fileId:",
          product.image_file_id
        );
        try {
          await cleanupUnusedImages([product.image_file_id]);
          console.log("[Delete Image] Image deleted successfully from server");
          toast({
            title: "Success",
            description: "Image deleted from server successfully",
          });
        } catch (error) {
          console.error(
            "[Delete Image] Failed to delete image from server:",
            error
          );
          toast({
            title: "Warning",
            description:
              "The image was removed from the form but may still exist on the server",
            variant: "default",
          });
          // Don't revert UI - let the user continue working even if server deletion fails
        }
      } else {
        console.log("[Delete Image] No fileId available for server deletion");
      }
    } catch (error: any) {
      console.error("[Delete Image] Error handling image deletion:", error);
      toast({
        title: "Warning",
        description:
          "The image was removed from the form but may not have been deleted from the server",
        variant: "default",
      });
    }
  };

  const handleFileSelected = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;

    // Get product index from the data attribute we set
    const idx = fileInputRef.current?.dataset.productIndex
      ? parseInt(fileInputRef.current.dataset.productIndex)
      : 0;

    setImageUploadingIndex(idx);

    try {
      // Update product with "pending" status
      handleChange(idx, "image", {
        localFile: file,
        status: "pending",
      });

      // Upload image using our ImageKit service
      const uploadResult = await uploadImageToImageKit(
        {
          uri: URL.createObjectURL(file),
          name: file.name,
          mimeType: file.type,
          size: file.size,
        },
        token
      );

      // Update product with uploaded image info
      handleChange(idx, "image", {
        localFile: file,
        imageUrl: uploadResult.url,
        fileId: uploadResult.fileId,
        status: "uploaded",
      });
      handleChange(idx, "image_url", uploadResult.url);
      handleChange(idx, "image_file_id", uploadResult.fileId);

      // Also add to images array for multiple image support
      const currentProduct = products[idx];
      const updatedImages = [
        ...(currentProduct.images || []),
        uploadResult.url,
      ];
      handleChange(idx, "images", updatedImages);

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      console.error("Image upload error:", error);

      // Update product with failed status
      handleChange(idx, "image", {
        localFile: file,
        status: "failed",
      });

      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setImageUploadingIndex(null);

      // Reset the file input so the same file can be selected again if needed
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const generateSKU = (idx: number) => {
    const sku = "SKU" + Math.random().toString(36).substr(2, 9).toUpperCase();
    handleChange(idx, "sku", sku);
  };

  const handleSubmitBatch = async () => {
    // Basic validation
    const invalidProducts = products.filter(
      (p) => !p.name || !p.base_price || !p.location_id
    );
    if (invalidProducts.length > 0) {
      toast({
        title: "Validation Error",
        description: "All products must have a name, price, and location",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (!token) {
        throw new Error("Authentication required");
      }

      // Transform products to match API expectations
      const batchProducts = products.map((p) => {
        // Prepare the images array - use the images array if it exists and has items,
        // otherwise use the single image_url if it exists
        const productImages =
          p.images && p.images.length > 0
            ? p.images
            : p.image_url
            ? [p.image_url]
            : [];

        return {
          name: p.name,
          description: p.description,
          base_price: parseFloat(p.base_price),
          currency: p.currency,
          category_id: p.category_id,
          location_id: p.location_id,
          sku: p.sku,
          code: p.code,
          code_type: p.code_type,
          image_url: p.image_url,
          image_file_id: p.image_file_id,
          expiry_date: p.expiry_date,
          is_ecommerce_enabled: p.is_ecommerce_enabled,
          quantity: p.quantity,
          images: productImages,
        };
      });

      console.log(
        "Submitting products with images:",
        batchProducts.map((p) => ({ name: p.name, images: p.images }))
      );

      // Use our API service
      await batchAddProducts(token, storeId, batchProducts);

      toast({
        title: "Success",
        description: `${products.length} ${
          products.length === 1 ? "product" : "products"
        } added successfully.`,
      });

      // Navigate back to products page
      router.push(`/business/dashboard/products?store_id=${storeId}`);
    } catch (error: any) {
      console.error("Error adding products:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add products",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = products.every(
    (p) => p.name.trim() && p.base_price && p.location_id
  );

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Batch Add Products
          </h1>
          <p className="text-muted-foreground mt-1">
            Add multiple products to your inventory
          </p>
        </div>
        <Package className="h-10 w-10 text-primary" />
      </div>

      {/* Product Forms */}
      {products.map((product, idx) => (
        <Card key={idx} className="w-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <PlusSquare className="h-5 w-5" />
                {product.name ? product.name : `Product ${idx + 1}`}
              </CardTitle>
              {products.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveProduct(idx)}
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </Button>
              )}
            </div>
            <CardDescription>Enter product details</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor={`name-${idx}`}>Product Name *</Label>
                <Input
                  id={`name-${idx}`}
                  value={product.name}
                  onChange={(e) => handleChange(idx, "name", e.target.value)}
                  placeholder="Enter product name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`base_price-${idx}`}>Price *</Label>
                  <Input
                    id={`base_price-${idx}`}
                    type="number"
                    value={product.base_price}
                    onChange={(e) =>
                      handleChange(idx, "base_price", e.target.value)
                    }
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`quantity-${idx}`}>Initial Stock</Label>
                  <Input
                    id={`quantity-${idx}`}
                    type="number"
                    value={product.quantity}
                    onChange={(e) =>
                      handleChange(
                        idx,
                        "quantity",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`description-${idx}`}>Description</Label>
              <Textarea
                id={`description-${idx}`}
                value={product.description}
                onChange={(e) =>
                  handleChange(idx, "description", e.target.value)
                }
                placeholder="Describe your product"
                className="resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <UgxOnlyCurrencySelector
                  title="Currency *"
                  currencies={CURRENCIES}
                  value={product.currency}
                  onChange={(value) => handleChange(idx, "currency", value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`category-${idx}`}>Category</Label>
                <Select
                  value={product.category_id}
                  onValueChange={(value) =>
                    handleChange(idx, "category_id", value)
                  }
                >
                  <SelectTrigger id={`category-${idx}`}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor={`sku-${idx}`}
                  className="flex items-center justify-between"
                >
                  <span>SKU</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => generateSKU(idx)}
                    className="h-6 text-xs"
                  >
                    Generate
                  </Button>
                </Label>
                <Input
                  id={`sku-${idx}`}
                  value={product.sku}
                  onChange={(e) => handleChange(idx, "sku", e.target.value)}
                  placeholder="Enter product SKU"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor={`code-${idx}`}
                  className="flex items-center gap-1"
                >
                  <Barcode className="h-3.5 w-3.5" />
                  <span>Code</span>
                </Label>
                <Input
                  id={`code-${idx}`}
                  value={product.code}
                  onChange={(e) => handleChange(idx, "code", e.target.value)}
                  placeholder="Enter product code/barcode"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor={`code_type-${idx}`}>Code Type</Label>
                <Select
                  value={product.code_type}
                  onValueChange={(value) =>
                    handleChange(idx, "code_type", value)
                  }
                >
                  <SelectTrigger id={`code_type-${idx}`}>
                    <SelectValue placeholder="Select code type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="barcode">Barcode</SelectItem>
                    <SelectItem value="qrcode">QR Code</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`expiry_date-${idx}`}>Expiry Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !product.expiry_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {product.expiry_date ? (
                        format(new Date(product.expiry_date), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        product.expiry_date
                          ? new Date(product.expiry_date)
                          : undefined
                      }
                      onSelect={(date) =>
                        handleChange(
                          idx,
                          "expiry_date",
                          date ? format(date, "yyyy-MM-dd") : ""
                        )
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`low_stock_threshold-${idx}`}
                className="flex items-center gap-1"
              >
                <Tag className="h-3.5 w-3.5" />
                <span>Low Stock Alert Threshold</span>
              </Label>
              <Input
                id={`low_stock_threshold-${idx}`}
                type="number"
                value={product.low_stock_threshold}
                onChange={(e) =>
                  handleChange(
                    idx,
                    "low_stock_threshold",
                    parseInt(e.target.value) || 0
                  )
                }
                placeholder="5"
                className="max-w-xs"
              />
              <p className="text-sm text-muted-foreground">
                You'll be alerted when stock falls below this number
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`location-${idx}`}>Store Location *</Label>
              <Select
                value={product.location_id}
                onValueChange={(value) =>
                  handleChange(idx, "location_id", value)
                }
              >
                <SelectTrigger id={`location-${idx}`}>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Product Image</Label>
              <div className="flex items-center space-x-4">
                {product.image_url ? (
                  <div className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-200">
                    <Image
                      src={product.image_url}
                      alt={product.name || `Product ${idx + 1}`}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-0 right-0 h-6 w-6 rounded-full"
                      onClick={() => handleDeleteImage(idx)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-md bg-muted flex items-center justify-center border border-gray-200">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => triggerFileInput(idx)}
                    disabled={imageUploadingIndex === idx}
                    className="relative"
                  >
                    {imageUploadingIndex === idx ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </>
                    )}
                  </Button>
                  {product.image_url && (
                    <Button
                      variant="outline"
                      onClick={() => handleDeleteImage(idx)}
                      className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`ecommerce-${idx}`}
                checked={product.is_ecommerce_enabled}
                onChange={(e) =>
                  handleChange(idx, "is_ecommerce_enabled", e.target.checked)
                }
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                aria-label="Enable product for e-commerce"
                title="Enable product for e-commerce"
              />
              <Label
                htmlFor={`ecommerce-${idx}`}
                className="text-sm font-normal"
              >
                Enable for e-commerce
              </Label>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Shared file input that will be triggered by buttons */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        accept="image/*"
        className="hidden"
        aria-label="Upload product image"
        title="Upload product image"
      />

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={handleAddProduct}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Another Product
        </Button>
      </div>

      <div className="flex justify-end">
        <Button
          variant="default"
          onClick={handleSubmitBatch}
          disabled={isSubmitting || !isFormValid}
          className="px-8"
        >
          {isSubmitting
            ? "Adding Products..."
            : `Add ${products.length} ${
                products.length === 1 ? "Product" : "Products"
              }`}
        </Button>
      </div>
    </div>
  );
}
