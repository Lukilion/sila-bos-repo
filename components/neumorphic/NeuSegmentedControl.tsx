"use client";

import React from "react";

export interface SegmentOption {
  id: string;
  label: string;
  count?: number;
}

export interface NeuSegmentedControlProps {
  options: SegmentOption[] | string[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const NeuSegmentedControl: React.FC<NeuSegmentedControlProps> = ({
  options,
  activeId,
  onChange,
  className = "",
  size = "md",
}) => {
  // Normalize options
  const normalizedOptions: SegmentOption[] = options.map((opt) =>
    typeof opt === "string" ? { id: opt, label: opt } : opt
  );

  const containerPadding = size === "sm" ? "p-1.5" : size === "lg" ? "p-2.5" : "p-2";
  const itemPadding =
    size === "sm"
      ? "px-4 py-2 text-xs"
      : size === "lg"
      ? "px-7 py-3.5 text-sm"
      : "px-5 py-2.5 text-xs sm:text-sm";

  return (
    <div
      role="tablist"
      className={`inline-flex items-center bg-neu-base shadow-neu-pressed rounded-2xl sm:rounded-full ${containerPadding} gap-1.5 sm:gap-2 border-0 select-none ${className}`}
    >
      {normalizedOptions.map((opt) => {
        const isActive = opt.id === activeId;
        return (
          <button
            key={opt.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.id)}
            className={`relative rounded-xl sm:rounded-full font-bold uppercase tracking-wider transition-all duration-200 ease-in-out border-0 outline-none cursor-pointer flex items-center justify-center gap-2 ${itemPadding} ${
              isActive
                ? "bg-neu-base text-neu-blue shadow-neu-flat scale-[1.02]"
                : "bg-transparent text-neu-text-muted hover:text-neu-text-primary"
            }`}
          >
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold transition-all ${
                  isActive
                    ? "bg-neu-blue text-white shadow-neu-flat-sm"
                    : "bg-neu-base text-neu-text-muted shadow-neu-pressed-sm"
                }`}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
