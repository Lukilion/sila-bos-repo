/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const [products, warehouses, orders] = await Promise.all([
    prisma.product.findMany({ include: { inventoryBins: true } }),
    prisma.warehouse.findMany({ include: { bins: true } }),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { seller: true } }),
  ]);

  const totalStock = products.reduce(
    (sum: number, p: any) =>
      sum + (p.inventoryBins || []).reduce((iSum: number, inv: any) => iSum + (inv.quantity || 0), 0),
    0
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="neu-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-neu-accent-gradient bg-clip-text text-transparent">
            {locale === "ur-PK" ? "ایڈمن و گودام کنٹرول" : "Operations & Warehouse Admin"}
          </h2>
          <p className="text-neu-muted text-xs sm:text-sm mt-1">
            Godown inventory controls, stock allotments, and daily sales fulfillment
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="neu-card p-5">
          <span className="text-xs text-neu-muted">Managed Godowns</span>
          <p className="text-2xl font-bold text-neu-text mt-1">{warehouses.length}</p>
        </div>
        <div className="neu-card p-5">
          <span className="text-xs text-neu-muted">Total Stock Units</span>
          <p className="text-2xl font-bold text-green-400 mt-1">{totalStock.toLocaleString()}</p>
        </div>
        <div className="neu-card p-5">
          <span className="text-xs text-neu-muted">Active SKUs</span>
          <p className="text-2xl font-bold text-neu-accent mt-1">{products.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="neu-card p-6">
          <h3 className="text-base font-semibold text-neu-text mb-4">Godowns Overview</h3>
          <div className="flex flex-col gap-3">
            {warehouses.map((w: any) => {
              const count = (w.bins || []).reduce((s: number, i: any) => s + (i.quantity || 0), 0);
              return (
                <div key={w.id} className="p-4 bg-neu-pressed rounded-xl shadow-neu-inset flex justify-between items-center">
                  <div>
                    <div className="text-xs font-semibold text-neu-text">{w.name}</div>
                    <div className="text-[11px] text-neu-muted">{w.location}</div>
                  </div>
                  <span className="text-xs font-mono font-bold text-neu-accent">{count} units</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="neu-card p-6">
          <h3 className="text-base font-semibold text-neu-text mb-4">Latest Wholesale Orders</h3>
          {orders.length === 0 ? (
            <div className="p-6 text-center text-xs text-neu-muted bg-neu-pressed rounded-xl shadow-neu-inset">
              No orders placed yet.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map((o: any) => (
                <div key={o.id} className="p-3 bg-neu-pressed rounded-xl shadow-neu-inset flex justify-between items-center text-xs">
                  <div>
                    <div className="font-semibold text-neu-text">{o.seller?.fullName || "Seller"}</div>
                    <div className="text-[10px] text-neu-muted font-mono">ID: {String(o.id).slice(-6)}</div>
                  </div>
                  <div className="text-end">
                    <div className="font-bold text-green-400 font-mono">PKR {Number(o.totalAmount || 0).toLocaleString()}</div>
                    <div className="text-[10px] text-neu-accent">{o.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
