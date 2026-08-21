"use client";

import React from "react";
import { useNavigation } from "./NavigationContext";
import { NavIcon } from "./NavIcon";

export function NavigationToast() {
  const { toastMessage, isUrdu } = useNavigation();

  if (!toastMessage) return null;

  return (
    <div
      id="navigation-toast"
      className={`fixed bottom-20 md:bottom-6 ${
        isUrdu ? "left-4 sm:left-6" : "right-4 sm:right-6"
      } z-50 flex items-center gap-3 px-4 py-3 bg-[#EDEBF8] text-[#3A3F58] rounded-2xl animate-in slide-in-from-bottom-4 duration-200`}
      style={{
        boxShadow: "-6px -6px 14px #FFFFFF, 6px 6px 14px #C5C3D8",
      }}
      role="status"
      aria-live="polite"
    >
      <div className="w-2.5 h-2.5 rounded-full bg-[#007BFF] shadow-[0_0_8px_#007BFF] animate-pulse shrink-0" />
      <span className="text-xs font-bold">{toastMessage}</span>
      <NavIcon name="Sparkles" className="w-4 h-4 text-[#007BFF] shrink-0" />
    </div>
  );
}
