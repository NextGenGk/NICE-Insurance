import Link from "next/link";
import type { Lead } from "@prisma/client";
import { Phone, ChevronRight, Users, FileCheck2, ShieldCheck, TrendingUp, MapPin, Mail } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { AddLeadModal } from "@/components/AddLeadModal";
import { prisma } from "@/lib/prisma";
import { PRODUCT_LABELS, ProductType } from "@/lib/insurers";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-[#E6F4F6] text-[#3F5D63]",
  CONTACTED: "bg-[#E6F4F6] text-[#01718B]",
  QUOTED: "bg-[#E6F4F6] text-[#009FAF]",
  ADVISED: "bg-[#E6F4F6] text-[#01718B]",
  KYC_PENDING: "bg-[#FFF8E8] text-[#8A6A1A]",
  PAYMENT_PENDING: "bg-[#FFF8E8] text-[#8A6A1A]",
  SUBMITTED: "bg-[#E6F4F6] text-[#01718B]",
  UNDERWRITING: "bg-[#E6F4F6] text-[#01718B]",
  ISSUED: "bg-[#E6F4F6] text-[#009FAF]",
  REJECTED: "bg-[#FBEAEA] text-[#B3423E]",
  LOST: "bg-[#FBEAEA] text-[#B3423E]",
};

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  suffix?: string;
}) {
  return (
    <div className="bg-white border border-[#D3E6EA] rounded-lg p-5 flex items-start justify-between">
      <div>
        <div className="text-[12px] text-[#7A979D] mb-2">{label}</div>
        <div style={{ fontFamily: "var(--font-mono-brand)" }} className="text-2xl text-[#0F2A2E]">
          {value}
          {suffix && <span className="text-sm text-[#7A979D] font-sans ml-1">{suffix}</span>}
        </div>
      </div>
      <div className="w-9 h-9 rounded-md bg-[#E6F4F6] flex items-center justify-center text-[#009FAF]">
        <Icon size={16} />
      </div>
    </div>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function leadHref(lead: Lead) {
  if (lead.status === "ISSUED") return `/leads/${lead.id}/policy`;
  if (!lead.productType) return `/leads/${lead.id}/product`;
  return `/leads/${lead.id}/profile`;
}

export default async function DashboardPage() {
  const [leads, totalLeads, quotesGenerated, policiesIssued] = await Promise.all([
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 25 }),
    prisma.lead.count(),
    prisma.lead.count({ where: { quotations: { some: {} } } }),
    prisma.policy.count(),
  ]);

  const conversionRate = totalLeads > 0 ? Math.round((policiesIssued / totalLeads) * 100) : 0;

  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-2xl text-[#0F2A2E] mb-1">
            Dashboard
          </h1>
          <p className="text-[#3F5D63] text-sm">Every lead, from first enquiry to issued policy.</p>
        </div>
        <AddLeadModal />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total leads" value={totalLeads} />
        <StatCard icon={FileCheck2} label="Quotes generated" value={quotesGenerated} />
        <StatCard icon={ShieldCheck} label="Policies issued" value={policiesIssued} />
        <StatCard icon={TrendingUp} label="Conversion rate" value={conversionRate} suffix="%" />
      </div>

      <div className="bg-white border border-[#D3E6EA] rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-[#D3E6EA] flex items-center justify-between">
          <span className="font-semibold text-[#0F2A2E] text-sm">Recent leads</span>
        </div>

        {leads.length === 0 ? (
          <div className="text-sm text-[#3F5D63] p-6">
            No leads yet. Click <span className="font-medium text-[#0F2A2E]">Add new lead</span> above, or run{" "}
            <code className="bg-[#E6F4F6] px-1.5 py-0.5 rounded">npx prisma db seed</code> for sample data.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-[#7A979D] border-b border-[#D3E6EA]">
                <th className="px-5 py-3 font-medium">Lead</th>
                <th className="px-5 py-3 font-medium hidden sm:table-cell">Product</th>
                <th className="px-5 py-3 font-medium hidden md:table-cell">City</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium hidden lg:table-cell">Source</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {leads.map((l: Lead) => (
                <tr key={l.id} className="border-b border-[#E6F4F6] last:border-0 hover:bg-[#EEF7F9] transition-colors">
                  <td className="px-5 py-3">
                    <Link href={leadHref(l)} className="flex items-center gap-3 group">
                      <div className="w-8 h-8 rounded-full bg-[#009FAF] text-white text-[11px] font-semibold flex items-center justify-center shrink-0">
                        {initials(l.name)}
                      </div>
                      <div>
                        <div className="font-medium text-[#0F2A2E] group-hover:text-[#009FAF] transition-colors">
                          {l.name}
                        </div>
                        <div className="text-[12px] text-[#7A979D] flex items-center gap-1">
                          <Phone size={10} /> {l.phone}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-5 py-3 hidden sm:table-cell text-[#3F5D63]">
                    {l.productType ? (
                      PRODUCT_LABELS[l.productType as ProductType]
                    ) : (
                      <span className="text-[#C2D5D9]">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell text-[#3F5D63]">{l.city ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[l.status] ?? "bg-[#E6F4F6] text-[#3F5D63]"}`}
                    >
                      {l.status.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell text-[#3F5D63]">{l.source}</td>
                  <td className="px-5 py-3 text-right">
                    <Link href={leadHref(l)} className="text-[#009FAF] hover:text-[#0F2A2E] transition-colors inline-flex">
                      <ChevronRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-8 bg-white border border-[#D3E6EA] rounded-lg overflow-hidden md:grid md:grid-cols-[220px_1fr]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/nice/about.png"
          alt="NICE – Network of Insurance & Claims Expert"
          className="w-full h-44 md:h-full object-cover"
        />
        <div className="p-6">
          <h2 style={{ fontFamily: "var(--font-display)" }} className="text-lg text-[#0F2A2E] mb-2">
            About NICE
          </h2>
          <p className="text-[13px] leading-relaxed text-[#3F5D63] mb-4">
            NICE – Network of Insurance &amp; Claims Expert is a general insurance services information provider
            established by a team of professionals with more than 13 years of experience in the insurance industry.
            We simplify insurance with a combination of technology and human touch, and help clients across India
            choose the right cover for truck, car, bike, health, home, office, shop and travel risks.
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2 text-[12px] text-[#3F5D63]">
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-[#009FAF]" /> Amapara, Raipur, Chhattisgarh 492001
            </span>
            <a href="tel:+919771420518" className="flex items-center gap-1.5 hover:text-[#0F2A2E]">
              <Phone size={13} className="text-[#009FAF]" /> +91 97714 20518
            </a>
            <a href="mailto:rajeev@niceinsurance.co.in" className="flex items-center gap-1.5 hover:text-[#0F2A2E]">
              <Mail size={13} className="text-[#009FAF]" /> rajeev@niceinsurance.co.in
            </a>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
