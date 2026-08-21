"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigation, ROLE_INFO } from "./NavigationContext";
import { NAVIGATION_CONFIG, NavItem, filterNavItemsByRole } from "@/lib/navigation-config";
import { NavIcon } from "./NavIcon";

export function DesktopSidebar() {
  const pathname = usePathname();
  const {
    activeRole,
    locale,
    isUrdu,
    isSidebarCollapsed,
    toggleSidebar,
    pendingApprovalCount,
  } = useNavigation();

  // Track expanded accordion submenus
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    inventory: true,
    orders: true,
    customers: false,
    finance: false,
  });

  const toggleSubmenu = (key: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filteredNavItems = filterNavItemsByRole(NAVIGATION_CONFIG.navItems, activeRole);

  // Group items by section
  const sections = [
    {
      id: "core",
      title: { en: "Core Modules", ur: "مرکزی ماڈیولز" },
      items: filteredNavItems.filter((i) => i.section === "core"),
    },
    {
      id: "operations",
      title: { en: "Operations & Godowns", ur: "گودام و آپریشنز" },
      items: filteredNavItems.filter((i) => i.section === "operations"),
    },
    {
      id: "commercial",
      title: { en: "B2B Sales & Khata", ur: "سیلز اور کھاتہ" },
      items: filteredNavItems.filter((i) => i.section === "commercial"),
    },
    {
      id: "financial",
      title: { en: "Finance & Cash Flow", ur: "مالیات و کیش فلو" },
      items: filteredNavItems.filter((i) => i.section === "financial"),
    },
    {
      id: "system",
      title: { en: "Governance & Control", ur: "سسٹم کنٹرول" },
      items: filteredNavItems.filter((i) => i.section === "system"),
    },
  ].filter((sec) => sec.items.length > 0);

  const isRouteActive = (itemHref: string) => {
    const localizedHref = `/${locale}${itemHref}`;
    if (itemHref === "/dashboard") {
      return pathname === localizedHref || pathname === `/${locale}` || pathname === `/${locale}/`;
    }
    // Also match /khata to /customers/khata or /customers
    if (itemHref === "/customers" && (pathname.includes("/khata") || pathname.includes("/customers"))) {
      return true;
    }
    return pathname.startsWith(localizedHref);
  };

  return (
    <aside
      id="desktop-tactile-sidebar"
      className={`hidden md:flex flex-col shrink-0 bg-[#EDEBF8] text-[#6C7293] transition-all duration-200 ease-in-out relative z-20 select-none ${
        isSidebarCollapsed ? "w-20" : "w-64"
      }`}
      aria-label="Tactile Sidebar Navigation"
    >
      {/* 1. Sidebar Brand Header: Soft Raised Circular Badge + Wholesale BOS Title */}
      <div className={`p-4 flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"}`}>
        <Link
          href={`/${locale}/dashboard`}
          id="sidebar-brand-badge"
          className="flex items-center gap-3 group focus:outline-none"
        >
          {/* Soft Raised Circular Badge with Brand Logo */}
          <div
            className="w-10 h-10 rounded-full bg-[#EDEBF8] flex items-center justify-center text-[#007BFF] font-bold text-sm transition-all duration-200 ease-in-out group-hover:scale-105"
            style={{
              boxShadow: "-4px -4px 8px #FFFFFF, 4px 4px 8px #C5C3D8",
            }}
          >
            {NAVIGATION_CONFIG.brand.logoText}
          </div>

          {!isSidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-[#3A3F58] group-hover:text-[#007BFF] transition-colors duration-200">
                  {NAVIGATION_CONFIG.brand.name}
                </span>
                <span
                  className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#EDEBF8] text-[#007BFF]"
                  style={{
                    boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
                  }}
                >
                  BOS
                </span>
              </div>
              <span className="text-[11px] text-[#7E8299] truncate">
                {isUrdu ? "تھوک بزنس آپریٹنگ سسٹم" : "Wholesale Operating System"}
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* 2. Main Module Navigation: Tactile Vertical Stack */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-thin scrollbar-thumb-[#C5C3D8]/60">
        {sections.map((section) => (
          <div key={section.id} className="space-y-1.5">
            {/* Section Heading */}
            {!isSidebarCollapsed ? (
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-[#7E8299]/80 select-none">
                {isUrdu ? section.title.ur : section.title.en}
              </div>
            ) : (
              <div className="h-0.5 w-6 mx-auto bg-[#C5C3D8]/40 rounded-full my-2" />
            )}

            {/* Nav Items */}
            <div className="space-y-1">
              {section.items.map((item: NavItem) => {
                const active = isRouteActive(item.href);
                const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
                const isExpanded = expandedMenus[item.key];

                return (
                  <div key={item.key} className="relative group">
                    {hasSubItems && !isSidebarCollapsed ? (
                      // Expandable Parent Item
                      <div>
                        <button
                          type="button"
                          id={`sidebar-nav-${item.key}`}
                          onClick={() => toggleSubmenu(item.key)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ease-in-out cursor-pointer ${
                            active
                              ? "bg-[#EDEBF8] text-[#007BFF] font-bold"
                              : "text-[#7E8299] hover:text-[#6C7293]"
                          }`}
                          style={{
                            boxShadow: active
                              ? "-4px -4px 8px #FFFFFF, 4px 4px 8px #C5C3D8"
                              : undefined,
                          }}
                          onMouseEnter={(e) => {
                            if (!active) {
                              e.currentTarget.style.boxShadow = "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!active) {
                              e.currentTarget.style.boxShadow = "none";
                            }
                          }}
                          aria-expanded={isExpanded}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {/* Active Dot Indicator / Icon */}
                            <div
                              className={`p-1.5 rounded-xl transition-all duration-200 ease-in-out ${
                                active
                                  ? "bg-[#EDEBF8] text-[#007BFF]"
                                  : "text-[#7E8299] group-hover:text-[#007BFF]"
                              }`}
                              style={{
                                boxShadow: active
                                  ? "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF"
                                  : undefined,
                              }}
                            >
                              <NavIcon name={item.icon} className="w-4 h-4" />
                            </div>
                            <span className="truncate">{isUrdu ? item.label.ur : item.label.en}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Active Dot indicator */}
                            {active && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#007BFF] shadow-[0_0_8px_#007BFF]" />
                            )}
                            {item.badge && (
                              <span
                                className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#EDEBF8] text-[#007BFF]"
                                style={{
                                  boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
                                }}
                              >
                                {item.badge.text}
                              </span>
                            )}
                            <NavIcon
                              name="ChevronDown"
                              className={`w-3.5 h-3.5 text-[#7E8299] transition-transform duration-200 ${
                                isExpanded ? "rotate-180 text-[#007BFF]" : ""
                              }`}
                            />
                          </div>
                        </button>

                        {/* Sub-menu Items Accordion */}
                        {isExpanded && (
                          <div
                            className={`mt-1.5 space-y-1 ${
                              isUrdu ? "mr-6 pr-2" : "ml-6 pl-2"
                            }`}
                          >
                            {item.subItems?.map((sub) => {
                              const subActive = pathname === `/${locale}${sub.href}`;
                              return (
                                <Link
                                  key={sub.key}
                                  id={`sidebar-sub-${sub.key}`}
                                  href={`/${locale}${sub.href}`}
                                  className={`block px-3 py-1.5 rounded-xl text-xs transition-all duration-200 ease-in-out ${
                                    subActive
                                      ? "bg-[#EDEBF8] text-[#007BFF] font-bold"
                                      : "text-[#7E8299] hover:text-[#6C7293]"
                                  }`}
                                  style={{
                                    boxShadow: subActive
                                      ? "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF"
                                      : undefined,
                                  }}
                                  onMouseEnter={(e) => {
                                    if (!subActive) {
                                      e.currentTarget.style.boxShadow = "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8";
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!subActive) {
                                      e.currentTarget.style.boxShadow = "none";
                                    }
                                  }}
                                >
                                  {isUrdu ? sub.label.ur : sub.label.en}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Single Nav Link: Inactive (flush), Active (extruded raised pill), Hover (subtle soft elevation)
                      <Link
                        href={`/${locale}${item.href}`}
                        id={`sidebar-nav-${item.key}`}
                        className={`flex items-center ${
                          isSidebarCollapsed ? "justify-center px-2 py-3" : "justify-between px-3 py-2.5"
                        } rounded-2xl text-xs font-semibold transition-all duration-200 ease-in-out cursor-pointer ${
                          active
                            ? "bg-[#EDEBF8] text-[#007BFF] font-bold"
                            : "text-[#7E8299] hover:text-[#6C7293]"
                        }`}
                        style={{
                          boxShadow: active
                            ? "-4px -4px 8px #FFFFFF, 4px 4px 8px #C5C3D8"
                            : undefined,
                        }}
                        onMouseEnter={(e) => {
                          if (!active) {
                            e.currentTarget.style.boxShadow = "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!active) {
                            e.currentTarget.style.boxShadow = "none";
                          }
                        }}
                        title={isSidebarCollapsed ? (isUrdu ? item.label.ur : item.label.en) : undefined}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`p-1.5 rounded-xl transition-all duration-200 ease-in-out ${
                              active
                                ? "text-[#007BFF]"
                                : "text-[#7E8299] group-hover:text-[#007BFF]"
                            }`}
                            style={{
                              boxShadow: active
                                ? "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF"
                                : undefined,
                            }}
                          >
                            <NavIcon name={item.icon} className="w-4 h-4" />
                          </div>
                          {!isSidebarCollapsed && (
                            <span className="truncate">{isUrdu ? item.label.ur : item.label.en}</span>
                          )}
                        </div>

                        {!isSidebarCollapsed && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Active Glow Dot Indicator */}
                            {active && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#007BFF] shadow-[0_0_8px_#007BFF]" />
                            )}
                            {item.badge && (
                              <span
                                className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#EDEBF8] text-[#007BFF]"
                                style={{
                                  boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
                                }}
                              >
                                {item.badge.text}
                              </span>
                            )}
                          </div>
                        )}
                      </Link>
                    )}

                    {/* Collapsed Mode Hover Tooltip (Neumorphic Raised Floating Card) */}
                    {isSidebarCollapsed && (
                      <div
                        className={`absolute ${
                          isUrdu ? "right-full mr-3" : "left-full ml-3"
                        } top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col bg-[#EDEBF8] text-[#3A3F58] text-xs font-semibold px-3.5 py-2.5 rounded-2xl whitespace-nowrap z-50 pointer-events-none transition-all duration-200 ease-in-out`}
                        style={{
                          boxShadow: "-6px -6px 14px #FFFFFF, 6px 6px 14px #C5C3D8",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{isUrdu ? item.label.ur : item.label.en}</span>
                          {item.badge && (
                            <span
                              className="px-1.5 py-0.5 rounded-full bg-[#EDEBF8] text-[10px] text-[#007BFF] font-mono"
                              style={{
                                boxShadow: "inset 1px 1px 3px #C5C3D8, inset -1px -1px 3px #FFFFFF",
                              }}
                            >
                              {item.badge.text}
                            </span>
                          )}
                        </div>
                        {hasSubItems && (
                          <div className="mt-2 pt-1.5 border-t border-[#C5C3D8]/40 text-[11px] text-[#7E8299] flex flex-col gap-1">
                            {item.subItems?.map((s) => (
                              <span key={s.key}>{isUrdu ? s.label.ur : s.label.en}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Footer Section: Settings link + Collapse/Expand Toggle (Recesses Inward When Clicked) */}
      <div className="p-3 bg-[#EDEBF8] flex flex-col gap-2">
        {!isSidebarCollapsed ? (
          <div
            className="p-3 rounded-2xl bg-[#EDEBF8] flex flex-col gap-2.5"
            style={{
              boxShadow: "-3px -3px 8px #FFFFFF, 3px 3px 8px #C5C3D8",
            }}
          >
            {/* Hub info & Settings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                <span className="text-[11px] font-bold text-[#3A3F58]">
                  {isUrdu ? "شاہ عالمی ہب #01" : "Shah Alami Hub #01"}
                </span>
              </div>
              <Link
                href={`/${locale}/settings`}
                id="sidebar-settings-link"
                className="p-1.5 rounded-xl bg-[#EDEBF8] text-[#7E8299] hover:text-[#007BFF] transition-all duration-200 ease-in-out"
                style={{
                  boxShadow: "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8",
                }}
                title="Settings"
              >
                <NavIcon name="Settings" className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Role & Collapse Row */}
            <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#C5C3D8]/40">
              <span className="text-[#7E8299] font-medium">{isUrdu ? "فعال رول:" : "Role:"}</span>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDEBF8] text-[#007BFF]"
                style={{
                  boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
                }}
              >
                {isUrdu ? ROLE_INFO[activeRole].ur : ROLE_INFO[activeRole].en}
              </span>
            </div>

            {pendingApprovalCount > 0 && (
              <div
                className="text-[10px] text-amber-700 bg-[#EDEBF8] px-2.5 py-1.5 rounded-xl flex items-center gap-1.5"
                style={{
                  boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
                }}
              >
                <NavIcon name="AlertTriangle" className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span className="font-semibold truncate">
                  {isUrdu
                    ? `${pendingApprovalCount} زیر التوا منظوری`
                    : `${pendingApprovalCount} approvals pending`}
                </span>
              </div>
            )}

            {/* Collapse Button inside footer */}
            <button
              type="button"
              id="sidebar-collapse-toggle-footer"
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#EDEBF8] text-xs font-semibold text-[#7E8299] hover:text-[#007BFF] transition-all duration-200 ease-in-out cursor-pointer active:scale-98"
              style={{
                boxShadow: isSidebarCollapsed
                  ? "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF"
                  : "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8",
              }}
              aria-label="Collapse Sidebar"
            >
              <NavIcon
                name={isUrdu ? "ChevronsRight" : "ChevronsLeft"}
                className="w-3.5 h-3.5 text-[#007BFF]"
              />
              <span>{isUrdu ? "سائیڈ بار سمیٹیں" : "Collapse Sidebar"}</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Link
              href={`/${locale}/settings`}
              id="sidebar-settings-link-collapsed"
              className="w-10 h-10 rounded-2xl bg-[#EDEBF8] text-[#7E8299] hover:text-[#007BFF] flex items-center justify-center transition-all duration-200 ease-in-out"
              style={{
                boxShadow: "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8",
              }}
              title="Settings"
            >
              <NavIcon name="Settings" className="w-4 h-4" />
            </Link>

            {/* Expand toggle button that recesses inward */}
            <button
              type="button"
              id="sidebar-expand-toggle-collapsed"
              onClick={toggleSidebar}
              className="w-10 h-10 rounded-2xl bg-[#EDEBF8] text-[#007BFF] flex items-center justify-center transition-all duration-200 ease-in-out cursor-pointer active:scale-95"
              style={{
                boxShadow: "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8",
              }}
              title="Expand Sidebar"
              aria-label="Expand Sidebar"
            >
              <NavIcon
                name={isUrdu ? "ChevronsLeft" : "ChevronsRight"}
                className="w-4 h-4 text-[#007BFF]"
              />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
