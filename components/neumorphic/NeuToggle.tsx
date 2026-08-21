"use client";

import React from "react";

export interface NeuToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  sublabel?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

export const NeuToggle: React.FC<NeuToggleProps> = ({
  checked,
  onChange,
  label,
  sublabel,
  size = "md",
  disabled = false,
  className = "",
}) => {
  const sizeConfig = {
    sm: {
      track: "w-12 h-6 p-0.5",
      thumb: "w-5 h-5",
      translate: "translate-x-6",
    },
    md: {
      track: "w-16 h-8 p-1",
      thumb: "w-6 h-6",
      translate: "translate-x-8",
    },
    lg: {
      track: "w-20 h-10 p-1.5",
      thumb: "w-7 h-7",
      translate: "translate-x-10",
    },
  };

  const config = sizeConfig[size];

  return (
    <label
      className={`inline-flex items-center gap-3.5 select-none ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      } ${className}`}
    >
      {/* Inset Pill Track */}
      <div
        onClick={() => !disabled && onChange(!checked)}
        role="switch"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            if (!disabled) onChange(!checked);
          }
        }}
        className={`relative rounded-full transition-all duration-300 ease-in-out flex items-center border-0 outline-none ${
          config.track
        } ${
          checked
            ? "bg-neu-base shadow-neu-pressed"
            : "bg-neu-base shadow-neu-pressed"
        }`}
      >
        {/* Track Active Glow Fill Layer */}
        <div
          className={`absolute inset-0.5 rounded-full transition-opacity duration-300 ${
            checked
              ? "bg-neu-blue/20 opacity-100"
              : "opacity-0"
          }`}
        />

        {/* Extruded Circular Thumb */}
        <div
          className={`relative rounded-full bg-neu-base shadow-neu-flat transition-transform duration-300 ease-in-out flex items-center justify-center border-0 ${
            config.thumb
          } ${checked ? config.translate : "translate-x-0"}`}
        >
          {/* Status Dot */}
          <div
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              checked
                ? "bg-neu-blue shadow-neu-blue-glow scale-110"
                : "bg-neu-text-muted/40 scale-90"
            }`}
          />
        </div>
      </div>

      {(label || sublabel) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neu-text-primary">
              {label}
            </span>
          )}
          {sublabel && <span className="text-xs text-neu-text-muted">{sublabel}</span>}
        </div>
      )}
    </label>
  );
};
