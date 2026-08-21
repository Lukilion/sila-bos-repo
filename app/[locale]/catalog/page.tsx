/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { NavIcon } from "@/components/navigation/NavIcon";

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isUrdu = locale === "ur-PK";
  
  const products = await prisma.product.findMany({
    include: {
      category: true,
      inventoryBins: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 select-none">
      {/* Header Banner */}
      <div
        id="catalog-header"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#EDEBF8]"
        style={{
          boxShadow: "-8px -8px 18px #FFFFFF, 8px 8px 18px #C5C3D8",
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="neu-pill-badge bg-[#EDEBF8] text-[#007BFF] font-mono">
              BULK CATALOG
            </span>
            <span className="text-label-12 text-[#7E8299]">Shah Alami Market Real-Time Rates</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#3A3F58] tracking-tight">
            {isUrdu ? "تھوک پروڈکٹ کیٹلاگ" : "Wholesale Product Catalog"}
          </h1>
          <p className="text-xs text-[#7E8299] max-w-xl text-copy-14">
            {isUrdu
              ? "شاہ عالمی مارکیٹ کی براہ راست دوہری قیمتیں، منافع اور اسٹاک کی دستیابی۔"
              : "Live Shah Alami bulk pricing, wholesale tiers, profit margins, and warehouse availability."}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href={`/${locale}/checkout`}
            className="neu-btn-primary h-10 px-4 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <NavIcon name="ShoppingBag" className="w-4 h-4" />
            <span>{isUrdu ? "کارٹ دیکھیں →" : "View Cart & Order →"}</span>
          </Link>
        </div>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div
          className="p-12 rounded-2xl bg-[#EDEBF8] text-center text-[#7E8299] text-sm"
          style={{
            boxShadow: "-5px -5px 10px #FFFFFF, 5px 5px 10px #C5C3D8",
          }}
        >
          {isUrdu
            ? "اس وقت کوئی پراڈکٹ دستیاب نہیں ہے۔ سورسنگ ہب سے نئی لاٹ شامل کریں۔"
            : "No active products found in catalog. Create or sync batches via the Sourcing Hub."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item: any) => {
            const stockQty = (item.inventoryBins || []).reduce((sum: number, inv: any) => sum + (inv.quantity || 0), 0);
            const margin = Number(item.salePrice || 0) - Number(item.bulkPrice || 0);

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#EDEBF8] flex flex-col justify-between gap-4 transition-all"
                style={{
                  boxShadow: "-5px -5px 10px #FFFFFF, 5px 5px 10px #C5C3D8",
                }}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className="neu-pill-badge bg-[#EDEBF8] text-[#007BFF] font-mono text-[10px]"
                      style={{
                        boxShadow: "inset 1px 1px 3px #C5C3D8, inset -1px -1px 3px #FFFFFF",
                      }}
                    >
                      {item.category ? (isUrdu ? item.category.nameUr : item.category.nameEn) : "General"}
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        stockQty > 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {stockQty > 0 ? `${stockQty} In Stock` : "Out of Stock"}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#3A3F58]">
                    {isUrdu ? item.nameUr : item.nameEn}
                  </h3>
                  <p className="text-xs text-[#7E8299] mt-1 line-clamp-2 font-mono">
                    {item.sku}
                  </p>
                </div>

                {/* Inset Price Well */}
                <div
                  className="p-3.5 rounded-2xl bg-[#EDEBF8] flex flex-col gap-1.5"
                  style={{
                    boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
                  }}
                >
                  <div className="flex justify-between text-xs">
                    <span className="text-[#7E8299]">Wholesale Rate:</span>
                    <span className="font-bold text-[#3A3F58] font-mono">PKR {Number(item.bulkPrice || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-[#7E8299]">Recommended Retail:</span>
                    <span className="font-semibold text-[#7E8299] font-mono">PKR {Number(item.salePrice || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1.5 border-t border-[#C5C3D8]/50 text-[#007BFF] font-bold">
                    <span>Seller Margin:</span>
                    <span className="font-mono">PKR {margin.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={stockQty <= 0}
                  className="neu-btn-primary w-full py-2.5 rounded-2xl text-xs font-bold text-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <NavIcon name="ShoppingBag" className="w-3.5 h-3.5" />
                  <span>{isUrdu ? "آرڈر میں شامل کریں" : "Add to Wholesale Basket"}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
