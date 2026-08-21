import React from "react";
import Link from "next/link";
import { NavIcon } from "@/components/navigation/NavIcon";

export default async function FinancePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isUrdu = locale === "ur-PK";

  const entries = [
    {
      id: "ROK-1092",
      type: "Credit",
      description: "Cash Sale (200x Fast Chargers) — Haji Rafiq",
      amount: "+ PKR 72,000",
      channel: "Cash Counter (روکڑ)",
      time: "10:45 AM",
    },
    {
      id: "ROK-1091",
      type: "Debit",
      description: "Godown Labor & Loading Fleet Charges",
      amount: "- PKR 4,500",
      channel: "Petty Cash",
      time: "09:30 AM",
    },
    {
      id: "ROK-1090",
      type: "Credit",
      description: "Bank Cheque Receipt #48190 — Faisalabad Wholesalers",
      amount: "+ PKR 50,000",
      channel: "Habib Bank Main Account",
      time: "Yesterday",
    },
    {
      id: "ROK-1089",
      type: "Debit",
      description: "Inward Lot Clearance (Shenzhen Freight Logistics)",
      amount: "- PKR 180,000",
      channel: "Meezan Bank Sourcing",
      time: "Aug 19, 2026",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-mono font-bold">
              CASH FLOW & FISCAL
            </span>
            <span className="text-xs text-slate-400">Daily Cash Book & Tax Transmissions</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            {isUrdu ? "مالیات، کیش بک و ایف بی آر ٹیکس" : "Finance, Cash Book & Invoices"}
          </h1>
          <p className="text-xs text-slate-400">
            {isUrdu
              ? "روزانہ روکڑ کیش بک، بینک اسٹیٹمنٹ، سپلائر ادائیگیاں اور ایف بی آر ڈیجیٹل انوائسز۔"
              : "Daily cash book, bank reconciliation, vendor payables, and FBR fiscal digital invoices."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/checkout`}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm flex items-center gap-2"
          >
            <NavIcon name="ReceiptText" className="w-4 h-4" />
            <span>{isUrdu ? "ایف بی آر انوائس بنائیں" : "FBR Digital Invoice"}</span>
          </Link>
          <Link
            href={`/${locale}/investor`}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            {isUrdu ? "انویسٹر کھاتہ" : "Investor Stakes"}
          </Link>
        </div>
      </div>

      {/* Cash Flow Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">{isUrdu ? "نقد رقم (کیش ان ہینڈ)" : "Cash in Hand (Counter)"}</span>
          <div className="text-xl font-black font-mono text-emerald-400 mt-2">PKR 485,000</div>
          <span className="text-[10px] text-slate-500">Shah Alami Counter #1</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">{isUrdu ? "بینک بیلنس" : "Bank Accounts Total"}</span>
          <div className="text-xl font-black font-mono text-indigo-400 mt-2">PKR 3,210,000</div>
          <span className="text-[10px] text-slate-500">Meezan + HBL Accounts</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">{isUrdu ? "سپلائر واجبات (پے ایبلز)" : "Vendor Payables"}</span>
          <div className="text-xl font-black font-mono text-rose-400 mt-2">PKR 890,000</div>
          <span className="text-[10px] text-slate-500">Due within 14 days</span>
        </div>
      </div>

      {/* Cash Book Journal Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <NavIcon name="Coins" className="w-4 h-4 text-indigo-400" />
            <span>{isUrdu ? "روزانہ روکڑ کیش بک لاگ" : "Daily Cash Book Ledger (روکڑ)"}</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Today&apos;s Transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold">
                <th className="py-2.5 px-3 text-start">Entry ID</th>
                <th className="py-2.5 px-3 text-start">Description</th>
                <th className="py-2.5 px-3 text-start">Channel / Account</th>
                <th className="py-2.5 px-3 text-start">Amount</th>
                <th className="py-2.5 px-3 text-start">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {entries.map((e) => (
                <tr key={e.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3">
                    <div className="font-mono font-bold text-indigo-400">{e.id}</div>
                    <div className="text-[10px] text-slate-500">{e.time}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-200 font-semibold">{e.description}</td>
                  <td className="py-3 px-3 text-slate-400">{e.channel}</td>
                  <td className="py-3 px-3 font-mono font-bold">
                    <span className={e.type === "Credit" ? "text-emerald-400" : "text-rose-400"}>
                      {e.amount}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        e.type === "Credit"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-rose-500/20 text-rose-300"
                      }`}
                    >
                      {e.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

