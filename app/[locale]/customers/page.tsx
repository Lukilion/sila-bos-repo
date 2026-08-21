import React from "react";
import Link from "next/link";
import { NavIcon } from "@/components/navigation/NavIcon";

export default async function CustomersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isUrdu = locale === "ur-PK";

  const customers = [
    {
      id: "CUST-001",
      name: "Haji Rafiq & Sons",
      market: "Shah Alami Gate 3, Lahore",
      phone: "0300-4829100",
      creditLimit: "PKR 250,000",
      currentBalance: "PKR 184,000",
      utilization: 73,
      status: "Good Standing",
      priceTier: "Tier A (Wholesale Gold)",
      ntn: "4819203-1",
    },
    {
      id: "CUST-002",
      name: "Lahore Tech Plaza Distribution",
      market: "Hall Road, Lahore",
      phone: "0321-9988112",
      creditLimit: "PKR 250,000",
      currentBalance: "PKR 312,000",
      utilization: 124,
      status: "Over Limit (Hold)",
      priceTier: "Tier B (Wholesale Standard)",
      ntn: "1928374-2",
    },
    {
      id: "CUST-003",
      name: "Faisalabad Electronics Market",
      market: "Katchery Bazar, FSD",
      phone: "0333-5511223",
      creditLimit: "PKR 500,000",
      currentBalance: "PKR 45,000",
      utilization: 9,
      status: "VIP Partner",
      priceTier: "Tier VIP (Max Discount)",
      ntn: "8829104-9",
    },
    {
      id: "CUST-004",
      name: "Rawalpindi Mobile Traders",
      market: "Singapore Plaza, Saddar",
      phone: "0345-6677889",
      creditLimit: "PKR 300,000",
      currentBalance: "PKR 120,000",
      utilization: 40,
      status: "Good Standing",
      priceTier: "Tier A (Wholesale Gold)",
      ntn: "7728190-3",
    },
  ];

  return (
    <div className="space-y-6 select-none">
      {/* Header Banner */}
      <div
        id="customers-header"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#EDEBF8]"
        style={{
          boxShadow: "-8px -8px 18px #FFFFFF, 8px 8px 18px #C5C3D8",
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="neu-pill-badge bg-[#EDEBF8] text-[#007BFF] font-mono">
              KHATA & RECEIVABLES
            </span>
            <span className="text-label-12 text-[#7E8299]">Customer Directory & Credit Ledger</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#3A3F58] tracking-tight">
            {isUrdu ? "گاہک ڈائرکٹری اور ادھار کھاتہ لیجر" : "Customers & B2B Khata Ledger"}
          </h1>
          <p className="text-xs text-[#7E8299] max-w-xl text-copy-14">
            {isUrdu
              ? "گاہکوں کا ادھار بیلنس، کریڈٹ لمٹس، این ٹی این ٹیکس پروفائل اور قیمتوں کے درجے۔"
              : "Customer receivables ledger, credit caps, override approvals, and payment reconciliation."}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/${locale}/investor`}
            className="neu-btn-primary h-10 px-4 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <NavIcon name="BookOpenCheck" className="w-4 h-4" />
            <span>{isUrdu ? "انویسٹر والٹ کھاتہ" : "Investor Khata Pool"}</span>
          </Link>
        </div>
      </div>

      {/* Customer Directory Card */}
      <div
        id="customers-table-card"
        className="p-5 sm:p-6 rounded-2xl bg-[#EDEBF8] space-y-4"
        style={{
          boxShadow: "-6px -6px 14px #FFFFFF, 6px 6px 14px #C5C3D8",
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-heading-14 text-[#3A3F58] flex items-center gap-2">
            <div
              className="size-8 rounded-xl bg-[#EDEBF8] flex items-center justify-center text-[#007BFF]"
              style={{
                boxShadow: "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8",
              }}
            >
              <NavIcon name="BookOpenCheck" className="w-4 h-4" />
            </div>
            <span>{isUrdu ? "تمام کھاتہ داران" : "Active Customer Khata Accounts"}</span>
          </h2>
          <span className="text-xs text-[#7E8299] font-mono font-bold">Total Outstanding: PKR 661,000</span>
        </div>

        <div
          className="rounded-2xl p-2 bg-[#EDEBF8] overflow-x-auto"
          style={{
            boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
          }}
        >
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="text-[#7E8299] text-[11px] font-semibold border-b border-[#C5C3D8]/50">
                <th className="py-2.5 px-3 text-start">Customer / Shop Name</th>
                <th className="py-2.5 px-3 text-start">Contact & Market</th>
                <th className="py-2.5 px-3 text-start">Credit Limit</th>
                <th className="py-2.5 px-3 text-start">Current Khata Balance</th>
                <th className="py-2.5 px-3 text-start">Credit Utilization</th>
                <th className="py-2.5 px-3 text-start">Price Tier</th>
                <th className="py-2.5 px-3 text-start">Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C5C3D8]/30">
              {customers.map((c) => {
                const isOver = c.utilization > 100;
                return (
                  <tr key={c.id} className="hover:bg-[#E2E0EE]/40 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#3A3F58]">{c.name}</div>
                      <div className="text-[10px] text-[#7E8299] font-mono">NTN: {c.ntn}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-[#6C7293] font-medium">{c.market}</div>
                      <div className="text-[10px] text-[#7E8299]">{c.phone}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#3A3F58]">{c.creditLimit}</td>
                    <td className="py-3 px-3 font-mono font-bold">
                      <span className={isOver ? "text-rose-600" : "text-emerald-600"}>
                        {c.currentBalance}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div
                        className="w-24 h-2 rounded-full p-0.5 bg-[#EDEBF8] overflow-hidden mb-1"
                        style={{
                          boxShadow: "inset 1px 1px 3px #C5C3D8, inset -1px -1px 3px #FFFFFF",
                        }}
                      >
                        <div
                          className={`h-full rounded-full ${
                            isOver ? "bg-rose-500" : c.utilization > 70 ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${Math.min(c.utilization, 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#7E8299]">{c.utilization}% used</span>
                    </td>
                    <td className="py-3 px-3 text-[#007BFF] font-semibold">{c.priceTier}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`neu-pill-badge bg-[#EDEBF8] ${
                          isOver ? "text-rose-600" : "text-emerald-600"
                        }`}
                        style={{
                          boxShadow: "inset 1px 1px 3px #C5C3D8, inset -1px -1px 3px #FFFFFF",
                        }}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
