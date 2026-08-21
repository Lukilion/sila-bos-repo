"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigation, ROLE_INFO } from "./NavigationContext";
import { NAVIGATION_CONFIG, filterNavItemsByRole, UserRole } from "@/lib/navigation-config";
import { NavIcon } from "./NavIcon";

export function MobileDrawer() {
  const pathname = usePathname();
  const {
    activeRole,
    setActiveRole,
    locale,
    setLocale,
    isUrdu,
    theme,
    toggleTheme,
    isMobileDrawerOpen,
    setIsMobileDrawerOpen,
    user,
    pendingApprovalCount,
    setActiveQuickAction,
    showToast,
  } = useNavigation();

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
  const targetLocale = isUrdu ? "en-US" : "ur-PK";

  if (!isMobileDrawerOpen) return null;

  return (
    <div
      id="mobile-drawer-root"
      className="md:hidden fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsMobileDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        className={`relative ${
          isUrdu ? "mr-auto" : "ml-auto"
        } w-full max-w-sm sm:max-w-md bg-slate-900 dark:bg-slate-950 h-full flex flex-col shadow-2xl border-l ${
          isUrdu ? "border-r border-l-0" : "border-l"
        } border-slate-800 animate-in slide-in-from-${isUrdu ? "left" : "right"} duration-200 z-10`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#15a0fa] to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#15a0fa]/30">
              {NAVIGATION_CONFIG.brand.logoText}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-none">
                {NAVIGATION_CONFIG.brand.name}
              </h3>
              <span className="text-[11px] text-[#15a0fa] font-mono">
                {NAVIGATION_CONFIG.brand.hubCode} • {isUrdu ? "شاہ عالمی" : "Shah Alami"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(false)}
            className="p-2 rounded-lg text-[#15a0fa] hover:text-white hover:bg-slate-800 transition"
            aria-label="Close menu"
          >
            <NavIcon name="X" className="w-5 h-5 text-[#15a0fa]" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 bg-slate-800/40 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#15a0fa] to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow">
                {user.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{user.name}</h4>
                <p className="text-[11px] text-slate-400">{user.email}</p>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${ROLE_INFO[activeRole].badgeColor}`}>
              {isUrdu ? ROLE_INFO[activeRole].ur : ROLE_INFO[activeRole].en}
            </span>
          </div>

          {/* Quick Approvals Alert Banner */}
          {pendingApprovalCount > 0 && (
            <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-amber-300">
                <NavIcon name="AlertTriangle" className="w-4 h-4 text-amber-400" />
                <span>
                  {isUrdu
                    ? `${pendingApprovalCount} منظوری مطلوب ہیں`
                    : `${pendingApprovalCount} Overrides Pending`}
                </span>
              </div>
              <Link
                href={`/${locale}/dashboard`}
                onClick={() => setIsMobileDrawerOpen(false)}
                className="text-[11px] font-bold text-amber-400 hover:underline"
              >
                {isUrdu ? "دیکھیں →" : "Review →"}
              </Link>
            </div>
          )}
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
          {/* Quick Create Actions grid */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              {isUrdu ? "فوری ایکشنز" : "Quick Actions"}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {NAVIGATION_CONFIG.quickCreateActions
                .filter((a) => a.permittedRoles.includes(activeRole))
                .slice(0, 4)
                .map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      setActiveQuickAction(action.actionKey);
                      showToast(isUrdu ? `${action.label.ur} کھولا گیا` : `Action: ${action.label.en}`);
                    }}
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 hover:bg-[#15a0fa]/20 border border-slate-700/60 text-start text-xs font-semibold text-slate-200 transition"
                  >
                    <NavIcon name={action.icon} className="w-4 h-4 text-[#15a0fa] shrink-0" />
                    <span className="truncate">{isUrdu ? action.label.ur : action.label.en}</span>
                  </button>
                ))}
            </div>
          </div>

          {/* Module Nav Items */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              {isUrdu ? "تمام ماڈیولز" : "All Modules"}
            </span>
            {filteredNavItems.map((item) => {
              const active = pathname.startsWith(`/${locale}${item.href}`);
              const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
              const isExpanded = expandedMenus[item.key];

              return (
                <div key={item.key} className="space-y-1">
                  {hasSubItems ? (
                    <div>
                      <button
                        type="button"
                        onClick={() => toggleSubmenu(item.key)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                          active
                            ? "bg-[#15a0fa]/20 text-[#15a0fa] border border-[#15a0fa]/30"
                            : "text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <NavIcon name={item.icon} className="w-4 h-4 text-[#15a0fa]" />
                          <span>{isUrdu ? item.label.ur : item.label.en}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {item.badge && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-[#15a0fa]">
                              {item.badge.text}
                            </span>
                          )}
                          <NavIcon
                            name="ChevronDown"
                            className={`w-3.5 h-3.5 text-[#15a0fa] transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>

                      {isExpanded && (
                        <div
                          className={`mt-1 space-y-1 ${
                            isUrdu ? "mr-6 pr-2 border-r" : "ml-6 pl-2 border-l"
                          } border-slate-800`}
                        >
                          {item.subItems?.map((sub) => {
                            const subActive = pathname === `/${locale}${sub.href}`;
                            return (
                              <Link
                                key={sub.key}
                                href={`/${locale}${sub.href}`}
                                onClick={() => setIsMobileDrawerOpen(false)}
                                className={`block px-3 py-2 rounded-lg text-xs transition ${
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
                    <Link
                      href={`/${locale}${item.href}`}
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                        active
                          ? "bg-gradient-to-r from-[#15a0fa] to-indigo-600 text-white font-bold shadow-md shadow-[#15a0fa]/30"
                          : "text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <NavIcon name={item.icon} className="w-4 h-4 text-[#15a0fa]" />
                        <span>{isUrdu ? item.label.ur : item.label.en}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-white/20 text-white">
                          {item.badge.text}
                        </span>
                      )}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {/* Role Switcher Matrix for Demo & Testing */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {isUrdu ? "رول بدلیں (RBAC موڈ)" : "Simulate Role (RBAC)"}
            </span>
            <div className="grid grid-cols-1 gap-1">
              {(["ADMIN", "WAREHOUSE_MANAGER", "SALES_REP", "SUDO"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setActiveRole(r);
                    setIsMobileDrawerOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition ${
                    activeRole === r
                      ? "bg-[#15a0fa] text-white font-bold"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <span>{isUrdu ? ROLE_INFO[r].ur : ROLE_INFO[r].en}</span>
                  {activeRole === r && <NavIcon name="Check" className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer Controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-3 pb-12 safe-area-pb">
          <div className="flex items-center justify-between gap-3">
            {/* Language Switch */}
            <button
              type="button"
              onClick={() => {
                setLocale(targetLocale);
                setIsMobileDrawerOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition"
            >
              <span>{isUrdu ? "English Switch" : "اردو زبان"}</span>
            </button>

            {/* Dark / Light Mode Switch */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-amber-400 transition"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <NavIcon name="Sun" className="w-4 h-4 text-amber-400" />
              ) : (
                <NavIcon name="Moon" className="w-4 h-4 text-indigo-400" />
              )}
            </button>
          </div>

          <Link
            href={`/${locale}/login`}
            onClick={() => setIsMobileDrawerOpen(false)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition"
          >
            <NavIcon name="LogOut" className="w-4 h-4" />
            <span>{isUrdu ? "لاگ آؤٹ کریں" : "Sign Out"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
