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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-mono font-bold">
              KHATA & RECEIVABLES
            </span>
            <span className="text-xs text-slate-400">Customer Directory & Credit Ledger</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            {isUrdu ? "گاہک ڈائرکٹری اور ادھار کھاتہ لیجر" : "Customers & B2B Khata Ledger"}
          </h1>
          <p className="text-xs text-slate-400">
            {isUrdu
              ? "گاہکوں کا ادھار بیلنس، کریڈٹ لمٹس، این ٹی این ٹیکس پروفائل اور قیمتوں کے درجے۔"
              : "Customer receivables ledger, credit caps, override approvals, and payment reconciliation."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/investor`}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm flex items-center gap-2"
          >
            <NavIcon name="BookOpenCheck" className="w-4 h-4" />
            <span>{isUrdu ? "انویسٹر والٹ کھاتہ" : "Investor Khata Pool"}</span>
          </Link>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <NavIcon name="BookOpenCheck" className="w-4 h-4 text-indigo-400" />
            <span>{isUrdu ? "تمام کھاتہ داران" : "Active Customer Khata Accounts"}</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Total Outstanding: PKR 661,000</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold">
                <th className="py-2.5 px-3 text-start">Customer / Shop Name</th>
                <th className="py-2.5 px-3 text-start">Contact & Market</th>
                <th className="py-2.5 px-3 text-start">Credit Limit</th>
                <th className="py-2.5 px-3 text-start">Current Khata Balance</th>
                <th className="py-2.5 px-3 text-start">Credit Utilization</th>
                <th className="py-2.5 px-3 text-start">Price Tier</th>
                <th className="py-2.5 px-3 text-start">Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {customers.map((c) => {
                const isOver = c.utilization > 100;
                return (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{c.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">NTN: {c.ntn}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-200">{c.market}</div>
                      <div className="text-[10px] text-slate-400">{c.phone}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-300">{c.creditLimit}</td>
                    <td className="py-3 px-3 font-mono font-bold">
                      <span className={isOver ? "text-rose-400" : "text-emerald-400"}>
                        {c.currentBalance}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden mb-1">
                        <div
                          className={`h-full rounded-full ${
                            isOver ? "bg-rose-500" : c.utilization > 70 ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${Math.min(c.utilization, 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{c.utilization}% used</span>
                    </td>
                    <td className="py-3 px-3 text-indigo-300 font-medium">{c.priceTier}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isOver
                            ? "bg-rose-500/20 text-rose-300"
                            : "bg-emerald-500/20 text-emerald-300"
                        }`}
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
