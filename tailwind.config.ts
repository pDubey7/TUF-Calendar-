import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cal: {
          blue: "#2563eb",
          "blue-light": "#93c5fd",
          "blue-dark": "#1e40af",
          coral: "#f87171",
          "coral-muted": "#fecaca",
          grey: "#9ca3af",
          "grey-light": "#f3f4f6",
          "dark-bg": "#0f172a",
          "dark-card": "#1e293b",
          "dark-surface": "#334155",
          accent: "var(--cal-accent, #2563eb)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "saved-flash": "savedFlash 1.5s ease-in-out",
        "dot-pulse": "dotPulse 2s ease-in-out infinite",
      },
      keyframes: {
        savedFlash: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "20%": { opacity: "1", transform: "translateY(0)" },
          "80%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-4px)" },
        },
        dotPulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
