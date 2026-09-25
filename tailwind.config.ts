import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0E0E0E",
        surface: {
          DEFAULT: "#151515",
          hover: "#181818",
          elevated: "#1D1D1D",
          subtle: "#121212",
        },
        border: {
          DEFAULT: "#292929",
          subtle: "#1E1E1E",
          hover: "#383838",
        },
        primary: {
          DEFAULT: "#F1F1EF",
          muted: "#999999",
          faint: "#555555",
        },
        accent: {
          DEFAULT: "#D7F24A",
          hover: "#C3DE3E",
          faint: "rgba(215, 242, 74, 0.12)",
        },
        priority: {
          critical: "#FF453A",
          high: "#FF9F0A",
          normal: "#64D2FF",
          low: "#636366",
        }
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Segoe UI",
          "Inter",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "SF Mono",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      animation: {
        "pulse-subtle": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "wave-bar": "wave 1.2s ease-in-out infinite alternate",
      },
      keyframes: {
        wave: {
          "0%": { height: "20%" },
          "100%": { height: "100%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
