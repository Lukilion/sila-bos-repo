"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface DropdownOption {
  value: string;
  label: string;
  badge?: string;
}

export interface NeuDropdownProps {
  options: DropdownOption[] | string[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const NeuDropdown: React.FC<NeuDropdownProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = "Select Option",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const normalizedOptions: DropdownOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left w-full sm:w-64 ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-neu-text-muted mb-2 px-1">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full px-5 py-3.5 rounded-2xl bg-neu-base text-left border-0 outline-none flex items-center justify-between gap-3 transition-all duration-200 ease-in-out cursor-pointer select-none ${
          isOpen
            ? "shadow-neu-pressed text-neu-blue"
            : "shadow-neu-flat text-neu-text-primary hover:text-neu-blue"
        }`}
      >
        <span className="font-semibold text-sm uppercase tracking-wide truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-neu-text-muted transition-transform duration-200 shrink-0 ${
            isOpen ? "transform rotate-180 text-neu-blue" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-3 p-2 bg-neu-base shadow-neu-flat rounded-2xl border-0 overflow-hidden space-y-1 animate-in fade-in zoom-in-95 duration-150">
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 rounded-xl text-left border-0 outline-none text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-150 flex items-center justify-between ${
                  isSelected
                    ? "bg-neu-base text-neu-blue shadow-neu-pressed"
                    : "text-neu-text-muted hover:text-neu-text-primary hover:bg-neu-surface/50"
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="w-4 h-4 text-neu-blue shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
