// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neu: {
          base: "#EBECF5",
          surface: "#EBECF5",
          pressed: "#F2F3F9",
          light: "#FFFFFF",
          shadowlight: "rgba(255,255,255,0.9)",
          shadowdark: "rgba(166,171,189,0.4)",
          accent: "#5E5CE6",
          "accent-2": "#6C5CE7",
          text: "#1f2433",
          muted: "#9BA1BA",
        },
      },
      boxShadow: {
        // Extruded Neumorphic Card & Button Container (soft, low-contrast)
        "neu-extruded": "-8px -8px 16px rgba(255, 255, 255, 0.9), 8px 8px 16px rgba(166, 171, 189, 0.4)",
        // Subtle Raised Elements
        "neu-extruded-sm": "-4px -4px 8px rgba(255, 255, 255, 0.8), 4px 4px 8px rgba(166, 171, 189, 0.3)",
        // Inset / Sunken Form Field Control
        "neu-inset": "inset 4px 4px 8px rgba(166, 171, 189, 0.4), inset -4px -4px 8px rgba(255, 255, 255, 0.9)",
        "neu-inset-deep": "inset 6px 6px 12px rgba(166, 171, 189, 0.5), inset -6px -6px 12px rgba(255, 255, 255, 0.95)",
        // Active Primary Button (colored glow)
        "neu-accent-glow": "-4px -4px 10px rgba(255, 255, 255, 0.7), 4px 4px 12px rgba(94, 92, 230, 0.35)",
      },
      backgroundImage: {
        "neu-accent-gradient": "linear-gradient(135deg, #6E56F8 0%, #4D38DC 100%)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        nastaleeq: ["var(--font-noto-nastaleeq)", "Jameel Noori Nastaleeq", "serif"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
