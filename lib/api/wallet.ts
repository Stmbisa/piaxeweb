import { SEND_DEVICE_HEADER_IN_BROWSER } from "../utils";

export interface Wallet {
  id: string;
  user_id: string;
  currency_code: string;
  currency_name: string;
  currency_symbol: string;
  balance: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  amount: string;
  currency: string;
  status: string;
  transaction_type: "withdrawal" | "deposit" | "transfer";
  date: string;
  description: string | null;
  content_type: string;
  object_id: string;
  payment_method: string;
  external_reference: string | null;
  user_info: {
    user_id: string;
    wallet_id: string;
    wallet_amount: string;
    original_amount: string;
    unregistered_user_id?: string | null;
    provider_transaction_id: string;
  };
  related_object: any | null;
}

export interface TransactionResponse {
  items: Transaction[];
  total: number;
  offset: number;
  limit: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

class WalletAPI {
  private getAuthHeaders(token: string) {
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };
  }

  async getUserWallets(token: string): Promise<Wallet[]> {
    try {
      const isBrowser = typeof window !== "undefined";
      let base = API_BASE_URL;
      if (isBrowser && !SEND_DEVICE_HEADER_IN_BROWSER) base = "/api/proxy";
      const headers = this.getAuthHeaders(token);
      const response = await fetch(`${base}/wallet/wallets/`, {
        headers,
        credentials: "include",
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch wallets: ${response.statusText}`);
      }

      const data = await response.json();
      // Sort wallets: UGX first, then other currencies
      return data.sort((a: Wallet, b: Wallet) => {
        if (a.currency_code === "UGX") return -1;
        if (b.currency_code === "UGX") return 1;
        return 0;
      });
    } catch (error) {
      console.error("Error fetching wallets:", error);
      throw error;
    }
  }

  async getTransactions(
    token: string,
    params?: {
      currency?: string;
      transaction_type?: string;
      start_date?: string;
      end_date?: string;
      status?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<TransactionResponse> {
    try {
      const isBrowser = typeof window !== "undefined";
      let base = API_BASE_URL;
      if (isBrowser && !SEND_DEVICE_HEADER_IN_BROWSER) base = "/api/proxy";
      const headers = this.getAuthHeaders(token);
      const searchParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const url = `${base}/wallet/transactions${
        searchParams.toString() ? "?" + searchParams.toString() : ""
      }`;
      const response = await fetch(url, { headers, credentials: "include", mode: "cors" });

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }

  async getBalance(
    token: string,
    currency?: string
  ): Promise<{ balance: string; currency: string }> {
    try {
      // Get balance from wallets instead of separate endpoint
      const wallets = await this.getUserWallets(token);

      if (currency) {
        const wallet = wallets.find((w) => w.currency_code === currency);
        if (wallet) {
          return {
            balance: wallet.balance,
            currency: wallet.currency_code,
          };
        }
        // If specific currency wallet not found, return zero balance
        return {
          balance: "0.00",
          currency: currency,
        };
      }

      // If no currency specified, return UGX wallet or first wallet
      const ugxWallet = wallets.find((w) => w.currency_code === "UGX");
      if (ugxWallet) {
        return {
          balance: ugxWallet.balance,
          currency: ugxWallet.currency_code,
        };
      }

      // Return first wallet if no UGX wallet
      if (wallets.length > 0) {
        return {
          balance: wallets[0].balance,
          currency: wallets[0].currency_code,
        };
      }

      // No wallets found
      return {
        balance: "0.00",
        currency: currency || "UGX",
      };
    } catch (error) {
      console.error("Error fetching balance:", error);
      throw error;
    }
  }
}

export const walletAPI = new WalletAPI();
