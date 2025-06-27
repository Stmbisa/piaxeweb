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
    <Card>
      <CardHeader>
        <CardTitle>Import Products from File</CardTitle>
        <CardDescription>
          Upload a CSV or Excel file to import products.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file-upload">Product File</Label>
          <Input id="file-upload" type="file" onChange={handleFileChange} />
        </div>
        <Button onClick={handleImport} disabled={loading || !file}>
          {loading ? "Importing..." : "Import Products"}
        </Button>
        {taskId && (
          <div className="pt-4">
            <p>Import started with Task ID: {taskId}</p>
            <Button onClick={checkStatus} disabled={loading}>
              {loading ? "Checking..." : "Check Status"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
