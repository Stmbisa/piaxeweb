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
import { FileUp, Upload, FileCheck, AlertCircle } from "lucide-react";

export default function ImportProductsPage({ storeId }: { storeId: string }) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!token || !file) return;
    setLoading(true);
    try {
      const response = await shoppingInventoryAPI.importProducts(
        token,
        storeId,
        file
      );
      setTaskId(response.task_id);
      toast({
        title: "Success",
        description: "File uploaded, import is processing.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to import products.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    if (!token || !taskId) return;
    setLoading(true);
    try {
      const response = await shoppingInventoryAPI.getImportStatus(
        token,
        storeId,
        taskId
      );
      toast({
        title: "Import Status",
        description: `Status: ${response.status}, Message: ${response.message}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to check status.",
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
          <h1 className="text-3xl font-bold tracking-tight">Import Products</h1>
          <p className="text-muted-foreground mt-1">
            Upload a CSV or Excel file to bulk import products
          </p>
        </div>
        <FileUp className="h-10 w-10 text-primary" />
      </div>

      <div style={{ width: "100%" }}>
        <Card style={{ width: "100%", maxWidth: "none" }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Products from File
            </CardTitle>
            <CardDescription>
              Upload a CSV or Excel file to import products. The file should
              contain columns for product name, description, price, and
              quantity.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Product File</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  accept=".csv,.xlsx,.xls"
                />
                {file && (
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <FileCheck className="h-4 w-4 text-green-500" />
                    {file.name}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Supported formats: CSV, Excel (.xlsx, .xls)
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-md">
              <h4 className="font-medium mb-2 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                File Format Requirements
              </h4>
              <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                <li>First row must contain column headers</li>
                <li>
                  Required columns: name, description, base_price, quantity
                </li>
                <li>Optional columns: product_code, barcode, category</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
            <Button
              onClick={handleImport}
              disabled={loading || !file}
              className="w-full sm:w-auto"
            >
              {loading ? "Importing..." : "Import Products"}
            </Button>
            {taskId && (
              <div className="pt-4 w-full sm:w-auto sm:pt-0 flex flex-col sm:items-end">
                <p className="text-sm text-muted-foreground">
                  Import Task ID: {taskId}
                </p>
                <Button
                  onClick={checkStatus}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  {loading ? "Checking..." : "Check Import Status"}
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
