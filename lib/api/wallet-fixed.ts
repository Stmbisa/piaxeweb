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
      "Content-Type": "application/json",
    };
  }

  async getUserWallets(token: string): Promise<Wallet[]> {
    try {
      const headers = this.getAuthHeaders(token);
      const response = await fetch(`${API_BASE_URL}/wallet/wallets/`, {
        headers,
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
      const headers = this.getAuthHeaders(token);
      const searchParams = new URLSearchParams();

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString());
          }
        });
      }

      const url = `${API_BASE_URL}/wallet/transactions${
        searchParams.toString() ? "?" + searchParams.toString() : ""
      }`;
      const response = await fetch(url, { headers });

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
      const headers = this.getAuthHeaders(token);
      const url = currency
        ? `${API_BASE_URL}/wallet/balance?currency=${currency}`
        : `${API_BASE_URL}/wallet/balance`;

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`Failed to fetch balance: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching balance:", error);
      throw error;
    }
  }
}

export const walletAPI = new WalletAPI();
