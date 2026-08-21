"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/actions/auth";
import { NavIcon } from "./NavIcon";
import { useNavigation } from "./NavigationContext";

interface DashboardLogoutButtonProps {
  locale: string;
  isUrdu?: boolean;
  variant?: "header" | "compact" | "pill";
  className?: string;
}

export function DashboardLogoutButton({
  locale,
  isUrdu = false,
  variant = "header",
  className = "",
}: DashboardLogoutButtonProps) {
  const router = useRouter();
  const { showToast } = useNavigation();
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    try {
      setIsPending(true);
      showToast(isUrdu ? "لاگ آؤٹ ہو رہا ہے..." : "Logging out...");
      await logoutAction(locale);
    } catch (err) {
      // In Next.js, redirect throws a NEXT_REDIRECT error which is normal
      if (
        err &&
        typeof err === "object" &&
        "digest" in err &&
        typeof (err as { digest?: unknown }).digest === "string" &&
        (err as { digest: string }).digest.includes("NEXT_REDIRECT")
      ) {
        return;
      }
      // Fallback manual redirect if error
      router.push(`/${locale}/login`);
    } finally {
      setIsPending(false);
    }
  };

  if (variant === "compact") {
    return (
      <button
        type="button"
        id="dashboard-logout-compact-btn"
        onClick={handleLogout}
        disabled={isPending}
        className={`size-9 rounded-2xl bg-[#EDEBF8] text-rose-600 hover:text-rose-700 flex items-center justify-center transition-all duration-200 ease-in-out cursor-pointer active:scale-95 disabled:opacity-50 ${className}`}
        style={{
          boxShadow: "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8",
        }}
        title={isUrdu ? "سسٹم سے لاگ آؤٹ کریں" : "Sign out from BOS"}
        aria-label="Logout"
      >
        <NavIcon name="LogOut" className="w-4 h-4 text-rose-600" />
      </button>
    );
  }

  if (variant === "pill") {
    return (
      <button
        type="button"
        id="dashboard-logout-pill-btn"
        onClick={handleLogout}
        disabled={isPending}
        className={`h-8 px-3 rounded-full bg-[#EDEBF8] text-rose-600 hover:text-rose-700 text-xs font-bold inline-flex items-center gap-1.5 transition-all duration-200 ease-in-out cursor-pointer active:scale-95 disabled:opacity-50 ${className}`}
        style={{
          boxShadow: "-3px -3px 6px #FFFFFF, 3px 3px 6px #C5C3D8",
        }}
      >
        <NavIcon name="LogOut" className="w-3.5 h-3.5 text-rose-600" />
        <span>{isUrdu ? "لاگ آؤٹ" : "Logout"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      id="dashboard-header-logout-btn"
      onClick={handleLogout}
      disabled={isPending}
      className={`px-3.5 py-2 rounded-2xl bg-[#EDEBF8] text-rose-600 hover:text-rose-700 text-xs font-bold transition-all duration-200 ease-in-out flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 ${className}`}
      style={{
        boxShadow: "-4px -4px 8px #FFFFFF, 4px 4px 8px #C5C3D8",
      }}
      title={isUrdu ? "سسٹم سے لاگ آؤٹ کریں" : "Sign out from BOS"}
    >
      <NavIcon name="LogOut" className="w-4 h-4 text-rose-600" />
      <span className="whitespace-nowrap">{isUrdu ? "لاگ آؤٹ" : "Log Out"}</span>
    </button>
  );
}
