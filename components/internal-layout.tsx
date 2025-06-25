"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";

export function InternalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showFooter =
    !pathname.startsWith("/business/dashboard") &&
    !pathname.startsWith("/auth");

  return (
    <>
      {children}
      {showFooter && <Footer />}
      <PWAInstallPrompt />
    </>
  );
}
