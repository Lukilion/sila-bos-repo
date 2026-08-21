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
        className="fixed inset-0 bg-[#3A3F58]/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsMobileDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Container: Neumorphic Soft Surface */}
      <div
        className={`relative ${
          isUrdu ? "mr-auto" : "ml-auto"
        } w-full max-w-sm sm:max-w-md bg-[#EDEBF8] h-full flex flex-col transition-all duration-200 z-10 select-none`}
        style={{
          boxShadow: isUrdu
            ? "10px 0 30px #C5C3D8, -5px 0 15px #FFFFFF"
            : "-10px 0 30px #C5C3D8, 5px 0 15px #FFFFFF",
        }}
      >
        {/* Drawer Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl bg-[#EDEBF8] flex items-center justify-center text-[#007BFF] font-extrabold text-sm"
              style={{
                boxShadow: "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8",
              }}
            >
              {NAVIGATION_CONFIG.brand.logoText}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#3A3F58] leading-none">
                {NAVIGATION_CONFIG.brand.name}
              </h3>
              <span className="text-[11px] text-[#007BFF] font-semibold">
                {NAVIGATION_CONFIG.brand.hubCode} • {isUrdu ? "شاہ عالمی ہب" : "Shah Alami Hub"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(false)}
            className="w-9 h-9 rounded-xl bg-[#EDEBF8] text-[#7E8299] hover:text-[#007BFF] flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
            style={{
              boxShadow: "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8",
            }}
            aria-label="Close menu"
          >
            <NavIcon name="X" className="w-4 h-4 text-[#007BFF]" />
          </button>
        </div>

        {/* User Card */}
        <div className="px-4 pb-3">
          <div
            className="p-3.5 rounded-2xl bg-[#EDEBF8] flex flex-col gap-2.5"
            style={{
              boxShadow: "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full bg-[#EDEBF8] text-[#007BFF] font-extrabold flex items-center justify-center text-xs"
                  style={{
                    boxShadow: "-2px -2px 4px #FFFFFF, 2px 2px 4px #C5C3D8",
                  }}
                >
                  {user.avatarText}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#3A3F58]">{user.name}</h4>
                  <p className="text-[10px] text-[#7E8299]">{user.email}</p>
                </div>
              </div>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDEBF8] text-[#007BFF]"
                style={{
                  boxShadow: "-2px -2px 4px #FFFFFF, 2px 2px 4px #C5C3D8",
                }}
              >
                {isUrdu ? ROLE_INFO[activeRole].ur : ROLE_INFO[activeRole].en}
              </span>
            </div>

            {/* Quick Approvals Alert */}
            {pendingApprovalCount > 0 && (
              <div
                className="p-2 rounded-xl bg-[#EDEBF8] flex items-center justify-between text-xs text-amber-700"
                style={{
                  boxShadow: "-2px -2px 4px #FFFFFF, 2px 2px 4px #C5C3D8",
                }}
              >
                <div className="flex items-center gap-2">
                  <NavIcon name="AlertTriangle" className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-semibold text-[11px]">
                    {isUrdu
                      ? `${pendingApprovalCount} منظوری مطلوب ہیں`
                      : `${pendingApprovalCount} Overrides Pending`}
                  </span>
                </div>
                <Link
                  href={`/${locale}/dashboard`}
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="text-[11px] font-bold text-[#007BFF] hover:underline"
                >
                  {isUrdu ? "دیکھیں →" : "Review →"}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 scrollbar-thin">
          {/* Quick Create Actions */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E8299] block mb-2 px-1">
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
                      showToast(
                        isUrdu
                          ? `${action.label.ur} کھول دیا گیا`
                          : `Opened: ${action.label.en}`
                      );
                    }}
                    className="p-2.5 rounded-2xl bg-[#EDEBF8] flex items-center gap-2 text-start transition-all duration-200 cursor-pointer active:scale-95"
                    style={{
                      boxShadow: "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8",
                    }}
                  >
                    <div
                      className="p-1.5 rounded-xl bg-[#EDEBF8] text-[#007BFF]"
                      style={{
                        boxShadow: "inset 1px 1px 3px #C5C3D8, inset -1px -1px 3px #FFFFFF",
                      }}
                    >
                      <NavIcon name={action.icon} className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-[#3A3F58] truncate">
                      {isUrdu ? action.label.ur : action.label.en}
                    </span>
                  </button>
                ))}
            </div>
          </div>

          {/* Module Links */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E8299] block px-1">
              {isUrdu ? "مین مینو" : "Main Navigation"}
            </span>
            {filteredNavItems.map((item) => {
              const active = pathname === `/${locale}${item.href}`;
              const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
              const isExpanded = expandedMenus[item.key];

              return (
                <div key={item.key}>
                  {hasSubItems ? (
                    <div>
                      <button
                        type="button"
                        onClick={() => toggleSubmenu(item.key)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                          active ? "text-[#007BFF] font-bold" : "text-[#7E8299]"
                        }`}
                        style={{
                          boxShadow: active
                            ? "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8"
                            : undefined,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <NavIcon name={item.icon} className="w-4 h-4 text-[#007BFF]" />
                          <span>{isUrdu ? item.label.ur : item.label.en}</span>
                        </div>
                        <NavIcon
                          name="ChevronDown"
                          className={`w-3.5 h-3.5 text-[#7E8299] transition-transform ${
                            isExpanded ? "rotate-180 text-[#007BFF]" : ""
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className={`mt-1 space-y-1 ${isUrdu ? "mr-6" : "ml-6"}`}>
                          {item.subItems?.map((sub) => {
                            const subActive = pathname === `/${locale}${sub.href}`;
                            return (
                              <Link
                                key={sub.key}
                                href={`/${locale}${sub.href}`}
                                onClick={() => setIsMobileDrawerOpen(false)}
                                className={`block px-3 py-2 rounded-xl text-xs transition-all duration-200 ${
                                  subActive
                                    ? "text-[#007BFF] font-bold"
                                    : "text-[#7E8299] hover:text-[#3A3F58]"
                                }`}
                                style={{
                                  boxShadow: subActive
                                    ? "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF"
                                    : undefined,
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
                    <Link
                      href={`/${locale}${item.href}`}
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                        active ? "text-[#007BFF] font-bold" : "text-[#7E8299]"
                      }`}
                      style={{
                        boxShadow: active
                          ? "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8"
                          : undefined,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <NavIcon name={item.icon} className="w-4 h-4 text-[#007BFF]" />
                        <span>{isUrdu ? item.label.ur : item.label.en}</span>
                      </div>
                      {item.badge && (
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#EDEBF8] text-[#007BFF]"
                          style={{
                            boxShadow: "inset 1px 1px 3px #C5C3D8, inset -1px -1px 3px #FFFFFF",
                          }}
                        >
                          {item.badge.text}
                        </span>
                      )}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {/* Role Switcher in Drawer */}
          <div className="pt-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E8299] block mb-2 px-1">
              {isUrdu ? "رول تبدیل کریں" : "Switch Active Role"}
            </span>
            <div
              className="p-1 rounded-2xl bg-[#EDEBF8] flex flex-col gap-1"
              style={{
                boxShadow: "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF",
              }}
            >
              {(["ADMIN", "WAREHOUSE_MANAGER", "SALES_REP", "SUDO"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setActiveRole(r);
                    setIsMobileDrawerOpen(false);
                    showToast(
                      isUrdu
                        ? `رول تبدیل: ${ROLE_INFO[r].ur}`
                        : `Switched role to ${ROLE_INFO[r].en}`
                    );
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    activeRole === r
                      ? "bg-[#EDEBF8] text-[#007BFF] font-bold"
                      : "text-[#7E8299]"
                  }`}
                  style={{
                    boxShadow: activeRole === r
                      ? "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8"
                      : "none",
                  }}
                >
                  <span>{isUrdu ? ROLE_INFO[r].ur : ROLE_INFO[r].en}</span>
                  {activeRole === r && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#007BFF] shadow-[0_0_6px_#007BFF]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer controls: Language toggle & theme */}
        <div className="p-4 flex items-center justify-between gap-3">
          {/* Language Switcher */}
          <div
            className="flex items-center p-1 bg-[#EDEBF8] rounded-full"
            style={{
              boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setLocale("en-US");
              }}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-200 ${
                !isUrdu ? "bg-[#EDEBF8] text-[#007BFF]" : "text-[#7E8299]"
              }`}
              style={{
                boxShadow: !isUrdu ? "-2px -2px 4px #FFFFFF, 2px 2px 4px #C5C3D8" : "none",
              }}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => {
                setLocale("ur-PK");
              }}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-200 ${
                isUrdu ? "bg-[#EDEBF8] text-[#007BFF]" : "text-[#7E8299]"
              }`}
              style={{
                boxShadow: isUrdu ? "-2px -2px 4px #FFFFFF, 2px 2px 4px #C5C3D8" : "none",
              }}
            >
              اردو
            </button>
          </div>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-2xl bg-[#EDEBF8] flex items-center justify-center text-[#007BFF] transition-all duration-200 active:scale-95 cursor-pointer"
            style={{
              boxShadow: "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8",
            }}
            aria-label="Toggle theme"
          >
            <NavIcon name={theme === "dark" ? "Sun" : "Moon"} className="w-4 h-4 text-[#007BFF]" />
          </button>
        </div>
      </div>
    </div>
  );
}
