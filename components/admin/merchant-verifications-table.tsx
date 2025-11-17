import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth/context";
import { API_ENDPOINTS } from "@/lib/config/env";
import { ChevronDown, MoreHorizontal, Search } from "lucide-react";

interface MerchantVerification {
  merchant_profile_id: string;
  account_id: string;
  country: string;
  verification_status: "Unverified" | "Pending" | "Verified" | "Rejected";
  document_upload_status: string;
  verification_date: string;
  rejection_reason: string | null;
  document_images?: string[];
  selfie_image?: string;
  username?: string;
  email?: string;
}

interface MerchantVerificationsTableProps {
  initialData?: MerchantVerification[];
}

export function MerchantVerificationsTable({
  initialData = [],
}: MerchantVerificationsTableProps) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [verifications, setVerifications] =
    useState<MerchantVerification[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Pending");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [selectedVerification, setSelectedVerification] =
    useState<MerchantVerification | null>(null);
  const [verificationAction, setVerificationAction] = useState<
    "approve" | "reject" | null
  >(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const fetchVerifications = async () => {
    if (!token) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use proxy to avoid CORS issues
      let url = `/api/proxy/users/admin/verifications/merchants?limit=${limit}&offset=${
        (page - 1) * limit
      }`;

      // Add filters
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      if (statusFilter !== "all") {
        url += `&status=${encodeURIComponent(statusFilter)}`;
      }

      // Add sort order
      url += `&sort_order=${sortOrder}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch merchant verifications: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      setVerifications(data);

      // Extract total count from headers or response
      const totalCountHeader = response.headers.get("X-Total-Count");
      if (totalCountHeader) {
        setTotalCount(parseInt(totalCountHeader, 10));
      } else if (data.meta?.total) {
        setTotalCount(data.meta.total);
      } else {
        // Fallback to current data length if no count is provided
        setTotalCount(data.length);
      }
    } catch (err) {
      console.error("Error fetching merchant verifications:", err);
      setError(
        `Failed to load verification data: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationAction = async () => {
    if (!token || !selectedVerification || !verificationAction) return;

    try {
      const payload =
        verificationAction === "approve"
          ? { status: "Verified" }
          : { status: "Rejected", reason: rejectionReason };

      // Use proxy to avoid CORS issues
      const url = `/api/proxy/users/admin/verify/merchant/${selectedVerification.account_id}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to ${verificationAction} verification: ${response.status} - ${errorText}`
        );
      }

      toast({
        title:
          verificationAction === "approve"
            ? "Verification Approved"
            : "Verification Rejected",
        description:
          verificationAction === "approve"
            ? `Merchant ${selectedVerification.account_id} has been verified.`
            : `Merchant ${selectedVerification.account_id} verification has been rejected.`,
      });

      // Update the local state
      setVerifications((prev) =>
        prev.map((v) =>
          v.merchant_profile_id === selectedVerification.merchant_profile_id
            ? {
                ...v,
                verification_status:
                  verificationAction === "approve" ? "Verified" : "Rejected",
                rejection_reason:
                  verificationAction === "reject" ? rejectionReason : null,
              }
            : v
        )
      );

      // Reset states
      setVerificationAction(null);
      setRejectionReason("");
      setShowVerificationDialog(false);
    } catch (err) {
      console.error("Error handling verification action:", err);
      toast({
        title: "Action Failed",
        description: `Failed to ${verificationAction} the verification: ${
          err instanceof Error ? err.message : String(err)
        }. Please try again.`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (token) {
      fetchVerifications();
    }
  }, [token, page, limit, searchTerm, statusFilter, sortOrder]);

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / limit);

  // Get status badge variant with colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Verified":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white border-green-600">
            Verified
          </Badge>
        );
      case "Rejected":
        return (
          <Badge
            variant="destructive"
            className="bg-red-500 hover:bg-red-600 text-white border-red-600"
          >
            Rejected
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-amber-600">
            Pending
          </Badge>
        );
      case "Unverified":
        return (
          <Badge
            variant="outline"
            className="border-gray-400 text-gray-600 dark:text-gray-400"
          >
            Unverified
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="border-gray-400 text-gray-600 dark:text-gray-400"
          >
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search verifications..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Verified">Verified</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
            <SelectItem value="Unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500 text-sm py-2">{error}</div>}

      {/* Verifications Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Merchant ID</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  Submitted
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform ${
                      sortOrder === "asc" ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Document Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : verifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No verifications found
                </TableCell>
              </TableRow>
            ) : (
              verifications.map((verification) => (
                <TableRow key={verification.merchant_profile_id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {verification.account_id}
                      </div>
                      {verification.username && (
                        <div className="text-sm text-muted-foreground">
                          {verification.username}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{verification.country}</TableCell>
                  <TableCell>
                    {formatDate(verification.verification_date)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(verification.verification_status)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {verification.document_upload_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedVerification(verification);
                            setVerificationAction("approve");
                            setShowVerificationDialog(true);
                          }}
                          disabled={
                            verification.verification_status !== "Pending"
                          }
                        >
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedVerification(verification);
                            setVerificationAction("reject");
                            setShowVerificationDialog(true);
                          }}
                          disabled={
                            verification.verification_status !== "Pending"
                          }
                        >
                          Reject
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedVerification(verification);
                            if (
                              verification.document_images &&
                              verification.document_images.length > 0
                            ) {
                              setSelectedDocument(
                                verification.document_images[0]
                              );
                              setShowDocumentDialog(true);
                            }
                          }}
                        >
                          View Documents
                        </DropdownMenuItem>
                        {verification.selfie_image && (
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedVerification(verification);
                              if (verification.selfie_image) {
                                setSelectedDocument(verification.selfie_image);
                                setShowDocumentDialog(true);
                              }
                            }}
                          >
                            View Selfie
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {(page - 1) * limit + 1}-{Math.min(page * limit, totalCount)}{" "}
          of {totalCount} verifications
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Verification Action Dialog */}
      <Dialog
        open={showVerificationDialog}
        onOpenChange={setShowVerificationDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {verificationAction === "approve"
                ? "Approve Verification"
                : "Reject Verification"}
            </DialogTitle>
            <DialogDescription>
              {verificationAction === "approve"
                ? "Are you sure you want to approve this verification? This will mark the merchant as verified."
                : "Please provide a reason for rejecting this verification."}
            </DialogDescription>
          </DialogHeader>

          {verificationAction === "reject" && (
            <Textarea
              placeholder="Reason for rejection"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowVerificationDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerificationAction}
              disabled={
                verificationAction === "reject" && rejectionReason.trim() === ""
              }
            >
              {verificationAction === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Viewer Dialog */}
      <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Document Viewer</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center">
            {selectedDocument && (
              <img
                src={selectedDocument}
                alt="Verification Document"
                className="max-h-[400px] object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.jpg";
                }}
              />
            )}
          </div>
          {selectedVerification && selectedVerification.document_images && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {selectedVerification.document_images.map((img, index) => (
                <img
                  key={`doc-${index}`}
                  src={img}
                  alt={`Document ${index + 1}`}
                  className={`h-16 w-auto object-cover cursor-pointer border-2 ${
                    selectedDocument === img
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedDocument(img)}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.jpg";
                  }}
                />
              ))}
              {selectedVerification.selfie_image && (
                <img
                  key="selfie"
                  src={selectedVerification.selfie_image}
                  alt="Selfie"
                  className={`h-16 w-auto object-cover cursor-pointer border-2 ${
                    selectedDocument === selectedVerification.selfie_image
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                  onClick={() =>
                    selectedVerification.selfie_image &&
                    setSelectedDocument(selectedVerification.selfie_image)
                  }
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.jpg";
                  }}
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
