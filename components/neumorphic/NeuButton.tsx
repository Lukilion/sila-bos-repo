"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X, LucideIcon } from "lucide-react";

export interface NeuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "raised" | "pressed" | "disabled" | "accent" | "flat-sm";
  size?: "sm" | "md" | "lg" | "icon";
  children?: React.ReactNode;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  activeState?: boolean;
}

export const NeuButton: React.FC<NeuButtonProps> = ({
  variant = "raised",
  size = "md",
  children,
  icon: Icon,
  iconPosition = "left",
  className = "",
  disabled,
  activeState,
  onClick,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);

  // Size definitions
  const sizeClasses = {
    sm: "px-4 py-2 text-xs rounded-xl tracking-wider font-semibold",
    md: "px-6 py-3 text-sm rounded-2xl tracking-wider font-semibold",
    lg: "px-8 py-4 text-base rounded-2xl tracking-wider font-bold",
    icon: "w-11 h-11 rounded-2xl flex items-center justify-center p-0",
  };

  // Base physics styling
  let variantClasses = "";

  if (disabled || variant === "disabled") {
    variantClasses =
      "bg-neu-base text-neu-disabled shadow-neu-pressed-sm cursor-not-allowed select-none opacity-80";
  } else if (variant === "pressed" || activeState) {
    variantClasses =
      "bg-neu-base text-neu-blue shadow-neu-pressed active:shadow-neu-pressed transition-all duration-200";
  } else if (variant === "accent") {
    variantClasses =
      "bg-neu-blue text-white shadow-neu-blue-glow hover:bg-neu-blue-hover active:shadow-neu-pressed transition-all duration-200";
  } else if (variant === "flat-sm") {
    variantClasses =
      "bg-neu-base text-neu-text-primary shadow-neu-flat-sm hover:shadow-neu-flat active:shadow-neu-pressed transition-all duration-200";
  } else {
    // Default Raised
    variantClasses = isPressed
      ? "bg-neu-base text-neu-blue shadow-neu-pressed"
      : "bg-neu-base text-neu-text-primary shadow-neu-flat hover:text-neu-blue active:shadow-neu-pressed active:text-neu-blue transition-all duration-200";
  }

  return (
    <button
      disabled={disabled || variant === "disabled"}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => !disabled && setIsPressed(false)}
      onMouseLeave={() => !disabled && setIsPressed(false)}
      onClick={onClick}
      className={`border-0 outline-none uppercase select-none transition-all duration-200 ease-in-out inline-flex items-center justify-center gap-2.5 ${sizeClasses[size]} ${variantClasses} ${className}`}
      {...props}
    >
      {Icon && iconPosition === "left" && <Icon className="w-4 h-4 shrink-0" />}
      {children}
      {Icon && iconPosition === "right" && <Icon className="w-4 h-4 shrink-0" />}
    </button>
  );
};

// Square Utility Icon Buttons Suite (<, X, >)
export const NeuIconButtonSuite: React.FC<{
  onPrev?: () => void;
  onClose?: () => void;
  onNext?: () => void;
  className?: string;
}> = ({ onPrev, onClose, onNext, className = "" }) => {
  return (
    <div className={`inline-flex items-center gap-4 ${className}`}>
      {/* Left Chevron Icon Button */}
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous"
        className="w-12 h-12 rounded-2xl bg-neu-base text-neu-text-primary shadow-neu-flat hover:text-neu-blue active:shadow-neu-pressed flex items-center justify-center border-0 outline-none transition-all duration-200 ease-in-out cursor-pointer group"
      >
        <ChevronLeft className="w-5 h-5 text-neu-text-primary group-hover:text-neu-blue group-active:scale-90 transition-all duration-200" />
      </button>

      {/* Close/X Icon Button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="w-12 h-12 rounded-2xl bg-neu-base text-neu-text-primary shadow-neu-flat hover:text-red-500 active:shadow-neu-pressed flex items-center justify-center border-0 outline-none transition-all duration-200 ease-in-out cursor-pointer group"
      >
        <X className="w-5 h-5 text-neu-text-primary group-hover:text-red-500 group-active:scale-90 transition-all duration-200" />
      </button>

      {/* Right Chevron Icon Button */}
      <button
        type="button"
        onClick={onNext}
        aria-label="Next"
        className="w-12 h-12 rounded-2xl bg-neu-base text-neu-text-primary shadow-neu-flat hover:text-neu-blue active:shadow-neu-pressed flex items-center justify-center border-0 outline-none transition-all duration-200 ease-in-out cursor-pointer group"
      >
        <ChevronRight className="w-5 h-5 text-neu-text-primary group-hover:text-neu-blue group-active:scale-90 transition-all duration-200" />
      </button>
    </div>
  );
};
