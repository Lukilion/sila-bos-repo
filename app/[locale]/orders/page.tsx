import React from "react";
import Link from "next/link";
import { NavIcon } from "@/components/navigation/NavIcon";

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isUrdu = locale === "ur-PK";

  const orders = [
    {
      id: "ORD-948104",
      customer: "Haji Rafiq & Sons",
      location: "Shah Alami Gate 3",
      items: "200x Fast Chargers (Lot #CHG-65W)",
      amount: "PKR 72,000",
      status: "Dispatched",
      tier: "Wholesale Tier A",
      date: "Today, 10:30 AM",
      rider: "Suzuki Pickup #LX-482",
    },
    {
      id: "ORD-948102",
      customer: "Lahore Tech Plaza",
      location: "Hall Road, Lahore",
      items: "50x OLED Displays (Lot #OLED-120)",
      amount: "PKR 84,960",
      status: "Approval Pending",
      tier: "Wholesale Tier B",
      date: "Today, 09:15 AM",
      rider: "Pending Override",
    },
    {
      id: "ORD-948098",
      customer: "Faisalabad Electronics",
      location: "Katchery Bazar, FSD",
      items: "500x Type-C Braided Cables",
      amount: "PKR 140,000",
      status: "Delivered",
      tier: "Bulk Tier VIP",
      date: "Yesterday",
      rider: "Daewoo Cargo #DW-901",
    },
    {
      id: "ORD-948095",
      customer: "Rawalpindi Mobile Hub",
      location: "Singapore Plaza, RWP",
      items: "100x TWS ANC Earbuds",
      amount: "PKR 210,000",
      status: "Delivered",
      tier: "Wholesale Tier A",
      date: "Aug 19, 2026",
      rider: "TCS Freight #TC-881",
    },
  ];

  return (
    <div className="space-y-6 select-none">
      {/* Header Banner */}
      <div
        id="orders-header"
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-[#EDEBF8]"
        style={{
          boxShadow: "-8px -8px 18px #FFFFFF, 8px 8px 18px #C5C3D8",
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="neu-pill-badge bg-[#EDEBF8] text-[#007BFF] font-mono">
              B2B DISPATCH & SALES
            </span>
            <span className="text-label-12 text-[#7E8299]">Order Management System</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#3A3F58] tracking-tight">
            {isUrdu ? "تھوک آرڈرز اور ڈسپیچ ٹریکنگ" : "B2B Orders & Fulfillment Tracking"}
          </h1>
          <p className="text-xs text-[#7E8299] max-w-xl text-copy-14">
            {isUrdu
              ? "ہول سیل بلک آرڈرز، ڈیلیوری گاڑیاں اور کسٹم پرائس ٹائرز۔"
              : "Bulk sales orders, dispatch delivery tracking, credit validation, and invoice generation."}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href={`/${locale}/new-order`}
            id="orders-new-order-btn"
            className="neu-btn-primary h-10 px-4 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <NavIcon name="Plus" className="w-4 h-4" />
            <span>{isUrdu ? "نیا آرڈر بنائیں (+ New Order)" : "+ New Order"}</span>
          </Link>
        </div>
      </div>

      {/* Orders Grid Card */}
      <div
        id="orders-table-card"
        className="p-5 sm:p-6 rounded-2xl bg-[#EDEBF8] space-y-4"
        style={{
          boxShadow: "-6px -6px 14px #FFFFFF, 6px 6px 14px #C5C3D8",
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-heading-14 text-[#3A3F58] flex items-center gap-2">
            <div
              className="size-8 rounded-xl bg-[#EDEBF8] flex items-center justify-center text-[#007BFF]"
              style={{
                boxShadow: "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8",
              }}
            >
              <NavIcon name="ShoppingBag" className="w-4 h-4" />
            </div>
            <span>{isUrdu ? "تمام بلک سیلز آرڈرز" : "All Bulk Wholesale Orders"}</span>
          </h2>
          <span className="text-xs text-[#7E8299] font-mono font-bold">4 Orders Active</span>
        </div>

        <div
          className="rounded-2xl p-2 bg-[#EDEBF8] overflow-x-auto"
          style={{
            boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
          }}
        >
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="text-[#7E8299] text-[11px] font-semibold border-b border-[#C5C3D8]/50">
                <th className="py-2.5 px-3 text-start">Order ID</th>
                <th className="py-2.5 px-3 text-start">Customer & Location</th>
                <th className="py-2.5 px-3 text-start">Items & Volume</th>
                <th className="py-2.5 px-3 text-start">Total Amount</th>
                <th className="py-2.5 px-3 text-start">Fleet / Dispatch</th>
                <th className="py-2.5 px-3 text-start">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C5C3D8]/30">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#E2E0EE]/40 transition">
                  <td className="py-3 px-3">
                    <div className="font-mono font-bold text-[#007BFF]">{ord.id}</div>
                    <div className="text-[10px] text-[#7E8299]">{ord.date}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-[#3A3F58]">{ord.customer}</div>
                    <div className="text-[10px] text-[#7E8299]">{ord.location}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-[#6C7293] font-semibold">{ord.items}</div>
                    <div className="text-[10px] text-[#007BFF] font-medium">{ord.tier}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-[#3A3F58]">{ord.amount}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 text-[#6C7293]">
                      <NavIcon name="Truck" className="w-3.5 h-3.5 text-[#7E8299]" />
                      <span>{ord.rider}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`neu-pill-badge bg-[#EDEBF8] ${
                        ord.status === "Delivered"
                          ? "text-emerald-600"
                          : ord.status === "Dispatched"
                          ? "text-[#007BFF]"
                          : "text-amber-600"
                      }`}
                      style={{
                        boxShadow: "inset 1px 1px 3px #C5C3D8, inset -1px -1px 3px #FFFFFF",
                      }}
                    >
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
