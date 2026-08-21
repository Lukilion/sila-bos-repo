"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useNavigation, ROLE_INFO } from "./NavigationContext";
import { NAVIGATION_CONFIG, UserRole } from "@/lib/navigation-config";
import { NavIcon } from "./NavIcon";

export function TopGlobalHeader() {
  const {
    activeRole,
    setActiveRole,
    locale,
    setLocale,
    isUrdu,
    theme,
    toggleTheme,
    isSidebarCollapsed,
    toggleSidebar,
    toggleMobileDrawer,
    setIsSearchModalOpen,
    isQuickCreateOpen,
    setIsQuickCreateOpen,
    isNotificationsOpen,
    setIsNotificationsOpen,
    isProfileMenuOpen,
    setIsProfileMenuOpen,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    approvals,
    pendingApprovalCount,
    handleApprove,
    handleDismissApproval,
    user,
    closeAllDropdowns,
    setActiveQuickAction,
    showToast,
  } = useNavigation();

  const [activeNotifTab, setActiveNotifTab] = useState<"notifs" | "approvals">("notifs");

  const quickCreateRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        isQuickCreateOpen &&
        quickCreateRef.current &&
        !quickCreateRef.current.contains(target)
      ) {
        setIsQuickCreateOpen(false);
      }
      if (
        isNotificationsOpen &&
        notifRef.current &&
        !notifRef.current.contains(target)
      ) {
        setIsNotificationsOpen(false);
      }
      if (
        isProfileMenuOpen &&
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    isQuickCreateOpen,
    isNotificationsOpen,
    isProfileMenuOpen,
    setIsQuickCreateOpen,
    setIsNotificationsOpen,
    setIsProfileMenuOpen,
  ]);

  return (
    <header
      id="top-tactile-header"
      className="sticky top-0 z-30 w-full bg-[#EDEBF8] px-3 sm:px-6 py-2.5 text-[#6C7293] transition-all duration-200 ease-in-out select-none"
      role="banner"
    >
      <div className="flex items-center justify-between gap-3 sm:gap-6 max-w-full">
        {/* Left Section: Mobile Drawer Trigger & Brand Indicator */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Hamburger Trigger: Soft Raised Button */}
          <button
            type="button"
            id="mobile-drawer-toggle-btn"
            onClick={toggleMobileDrawer}
            className="md:hidden w-10 h-10 rounded-2xl bg-[#EDEBF8] flex items-center justify-center text-[#007BFF] transition-all duration-200 ease-in-out active:scale-95 cursor-pointer"
            style={{
              boxShadow: "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8",
            }}
            aria-label="Open mobile menu drawer"
          >
            <NavIcon name="Menu" className="w-5 h-5 text-[#007BFF]" />
          </button>

          {/* Collapsed Mode Sidebar Toggle (Desktop) */}
          <button
            type="button"
            id="header-sidebar-collapse-btn"
            onClick={toggleSidebar}
            className="hidden md:flex w-10 h-10 rounded-2xl bg-[#EDEBF8] items-center justify-center text-[#7E8299] hover:text-[#007BFF] transition-all duration-200 ease-in-out cursor-pointer active:scale-95"
            style={{
              boxShadow: isSidebarCollapsed
                ? "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF"
                : "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8",
            }}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <NavIcon
              name={
                isSidebarCollapsed
                  ? isUrdu
                    ? "ChevronsLeft"
                    : "ChevronsRight"
                  : isUrdu
                  ? "ChevronsRight"
                  : "ChevronsLeft"
              }
              className="w-4 h-4 text-[#007BFF]"
            />
          </button>

          {/* Mobile/Compact Brand Logo */}
          <Link
            href={`/${locale}/dashboard`}
            id="header-brand-logo"
            className="md:hidden flex items-center gap-2 group"
          >
            <div
              className="w-9 h-9 rounded-2xl bg-[#EDEBF8] flex items-center justify-center text-[#007BFF] font-extrabold text-sm"
              style={{
                boxShadow: "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8",
              }}
            >
              {NAVIGATION_CONFIG.brand.logoText}
            </div>
            <span className="font-extrabold text-sm tracking-tight text-[#3A3F58]">
              {NAVIGATION_CONFIG.brand.name}
            </span>
          </Link>
        </div>

        {/* Center/Left: Recessed Search Channel with Cmd + K Shortcut */}
        <div className="flex-1 max-w-xl mx-2 hidden sm:block">
          <button
            type="button"
            id="global-search-trigger"
            onClick={() => setIsSearchModalOpen(true)}
            className="w-full flex items-center justify-between px-4 py-2 text-xs text-[#7E8299] hover:text-[#6C7293] bg-[#EDEBF8] rounded-2xl transition-all duration-200 ease-in-out cursor-pointer group"
            style={{
              boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
            }}
            aria-label="Global search across SKU, orders, and customer khata"
          >
            <div className="flex items-center gap-2.5">
              <NavIcon
                name="Search"
                className="w-4 h-4 text-[#007BFF] group-hover:scale-110 transition-transform duration-200"
              />
              <span className="text-xs font-medium text-[#7E8299] group-hover:text-[#6C7293]">
                {isUrdu
                  ? "تلاش کریں (SKU، آرڈر نمبر، گاہک کھاتہ)..."
                  : "Search SKU, Order #, Customer Khata..."}
              </span>
            </div>
            <kbd
              className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold text-[#007BFF] bg-[#EDEBF8] rounded-lg"
              style={{
                boxShadow: "-2px -2px 4px #FFFFFF, 2px 2px 4px #C5C3D8",
              }}
            >
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right Utility Cluster */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Search Trigger Icon */}
          <button
            type="button"
            id="mobile-search-btn"
            onClick={() => setIsSearchModalOpen(true)}
            className="sm:hidden w-10 h-10 rounded-2xl bg-[#EDEBF8] flex items-center justify-center text-[#007BFF] transition-all duration-200 ease-in-out active:scale-95 cursor-pointer"
            style={{
              boxShadow: "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8",
            }}
            aria-label="Search"
          >
            <NavIcon name="Search" className="w-4 h-4 text-[#007BFF]" />
          </button>

          {/* 1. Quick Create Button: Raised button '+ Create' with dropdown support */}
          <div className="relative" ref={quickCreateRef}>
            <button
              type="button"
              id="quick-create-dropdown-btn"
              onClick={() => {
                closeAllDropdowns();
                setIsQuickCreateOpen(!isQuickCreateOpen);
              }}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs font-bold text-[#007BFF] bg-[#EDEBF8] rounded-2xl transition-all duration-200 ease-in-out cursor-pointer active:scale-95"
              style={{
                boxShadow: isQuickCreateOpen
                  ? "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF"
                  : "-4px -4px 8px #FFFFFF, 4px 4px 8px #C5C3D8",
              }}
              aria-expanded={isQuickCreateOpen}
              aria-haspopup="true"
              aria-label="Quick create new record"
            >
              <NavIcon name="Plus" className="w-4 h-4 text-[#007BFF]" />
              <span className="hidden sm:inline">
                {isUrdu ? "نیا اندراج" : "+ Create"}
              </span>
              <NavIcon
                name="ChevronDown"
                className={`w-3 h-3 text-[#007BFF] transition-transform duration-200 ${
                  isQuickCreateOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Quick Create Dropdown: Neumorphic Raised Card */}
            {isQuickCreateOpen && (
              <div
                id="quick-create-menu"
                className={`absolute ${
                  isUrdu ? "left-0" : "right-0"
                } mt-3 w-72 sm:w-80 bg-[#EDEBF8] rounded-2xl z-50 p-3 animate-in fade-in zoom-in-95 duration-150`}
                style={{
                  boxShadow: "-8px -8px 18px #FFFFFF, 8px 8px 18px #C5C3D8",
                }}
              >
                <div className="px-3 py-2 flex items-center justify-between border-b border-[#C5C3D8]/40">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7E8299]">
                    {isUrdu ? "فوری ایکشنز" : "Quick Actions"}
                  </span>
                  <span
                    className="text-[10px] text-[#007BFF] font-mono font-bold px-2 py-0.5 rounded-full bg-[#EDEBF8]"
                    style={{
                      boxShadow: "inset 1px 1px 3px #C5C3D8, inset -1px -1px 3px #FFFFFF",
                    }}
                  >
                    Wholesale BOS
                  </span>
                </div>
                <div className="py-2 flex flex-col gap-1.5">
                  {NAVIGATION_CONFIG.quickCreateActions
                    .filter((action) => action.permittedRoles.includes(activeRole))
                    .map((action) => (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => {
                          setIsQuickCreateOpen(false);
                          setActiveQuickAction(action.actionKey);
                          showToast(
                            isUrdu
                              ? `${action.label.ur} کھول دیا گیا`
                              : `Triggered: ${action.label.en}`
                          );
                        }}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl text-start bg-[#EDEBF8] hover:text-[#007BFF] transition-all duration-200 ease-in-out cursor-pointer group"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <div
                          className="p-2 rounded-xl bg-[#EDEBF8] text-[#007BFF] transition-all duration-200 shrink-0 mt-0.5"
                          style={{
                            boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
                          }}
                        >
                          <NavIcon name={action.icon} className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#3A3F58] group-hover:text-[#007BFF]">
                              {isUrdu ? action.label.ur : action.label.en}
                            </span>
                            <kbd
                              className="text-[10px] font-mono text-[#7E8299] bg-[#EDEBF8] px-1.5 py-0.5 rounded-md"
                              style={{
                                boxShadow: "inset 1px 1px 2px #C5C3D8, inset -1px -1px 2px #FFFFFF",
                              }}
                            >
                              {action.shortcut}
                            </kbd>
                          </div>
                          <p className="text-[11px] text-[#7E8299] truncate mt-0.5">
                            {isUrdu ? action.description.ur : action.description.en}
                          </p>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Language Switcher: Inset pill track with raised toggle switch for [ EN | اردو ] */}
          <div
            className="flex items-center p-1 bg-[#EDEBF8] rounded-full"
            style={{
              boxShadow: "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF",
            }}
          >
            <button
              type="button"
              id="lang-toggle-en"
              onClick={() => {
                if (isUrdu) setLocale("en-US");
              }}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all duration-200 ease-in-out cursor-pointer ${
                !isUrdu
                  ? "bg-[#EDEBF8] text-[#007BFF]"
                  : "text-[#7E8299] hover:text-[#6C7293]"
              }`}
              style={{
                boxShadow: !isUrdu
                  ? "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8"
                  : "none",
              }}
              aria-label="Switch to English"
            >
              EN
            </button>
            <button
              type="button"
              id="lang-toggle-ur"
              onClick={() => {
                if (!isUrdu) setLocale("ur-PK");
              }}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all duration-200 ease-in-out cursor-pointer ${
                isUrdu
                  ? "bg-[#EDEBF8] text-[#007BFF]"
                  : "text-[#7E8299] hover:text-[#6C7293]"
              }`}
              style={{
                boxShadow: isUrdu
                  ? "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8"
                  : "none",
              }}
              aria-label="اردو میں تبدیل کریں"
            >
              اردو
            </button>
          </div>

          {/* 3. Alert / Notifications: Circular raised button with active red/blue dot indicator that depresses on click */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              id="notifications-btn"
              onClick={() => {
                closeAllDropdowns();
                setIsNotificationsOpen(!isNotificationsOpen);
              }}
              className="relative w-10 h-10 rounded-full bg-[#EDEBF8] flex items-center justify-center text-[#7E8299] hover:text-[#007BFF] transition-all duration-200 ease-in-out cursor-pointer active:scale-95"
              style={{
                boxShadow: isNotificationsOpen
                  ? "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF"
                  : "-4px -4px 8px #FFFFFF, 4px 4px 8px #C5C3D8",
              }}
              aria-label="System notifications and alerts"
              aria-expanded={isNotificationsOpen}
            >
              <NavIcon name="Bell" className="w-4 h-4 text-[#007BFF]" />
              {(unreadNotificationCount > 0 || pendingApprovalCount > 0) && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e] animate-pulse" />
              )}
            </button>

            {/* Notifications Dropdown: Neumorphic Raised Floating Card */}
            {isNotificationsOpen && (
              <div
                id="notifications-menu"
                className={`absolute ${
                  isUrdu ? "left-0" : "right-0"
                } mt-3 w-80 sm:w-96 bg-[#EDEBF8] rounded-2xl z-50 p-3.5 animate-in fade-in zoom-in-95 duration-150`}
                style={{
                  boxShadow: "-8px -8px 18px #FFFFFF, 8px 8px 18px #C5C3D8",
                }}
              >
                {/* Header & Tabs */}
                <div className="flex items-center justify-between pb-2.5 border-b border-[#C5C3D8]/40">
                  <div
                    className="flex items-center p-1 rounded-full bg-[#EDEBF8]"
                    style={{
                      boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveNotifTab("notifs")}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
                        activeNotifTab === "notifs"
                          ? "bg-[#EDEBF8] text-[#007BFF]"
                          : "text-[#7E8299]"
                      }`}
                      style={{
                        boxShadow: activeNotifTab === "notifs"
                          ? "-2px -2px 4px #FFFFFF, 2px 2px 4px #C5C3D8"
                          : "none",
                      }}
                    >
                      {isUrdu ? "اطلاعات" : "Alerts"} ({notifications.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveNotifTab("approvals")}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
                        activeNotifTab === "approvals"
                          ? "bg-[#EDEBF8] text-[#007BFF]"
                          : "text-[#7E8299]"
                      }`}
                      style={{
                        boxShadow: activeNotifTab === "approvals"
                          ? "-2px -2px 4px #FFFFFF, 2px 2px 4px #C5C3D8"
                          : "none",
                      }}
                    >
                      {isUrdu ? "منظوریاں" : "Approvals"} ({approvals.length})
                    </button>
                  </div>

                  {activeNotifTab === "notifs" && unreadNotificationCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] font-semibold text-[#007BFF] hover:underline cursor-pointer"
                    >
                      {isUrdu ? "سب پڑھ لیں" : "Mark read"}
                    </button>
                  )}
                </div>

                {/* Notifications Tab Content */}
                {activeNotifTab === "notifs" ? (
                  <div className="max-h-72 overflow-y-auto py-2 space-y-2 scrollbar-thin">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-[#7E8299]">
                        {isUrdu ? "کوئی نئی اطلاع نہیں" : "No new notifications"}
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={`p-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                            !notif.read ? "bg-[#EDEBF8]" : "bg-[#EDEBF8]/60"
                          }`}
                          style={{
                            boxShadow: !notif.read
                              ? "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8"
                              : "inset 1px 1px 3px #C5C3D8, inset -1px -1px 3px #FFFFFF",
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[#3A3F58]">
                              {isUrdu ? notif.title.ur : notif.title.en}
                            </span>
                            <span className="text-[10px] text-[#7E8299]">{notif.time}</span>
                          </div>
                          <p className="text-[11px] text-[#7E8299] mt-0.5 line-clamp-2">
                            {isUrdu ? notif.message.ur : notif.message.en}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  // Approvals Tab Content
                  <div className="max-h-72 overflow-y-auto py-2 space-y-2.5 scrollbar-thin">
                    {approvals.length === 0 ? (
                      <div className="py-6 text-center text-xs text-[#7E8299]">
                        {isUrdu ? "کوئی زیر التوا منظوری نہیں" : "No pending approvals"}
                      </div>
                    ) : (
                      approvals.map((appr) => (
                        <div
                          key={appr.id}
                          className="p-3 rounded-2xl bg-[#EDEBF8] space-y-2"
                          style={{
                            boxShadow: "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8",
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="text-xs font-bold text-[#3A3F58]">
                                {isUrdu ? appr.title.ur : appr.title.en}
                              </h4>
                              <p className="text-[11px] text-[#7E8299] mt-0.5">
                                {isUrdu ? appr.detail.ur : appr.detail.en}
                              </p>
                            </div>
                            {appr.amount && (
                              <span
                                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#EDEBF8] text-[#007BFF]"
                                style={{
                                  boxShadow: "inset 1px 1px 2px #C5C3D8, inset -1px -1px 2px #FFFFFF",
                                }}
                              >
                                {appr.amount}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleDismissApproval(appr.id)}
                              className="px-2.5 py-1 rounded-xl text-[10px] font-bold text-[#7E8299] hover:text-rose-600 bg-[#EDEBF8]"
                              style={{
                                boxShadow: "-1px -1px 3px #FFFFFF, 1px 1px 3px #C5C3D8",
                              }}
                            >
                              {isUrdu ? "مسترد" : "Dismiss"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApprove(appr.id)}
                              className="px-3 py-1 rounded-xl text-[10px] font-bold text-white bg-[#007BFF] hover:bg-[#0A84FF]"
                              style={{
                                boxShadow: "-2px -2px 4px #FFFFFF, 2px 2px 4px rgba(0, 123, 255, 0.4)",
                              }}
                            >
                              {isUrdu ? "منظور کریں" : "Approve"}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 4. Theme Toggle: Circular raised button with Sun/Moon icon */}
          <button
            type="button"
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-[#EDEBF8] flex items-center justify-center text-[#7E8299] hover:text-[#007BFF] transition-all duration-200 ease-in-out cursor-pointer active:scale-95"
            style={{
              boxShadow: "-4px -4px 8px #FFFFFF, 4px 4px 8px #C5C3D8",
            }}
            aria-label="Toggle visual theme"
            title={`Switch mode`}
          >
            <NavIcon
              name={theme === "dark" ? "Sun" : "Moon"}
              className="w-4 h-4 text-[#007BFF]"
            />
          </button>

          {/* 5. User Avatar: Raised circular frame with user status and tactile dropdown menu */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              id="user-profile-menu-btn"
              onClick={() => {
                closeAllDropdowns();
                setIsProfileMenuOpen(!isProfileMenuOpen);
              }}
              className="flex items-center gap-2 p-1 rounded-full bg-[#EDEBF8] transition-all duration-200 ease-in-out cursor-pointer active:scale-95"
              style={{
                boxShadow: isProfileMenuOpen
                  ? "inset 3px 3px 6px #C5C3D8, inset -3px -3px 6px #FFFFFF"
                  : "-4px -4px 8px #FFFFFF, 4px 4px 8px #C5C3D8",
              }}
              aria-label="User account menu"
              aria-expanded={isProfileMenuOpen}
            >
              {/* Circular Avatar Frame */}
              <div
                className="w-8 h-8 rounded-full bg-[#EDEBF8] flex items-center justify-center text-[#007BFF] font-extrabold text-xs"
                style={{
                  boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
                }}
              >
                {user.avatarText}
              </div>

              <div className="hidden lg:flex flex-col text-start pr-2">
                <span className="text-xs font-bold text-[#3A3F58] leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] text-[#007BFF] font-semibold">
                  {isUrdu ? ROLE_INFO[activeRole].ur : ROLE_INFO[activeRole].en}
                </span>
              </div>
            </button>

            {/* Profile Dropdown Menu: Neumorphic Raised Floating Card */}
            {isProfileMenuOpen && (
              <div
                id="user-profile-menu"
                className={`absolute ${
                  isUrdu ? "left-0" : "right-0"
                } mt-3 w-72 bg-[#EDEBF8] rounded-2xl z-50 p-3.5 animate-in fade-in zoom-in-95 duration-150`}
                style={{
                  boxShadow: "-8px -8px 18px #FFFFFF, 8px 8px 18px #C5C3D8",
                }}
              >
                {/* User Info Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-[#C5C3D8]/40">
                  <div
                    className="w-10 h-10 rounded-full bg-[#EDEBF8] flex items-center justify-center text-[#007BFF] font-bold text-sm"
                    style={{
                      boxShadow: "inset 2px 2px 4px #C5C3D8, inset -2px -2px 4px #FFFFFF",
                    }}
                  >
                    {user.avatarText}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold text-[#3A3F58] truncate">{user.name}</p>
                    <p className="text-[10px] text-[#7E8299] truncate">{user.email}</p>
                    <span
                      className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#EDEBF8] text-[#007BFF]"
                      style={{
                        boxShadow: "inset 1px 1px 3px #C5C3D8, inset -1px -1px 3px #FFFFFF",
                      }}
                    >
                      {isUrdu ? ROLE_INFO[activeRole].ur : ROLE_INFO[activeRole].en}
                    </span>
                  </div>
                </div>

                {/* Role Switcher Section (Tactile Inset Tray) */}
                <div className="py-3 border-b border-[#C5C3D8]/40">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7E8299] mb-2">
                    {isUrdu ? "رول تبدیل کریں (مجاز رسائی)" : "Switch Wholesale Role"}
                  </label>
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
                          showToast(
                            isUrdu
                              ? `رول تبدیل: ${ROLE_INFO[r].ur}`
                              : `Switched role to ${ROLE_INFO[r].en}`
                          );
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                          activeRole === r
                            ? "bg-[#EDEBF8] text-[#007BFF] font-bold"
                            : "text-[#7E8299] hover:text-[#3A3F58]"
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

                {/* Links: Profile & Logout */}
                <div className="pt-2 flex flex-col gap-1">
                  <Link
                    href={`/${locale}/settings`}
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#6C7293] hover:text-[#007BFF] transition-all duration-200"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <NavIcon name="Settings" className="w-4 h-4 text-[#007BFF]" />
                    <span>{isUrdu ? "اکاؤنٹ سیٹنگز" : "Account Settings"}</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      showToast(isUrdu ? "لاگ آؤٹ ہو گیا" : "Logged out successfully");
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 transition-all duration-200 cursor-pointer"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <NavIcon name="LogOut" className="w-4 h-4 text-rose-600" />
                    <span>{isUrdu ? "لاگ آؤٹ" : "Log Out"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
