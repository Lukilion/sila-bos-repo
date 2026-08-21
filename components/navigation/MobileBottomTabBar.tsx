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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#EDEBF8] px-3 py-2 safe-area-pb transition-all duration-200 select-none"
      style={{
        boxShadow: "0 -4px 12px #C5C3D8, 0 -2px 6px #FFFFFF",
      }}
      role="navigation"
      aria-label="Mobile Bottom Tab Bar"
    >
      <div className="flex items-center justify-around gap-1">
        {tabs.map((tab) => {
          const active = isTabActive(tab.href);

          if (tab.isMenuTrigger) {
            return (
              <button
                key={tab.key}
                type="button"
                id="mobile-tab-menu-btn"
                onClick={toggleMobileDrawer}
                className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[56px] min-h-[44px] rounded-2xl transition-all duration-200 ease-in-out cursor-pointer active:scale-95 ${
                  active || isMobileDrawerOpen
                    ? "text-[#007BFF] font-bold"
                    : "text-[#7E8299] hover:text-[#6C7293]"
                }`}
                style={{
                  boxShadow: active || isMobileDrawerOpen
                    ? "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF"
                    : undefined,
                }}
                aria-label="Toggle navigation drawer"
                aria-expanded={isMobileDrawerOpen}
              >
                <div className="relative">
                  <NavIcon
                    name={isMobileDrawerOpen ? "X" : tab.icon}
                    className={`w-5 h-5 text-[#007BFF] transition-transform duration-200 ${
                      isMobileDrawerOpen ? "rotate-90" : ""
                    }`}
                  />
                  {unreadNotificationCount > 0 && !isMobileDrawerOpen && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
                  )}
                </div>
                <span className="text-[10px] mt-1 tracking-tight">
                  {isUrdu ? tab.label.ur : tab.label.en}
                </span>
                {(active || isMobileDrawerOpen) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#007BFF] shadow-[0_0_6px_#007BFF] mt-0.5" />
                )}
              </button>
            );
          }

          return (
            <Link
              key={tab.key}
              href={`/${locale}${tab.href}`}
              id={`mobile-tab-${tab.key}`}
              className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[56px] min-h-[44px] rounded-2xl transition-all duration-200 ease-in-out ${
                active
                  ? "text-[#007BFF] font-bold"
                  : "text-[#7E8299] hover:text-[#6C7293]"
              }`}
              style={{
                boxShadow: active
                  ? "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8"
                  : undefined,
              }}
            >
              <NavIcon
                name={tab.icon}
                className={`w-5 h-5 ${active ? "text-[#007BFF]" : "text-[#7E8299]"}`}
              />
              <span className="text-[10px] mt-1 tracking-tight">
                {isUrdu ? tab.label.ur : tab.label.en}
              </span>
              {active && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#007BFF] shadow-[0_0_6px_#007BFF] mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
