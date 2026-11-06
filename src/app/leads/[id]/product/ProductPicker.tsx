"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, Car, Bike, HeartPulse, Home, Building2, Store, Plane, Loader2 } from "lucide-react";
import { NavButtons } from "@/components/NavButtons";

const PRODUCTS = [
  { key: "TRUCK", label: "Truck Insurance", icon: Truck, desc: "Commercial vehicle & goods carriage" },
  { key: "CAR", label: "Car Insurance", icon: Car, desc: "Private car package & add-ons" },
  { key: "BIKE", label: "Bike Insurance", icon: Bike, desc: "Two-wheeler package cover" },
  { key: "HEALTH", label: "Health Insurance", icon: HeartPulse, desc: "Individual & family floater" },
  { key: "HOME", label: "Home Insurance", icon: Home, desc: "Householders & contents cover" },
  { key: "OFFICE", label: "Office Insurance", icon: Building2, desc: "Office package & contents" },
  { key: "SHOP", label: "Shop Insurance", icon: Store, desc: "Shopkeepers package policy" },
  { key: "TRAVEL", label: "Travel Insurance", icon: Plane, desc: "Domestic & overseas travel" },
] as const;

export function ProductPicker({ leadId }: { leadId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function pick(key: string) {
    setLoading(key);
    await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productType: key, status: "CONTACTED" }),
    });
    router.push(`/leads/${leadId}/profile`);
  }

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {PRODUCTS.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.key}
              onClick={() => pick(p.key)}
              disabled={!!loading}
              className="text-left bg-white border border-[#D3E6EA] rounded-lg p-5 hover:border-[#009FAF] hover:shadow-sm transition-all disabled:opacity-60"
            >
              {loading === p.key ? (
                <Loader2 size={20} className="text-[#009FAF] mb-3 animate-spin" />
              ) : (
                <Icon size={20} className="text-[#009FAF] mb-3" />
              )}
              <div className="font-semibold text-[#0F2A2E] mb-1">{p.label}</div>
              <div className="text-[13px] text-[#3F5D63]">{p.desc}</div>
            </button>
          );
        })}
      </div>
      <NavButtons backHref="/" />
    </div>
  );
}
