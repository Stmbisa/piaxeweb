"use client"

import { useQuery } from "@tanstack/react-query"
import { walletAPI, type Wallet, type Transaction, type TransactionResponse } from "@/lib/api/wallet"
import { useAuth } from "@/lib/auth/context"

export function useWallets() {
  const { user, token } = useAuth()

  const {
    data: wallets,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["wallets", user?.id],
    queryFn: () => walletAPI.getUserWallets(token!),
    enabled: !!user && !!token,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error.message.includes('401') || error.message.includes('403')) {
        return false
      }
      return failureCount < 3
    },
  })

  // Calculate total balance across all wallets (converted to UGX equivalent)
  const totalBalance = wallets?.reduce((total, wallet) => {
    const balance = parseFloat(wallet.balance) || 0
    // For now, just sum UGX wallets. In future, add currency conversion
    if (wallet.currency_code === "UGX") {
      return total + balance
    }
    return total
  }, 0) || 0

  return {
    wallets: wallets || [],
    totalBalance: totalBalance.toFixed(2),
    isLoading,
    error,
    refetch,
  }
}

export function useTransactions(params?: {
  currency?: string
  transaction_type?: string
  limit?: number
  offset?: number
}) {
  const { user, token } = useAuth()

  const {
    data: transactions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["transactions", user?.id, params],
    queryFn: () => walletAPI.getTransactions(token!, params),
    enabled: !!user && !!token,
    staleTime: 30000,
    refetchInterval: 60000,
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error.message.includes('401') || error.message.includes('403')) {
        return false
      }
      return failureCount < 3
    },
  })

  return {
    transactions: transactions?.items || [],
    total: transactions?.total || 0,
    isLoading,
    error,
    refetch,
  }
}

export function useBalance(currency?: string) {
  const { user, token } = useAuth()

  const {
    data: balance,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["balance", user?.id, currency],
    queryFn: () => walletAPI.getBalance(token!, currency),
    enabled: !!user && !!token,
    staleTime: 30000,
    refetchInterval: 60000,
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error.message.includes('401') || error.message.includes('403')) {
        return false
      }
      return failureCount < 3
    },
  })

  return {
    balance: balance?.balance || "0.00",
    currency: balance?.currency || currency || "UGX",
    isLoading,
    error,
    refetch,
  }
}

// Helper hook to get specific wallet by currency
export function useWalletByCurrency(currency: string) {
  const { wallets, isLoading, error, refetch } = useWallets()

  const wallet = wallets.find(w => w.currency_code === currency)

  return {
    wallet,
    balance: wallet?.balance || "0.00",
    isLoading,
    error,
    refetch,
  }
}
