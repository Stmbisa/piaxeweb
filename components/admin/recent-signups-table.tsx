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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth/context";
import { API_ENDPOINTS } from "@/lib/config/env";
import {
  ChevronDown,
  Search,
  MoreHorizontal,
  Shield,
  ShieldOff,
  AlertTriangle,
} from "lucide-react";

interface RecentSignup {
  account_id: string;
  email: string;
  username: string;
  created_at?: string;
  date_joined?: string;
  account_type: string;
  is_active: boolean;
  is_admin?: boolean;
}

interface RecentSignupsTableProps {
  initialData?: RecentSignup[];
}

export function RecentSignupsTable({
  initialData = [],
}: RecentSignupsTableProps) {
  const { token, user } = useAuth();
  const { toast } = useToast();
  const [signups, setSignups] = useState<RecentSignup[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<RecentSignup | null>(null);
  const [adminAction, setAdminAction] = useState<"grant" | "revoke" | null>(
    null
  );
  const [confirmationText, setConfirmationText] = useState("");
  const [isRevokingSelf, setIsRevokingSelf] = useState(false);

  const fetchSignups = async () => {
    if (!token) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use proxy to avoid CORS issues
      let url = `/api/proxy/users/admin/recent-signups?limit=${limit}&offset=${
        (page - 1) * limit
      }`;

      // Add filters
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      if (accountTypeFilter !== "all") {
        url += `&account_type=${encodeURIComponent(accountTypeFilter)}`;
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
          `Failed to fetch recent signups: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();
      setSignups(data);

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
      console.error("Error fetching signups:", err);
      setError(
        `Failed to load signups data: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchSignups();
    }
  }, [token, page, limit, searchTerm, accountTypeFilter, sortOrder]);

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / limit);

  const handleAdminStatusChange = async () => {
    if (!token || !selectedUser || !adminAction) return;

    const isAdmin = adminAction === "grant";
    const isSelfRevocation = isRevokingSelf && !isAdmin;

    // Validate confirmation text
    const expectedText = selectedUser.username.toUpperCase();
    if (confirmationText.toUpperCase() !== expectedText) {
      toast({
        title: "Confirmation Failed",
        description: `Please type "${expectedText}" to confirm this action.`,
        variant: "destructive",
      });
      return;
    }

    try {
      let url = `/api/proxy/users/admin/users/${selectedUser.account_id}/admin-status`;

      // Add confirm_self_revocation query parameter if revoking own admin rights
      if (isSelfRevocation) {
        url += "?confirm_self_revocation=true";
      }

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ is_admin: isAdmin }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to update admin status: ${response.status} - ${errorText}`
        );
      }

      const data = await response.json();

      // Update local state
      setSignups((prev) =>
        prev.map((s) =>
          s.account_id === selectedUser.account_id
            ? { ...s, is_admin: isAdmin }
            : s
        )
      );

      toast({
        title: isAdmin ? "Admin Rights Granted" : "Admin Rights Revoked",
        description:
          data.message ||
          `User ${selectedUser.username} admin status has been ${
            isAdmin ? "granted" : "revoked"
          }.`,
      });

      // Reset dialog state
      setShowAdminDialog(false);
      setSelectedUser(null);
      setAdminAction(null);
      setConfirmationText("");
      setIsRevokingSelf(false);
    } catch (err) {
      console.error("Error updating admin status:", err);
      toast({
        title: "Action Failed",
        description: `Failed to ${adminAction} admin rights: ${
          err instanceof Error ? err.message : String(err)
        }. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const openAdminDialog = (
    targetUser: RecentSignup,
    action: "grant" | "revoke"
  ) => {
    setSelectedUser(targetUser);
    setAdminAction(action);
    // Check if revoking own admin rights
    setIsRevokingSelf(
      targetUser.account_id === user?.account_id &&
        action === "revoke" &&
        !!targetUser.is_admin
    );
    setConfirmationText("");
    setShowAdminDialog(true);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={accountTypeFilter} onValueChange={setAccountTypeFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Account Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="developer">Developer</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500 text-sm py-2">{error}</div>}

      {/* Users Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  Date
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform ${
                      sortOrder === "asc" ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : signups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              signups.map((user) => (
                <TableRow key={user.account_id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.account_type}</Badge>
                  </TableCell>
                  <TableCell>
                    {formatDate(user.date_joined || user.created_at || "")}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.is_active ? "default" : "destructive"}>
                      {user.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.is_admin ? (
                      <Badge className="bg-purple-500 hover:bg-purple-600 text-white border-purple-600">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    ) : (
                      <Badge variant="outline">User</Badge>
                    )}
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
                          onClick={() => openAdminDialog(user, "grant")}
                          disabled={user.is_admin}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Grant Admin Rights
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openAdminDialog(user, "revoke")}
                          disabled={!user.is_admin}
                        >
                          <ShieldOff className="h-4 w-4 mr-2" />
                          Revoke Admin Rights
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
          of {totalCount} users
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

      {/* Admin Status Change Dialog */}
      <AlertDialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <AlertDialogTitle>
                {adminAction === "grant"
                  ? "Grant Admin Rights"
                  : "Revoke Admin Rights"}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="space-y-2 pt-2">
              <p className="font-semibold text-destructive">
                ⚠️ WARNING: This is a sensitive administrative action!
              </p>
              <p>
                You are about to{" "}
                {adminAction === "grant"
                  ? "grant admin rights to"
                  : "revoke admin rights from"}{" "}
                <strong>{selectedUser?.username}</strong> ({selectedUser?.email}
                ).
              </p>
              {isRevokingSelf && (
                <p className="font-semibold text-destructive bg-destructive/10 p-2 rounded">
                  ⚠️ You are revoking your own admin rights! This action
                  requires additional confirmation.
                </p>
              )}
              <p className="pt-2">
                To confirm this action, please type{" "}
                <strong className="font-mono bg-muted px-2 py-1 rounded">
                  {selectedUser?.username.toUpperCase()}
                </strong>{" "}
                in the field below:
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="confirmation">
                Type "{selectedUser?.username.toUpperCase()}" to confirm:
              </Label>
              <Input
                id="confirmation"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder={selectedUser?.username.toUpperCase()}
                className="font-mono"
                autoFocus
              />
            </div>
            {isRevokingSelf && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Additional Warning:</strong> Revoking your own admin
                  rights will immediately remove your administrative privileges.
                  Make sure this is what you intend to do.
                </p>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setConfirmationText("");
                setSelectedUser(null);
                setAdminAction(null);
                setIsRevokingSelf(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAdminStatusChange}
              disabled={
                confirmationText.toUpperCase() !==
                selectedUser?.username.toUpperCase()
              }
              className="bg-destructive hover:bg-destructive/90"
            >
              {adminAction === "grant"
                ? "Grant Admin Rights"
                : "Revoke Admin Rights"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
