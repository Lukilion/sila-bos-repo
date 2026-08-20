import { generateFBRInvoicePayload } from "@/lib/fbr";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const invoice = generateFBRInvoicePayload({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    posId: "SHAH-ALAMI-POS-01",
    totalBill: 12500,
  });

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div className="neu-card p-6">
        <h2 className="text-2xl font-bold bg-neu-accent-gradient bg-clip-text text-transparent">
          {locale === "ur-PK" ? "آرڈر تصدیق و انوائس" : "Order Checkout & FBR Invoicing"}
        </h2>
        <p className="text-neu-muted text-xs sm:text-sm mt-1">
          {locale === "ur-PK"
            ? "تھوک آرڈر کی تصدیق اور ڈیجیٹل ٹیکس بل"
            : "Review wholesale orders and generate compliant fiscal invoices."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="neu-card p-6 flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-neu-text mb-3">Order Summary</h3>
            <div className="p-4 bg-neu-pressed rounded-xl shadow-neu-inset flex flex-col gap-2 text-xs">
              <div className="flex justify-between text-neu-muted">
                <span>Subtotal (Net):</span>
                <span>PKR {invoice.taxableAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neu-muted">
                <span>Sales Tax (18% FBR GST):</span>
                <span>PKR {invoice.salesTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-neu-accent font-bold text-sm pt-2 border-t border-neu-light/20">
                <span>Total Payable:</span>
                <span>PKR {invoice.totalBill.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <button className="neu-btn-primary w-full py-2.5 text-xs font-semibold text-white shadow-neu-accent-glow">
            Confirm & Post to Khata
          </button>
        </div>

        <div className="neu-card p-6 flex flex-col gap-3 font-mono text-xs border border-neu-light/20">
          <div className="text-center pb-2 border-b border-neu-light/20">
            <h4 className="font-bold text-sm text-neu-text">FBR DIGITAL TAX INVOICE</h4>
            <span className="text-[10px] text-neu-muted">POS ID: {invoice.posId}</span>
          </div>

          <div className="flex justify-between text-neu-muted text-[11px]">
            <span>Invoice #:</span>
            <span className="text-neu-text">{invoice.invoiceNumber}</span>
          </div>

          <div className="p-3 bg-neu-pressed rounded-lg shadow-neu-inset text-[10px] break-all text-neu-subtle">
            {invoice.qrCodeString}
          </div>

          <div className="text-[10px] text-neu-muted text-center pt-2">
            Verified with Federal Board of Revenue Digital POS
          </div>
        </div>
      </div>
    </div>
  );
}
