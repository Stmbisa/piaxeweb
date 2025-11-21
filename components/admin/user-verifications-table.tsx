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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth/context";
import { getSignedImageUrls } from "@/lib/api/imagekit-service";
import { API_ENDPOINTS } from "@/lib/config/env";
import {
  ChevronDown,
  MoreHorizontal,
  Search,
  Loader2,
  ImageOff,
} from "lucide-react";

interface UserVerification {
  user_profile_id: string;
  account_id: string;
  first_name?: string | null;
  last_name?: string | null;
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

interface UserVerificationDocuments {
  user_profile_id: string;
  account_id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  id_or_passport_document: string | null;
  self_photo: string | null;
  video_document: string | null;
  additional_documents: string[] | null;
  verification_status: string;
  document_upload_status: string;
  verification_date: string;
  rejection_reason: string | null;
}

interface UserVerificationsTableProps {
  initialData?: UserVerification[];
}

export function UserVerificationsTable({
  initialData = [],
}: UserVerificationsTableProps) {
  const { token } = useAuth();
  const { toast } = useToast();
  const [verifications, setVerifications] =
    useState<UserVerification[]>(initialData);
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
    useState<UserVerification | null>(null);
  const [verificationAction, setVerificationAction] = useState<
    "approve" | "reject" | null
  >(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [selectedDocumentLabel, setSelectedDocumentLabel] = useState<
    string | null
  >(null);
  const [documentDetails, setDocumentDetails] =
    useState<UserVerificationDocuments | null>(null);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [documentsCache, setDocumentsCache] = useState<
    Record<string, UserVerificationDocuments>
  >({});

  const fetchVerifications = async () => {
    if (!token) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use proxy to avoid CORS issues
      let url = `/api/proxy/users/admin/verifications/users?limit=${limit}&offset=${
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
          `Failed to fetch user verifications: ${response.status} - ${errorText}`
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
      console.error("Error fetching verifications:", err);
      setError(
        `Failed to load verification data: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const signVerificationDocuments = async (
    docs: UserVerificationDocuments
  ): Promise<UserVerificationDocuments> => {
    const urlsToSign: string[] = [
      docs.id_or_passport_document,
      docs.self_photo,
      docs.video_document,
      ...(docs.additional_documents || []),
    ].filter(
      (url): url is string => typeof url === "string" && url.trim().length > 0
    );

    if (urlsToSign.length === 0) {
      return docs;
    }

    const signedMap = await getSignedImageUrls(urlsToSign);

    const mapUrl = (url?: string | null) => {
      if (!url) return url ?? null;
      return signedMap[url] || url;
    };

    const signedAdditional = docs.additional_documents
      ? docs.additional_documents
          .map((doc) => mapUrl(doc))
          .filter((value): value is string => !!value && value.length > 0)
      : null;

    return {
      ...docs,
      id_or_passport_document: mapUrl(docs.id_or_passport_document),
      self_photo: mapUrl(docs.self_photo),
      video_document: mapUrl(docs.video_document),
      additional_documents: signedAdditional,
    };
  };

  const determineInitialDocument = (
    docs: UserVerificationDocuments,
    preference?: "id" | "selfie"
  ) => {
    const candidates: { label: string; src: string | null }[] = [
      { label: "ID / Passport", src: docs.id_or_passport_document },
      { label: "Self Photo", src: docs.self_photo },
    ];

    if (docs.additional_documents && docs.additional_documents.length > 0) {
      docs.additional_documents.forEach((doc, index) => {
        candidates.push({
          label: `Additional Document ${index + 1}`,
          src: doc,
        });
      });
    }

    if (preference === "selfie") {
      const selfie = candidates.find((c) => c.label === "Self Photo" && c.src);
      if (selfie) {
        return selfie;
      }
    }

    const preferred =
      preference === "id"
        ? candidates.find((c) => c.label === "ID / Passport" && c.src)
        : null;
    if (preferred) {
      return preferred;
    }

    return candidates.find((c) => c.src) || { label: "", src: null };
  };

  const fetchVerificationDocuments = async (
    user_profile_id: string,
    preference?: "id" | "selfie"
  ) => {
    if (!token) return;

    const cachedDocuments = documentsCache[user_profile_id];
    if (cachedDocuments) {
      setDocumentsError(null);
      setDocumentDetails(cachedDocuments);
      const cachedInitial = determineInitialDocument(
        cachedDocuments,
        preference
      );
      setSelectedDocument(cachedInitial.src);
      setSelectedDocumentLabel(cachedInitial.label || null);
      setDocumentsLoading(false);
      return;
    }

    setDocumentsLoading(true);
    setDocumentsError(null);
    setDocumentDetails(null);

    try {
      const response = await fetch(
        `/api/proxy/users/admin/verifications/users/${user_profile_id}/documents`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch verification documents: ${response.status} - ${errorText}`
        );
      }

      const data: UserVerificationDocuments = await response.json();
      const signedData = await signVerificationDocuments(data);
      setDocumentDetails(signedData);
      setDocumentsCache((prev) => ({
        ...prev,
        [user_profile_id]: signedData,
      }));

      const initialDocument = determineInitialDocument(signedData, preference);
      setSelectedDocument(initialDocument.src);
      setSelectedDocumentLabel(initialDocument.label || null);
    } catch (err) {
      console.error("Error fetching verification documents:", err);
      setDocumentsError(
        `Failed to load documents: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setDocumentsLoading(false);
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
      const url = `/api/proxy/users/admin/verify/user/${selectedVerification.account_id}`;

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
            ? `User ${selectedVerification.account_id} has been verified.`
            : `User ${selectedVerification.account_id} verification has been rejected.`,
      });

      // Update the local state
      setVerifications((prev) =>
        prev.map((v) =>
          v.user_profile_id === selectedVerification.user_profile_id
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

  const openDocumentsDialog = (
    verification: UserVerification,
    preference?: "id" | "selfie"
  ) => {
    setSelectedVerification(verification);
    setShowDocumentDialog(true);
    fetchVerificationDocuments(verification.user_profile_id, preference);
  };

  const handleDocumentDialogChange = (open: boolean) => {
    setShowDocumentDialog(open);
    if (!open) {
      setDocumentDetails(null);
      setDocumentsError(null);
      setDocumentsLoading(false);
      setSelectedDocument(null);
      setSelectedDocumentLabel(null);
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
    <div className="space-y-4 animate-glass-appear">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground z-10" />
          <Input
            placeholder="Search verifications..."
            className="pl-8 glass-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px] glass-input">
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
      {error && (
        <div className="glass-card p-4 border-l-4 border-l-destructive animate-glass-appear">
          <p className="text-destructive text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Verifications Table */}
      <div className="rounded-md glass-card-enhanced overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : verifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No verifications found
                </TableCell>
              </TableRow>
            ) : (
              verifications.map((verification) => (
                <TableRow key={verification.user_profile_id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-semibold">
                        {verification.first_name || verification.last_name
                          ? `${verification.first_name ?? ""} ${
                              verification.last_name ?? ""
                            }`.trim()
                          : verification.username || "Unknown User"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {verification.username
                          ? `@${verification.username}`
                          : "Username unavailable"}
                      </div>
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
                          onClick={() =>
                            openDocumentsDialog(verification, "id")
                          }
                        >
                          View Documents
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            openDocumentsDialog(verification, "selfie")
                          }
                        >
                          View Selfie
                        </DropdownMenuItem>
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
            className="glass-button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="glass-button"
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
        <DialogContent className="glass-card-enhanced">
          <DialogHeader>
            <DialogTitle>
              {verificationAction === "approve"
                ? "Approve Verification"
                : "Reject Verification"}
            </DialogTitle>
            <DialogDescription>
              {verificationAction === "approve"
                ? "Are you sure you want to approve this verification? This will mark the user as verified."
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
      <Dialog
        open={showDocumentDialog}
        onOpenChange={handleDocumentDialogChange}
      >
        <DialogContent className="sm:max-w-[700px] glass-card-enhanced">
          <DialogHeader>
            <DialogTitle>Verification Documents</DialogTitle>
            <DialogDescription>
              Review the submitted identity artifacts for{" "}
              {documentDetails?.first_name || documentDetails?.last_name
                ? `${documentDetails?.first_name ?? ""} ${
                    documentDetails?.last_name ?? ""
                  }`.trim()
                : selectedVerification?.username || "this user"}
            </DialogDescription>
          </DialogHeader>

          {documentsLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                Fetching documents...
              </p>
            </div>
          ) : documentsError ? (
            <Alert variant="destructive">
              <AlertTitle>Unable to load documents</AlertTitle>
              <AlertDescription>{documentsError}</AlertDescription>
            </Alert>
          ) : documentDetails ? (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Submission Date
                  </p>
                  <p className="text-sm">
                    {formatDate(documentDetails.verification_date)}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  Status:{" "}
                  <span className="font-semibold">
                    {documentDetails.verification_status}
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                {selectedDocument ? (
                  <img
                    src={selectedDocument}
                    alt={selectedDocumentLabel ?? "Verification document"}
                    className="max-h-[420px] object-contain rounded-md border bg-muted"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 w-full border rounded-md bg-muted/50 text-center text-muted-foreground">
                    <ImageOff className="h-10 w-10 mb-2" />
                    <p>No preview available</p>
                  </div>
                )}
              </div>
              {documentDetails.video_document && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Video Verification</p>
                  <video
                    controls
                    className="w-full rounded-md border bg-black"
                    src={documentDetails.video_document}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Available Assets
                </p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {[
                    {
                      label: "ID / Passport",
                      src: documentDetails.id_or_passport_document,
                    },
                    { label: "Self Photo", src: documentDetails.self_photo },
                    ...(documentDetails.additional_documents?.map(
                      (doc, index) => ({
                        label: `Additional Document ${index + 1}`,
                        src: doc,
                      })
                    ) || []),
                  ]
                    .filter((doc) => doc.src)
                    .map((doc, index) => (
                      <button
                        type="button"
                        key={`${doc.label}-${index}`}
                        className={`h-20 w-32 flex-shrink-0 rounded-md border-2 ${
                          selectedDocument === doc.src
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                        onClick={() => {
                          setSelectedDocument(doc.src || null);
                          setSelectedDocumentLabel(doc.label);
                        }}
                      >
                        <img
                          src={doc.src || ""}
                          alt={doc.label}
                          className="h-full w-full object-cover rounded-md"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.jpg";
                          }}
                        />
                      </button>
                    ))}
                  {!documentDetails.id_or_passport_document &&
                    !documentDetails.self_photo &&
                    !documentDetails.additional_documents?.length && (
                      <div className="flex items-center justify-center h-20 w-full text-sm text-muted-foreground">
                        No documents available.
                      </div>
                    )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <ImageOff className="h-10 w-10 mb-2" />
              <p>No document data available.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
