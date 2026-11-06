import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Users } from "lucide-react";
import { NiceBrand } from "./NiceBrand";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F3F8F9] flex">
      <aside className="w-64 shrink-0 bg-gradient-to-b from-[#01718B] to-[#015A6E] px-6 py-8 hidden md:flex flex-col fixed inset-y-0 left-0">
        <NiceBrand />

        <nav className="flex flex-col gap-1">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-white bg-white/20 rounded-md px-3 py-2.5 text-sm font-medium"
          >
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2.5 text-white/60 hover:text-white hover:bg-white/10 rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
          >
            <Users size={16} /> Leads
          </Link>
        </nav>

        <div className="mt-auto text-[10px] text-white/60 pt-6 border-t border-white/10 leading-relaxed">
          <div className="text-white/80 font-medium mb-1">NICE – Network of Insurance &amp; Claims Expert</div>
          <div>H No-C 108, Ground Floor, Opposite Life Worth Hospital, Amapara, Raipur, Chhattisgarh 492001</div>
          <a href="tel:+919771420518" className="block hover:text-white transition-colors mt-1">+91 97714 20518</a>
          <a href="tel:+918210437434" className="block hover:text-white transition-colors">+91 82104 37434</a>
          <a href="mailto:rajeev@niceinsurance.co.in" className="block hover:text-white transition-colors">rajeev@niceinsurance.co.in</a>
        </div>
      </aside>

      <div className="flex-1 flex flex-col md:ml-64">
        <header className="border-b border-[#D3E6EA] px-6 md:px-10 py-4 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="md:hidden">
            <NiceBrand dark={false} />
          </div>
          <div className="text-[#0F2A2E] font-medium text-sm hidden md:block">NICE Advisor Dashboard</div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#7A979D] uppercase tracking-wide border border-[#D3E6EA] rounded-full px-3 py-1">
              Raipur, Chhattisgarh
            </span>
            <UserButton />
          </div>
        </header>
        <main className="flex-1 px-6 md:px-10 py-8 max-w-7xl w-full">{children}</main>
      </div>
    </div>
  );
}
