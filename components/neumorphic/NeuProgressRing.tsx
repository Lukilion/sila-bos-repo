"use client";

import React from "react";

export interface NeuProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

export const NeuProgressRing: React.FC<NeuProgressRingProps> = ({
  progress = 75,
  size = 140,
  strokeWidth = 12,
  label,
  sublabel,
  className = "",
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-full bg-neu-base shadow-neu-flat select-none p-3"
        style={{ width: size + 24, height: size + 24 }}
      >
        {/* Recessed Circular Ring Trench */}
        <div
          className="absolute inset-2 rounded-full bg-neu-base shadow-neu-pressed flex items-center justify-center"
        >
          {/* SVG Progress Circle with Gradient */}
          <svg width={size} height={size} className="transform -rotate-90">
            <defs>
              <linearGradient id="neuProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0A84FF" />
                <stop offset="100%" stopColor="#007BFF" />
              </linearGradient>
            </defs>

            {/* Inactive Track Ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="transparent"
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {/* Active Electric Blue Progress Arc */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#neuProgressGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500 ease-out drop-shadow-[0_2px_6px_rgba(0,123,255,0.45)]"
            />
          </svg>
        </div>

        {/* Extruded Center Hub */}
        <div
          className="relative rounded-full bg-neu-base shadow-neu-flat flex flex-col items-center justify-center z-10 text-center"
          style={{ width: size - strokeWidth * 2 - 8, height: size - strokeWidth * 2 - 8 }}
        >
          <span className="text-xl font-black font-mono text-neu-blue tracking-tighter">
            {clampedProgress}%
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-neu-text-muted">
            PROGRESS
          </span>
        </div>
      </div>

      {(label || sublabel) && (
        <div className="text-center mt-3">
          {label && (
            <h5 className="text-xs font-bold uppercase tracking-wider text-neu-text-primary">
              {label}
            </h5>
          )}
          {sublabel && <p className="text-[11px] text-neu-text-muted mt-0.5">{sublabel}</p>}
        </div>
      )}
    </div>
  );
};
