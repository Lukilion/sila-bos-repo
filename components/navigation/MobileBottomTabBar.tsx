"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigation } from "./NavigationContext";
import { NAVIGATION_CONFIG } from "@/lib/navigation-config";
import { NavIcon } from "./NavIcon";

export function MobileBottomTabBar() {
  const pathname = usePathname();
  const {
    activeRole,
    locale,
    isUrdu,
    toggleMobileDrawer,
    isMobileDrawerOpen,
    unreadNotificationCount,
  } = useNavigation();

  const isTabActive = (itemHref: string) => {
    if (itemHref === "#") return isMobileDrawerOpen;
    const localizedHref = `/${locale}${itemHref}`;
    if (itemHref === "/dashboard") {
      return (pathname === localizedHref || pathname === `/${locale}`) && !isMobileDrawerOpen;
    }
    return pathname.startsWith(localizedHref) && !isMobileDrawerOpen;
  };

  const tabs = NAVIGATION_CONFIG.bottomTabItems.filter((tab) =>
    tab.permittedRoles.includes(activeRole)
  );

  return (
    <nav
      id="mobile-bottom-tab-bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1 shadow-2xl safe-area-pb"
      role="navigation"
      aria-label="Mobile Bottom Tab Bar"
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const active = isTabActive(tab.href);

          if (tab.isMenuTrigger) {
            return (
              <button
                key={tab.key}
                type="button"
                id="mobile-tab-menu-btn"
                onClick={toggleMobileDrawer}
                className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-xl transition relative ${
                  active || isMobileDrawerOpen
                    ? "text-[#15a0fa] font-bold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                aria-label="Toggle navigation drawer"
                aria-expanded={isMobileDrawerOpen}
              >
                <div className="relative">
                  <NavIcon
                    name={isMobileDrawerOpen ? "X" : tab.icon}
                    className={`w-5 h-5 text-[#15a0fa] transition-transform ${
                      isMobileDrawerOpen ? "rotate-90 text-[#15a0fa]" : ""
                    }`}
                  />
                  {unreadNotificationCount > 0 && !isMobileDrawerOpen && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#15a0fa] ring-2 ring-slate-900" />
                  )}
                </div>
                <span className="text-[11px] mt-1 tracking-tight">
                  {isUrdu ? tab.label.ur : tab.label.en}
                </span>
                {(active || isMobileDrawerOpen) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15a0fa] mt-0.5" />
                )}
              </button>
            );
          }

          return (
            <Link
              key={tab.key}
              href={`/${locale}${tab.href}`}
              id={`mobile-tab-${tab.key}`}
              className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[44px] rounded-xl transition relative ${
                active
                  ? "text-[#15a0fa] font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <NavIcon name={tab.icon} className={`w-5 h-5 ${active ? "text-[#15a0fa]" : "text-[#15a0fa]/80"}`} />
              <span className="text-[11px] mt-1 tracking-tight">
                {isUrdu ? tab.label.ur : tab.label.en}
              </span>
              {active && <span className="w-1.5 h-1.5 rounded-full bg-[#15a0fa] mt-0.5" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
