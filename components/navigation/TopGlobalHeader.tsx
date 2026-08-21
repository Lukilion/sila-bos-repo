"use client";

import React, { useRef, useEffect } from "react";
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
    isApprovalsOpen,
    setIsApprovalsOpen,
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

  const quickCreateRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const approvalsRef = useRef<HTMLDivElement>(null);
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
        isApprovalsOpen &&
        approvalsRef.current &&
        !approvalsRef.current.contains(target)
      ) {
        setIsApprovalsOpen(false);
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
    isApprovalsOpen,
    isProfileMenuOpen,
    setIsQuickCreateOpen,
    setIsNotificationsOpen,
    setIsApprovalsOpen,
    setIsProfileMenuOpen,
  ]);

  const targetLocale = isUrdu ? "en-US" : "ur-PK";

  return (
    <header
      id="top-global-header"
      className="sticky top-0 z-30 w-full bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-800/90 px-3 sm:px-5 py-2 text-slate-100 transition-colors shadow-sm"
      role="banner"
    >
      <div className="flex items-center justify-between gap-2 sm:gap-4 max-w-full">
        {/* Left: Brand & Sidebar Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Hamburger Trigger */}
          <button
            type="button"
            id="mobile-drawer-toggle-btn"
            onClick={toggleMobileDrawer}
            className="md:hidden p-2 rounded-lg text-[#15a0fa] hover:text-white hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-[#15a0fa]"
            aria-label="Open mobile menu drawer"
          >
            <NavIcon name="Menu" className="w-5 h-5 text-[#15a0fa]" />
          </button>

          {/* Desktop Sidebar Collapse Toggle */}
          <button
            type="button"
            id="desktop-sidebar-collapse-btn"
            onClick={toggleSidebar}
            className="hidden md:flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-[#15a0fa] hover:bg-slate-800/80 transition focus:outline-none focus:ring-2 focus:ring-[#15a0fa]"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <NavIcon
              name={isSidebarCollapsed ? (isUrdu ? "ChevronsLeft" : "ChevronsRight") : (isUrdu ? "ChevronsRight" : "ChevronsLeft")}
              className="w-4 h-4 text-[#15a0fa] transition"
            />
          </button>

          {/* Company Logo & Brand Name */}
          <Link
            href={`/${locale}/dashboard`}
            id="header-brand-logo"
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-[#15a0fa] rounded-lg p-1"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#15a0fa] to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-[#15a0fa]/25 group-hover:scale-105 transition">
              {NAVIGATION_CONFIG.brand.logoText}
            </div>
            <div className="hidden sm:flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-white group-hover:text-[#15a0fa] transition">
                  {NAVIGATION_CONFIG.brand.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-950/80 text-[#15a0fa] border border-[#15a0fa]/30">
                  {NAVIGATION_CONFIG.brand.hubCode}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 leading-tight">
                {isUrdu ? NAVIGATION_CONFIG.brand.tagline.ur : NAVIGATION_CONFIG.brand.tagline.en}
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Global Search Bar (Cmd + K) */}
        <div className="flex-1 max-w-md mx-2 hidden md:block">
          <button
            type="button"
            id="global-search-trigger"
            onClick={() => setIsSearchModalOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-slate-400 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 hover:border-[#15a0fa]/50 rounded-xl transition shadow-inner group focus:outline-none focus:ring-2 focus:ring-[#15a0fa]"
            aria-label="Global search across SKU, orders, and customer khata"
          >
            <div className="flex items-center gap-2">
              <NavIcon name="Search" className="w-4 h-4 text-[#15a0fa] group-hover:scale-110 transition" />
              <span className="text-slate-400 group-hover:text-slate-200 text-xs">
                {isUrdu ? "تلاش کریں (SKU، آرڈر نمبر، گاہک کھاتہ)..." : "Search SKU, Order #, Customer Khata..."}
              </span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-[#15a0fa] bg-slate-900 border border-[#15a0fa]/30 rounded shadow-sm">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right: Utility Cluster */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile Search Icon button */}
          <button
            type="button"
            id="mobile-search-btn"
            onClick={() => setIsSearchModalOpen(true)}
            className="md:hidden p-2 rounded-lg text-[#15a0fa] hover:text-white hover:bg-slate-800 transition"
            aria-label="Search"
          >
            <NavIcon name="Search" className="w-4 h-4 text-[#15a0fa]" />
          </button>

          {/* 1. Quick Create (+) Dropdown */}
          <div className="relative" ref={quickCreateRef}>
            <button
              type="button"
              id="quick-create-dropdown-btn"
              onClick={() => {
                closeAllDropdowns();
                setIsQuickCreateOpen(!isQuickCreateOpen);
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#15a0fa] to-indigo-600 hover:from-[#0a84ff] hover:to-indigo-500 active:brightness-90 rounded-lg shadow-sm shadow-[#15a0fa]/30 transition focus:outline-none focus:ring-2 focus:ring-[#15a0fa]"
              aria-expanded={isQuickCreateOpen}
              aria-haspopup="true"
              aria-label="Quick create new record"
            >
              <NavIcon name="Plus" className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">{isUrdu ? "فوری اندراج" : "Quick Create"}</span>
              <NavIcon name="ChevronDown" className={`w-3 h-3 text-white/90 transition-transform ${isQuickCreateOpen ? "rotate-180" : ""}`} />
            </button>

            {isQuickCreateOpen && (
              <div
                id="quick-create-menu"
                className={`absolute ${isUrdu ? "left-0" : "right-0"} mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-150`}
              >
                <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {isUrdu ? "فوری ایکشنز" : "Quick Actions"}
                  </span>
                  <span className="text-[10px] text-[#15a0fa] font-mono font-semibold">Wholesale Ops</span>
                </div>
                <div className="py-1 flex flex-col gap-1">
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
                        className="w-full flex items-start gap-3 p-2 rounded-lg text-start hover:bg-slate-800/80 transition group"
                      >
                        <div className="p-2 rounded-lg bg-slate-800 text-[#15a0fa] group-hover:bg-[#15a0fa] group-hover:text-white transition shrink-0 mt-0.5 shadow-sm">
                          <NavIcon name={action.icon} className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                              {isUrdu ? action.label.ur : action.label.en}
                            </span>
                            <kbd className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                              {action.shortcut}
                            </kbd>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {isUrdu ? action.description.ur : action.description.en}
                          </p>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. Language Toggle Pill [ EN | اردو ] */}
          <button
            type="button"
            id="header-language-toggle"
            onClick={() => setLocale(targetLocale)}
            className="flex items-center bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg p-0.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-[#15a0fa]"
            aria-label={`Switch language to ${isUrdu ? "English" : "Urdu"}`}
            title={`Switch language to ${isUrdu ? "English" : "Urdu"}`}
          >
            <span
              className={`px-2 py-1 rounded-md text-[11px] transition ${
                !isUrdu ? "bg-[#15a0fa] text-white font-bold shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              EN
            </span>
            <span
              className={`px-2 py-1 rounded-md text-[11px] font-nastaleeq transition ${
                isUrdu ? "bg-[#15a0fa] text-white font-bold shadow-sm" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              اردو
            </span>
          </button>

          {/* 3. Dark / Light Mode Toggle */}
          <button
            type="button"
            id="header-theme-toggle"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[#15a0fa] hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-[#15a0fa]"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Current: ${theme === "dark" ? "Dark Mode" : "Light Mode"}`}
          >
            {theme === "dark" ? (
              <NavIcon name="Sun" className="w-4 h-4 text-amber-400 hover:text-amber-300" />
            ) : (
              <NavIcon name="Moon" className="w-4 h-4 text-[#15a0fa]" />
            )}
          </button>

          {/* 4. Notification Center with Unread Counter */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              id="header-notifications-btn"
              onClick={() => {
                closeAllDropdowns();
                setIsNotificationsOpen(!isNotificationsOpen);
              }}
              className="relative p-2 rounded-lg text-[#15a0fa] hover:text-white hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-[#15a0fa]"
              aria-expanded={isNotificationsOpen}
              aria-label={`Notifications (${unreadNotificationCount} unread)`}
            >
              <NavIcon name="Bell" className="w-4 h-4 text-[#15a0fa]" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#15a0fa] text-[10px] font-bold text-white shadow-sm ring-2 ring-slate-900">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div
                id="notifications-menu"
                className={`absolute ${isUrdu ? "left-0" : "right-0"} mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150`}
              >
                <div className="p-3 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <NavIcon name="Bell" className="w-4 h-4 text-[#15a0fa]" />
                    <span className="text-xs font-bold text-white">
                      {isUrdu ? "اطلاعات و الرٹس" : "Notifications & Activity"}
                    </span>
                    {unreadNotificationCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-sky-500/20 text-[#15a0fa] text-[10px] font-bold">
                        {unreadNotificationCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotificationCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-[#15a0fa] hover:underline font-medium transition"
                    >
                      {isUrdu ? "سب پڑھ لیں" : "Mark all read"}
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      {isUrdu ? "کوئی نئی اطلاع نہیں ہے" : "No recent notifications"}
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3 text-start hover:bg-slate-800/60 transition cursor-pointer flex gap-3 ${
                          !n.read ? "bg-sky-950/20" : ""
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                            !n.read ? "bg-[#15a0fa] ring-2 ring-[#15a0fa]/40" : "bg-transparent"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">
                              {isUrdu ? n.title.ur : n.title.en}
                            </h4>
                            <span className="text-[10px] text-slate-500 font-mono shrink-0">
                              {n.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                            {isUrdu ? n.message.ur : n.message.en}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 bg-slate-900 border-t border-slate-800 text-center">
                  <Link
                    href={`/${locale}/dashboard`}
                    onClick={() => setIsNotificationsOpen(false)}
                    className="text-[11px] text-[#15a0fa] hover:underline font-medium inline-flex items-center gap-1"
                  >
                    <span>{isUrdu ? "تمام لاگز دیکھیں" : "View Audit Trail & Log"}</span>
                    <NavIcon name="ArrowUpRight" className="w-3 h-3 text-[#15a0fa]" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 5. Pending Approvals & Alert Badge */}
          <div className="relative" ref={approvalsRef}>
            <button
              type="button"
              id="header-approvals-btn"
              onClick={() => {
                closeAllDropdowns();
                setIsApprovalsOpen(!isApprovalsOpen);
              }}
              className="relative p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition focus:outline-none focus:ring-2 focus:ring-amber-400"
              aria-expanded={isApprovalsOpen}
              aria-label={`Pending Approvals (${pendingApprovalCount})`}
              title="Pending Approvals & Credit Limit Overrides"
            >
              <NavIcon name="AlertTriangle" className="w-4 h-4 text-amber-400" />
              {pendingApprovalCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 shadow-sm ring-2 ring-slate-900 animate-pulse">
                  {pendingApprovalCount}
                </span>
              )}
            </button>

            {isApprovalsOpen && (
              <div
                id="approvals-menu"
                className={`absolute ${isUrdu ? "left-0" : "right-0"} mt-2 w-80 sm:w-96 bg-slate-900 border border-amber-500/40 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150`}
              >
                <div className="p-3 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <NavIcon name="ShieldAlert" className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-300">
                      {isUrdu ? "زیر التوا منظوری و الرٹس" : "Pending Overrides & Triggers"}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold font-mono">
                    {pendingApprovalCount} Actionable
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800 p-1">
                  {approvals.filter((a) => a.permittedRoles.includes(activeRole)).length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      {isUrdu ? "کوئی زیر التوا منظوری نہیں ہے" : "All approvals reconciled. No pending overrides."}
                    </div>
                  ) : (
                    approvals
                      .filter((a) => a.permittedRoles.includes(activeRole))
                      .map((appr) => (
                        <div key={appr.id} className="p-3 rounded-lg bg-slate-950/40 m-1 border border-slate-800 flex flex-col gap-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold uppercase">
                                {appr.type.replace("_", " ")}
                              </span>
                              <h4 className="text-xs font-bold text-slate-200 mt-1">
                                {isUrdu ? appr.title.ur : appr.title.en}
                              </h4>
                            </div>
                            {appr.amount && (
                              <span className="text-xs font-mono font-bold text-amber-400 shrink-0">
                                {appr.amount}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 leading-snug">
                            {isUrdu ? appr.detail.ur : appr.detail.en}
                          </p>
                          <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800">
                            <button
                              type="button"
                              onClick={() => handleDismissApproval(appr.id)}
                              className="px-2.5 py-1 rounded text-[11px] font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                            >
                              {isUrdu ? "رد کریں" : "Dismiss"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApprove(appr.id)}
                              className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold transition shadow-sm"
                            >
                              {isUrdu ? "منظور کریں" : "Approve Override"}
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 6. User Profile Avatar & Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              id="header-profile-btn"
              onClick={() => {
                closeAllDropdowns();
                setIsProfileMenuOpen(!isProfileMenuOpen);
              }}
              className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-slate-800/80 transition focus:outline-none focus:ring-2 focus:ring-[#15a0fa]"
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="true"
              aria-label="User account and role selector"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#15a0fa] to-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-[#15a0fa]/40">
                {user.name.charAt(0)}
              </div>
              <div className="hidden lg:flex flex-col text-start">
                <span className="text-xs font-bold text-slate-200 leading-tight line-clamp-1">{user.name}</span>
                <span className="text-[10px] text-[#15a0fa] font-medium">
                  {isUrdu ? user.roleTitle.ur : user.roleTitle.en}
                </span>
              </div>
              <NavIcon name="ChevronDown" className="hidden lg:block w-3 h-3 text-[#15a0fa]" />
            </button>

            {isProfileMenuOpen && (
              <div
                id="profile-dropdown-menu"
                className={`absolute ${isUrdu ? "left-0" : "right-0"} mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-150`}
              >
                {/* User Info Header */}
                <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#15a0fa] to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{user.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${ROLE_INFO[activeRole].badgeColor}`}>
                          {isUrdu ? ROLE_INFO[activeRole].ur : ROLE_INFO[activeRole].en}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-700/50 flex justify-between items-center text-[10px] text-slate-400">
                    <span>{user.tenantName}</span>
                    <span className="text-emerald-400 font-mono">● Online</span>
                  </div>
                </div>

                {/* Role Switcher (Interactive RBAC simulation) */}
                <div className="mt-2 pt-2 border-t border-slate-800">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {isUrdu ? "رول تبدیل کریں (RBAC سمولیشن)" : "Switch Active RBAC Role"}
                  </div>
                  <div className="grid grid-cols-1 gap-1 mt-1">
                    {(["ADMIN", "WAREHOUSE_MANAGER", "SALES_REP", "SUDO"] as UserRole[]).map((roleKey) => (
                      <button
                        key={roleKey}
                        type="button"
                        onClick={() => {
                          setActiveRole(roleKey);
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition ${
                          activeRole === roleKey
                            ? "bg-sky-500/20 text-[#15a0fa] font-bold border border-[#15a0fa]/40"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <span>{isUrdu ? ROLE_INFO[roleKey].ur : ROLE_INFO[roleKey].en}</span>
                        {activeRole === roleKey && <NavIcon name="Check" className="w-3.5 h-3.5 text-[#15a0fa]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Menu items */}
                <div className="mt-2 pt-2 border-t border-slate-800 flex flex-col gap-0.5">
                  <Link
                    href={`/${locale}/sudo`}
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition"
                  >
                    <NavIcon name="Settings" className="w-4 h-4 text-[#15a0fa]" />
                    <span>{isUrdu ? "سسٹم سیٹنگز و کھاتہ" : "System Settings & Audit"}</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setIsSearchModalOpen(true);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition text-start"
                  >
                    <NavIcon name="Keyboard" className="w-4 h-4 text-[#15a0fa]" />
                    <span>{isUrdu ? "شارٹ کٹس (Cmd+K)" : "Keyboard Shortcuts (Cmd+K)"}</span>
                  </button>

                  <Link
                    href={`/${locale}/login`}
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition font-medium"
                  >
                    <NavIcon name="LogOut" className="w-4 h-4 text-rose-400" />
                    <span>{isUrdu ? "لاگ آؤٹ کریں" : "Sign Out"}</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
