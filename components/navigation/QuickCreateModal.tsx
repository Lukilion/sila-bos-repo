"use client";

import React, { useState } from "react";
import { useNavigation } from "./NavigationContext";
import { NavIcon } from "./NavIcon";

export function QuickCreateModal() {
  const {
    activeQuickAction,
    setActiveQuickAction,
    isUrdu,
    showToast,
  } = useNavigation();


  const [customerName, setCustomerName] = useState("Haji Rafiq & Sons");
  const [skuName, setSkuName] = useState("65W GaN Fast Charger");
  const [quantity, setQuantity] = useState("50");
  const [paymentAmount, setPaymentAmount] = useState("25000");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [sourceGodown, setSourceGodown] = useState("Main Godown A");
  const [destGodown, setDestGodown] = useState("Sub-Godown B");

  if (!activeQuickAction) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuickAction(null);
    if (activeQuickAction === "sales_order") {
      showToast(
        isUrdu
          ? `نیا آرڈر (${quantity}x ${skuName}) کامیابی سے بن گیا!`
          : `Bulk Sales Order created: ${quantity}x ${skuName} for ${customerName}!`
      );
    } else if (activeQuickAction === "khata_entry") {
      showToast(
        isUrdu
          ? `کھاتہ انٹری PKR ${Number(paymentAmount).toLocaleString()} موصول کر لی گئی!`
          : `Khata receipt entry of PKR ${Number(paymentAmount).toLocaleString()} posted to ledger!`
      );
    } else if (activeQuickAction === "stock_transfer") {
      showToast(
        isUrdu
          ? `${quantity} یونٹس ${sourceGodown} سے ${destGodown} منتقل ہو گئے!`
          : `Transferred ${quantity} units from ${sourceGodown} to ${destGodown}!`
      );
    } else {
      showToast(
        isUrdu ? "ایکشن مکمل ہو گیا!" : "Action executed successfully!"
      );
    }
  };

  const getTitle = () => {
    switch (activeQuickAction) {
      case "sales_order":
        return { en: "Create Bulk Sales Order", ur: "نیا ہول سیل سیلز آرڈر بنائیں" };
      case "purchase_order":
        return { en: "New Purchase Order (Inward Lot)", ur: "نیا پرچیز آرڈر و لاٹ اندراج" };
      case "khata_entry":
        return { en: "Record Payment / Khata Entry", ur: "کھاتہ ادائیگی و وصولی اندراج" };
      case "stock_transfer":
        return { en: "Multi-Godown Stock Transfer", ur: "گودام در گودام مال کی منتقلی" };
      case "export_bill":
        return { en: "Export FBR CSV Tax Bill", ur: "ایف بی آر ٹیکس بل اور ڈیٹا ڈاؤنلوڈ" };
      default:
        return { en: "Quick Action", ur: "فوری ایکشن" };
    }
  };

  const title = getTitle();

  return (
    <div
      id="quick-action-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={() => setActiveQuickAction(null)}
      role="dialog"
      aria-modal="true"
    >
      <div
        id="quick-action-modal-dialog"
        className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/20 text-[#15a0fa]">
              <NavIcon name="FilePlus" className="w-5 h-5 text-[#15a0fa]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isUrdu ? title.ur : title.en}
              </h3>
              <span className="text-[11px] text-slate-400">
                Shah Alami Wholesale Hub (LHR-SA-01)
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveQuickAction(null)}
            className="p-1.5 rounded-lg text-[#15a0fa] hover:text-white hover:bg-slate-800 transition"
          >
            <NavIcon name="X" className="w-5 h-5 text-[#15a0fa]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          {activeQuickAction === "sales_order" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isUrdu ? "گاہک کا انتخاب" : "Customer / Party"}
                </label>
                <select
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#15a0fa]"
                >
                  <option value="Haji Rafiq & Sons">Haji Rafiq & Sons (Limit: PKR 250,000)</option>
                  <option value="Lahore Tech Plaza">Lahore Tech Plaza (Limit: PKR 250,000)</option>
                  <option value="Faisalabad Wholesalers">Faisalabad Wholesalers (Limit: PKR 500,000)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isUrdu ? "پراڈکٹ / SKU" : "Product / SKU"}
                  </label>
                  <select
                    value={skuName}
                    onChange={(e) => setSkuName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#15a0fa]"
                  >
                    <option value="65W GaN Fast Charger">65W GaN Fast Charger (PKR 1,450)</option>
                    <option value="100W Type-C Cable">100W Type-C Cable (PKR 280)</option>
                    <option value="OLED Display Panel">OLED Display Panel (PKR 14,200)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isUrdu ? "تعداد (کارتن / لاٹ)" : "Quantity (Units)"}
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#15a0fa]"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Wholesale Base Rate:</span>
                  <span className="font-mono">PKR 1,450 / unit</span>
                </div>
                <div className="flex justify-between font-bold text-white pt-1 border-t border-slate-800">
                  <span>Est. Total Order Value:</span>
                  <span className="font-mono text-[#15a0fa]">
                    PKR {(Number(quantity || 0) * 1450).toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          )}

          {activeQuickAction === "khata_entry" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isUrdu ? "گاہک کھاتہ" : "Customer Khata Account"}
                </label>
                <select
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#15a0fa]"
                >
                  <option value="Haji Rafiq & Sons">Haji Rafiq & Sons (Balance: PKR 184,000)</option>
                  <option value="Lahore Tech Plaza">Lahore Tech Plaza (Balance: PKR 312,000)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isUrdu ? "رقم (روپے)" : "Amount (PKR)"}
                  </label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#15a0fa]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isUrdu ? "طریقہ ادائیگی" : "Payment Mode"}
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#15a0fa]"
                  >
                    <option value="Cash">Cash (روکڑ)</option>
                    <option value="Bank Cheque">Bank Cheque (چیک)</option>
                    <option value="Online Transfer">Online Raast / 1Link</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {activeQuickAction === "stock_transfer" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isUrdu ? "مرکزی گودام (منجانب)" : "Source Godown"}
                  </label>
                  <select
                    value={sourceGodown}
                    onChange={(e) => setSourceGodown(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#15a0fa]"
                  >
                    <option value="Main Godown A">Main Godown A (Gate 2)</option>
                    <option value="Sub-Godown B">Sub-Godown B (Rang Mahal)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isUrdu ? "منزل گودام (بنام)" : "Destination Godown"}
                  </label>
                  <select
                    value={destGodown}
                    onChange={(e) => setDestGodown(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#15a0fa]"
                  >
                    <option value="Sub-Godown B">Sub-Godown B (Rang Mahal)</option>
                    <option value="Main Godown A">Main Godown A (Gate 2)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isUrdu ? "تعداد" : "Transfer Quantity (Units)"}
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#15a0fa]"
                />
              </div>
            </>
          )}

          {activeQuickAction === "export_bill" && (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
              <p className="text-slate-300">
                {isUrdu
                  ? "تمام روزانہ ہول سیل انوائسز اور ایف بی آر ٹیکس کٹوتی سمری ڈاؤنلوڈ کے لیے تیار ہے۔"
                  : "All daily sales orders, FBR digital invoice identifiers, and Khata postings will be compiled into CSV format."}
              </p>
              <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-mono">
                <NavIcon name="CheckCircle2" className="w-4 h-4 text-emerald-400" />
                <span>Ready to download 48 records for current active fiscal day.</span>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setActiveQuickAction(null)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              {isUrdu ? "منسوخ کریں" : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#15a0fa] hover:bg-[#0a84ff] text-white shadow-md shadow-[#15a0fa]/30 transition"
            >
              {isUrdu ? "محفوظ کریں" : "Commit Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
