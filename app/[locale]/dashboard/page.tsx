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

  // Fetch live products, warehouses, orders from database proxy
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
    <div className="space-y-6 select-none">
      {/* 1. Top Banner / Wholesale Command Center Bar (Neumorphic Raised Card) */}
      <div
        id="dashboard-top-banner"
        className="p-5 sm:p-6 rounded-2xl bg-[#EDEBF8] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all duration-200"
        style={{
          boxShadow: "-8px -8px 18px #FFFFFF, 8px 8px 18px #C5C3D8",
        }}
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span
              className="neu-pill-badge bg-[#EDEBF8] text-[#007BFF] font-mono"
            >
              HUB: LHR-SA-01
            </span>
            <span className="text-label-12 text-[#7E8299]">
              ● {isUrdu ? "شاہ عالمی مارکیٹ ہب" : "Shah Alami Realtime Hub"}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#3A3F58] tracking-tight">
            {isUrdu ? "شاہ عالمی ہول سیل کنٹرول پینل" : "Shah Alami Wholesale Operations"}
          </h1>
          <p className="text-xs text-[#7E8299] max-w-xl text-copy-14">
            {isUrdu
              ? "روزانہ تھوک آرڈرز، ملٹی گودام انوینٹری، گاہک ادھار کھاتہ اور ایف بی آر ڈیجیٹل انوائسز کا مرکزی کنٹرول۔"
              : "Unified Business Operating System for high-velocity wholesale trading, multi-godown stock transfers, B2B Khata credit limits, and FBR fiscalization."}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
          <Link
            href={`/${locale}/orders`}
            id="dashboard-new-order-btn"
            className="neu-btn-primary h-10 px-4 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <NavIcon name="ShoppingBag" className="w-4 h-4" />
            <span className="whitespace-nowrap">{isUrdu ? "نیا آرڈر درج کریں" : "New Sales Order"}</span>
          </Link>

          <Link
            href={`/${locale}/inventory`}
            id="dashboard-stock-audit-btn"
            className="neu-btn h-10 px-3.5 rounded-2xl text-xs font-semibold text-[#6C7293] hover:text-[#007BFF] transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            style={{
              boxShadow: "-4px -4px 8px #FFFFFF, 4px 4px 8px #C5C3D8",
            }}
          >
            <NavIcon name="Warehouse" className="w-4 h-4 text-[#007BFF]" />
            <span className="whitespace-nowrap">{isUrdu ? "گودام آڈٹ" : "Stock Audit"}</span>
          </Link>
        </div>
      </div>

      {/* 2. KPI Metrics Grid (Neumorphic Raised Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Today's Sales */}
        <div
          id="kpi-today-sales"
          className="p-5 rounded-2xl bg-[#EDEBF8] flex flex-col justify-between transition-all min-h-[120px]"
          style={{
            boxShadow: "-5px -5px 10px #FFFFFF, 5px 5px 10px #C5C3D8",
          }}
        >
          <div className="flex items-center justify-between text-[#7E8299]">
            <span className="text-label-14 text-[#7E8299]">{isUrdu ? "آج کی تھوک سیلز" : "Today's B2B Sales"}</span>
            <div
              className="size-8 rounded-2xl bg-[#EDEBF8] flex items-center justify-center text-[#007BFF]"
              style={{
                boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
              }}
            >
              <NavIcon name="Coins" className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black font-mono text-[#3A3F58]">PKR 1,480,000</span>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold">
              <span>↑ +14.2%</span>
              <span className="text-[#7E8299] font-normal">{isUrdu ? "گزشتہ روز سے زیادہ" : "vs yesterday volume"}</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Godown Stock */}
        <div
          id="kpi-godown-stock"
          className="p-5 rounded-2xl bg-[#EDEBF8] flex flex-col justify-between transition-all min-h-[120px]"
          style={{
            boxShadow: "-5px -5px 10px #FFFFFF, 5px 5px 10px #C5C3D8",
          }}
        >
          <div className="flex items-center justify-between text-[#7E8299]">
            <span className="text-label-14 text-[#7E8299]">{isUrdu ? "کل گودام اسٹاک" : "Total Godown Stock"}</span>
            <div
              className="size-8 rounded-2xl bg-[#EDEBF8] flex items-center justify-center text-[#007BFF]"
              style={{
                boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
              }}
            >
              <NavIcon name="Warehouse" className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black font-mono text-[#3A3F58]">
              {totalStock.toLocaleString()} Units
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#7E8299]">
              <span className="font-semibold text-[#007BFF]">{godowns.length} Active Godowns</span>
              <span>• 98% in stock</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Khata Receivables */}
        <div
          id="kpi-khata-receivables"
          className="p-5 rounded-2xl bg-[#EDEBF8] flex flex-col justify-between transition-all min-h-[120px]"
          style={{
            boxShadow: "-5px -5px 10px #FFFFFF, 5px 5px 10px #C5C3D8",
          }}
        >
          <div className="flex items-center justify-between text-[#7E8299]">
            <span className="text-label-14 text-[#7E8299]">{isUrdu ? "کھاتہ واجبات (ادھار)" : "Khata Receivables"}</span>
            <div
              className="size-8 rounded-2xl bg-[#EDEBF8] flex items-center justify-center text-rose-500"
              style={{
                boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
              }}
            >
              <NavIcon name="BookOpenCheck" className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black font-mono text-rose-600">PKR 2,840,000</span>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-amber-600 font-medium">
              <span>18 Active Parties</span>
              <span className="text-[#7E8299]">• 2 Over limit</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Low Stock Warnings */}
        <div
          id="kpi-low-stock"
          className="p-5 rounded-2xl bg-[#EDEBF8] flex flex-col justify-between transition-all min-h-[120px]"
          style={{
            boxShadow: "-5px -5px 10px #FFFFFF, 5px 5px 10px #C5C3D8",
          }}
        >
          <div className="flex items-center justify-between text-[#7E8299]">
            <span className="text-label-14 text-[#7E8299]">{isUrdu ? "کم اسٹاک الرٹس" : "Low Stock Warnings"}</span>
            <div
              className="size-8 rounded-2xl bg-[#EDEBF8] flex items-center justify-center text-amber-500"
              style={{
                boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
              }}
            >
              <NavIcon name="AlertTriangle" className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-black font-mono text-amber-600">
              {lowStockCount || 3} SKUs
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#007BFF]">
              <Link href={`/${locale}/inventory`} className="hover:underline font-semibold">
                {isUrdu ? "فوری آرڈر کریں →" : "Re-order inward lots →"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Operations Matrix (2 Columns Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Orders & Dispatch Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent B2B Sales Orders Card */}
          <div
            id="dashboard-recent-orders-card"
            className="p-5 sm:p-6 rounded-2xl bg-[#EDEBF8] space-y-4"
            style={{
              boxShadow: "-6px -6px 14px #FFFFFF, 6px 6px 14px #C5C3D8",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="size-8 rounded-xl bg-[#EDEBF8] flex items-center justify-center text-[#007BFF]"
                  style={{
                    boxShadow: "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8",
                  }}
                >
                  <NavIcon name="ShoppingBag" className="w-4 h-4" />
                </div>
                <h2 className="text-heading-14 text-[#3A3F58]">
                  {isUrdu ? "حالیہ تھوک آرڈرز" : "Recent B2B Wholesale Sales Orders"}
                </h2>
              </div>
              <Link
                href={`/${locale}/orders`}
                className="text-xs text-[#007BFF] hover:underline font-bold"
              >
                {isUrdu ? "تمام آرڈرز →" : "View All Orders →"}
              </Link>
            </div>

            {/* Inset Table Well */}
            <div
              className="rounded-2xl p-2 bg-[#EDEBF8] overflow-x-auto"
              style={{
                boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
              }}
            >
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="text-[#7E8299] text-[11px] font-semibold border-b border-[#C5C3D8]/50">
                    <th className="py-2.5 px-3 text-start">Order #</th>
                    <th className="py-2.5 px-3 text-start">Customer / Party</th>
                    <th className="py-2.5 px-3 text-start">Lots & Items</th>
                    <th className="py-2.5 px-3 text-start">Amount</th>
                    <th className="py-2.5 px-3 text-start">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#C5C3D8]/30">
                  <tr className="hover:bg-[#E2E0EE]/40 transition">
                    <td className="py-3 px-3 font-mono font-bold text-[#007BFF]">ORD-948104</td>
                    <td className="py-3 px-3 font-semibold text-[#3A3F58]">Haji Rafiq & Sons (Shah Alami)</td>
                    <td className="py-3 px-3 text-[#7E8299]">200x Fast Chargers (Lot #CHG-65W)</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#3A3F58]">PKR 72,000</td>
                    <td className="py-3 px-3">
                      <span
                        className="neu-pill-badge bg-[#EDEBF8] text-emerald-600"
                        style={{
                          boxShadow: "inset 1px 1px 3px #C5C3D8, inset -1px -1px 3px #FFFFFF",
                        }}
                      >
                        Dispatched
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#E2E0EE]/40 transition">
                    <td className="py-3 px-3 font-mono font-bold text-[#007BFF]">ORD-948102</td>
                    <td className="py-3 px-3 font-semibold text-[#3A3F58]">Lahore Tech Plaza Distribution</td>
                    <td className="py-3 px-3 text-[#7E8299]">50x OLED Displays</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#3A3F58]">PKR 84,960</td>
                    <td className="py-3 px-3">
                      <span
                        className="neu-pill-badge bg-[#EDEBF8] text-amber-600"
                        style={{
                          boxShadow: "inset 1px 1px 3px #C5C3D8, inset -1px -1px 3px #FFFFFF",
                        }}
                      >
                        Override Pending
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#E2E0EE]/40 transition">
                    <td className="py-3 px-3 font-mono font-bold text-[#007BFF]">ORD-948098</td>
                    <td className="py-3 px-3 font-semibold text-[#3A3F58]">Faisalabad Electronics Retail</td>
                    <td className="py-3 px-3 text-[#7E8299]">500x Type-C Cables</td>
                    <td className="py-3 px-3 font-mono font-bold text-[#3A3F58]">PKR 140,000</td>
                    <td className="py-3 px-3">
                      <span
                        className="neu-pill-badge bg-[#EDEBF8] text-[#007BFF]"
                        style={{
                          boxShadow: "inset 1px 1px 3px #C5C3D8, inset -1px -1px 3px #FFFFFF",
                        }}
                      >
                        Khata Clear
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Godown Stock & Bin Allocation Card */}
          <div
            id="dashboard-godowns-card"
            className="p-5 sm:p-6 rounded-2xl bg-[#EDEBF8] space-y-4"
            style={{
              boxShadow: "-6px -6px 14px #FFFFFF, 6px 6px 14px #C5C3D8",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="size-8 rounded-xl bg-[#EDEBF8] flex items-center justify-center text-[#007BFF]"
                  style={{
                    boxShadow: "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8",
                  }}
                >
                  <NavIcon name="Warehouse" className="w-4 h-4" />
                </div>
                <h2 className="text-heading-14 text-[#3A3F58]">
                  {isUrdu ? "گودام اسٹاک و ریکس کی صورتحال" : "Godown Capacity & Real-Time Bin Status"}
                </h2>
              </div>
              <Link
                href={`/${locale}/inventory`}
                className="text-xs text-[#007BFF] hover:underline font-bold"
              >
                {isUrdu ? "اسٹاک ٹرانسفر →" : "Multi-Godown Transfer →"}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {godowns.map((g: any) => {
                const warehouseStock = (g.bins || []).reduce((sum: number, b: any) => sum + (b.quantity || 0), 0);
                const capacityPercent = Math.min(Math.round((warehouseStock / 2000) * 100) || 75, 100);
                return (
                  <div
                    key={g.id}
                    className="p-4 rounded-2xl bg-[#EDEBF8] space-y-3"
                    style={{
                      boxShadow: "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-[#3A3F58]">{g.name}</h3>
                        <span className="text-[11px] text-[#7E8299]">{g.location || "Shah Alami Gate 2"}</span>
                      </div>
                      <span
                        className="neu-pill-badge bg-[#EDEBF8] text-emerald-600 font-mono"
                        style={{
                          boxShadow: "inset 1px 1px 3px #C5C3D8, inset -1px -1px 3px #FFFFFF",
                        }}
                      >
                        {capacityPercent}% Utilized
                      </span>
                    </div>

                    {/* Progress Bar Track */}
                    <div
                      className="w-full h-2.5 rounded-full p-0.5 bg-[#EDEBF8] overflow-hidden"
                      style={{
                        boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
                      }}
                    >
                      <div
                        className="bg-[#007BFF] h-full rounded-full transition-all duration-300"
                        style={{ width: `${capacityPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#7E8299] pt-1">
                      <span>Bins: {(g.bins || []).length} active</span>
                      <span className="font-mono text-[#3A3F58] font-bold">{warehouseStock.toLocaleString()} Units Stored</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Khata Ledger & Critical Alerts */}
        <div className="space-y-6">
          {/* Critical Low Stock SKUs Card */}
          <div
            id="dashboard-low-stock-card"
            className="p-5 sm:p-6 rounded-2xl bg-[#EDEBF8] space-y-4"
            style={{
              boxShadow: "-6px -6px 14px #FFFFFF, 6px 6px 14px #C5C3D8",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="size-8 rounded-xl bg-[#EDEBF8] flex items-center justify-center text-amber-500"
                  style={{
                    boxShadow: "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8",
                  }}
                >
                  <NavIcon name="AlertTriangle" className="w-4 h-4" />
                </div>
                <h2 className="text-heading-14 text-[#3A3F58]">
                  {isUrdu ? "فوری خریداری (کم اسٹاک)" : "Critical Stock Re-order"}
                </h2>
              </div>
            </div>

            <div className="space-y-3">
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
                    className="p-3.5 rounded-2xl bg-[#EDEBF8] flex items-center justify-between gap-3"
                    style={{
                      boxShadow: "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8",
                    }}
                  >
                    <div>
                      <h4 className="text-xs font-bold text-[#3A3F58]">{isUrdu ? p.nameUr : p.nameEn}</h4>
                      <span className="text-[11px] text-amber-600 font-mono font-bold">
                        Only {p.stockQty} units remaining!
                      </span>
                    </div>
                    <Link
                      href={`/${locale}/sourcing`}
                      className="px-3 py-1.5 rounded-xl bg-[#007BFF] text-white text-[11px] font-bold shrink-0 shadow-sm hover:bg-[#0A84FF] transition cursor-pointer"
                    >
                      {isUrdu ? "لاٹ بنائیں" : "Order PO"}
                    </Link>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Khata Summary Card */}
          <div
            id="dashboard-khata-summary-card"
            className="p-5 sm:p-6 rounded-2xl bg-[#EDEBF8] space-y-4"
            style={{
              boxShadow: "-6px -6px 14px #FFFFFF, 6px 6px 14px #C5C3D8",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="size-8 rounded-xl bg-[#EDEBF8] flex items-center justify-center text-[#007BFF]"
                  style={{
                    boxShadow: "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8",
                  }}
                >
                  <NavIcon name="BookOpenCheck" className="w-4 h-4" />
                </div>
                <h2 className="text-heading-14 text-[#3A3F58]">
                  {isUrdu ? "گاہک کھاتہ و واجبات سمری" : "Khata Receivables Watchlist"}
                </h2>
              </div>
              <Link
                href={`/${locale}/customers`}
                className="text-xs text-[#007BFF] hover:underline font-bold"
              >
                {isUrdu ? "کھاتہ دیکھیں →" : "View Khata →"}
              </Link>
            </div>

            <div className="space-y-3">
              <div
                className="p-3.5 rounded-2xl bg-[#EDEBF8] flex items-center justify-between"
                style={{
                  boxShadow: "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8",
                }}
              >
                <div>
                  <h4 className="text-xs font-bold text-[#3A3F58]">Haji Rafiq & Sons</h4>
                  <span className="text-[10px] text-[#7E8299]">Limit: PKR 250,000</span>
                </div>
                <div className="text-end">
                  <span className="text-xs font-mono font-bold text-emerald-600">PKR 184,000</span>
                  <div className="text-[10px] text-[#7E8299]">73% limit used</div>
                </div>
              </div>

              <div
                className="p-3.5 rounded-2xl bg-[#EDEBF8] flex items-center justify-between"
                style={{
                  boxShadow: "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8",
                }}
              >
                <div>
                  <h4 className="text-xs font-bold text-[#3A3F58]">Lahore Tech Plaza</h4>
                  <span className="text-[10px] text-rose-500 font-bold">EXCEEDED (Limit: 250k)</span>
                </div>
                <div className="text-end">
                  <span className="text-xs font-mono font-bold text-rose-600">PKR 312,000</span>
                  <div className="text-[10px] text-rose-500">Approval Required</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick System Governance & Active Status Tray */}
          <div
            id="dashboard-system-tray"
            className="p-5 rounded-2xl bg-[#EDEBF8] flex items-center justify-between gap-3"
            style={{
              boxShadow: "-5px -5px 10px #FFFFFF, 5px 5px 10px #C5C3D8",
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="size-8 rounded-full bg-[#EDEBF8] flex items-center justify-center text-[#007BFF] font-bold text-xs"
                style={{
                  boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
                }}
              >
                SA
              </div>
              <div className="text-start">
                <p className="text-xs font-extrabold text-[#3A3F58]">Shah Alami Admin</p>
                <p className="text-[10px] text-[#7E8299]">Session: Protected JWT</p>
              </div>
            </div>

            <Link
              href={`/${locale}/settings`}
              className="h-8 px-3.5 rounded-full bg-[#EDEBF8] text-[#007BFF] hover:text-[#0056b3] text-xs font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              style={{
                boxShadow: "-2px -2px 4px #FFFFFF, 2px 2px 4px #C5C3D8",
              }}
            >
              <NavIcon name="Settings" className="w-3.5 h-3.5" />
              <span>{isUrdu ? "سیٹنگز" : "Settings"}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
