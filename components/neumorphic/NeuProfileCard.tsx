"use client";

import React, { useState } from "react";
import { CheckCircle2, MapPin, Share2, Shield } from "lucide-react";
import { NeuButton } from "./NeuButton";

export interface NeuProfileCardProps {
  name?: string;
  role?: string;
  location?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  stats?: { label: string; value: string }[];
  className?: string;
}

export const NeuProfileCard: React.FC<NeuProfileCardProps> = ({
  name = "Jonathan Doe",
  role = "Lead UI / UX Architect",
  location = "Shah Alami Wholesale Hub",
  isVerified = true,
  stats = [
    { label: "PROJECTS", value: "142" },
    { label: "RATING", value: "4.9" },
    { label: "ORDERS", value: "2.4K" },
  ],
  className = "",
}) => {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div
      className={`relative w-full max-w-sm rounded-3xl bg-neu-base shadow-neu-flat p-6 sm:p-7 border-0 text-center select-none ${className}`}
    >
      {/* Top Action Icons */}
      <div className="flex items-center justify-between mb-4">
        <div className="w-9 h-9 rounded-xl bg-neu-base shadow-neu-flat-sm flex items-center justify-center text-neu-blue">
          <Shield className="w-4 h-4" />
        </div>
        <button
          type="button"
          aria-label="Share profile"
          className="w-9 h-9 rounded-xl bg-neu-base shadow-neu-flat-sm hover:shadow-neu-flat active:shadow-neu-pressed flex items-center justify-center text-neu-text-muted hover:text-neu-blue border-0 outline-none cursor-pointer transition-all"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Avatar Container with Inset & Flat Physics */}
      <div className="relative mx-auto w-24 h-24 rounded-full bg-neu-base shadow-neu-pressed p-1.5 flex items-center justify-center mb-4">
        <div className="relative w-full h-full rounded-full bg-neu-base shadow-neu-flat overflow-hidden flex items-center justify-center group">
          {/* Avatar Graphic or Initials */}
          <div className="w-full h-full bg-gradient-to-tr from-neu-surface to-neu-base flex items-center justify-center text-neu-blue font-black text-2xl font-mono">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
        </div>

        {/* Blue Verified Badge */}
        {isVerified && (
          <div
            title="Verified Profile"
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-neu-base shadow-neu-flat flex items-center justify-center"
          >
            <CheckCircle2 className="w-5 h-5 text-neu-blue fill-neu-blue/10" />
          </div>
        )}
      </div>

      {/* Identity Information */}
      <div className="space-y-1 mb-4">
        <div className="inline-flex items-center justify-center gap-1.5">
          <h3 className="text-lg font-bold text-neu-text-primary tracking-tight">{name}</h3>
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-neu-blue">{role}</p>
        <div className="flex items-center justify-center gap-1 text-[11px] text-neu-text-muted pt-0.5">
          <MapPin className="w-3.5 h-3.5" />
          <span>{location}</span>
        </div>
      </div>

      {/* Metrics / Stats Row */}
      <div className="grid grid-cols-3 gap-2.5 p-2 rounded-2xl bg-neu-base shadow-neu-pressed mb-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-2 text-center">
            <span className="block text-sm font-black font-mono text-neu-text-primary">
              {stat.value}
            </span>
            <span className="block text-[9px] font-bold tracking-wider uppercase text-neu-text-muted mt-0.5">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3">
        <NeuButton
          variant={isFollowing ? "pressed" : "raised"}
          size="sm"
          onClick={() => setIsFollowing(!isFollowing)}
          className="flex-1"
        >
          {isFollowing ? "CONNECTED" : "CONNECT"}
        </NeuButton>
        <NeuButton variant="accent" size="sm" className="px-5">
          MESSAGE
        </NeuButton>
      </div>
    </div>
  );
};
