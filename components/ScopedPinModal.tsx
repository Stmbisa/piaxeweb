"use client";

/**
 * ScopedPinModal - Modal for entering PIN for scoped operations
 *
 * Uses shadcn/ui Dialog component styling
 */

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  usePin,
  SCOPE_LABELS,
  SCOPE_DESCRIPTIONS,
} from "@/lib/auth/pin-context";

interface Props {
  visible?: boolean;
  onClose?: () => void;
}

export function ScopedPinModal({ visible: visibleProp, onClose: onCloseProp }: Props) {
  const {
    isPinModalVisible,
    pendingScope,
    pendingNonce,
    isVerifying,
    verifyScopedPin,
    closePinModal,
  } = usePin();

  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use props or context values
  const isVisible = visibleProp ?? isPinModalVisible;
  const handleClose = onCloseProp ?? closePinModal;

  // Reset state when modal opens
  useEffect(() => {
    if (isVisible) {
      setPin("");
      setError(null);
      // Focus input after render
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isVisible]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVisible) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, handleClose]);

  const handlePinChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPin(value);
    setError(null);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (pin.length < 4 || !pendingScope || !pendingNonce) {
      setError("Please enter your 4-6 digit PIN");
      return;
    }

    const success = await verifyScopedPin(pin, pendingScope, pendingNonce);
    if (!success) {
      setError("Invalid PIN. Please try again.");
      setPin("");
      inputRef.current?.focus();
    }
  }, [pin, pendingScope, pendingNonce, verifyScopedPin]);

  const handleCancel = useCallback(() => {
    setPin("");
    setError(null);
    handleClose();
  }, [handleClose]);

  if (!isVisible || !pendingScope) {
    return null;
  }

  const scopeLabel = SCOPE_LABELS[pendingScope] || "Action";
  const scopeDescription = SCOPE_DESCRIPTIONS[pendingScope] || "Enter your PIN to continue";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleCancel}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-3">
            <svg
              className="w-7 h-7 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            PIN Required
          </h2>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {scopeLabel}
          </p>
        </div>

        {/* Description */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-5">
          {scopeDescription}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* PIN Input */}
          <div className="mb-4">
            <input
              ref={inputRef}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={pin}
              onChange={handlePinChange}
              disabled={isVerifying}
              placeholder="Enter PIN"
              className="w-full px-4 py-3 text-center text-xl tracking-[0.5em] font-mono
                         border border-gray-200 dark:border-gray-700 rounded-xl
                         bg-gray-50 dark:bg-gray-800
                         text-gray-900 dark:text-white
                         placeholder:text-gray-400 placeholder:tracking-normal
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
              autoComplete="off"
            />

            {/* PIN dots indicator */}
            <div className="flex justify-center gap-2 mt-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${i < pin.length
                      ? "bg-blue-500"
                      : "bg-gray-200 dark:bg-gray-700"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-center text-sm text-red-500 mb-4">
              {error}
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isVerifying}
              className="flex-1 px-4 py-3 rounded-xl
                         bg-gray-100 dark:bg-gray-800
                         text-gray-700 dark:text-gray-300
                         font-medium text-sm
                         hover:bg-gray-200 dark:hover:bg-gray-700
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={pin.length < 4 || isVerifying}
              className="flex-1 px-4 py-3 rounded-xl
                         bg-blue-600 hover:bg-blue-700
                         text-white font-medium text-sm
                         disabled:bg-gray-300 dark:disabled:bg-gray-700
                         disabled:text-gray-500 disabled:cursor-not-allowed
                         transition-colors duration-200
                         flex items-center justify-center"
            >
              {isVerifying ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12" cy="12" r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ScopedPinModal;
