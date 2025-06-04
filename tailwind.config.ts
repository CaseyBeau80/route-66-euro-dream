
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Modern Route 66 Color Palette
        "route66": {
          // Primary Brand Colors
          "primary": "#2563eb",
          "primary-dark": "#1d4ed8",
          "primary-light": "#3b82f6",
          
          // Secondary Colors
          "secondary": "#64748b",
          "secondary-dark": "#475569",
          "secondary-light": "#94a3b8",
          
          // Background Colors
          "background": "#ffffff",
          "background-alt": "#f8fafc",
          "background-section": "#f1f5f9",
          
          // Text Colors
          "text-primary": "#0f172a",
          "text-secondary": "#334155",
          "text-muted": "#64748b",
          
          // Accent Colors
          "accent-orange": "#f97316",
          "accent-green": "#22c55e",
          "accent-red": "#ef4444",
          "accent-yellow": "#eab308",
          
          // Interactive States
          "hover": "#f1f5f9",
          "active": "#e2e8f0",
          "focus": "#3b82f6",
          
          // Borders
          "border": "#e2e8f0",
          "border-strong": "#cbd5e1",
          "divider": "#f1f5f9",
          
          // Legacy compatibility colors
          "red": "#ef4444",
          "blue": "#2563eb",
          "orange": "#f97316",
          "yellow": "#eab308",
          "tan": "#f5f5f4",
          "gray": "#64748b",
          "cream": "#ffffff",
          "dark": "#0f172a",
          "asphalt": "#475569",
          "charcoal": "#334155",
          "vintage-white": "#f8fafc",
          "warm-white": "#ffffff",
          "sky-blue": "#3b82f6",
          "neon-red": "#ef4444",
          "sunshine-yellow": "#eab308",
          "vintage-yellow": "#eab308",
          "vintage-red": "#ef4444",
          "vintage-blue": "#2563eb",
          "vintage-brown": "#92400e",
          "vintage-beige": "#f5f5f4",
          "vintage-turquoise": "#06b6d4",
          "rust": "#dc2626",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
