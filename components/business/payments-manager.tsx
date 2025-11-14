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
  type Order,
  type Store,
} from "@/lib/api/shopping-inventory";
import {
  Search,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  FileText,
  Download,
  Eye,
  RefreshCw,
  Smartphone,
  Building,
  Wallet,
} from "lucide-react";

const PAYMENT_STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  paid: "bg-green-100 text-green-700 border-green-200",
  failed: "bg-red-100 text-red-700 border-red-200",
  refunded: "bg-gray-100 text-gray-700 border-gray-200",
};

const PAYMENT_METHOD_ICONS = {
  mobile_money: Smartphone,
  bank_transfer: Building,
  cash: Wallet,
  card: CreditCard,
};

interface PaymentTransaction {
  id: string;
  order_id: string;
  customer_name: string;
  amount: number;
  currency: string;
  payment_method: keyof typeof PAYMENT_METHOD_ICONS;
  status: keyof typeof PAYMENT_STATUS_COLORS;
  transaction_fee: number;
  net_amount: number;
  reference: string;
  created_at: string;
}

export function PaymentsManager() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [methodFilter, setMethodFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("30");
  const [loading, setLoading] = useState(true);

  const { token } = useAuth();
  const { toast } = useToast();

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

      // Load orders for the first store if available
      if (storesData.length > 0) {
        const firstStoreId = storesData[0].id;
        setSelectedStore(firstStoreId);
        await loadPayments(firstStoreId);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Error",
        description: "Failed to load payments data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPayments = async (storeId: string) => {
    if (!token) return;

    try {
      setLoading(true);
      const ordersResponse = await shoppingInventoryAPI.getOrders(
        token,
        storeId
      );
      setOrders(ordersResponse.orders);

      // Transform orders into payment transactions
      const paymentTransactions: PaymentTransaction[] = ordersResponse.orders
        .filter((order) => order.payment_status !== "pending")
        .map((order) => ({
          id: `txn_${order.id.slice(0, 8)}`,
          order_id: order.id,
          customer_name: order.customer_name,
          amount: order.total_amount,
          currency: order.currency,
          payment_method:
            (order.payment_method as keyof typeof PAYMENT_METHOD_ICONS) ||
            "mobile_money",
          status: order.payment_status,
          transaction_fee: Math.round(order.total_amount * 0.02), // 2% fee simulation
          net_amount: Math.round(order.total_amount * 0.98),
          reference: `REF_${order.id.slice(0, 6).toUpperCase()}`,
          created_at: order.created_at,
        }));

      setTransactions(paymentTransactions);
    } catch (error) {
      console.error("Error loading payments:", error);
      toast({
        title: "Error",
        description: "Failed to load payments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStoreChange = async (storeId: string) => {
    setSelectedStore(storeId);
    await loadPayments(storeId);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.customer_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.order_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      !statusFilter ||
      transaction.status === statusFilter;
    const matchesMethod =
      methodFilter === "all" ||
      !methodFilter ||
      transaction.payment_method === methodFilter;

    // Date filtering
    const transactionDate = new Date(transaction.created_at);
    const now = new Date();
    const daysAgo = parseInt(dateRange);
    const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const matchesDate = transactionDate >= cutoffDate;

    return matchesSearch && matchesStatus && matchesMethod && matchesDate;
  });

  const getPaymentStats = () => {
    const totalTransactions = filteredTransactions.length;
    const totalRevenue = filteredTransactions
      .filter((t) => t.status === "paid")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalFees = filteredTransactions
      .filter((t) => t.status === "paid")
      .reduce((sum, t) => sum + t.transaction_fee, 0);
    const netRevenue = filteredTransactions
      .filter((t) => t.status === "paid")
      .reduce((sum, t) => sum + t.net_amount, 0);
    const successRate =
      totalTransactions > 0
        ? (filteredTransactions.filter((t) => t.status === "paid").length /
            totalTransactions) *
          100
        : 0;

    return {
      totalTransactions,
      totalRevenue,
      totalFees,
      netRevenue,
      successRate,
    };
  };

  const stats = getPaymentStats();

  if (loading && stores.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payments Management</h1>
          <p className="text-muted-foreground">
            Track and manage your payment transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            onClick={() => loadPayments(selectedStore)}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Store Selection */}
      {stores.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <label htmlFor="store-select" className="font-medium">
                Select Store:
              </label>
              <Select value={selectedStore} onValueChange={handleStoreChange}>
                <SelectTrigger className="w-64">
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

      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Transactions
                </p>
                <p className="text-2xl font-bold">{stats.totalTransactions}</p>
              </div>
              <CreditCard className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-green-600">
                  UGX {stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Transaction Fees
                </p>
                <p className="text-2xl font-bold text-red-600">
                  UGX {stats.totalFees.toLocaleString()}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Net Revenue
                </p>
                <p className="text-2xl font-bold text-emerald-600">
                  UGX {stats.netRevenue.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Success Rate
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.successRate.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by customer name, reference, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="mobile_money">Mobile Money</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transactions found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No transactions found
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter || methodFilter
                  ? "Try adjusting your search criteria"
                  : "Payment transactions will appear here once customers make payments"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => {
                const PaymentIcon =
                  PAYMENT_METHOD_ICONS[transaction.payment_method];
                return (
                  <div
                    key={transaction.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <PaymentIcon className="w-6 h-6 text-primary" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">
                              #{transaction.reference}
                            </p>
                            <Badge
                              className={
                                PAYMENT_STATUS_COLORS[transaction.status]
                              }
                            >
                              {transaction.status.charAt(0).toUpperCase() +
                                transaction.status.slice(1)}
                            </Badge>
                            <Badge variant="outline">
                              {transaction.payment_method
                                .replace("_", " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {transaction.customer_name}
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              Order #{transaction.order_id.slice(0, 8)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(
                                transaction.created_at
                              ).toLocaleDateString()}
                            </div>
                          </div>

                          {transaction.status === "paid" && (
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>
                                Fee: UGX{" "}
                                {transaction.transaction_fee.toLocaleString()}
                              </span>
                              <span>
                                Net: UGX{" "}
                                {transaction.net_amount.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p
                            className={`font-semibold text-lg ${
                              transaction.status === "paid"
                                ? "text-green-600"
                                : transaction.status === "failed"
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            UGX {transaction.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.currency}
                          </p>
                        </div>

                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
