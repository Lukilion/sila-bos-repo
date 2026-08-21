// tailwind.config.ts
import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

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
          base: "#EDEBF8",
          surface: "#E9E8F4",
          blue: "#007BFF",
          "blue-hover": "#0A84FF",
          "nav-icon": "#15a0fa",
          sky: "#15a0fa",
          "text-primary": "#6C7293",
          "text-muted": "#7E8299",
          disabled: "#B8BAC7",
          // Backward-compatibility aliases
          pressed: "#E2E0EE",
          light: "#FFFFFF",
          shadowlight: "#FFFFFF",
          shadowdark: "#C5C3D8",
          accent: "#007BFF",
          "accent-2": "#0A84FF",
          text: "#6C7293",
          muted: "#7E8299",
        },
      },
      boxShadow: {
        // Dual Light-Source Physics from Top-Left 45°
        // Raised surfaces
        "neu-flat": "-6px -6px 14px #FFFFFF, 6px 6px 14px #C5C3D8",
        "neu-flat-sm": "-3px -3px 8px #FFFFFF, 3px 3px 8px #C5C3D8",
        "neu-flat-lg": "-10px -10px 22px #FFFFFF, 10px 10px 22px #C5C3D8",
        // Inset / Sunken / Pressed states
        "neu-pressed": "inset 4px 4px 8px #C5C3D8, inset -4px -4px 8px #FFFFFF",
        "neu-pressed-sm": "inset 2px 2px 5px #C5C3D8, inset -2px -2px 5px #FFFFFF",
        "neu-pressed-lg": "inset 6px 6px 12px #C5C3D8, inset -6px -6px 12px #FFFFFF",
        // Active Indicators & Glows
        "neu-toggle-active": "-4px -4px 10px #FFFFFF, 4px 4px 10px rgba(0, 123, 255, 0.45)",
        "neu-blue-glow": "-4px -4px 12px #FFFFFF, 4px 4px 14px rgba(0, 123, 255, 0.35)",
        "neu-thumb": "-2px -2px 5px #FFFFFF, 2px 2px 5px #C5C3D8",
        "neu-tooltip": "-4px -4px 10px #FFFFFF, 4px 4px 10px #C5C3D8",
        // Extruded aliases
        "neu-extruded": "-6px -6px 14px #FFFFFF, 6px 6px 14px #C5C3D8",
        "neu-extruded-sm": "-3px -3px 8px #FFFFFF, 3px 3px 8px #C5C3D8",
        "neu-inset": "inset 4px 4px 8px #C5C3D8, inset -4px -4px 8px #FFFFFF",
        "neu-inset-deep": "inset 6px 6px 12px #C5C3D8, inset -6px -6px 12px #FFFFFF",
        "neu-accent-glow": "-4px -4px 10px #FFFFFF, 4px 4px 12px rgba(0, 123, 255, 0.4)",
      },
      backgroundImage: {
        "neu-accent-gradient": "linear-gradient(135deg, #0A84FF 0%, #007BFF 100%)",
        "neu-radial-blue": "radial-gradient(circle at 30% 30%, #3395FF, #007BFF)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "SF Pro Display", "-apple-system", "sans-serif"],
        nastaleeq: ["var(--font-noto-nastaleeq)", "Jameel Noori Nastaleeq", "serif"],
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
