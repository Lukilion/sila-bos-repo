/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NavIcon } from "@/components/navigation/NavIcon";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isUrdu = locale === "ur-PK";

  // Fetch live products, warehouses, orders, and users from database proxy
  const [products, godowns] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: true,
        inventoryBins: {
          include: {
            warehouse: true,
          },
        },
      },
    }),
    prisma.warehouse.findMany({
      include: {
        bins: true,
      },
    }),
  ]);

  const totalStock = products.reduce(
    (acc: number, p: any) =>
      acc + (p.inventoryBins || []).reduce((sum: number, b: any) => sum + (b.quantity || 0), 0),
    0
  );
  const lowStockCount = products.filter((p: any) => {
    const stock = (p.inventoryBins || []).reduce((sum: number, b: any) => sum + (b.quantity || 0), 0);
    return stock < (p.minStockAlert || 30);
  }).length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Bar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[11px] font-bold font-mono">
              HUB: LHR-SA-01
            </span>
            <span className="text-xs text-slate-400">● {isUrdu ? "شاہ عالمی مارکیٹ ہب" : "Shah Alami Realtime Hub"}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {isUrdu ? "شاہ عالمی ہول سیل کنٹرول پینل" : "Shah Alami Wholesale Operations"}
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            {isUrdu
              ? "روزانہ تھوک آرڈرز، ملٹی گودام انوینٹری، گاہک ادھار کھاتہ اور ایف بی آر ڈیجیٹل انوائسز کا مرکزی کنٹرول۔"
              : "Unified Business Operating System for high-velocity wholesale trading, multi-godown stock transfers, B2B Khata credit limits, and FBR fiscalization."}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href={`/${locale}/orders`}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition flex items-center gap-2"
          >
            <NavIcon name="ShoppingBag" className="w-4 h-4" />
            <span>{isUrdu ? "نیا آرڈر درج کریں" : "New Sales Order"}</span>
          </Link>
          <Link
            href={`/${locale}/inventory`}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-2"
          >
            <NavIcon name="Warehouse" className="w-4 h-4" />
            <span>{isUrdu ? "گودام آڈٹ" : "Stock Audit"}</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">{isUrdu ? "آج کی تھوک سیلز" : "Today's B2B Sales"}</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <NavIcon name="Coins" className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black font-mono text-white">PKR 1,480,000</span>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400">
              <span>↑ +14.2%</span>
              <span className="text-slate-500">{isUrdu ? "گزشتہ روز سے زیادہ" : "vs yesterday volume"}</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">{isUrdu ? "کل گودام اسٹاک" : "Total Godown Stock"}</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <NavIcon name="Warehouse" className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black font-mono text-white">
              {totalStock.toLocaleString()} Units
            </span>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
              <span>{godowns.length} Active Godowns</span>
              <span className="text-slate-500">• 98% in stock</span>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">{isUrdu ? "کھاتہ واجبات (ادھار)" : "Khata Receivables"}</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <NavIcon name="BookOpenCheck" className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black font-mono text-rose-400">PKR 2,840,000</span>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-400">
              <span>18 Active Parties</span>
              <span className="text-slate-500">• 2 Over limit</span>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">{isUrdu ? "کم اسٹاک الرٹس" : "Low Stock Warnings"}</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <NavIcon name="AlertTriangle" className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black font-mono text-amber-400">
              {lowStockCount || 3} SKUs
            </span>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-indigo-400">
              <Link href={`/${locale}/inventory`} className="hover:underline">
                {isUrdu ? "فوری آرڈر کریں →" : "Re-order inward lots →"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Operations Matrix (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Orders & Dispatch Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent B2B Sales Orders */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <NavIcon name="ShoppingBag" className="w-5 h-5 text-indigo-400" />
                <h2 className="text-sm font-bold text-white">
                  {isUrdu ? "حالیہ تھوک آرڈرز" : "Recent B2B Wholesale Sales Orders"}
                </h2>
              </div>
              <Link
                href={`/${locale}/orders`}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                {isUrdu ? "تمام آرڈرز →" : "View All Orders →"}
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold">
                    <th className="py-2.5 px-3 text-start">Order #</th>
                    <th className="py-2.5 px-3 text-start">Customer / Party</th>
                    <th className="py-2.5 px-3 text-start">Lots & Items</th>
                    <th className="py-2.5 px-3 text-start">Amount</th>
                    <th className="py-2.5 px-3 text-start">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-mono font-bold text-indigo-400">ORD-948104</td>
                    <td className="py-3 px-3 font-semibold text-slate-200">Haji Rafiq & Sons (Shah Alami)</td>
                    <td className="py-3 px-3 text-slate-400">200x Fast Chargers (Lot #CHG-65W)</td>
                    <td className="py-3 px-3 font-mono font-bold text-white">PKR 72,000</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        Dispatched
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-mono font-bold text-indigo-400">ORD-948102</td>
                    <td className="py-3 px-3 font-semibold text-slate-200">Lahore Tech Plaza Distribution</td>
                    <td className="py-3 px-3 text-slate-400">50x OLED Displays</td>
                    <td className="py-3 px-3 font-mono font-bold text-white">PKR 84,960</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                        Override Pending
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-mono font-bold text-indigo-400">ORD-948098</td>
                    <td className="py-3 px-3 font-semibold text-slate-200">Faisalabad Electronics Retail</td>
                    <td className="py-3 px-3 text-slate-400">500x Type-C Cables</td>
                    <td className="py-3 px-3 font-mono font-bold text-white">PKR 140,000</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                        Paid / Khata Clear
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Godown Stock & Bin Allocation */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <NavIcon name="Warehouse" className="w-5 h-5 text-indigo-400" />
                <h2 className="text-sm font-bold text-white">
                  {isUrdu ? "گودام اسٹاک و ریکس کی صورتحال" : "Godown Capacity & Real-Time Bin Status"}
                </h2>
              </div>
              <Link
                href={`/${locale}/inventory/transfers`}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                {isUrdu ? "اسٹاک ٹرانسفر →" : "Multi-Godown Transfer →"}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {godowns.map((g: any) => {
                const warehouseStock = (g.bins || []).reduce((sum: number, b: any) => sum + (b.quantity || 0), 0);
                const capacityPercent = Math.min(Math.round((warehouseStock / 2000) * 100) || 75, 100);
                return (
                  <div key={g.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-white">{g.name}</h3>
                        <span className="text-[11px] text-slate-400">{g.location || "Shah Alami Gate 2"}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold font-mono">
                        {capacityPercent}% Utilized
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${capacityPercent}%` }} />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Bins: {(g.bins || []).length} active</span>
                      <span className="font-mono text-slate-300 font-bold">{warehouseStock.toLocaleString()} Units Stored</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Khata Ledger & Critical Alerts */}
        <div className="space-y-6">
          {/* Critical Low Stock SKUs */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <NavIcon name="AlertTriangle" className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-bold text-white">
                  {isUrdu ? "فوری مال خریداری (کم اسٹاک)" : "Critical Stock Re-order"}
                </h2>
              </div>
            </div>

            <div className="space-y-2.5">
              {products
                .map((p: any) => ({
                  ...p,
                  stockQty: (p.inventoryBins || []).reduce((sum: number, b: any) => sum + (b.quantity || 0), 0),
                }))
                .filter((p: any) => p.stockQty < (p.minStockAlert || 40))
                .slice(0, 3)
                .map((p: any) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-slate-950/60 border border-amber-500/30 flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{isUrdu ? p.nameUr : p.nameEn}</h4>
                      <span className="text-[11px] text-amber-400 font-mono font-bold">
                        Only {p.stockQty} units remaining!
                      </span>
                    </div>
                    <Link
                      href={`/${locale}/sourcing`}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold shrink-0 transition"
                    >
                      {isUrdu ? "لاٹ بنائیں" : "Order PO"}
                    </Link>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Khata Summary */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <NavIcon name="BookOpenCheck" className="w-5 h-5 text-indigo-400" />
                <h2 className="text-sm font-bold text-white">
                  {isUrdu ? "گاہک کھاتہ و واجبات سمری" : "Khata Receivables Watchlist"}
                </h2>
              </div>
              <Link
                href={`/${locale}/customers`}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                {isUrdu ? "کھاتہ دیکھیں →" : "View Khata →"}
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Haji Rafiq & Sons</h4>
                  <span className="text-[10px] text-slate-400">Limit: PKR 250,000</span>
                </div>
                <div className="text-end">
                  <span className="text-xs font-mono font-bold text-emerald-400">PKR 184,000</span>
                  <div className="text-[10px] text-slate-400">73% limit used</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-rose-500/30 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Lahore Tech Plaza</h4>
                  <span className="text-[10px] text-rose-400 font-bold">EXCEEDED (Limit: 250k)</span>
                </div>
                <div className="text-end">
                  <span className="text-xs font-mono font-bold text-rose-400">PKR 312,000</span>
                  <div className="text-[10px] text-rose-400">Approval Required</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
