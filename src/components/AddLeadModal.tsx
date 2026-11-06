"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Modal } from "@/components/Modal";

const field =
  "w-full border border-[#D3E6EA] rounded-md px-3 py-2 text-sm text-[#0F2A2E] focus:outline-none focus:border-[#009FAF] bg-white";
const label = "block text-[12px] font-medium text-[#3F5D63] mb-1.5";

export function AddLeadModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("Bhilai");
  const [source, setSource] = useState("Website enquiry");

  async function submit() {
    if (!name || !phone) return;
    setSaving(true);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, email, city, source }),
    });
    const lead = await res.json();
    setSaving(false);
    setOpen(false);
    router.push(`/leads/${lead.id}/product`);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 bg-[#009FAF] text-white text-sm font-semibold px-4 py-2.5 rounded-md hover:bg-[#01718B] transition-colors"
      >
        <Plus size={16} /> Add new lead
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Add new lead" subtitle="Start a new advisory journey">
        <div className="space-y-4">
          <div>
            <label className={label}>Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Customer name" className={field} />
          </div>
          <div>
            <label className={label}>Phone number</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 90000 00000" className={field} />
          </div>
          <div>
            <label className={label}>Email (optional)</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className={field} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>City</label>
              <input value={city} onChange={(e) => setCity(e.target.value)} className={field} />
            </div>
            <div>
              <label className={label}>Source</label>
              <select value={source} onChange={(e) => setSource(e.target.value)} className={field}>
                <option>Website enquiry</option>
                <option>WhatsApp</option>
                <option>Referral</option>
                <option>Walk-in</option>
                <option>Phone call</option>
              </select>
            </div>
          </div>
          <button
            onClick={submit}
            disabled={!name || !phone || saving}
            className="w-full bg-[#009FAF] text-white text-sm font-semibold py-2.5 rounded-md hover:bg-[#01718B] disabled:opacity-50 mt-2"
          >
            {saving ? "Creating…" : "Create lead & start journey"}
          </button>
        </div>
      </Modal>
    </>
  );
}
