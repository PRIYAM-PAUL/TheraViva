"use client";

import { CreditCard } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui";
import { useAuth } from "@/features/dashboard/auth-context";
import { siteConfig } from "@/config";
import { ApiError, api } from "@/lib/api";
import { loadRazorpay, openCheckout } from "@/lib/razorpay";

export interface PayOnlineButtonProps {
  invoiceId: string;
  amountInr: number;
  /** Called after the backend verifies the signature and captures the payment. */
  onPaid?: () => void;
  size?: "sm" | "md";
  label?: string;
}

/**
 * Starts a Razorpay checkout for an invoice and verifies the result server-side.
 *
 * When the gateway is not configured (no key returned), it surfaces a clear
 * message rather than opening a broken modal.
 */
export function PayOnlineButton({
  invoiceId,
  amountInr,
  onPaid,
  size = "sm",
  label = "Pay online",
}: PayOnlineButtonProps) {
  const { user } = useAuth();
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const start = async () => {
    setBusy(true);
    setError(null);
    try {
      const order = await api.billing.startCheckout(invoiceId, amountInr);
      if (!order.orderId || !order.keyId) {
        throw new ApiError(
          400,
          null,
          "Online payments are not configured. Set the Razorpay keys on the server.",
        );
      }
      const ready = await loadRazorpay();
      if (!ready) throw new ApiError(0, null, "Could not load the payment gateway.");

      const opened = openCheckout({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: siteConfig.name,
        description: "Therapy session payment",
        prefill: {
          name: user?.name ?? undefined,
          email: user?.email ?? undefined,
          contact: user?.phone ?? undefined,
        },
        theme: { color: "#0f766e" },
        handler: (response) => {
          void (async () => {
            try {
              await api.billing.verifyCheckout({
                paymentId: order.paymentId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              onPaid?.();
            } catch (err) {
              setError(
                err instanceof ApiError ? err.message : "Payment could not be verified.",
              );
            }
          })();
        },
      });
      if (!opened) throw new ApiError(0, null, "Could not open the payment gateway.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not start the payment.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <span className="inline-flex flex-col items-end gap-1">
      <Button type="button" size={size} loading={busy} onClick={() => void start()}>
        <CreditCard className="size-4" aria-hidden="true" />
        {label}
      </Button>
      {error ? <span className="max-w-[16rem] text-right text-xs text-destructive">{error}</span> : null}
    </span>
  );
}
