import React from "react";
import { NeuDesignSystemShowcase } from "@/components/neumorphic/NeuDesignSystemShowcase";

export const metadata = {
  title: "Neumorphic (Soft UI) Design System | Sila BOS",
  description: "Monochromatic dual-shadow extruded Soft UI component library",
};

export default function DesignSystemPage() {
  return (
    <div className="rounded-3xl overflow-hidden shadow-neu-flat">
      <NeuDesignSystemShowcase />
    </div>
  );
}
