/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  const products = await prisma.product.findMany({
    include: {
      category: true,
      inventoryBins: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header Panel */}
      <div className="neu-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-neu-accent-gradient bg-clip-text text-transparent">
            {locale === "ur-PK" ? "تھوک کیٹلاگ" : "Wholesale Product Catalog"}
          </h2>
          <p className="text-neu-muted text-xs sm:text-sm mt-1">
            {locale === "ur-PK"
              ? "شاہ عالمی مارکیٹ کی براہ راست دوہری قیمتیں اور اسٹاک"
              : "Live Shah Alami bulk pricing, margins, and warehouse availability"}
          </p>
        </div>
        <Link
          href={`/${locale}/checkout`}
          className="neu-btn-primary px-5 py-2.5 text-xs font-semibold text-white transition hover:opacity-90 shadow-neu-accent-glow"
        >
          {locale === "ur-PK" ? "کارٹ دیکھیں →" : "View Cart & Order →"}
        </Link>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="neu-card p-12 text-center text-neu-muted text-sm">
          {locale === "ur-PK"
            ? "اس وقت کوئی پراڈکٹ دستیاب نہیں ہے۔ سوررسنگ ہب سے نئی لاٹ شامل کریں۔"
            : "No active products found in catalog. Create or sync batches via the Sourcing Hub."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item: any) => {
            const stockQty = (item.inventoryBins || []).reduce((sum: number, inv: any) => sum + (inv.quantity || 0), 0);
            const margin = Number(item.salePrice || 0) - Number(item.bulkPrice || 0);

            return (
              <div key={item.id} className="neu-card p-5 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neu-pressed text-neu-accent">
                      {item.category ? (locale === "ur-PK" ? item.category.nameUr : item.category.nameEn) : "General"}
                    </span>
                    <span className={`text-xs font-semibold ${stockQty > 0 ? "text-green-400" : "text-rose-500"}`}>
                      {stockQty > 0 ? `${stockQty} In Stock` : "Out of Stock"}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-neu-text">
                    {locale === "ur-PK" ? item.nameUr : item.nameEn}
                  </h3>
                  <p className="text-xs text-neu-muted mt-1 line-clamp-2 font-mono">
                    {item.sku}
                  </p>
                </div>

                <div className="bg-neu-pressed p-3 rounded-xl flex flex-col gap-1.5 shadow-neu-inset">
                  <div className="flex justify-between text-xs">
                    <span className="text-neu-muted">Wholesale Rate:</span>
                    <span className="font-bold text-neu-text">PKR {Number(item.bulkPrice || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-neu-muted">Recommended Retail:</span>
                    <span className="font-semibold text-neu-muted">PKR {Number(item.salePrice || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs pt-1 border-t border-neu-light/20 text-neu-accent font-semibold">
                    <span>Seller Margin:</span>
                    <span>PKR {margin.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  disabled={stockQty <= 0}
                  className="neu-btn-primary w-full py-2 text-xs font-semibold text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {locale === "ur-PK" ? "آرڈر میں شامل کریں" : "Add to Wholesale Basket"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
