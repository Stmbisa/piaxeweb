import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { PaymentRequestsDashboard } from "@/components/payments/payment-requests-dashboard";

export const metadata: Metadata = generatePageMetadata({
  title: "Payment Requests",
  description: "Create printable payment requests (service/other or store basket) with QR + PDF.",
  path: "/payment-requests",
  keywords: ["payment request", "qr", "print", "pdf", "store basket"],
});

// Force dynamic rendering since the component uses client-side auth
export const dynamic = "force-dynamic";

export default function PaymentRequestsPage() {
  return <PaymentRequestsDashboard />;
}
