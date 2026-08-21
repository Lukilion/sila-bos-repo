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
    subtitle: "Khata Balance: PKR 45,000 • Credit Limit: PKR 500,000",
    badge: "Khata",
    href: "/customers/khata",
  },

  // Godowns & Transfers
  {
    id: "godown-1",
    category: "godown",
    title: "Shah Alami Main Godown #01 (Basement Hub)",
    subtitle: "Capacity: 84% • Pending Transfers: 3 inward lots",
    badge: "Godown",
    href: "/inventory/transfers",
  },
  {
    id: "godown-2",
    category: "godown",
    title: "Brandreth Road Spillover Godown #03",
    subtitle: "Capacity: 32% • Heavy inventory storage",
    badge: "Godown",
    href: "/inventory/transfers",
  },

  // Quick Navigation
  {
    id: "nav-1",
    category: "nav",
    title: "Daily Cash Book (روکڑ اندراج)",
    subtitle: "Triple-entry verified daily cash transactions",
    badge: "Finance",
    href: "/finance/cashbook",
  },
  {
    id: "nav-2",
    category: "nav",
    title: "FBR Digital Invoices & Sales Tax Reports",
    subtitle: "POS compliant B2B tax invoice generator",
    badge: "Tax",
    href: "/finance/invoices",
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
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-[#3A3F58]/40 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setIsSearchModalOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        id="global-search-dialog"
        className="w-full max-w-2xl bg-[#EDEBF8] rounded-3xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150 text-[#6C7293]"
        style={{
          boxShadow: "-10px -10px 25px #FFFFFF, 10px 10px 25px #C5C3D8",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Channel */}
        <div className="p-4 sm:p-5 flex items-center gap-3">
          <div
            className="w-full flex items-center gap-3 px-4 py-3 bg-[#EDEBF8] rounded-2xl"
            style={{
              boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
            }}
          >
            <NavIcon name="Search" className="w-5 h-5 text-[#007BFF] shrink-0" />
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
              className="w-full bg-transparent text-sm sm:text-base text-[#3A3F58] placeholder-[#7E8299] focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="p-1 rounded-md text-[#7E8299] hover:text-[#007BFF]"
              >
                <NavIcon name="X" className="w-4 h-4 text-[#007BFF]" />
              </button>
            )}
            <kbd
              className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-mono font-bold text-[#007BFF] bg-[#EDEBF8] rounded-lg"
              style={{
                boxShadow: "-2px -2px 4px #FFFFFF, 2px 2px 4px #C5C3D8",
              }}
            >
              ESC
            </kbd>
          </div>
        </div>

        {/* Filter Categories Chips (Tactile Pills) */}
        <div className="px-4 sm:px-5 pb-3 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
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
              className={`px-3 py-1.5 rounded-full font-bold transition-all duration-200 shrink-0 cursor-pointer ${
                selectedFilter === filter.id
                  ? "bg-[#EDEBF8] text-[#007BFF]"
                  : "text-[#7E8299] hover:text-[#3A3F58]"
              }`}
              style={{
                boxShadow: selectedFilter === filter.id
                  ? "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF"
                  : "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8",
              }}
            >
              {isUrdu ? filter.labelUr : filter.labelEn}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-96 scrollbar-thin">
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center text-[#7E8299] space-y-2">
              <NavIcon name="PackageSearch" className="w-8 h-8 mx-auto text-[#007BFF]/60" />
              <p className="text-xs font-medium">
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
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-200 flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-[#EDEBF8] text-[#007BFF] font-bold"
                      : "bg-[#EDEBF8] text-[#6C7293] hover:text-[#007BFF]"
                  }`}
                  style={{
                    boxShadow: isSelected
                      ? "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF"
                      : "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8",
                  }}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className="p-2 rounded-xl bg-[#EDEBF8] text-[#007BFF] shrink-0 mt-0.5"
                      style={{
                        boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
                      }}
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
                        <span className="text-xs font-bold text-[#3A3F58] truncate">{item.title}</span>
                        <span
                          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#EDEBF8] text-[#007BFF]"
                          style={{
                            boxShadow: "inset 1px 1px 2px #C5C3D8, inset -1px -1px 2px #FFFFFF",
                          }}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7E8299] truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <NavIcon name="ChevronRight" className="w-4 h-4 text-[#007BFF] shrink-0" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div
          className="p-4 bg-[#EDEBF8] flex items-center justify-between text-[11px] text-[#7E8299]"
          style={{
            boxShadow: "inset 0 2px 4px #C5C3D8, inset 0 -1px 2px #FFFFFF",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <kbd
                className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#EDEBF8] text-[#007BFF] rounded-md"
                style={{
                  boxShadow: "-1px -1px 3px #FFFFFF, 1px 1px 3px #C5C3D8",
                }}
              >
                ↵
              </kbd>
              <span>{isUrdu ? "منتخب کریں" : "Select"}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd
                className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#EDEBF8] text-[#007BFF] rounded-md"
                style={{
                  boxShadow: "-1px -1px 3px #FFFFFF, 1px 1px 3px #C5C3D8",
                }}
              >
                ESC
              </kbd>
              <span>{isUrdu ? "بند کریں" : "Close"}</span>
            </span>
          </div>
          <span className="font-mono text-[10px] font-bold text-[#007BFF]">
            Shah Alami BOS Search
          </span>
        </div>
      </div>
    </div>
  );
}
