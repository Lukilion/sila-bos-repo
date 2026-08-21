/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { prisma } from "@/lib/prisma";
import { NavIcon } from "@/components/navigation/NavIcon";

export default async function SourcingHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isUrdu = locale === "ur-PK";

  const warehouses = await prisma.warehouse.findMany();
  const categories = await prisma.category.findMany();

  return (
    <div className="space-y-6 select-none">
      {/* Header Banner */}
      <div
        id="sourcing-header"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#EDEBF8]"
        style={{
          boxShadow: "-8px -8px 18px #FFFFFF, 8px 8px 18px #C5C3D8",
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="neu-pill-badge bg-[#EDEBF8] text-[#007BFF] font-mono">
              SOURCING & INWARD
            </span>
            <span className="text-label-12 text-[#7E8299]">Shah Alami Market Procurements</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#3A3F58] tracking-tight">
            {isUrdu ? "سورسنگ ہب (مارکیٹ مال آمد)" : "Market Sourcing & Inward Batches"}
          </h1>
          <p className="text-xs text-[#7E8299] max-w-xl text-copy-14">
            {isUrdu
              ? "شاہ عالمی مارکیٹ سے خریدی گئی نئی لاٹس، گودام اندراج اور ریٹ لسٹ۔"
              : "Record incoming vendor lots, allocate warehouse godowns, and define dual pricing tiers."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entry Form Card */}
        <div
          id="sourcing-form-card"
          className="p-5 sm:p-6 rounded-2xl bg-[#EDEBF8] lg:col-span-2 space-y-4"
          style={{
            boxShadow: "-6px -6px 14px #FFFFFF, 6px 6px 14px #C5C3D8",
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="size-8 rounded-xl bg-[#EDEBF8] flex items-center justify-center text-[#007BFF]"
              style={{
                boxShadow: "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8",
              }}
            >
              <NavIcon name="Plus" className="w-4 h-4" />
            </div>
            <h3 className="text-heading-14 text-[#3A3F58]">
              {isUrdu ? "نئی لاٹ اندراج" : "Log Sourcing Lot"}
            </h3>
          </div>

          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs text-[#6C7293] font-bold mb-1.5 block">Title (English)</label>
              <input
                type="text"
                placeholder="e.g. Type-C Fast Cable 65W"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#EDEBF8] text-xs text-[#3A3F58] outline-none font-medium transition"
                style={{
                  boxShadow: "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF",
                }}
              />
            </div>

            <div>
              <label className="text-xs text-[#6C7293] font-bold mb-1.5 block">Title (Urdu)</label>
              <input
                type="text"
                placeholder="مثلاً فاسٹ چارجنگ کیبل"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#EDEBF8] text-xs text-[#3A3F58] outline-none font-medium transition"
                style={{
                  boxShadow: "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF",
                }}
              />
            </div>

            <div>
              <label className="text-xs text-[#6C7293] font-bold mb-1.5 block">Category</label>
              <select
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#EDEBF8] text-xs text-[#3A3F58] outline-none font-medium transition cursor-pointer"
                style={{
                  boxShadow: "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF",
                }}
              >
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-[#6C7293] font-bold mb-1.5 block">Target Godown</label>
              <select
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#EDEBF8] text-xs text-[#3A3F58] outline-none font-medium transition cursor-pointer"
                style={{
                  boxShadow: "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF",
                }}
              >
                {warehouses.map((w: any) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-[#6C7293] font-bold mb-1.5 block">Cost Price (PKR)</label>
              <input
                type="number"
                placeholder="450"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#EDEBF8] text-xs text-[#3A3F58] outline-none font-mono font-bold transition"
                style={{
                  boxShadow: "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF",
                }}
              />
            </div>

            <div>
              <label className="text-xs text-[#6C7293] font-bold mb-1.5 block">Wholesale Rate (PKR)</label>
              <input
                type="number"
                placeholder="550"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#EDEBF8] text-xs text-[#3A3F58] outline-none font-mono font-bold transition"
                style={{
                  boxShadow: "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF",
                }}
              />
            </div>

            <div>
              <label className="text-xs text-[#6C7293] font-bold mb-1.5 block">Retail MSRP (PKR)</label>
              <input
                type="number"
                placeholder="750"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#EDEBF8] text-xs text-[#3A3F58] outline-none font-mono font-bold transition"
                style={{
                  boxShadow: "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF",
                }}
              />
            </div>

            <div>
              <label className="text-xs text-[#6C7293] font-bold mb-1.5 block">Quantity (Units/Cartons)</label>
              <input
                type="number"
                placeholder="1000"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#EDEBF8] text-xs text-[#3A3F58] outline-none font-mono font-bold transition"
                style={{
                  boxShadow: "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF",
                }}
              />
            </div>

            <div className="sm:col-span-2 mt-2">
              <button
                type="button"
                className="neu-btn-primary w-full py-3 rounded-2xl text-xs font-bold text-white transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <NavIcon name="CheckCircle" className="w-4 h-4" />
                <span>{isUrdu ? "لاٹ محفوظ کریں اور کھاتہ اپڈیٹ کریں" : "Commit Batch & Post Ledger Entry"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Real-time Summary Card */}
        <div
          id="sourcing-godown-summary"
          className="p-5 sm:p-6 rounded-2xl bg-[#EDEBF8] flex flex-col justify-between gap-4"
          style={{
            boxShadow: "-6px -6px 14px #FFFFFF, 6px 6px 14px #C5C3D8",
          }}
        >
          <div className="space-y-3">
            <h3 className="text-heading-14 text-[#3A3F58]">Active Godowns</h3>
            <div className="flex flex-col gap-3">
              {warehouses.map((w: any) => (
                <div
                  key={w.id}
                  className="p-3.5 rounded-2xl bg-[#EDEBF8]"
                  style={{
                    boxShadow: "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8",
                  }}
                >
                  <div className="text-xs font-bold text-[#3A3F58]">{w.name}</div>
                  <div className="text-[11px] text-[#7E8299]">{w.location}</div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="p-3 rounded-2xl bg-[#EDEBF8] text-[11px] text-[#7E8299] text-center"
            style={{
              boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
            }}
          >
            All purchases automatically debit the Sourcing Outflow sub-ledger.
          </div>
        </div>
      </div>
    </div>
  );
}
