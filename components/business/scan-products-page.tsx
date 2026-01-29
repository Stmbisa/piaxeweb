"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth/context";
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
import {
  ScanLine,
  Plus,
  Trash2,
  Camera,
  Barcode,
  Upload,
  RefreshCw,
  Image as ImageIcon,
  CalendarIcon,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";
import UgxOnlyCurrencySelector, {
  type CurrencyLike,
} from "@/components/common/UgxOnlyCurrencySelector";
import {
  scanProduct,
  getStoreLocations,
  getProductCategories,
  ScanProductInput,
  ProductLocation,
  ProductCategory,
  Product,
} from "@/lib/api/product-service";
import {
  uploadImageToImageKit,
  cleanupUnusedImages,
} from "@/lib/api/imagekit-service";
import { useRouter } from "next/navigation";

const CURRENCIES: CurrencyLike[] = [
  { code: "UGX", name: "Ugandan Shilling", symbol: "USh" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
];

interface ProductImage {
  localFile?: File;
  imageUrl?: string;
  fileId?: string;
  status: "pending" | "uploaded" | "failed";
}

// Fix the ScanFormData interface to correctly extend ScanProductInput
interface ScanFormData {
  image?: ProductImage;
  name: string;
  description: string;
  base_price: string; // Keep as string for input handling
  currency: string;
  location_id: string;
  category_id: string;
  code: string;
  code_type: string;
  barcode?: string;
  qr_code?: string;
  sku?: string;
  images: string[];
  is_ecommerce_enabled: boolean;
  expiry_date: string;
  store_category_id?: string;
}

const defaultFormData: ScanFormData = {
  name: "",
  description: "",
  base_price: "",
  currency: "UGX",
  location_id: "",
  category_id: "",
  code: "",
  code_type: "barcode",
  barcode: "",
  qr_code: "",
  sku: "",
  images: [],
  is_ecommerce_enabled: true,
  expiry_date: "",
};

export default function ScanProductsPage({ storeId }: { storeId: string }) {
  const { token } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scanningField, setScanningField] = useState<string>("");
  const [formData, setFormData] = useState<ScanFormData>({
    ...defaultFormData,
    location_id: storeId,
  });

  // References and state for file upload
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUploading, setImageUploading] = useState(false);

  // State for data loaded from API
  const [locations, setLocations] = useState<ProductLocation[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  // Add these imports
  const codeInputRef = useRef<HTMLInputElement>(null);
  const skuInputRef = useRef<HTMLInputElement>(null);
  const [activeInputField, setActiveInputField] = useState<string>("code");
  const [lastKeyTime, setLastKeyTime] = useState<number>(0);
  const [barcodeBuffer, setBarcodeBuffer] = useState<string>("");
  const [isListeningForScan, setIsListeningForScan] = useState<boolean>(false);

  // Load data when component mounts
  useEffect(() => {
    loadData();
  }, []);

  // Add this effect for barcode scanner detection
  useEffect(() => {
    // Barcode scanners typically send data very quickly, like keyboard input but faster
    const SCAN_THRESHOLD = 50; // milliseconds between keypresses to be considered a scan
    const SCAN_TIMEOUT = 100; // milliseconds after last keypress to process the scan
    let scanTimer: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isListeningForScan) return;

      const currentTime = new Date().getTime();
      const isRapidInput = currentTime - lastKeyTime < SCAN_THRESHOLD;

      // Only process printable characters and Enter key
      if (e.key.length === 1 || e.key === "Enter") {
        if (e.key === "Enter") {
          // Enter key usually signifies the end of a barcode scan
          if (barcodeBuffer) {
            // Process the complete barcode
            processBarcodeInput(barcodeBuffer);
            setBarcodeBuffer("");
          }
        } else if (isRapidInput || barcodeBuffer.length === 0) {
          // If this is rapid input or the start of a new scan, add to buffer
          setBarcodeBuffer((prev) => prev + e.key);

          // Clear any existing timeout
          if (scanTimer) clearTimeout(scanTimer);

          // Set a timeout to process the barcode after a short delay
          scanTimer = setTimeout(() => {
            if (barcodeBuffer) {
              processBarcodeInput(barcodeBuffer);
              setBarcodeBuffer("");
            }
          }, SCAN_TIMEOUT);
        } else {
          // If not rapid input and not the first character, reset the buffer
          setBarcodeBuffer(e.key);
        }

        setLastKeyTime(currentTime);
      }
    };

    const processBarcodeInput = (barcode: string) => {
      if (barcode.length < 4) return; // Too short to be a valid barcode

      console.log("Barcode detected:", barcode);

      // Update the appropriate field based on active input
      if (activeInputField === "code") {
        handleChange("code", barcode);

        // Also update the specific code type
        if (formData.code_type === "barcode") {
          handleChange("barcode", barcode);
        } else if (formData.code_type === "qrcode") {
          handleChange("qr_code", barcode);
        }

        toast({
          title: "Barcode Scanned",
          description: `Barcode ${barcode} has been added`,
        });
      } else if (activeInputField === "sku") {
        handleChange("sku", barcode);

        toast({
          title: "SKU Scanned",
          description: `SKU ${barcode} has been added`,
        });
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (scanTimer) clearTimeout(scanTimer);
    };
  }, [
    isListeningForScan,
    lastKeyTime,
    barcodeBuffer,
    activeInputField,
    formData.code_type,
  ]);

  // Add this function to focus the appropriate input and enable scanning
  const enableScanMode = (field: string) => {
    setActiveInputField(field);
    setIsListeningForScan(true);

    // Focus the appropriate input
    if (field === "code" && codeInputRef.current) {
      codeInputRef.current.focus();
    } else if (field === "sku" && skuInputRef.current) {
      skuInputRef.current.focus();
    }

    toast({
      title: "Scanner Ready",
      description: "Please scan a barcode now",
    });
  };

  // Add this function to disable scan mode
  const disableScanMode = () => {
    setIsListeningForScan(false);
    setBarcodeBuffer("");
  };

  const loadData = async () => {
    if (!token) return;

    try {
      // Load locations
      const locationsData = await getStoreLocations(token, storeId);
      setLocations(locationsData);

      if (locationsData.length > 0) {
        setFormData((prev) => ({ ...prev, location_id: locationsData[0].id }));
      }

      // Load categories
      const categoriesData = await getProductCategories(token);
      setCategories(categoriesData);
    } catch (error: any) {
      console.error("Failed to load initial data:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load data",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: keyof ScanFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Special handling for code_type
    if (field === "code_type" && formData.code) {
      // Update the corresponding code field
      if (value === "barcode") {
        setFormData((prev) => ({ ...prev, barcode: prev.code, qr_code: "" }));
      } else if (value === "qrcode") {
        setFormData((prev) => ({ ...prev, qr_code: prev.code, barcode: "" }));
      }
    }
  };

  const startScanning = (field: string) => {
    setScanningField(field);
    setShowScanner(true);
  };

  const simulateBarcodeScan = () => {
    if (!scanningField) return;

    // Generate a random barcode for demo purposes
    const mockBarcode = Math.floor(Math.random() * 1000000000000).toString();

    if (scanningField === "code") {
      handleChange("code", mockBarcode);

      // Also update the specific code type
      if (formData.code_type === "barcode") {
        handleChange("barcode", mockBarcode);
      } else if (formData.code_type === "qrcode") {
        handleChange("qr_code", mockBarcode);
      }
    } else if (scanningField === "sku") {
      handleChange("sku", mockBarcode);
    }

    toast({
      title: "Barcode Scanned",
      description: `Barcode ${mockBarcode} has been added`,
    });

    setShowScanner(false);
    setScanningField("");
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;

    setImageUploading(true);

    try {
      // Update form with "pending" status
      setFormData((prev) => ({
        ...prev,
        image: {
          localFile: file,
          status: "pending",
        },
      }));

      // Upload image using ImageKit service
      const uploadResult = await uploadImageToImageKit(
        {
          uri: URL.createObjectURL(file),
          name: file.name,
          mimeType: file.type,
          size: file.size,
        },
        token
      );

      // Update form with uploaded image info
      setFormData((prev) => ({
        ...prev,
        image: {
          localFile: file,
          imageUrl: uploadResult.url,
          fileId: uploadResult.fileId,
          status: "uploaded",
        },
        images: [...prev.images, uploadResult.url],
      }));

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      console.error("Image upload error:", error);

      // Update form with failed status
      setFormData((prev) => ({
        ...prev,
        image: {
          localFile: file,
          status: "failed",
        },
      }));

      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setImageUploading(false);

      // Reset file input
      if (event.target) {
        event.target.value = "";
      }
    }
  };

  const handleDeleteImage = async (index: number) => {
    try {
      const imageUrl = formData.images[index];
      const fileId = formData.image?.fileId;

      // Remove from the UI first
      const updatedImages = [...formData.images];
      updatedImages.splice(index, 1);

      setFormData((prev) => ({
        ...prev,
        images: updatedImages,
        // If it's the last or only image, also clear the image object
        ...(updatedImages.length === 0 && { image: undefined }),
      }));

      toast({
        title: "Image Removed",
        description: "The image has been removed from the form",
      });

      // Try to delete from server if we have the fileId
      if (fileId) {
        try {
          await cleanupUnusedImages([fileId]);
          console.log("Image deleted from server");
        } catch (error) {
          console.error("Failed to delete image from server:", error);
          // Don't show error to user as we've already removed it from the UI
        }
      }
    } catch (error: any) {
      console.error("Error handling image deletion:", error);
    }
  };

  const generateSKU = () => {
    const sku = "SKU" + Math.random().toString(36).substr(2, 9).toUpperCase();
    handleChange("sku", sku);
  };

  const validateForm = () => {
    const requiredFields = [
      { field: "name", label: "Product Name" },
      { field: "base_price", label: "Price" },
      { field: "location_id", label: "Location" },
    ];

    const missingFields = requiredFields.filter(
      ({ field }) => !formData[field as keyof ScanFormData]
    );

    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in required fields: ${missingFields
          .map((f) => f.label)
          .join(", ")}`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!token) {
      toast({
        title: "Error",
        description: "You must be logged in to add products",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Prepare the product data
      const productData: ScanProductInput = {
        name: formData.name,
        description: formData.description,
        base_price: formData.base_price
          ? parseFloat(formData.base_price)
          : undefined,
        currency: formData.currency,
        category_id: formData.category_id,
        location_id: formData.location_id,
        sku: formData.sku,
        code: formData.code,
        code_type: formData.code_type,
        barcode: formData.barcode,
        qr_code: formData.qr_code,
        is_ecommerce_enabled: formData.is_ecommerce_enabled,
        images: formData.images,
      };

      console.log("Submitting product data:", productData);

      const response = await scanProduct(token, storeId, productData);

      toast({
        title: "Success",
        description: "Product added successfully",
      });

      // Navigate back to products page
      router.push(`/business/dashboard/products?store_id=${storeId}`);
    } catch (error: any) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Scan & Add Product
          </h1>
          <p className="text-muted-foreground mt-1">
            Add products by scanning barcodes or entering details manually
          </p>
        </div>
        <ScanLine className="h-10 w-10 text-primary" />
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Barcode className="h-5 w-5" />
            Scan Product
          </CardTitle>
          <CardDescription>
            Scan a product barcode or enter details manually to add to your
            inventory
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Add this section at the top of the card content to provide instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
            <h3 className="font-medium flex items-center gap-2 mb-2">
              <Barcode className="h-4 w-4" />
              Using a Barcode Scanner
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              This page supports physical barcode scanners that work as keyboard
              emulators.
            </p>
            <ol className="text-sm text-muted-foreground list-decimal pl-5 space-y-1">
              <li>
                Click the "Scan" button next to the field you want to scan into
              </li>
              <li>
                When the field highlights, scan your barcode with your scanner
              </li>
              <li>The value will be automatically entered into the field</li>
              <li>Click "Cancel Scan" when you're done scanning</li>
            </ol>
          </div>

          {/* Product Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter product name"
                aria-label="Product Name"
                title="Product Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="base_price">Price *</Label>
              <Input
                id="base_price"
                type="number"
                value={formData.base_price}
                onChange={(e) => handleChange("base_price", e.target.value)}
                placeholder="0.00"
                aria-label="Price"
                title="Price"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Product description"
              className="resize-none"
              rows={3}
              aria-label="Product Description"
              title="Product Description"
            />
          </div>

          {/* Currency and Category Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <UgxOnlyCurrencySelector
                title="Currency *"
                currencies={CURRENCIES}
                value={formData.currency}
                onChange={(value) => handleChange("currency", value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => handleChange("category_id", value)}
              >
                <SelectTrigger id="category">
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

          {/* Location Section */}
          <div className="space-y-2">
            <Label htmlFor="location">Store Location *</Label>
            <Select
              value={formData.location_id}
              onValueChange={(value) => handleChange("location_id", value)}
            >
              <SelectTrigger id="location">
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

          {/* Code Type Section */}
          <div className="space-y-2">
            <Label>Code Type</Label>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant={
                  formData.code_type === "barcode" ? "default" : "outline"
                }
                onClick={() => handleChange("code_type", "barcode")}
                className="flex-1"
              >
                Barcode
              </Button>
              <Button
                type="button"
                variant={
                  formData.code_type === "qrcode" ? "default" : "outline"
                }
                onClick={() => handleChange("code_type", "qrcode")}
                className="flex-1"
              >
                QR Code
              </Button>
            </div>
          </div>

          {/* Barcode Section */}
          <div className="space-y-2">
            <Label htmlFor="code">Product Code</Label>
            <div className="flex gap-2">
              <Input
                id="code"
                ref={codeInputRef}
                value={formData.code}
                onChange={(e) => handleChange("code", e.target.value)}
                onFocus={() => setActiveInputField("code")}
                placeholder="Enter or scan code"
                className={`flex-1 ${
                  isListeningForScan && activeInputField === "code"
                    ? "border-primary border-2"
                    : ""
                }`}
                aria-label="Product Code"
                title="Product Code"
              />
              <Button
                type="button"
                variant={
                  isListeningForScan && activeInputField === "code"
                    ? "default"
                    : "outline"
                }
                onClick={() => {
                  if (isListeningForScan && activeInputField === "code") {
                    disableScanMode();
                  } else {
                    enableScanMode("code");
                  }
                }}
                className="flex items-center gap-1"
              >
                <Camera className="h-4 w-4" />
                {isListeningForScan && activeInputField === "code"
                  ? "Cancel Scan"
                  : "Scan"}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {isListeningForScan && activeInputField === "code"
                ? "Scanner active: Please scan a barcode now or click Cancel Scan when done"
                : `This will be saved as a ${
                    formData.code_type === "barcode" ? "barcode" : "QR code"
                  }`}
            </p>
          </div>

          {/* SKU Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="sku">SKU</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={generateSKU}
                className="text-xs"
              >
                Generate
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                id="sku"
                ref={skuInputRef}
                value={formData.sku}
                onChange={(e) => handleChange("sku", e.target.value)}
                onFocus={() => setActiveInputField("sku")}
                placeholder="Enter SKU"
                className={`flex-1 ${
                  isListeningForScan && activeInputField === "sku"
                    ? "border-primary border-2"
                    : ""
                }`}
                aria-label="SKU"
                title="SKU"
              />
              <Button
                type="button"
                variant={
                  isListeningForScan && activeInputField === "sku"
                    ? "default"
                    : "outline"
                }
                onClick={() => {
                  if (isListeningForScan && activeInputField === "sku") {
                    disableScanMode();
                  } else {
                    enableScanMode("sku");
                  }
                }}
                className="flex items-center gap-1"
              >
                <Camera className="h-4 w-4" />
                {isListeningForScan && activeInputField === "sku"
                  ? "Cancel Scan"
                  : "Scan"}
              </Button>
            </div>
            {isListeningForScan && activeInputField === "sku" && (
              <p className="text-sm text-muted-foreground">
                Scanner active: Please scan a barcode now or click Cancel Scan
                when done
              </p>
            )}
          </div>

          {/* Expiry Date Section */}
          <div className="space-y-2">
            <Label htmlFor="expiry_date">Expiry Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.expiry_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.expiry_date ? (
                    format(new Date(formData.expiry_date), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={
                    formData.expiry_date
                      ? new Date(formData.expiry_date)
                      : undefined
                  }
                  onSelect={(date) =>
                    handleChange(
                      "expiry_date",
                      date ? format(date, "yyyy-MM-dd") : ""
                    )
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Product Images Section */}
          <div className="space-y-2">
            <Label>Product Images</Label>
            <div className="flex flex-wrap gap-4">
              {formData.images.map((imageUrl, index) => (
                <div key={index} className="relative">
                  <div className="w-24 h-24 border rounded-md overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={`Product image ${index + 1}`}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => handleDeleteImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}

              {/* Upload button */}
              <div
                className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-primary"
                onClick={triggerFileInput}
              >
                {imageUploading ? (
                  <>
                    <RefreshCw className="h-6 w-6 text-muted-foreground animate-spin" />
                    <span className="text-xs text-muted-foreground mt-2">
                      Uploading...
                    </span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-2">
                      Add Image
                    </span>
                  </>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelected}
                accept="image/*"
                aria-label="Upload product image"
                title="Upload product image"
              />
            </div>
          </div>

          {/* E-commerce Option */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="ecommerce"
              checked={formData.is_ecommerce_enabled}
              onChange={(e) =>
                handleChange("is_ecommerce_enabled", e.target.checked)
              }
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              aria-label="Enable for e-commerce"
              title="Enable for e-commerce"
            />
            <Label htmlFor="ecommerce" className="text-sm font-normal">
              Enable for e-commerce
            </Label>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="min-w-32"
          >
            {loading ? "Saving..." : "Save Product"}
          </Button>
        </CardFooter>
      </Card>

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
                    setScanningField("");
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
