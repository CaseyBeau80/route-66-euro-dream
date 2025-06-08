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
        // Route 66 Nostalgic Color Palette - Deep Blue Theme
        "route66": {
          // Primary Brand Colors - Deep Navy from Ramble 66 Logo
          "primary": "#1B2951",
          "primary-dark": "#0F1A3A",
          "primary-light": "#2A3B5F",
          
          // Secondary Colors
          "secondary": "#6B7280",
          "secondary-dark": "#4B5563",
          "secondary-light": "#9CA3AF",
          
          // Background Colors
          "background": "#ffffff",
          "background-alt": "#F8FAFC",
          "background-section": "#F1F5F9",
          "background-vintage": "#FEFEFE",
          
          // Text Colors
          "text-primary": "#1F2937",
          "text-secondary": "#4B5563",
          "text-muted": "#6B7280",
          "text-vintage": "#2C3E50",
          
          // Accent Colors - Strategic Americana
          "accent-red": "#DC2626",
          "accent-gold": "#F59E0B",
          "accent-success": "#10B981",
          "accent-warning": "#F59E0B",
          "accent-error": "#EF4444",
          
          // Interactive States
          "hover": "#EFF6FF",
          "active": "#DBEAFE",
          "focus": "#1B2951",
          
          // Borders
          "border": "#E5E7EB",
          "border-strong": "#D1D5DB",
          "divider": "#F3F4F6",
          "border-vintage": "#CDC6B8",
          
          // Route 66 Specific
          "shield-blue": "#1B2951",
          "shield-white": "#FFFFFF",
          "highway-yellow": "#FFD700",
          "asphalt": "#2C3E50",
          "chrome": "#E5E7EB",
          
          // Orange palette for enhanced variety
          "orange": "#F59E0B",
          "orange-50": "#fff7ed",
          "orange-light": "#FCD34D",
          "orange-200": "#fed7aa",
          "orange-300": "#fdba74",
          "orange-dark": "#D97706",
          "orange-600": "#ea580c",
          "orange-700": "#c2410c",
          "orange-800": "#9a3412",
          "yellow": "#FFD700",
          "yellow-light": "#FEF3C7",
          
          // Legacy compatibility colors - updated to new theme
          "red": "#DC2626",
          "blue": "#1B2951",
          "tan": "#F9FAFB",
          "gray": "#6B7280",
          "cream": "#ffffff",
          "dark": "#1F2937",
          "charcoal": "#4B5563",
          "vintage-white": "#F8FAFC",
          "warm-white": "#ffffff",
          "sky-blue": "#2A3B5F",
          "neon-red": "#DC2626",
          "sunshine-yellow": "#F59E0B",
          "vintage-yellow": "#FFD700",
          "vintage-red": "#DC2626",
          "vintage-blue": "#1B2951",
          "vintage-brown": "#78716C",
          "vintage-beige": "#F9FAFB",
          "vintage-turquoise": "#2A3B5F",
          "rust": "#DC2626",
          "navy": "#1B2951",
        },
      },
      fontFamily: {
        // Route 66 Typography System
        'route66': ['Bebas Neue', 'Arial Black', 'sans-serif'],
        'highway': ['Oswald', 'Arial', 'sans-serif'],
        'vintage': ['Racing Sans One', 'Courier New', 'monospace'],
        'americana': ['Oswald', 'Impact', 'sans-serif'],
        'travel': ['Inter', 'Helvetica', 'sans-serif'],
        // Legacy fonts
        'special-elite': ['Special Elite', 'monospace'],
        'courier-prime': ['Courier Prime', 'monospace'],
        'playfair': ['Playfair Display', 'serif'],
      },
      boxShadow: {
        // Route 66 themed shadows
        'vintage': '0 4px 8px rgba(27, 41, 81, 0.15)',
        'nostalgic': '0 8px 16px rgba(27, 41, 81, 0.12)',
        'americana': '0 6px 12px rgba(220, 38, 38, 0.15)',
        'shield': '0 4px 8px rgba(27, 41, 81, 0.2)',
      },
      backgroundImage: {
        // Strategic gradient usage
        'route66-primary': 'linear-gradient(135deg, #1B2951 0%, #2A3B5F 100%)',
        'route66-vintage': 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)',
        'route66-hero': 'linear-gradient(135deg, #1B2951 0%, #2A3B5F 50%, #1B2951 100%)',
        'route66-accent': 'linear-gradient(90deg, #DC2626 0%, #F59E0B 100%)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        // Existing animations
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        // Route 66 nostalgic animations
        "nostalgic-glow": {
          "0%, 100%": {
            filter: "drop-shadow(0 0 10px rgba(27, 41, 81, 0.3))"
          },
          "50%": {
            filter: "drop-shadow(0 0 20px rgba(220, 38, 38, 0.4)) drop-shadow(0 0 30px rgba(27, 41, 81, 0.2))"
          }
        },
        "americana-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 10px rgba(27, 41, 81, 0.2)"
          },
          "50%": {
            boxShadow: "0 0 20px rgba(220, 38, 38, 0.3), 0 0 30px rgba(27, 41, 81, 0.15)"
          }
        },
        "subtle-gradient-shift": {
          "0%, 100%": {
            backgroundPosition: "0% 50%"
          },
          "50%": {
            backgroundPosition: "100% 50%"
          }
        },
        "highway-marker-blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" }
        },
        "vintage-typewriter": {
          "from": { width: "0" },
          "to": { width: "100%" }
        },
        "shield-shine": {
          "0%": { backgroundPosition: "-100% 0" },
          "100%": { backgroundPosition: "100% 0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "nostalgic-glow": "nostalgic-glow 3s ease-in-out infinite",
        "americana-pulse": "americana-pulse 2s ease-in-out infinite",
        "subtle-gradient": "subtle-gradient-shift 8s ease-in-out infinite",
        "highway-blink": "highway-marker-blink 2s ease-in-out infinite",
        "typewriter": "vintage-typewriter 2s steps(40) forwards",
        "shield-shine": "shield-shine 3s ease-in-out infinite",
      },
      letterSpacing: {
        'route66': '0.1em',
        'highway': '0.05em',
        'americana': '0.15em',
      },
      textShadow: {
        'vintage': '2px 2px 4px rgba(27, 41, 81, 0.15)',
        'strong': '3px 3px 6px rgba(27, 41, 81, 0.25)',
        'nostalgic': '1px 1px 2px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Custom plugin for text shadows
    function({ addUtilities }: { addUtilities: Function }) {
      const newUtilities = {
        '.text-shadow-vintage': {
          textShadow: '2px 2px 4px rgba(27, 41, 81, 0.15)',
        },
        '.text-shadow-strong': {
          textShadow: '3px 3px 6px rgba(27, 41, 81, 0.25)',
        },
        '.text-shadow-nostalgic': {
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
} satisfies Config;

export default config;
