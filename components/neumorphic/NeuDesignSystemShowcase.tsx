"use client";

import React, { useState } from "react";
import {
  NeuButton,
  NeuIconButtonSuite,
  NeuSegmentedControl,
  NeuDropdown,
  NeuStackedList,
  NeuSlider,
  NeuToggle,
  NeuCheckbox,
  NeuRadioGroup,
  NeuTooltip,
  NeuSpeechBubble,
  NeuProgressRing,
  NeuProfileCard,
  NeuNotificationCard,
} from "@/components/neumorphic";
import {
  Sparkles,
  Copy,
  Check,
  Boxes,
  Smartphone,
  CreditCard,
} from "lucide-react";

export const NeuDesignSystemShowcase: React.FC = () => {
  // Interactive States
  const [activeMenu, setActiveMenu] = useState("MENU 1");
  const [selectedDropdown, setSelectedDropdown] = useState("OPTION 1");
  const [sliderValue, setSliderValue] = useState(65);
  const [toggleActive, setToggleActive] = useState(true);
  const [toggleInactive, setToggleInactive] = useState(false);
  const [checkboxA, setCheckboxA] = useState(true);
  const [checkboxB, setCheckboxB] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState("standard");
  const [progressValue, setProgressValue] = useState(75);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"showcase" | "tokens" | "code">("showcase");

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  // Stacked list mock data
  const stackedListItems = [
    {
      id: "item-1",
      title: "Shah Alami Central Godown A",
      subtitle: "Rack 04 • 14,200 wholesale units in stock",
      icon: Boxes,
      badge: "85% FULL",
      onClick: () => {},
    },
    {
      id: "item-2",
      title: "B2B Dispatch Queue #ORD-948104",
      subtitle: "Haji Rafiq & Sons • 200 Fast Chargers",
      icon: Smartphone,
      badge: "READY",
      onClick: () => {},
    },
    {
      id: "item-3",
      title: "FBR Digital Tax Invoice Batch",
      subtitle: "18 transactions reconciled via POS API",
      icon: CreditCard,
      badge: "VERIFIED",
      onClick: () => {},
    },
  ];

  return (
    <div className="min-h-screen bg-neu-base text-neu-text-primary p-4 sm:p-8 lg:p-12 transition-colors">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neu-base shadow-neu-pressed-sm text-neu-blue text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Soft UI / Neumorphic Design System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neu-text-primary">
            Monochromatic Dual-Shadow <br className="hidden sm:block" />
            <span className="text-neu-blue">Extruded Canvas</span>
          </h1>

          <p className="text-sm sm:text-base text-neu-text-muted leading-relaxed">
            Emulating physical, tactile surfaces extruded from a single lavender-grey canvas (
            <code className="text-neu-blue font-mono font-bold">#EDEBF8</code>) illuminated by a top-left 45° dual light-source. Zero 1px borders.
          </p>

          {/* Tab Switcher */}
          <div className="pt-4 flex justify-center">
            <NeuSegmentedControl
              options={[
                { id: "showcase", label: "COMPONENT SUITE" },
                { id: "tokens", label: "DESIGN TOKENS" },
                { id: "code", label: "TAILWIND CONFIG" },
              ]}
              activeId={activeTab}
              onChange={(id) => setActiveTab(id as "showcase" | "tokens" | "code")}
            />
          </div>
        </div>

        {activeTab === "showcase" && (
          <div className="space-y-12">
            {/* 1. BUTTON SUITE */}
            <section className="p-6 sm:p-8 rounded-3xl bg-neu-base shadow-neu-flat space-y-6">
              <div className="flex items-center justify-between border-0 pb-2">
                <div>
                  <h2 className="text-lg font-bold text-neu-text-primary uppercase tracking-wider flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-neu-blue shadow-neu-blue-glow" />
                    1. Button Suite
                  </h2>
                  <p className="text-xs text-neu-text-muted mt-1">
                    Raised standard, pressed recessed, disabled state, and square utility icon buttons.
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-neu-base shadow-neu-pressed-sm text-neu-blue">
                  PHYSICS: TOP-LEFT 45°
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
                {/* Standard Raised Button */}
                <div className="p-5 rounded-2xl bg-neu-base shadow-neu-pressed-sm flex flex-col items-center justify-center gap-3 text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neu-text-muted">
                    STANDARD RAISED
                  </span>
                  <NeuButton variant="raised" size="md">
                    BUTTON
                  </NeuButton>
                  <span className="text-[10px] text-neu-text-muted font-mono">shadow-neu-flat</span>
                </div>

                {/* Pressed / Recessed Button */}
                <div className="p-5 rounded-2xl bg-neu-base shadow-neu-pressed-sm flex flex-col items-center justify-center gap-3 text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neu-text-muted">
                    RECESSED / PRESSED
                  </span>
                  <NeuButton variant="pressed" size="md">
                    PRESSED
                  </NeuButton>
                  <span className="text-[10px] text-neu-text-muted font-mono">shadow-neu-pressed</span>
                </div>

                {/* Disabled Button */}
                <div className="p-5 rounded-2xl bg-neu-base shadow-neu-pressed-sm flex flex-col items-center justify-center gap-3 text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neu-text-muted">
                    DISABLED
                  </span>
                  <NeuButton variant="disabled" size="md" disabled>
                    DISABLED
                  </NeuButton>
                  <span className="text-[10px] text-neu-text-muted font-mono">text-neu-disabled</span>
                </div>

                {/* Square Utility Icon Buttons (<, X, >) */}
                <div className="p-5 rounded-2xl bg-neu-base shadow-neu-pressed-sm flex flex-col items-center justify-center gap-3 text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neu-text-muted">
                    SQUARE ICON SUITE
                  </span>
                  <NeuIconButtonSuite />
                  <span className="text-[10px] text-neu-text-muted font-mono">&lt; , X , &gt;</span>
                </div>
              </div>
            </section>

            {/* 2. NAVIGATION & CONTROLS */}
            <section className="p-6 sm:p-8 rounded-3xl bg-neu-base shadow-neu-flat space-y-8">
              <div>
                <h2 className="text-lg font-bold text-neu-text-primary uppercase tracking-wider flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-neu-blue shadow-neu-blue-glow" />
                  2. Navigation & Controls
                </h2>
                <p className="text-xs text-neu-text-muted mt-1">
                  Recessed segmented bar, neumorphic dropdown selector, and stacked list items with chevrons.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Segmented Control Bar & Dropdown */}
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-neu-base shadow-neu-pressed-sm space-y-4">
                    <span className="block text-xs font-bold uppercase tracking-wider text-neu-text-muted">
                      Segmented Control Bar (MENU 1, MENU 2, MENU 3)
                    </span>
                    <NeuSegmentedControl
                      options={["MENU 1", "MENU 2", "MENU 3"]}
                      activeId={activeMenu}
                      onChange={setActiveMenu}
                    />
                    <div className="text-[11px] text-neu-text-muted font-mono pt-1">
                      Active: <span className="text-neu-blue font-bold">{activeMenu}</span>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-neu-base shadow-neu-pressed-sm space-y-4">
                    <span className="block text-xs font-bold uppercase tracking-wider text-neu-text-muted">
                      Neumorphic Dropdown Selector
                    </span>
                    <NeuDropdown
                      options={[
                        { value: "OPTION 1", label: "OPTION 1" },
                        { value: "OPTION 2", label: "OPTION 2" },
                        { value: "OPTION 3", label: "OPTION 3" },
                        { value: "OPTION 4", label: "OPTION 4" },
                      ]}
                      value={selectedDropdown}
                      onChange={setSelectedDropdown}
                      label="SELECT OPTION"
                    />
                  </div>
                </div>

                {/* Stacked List Card Items */}
                <div className="p-6 rounded-2xl bg-neu-base shadow-neu-pressed-sm space-y-4">
                  <span className="block text-xs font-bold uppercase tracking-wider text-neu-text-muted">
                    Stacked List Card Items with Navigation Chevrons
                  </span>
                  <NeuStackedList items={stackedListItems} />
                </div>
              </div>
            </section>

            {/* 3. FORM & INTERACTIVE INPUTS */}
            <section className="p-6 sm:p-8 rounded-3xl bg-neu-base shadow-neu-flat space-y-8">
              <div>
                <h2 className="text-lg font-bold text-neu-text-primary uppercase tracking-wider flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-neu-blue shadow-neu-blue-glow" />
                  3. Form & Interactive Inputs
                </h2>
                <p className="text-xs text-neu-text-muted mt-1">
                  Horizontal slider with draggable thumb, toggle switch, and tactile checkboxes & radio buttons.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Horizontal Slider */}
                <div className="p-6 rounded-2xl bg-neu-base shadow-neu-pressed-sm space-y-6 flex flex-col justify-between">
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-neu-text-muted mb-4">
                      Horizontal Slider
                    </span>
                    <NeuSlider
                      min={0}
                      max={100}
                      value={sliderValue}
                      onChange={setSliderValue}
                      label="VOLUME / CAPACITY"
                      unit="%"
                    />
                  </div>
                  <p className="text-[11px] text-neu-text-muted leading-relaxed">
                    Recessed track with extruded draggable round thumb and vivid electric blue active fill.
                  </p>
                </div>

                {/* Toggle Switch */}
                <div className="p-6 rounded-2xl bg-neu-base shadow-neu-pressed-sm space-y-5 flex flex-col justify-between">
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-neu-text-muted mb-4">
                      Toggle Switch (Inactive vs Active)
                    </span>
                    <div className="space-y-4">
                      <NeuToggle
                        checked={toggleActive}
                        onChange={setToggleActive}
                        label="ACTIVE STATE"
                        sublabel="Electric blue fill with thumb slide"
                      />
                      <NeuToggle
                        checked={toggleInactive}
                        onChange={setToggleInactive}
                        label="INACTIVE STATE"
                        sublabel="Monochromatic recessed resting state"
                      />
                    </div>
                  </div>
                </div>

                {/* Checkbox & Radio Buttons */}
                <div className="p-6 rounded-2xl bg-neu-base shadow-neu-pressed-sm space-y-5">
                  <span className="block text-xs font-bold uppercase tracking-wider text-neu-text-muted">
                    Checkboxes & Radio Group
                  </span>
                  <div className="space-y-3 pb-2">
                    <NeuCheckbox
                      checked={checkboxA}
                      onChange={setCheckboxA}
                      label="AUTO RE-ORDER (CHECKED)"
                    />
                    <NeuCheckbox
                      checked={checkboxB}
                      onChange={setCheckboxB}
                      label="NOTIFY SALES REP (UNCHECKED)"
                    />
                  </div>
                  <div className="pt-2 border-0">
                    <NeuRadioGroup
                      name="pricing-tier"
                      selectedValue={selectedRadio}
                      onChange={setSelectedRadio}
                      options={[
                        { value: "standard", label: "WHOLESALE TIER 1" },
                        { value: "special", label: "DISTRIBUTOR TIER 2" },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* 4. FEEDBACK, CARDS & PROFILING */}
            <section className="p-6 sm:p-8 rounded-3xl bg-neu-base shadow-neu-flat space-y-8">
              <div>
                <h2 className="text-lg font-bold text-neu-text-primary uppercase tracking-wider flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-neu-blue shadow-neu-blue-glow" />
                  4. Feedback, Cards & Profiling
                </h2>
                <p className="text-xs text-neu-text-muted mt-1">
                  Speech-bubble tooltip, radial progress loader ring, user profile card, and notification card.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Tooltip & Progress Ring Column */}
                <div className="space-y-6">
                  {/* Speech Bubble Floating Tooltip */}
                  <div className="p-6 rounded-2xl bg-neu-base shadow-neu-pressed-sm flex flex-col items-center justify-center text-center space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-neu-text-muted">
                      Speech-Bubble Floating Tooltip
                    </span>
                    <div className="py-4">
                      <NeuSpeechBubble text="TOOL TIP" />
                    </div>
                    <div className="pt-2">
                      <NeuTooltip content="Interactive Extruded Hover Tooltip" position="top">
                        <NeuButton variant="raised" size="sm">
                          HOVER FOR TOOLTIP
                        </NeuButton>
                      </NeuTooltip>
                    </div>
                  </div>

                  {/* Circular Radial Progress Loader */}
                  <div className="p-6 rounded-2xl bg-neu-base shadow-neu-pressed-sm flex flex-col items-center justify-center text-center space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-neu-text-muted">
                      Circular Radial Progress Loader
                    </span>
                    <NeuProgressRing
                      progress={progressValue}
                      size={130}
                      label="GODOWN STORAGE"
                      sublabel="Shah Alami Hub Capacity"
                    />
                    <div className="w-full pt-2">
                      <NeuSlider
                        min={0}
                        max={100}
                        value={progressValue}
                        onChange={setProgressValue}
                        label="ADJUST PROGRESS"
                        unit="%"
                      />
                    </div>
                  </div>
                </div>

                {/* User Profile Card */}
                <div className="flex justify-center">
                  <NeuProfileCard
                    name="Jonathan Doe"
                    role="Lead UI / UX Architect"
                    location="Shah Alami Wholesale Hub"
                    isVerified={true}
                  />
                </div>

                {/* Notification / Message Card */}
                <div className="space-y-4">
                  <span className="block text-xs font-bold uppercase tracking-wider text-neu-text-muted px-1">
                    Notification / Message Cards
                  </span>
                  <NeuNotificationCard
                    title="Inward Stock Consignment Received"
                    timestamp="12:00 PM"
                    preview="Your shipment of 500 Fast Charging Hubs has safely arrived at Shah Alami Godown Gate 2 and is ready for bin allocation."
                    category="LOGISTICS"
                    isUnread={true}
                    onAction={() => {}}
                  />
                  <NeuNotificationCard
                    title="B2B Khata Receipt Cleared"
                    timestamp="10:45 AM"
                    preview="PKR 85,000 received from Lahore Electronics via Habib Bank online transfer."
                    category="FINANCE"
                    isUnread={false}
                    onAction={() => {}}
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TOKENS TAB */}
        {activeTab === "tokens" && (
          <div className="space-y-8">
            {/* Color Palette Grid */}
            <div className="p-6 sm:p-8 rounded-3xl bg-neu-base shadow-neu-flat space-y-6">
              <h2 className="text-lg font-bold text-neu-text-primary uppercase tracking-wider">
                1. Monochromatic Color Tokens
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: "neu-base", hex: "#EDEBF8", desc: "Main Canvas Background" },
                  { name: "neu-surface", hex: "#E9E8F4", desc: "Secondary Surface" },
                  { name: "neu-blue", hex: "#007BFF", desc: "Electric Blue Accent" },
                  { name: "neu-blue-hover", hex: "#0A84FF", desc: "Active Accent Hover" },
                  { name: "neu-text-primary", hex: "#6C7293", desc: "Primary Text" },
                  { name: "neu-text-muted", hex: "#7E8299", desc: "Muted Text & Labels" },
                  { name: "neu-disabled", hex: "#B8BAC7", desc: "Disabled Elements" },
                  { name: "neu-shadowdark", hex: "#C5C3D8", desc: "Dark Cast Shadow" },
                ].map((col) => (
                  <div
                    key={col.name}
                    className="p-4 rounded-2xl bg-neu-base shadow-neu-flat hover:shadow-neu-flat-lg transition-all flex flex-col justify-between h-32 select-none"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="w-7 h-7 rounded-xl shadow-neu-flat-sm border-0"
                        style={{ backgroundColor: col.hex }}
                      />
                      <button
                        type="button"
                        onClick={() => handleCopy(col.hex, col.name)}
                        className="p-1.5 rounded-lg bg-neu-base shadow-neu-flat-sm hover:text-neu-blue active:shadow-neu-pressed transition-all"
                        title="Copy hex code"
                      >
                        {copiedToken === col.name ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-neu-text-muted" />
                        )}
                      </button>
                    </div>
                    <div>
                      <span className="block text-xs font-bold uppercase tracking-wider text-neu-text-primary font-mono">
                        {col.name}
                      </span>
                      <span className="block text-[11px] font-mono text-neu-blue font-bold">
                        {col.hex}
                      </span>
                      <span className="block text-[10px] text-neu-text-muted mt-0.5">{col.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dual Light Source Box Shadows */}
            <div className="p-6 sm:p-8 rounded-3xl bg-neu-base shadow-neu-flat space-y-6">
              <h2 className="text-lg font-bold text-neu-text-primary uppercase tracking-wider">
                2. Dual Light-Source Box Shadows (Top-Left 45°)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: "shadow-neu-flat",
                    type: "Elevated / Raised",
                    css: "-6px -6px 14px #FFFFFF, 6px 6px 14px #C5C3D8",
                    previewClass: "shadow-neu-flat",
                  },
                  {
                    name: "shadow-neu-flat-sm",
                    type: "Subtle Raised Icons",
                    css: "-3px -3px 8px #FFFFFF, 3px 3px 8px #C5C3D8",
                    previewClass: "shadow-neu-flat-sm",
                  },
                  {
                    name: "shadow-neu-pressed",
                    type: "Inset / Sunken Track",
                    css: "inset 4px 4px 8px #C5C3D8, inset -4px -4px 8px #FFFFFF",
                    previewClass: "shadow-neu-pressed",
                  },
                  {
                    name: "shadow-neu-pressed-sm",
                    type: "Small Inset Box",
                    css: "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF",
                    previewClass: "shadow-neu-pressed-sm",
                  },
                  {
                    name: "shadow-neu-blue-glow",
                    type: "Electric Blue Glow",
                    css: "-4px -4px 12px #FFFFFF, 4px 4px 14px rgba(0, 123, 255, 0.35)",
                    previewClass: "shadow-neu-blue-glow bg-neu-blue text-white",
                  },
                  {
                    name: "shadow-neu-flat-lg",
                    type: "Deep Modal / Card",
                    css: "-10px -10px 22px #FFFFFF, 10px 10px 22px #C5C3D8",
                    previewClass: "shadow-neu-flat-lg",
                  },
                ].map((s) => (
                  <div
                    key={s.name}
                    className="p-6 rounded-2xl bg-neu-base shadow-neu-pressed-sm space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-neu-text-primary">
                        {s.type}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(s.css, s.name)}
                        className="p-1.5 rounded-lg bg-neu-base shadow-neu-flat-sm hover:text-neu-blue active:shadow-neu-pressed transition-all"
                        title="Copy CSS box-shadow"
                      >
                        {copiedToken === s.name ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-neu-text-muted" />
                        )}
                      </button>
                    </div>

                    <div
                      className={`w-full h-16 rounded-2xl bg-neu-base flex items-center justify-center font-mono font-bold text-xs ${s.previewClass}`}
                    >
                      {s.name}
                    </div>

                    <p className="text-[11px] font-mono text-neu-text-muted break-all leading-tight">
                      box-shadow: {s.css}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CODE CONFIG TAB */}
        {activeTab === "code" && (
          <div className="p-6 sm:p-8 rounded-3xl bg-neu-base shadow-neu-flat space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-neu-text-primary uppercase tracking-wider">
                Tailwind CSS Configuration (`tailwind.config.ts`)
              </h2>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    `// tailwind.config.ts
colors: {
  neu: {
    base: "#EDEBF8",
    surface: "#E9E8F4",
    blue: "#007BFF",
    "blue-hover": "#0A84FF",
    "text-primary": "#6C7293",
    "text-muted": "#7E8299",
    disabled: "#B8BAC7",
  },
},
boxShadow: {
  "neu-flat": "-6px -6px 14px #FFFFFF, 6px 6px 14px #C5C3D8",
  "neu-flat-sm": "-3px -3px 8px #FFFFFF, 3px 3px 8px #C5C3D8",
  "neu-pressed": "inset 4px 4px 8px #C5C3D8, inset -4px -4px 8px #FFFFFF",
  "neu-pressed-sm": "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF",
  "neu-toggle-active": "-4px -4px 10px #FFFFFF, 4px 4px 10px rgba(0, 123, 255, 0.45)",
}`,
                    "full-config"
                  )
                }
                className="px-4 py-2 rounded-xl bg-neu-base text-xs font-bold uppercase tracking-wider text-neu-blue shadow-neu-flat hover:shadow-neu-flat-lg active:shadow-neu-pressed transition-all flex items-center gap-1.5"
              >
                {copiedToken === "full-config" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>COPIED CONFIG</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>COPY CODE</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-6 rounded-2xl bg-neu-base shadow-neu-pressed text-xs sm:text-sm font-mono text-neu-text-primary overflow-x-auto leading-relaxed border-0">
              <code>{`// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        neu: {
          base: "#EDEBF8",
          surface: "#E9E8F4",
          blue: "#007BFF",
          "blue-hover": "#0A84FF",
          "text-primary": "#6C7293",
          "text-muted": "#7E8299",
          disabled: "#B8BAC7",
        },
      },
      boxShadow: {
        // Dual Light-Source Physics from Top-Left 45°
        "neu-flat": "-6px -6px 14px #FFFFFF, 6px 6px 14px #C5C3D8",
        "neu-flat-sm": "-3px -3px 8px #FFFFFF, 3px 3px 8px #C5C3D8",
        "neu-flat-lg": "-10px -10px 22px #FFFFFF, 10px 10px 22px #C5C3D8",
        "neu-pressed": "inset 4px 4px 8px #C5C3D8, inset -4px -4px 8px #FFFFFF",
        "neu-pressed-sm": "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF",
        "neu-toggle-active": "-4px -4px 10px #FFFFFF, 4px 4px 10px rgba(0, 123, 255, 0.45)",
        "neu-blue-glow": "-4px -4px 12px #FFFFFF, 4px 4px 14px rgba(0, 123, 255, 0.35)",
      },
    },
  },
};

export default config;`}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
