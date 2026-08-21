"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";

export interface NeuSliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
  label?: string;
  unit?: string;
  className?: string;
  showValueLabel?: boolean;
}

export const NeuSlider: React.FC<NeuSliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  label,
  unit = "",
  className = "",
  showValueLabel = true,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);

  const updateValueFromPosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const clickX = clientX - rect.left;
      const width = rect.width;
      const ratio = Math.min(Math.max(clickX / width, 0), 1);
      const rawValue = min + ratio * (max - min);
      const steppedValue = Math.round(rawValue / step) * step;
      const clampedValue = Math.min(Math.max(steppedValue, min), max);
      onChange(clampedValue);
    },
    [min, max, step, onChange]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValueFromPosition(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateValueFromPosition(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateValueFromPosition(e.clientX);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        updateValueFromPosition(e.touches[0].clientX);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, updateValueFromPosition]);

  return (
    <div className={`w-full ${className}`}>
      {(label || showValueLabel) && (
        <div className="flex items-center justify-between mb-3 px-1">
          {label && (
            <span className="text-xs font-bold uppercase tracking-wider text-neu-text-muted">
              {label}
            </span>
          )}
          {showValueLabel && (
            <span className="text-xs font-bold font-mono text-neu-blue px-2.5 py-0.5 rounded-full bg-neu-base shadow-neu-pressed-sm">
              {value}
              {unit}
            </span>
          )}
        </div>
      )}

      {/* Recessed Slider Track */}
      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="relative w-full h-4 bg-neu-base shadow-neu-pressed-sm rounded-full cursor-pointer flex items-center select-none py-1"
      >
        {/* Active Electric Blue Progress Fill */}
        <div
          className="h-2 rounded-full bg-gradient-to-r from-neu-blue to-neu-blue-hover shadow-neu-blue-glow transition-all duration-75"
          style={{ width: `${percentage}%` }}
        />

        {/* Elevated Tactile Thumb */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-neu-base border-0 flex items-center justify-center transition-transform ${
            isDragging
              ? "scale-110 shadow-neu-flat cursor-grabbing"
              : "scale-100 shadow-neu-flat hover:scale-105 cursor-grab"
          }`}
          style={{ left: `${percentage}%` }}
        >
          {/* Inner Accent Ring Indicator */}
          <div className="w-2.5 h-2.5 rounded-full bg-neu-blue shadow-neu-blue-glow" />
        </div>
      </div>
    </div>
  );
};
