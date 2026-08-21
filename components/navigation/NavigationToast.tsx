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
      className={`fixed bottom-16 md:bottom-6 ${
        isUrdu ? "left-4" : "right-4"
      } z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 border border-indigo-500/50 text-white rounded-xl shadow-2xl shadow-indigo-950/50 animate-in slide-in-from-bottom-4 duration-200`}
      role="status"
      aria-live="polite"
    >
      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-ping shrink-0" />
      <span className="text-xs font-semibold">{toastMessage}</span>
      <NavIcon name="Sparkles" className="w-4 h-4 text-indigo-400 shrink-0" />
    </div>
  );
}
