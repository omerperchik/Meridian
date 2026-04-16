import type { Config } from "tailwindcss";

/**
 * Linear-inspired design tokens.
 * Colors, radii, shadows, spacing and typography are tuned to match Linear's visual language:
 * - Near-black background, precise border-gray, crisp text hierarchy
 * - Saturated indigo/violet primary ("Linear purple")
 * - Small radii (6/8px), subtle borders, tight line-height, Inter-like type
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        // Base surfaces — Linear's near-black with warm blue undertone
        background: "#08090a",
        surface: {
          DEFAULT: "#0d0e10",
          raised: "#131416",
          overlay: "#1a1b1e",
          hover: "#1f2023",
        },
        // Borders
        border: {
          DEFAULT: "#1f2023",
          strong: "#2a2b2e",
          focus: "#5e6ad2",
        },
        // Text
        text: {
          primary: "#f7f8f8",
          secondary: "#b4bcd0",
          tertiary: "#8a8f98",
          quaternary: "#62666d",
          inverse: "#08090a",
        },
        // Linear's signature indigo/violet
        accent: {
          DEFAULT: "#5e6ad2",
          hover: "#7170ff",
          active: "#4c54b5",
          muted: "rgba(94, 106, 210, 0.12)",
          ring: "rgba(94, 106, 210, 0.35)",
        },
        // Semantic
        success: { DEFAULT: "#4cb782", muted: "rgba(76, 183, 130, 0.12)" },
        warning: { DEFAULT: "#f2c94c", muted: "rgba(242, 201, 76, 0.12)" },
        danger: { DEFAULT: "#eb5757", muted: "rgba(235, 87, 87, 0.12)" },
        info: { DEFAULT: "#5e9aff", muted: "rgba(94, 154, 255, 0.12)" },
        // Score tier colors
        tier: {
          0: "#8a8f98",
          1: "#5e9aff",
          2: "#bd8cfe",
          3: "#4cb782",
        },
      },
      fontFamily: {
        sans: [
          "Inter var",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "SF Mono",
          "Menlo",
          "Consolas",
          "Monaco",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.01em" }],
        xs: ["0.75rem", { lineHeight: "1.125rem", letterSpacing: "0.005em" }],
        sm: ["0.8125rem", { lineHeight: "1.25rem" }],
        base: ["0.9375rem", { lineHeight: "1.5rem" }],
        lg: ["1.0625rem", { lineHeight: "1.625rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em" }],
        "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.015em" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "-0.02em" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.025em" }],
        "5xl": ["2.75rem", { lineHeight: "3rem", letterSpacing: "-0.03em" }],
        "6xl": ["3.5rem", { lineHeight: "3.75rem", letterSpacing: "-0.035em" }],
        "7xl": ["4.5rem", { lineHeight: "4.75rem", letterSpacing: "-0.04em" }],
      },
      borderRadius: {
        DEFAULT: "0.375rem",
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        focus: "0 0 0 3px rgba(94, 106, 210, 0.35)",
        glow: "0 0 40px rgba(94, 106, 210, 0.15)",
        card: "0 1px 2px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.02)",
        elevated: "0 4px 24px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.04)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-hero":
          "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(94, 106, 210, 0.25), transparent 70%)",
        "gradient-mesh":
          "radial-gradient(at 20% 0%, rgba(94, 106, 210, 0.18) 0, transparent 50%), radial-gradient(at 80% 100%, rgba(189, 140, 254, 0.12) 0, transparent 50%)",
        "linear-grid":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.2s ease-out",
        "ticker": "ticker 40s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
