"use client";

import React from "react";
import { Check } from "lucide-react";

export interface NeuCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  sublabel?: string;
  disabled?: boolean;
  className?: string;
}

export const NeuCheckbox: React.FC<NeuCheckboxProps> = ({
  checked,
  onChange,
  label,
  sublabel,
  disabled = false,
  className = "",
}) => {
  return (
    <label
      className={`inline-flex items-center gap-3.5 select-none ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      } ${className}`}
    >
      <div
        onClick={() => !disabled && onChange(!checked)}
        role="checkbox"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            if (!disabled) onChange(!checked);
          }
        }}
        className={`w-7 h-7 rounded-xl bg-neu-base transition-all duration-200 ease-in-out flex items-center justify-center border-0 outline-none ${
          checked ? "shadow-neu-pressed" : "shadow-neu-pressed-sm hover:shadow-neu-pressed"
        }`}
      >
        <div
          className={`w-5 h-5 rounded-lg flex items-center justify-center transition-all duration-200 ${
            checked
              ? "bg-neu-blue text-white shadow-neu-blue-glow scale-100 opacity-100"
              : "scale-50 opacity-0"
          }`}
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
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

export interface NeuRadioOption {
  value: string;
  label: string;
  description?: string;
}

export interface NeuRadioGroupProps {
  name?: string;
  options: NeuRadioOption[];
  selectedValue: string;
  onChange: (val: string) => void;
  direction?: "horizontal" | "vertical";
  className?: string;
}

export const NeuRadioGroup: React.FC<NeuRadioGroupProps> = ({
  options,
  selectedValue,
  onChange,
  direction = "vertical",
  className = "",
}) => {
  return (
    <div
      role="radiogroup"
      className={`flex ${
        direction === "horizontal" ? "flex-row flex-wrap gap-6" : "flex-col gap-3.5"
      } ${className}`}
    >
      {options.map((opt) => {
        const isSelected = opt.value === selectedValue;
        return (
          <label
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="inline-flex items-center gap-3.5 cursor-pointer select-none group"
          >
            <div
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              className={`w-7 h-7 rounded-full bg-neu-base transition-all duration-200 flex items-center justify-center border-0 outline-none ${
                isSelected ? "shadow-neu-pressed" : "shadow-neu-pressed-sm group-hover:shadow-neu-pressed"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                  isSelected
                    ? "bg-neu-blue shadow-neu-blue-glow scale-100 opacity-100"
                    : "scale-0 opacity-0"
                }`}
              />
            </div>

            <div className="flex flex-col">
              <span
                className={`text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors ${
                  isSelected ? "text-neu-blue" : "text-neu-text-primary group-hover:text-neu-blue"
                }`}
              >
                {opt.label}
              </span>
              {opt.description && (
                <span className="text-xs text-neu-text-muted">{opt.description}</span>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
};
