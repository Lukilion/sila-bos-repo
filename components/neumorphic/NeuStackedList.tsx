"use client";

import React from "react";
import { ChevronRight, LucideIcon } from "lucide-react";

export interface StackedListItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  badge?: string;
  onClick?: () => void;
}

export interface NeuStackedListProps {
  items: StackedListItem[];
  className?: string;
}

export const NeuStackedList: React.FC<NeuStackedListProps> = ({ items, className = "" }) => {
  return (
    <div className={`space-y-3 w-full ${className}`}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            onClick={item.onClick}
            role="button"
            tabIndex={0}
            className="w-full p-4 rounded-2xl bg-neu-base shadow-neu-flat hover:shadow-neu-flat-lg active:shadow-neu-pressed transition-all duration-200 ease-in-out cursor-pointer flex items-center justify-between gap-4 border-0 select-none group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              {Icon && (
                <div className="w-10 h-10 rounded-xl bg-neu-base shadow-neu-flat-sm group-hover:shadow-neu-flat group-active:shadow-neu-pressed flex items-center justify-center shrink-0 text-neu-blue transition-all">
                  <Icon className="w-5 h-5" />
                </div>
              )}
              <div className="truncate">
                <h4 className="text-sm font-bold text-neu-text-primary group-hover:text-neu-blue transition-colors truncate">
                  {item.title}
                </h4>
                {item.subtitle && (
                  <p className="text-xs text-neu-text-muted mt-0.5 truncate">{item.subtitle}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {item.badge && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neu-base shadow-neu-pressed-sm text-neu-blue">
                  {item.badge}
                </span>
              )}
              <div className="w-8 h-8 rounded-xl bg-neu-base shadow-neu-flat-sm group-hover:shadow-neu-flat group-active:shadow-neu-pressed flex items-center justify-center text-neu-text-muted group-hover:text-neu-blue transition-all">
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
