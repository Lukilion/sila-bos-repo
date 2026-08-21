"use client";

import React, { useState } from "react";

export interface NeuTooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: "top" | "bottom";
  className?: string;
  defaultVisible?: boolean;
}

export const NeuTooltip: React.FC<NeuTooltipProps> = ({
  content,
  children,
  position = "top",
  className = "",
  defaultVisible = false,
}) => {
  const [isVisible, setIsVisible] = useState(defaultVisible);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => !defaultVisible && setIsVisible(false)}
    >
      {/* Target element */}
      {children}

      {/* Floating Speech-Bubble Tooltip */}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-40 left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-200 ease-out ${
            position === "top" ? "bottom-full mb-3.5" : "top-full mt-3.5"
          }`}
        >
          <div className="relative px-4 py-2.5 rounded-2xl bg-neu-base text-neu-text-primary shadow-neu-flat text-xs font-bold uppercase tracking-wider whitespace-nowrap border-0 flex items-center gap-2">
            {content}

            {/* Bottom Tail Pointer for Top Position */}
            {position === "top" && (
              <div
                className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-neu-base drop-shadow-[0_4px_4px_#C5C3D8]"
                aria-hidden="true"
              />
            )}

            {/* Top Tail Pointer for Bottom Position */}
            {position === "bottom" && (
              <div
                className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-neu-base drop-shadow-[0_-4px_4px_#FFFFFF]"
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Standalone Static Tooltip Banner for Showcase / Design System displays
export const NeuSpeechBubble: React.FC<{
  text?: string;
  className?: string;
}> = ({ text = "TOOL TIP", className = "" }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <div className="px-5 py-2.5 rounded-2xl bg-neu-base text-neu-text-primary shadow-neu-flat text-xs font-bold uppercase tracking-widest border-0 select-none flex items-center justify-center">
        <span>{text}</span>
      </div>
      {/* Bottom Triangular Notch Tail */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-[10px] border-x-transparent border-t-[10px] border-t-neu-base drop-shadow-[0_4px_4px_#C5C3D8]"
        aria-hidden="true"
      />
    </div>
  );
};
