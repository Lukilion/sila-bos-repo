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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-mono font-bold">
              B2B DISPATCH & SALES
            </span>
            <span className="text-xs text-slate-400">Order Management System</span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            {isUrdu ? "تھوک آرڈرز اور ڈسپیچ ٹریکنگ" : "B2B Orders & Fulfillment Tracking"}
          </h1>
          <p className="text-xs text-slate-400">
            {isUrdu
              ? "ہول سیل بلک آرڈرز، ڈیلیوری گاڑیاں اور کسٹم پرائس ٹائرز۔"
              : "Bulk sales orders, dispatch delivery tracking, credit validation, and invoice generation."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/catalog`}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm flex items-center gap-2"
          >
            <NavIcon name="Plus" className="w-4 h-4" />
            <span>{isUrdu ? "نیا آرڈر بنائیں" : "New Order"}</span>
          </Link>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <NavIcon name="ShoppingBag" className="w-4 h-4 text-indigo-400" />
            <span>{isUrdu ? "تمام بلک سیلز آرڈرز" : "All Bulk Wholesale Orders"}</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">4 Orders Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold">
                <th className="py-2.5 px-3 text-start">Order ID</th>
                <th className="py-2.5 px-3 text-start">Customer & Location</th>
                <th className="py-2.5 px-3 text-start">Items & Volume</th>
                <th className="py-2.5 px-3 text-start">Total Amount</th>
                <th className="py-2.5 px-3 text-start">Fleet / Dispatch</th>
                <th className="py-2.5 px-3 text-start">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3">
                    <div className="font-mono font-bold text-indigo-400">{ord.id}</div>
                    <div className="text-[10px] text-slate-500">{ord.date}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-white">{ord.customer}</div>
                    <div className="text-[10px] text-slate-400">{ord.location}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="text-slate-200">{ord.items}</div>
                    <div className="text-[10px] text-indigo-400 font-medium">{ord.tier}</div>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-white">{ord.amount}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <NavIcon name="Truck" className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ord.rider}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.status === "Delivered"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : ord.status === "Dispatched"
                          ? "bg-indigo-500/20 text-indigo-300"
                          : "bg-amber-500/20 text-amber-300"
                      }`}
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
