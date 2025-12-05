"use client";

/**
 * PIN Context for Web App
 *
 * Provides scoped PIN verification for sensitive operations.
 * Works with backend security/pin_policy.py
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

// ============= Types =============

export type PinScope =
  | "wallet_transfer"
  | "wallet_withdraw"
  | "escrow_release"
  | "order_pay"
  | "p2p_send"
  | "savings_withdraw"
  | "verified_identity";

export interface PinRequirement {
  action: string;
  scope: PinScope;
  ttl_hint_seconds: number;
  description: string;
}

export interface PinRequiredError {
  code: "PIN_REQUIRED";
  scope: PinScope;
  nonce: string;
  message: string;
}

interface PendingPinRequest {
  scope: PinScope;
  nonce: string;
  resolve: (verified: boolean) => void;
  reject: (error: Error) => void;
}

interface PinContextType {
  // State
  pinPolicy: PinRequirement[];
  isPinModalVisible: boolean;
  pendingScope: PinScope | null;
  pendingNonce: string | null;
  isVerifying: boolean;

  // Methods
  verifyScopedPin: (pin: string, scope: PinScope, nonce: string) => Promise<boolean>;
  requestPinForScope: (scope: PinScope, nonce: string) => Promise<boolean>;
  closePinModal: () => void;
  fetchPinPolicy: () => Promise<void>;
  handlePinRequiredError: (error: PinRequiredError) => Promise<boolean>;
}

// ============= Context =============

const PinContext = createContext<PinContextType | undefined>(undefined);

// ============= Scope Labels =============

export const SCOPE_LABELS: Record<PinScope, string> = {
  wallet_transfer: "Wallet Transfer",
  wallet_withdraw: "Withdrawal",
  escrow_release: "Release Escrow",
  order_pay: "Payment",
  p2p_send: "Send Money",
  savings_withdraw: "Savings Withdrawal",
  verified_identity: "Identity Verification",
};

export const SCOPE_DESCRIPTIONS: Record<PinScope, string> = {
  wallet_transfer: "Confirm your PIN to transfer funds from your wallet",
  wallet_withdraw: "Confirm your PIN to withdraw funds",
  escrow_release: "Confirm your PIN to release escrow funds",
  order_pay: "Confirm your PIN to complete this payment",
  p2p_send: "Confirm your PIN to send money",
  savings_withdraw: "Confirm your PIN to withdraw from savings",
  verified_identity: "Confirm your PIN to verify your identity for this action",
};

// ============= Provider =============

export function PinProvider({ children }: { children: React.ReactNode }) {
  const [pinPolicy, setPinPolicy] = useState<PinRequirement[]>([]);
  const [isPinModalVisible, setIsPinModalVisible] = useState(false);
  const [pendingScope, setPendingScope] = useState<PinScope | null>(null);
  const [pendingNonce, setPendingNonce] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const pendingRequestRef = useRef<PendingPinRequest | null>(null);

  /**
   * Fetch PIN policy from backend
   */
  const fetchPinPolicy = useCallback(async () => {
    try {
      const token = typeof window !== "undefined"
        ? localStorage.getItem("piaxis_auth_token")
        : null;

      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/security/pin-policy`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPinPolicy(data.requirements || []);
        console.log("[PinContext] Fetched PIN policy:", data.requirements?.length, "requirements");
      }
    } catch (error) {
      console.error("[PinContext] Failed to fetch PIN policy:", error);
    }
  }, []);

  /**
   * Verify PIN for a specific scope
   */
  const verifyScopedPin = useCallback(async (
    pin: string,
    scope: PinScope,
    nonce: string
  ): Promise<boolean> => {
    setIsVerifying(true);

    try {
      const token = typeof window !== "undefined"
        ? localStorage.getItem("piaxis_auth_token")
        : null;

      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/security/verify-pin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          api_pin: parseInt(pin, 10),
          scope,
          nonce,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "PIN verification failed");
      }

      console.log("[PinContext] Scoped PIN verified successfully");

      // Close modal and resolve pending request
      setIsPinModalVisible(false);
      setPendingScope(null);
      setPendingNonce(null);

      if (pendingRequestRef.current) {
        pendingRequestRef.current.resolve(true);
        pendingRequestRef.current = null;
      }

      return true;
    } catch (error) {
      console.error("[PinContext] Scoped PIN verification failed:", error);
      return false;
    } finally {
      setIsVerifying(false);
    }
  }, []);

  /**
   * Request PIN entry for a specific scope - shows modal
   */
  const requestPinForScope = useCallback((
    scope: PinScope,
    nonce: string
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      console.log(`[PinContext] Requesting PIN for scope=${scope}`);

      // Store the pending request
      pendingRequestRef.current = { scope, nonce, resolve, reject };

      // Show modal
      setPendingScope(scope);
      setPendingNonce(nonce);
      setIsPinModalVisible(true);
    });
  }, []);

  /**
   * Close PIN modal
   */
  const closePinModal = useCallback(() => {
    setIsPinModalVisible(false);
    setPendingScope(null);
    setPendingNonce(null);

    if (pendingRequestRef.current) {
      pendingRequestRef.current.reject(new Error("PIN entry cancelled"));
      pendingRequestRef.current = null;
    }
  }, []);

  /**
   * Handle PIN_REQUIRED error from API
   */
  const handlePinRequiredError = useCallback(async (
    error: PinRequiredError
  ): Promise<boolean> => {
    if (error.code !== "PIN_REQUIRED") {
      console.error("[PinContext] Not a PIN_REQUIRED error");
      return false;
    }

    console.log(`[PinContext] Handling PIN_REQUIRED: scope=${error.scope}`);

    try {
      return await requestPinForScope(error.scope, error.nonce);
    } catch (e) {
      console.log("[PinContext] PIN entry cancelled or failed");
      return false;
    }
  }, [requestPinForScope]);

  // Fetch policy on mount
  useEffect(() => {
    fetchPinPolicy();
  }, [fetchPinPolicy]);

  const value: PinContextType = {
    pinPolicy,
    isPinModalVisible,
    pendingScope,
    pendingNonce,
    isVerifying,
    verifyScopedPin,
    requestPinForScope,
    closePinModal,
    fetchPinPolicy,
    handlePinRequiredError,
  };

  return (
    <PinContext.Provider value={value}>
      {children}
    </PinContext.Provider>
  );
}

// ============= Hook =============

export function usePin() {
  const context = useContext(PinContext);
  if (context === undefined) {
    throw new Error("usePin must be used within a PinProvider");
  }
  return context;
}
