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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-mono font-bold">
              GODOWN OPS
            </span>
            <span className="text-xs text-slate-400">Shah Alami Central Storage</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            {isUrdu ? "انوینٹری و گودام مینیجمنٹ" : "Inventory & Multi-Godown Storage"}
          </h1>
          <p className="text-xs text-slate-400">
            {isUrdu
              ? "اسٹاک لیولز، ریکس ٹریکنگ، بیچ نمبرز اور گودام در گودام منتقلی۔"
              : "Track live stock quantities, bin allocations, batch numbers, and inter-godown transfers."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/sourcing`}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm flex items-center gap-2"
          >
            <NavIcon name="Plus" className="w-4 h-4" />
            <span>{isUrdu ? "نئی مال لاٹ اندراج" : "New Inward Lot"}</span>
          </Link>
          <Link
            href={`/${locale}/admin`}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            {isUrdu ? "گودام سیٹنگز" : "Manage Godowns"}
          </Link>
        </div>
      </div>

      {/* Godowns Capacity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {godowns.map((g: any) => {
          const warehouseStock = (g.bins || []).reduce((sum: number, b: any) => sum + (b.quantity || 0), 0);
          const capacityPercent = Math.min(Math.round((warehouseStock / 2500) * 100) || 70, 100);
          return (
            <div key={g.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <NavIcon name="Warehouse" className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{g.name}</h3>
                    <span className="text-[10px] text-slate-400">{g.location || "Shah Alami"}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  ACTIVE
                </span>
              </div>

              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${capacityPercent}%` }} />
              </div>

              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Utilization: {capacityPercent}%</span>
                <span className="font-mono text-slate-200 font-bold">{warehouseStock.toLocaleString()} Units</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time Inventory Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <NavIcon name="Box" className="w-4 h-4 text-indigo-400" />
            <span>{isUrdu ? "تمام پروڈکٹس و اسٹاک لیول" : "All Products & Real-Time Stock"}</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Total SKUs: {products.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold">
                <th className="py-2.5 px-3 text-start">SKU / Product Name</th>
                <th className="py-2.5 px-3 text-start">Godown & Bin</th>
                <th className="py-2.5 px-3 text-start">Stock Level</th>
                <th className="py-2.5 px-3 text-start">Dual Pricing</th>
                <th className="py-2.5 px-3 text-start">Status</th>
                <th className="py-2.5 px-3 text-end">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {products.map((p: any) => {
                const stockQty = (p.inventoryBins || []).reduce((sum: number, b: any) => sum + (b.quantity || 0), 0);
                const isLow = stockQty < (p.minStockAlert || 30);
                const primaryBin = p.inventoryBins?.[0];
                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-white">{isUrdu ? p.nameUr : p.nameEn}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{p.sku || p.id}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-200">{primaryBin?.warehouse?.name || "Main Godown A"}</div>
                      <div className="text-[10px] text-slate-400">{primaryBin?.binCode || "Zone-A • Bin 01"}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold">
                      <span className={isLow ? "text-amber-400" : "text-emerald-400"}>
                        {stockQty.toLocaleString()} Units
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      <div>Wholesale: PKR {Number(p.bulkPrice || 0).toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500">Retail: PKR {Number(p.salePrice || 0).toLocaleString()}</div>
                    </td>
                    <td className="py-3 px-3">
                      {isLow ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-end">
                      <Link
                        href={`/${locale}/sourcing`}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white text-[11px] font-medium transition"
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
