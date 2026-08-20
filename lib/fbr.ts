import crypto from "crypto";

interface FBRInvoiceInput {
  invoiceNumber: string;
  posId: string;
  buyerNTN?: string;
  totalBill: number;
  taxRate?: number;
}

export function generateFBRInvoicePayload({
  invoiceNumber,
  posId,
  buyerNTN = "0000000-0",
  totalBill,
  taxRate = 0.18,
}: FBRInvoiceInput) {
  const taxableAmount = totalBill / (1 + taxRate);
  const salesTax = totalBill - taxableAmount;

  const rawQrString = `FBR:${posId}|INV:${invoiceNumber}|BUYER:${buyerNTN}|TOTAL:${totalBill.toFixed(2)}|TAX:${salesTax.toFixed(2)}`;

  const digitalSignature = crypto
    .createHmac("sha256", process.env.JWT_SECRET || "fbr-secret-salt")
    .update(rawQrString)
    .digest("hex");

  return {
    invoiceNumber,
    posId,
    buyerNTN,
    totalBill: Number(totalBill.toFixed(2)),
    taxableAmount: Number(taxableAmount.toFixed(2)),
    salesTax: Number(salesTax.toFixed(2)),
    taxRatePercentage: taxRate * 100,
    qrCodeString: `${rawQrString}|SIG:${digitalSignature.substring(0, 16)}`,
    digitalSignature,
  };
}
