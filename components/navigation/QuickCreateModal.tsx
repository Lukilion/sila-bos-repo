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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A3F58]/40 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setActiveQuickAction(null)}
      role="dialog"
      aria-modal="true"
    >
      <div
        id="quick-action-modal-dialog"
        className="w-full max-w-lg bg-[#EDEBF8] rounded-3xl overflow-hidden animate-in zoom-in-95 duration-150 text-[#6C7293]"
        style={{
          boxShadow: "-10px -10px 25px #FFFFFF, 10px 10px 25px #C5C3D8",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-2xl bg-[#EDEBF8] text-[#007BFF]"
              style={{
                boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
              }}
            >
              <NavIcon name="FilePlus" className="w-5 h-5 text-[#007BFF]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#3A3F58]">
                {isUrdu ? title.ur : title.en}
              </h3>
              <span className="text-[11px] text-[#7E8299]">
                Shah Alami Wholesale Hub (LHR-SA-01)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveQuickAction(null)}
            className="w-9 h-9 rounded-xl bg-[#EDEBF8] text-[#7E8299] hover:text-[#007BFF] flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
            style={{
              boxShadow: "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8",
            }}
            aria-label="Close modal"
          >
            <NavIcon name="X" className="w-4 h-4 text-[#007BFF]" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 pt-0 space-y-4">
          {activeQuickAction === "sales_order" && (
            <>
              <div>
                <label className="block text-xs font-bold text-[#3A3F58] mb-1.5">
                  {isUrdu ? "گاہک کا نام / کھاتہ" : "Customer / B2B Account"}
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#EDEBF8] text-xs font-semibold text-[#3A3F58] px-3.5 py-2.5 rounded-2xl focus:outline-none"
                  style={{
                    boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
                  }}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3A3F58] mb-1.5">
                    {isUrdu ? "پراڈکٹ / ایس کے یو" : "SKU Item"}
                  </label>
                  <input
                    type="text"
                    value={skuName}
                    onChange={(e) => setSkuName(e.target.value)}
                    className="w-full bg-[#EDEBF8] text-xs font-semibold text-[#3A3F58] px-3.5 py-2.5 rounded-2xl focus:outline-none"
                    style={{
                      boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3A3F58] mb-1.5">
                    {isUrdu ? "تعداد (تھوک لاٹ)" : "Quantity (Units)"}
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full bg-[#EDEBF8] text-xs font-semibold text-[#3A3F58] px-3.5 py-2.5 rounded-2xl focus:outline-none"
                    style={{
                      boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
                    }}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {activeQuickAction === "khata_entry" && (
            <>
              <div>
                <label className="block text-xs font-bold text-[#3A3F58] mb-1.5">
                  {isUrdu ? "گاہک کا کھاتہ" : "Customer Khata Ledger"}
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#EDEBF8] text-xs font-semibold text-[#3A3F58] px-3.5 py-2.5 rounded-2xl focus:outline-none"
                  style={{
                    boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
                  }}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3A3F58] mb-1.5">
                    {isUrdu ? "رقم (روپے)" : "Payment (PKR)"}
                  </label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full bg-[#EDEBF8] text-xs font-semibold text-[#3A3F58] px-3.5 py-2.5 rounded-2xl focus:outline-none"
                    style={{
                      boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3A3F58] mb-1.5">
                    {isUrdu ? "طریقہ کار" : "Method"}
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-[#EDEBF8] text-xs font-semibold text-[#3A3F58] px-3.5 py-2.5 rounded-2xl focus:outline-none cursor-pointer"
                    style={{
                      boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
                    }}
                  >
                    <option value="Cash">Cash (روکڑ)</option>
                    <option value="Bank Transfer">Bank Transfer (بینک)</option>
                    <option value="Cheque">Cross Cheque (چیک)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {activeQuickAction === "stock_transfer" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3A3F58] mb-1.5">
                    {isUrdu ? "منجانب گودام" : "From Warehouse"}
                  </label>
                  <input
                    type="text"
                    value={sourceGodown}
                    onChange={(e) => setSourceGodown(e.target.value)}
                    className="w-full bg-[#EDEBF8] text-xs font-semibold text-[#3A3F58] px-3.5 py-2.5 rounded-2xl focus:outline-none"
                    style={{
                      boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
                    }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3A3F58] mb-1.5">
                    {isUrdu ? "بنام گودام" : "To Warehouse"}
                  </label>
                  <input
                    type="text"
                    value={destGodown}
                    onChange={(e) => setDestGodown(e.target.value)}
                    className="w-full bg-[#EDEBF8] text-xs font-semibold text-[#3A3F58] px-3.5 py-2.5 rounded-2xl focus:outline-none"
                    style={{
                      boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
                    }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3A3F58] mb-1.5">
                  {isUrdu ? "تعداد یونٹس" : "Transfer Quantity"}
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-[#EDEBF8] text-xs font-semibold text-[#3A3F58] px-3.5 py-2.5 rounded-2xl focus:outline-none"
                  style={{
                    boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
                  }}
                  required
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveQuickAction(null)}
              className="px-4 py-2 text-xs font-bold text-[#7E8299] hover:text-[#3A3F58] bg-[#EDEBF8] rounded-2xl transition-all duration-200 cursor-pointer active:scale-95"
              style={{
                boxShadow: "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8",
              }}
            >
              {isUrdu ? "منسوخ" : "Cancel"}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#007BFF] hover:bg-[#0A84FF] rounded-2xl transition-all duration-200 cursor-pointer active:scale-95"
              style={{
                boxShadow: "-3px -3px 8px #FFFFFF, 3px 3px 8px rgba(0, 123, 255, 0.4)",
              }}
            >
              {isUrdu ? "محفوظ کریں" : "Save Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
