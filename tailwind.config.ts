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
        background: "#08090B",
        surface: {
          DEFAULT: "#0C0D12",
          card: "#0F1117",
          hover: "#151822",
          elevated: "#191C28",
          subtle: "#08090B",
        },
        border: {
          DEFAULT: "#1E2232",
          subtle: "#141722",
          bright: "#2A3045",
          accent: "rgba(212, 246, 91, 0.4)",
        },
        primary: {
          DEFAULT: "#F8F8F6",
          muted: "#94A3B8",
          faint: "#64748B",
        },
        accent: {
          DEFAULT: "#D4F65B",
          hover: "#C3E848",
          faint: "rgba(212, 246, 91, 0.12)",
        },
        // Bright Pastel Unicorn Palette
        pastel: {
          lime: "#D4F65B",
          mint: "#86EFAC",
          coral: "#FDA4AF",
          apricot: "#FDBA74",
          lilac: "#DDD6FE",
          sky: "#7DD3FC",
          cream: "#F8F8F6",
          rose: "#F472B6",
          sun: "#FDE047",
        },
        priority: {
          critical: "#FDA4AF",
          high: "#FDBA74",
          normal: "#D4F65B",
          low: "#7DD3FC",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Geist Mono",
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
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
      },
      keyframes: {
        wave: {
          "0%": { height: "20%" },
          "100%": { height: "100%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
      boxShadow: {
        "pastel-lime": "0 0 25px rgba(212, 246, 91, 0.2)",
        "pastel-coral": "0 0 25px rgba(253, 164, 175, 0.25)",
        "pastel-lilac": "0 0 25px rgba(221, 214, 254, 0.2)",
        "pastel-sky": "0 0 25px rgba(125, 211, 252, 0.2)",
        "inner-highlight": "inset 0 1px 0 0 rgba(255, 255, 255, 0.07)",
      },
    },
  },
  plugins: [],
};

export default config;
