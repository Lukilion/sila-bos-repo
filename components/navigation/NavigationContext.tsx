"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { UserRole, INITIAL_NOTIFICATIONS, INITIAL_APPROVAL_ALERTS, SystemNotification, ApprovalAlert } from "@/lib/navigation-config";
import { useRouter, usePathname } from "next/navigation";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  roleTitle: {
    en: string;
    ur: string;
  };
  tenantName: string;
  hubLocation: string;
  avatarUrl?: string;
  avatarText?: string;
}

interface NavigationContextType {
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  locale: "en-US" | "ur-PK";
  setLocale: (locale: "en-US" | "ur-PK") => void;
  isUrdu: boolean;
  theme: "dark" | "light";
  toggleTheme: () => void;
  
  // Layout toggles
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  toggleSidebar: () => void;
  isMobileDrawerOpen: boolean;
  setIsMobileDrawerOpen: (open: boolean) => void;
  toggleMobileDrawer: () => void;
  
  // Dropdowns & Modals
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isQuickCreateOpen: boolean;
  setIsQuickCreateOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isApprovalsOpen: boolean;
  setIsApprovalsOpen: (open: boolean) => void;
  isProfileMenuOpen: boolean;
  setIsProfileMenuOpen: (open: boolean) => void;
  activeQuickAction: string | null;
  setActiveQuickAction: (action: string | null) => void;

  // Real-time notification & approval state
  notifications: SystemNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  approvals: ApprovalAlert[];
  pendingApprovalCount: number;
  handleApprove: (id: string) => void;
  handleDismissApproval: (id: string) => void;

  // Active user details
  user: UserProfile;
  activePath: string;
  closeAllDropdowns: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const ROLE_INFO: Record<UserRole, { en: string; ur: string; badgeColor: string }> = {
  ADMIN: {
    en: "Admin / Owner",
    ur: "ایڈمن و مالک",
    badgeColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  },
  WAREHOUSE_MANAGER: {
    en: "Warehouse Manager",
    ur: "گودام مینیجر",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  SALES_REP: {
    en: "Sales & Orders Rep",
    ur: "سیلز و آرڈر نمائندہ",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  SUDO: {
    en: "Sudo Super-Admin",
    ur: "سوڈو ایڈمنسٹریٹر",
    badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  },
};

export function NavigationProvider({
  children,
  initialLocale = "en-US",
}: {
  children: React.ReactNode;
  initialLocale?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = (initialLocale === "ur-PK" ? "ur-PK" : "en-US") as "en-US" | "ur-PK";
  const [locale, setLocaleState] = useState<"en-US" | "ur-PK">(currentLocale);

  const [activeRole, setActiveRoleState] = useState<UserRole>("ADMIN");
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sila_theme") as "dark" | "light" | null;
      if (saved) return saved;
    }
    return "dark";
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isApprovalsOpen, setIsApprovalsOpen] = useState<boolean>(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  const [approvals, setApprovals] = useState<ApprovalAlert[]>(INITIAL_APPROVAL_ALERTS);

  // Sync theme class to html element
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  // Handle Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsSearchModalOpen(false);
        setIsQuickCreateOpen(false);
        setIsNotificationsOpen(false);
        setIsApprovalsOpen(false);
        setIsProfileMenuOpen(false);
        setIsMobileDrawerOpen(false);
        setActiveQuickAction(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        localStorage.setItem("sila_theme", next);
        document.documentElement.classList.toggle("dark", next === "dark");
      }
      return next;
    });
  }, []);

  const setLocale = useCallback(
    (newLocale: "en-US" | "ur-PK") => {
      setLocaleState(newLocale);
      const segments = pathname.split("/").filter(Boolean);
      if (segments[0] === "en-US" || segments[0] === "ur-PK") {
        segments[0] = newLocale;
      } else {
        segments.unshift(newLocale);
      }
      const newPath = "/" + segments.join("/");
      router.push(newPath);
    },
    [pathname, router]
  );

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  }, []);

  const setActiveRole = useCallback(
    (role: UserRole) => {
      setActiveRoleState(role);
      showToast(
        locale === "ur-PK"
          ? `صارف کا رول تبدیل ہو گیا: ${ROLE_INFO[role].ur}`
          : `Active RBAC Role switched to: ${ROLE_INFO[role].en}`
      );
    },
    [locale, showToast]
  );

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => !prev);
  }, []);

  const toggleMobileDrawer = useCallback(() => {
    setIsMobileDrawerOpen((prev) => !prev);
  }, []);

  const closeAllDropdowns = useCallback(() => {
    setIsQuickCreateOpen(false);
    setIsNotificationsOpen(false);
    setIsApprovalsOpen(false);
    setIsProfileMenuOpen(false);
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast(locale === "ur-PK" ? "تمام اطلاعات پڑھ لی گئیں" : "All notifications marked as read");
  }, [locale, showToast]);

  const handleApprove = useCallback(
    (id: string) => {
      setApprovals((prev) => prev.filter((a) => a.id !== id));
      showToast(locale === "ur-PK" ? "منظوری کامیابی سے درج کر لی گئی" : "Override approval committed to audit log");
    },
    [locale, showToast]
  );

  const handleDismissApproval = useCallback(
    (id: string) => {
      setApprovals((prev) => prev.filter((a) => a.id !== id));
      showToast(locale === "ur-PK" ? "الرٹ منسوخ کر دیا گیا" : "Alert dismissed");
    },
    [locale, showToast]
  );

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;
  const pendingApprovalCount = approvals.filter((a) => a.permittedRoles.includes(activeRole)).length;

  const user: UserProfile = {
    id: "usr-shah-alami-01",
    name: "Mukhtar Ahmad",
    email: "mukhtar.admin@shahalami.com",
    phone: "0300-8492011",
    role: activeRole,
    roleTitle: {
      en: ROLE_INFO[activeRole].en,
      ur: ROLE_INFO[activeRole].ur,
    },
    tenantName: "Shah Alami Wholesale Hub",
    hubLocation: "Main Market Gate 2, Lahore",
    avatarText: "MA",
  };

  return (
    <NavigationContext.Provider
      value={{
        activeRole,
        setActiveRole,
        locale,
        setLocale,
        isUrdu: locale === "ur-PK",
        theme,
        toggleTheme,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebar,
        isMobileDrawerOpen,
        setIsMobileDrawerOpen,
        toggleMobileDrawer,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isQuickCreateOpen,
        setIsQuickCreateOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isApprovalsOpen,
        setIsApprovalsOpen,
        isProfileMenuOpen,
        setIsProfileMenuOpen,
        activeQuickAction,
        setActiveQuickAction,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        approvals,
        pendingApprovalCount,
        handleApprove,
        handleDismissApproval,
        user,
        activePath: pathname,
        closeAllDropdowns,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
