import { prisma } from "@/lib/prisma";
import { LedgerType } from "@prisma/client";

const formatLedgerType = (type: LedgerType) =>
  type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

export default async function InvestorKhataPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const transactions = await prisma.transactionLedger.findMany({
    take: 15,
    orderBy: { createdAt: "desc" },
    include: { user: true, order: true },
  });

  const investments = await prisma.investment.findMany({
    where: { active: true },
    include: { investor: true },
  });

  const inflowTypes: LedgerType[] = [LedgerType.INVESTOR_POOL, LedgerType.SELLER_INFLOW];
  const outflowTypes: LedgerType[] = [
    LedgerType.PROCUREMENT_OUTFLOW,
    LedgerType.OPERATIONAL_EXPENSE,
    LedgerType.COMMISSION_PAYOUT,
  ];

  const totalInflows = transactions
    .filter((t) => inflowTypes.includes(t.type))
    .reduce((sum, t) => sum + Number(t.credit), 0);

  const totalOutflows = transactions
    .filter((t) => outflowTypes.includes(t.type))
    .reduce((sum, t) => sum + Number(t.debit), 0);

  const netBalance = totalInflows - totalOutflows;

  return (
    <div className="flex flex-col gap-6">
      <div className="neu-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-neu-accent-gradient bg-clip-text text-transparent">
            {locale === "ur-PK" ? "کھاتہ اور انویسٹر پول" : "Triple-Entry Khata & Investor Pool"}
          </h2>
          <p className="text-neu-muted text-xs sm:text-sm mt-1">
            {locale === "ur-PK"
              ? "شاہ عالمی کاروباری کھاتہ، منافع کی تقسیم اور ڈیجیٹل آڈٹ ٹریل"
              : "Immutable ledger trail, capital pools, and automated dividend distribution."}
          </p>
        </div>
        <div className="px-4 py-2 bg-neu-pressed rounded-xl shadow-neu-inset text-xs">
          <span className="text-neu-muted">Vault Status: </span>
          <span className="text-green-400 font-bold">RECONCILED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="neu-card p-5">
          <span className="text-xs text-neu-muted">Total Inflow Deposits</span>
          <p className="text-2xl font-bold text-green-400 mt-2">PKR {totalInflows.toLocaleString()}</p>
        </div>

        <div className="neu-card p-5">
          <span className="text-xs text-neu-muted">Total Procurement & OpEx Outflow</span>
          <p className="text-2xl font-bold text-rose-400 mt-2">PKR {totalOutflows.toLocaleString()}</p>
        </div>

        <div className="neu-card p-5">
          <span className="text-xs text-neu-muted">Net Vault Balance</span>
          <p className="text-2xl font-bold text-neu-accent mt-2">PKR {netBalance.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="neu-card p-6 lg:col-span-2">
          <h3 className="text-base font-semibold text-neu-text mb-4">
            {locale === "ur-PK" ? "حالیہ کھاتہ اندراجات" : "Recent Ledger Postings"}
          </h3>

          {transactions.length === 0 ? (
            <div className="p-8 text-center text-neu-muted text-xs bg-neu-pressed rounded-xl shadow-neu-inset">
              No transactions recorded in this accounting cycle.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead>
                  <tr className="border-b border-neu-light/20 text-neu-muted">
                    <th className="pb-3 text-start">Type</th>
                    <th className="pb-3 text-start">Details</th>
                    <th className="pb-3 text-end">Debit</th>
                    <th className="pb-3 text-end">Credit</th>
                    <th className="pb-3 text-end">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neu-light/10">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-neu-pressed/40 transition">
                      <td className="py-3 font-semibold text-neu-accent">{formatLedgerType(tx.type)}</td>
                      <td className="py-3 text-neu-muted max-w-xs truncate">
                        {tx.description || tx.order?.orderNumber || tx.user?.fullName || "Ledger entry"}
                      </td>
                      <td className="py-3 text-end text-rose-400 font-mono">
                        {Number(tx.debit) > 0 ? `PKR ${Number(tx.debit).toLocaleString()}` : "—"}
                      </td>
                      <td className="py-3 text-end text-green-400 font-mono">
                        {Number(tx.credit) > 0 ? `PKR ${Number(tx.credit).toLocaleString()}` : "—"}
                      </td>
                      <td className="py-3 text-end font-bold text-neu-text font-mono">
                        PKR {Number(tx.balance).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="neu-card p-6 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-neu-text mb-3">
              {locale === "ur-PK" ? "انویسٹر پارٹنر شپ پول" : "Active Investor Stakes"}
            </h3>
            {investments.length === 0 ? (
              <p className="text-xs text-neu-muted">No investor stakes configured.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {investments.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-3 bg-neu-pressed rounded-xl shadow-neu-inset flex justify-between items-center"
                  >
                    <div>
                      <div className="text-xs font-semibold text-neu-text">{inv.investor.fullName}</div>
                      <div className="text-[10px] text-neu-muted">
                        Capital: PKR {Number(inv.amount).toLocaleString()}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-neu-accent">
                      {Number(inv.profitShare)}% Share
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="neu-btn-primary w-full py-2.5 text-xs font-semibold text-white shadow-neu-accent-glow">
            {locale === "ur-PK" ? "منافع تقسیم کریں" : "Execute Dividend Run"}
          </button>
        </div>
      </div>
    </div>
  );
}
