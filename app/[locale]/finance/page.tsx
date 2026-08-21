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
    <div className="space-y-6 select-none">
      {/* Header Banner */}
      <div
        id="finance-header"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#EDEBF8]"
        style={{
          boxShadow: "-8px -8px 18px #FFFFFF, 8px 8px 18px #C5C3D8",
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="neu-pill-badge bg-[#EDEBF8] text-[#007BFF] font-mono">
              CASH FLOW & FISCAL
            </span>
            <span className="text-label-12 text-[#7E8299]">Daily Cash Book & Tax Transmissions</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#3A3F58] tracking-tight">
            {isUrdu ? "مالیات، کیش بک و ایف بی آر ٹیکس" : "Finance, Cash Book & Invoices"}
          </h1>
          <p className="text-xs text-[#7E8299] max-w-xl text-copy-14">
            {isUrdu
              ? "روزانہ روکڑ کیش بک، بینک اسٹیٹمنٹ، سپلائر ادائیگیاں اور ایف بی آر ڈیجیٹل انوائسز۔"
              : "Daily cash book, bank reconciliation, vendor payables, and FBR fiscal digital invoices."}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href={`/${locale}/checkout`}
            className="neu-btn-primary h-10 px-4 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <NavIcon name="ReceiptText" className="w-4 h-4" />
            <span>{isUrdu ? "ایف بی آر انوائس بنائیں" : "FBR Digital Invoice"}</span>
          </Link>
          <Link
            href={`/${locale}/investor`}
            className="neu-btn h-10 px-3.5 rounded-2xl text-xs font-semibold text-[#6C7293] hover:text-[#007BFF] transition flex items-center gap-2 cursor-pointer active:scale-95"
            style={{
              boxShadow: "-4px -4px 8px #FFFFFF, 4px 4px 8px #C5C3D8",
            }}
          >
            {isUrdu ? "انویسٹر کھاتہ" : "Investor Stakes"}
          </Link>
        </div>
      </div>

      {/* Cash Flow Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div
          className="p-5 rounded-2xl bg-[#EDEBF8] min-h-[120px] flex flex-col justify-between"
          style={{
            boxShadow: "-5px -5px 10px #FFFFFF, 5px 5px 10px #C5C3D8",
          }}
        >
          <span className="text-label-14 text-[#7E8299]">{isUrdu ? "نقد رقم (کیش ان ہینڈ)" : "Cash in Hand (Counter)"}</span>
          <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 mt-2">PKR 485,000</div>
          <span className="text-[10px] text-[#7E8299]">Shah Alami Counter #1</span>
        </div>

        <div
          className="p-5 rounded-2xl bg-[#EDEBF8] min-h-[120px] flex flex-col justify-between"
          style={{
            boxShadow: "-5px -5px 10px #FFFFFF, 5px 5px 10px #C5C3D8",
          }}
        >
          <span className="text-label-14 text-[#7E8299]">{isUrdu ? "بینک بیلنس" : "Bank Accounts Total"}</span>
          <div className="text-xl sm:text-2xl font-black font-mono text-[#007BFF] mt-2">PKR 3,210,000</div>
          <span className="text-[10px] text-[#7E8299]">Meezan + HBL Accounts</span>
        </div>

        <div
          className="p-5 rounded-2xl bg-[#EDEBF8] min-h-[120px] flex flex-col justify-between"
          style={{
            boxShadow: "-5px -5px 10px #FFFFFF, 5px 5px 10px #C5C3D8",
          }}
        >
          <span className="text-label-14 text-[#7E8299]">{isUrdu ? "سپلائر واجبات (پے ایبلز)" : "Vendor Payables"}</span>
          <div className="text-xl sm:text-2xl font-black font-mono text-rose-600 mt-2">PKR 890,000</div>
          <span className="text-[10px] text-[#7E8299]">Due within 14 days</span>
        </div>
      </div>

      {/* Cash Book Journal Table Card */}
      <div
        id="finance-journal-card"
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
              <NavIcon name="Coins" className="w-4 h-4" />
            </div>
            <span>{isUrdu ? "روزانہ روکڑ کیش بک لاگ" : "Daily Cash Book Ledger (روکڑ)"}</span>
          </h2>
          <span className="text-xs text-[#7E8299] font-mono font-bold">Today&apos;s Transactions</span>
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
                <th className="py-2.5 px-3 text-start">Entry ID</th>
                <th className="py-2.5 px-3 text-start">Description</th>
                <th className="py-2.5 px-3 text-start">Channel / Account</th>
                <th className="py-2.5 px-3 text-start">Amount</th>
                <th className="py-2.5 px-3 text-start">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C5C3D8]/30">
              {entries.map((e) => (
                <tr key={e.id} className="hover:bg-[#E2E0EE]/40 transition">
                  <td className="py-3 px-3">
                    <div className="font-mono font-bold text-[#007BFF]">{e.id}</div>
                    <div className="text-[10px] text-[#7E8299]">{e.time}</div>
                  </td>
                  <td className="py-3 px-3 text-[#3A3F58] font-semibold">{e.description}</td>
                  <td className="py-3 px-3 text-[#6C7293]">{e.channel}</td>
                  <td className="py-3 px-3 font-mono font-bold">
                    <span className={e.type === "Credit" ? "text-emerald-600" : "text-rose-600"}>
                      {e.amount}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`neu-pill-badge bg-[#EDEBF8] ${
                        e.type === "Credit" ? "text-emerald-600" : "text-rose-600"
                      }`}
                      style={{
                        boxShadow: "inset 1px 1px 3px #C5C3D8, inset -1px -1px 3px #FFFFFF",
                      }}
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
