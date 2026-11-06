"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, CreditCard, Shield, AlertCircle } from "lucide-react";
import { NavButtons } from "@/components/NavButtons";
import { InsurerLogo } from "@/components/InsurerLogo";
import { RazorpayCheckout } from "./RazorpayCheckout";
import type { InsurerRef } from "@/lib/insurers";

function inr(n: number) {
  return "\u20B9" + n.toLocaleString("en-IN");
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error?: { description?: string };
}

interface RazorpayInstance {
  open: () => void;
  on?: (event: string, handler: (response: RazorpayFailureResponse) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement("script");
    s.src = src;
    s.id = "razorpay-checkout-js";
    s.onload = () => {
      const poll = setInterval(() => {
        if (window.Razorpay) { clearInterval(poll); resolve(true); }
      }, 200);
      setTimeout(() => { clearInterval(poll); resolve(false); }, 8000);
    };
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export function PaymentPanel({
  leadId,
  insurer,
  plan,
  premium,
  alreadyPaid,
  insurerRef,
  color,
}: {
  leadId: string;
  insurer: string;
  plan: string;
  premium: number;
  alreadyPaid: boolean;
  insurerRef?: InsurerRef;
  color: string;
}) {
  const [paid, setPaid] = useState(alreadyPaid);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mockOpen, setMockOpen] = useState(false);
  const [mockOrderId, setMockOrderId] = useState<string | null>(null);
  const [mockAmount, setMockAmount] = useState<number | null>(null);
  const [mockMode, setMockMode] = useState(
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith("rzp_test_") ?? false
  );

  async function pay() {
    setPaying(true);
    setError(null);

    try {
      // 1. Create order
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order.error || "Order creation failed");

      if (order.mock || mockMode) {
        if (!order.mock && !order.keyId) {
          throw new Error("Razorpay key missing. Set NEXT_PUBLIC_RAZORPAY_KEY_ID in .env");
        }
        setMockMode(true);
        setMockOrderId(order.orderId);
        setMockAmount(order.amount / 100);
        setMockOpen(true);
        setPaying(false);
        return;
      }

      if (!order.keyId) throw new Error("Razorpay key missing. Set NEXT_PUBLIC_RAZORPAY_KEY_ID in .env");

      // 2. Load SDK
      const loaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!loaded || !window.Razorpay) {
        throw new Error("Razorpay checkout SDK failed to load. Check network.");
      }

      // 3. Open real Razorpay checkout
      const rz = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "NICE – Network of Insurance & Claims Expert",
        description: `${insurer} \u2014 ${plan}`,
        theme: { color: "#009FAF" },
        handler: async (response: RazorpayResponse) => {
          try {
            const res = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ leadId, ...response, mock: false }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Verification failed");
            setPaid(true);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Verification failed");
          }
          setPaying(false);
        },
        modal: {
          ondismiss: () => { setPaying(false); },
        },
        prefill: {},
        notes: { leadId },
      });

      rz.on?.("payment.failed", (resp) => {
        setError(resp?.error?.description || "Payment failed");
        setPaying(false);
      });

      rz.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment failed");
      setPaying(false);
    }
  }

  return (
    <div>
      <div className="bg-white border border-[#D3E6EA] rounded-lg p-6 max-w-lg mb-6">
        <div className="flex items-center gap-3 mb-4">
          <InsurerLogo name={insurer} color={color} insurerRef={insurerRef} size={56} />
          <div>
            <div className="text-[10px] uppercase tracking-wide text-[#7A979D]">{insurer}</div>
            <div className="font-semibold text-[#0F2A2E] text-[13px]">{plan}</div>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-5">
          <div style={{ fontFamily: "var(--font-mono-brand)" }} className="text-3xl text-[#0F2A2E]">
            {inr(premium)}
          </div>
          <span className="text-sm text-[#7A979D]">/year</span>
        </div>

        {error && (
          <div className="text-sm text-[#B3423E] bg-[#FBEAEA] rounded-md px-4 py-3 mb-4 flex items-start gap-2">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {!paid ? (
          <div className="space-y-3">
            <button
              onClick={pay}
              disabled={paying}
              className="w-full flex items-center justify-center gap-2 bg-[#015A6E] text-white text-sm font-semibold py-3 rounded-md hover:bg-[#014552] disabled:opacity-60 transition-colors"
            >
              {paying ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />}
              {paying ? "Opening Razorpay..." : `Pay ${inr(premium)}`}
            </button>

            {mockMode && (
              <div className="rounded-lg border border-[#D6E4FF] bg-[#F0F6FF] px-4 py-3 text-[12px] text-[#2053D1]">
                Demo payment mode — no Razorpay keys required. Use the built-in mock checkout to simulate a payment.
              </div>
            )}
            <div className="flex items-center gap-2 text-[11px] text-[#7A979D] justify-center">
              <Shield size={12} />
              <span>Powered by Razorpay &middot; UPI / Card / Netbanking</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[#009FAF] text-sm font-medium py-3">
            <CheckCircle2 size={18} /> Payment received successfully
          </div>
        )}
      </div>

      {mockOpen && mockOrderId && mockAmount !== null && (
        <RazorpayCheckout
          open={mockOpen}
          onClose={() => setMockOpen(false)}
          onSuccess={() => setPaid(true)}
          leadId={leadId}
          orderId={mockOrderId}
          amount={mockAmount}
          plan={plan}
        />
      )}

      <NavButtons
        backHref={`/leads/${leadId}/kyc`}
        nextHref={`/leads/${leadId}/status`}
        nextLabel="Submit to insurer"
        nextDisabled={!paid}
      />
    </div>
  );
}
