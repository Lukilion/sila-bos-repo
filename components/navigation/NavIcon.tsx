"use client";

import React from "react";
import {
  LayoutDashboard,
  Warehouse,
  ShoppingBag,
  BookOpenCheck,
  Coins,
  PackageSearch,
  Grid,
  TrendingUp,
  ShieldAlert,
  Menu,
  X,
  Search,
  Plus,
  Bell,
  AlertTriangle,
  Moon,
  Sun,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  FilePlus,
  Truck,
  ReceiptText,
  ArrowLeftRight,
  Download,
  LogOut,
  User,
  Settings,
  Sliders,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Keyboard,
  Shield,
  Layers,
  ArrowUpRight,
  Box,
  LucideProps,
} from "lucide-react";

export const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  LayoutDashboard,
  Warehouse,
  ShoppingBag,
  BookOpenCheck,
  Coins,
  PackageSearch,
  Grid,
  TrendingUp,
  ShieldAlert,
  Menu,
  X,
  Search,
  Plus,
  Bell,
  AlertTriangle,
  Moon,
  Sun,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  FilePlus,
  Truck,
  ReceiptText,
  ArrowLeftRight,
  Download,
  LogOut,
  User,
  Settings,
  Sliders,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Keyboard,
  Shield,
  Layers,
  ArrowUpRight,
  Box,
};

interface NavIconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

export function NavIcon({ name, className = "w-5 h-5", size, color, strokeWidth = 2, style }: NavIconProps) {
  const Component = ICON_MAP[name] || Box;
  return (
    <Component
      className={className}
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      style={style}
      aria-hidden="true"
    />
  );
}
