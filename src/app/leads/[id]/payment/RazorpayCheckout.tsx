"use client";

import { useState } from "react";
import { X, Smartphone, CreditCard, Shield, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

function inr(n: number) {
  return "\u20B9" + n.toLocaleString("en-IN");
}

interface RazorpayCheckoutProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  leadId: string;
  orderId: string;
  amount: number;
  plan: string;
}

export function RazorpayCheckout({
  open,
  onClose,
  onSuccess,
  leadId,
  orderId,
  amount,
  plan,
}: RazorpayCheckoutProps) {
  const [method, setMethod] = useState<"upi" | "card">("upi");
  const [upiId, setUpiId] = useState("success@upi");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txnId, setTxnId] = useState<string | null>(null);

  if (!open) return null;

  async function pay() {
    if (!upiId || !upiId.includes("@")) {
      setError("Enter a valid UPI ID (e.g. user@upi)");
      return;
    }
    setProcessing(true);
    setError(null);

    try {
      // Simulate Razorpay processing delay
      await new Promise((r) => setTimeout(r, 2000));

      const paymentId = `pay_${Date.now()}`;
      const verifyRes = await fetch("/api/razorpay/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: "",
          mock: true,
        }),
      });
      const data = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(data.error || "Verification failed");

      setTxnId(paymentId);
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment failed");
      setProcessing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — Razorpay style blue */}
        <div className="bg-[#015A6E] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#2D89EF] flex items-center justify-center text-white text-[11px] font-bold">
              Rzp
            </div>
            <div>
              <div className="text-white text-[13px] font-semibold">Razorpay</div>
              <div className="text-white/60 text-[10px]">Test Mode</div>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Amount bar */}
        <div className="bg-[#F8F9FB] border-b border-[#E8ECF0] px-5 py-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#8A94A6] uppercase tracking-wide">Amount</div>
            <div className="text-xl font-bold text-[#015A6E]">{inr(amount)}</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-[#8A94A6] uppercase tracking-wide">Plan</div>
            <div className="text-[13px] font-medium text-[#015A6E] truncate max-w-[180px]">{plan}</div>
          </div>
        </div>

        {success ? (
          <div className="px-5 py-10 text-center">
            <div className="w-14 h-14 rounded-full bg-[#E6F4F6] flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={28} className="text-[#009FAF]" />
            </div>
            <div className="text-[15px] font-semibold text-[#015A6E]">Payment Successful</div>
            <div className="text-[12px] text-[#8A94A6] mt-1">Transaction ID: {txnId}</div>
          </div>
        ) : (
          <div className="px-5 py-5">
            {/* Payment method tabs */}
            <div className="flex gap-2 mb-5">
              <button
                onClick={() => setMethod("upi")}
                className={
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 text-[13px] font-medium transition-colors " +
                  (method === "upi"
                    ? "border-[#2D89EF] bg-[#F0F6FF] text-[#015A6E]"
                    : "border-[#E8ECF0] text-[#8A94A6] hover:border-[#C8D0DC]")
                }
              >
                <Smartphone size={16} /> UPI
              </button>
              <button
                onClick={() => setMethod("card")}
                className={
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 text-[13px] font-medium transition-colors " +
                  (method === "card"
                    ? "border-[#2D89EF] bg-[#F0F6FF] text-[#015A6E]"
                    : "border-[#E8ECF0] text-[#8A94A6] hover:border-[#C8D0DC]")
                }
              >
                <CreditCard size={16} /> Card
              </button>
            </div>

            {method === "upi" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] font-medium text-[#4A5568] mb-1.5">
                    UPI ID
                  </label>
                  <input
                    value={upiId}
                    onChange={(e) => { setUpiId(e.target.value); setError(null); }}
                    placeholder="yourname@upi"
                    className="w-full border border-[#E8ECF0] rounded-lg px-3 py-2.5 text-[13px] focus:outline-none focus:border-[#2D89EF] focus:ring-1 focus:ring-[#2D89EF]/20"
                    disabled={processing}
                  />
                  <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#8A94A6]">
                    <Shield size={11} /> Enter any valid UPI ID to complete demo payment
                  </div>
                </div>

                <div className="bg-[#F8F9FB] rounded-lg px-3 py-2.5 text-[11px] text-[#4A5568]">
                  <span className="font-medium">Test UPI IDs:</span>{" "}
                  <span className="font-mono text-[#015A6E]">success@upi</span>,{" "}
                  <span className="font-mono text-[#015A6E]">user@paytm</span>,{" "}
                  <span className="font-mono text-[#015A6E]">demo@gpay</span>
                </div>
              </div>
            )}

            {method === "card" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] font-medium text-[#4A5568] mb-1.5">Card Number</label>
                  <input
                    defaultValue="4111 1111 1111 1111"
                    className="w-full border border-[#E8ECF0] rounded-lg px-3 py-2.5 text-[13px] font-mono focus:outline-none focus:border-[#2D89EF]"
                    disabled={processing}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-medium text-[#4A5568] mb-1.5">Expiry</label>
                    <input
                      defaultValue="12/28"
                      className="w-full border border-[#E8ECF0] rounded-lg px-3 py-2.5 text-[13px] font-mono focus:outline-none focus:border-[#2D89EF]"
                      disabled={processing}
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#4A5568] mb-1.5">CVV</label>
                    <input
                      defaultValue="123"
                      type="password"
                      className="w-full border border-[#E8ECF0] rounded-lg px-3 py-2.5 text-[13px] font-mono focus:outline-none focus:border-[#2D89EF]"
                      disabled={processing}
                    />
                  </div>
                </div>
                <div className="bg-[#F8F9FB] rounded-lg px-3 py-2.5 text-[11px] text-[#4A5568]">
                  Use test card <span className="font-mono text-[#015A6E]">4111 1111 1111 1111</span> with any future expiry and CVV
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 text-[12px] text-[#B3423E] bg-[#FBEAEA] rounded-lg px-3 py-2.5 flex items-start gap-2">
                <AlertCircle size={13} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <button
              onClick={pay}
              disabled={processing || (method === "upi" && !upiId)}
              className="w-full mt-5 flex items-center justify-center gap-2 bg-[#015A6E] text-white text-[13px] font-semibold py-3 rounded-lg hover:bg-[#014552] disabled:opacity-50 transition-colors"
            >
              {processing ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Processing...
                </>
              ) : (
                `Pay ${inr(amount)}`
              )}
            </button>

            <div className="mt-3 text-center text-[10px] text-[#8A94A6]">
              Secured by Razorpay &middot; Test Mode
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
