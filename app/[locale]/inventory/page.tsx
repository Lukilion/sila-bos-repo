/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { NavIcon } from "@/components/navigation/NavIcon";

export default async function InventoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isUrdu = locale === "ur-PK";

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
      orderBy: { createdAt: "desc" },
    }),
    prisma.warehouse.findMany({
      include: {
        bins: true,
      },
    }),
  ]);

  return (
    <div className="space-y-6 select-none">
      {/* Header Banner */}
      <div
        id="inventory-header"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#EDEBF8]"
        style={{
          boxShadow: "-8px -8px 18px #FFFFFF, 8px 8px 18px #C5C3D8",
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="neu-pill-badge bg-[#EDEBF8] text-[#007BFF] font-mono">
              GODOWN OPS
            </span>
            <span className="text-label-12 text-[#7E8299]">Shah Alami Central Storage</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#3A3F58] tracking-tight">
            {isUrdu ? "انوینٹری و گودام مینیجمنٹ" : "Inventory & Multi-Godown Storage"}
          </h1>
          <p className="text-xs text-[#7E8299] max-w-xl text-copy-14">
            {isUrdu
              ? "اسٹاک لیولز، ریکس ٹریکنگ، بیچ نمبرز اور گودام در گودام منتقلی۔"
              : "Track live stock quantities, bin allocations, batch numbers, and inter-godown transfers."}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href={`/${locale}/sourcing`}
            className="neu-btn-primary h-10 px-4 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <NavIcon name="Plus" className="w-4 h-4" />
            <span>{isUrdu ? "نئی مال لاٹ اندراج" : "New Inward Lot"}</span>
          </Link>
          <Link
            href={`/${locale}/admin`}
            className="neu-btn h-10 px-3.5 rounded-2xl text-xs font-semibold text-[#6C7293] hover:text-[#007BFF] transition flex items-center gap-2 cursor-pointer active:scale-95"
            style={{
              boxShadow: "-4px -4px 8px #FFFFFF, 4px 4px 8px #C5C3D8",
            }}
          >
            {isUrdu ? "گودام سیٹنگز" : "Manage Godowns"}
          </Link>
        </div>
      </div>

      {/* Godowns Capacity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {godowns.map((g: any) => {
          const warehouseStock = (g.bins || []).reduce((sum: number, b: any) => sum + (b.quantity || 0), 0);
          const capacityPercent = Math.min(Math.round((warehouseStock / 2500) * 100) || 70, 100);
          return (
            <div
              key={g.id}
              className="p-5 rounded-2xl bg-[#EDEBF8] space-y-3.5"
              style={{
                boxShadow: "-5px -5px 10px #FFFFFF, 5px 5px 10px #C5C3D8",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="size-8 rounded-xl bg-[#EDEBF8] flex items-center justify-center text-[#007BFF]"
                    style={{
                      boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
                    }}
                  >
                    <NavIcon name="Warehouse" className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#3A3F58]">{g.name}</h3>
                    <span className="text-[10px] text-[#7E8299]">{g.location || "Shah Alami"}</span>
                  </div>
                </div>
                <span
                  className="neu-pill-badge bg-[#EDEBF8] text-emerald-600 font-mono"
                  style={{
                    boxShadow: "inset 1px 1px 3px #C5C3D8, inset -1px -1px 3px #FFFFFF",
                  }}
                >
                  ACTIVE
                </span>
              </div>

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

              <div className="flex justify-between text-[11px] text-[#7E8299]">
                <span>Utilization: {capacityPercent}%</span>
                <span className="font-mono text-[#3A3F58] font-bold">{warehouseStock.toLocaleString()} Units</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time Inventory Table Card */}
      <div
        id="inventory-table-card"
        className="p-5 sm:p-6 rounded-2xl bg-[#EDEBF8] space-y-4"
        style={{
          boxShadow: "-6px -6px 14px #FFFFFF, 6px 6px 14px #C5C3D8",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-heading-14 text-[#3A3F58] flex items-center gap-2">
            <div
              className="size-8 rounded-xl bg-[#EDEBF8] flex items-center justify-center text-[#007BFF]"
              style={{
                boxShadow: "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8",
              }}
            >
              <NavIcon name="Box" className="w-4 h-4" />
            </div>
            <span>{isUrdu ? "تمام پروڈکٹس و اسٹاک لیول" : "All Products & Real-Time Stock"}</span>
          </h2>
          <span className="text-xs text-[#7E8299] font-mono font-bold">Total SKUs: {products.length}</span>
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
                <th className="py-2.5 px-3 text-start">SKU / Product Name</th>
                <th className="py-2.5 px-3 text-start">Godown & Bin</th>
                <th className="py-2.5 px-3 text-start">Stock Level</th>
                <th className="py-2.5 px-3 text-start">Dual Pricing</th>
                <th className="py-2.5 px-3 text-start">Status</th>
                <th className="py-2.5 px-3 text-end">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C5C3D8]/30">
              {products.map((p: any) => {
                const stockQty = (p.inventoryBins || []).reduce((sum: number, b: any) => sum + (b.quantity || 0), 0);
                const isLow = stockQty < (p.minStockAlert || 30);
                const primaryBin = p.inventoryBins?.[0];
                return (
                  <tr key={p.id} className="hover:bg-[#E2E0EE]/40 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#3A3F58]">{isUrdu ? p.nameUr : p.nameEn}</div>
                      <div className="text-[10px] text-[#7E8299] font-mono">{p.sku || p.id}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-[#6C7293] font-semibold">{primaryBin?.warehouse?.name || "Main Godown A"}</div>
                      <div className="text-[10px] text-[#7E8299]">{primaryBin?.binCode || "Zone-A • Bin 01"}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold">
                      <span className={isLow ? "text-amber-600" : "text-emerald-600"}>
                        {stockQty.toLocaleString()} Units
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[#3A3F58]">
                      <div className="font-semibold">Wholesale: PKR {Number(p.bulkPrice || 0).toLocaleString()}</div>
                      <div className="text-[10px] text-[#7E8299]">Retail: PKR {Number(p.salePrice || 0).toLocaleString()}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`neu-pill-badge bg-[#EDEBF8] ${
                          isLow ? "text-amber-600" : "text-emerald-600"
                        }`}
                        style={{
                          boxShadow: "inset 1px 1px 3px #C5C3D8, inset -1px -1px 3px #FFFFFF",
                        }}
                      >
                        {isLow ? "Low Stock" : "In Stock"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-end">
                      <Link
                        href={`/${locale}/sourcing`}
                        className="px-3 py-1.5 rounded-xl bg-[#EDEBF8] text-[#007BFF] hover:text-[#0A84FF] text-[11px] font-bold transition inline-block cursor-pointer active:scale-95"
                        style={{
                          boxShadow: "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8",
                        }}
                      >
                        {isUrdu ? "مال منگوائیں" : "Re-order"}
                      </Link>
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
