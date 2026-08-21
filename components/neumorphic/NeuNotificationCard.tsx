"use client";

import React, { useState } from "react";
import { Bell, Clock, Check, ArrowUpRight } from "lucide-react";

export interface NeuNotificationCardProps {
  title?: string;
  timestamp?: string;
  preview?: string;
  category?: string;
  isUnread?: boolean;
  onAction?: () => void;
  className?: string;
}

export const NeuNotificationCard: React.FC<NeuNotificationCardProps> = ({
  title = "Inward Stock Consignment Received",
  timestamp = "12:00 PM",
  preview = "Your shipment of 500 Fast Charging Hubs has safely arrived at Shah Alami Godown Gate 2 and is ready for bin allocation.",
  category = "LOGISTICS",
  isUnread = true,
  onAction,
  className = "",
}) => {
  const [unread, setUnread] = useState(isUnread);

  return (
    <div
      className={`w-full p-5 sm:p-6 rounded-2xl bg-neu-base shadow-neu-flat hover:shadow-neu-flat-lg transition-all duration-200 border-0 select-none ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {/* Category Icon */}
          <div className="w-10 h-10 rounded-xl bg-neu-base shadow-neu-flat-sm flex items-center justify-center text-neu-blue shrink-0">
            <Bell className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neu-base shadow-neu-pressed-sm text-neu-blue">
                {category}
              </span>
              {unread && (
                <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  NEW
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-neu-text-primary mt-1">{title}</h4>
          </div>
        </div>

        {/* Timestamp */}
        <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-neu-text-muted px-2.5 py-1 rounded-full bg-neu-base shadow-neu-pressed-sm shrink-0">
          <Clock className="w-3 h-3 text-neu-blue" />
          <span>{timestamp}</span>
        </div>
      </div>

      {/* Message Copy */}
      <p className="text-xs sm:text-sm text-neu-text-muted leading-relaxed mb-4 pl-1">
        {preview}
      </p>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2 border-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUnread(!unread)}
            className="px-3.5 py-1.5 rounded-xl bg-neu-base text-[11px] font-bold uppercase tracking-wider text-neu-text-muted shadow-neu-flat-sm hover:text-neu-blue hover:shadow-neu-flat active:shadow-neu-pressed border-0 outline-none cursor-pointer transition-all flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 text-neu-blue" />
            <span>{unread ? "Mark Read" : "Mark Unread"}</span>
          </button>
        </div>

        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="px-4 py-1.5 rounded-xl bg-neu-base text-[11px] font-bold uppercase tracking-wider text-neu-blue shadow-neu-flat hover:shadow-neu-flat-lg active:shadow-neu-pressed border-0 outline-none cursor-pointer transition-all flex items-center gap-1"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
