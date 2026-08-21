"use client";

import React from "react";
import { NavigationProvider, useNavigation } from "./NavigationContext";
import { TopGlobalHeader } from "./TopGlobalHeader";
import { DesktopSidebar } from "./DesktopSidebar";
import { MobileBottomTabBar } from "./MobileBottomTabBar";
import { MobileDrawer } from "./MobileDrawer";
import { GlobalSearchModal } from "./GlobalSearchModal";
import { QuickCreateModal } from "./QuickCreateModal";
import { NavigationToast } from "./NavigationToast";

function ShellInner({ children }: { children: React.ReactNode }) {
  const { isUrdu } = useNavigation();

  return (
    <div
      id="enterprise-bos-shell"
      className={`min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased ${
        isUrdu ? "font-nastaleeq" : "font-sans"
      }`}
    >
      {/* 1. Top Global Header */}
      <TopGlobalHeader />

      {/* 2. Main Workspace Layout with Left Sidebar + Scrollable Viewport */}
      <div className="flex-1 flex w-full relative overflow-hidden">
        {/* Left Desktop Collapsible Sidebar */}
        <DesktopSidebar />

        {/* Central Workspace Page Content */}
        <main
          id="main-workspace-content"
          className="flex-1 overflow-y-auto min-h-[calc(100vh-57px)] pb-24 md:pb-8 p-3 sm:p-5 lg:p-6 bg-slate-950/40"
        >
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>

      {/* 3. Mobile Fixed Bottom Tab Bar (< 768px) */}
      <MobileBottomTabBar />

      {/* 4. Mobile Full Slide-over Drawer */}
      <MobileDrawer />

      {/* 5. Cmd+K Global Search Modal */}
      <GlobalSearchModal />

      {/* 6. Quick Create Action Dialog */}
      <QuickCreateModal />

      {/* 7. Toast Alerts */}
      <NavigationToast />
    </div>
  );
}

export function EnterpriseShell({
  children,
  locale = "en-US",
}: {
  children: React.ReactNode;
  locale?: string;
}) {
  return (
    <NavigationProvider initialLocale={locale}>
      <ShellInner>{children}</ShellInner>
    </NavigationProvider>
  );
}
