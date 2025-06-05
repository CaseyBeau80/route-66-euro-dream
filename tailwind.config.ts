
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
        // Modern Blue Route 66 Color Palette
        "route66": {
          // Primary Brand Colors - Blue Theme
          "primary": "#4F7CFF",
          "primary-dark": "#3B5FE6",
          "primary-light": "#6B8CFF",
          
          // Secondary Colors
          "secondary": "#6B7280",
          "secondary-dark": "#4B5563",
          "secondary-light": "#9CA3AF",
          
          // Background Colors
          "background": "#ffffff",
          "background-alt": "#F8FAFC",
          "background-section": "#F1F5F9",
          
          // Text Colors
          "text-primary": "#1F2937",
          "text-secondary": "#4B5563",
          "text-muted": "#6B7280",
          
          // Accent Colors
          "accent-blue": "#4F7CFF",
          "accent-gray": "#6B7280",
          "accent-light": "#E5E7EB",
          "accent-success": "#10B981",
          "accent-warning": "#F59E0B",
          "accent-error": "#EF4444",
          
          // Interactive States
          "hover": "#EFF6FF",
          "active": "#DBEAFE",
          "focus": "#4F7CFF",
          
          // Borders
          "border": "#E5E7EB",
          "border-strong": "#D1D5DB",
          "divider": "#F3F4F6",
          
          // Legacy compatibility colors - updated to blue theme
          "red": "#EF4444",
          "blue": "#4F7CFF",
          "orange": "#F59E0B",
          "yellow": "#F59E0B",
          "tan": "#F9FAFB",
          "gray": "#6B7280",
          "cream": "#ffffff",
          "dark": "#1F2937",
          "asphalt": "#4B5563",
          "charcoal": "#4B5563",
          "vintage-white": "#F8FAFC",
          "warm-white": "#ffffff",
          "sky-blue": "#6B8CFF",
          "neon-red": "#EF4444",
          "sunshine-yellow": "#F59E0B",
          "vintage-yellow": "#F59E0B",
          "vintage-red": "#EF4444",
          "vintage-blue": "#4F7CFF",
          "vintage-brown": "#78716C",
          "vintage-beige": "#F9FAFB",
          "vintage-turquoise": "#6B8CFF",
          "rust": "#EF4444",
          "navy": "#1B2951",
        },
      },
      fontFamily: {
        'special-elite': ['Special Elite', 'monospace'],
        'courier-prime': ['Courier Prime', 'monospace'],
        'playfair': ['Playfair Display', 'serif'],
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
