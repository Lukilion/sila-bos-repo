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
      title: { en: "Main", ur: "مرکزی" },
      items: filteredNavItems.filter((i) => i.section === "core"),
    },
    {
      id: "operations",
      title: { en: "Operations & Godowns", ur: "گودام و آپریشنز" },
      items: filteredNavItems.filter((i) => i.section === "operations"),
    },
    {
      id: "commercial",
      title: { en: "Sales & Khata", ur: "سیلز اور کھاتہ" },
      items: filteredNavItems.filter((i) => i.section === "commercial"),
    },
    {
      id: "financial",
      title: { en: "Finance & Vault", ur: "مالیات و والٹ" },
      items: filteredNavItems.filter((i) => i.section === "financial"),
    },
    {
      id: "system",
      title: { en: "Governance", ur: "سسٹم کنٹرول" },
      items: filteredNavItems.filter((i) => i.section === "system"),
    },
  ].filter((sec) => sec.items.length > 0);

  const isRouteActive = (itemHref: string) => {
    const localizedHref = `/${locale}${itemHref}`;
    if (itemHref === "/dashboard") {
      return pathname === localizedHref || pathname === `/${locale}`;
    }
    return pathname.startsWith(localizedHref);
  };

  return (
    <aside
      id="desktop-sidebar"
      className={`hidden md:flex flex-col shrink-0 bg-slate-900 dark:bg-slate-950 border-r ${
        isUrdu ? "border-l border-r-0" : "border-r"
      } border-slate-800 transition-all duration-300 ease-in-out relative z-20 ${
        isSidebarCollapsed ? "w-20" : "w-64"
      }`}
      aria-label="Sidebar Navigation"
    >
      {/* Scrollable Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-slate-700">
        {sections.map((section) => (
          <div key={section.id} className="space-y-1">
            {/* Section Header */}
            {!isSidebarCollapsed ? (
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
                {isUrdu ? section.title.ur : section.title.en}
              </div>
            ) : (
              <div className="h-px bg-slate-800 my-2 mx-2" />
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
                          onClick={() => toggleSubmenu(item.key)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition group ${
                            active
                              ? "bg-[#15a0fa]/15 text-white border border-[#15a0fa]/30"
                              : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                          }`}
                          aria-expanded={isExpanded}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`p-1.5 rounded-lg transition ${
                                active
                                  ? "bg-[#15a0fa] text-white shadow-sm shadow-[#15a0fa]/30"
                                  : "text-[#15a0fa] group-hover:text-white group-hover:bg-[#15a0fa]"
                              }`}
                            >
                              <NavIcon name={item.icon} className="w-4 h-4" />
                            </div>
                            <span className="truncate">{isUrdu ? item.label.ur : item.label.en}</span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {item.badge && (
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                                  item.badge.variant === "warning"
                                    ? "bg-amber-500/20 text-amber-300"
                                    : item.badge.variant === "danger"
                                    ? "bg-rose-500/20 text-rose-300"
                                    : "bg-sky-500/20 text-[#15a0fa]"
                                }`}
                              >
                                {item.badge.text}
                              </span>
                            )}
                            <NavIcon
                              name="ChevronDown"
                              className={`w-3.5 h-3.5 text-[#15a0fa] transition-transform duration-200 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </button>

                        {/* Sub-menu Items Accordion */}
                        {isExpanded && (
                          <div
                            className={`mt-1 space-y-1 ${
                              isUrdu ? "mr-7 pr-2 border-r" : "ml-7 pl-2 border-l"
                            } border-slate-800`}
                          >
                            {item.subItems?.map((sub) => {
                              const subActive = pathname === `/${locale}${sub.href}`;
                              return (
                                <Link
                                  key={sub.key}
                                  href={`/${locale}${sub.href}`}
                                  className={`block px-3 py-1.5 rounded-lg text-xs transition ${
                                    subActive
                                      ? "bg-[#15a0fa]/20 text-[#15a0fa] font-bold border-l-2 border-[#15a0fa]"
                                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                                  }`}
                                >
                                  {isUrdu ? sub.label.ur : sub.label.en}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Single Nav Link
                      <Link
                        href={`/${locale}${item.href}`}
                        className={`flex items-center ${
                          isSidebarCollapsed ? "justify-center px-2 py-2.5" : "justify-between px-3 py-2"
                        } rounded-xl text-xs font-semibold transition group ${
                          active
                            ? "bg-gradient-to-r from-[#15a0fa] to-indigo-600 text-white shadow-md shadow-[#15a0fa]/25 font-bold"
                            : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                        }`}
                        title={isSidebarCollapsed ? (isUrdu ? item.label.ur : item.label.en) : undefined}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`p-1.5 rounded-lg transition ${
                              active
                                ? "text-white"
                                : "text-[#15a0fa] group-hover:text-white group-hover:bg-[#15a0fa]/20"
                            }`}
                          >
                            <NavIcon name={item.icon} className="w-4 h-4" />
                          </div>
                          {!isSidebarCollapsed && (
                            <span className="truncate">{isUrdu ? item.label.ur : item.label.en}</span>
                          )}
                        </div>

                        {!isSidebarCollapsed && item.badge && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                              active
                                ? "bg-white/20 text-white"
                                : item.badge.variant === "warning"
                                ? "bg-amber-500/20 text-amber-300"
                                : item.badge.variant === "danger"
                                ? "bg-rose-500/20 text-rose-300"
                                : "bg-sky-500/20 text-[#15a0fa]"
                            }`}
                          >
                            {item.badge.text}
                          </span>
                        )}
                      </Link>
                    )}

                    {/* Collapsed Mode Hover Tooltip */}
                    {isSidebarCollapsed && (
                      <div
                        className={`absolute ${
                          isUrdu ? "right-full mr-2" : "left-full ml-2"
                        } top-1/2 -translate-y-1/2 hidden group-hover:flex flex-col bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xl border border-slate-700 whitespace-nowrap z-50 pointer-events-none`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{isUrdu ? item.label.ur : item.label.en}</span>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 rounded bg-[#15a0fa] text-[10px]">
                              {item.badge.text}
                            </span>
                          )}
                        </div>
                        {hasSubItems && (
                          <div className="mt-1 pt-1 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col gap-0.5">
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

      {/* Sidebar Footer Widget */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        {!isSidebarCollapsed ? (
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-bold text-slate-200">
                  {isUrdu ? "شاہ عالمی گودام" : "Shah Alami Hub #01"}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#15a0fa]">v3.4 BOS</span>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
              <span className="text-slate-400">{isUrdu ? "فعال رول:" : "Role:"}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${ROLE_INFO[activeRole].badgeColor}`}>
                {isUrdu ? ROLE_INFO[activeRole].ur : ROLE_INFO[activeRole].en}
              </span>
            </div>

            {pendingApprovalCount > 0 && (
              <div className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-1 rounded flex items-center gap-1.5 border border-amber-500/20">
                <NavIcon name="AlertTriangle" className="w-3 h-3 text-amber-400" />
                <span>
                  {isUrdu
                    ? `${pendingApprovalCount} زیر التوا منظوری`
                    : `${pendingApprovalCount} overrides pending`}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-[#15a0fa] hover:text-white hover:bg-slate-800 transition"
              title="Expand Sidebar"
            >
              <NavIcon name={isUrdu ? "ChevronsLeft" : "ChevronsRight"} className="w-4 h-4 text-[#15a0fa]" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
