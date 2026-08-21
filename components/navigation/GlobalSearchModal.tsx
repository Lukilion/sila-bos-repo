"use client";

import React, { useState, useMemo } from "react";

import { useRouter } from "next/navigation";
import { useNavigation } from "./NavigationContext";
import { NavIcon } from "./NavIcon";

interface SearchIndexItem {
  id: string;
  category: "sku" | "order" | "customer" | "godown" | "nav";
  title: string;
  subtitle: string;
  badge: string;
  href: string;
  roleRequired?: string;
}

const SEARCH_DATA: SearchIndexItem[] = [
  // SKUs
  {
    id: "sku-1",
    category: "sku",
    title: "65W GaN Dual-Port Fast Charger (Lot #CHG-65W)",
    subtitle: "Stock: 420 units in Main Godown A • Wholesale: PKR 1,450",
    badge: "SKU",
    href: "/catalog",
  },
  {
    id: "sku-2",
    category: "sku",
    title: "Type-C to Type-C 100W Braided Cable (1.5m)",
    subtitle: "Stock: 18 units (LOW STOCK) in Rack-01 • Wholesale: PKR 280",
    badge: "SKU",
    href: "/inventory/tracking",
  },
  {
    id: "sku-3",
    category: "sku",
    title: "OLED Display Assembly Matrix 120Hz (Pack of 5)",
    subtitle: "Stock: 10 units in Godown B • Wholesale: PKR 14,200",
    badge: "SKU",
    href: "/catalog",
  },
  {
    id: "sku-4",
    category: "sku",
    title: "Bluetooth 5.3 ANC True Wireless Earbuds (Lot #TWS-ANC)",
    subtitle: "Stock: 250 units • Wholesale: PKR 2,100",
    badge: "SKU",
    href: "/catalog",
  },

  // Orders
  {
    id: "ord-1",
    category: "order",
    title: "Order #ORD-948104 — Haji Rafiq & Sons",
    subtitle: "200x Fast Chargers • Total: PKR 72,000 • Status: Pending Dispatch",
    badge: "Order",
    href: "/orders/sales",
  },
  {
    id: "ord-2",
    category: "order",
    title: "Order #ORD-948102 — Lahore Tech Plaza Wholesalers",
    subtitle: "50x OLED Displays • Total: PKR 84,960 • Status: Credit Override Pending",
    badge: "Order",
    href: "/orders/sales",
  },
  {
    id: "ord-3",
    category: "order",
    title: "Purchase Order #PO-2026-081 — Shenzhen Direct Logistics",
    subtitle: "Lot #LOT-5001 Inward Shipment • Total: PKR 420,000",
    badge: "PO",
    href: "/orders/purchases",
  },

  // Customers / Khata
  {
    id: "cust-1",
    category: "customer",
    title: "Haji Rafiq & Sons (Shah Alami Gate 3)",
    subtitle: "Khata Balance: PKR 184,000 • Credit Limit: PKR 250,000 • Dual Tier: Gold",
    badge: "Khata",
    href: "/customers/khata",
  },
  {
    id: "cust-2",
    category: "customer",
    title: "Lahore Tech Plaza Distribution Hub",
    subtitle: "Khata Balance: PKR 312,000 (Over Limit) • Credit Limit: PKR 250,000",
    badge: "Khata",
    href: "/customers/khata",
  },
  {
    id: "cust-3",
    category: "customer",
    title: "Faisalabad Electronics Market Retailers",
    subtitle: "Khata Balance: PKR 45,000 • Credit Limit: PKR 500,000 • Dual Tier: VIP",
    badge: "Khata",
    href: "/customers/khata",
  },

  // Godowns
  {
    id: "godown-1",
    category: "godown",
    title: "Main Godown A (Shah Alami Gate 2)",
    subtitle: "Capacity: 85% full • 14,200 total bulk units stored",
    badge: "Godown",
    href: "/inventory",
  },
  {
    id: "godown-2",
    category: "godown",
    title: "Sub-Godown B (Rang Mahal Alley 4)",
    subtitle: "Capacity: 42% full • High-value component vault",
    badge: "Godown",
    href: "/inventory/transfers",
  },

  // Fast Navigation Jump
  {
    id: "nav-1",
    category: "nav",
    title: "Daily Cash Book & Triple-Entry Ledger (روکڑ)",
    subtitle: "Real-time cash in hand, bank transfers, and investor shares",
    badge: "Finance",
    href: "/finance/cashbook",
  },
  {
    id: "nav-2",
    category: "nav",
    title: "FBR Digital Invoicing & POS Transmission",
    subtitle: "Tax invoice generation with QR code and verification",
    badge: "Tax",
    href: "/finance/invoices",
  },
  {
    id: "nav-3",
    category: "nav",
    title: "Market Sourcing & Lot Creation",
    subtitle: "Log inward wholesale shipments and cost allocations",
    badge: "Sourcing",
    href: "/sourcing",
  },
];

export function GlobalSearchModal() {
  const router = useRouter();
  const {
    locale,
    isUrdu,
    isSearchModalOpen,
    setIsSearchModalOpen,
  } = useNavigation();

  const [query, setQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredResults = useMemo(() => {

    return SEARCH_DATA.filter((item) => {
      if (selectedFilter !== "all" && item.category !== selectedFilter) {
        return false;
      }
      if (!query.trim()) return true;
      const lowerQuery = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(lowerQuery) ||
        item.subtitle.toLowerCase().includes(lowerQuery) ||
        item.badge.toLowerCase().includes(lowerQuery)
      );
    });
  }, [query, selectedFilter]);

  const handleSelect = (item: SearchIndexItem) => {
    setIsSearchModalOpen(false);
    router.push(`/${locale}${item.href}`);
  };

  if (!isSearchModalOpen) return null;

  return (
    <div
      id="global-search-modal-backdrop"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={() => setIsSearchModalOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        id="global-search-dialog"
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <NavIcon name="Search" className="w-5 h-5 text-[#15a0fa] shrink-0" />
          <input
            type="text"
            id="global-search-input"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={
              isUrdu
                ? "تلاش کریں: SKU کوڈ، آرڈر نمبر، گاہک کا نام، گودام..."
                : "Type to search SKU, Order #, Customer Khata, Godowns..."
            }
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-slate-500 hover:text-white"
            >
              <NavIcon name="X" className="w-4 h-4 text-[#15a0fa]" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-mono text-[#15a0fa] bg-slate-800 border border-[#15a0fa]/30 rounded">
            ESC
          </kbd>
        </div>

        {/* Filter Categories Chips */}
        <div className="px-3.5 py-2 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs bg-slate-900/90">
          {[
            { id: "all", labelEn: "All Records", labelUr: "تمام ریکارڈز" },
            { id: "sku", labelEn: "Products & SKU", labelUr: "پراڈکٹس و ایس کے یو" },
            { id: "order", labelEn: "B2B Orders", labelUr: "آرڈرز" },
            { id: "customer", labelEn: "Customers & Khata", labelUr: "گاہک و کھاتہ" },
            { id: "godown", labelEn: "Godowns", labelUr: "گودام" },
            { id: "nav", labelEn: "Fast Jump", labelUr: "براہِ راست مینو" },
          ].map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => {
                setSelectedFilter(filter.id);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition shrink-0 ${
                selectedFilter === filter.id
                  ? "bg-[#15a0fa] text-white shadow-sm font-semibold"
                  : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {isUrdu ? filter.labelUr : filter.labelEn}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 divide-y divide-slate-800/60 max-h-96">
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center text-slate-500 space-y-2">
              <NavIcon name="PackageSearch" className="w-8 h-8 mx-auto text-[#15a0fa]/60" />
              <p className="text-xs">
                {isUrdu
                  ? "کوئی نتیجہ نہیں ملا۔ براہ کرم مختلف الفاظ سے تلاش کریں۔"
                  : "No matching records found in Shah Alami database."}
              </p>
            </div>
          ) : (
            filteredResults.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-[#15a0fa]/15 border border-[#15a0fa]/40 text-white"
                      : "hover:bg-slate-800/60 text-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        item.category === "sku"
                          ? "bg-sky-500/20 text-[#15a0fa]"
                          : item.category === "order"
                          ? "bg-[#15a0fa]/20 text-[#15a0fa]"
                          : item.category === "customer"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : item.category === "godown"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-purple-500/20 text-purple-400"
                      }`}
                    >
                      <NavIcon
                        name={
                          item.category === "sku"
                            ? "Box"
                            : item.category === "order"
                            ? "ShoppingBag"
                            : item.category === "customer"
                            ? "BookOpenCheck"
                            : item.category === "godown"
                            ? "Warehouse"
                            : "ArrowUpRight"
                        }
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{item.title}</span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-[#15a0fa] border border-[#15a0fa]/30">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <NavIcon name="ChevronRight" className="w-4 h-4 text-[#15a0fa] shrink-0" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-[#15a0fa] rounded">↵</kbd>
              <span>{isUrdu ? "منتخب کریں" : "Select"}</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-[#15a0fa] rounded">ESC</kbd>
              <span>{isUrdu ? "بند کریں" : "Close"}</span>
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#15a0fa]">Shah Alami Realtime Index</span>
        </div>
      </div>
    </div>
  );
}
