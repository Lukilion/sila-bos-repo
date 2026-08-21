/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";

export default async function SourcingHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const warehouses = await prisma.warehouse.findMany();
  const categories = await prisma.category.findMany();

  return (
    <div className="flex flex-col gap-6">
      <div className="neu-card p-6">
        <h2 className="text-2xl font-bold bg-neu-accent-gradient bg-clip-text text-transparent">
          {locale === "ur-PK" ? "سوررسنگ ہب (مارکیٹ مال آمد)" : "Market Sourcing & Inward Batches"}
        </h2>
        <p className="text-neu-muted text-xs sm:text-sm mt-1">
          {locale === "ur-PK"
            ? "شاہ عالمی مارکیٹ سے خریدی گئی نئی لاٹس، گودام اندراج اور ریٹ لسٹ"
            : "Record incoming vendor lots, allocate warehouse godowns, and define dual pricing tiers."}
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entry Form */}
        <div className="neu-card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-neu-text mb-4">
            {locale === "ur-PK" ? "نئی لاٹ اندراج" : "Log Sourcing Lot"}
          </h3>
          <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-neu-muted font-medium mb-1 block">Title (English)</label>
              <input type="text" placeholder="e.g. Type-C Fast Cable" className="neu-input w-full px-4 py-2 text-sm text-neu-text" />
            </div>

            <div>
              <label className="text-xs text-neu-muted font-medium mb-1 block">Title (Urdu)</label>
              <input type="text" placeholder="مثلاً فاسٹ چارجنگ کیبل" className="neu-input w-full px-4 py-2 text-sm text-neu-text" />
            </div>

            <div>
              <label className="text-xs text-neu-muted font-medium mb-1 block">Category</label>
              <select className="neu-input w-full px-4 py-2 text-sm text-neu-text">
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-neu-muted font-medium mb-1 block">Target Godown / Warehouse</label>
              <select className="neu-input w-full px-4 py-2 text-sm text-neu-text">
                {warehouses.map((w: any) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-neu-muted font-medium mb-1 block">Cost Price (Khata Debit)</label>
              <input type="number" placeholder="450" className="neu-input w-full px-4 py-2 text-sm text-neu-text" />
            </div>

            <div>
              <label className="text-xs text-neu-muted font-medium mb-1 block">Wholesale Price (Seller Rate)</label>
              <input type="number" placeholder="550" className="neu-input w-full px-4 py-2 text-sm text-neu-text" />
            </div>

            <div>
              <label className="text-xs text-neu-muted font-medium mb-1 block">Retail Price (MSRP)</label>
              <input type="number" placeholder="750" className="neu-input w-full px-4 py-2 text-sm text-neu-text" />
            </div>

            <div>
              <label className="text-xs text-neu-muted font-medium mb-1 block">Quantity (Cartons/Pieces)</label>
              <input type="number" placeholder="1000" className="neu-input w-full px-4 py-2 text-sm text-neu-text" />
            </div>

            <div className="sm:col-span-2 mt-2">
              <button type="button" className="neu-btn-primary w-full py-2.5 text-sm font-semibold text-white">
                {locale === "ur-PK" ? "لاٹ محفوظ کریں اور کھاتہ اپڈیٹ کریں" : "Commit Batch & Post Ledger Entry"}
              </button>
            </div>
          </form>
        </div>
        {/* Real-time Summary Card */}
        <div className="neu-card p-6 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-neu-text mb-2">Godown Capacities</h3>
            <div className="flex flex-col gap-3">
              {warehouses.map((w: any) => (
                <div key={w.id} className="p-3 bg-neu-pressed rounded-xl shadow-neu-inset">
                  <div className="text-xs font-semibold text-neu-text">{w.name}</div>
                  <div className="text-[11px] text-neu-muted">{w.location}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 rounded-lg border border-neu-accent/30 bg-neu-accent/5 text-[11px] text-neu-muted">
            All purchases automatically debit the Sourcing Outflow sub-ledger.
          </div>
        </div>
      </div>
    </div>
  );
}
