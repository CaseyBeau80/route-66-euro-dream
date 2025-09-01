
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
        // Hidden Gems New Color System
        "hidden-gem": {
          background: "hsl(var(--hidden-gem-background))",  // #E0F2F1
          text: "hsl(var(--hidden-gem-text))",              // #212121
          accent: "hsl(var(--hidden-gem-accent))",          // #00796B
          "accent-hover": "hsl(var(--hidden-gem-accent-hover))", // #004D40
          border: "hsl(var(--hidden-gem-border))",          // #B2DFDB
        },
        // Legacy Hidden Gems Turquoise Colors (kept for backward compatibility)
        turquoise: {
          DEFAULT: "hsl(var(--turquoise))",
          dark: "hsl(var(--turquoise-dark))",
          light: "hsl(var(--turquoise-light))",
        },
        // Route 66 Nostalgic Color Palette - Bright Blue Theme
        "route66": {
          // Primary Brand Colors - Bright Blue from Ramble 66 Logo
          "primary": "hsl(var(--route66-primary))",
          "primary-dark": "hsl(var(--route66-primary-dark))",
          "primary-light": "hsl(var(--route66-primary-light))",
          
          // Secondary Colors
          "secondary": "hsl(var(--route66-secondary))",
          "secondary-dark": "hsl(var(--route66-secondary-dark))",
          "secondary-light": "hsl(var(--route66-secondary-light))",
          
          // Background Colors
          "background": "hsl(var(--route66-background))",
          "background-alt": "hsl(210 20% 98%)",
          "background-section": "hsl(214 32% 95%)",
          "background-vintage": "hsl(0 0% 100%)",
          
          // Text Colors
          "text-primary": "hsl(var(--route66-text-primary))",
          "text-secondary": "hsl(var(--route66-text-secondary))",
          "text-muted": "hsl(var(--route66-text-muted))",
          "text-vintage": "hsl(209 61% 16%)",
          
          // Accent Colors - Strategic Americana
          "accent-red": "hsl(var(--route66-accent-red))",
          "accent-gold": "hsl(var(--route66-accent))",
          "accent-success": "hsl(158 64% 52%)",
          "accent-warning": "hsl(43 96% 56%)",
          "accent-error": "hsl(0 84% 60%)",
          
          // Interactive States
          "hover": "hsl(214 100% 97%)",
          "active": "hsl(214 95% 93%)",
          "focus": "hsl(213 77% 36%)",
          
          // Borders
          "border": "hsl(var(--route66-border))",
          "border-strong": "hsl(220 13% 82%)",
          "divider": "hsl(220 14% 96%)",
          "border-vintage": "hsl(36 15% 81%)",
          
          // Route 66 Specific
          "shield-blue": "hsl(213 77% 36%)",
          "shield-white": "hsl(0 0% 100%)",
          "highway-yellow": "hsl(51 100% 50%)",
          "asphalt": "hsl(209 61% 16%)",
          "chrome": "hsl(220 13% 91%)",
          
          // Orange palette for enhanced variety
          "orange": "hsl(43 96% 56%)",
          "orange-50": "hsl(33 100% 96%)",
          "orange-light": "hsl(45 93% 58%)",
          "orange-200": "hsl(25 95% 83%)",
          "orange-300": "hsl(25 95% 72%)",
          "orange-dark": "hsl(35 91% 40%)",
          "orange-600": "hsl(20 90% 48%)",
          "orange-700": "hsl(17 88% 40%)",
          "orange-800": "hsl(15 86% 30%)",
          "yellow": "hsl(51 100% 50%)",
          "yellow-light": "hsl(48 96% 89%)",
          
          // Legacy compatibility colors - updated to use CSS variables
          "red": "hsl(var(--route66-red))",
          "blue": "hsl(var(--route66-primary))",
          "tan": "hsl(220 20% 98%)",
          "gray": "hsl(var(--route66-text-muted))",
          "cream": "hsl(0 0% 100%)",
          "dark": "hsl(var(--route66-dark))",
          "charcoal": "hsl(var(--route66-text-secondary))",
          "vintage-white": "hsl(210 20% 98%)",
          "warm-white": "hsl(0 0% 100%)",
          "sky-blue": "hsl(var(--route66-primary-light))",
          "neon-red": "hsl(var(--route66-red))",
          "sunshine-yellow": "hsl(var(--route66-accent))",
          "vintage-yellow": "hsl(51 100% 50%)",
          "vintage-red": "hsl(var(--route66-red))",
          "vintage-blue": "hsl(var(--route66-primary))",
          "vintage-brown": "hsl(25 7% 47%)",
          "vintage-beige": "hsl(220 20% 98%)",
          "vintage-turquoise": "hsl(var(--route66-primary-light))",
          "rust": "hsl(var(--route66-red))",
          "navy": "hsl(var(--route66-primary))",
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
        // Route 66 themed shadows - updated to bright blue
        'vintage': '0 4px 8px rgba(27, 96, 163, 0.15)',
        'nostalgic': '0 8px 16px rgba(27, 96, 163, 0.12)',
        'americana': '0 6px 12px rgba(220, 38, 38, 0.15)',
        'shield': '0 4px 8px rgba(27, 96, 163, 0.2)',
        // Hidden Gem specific shadows
        'hidden-gem': '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
        'hidden-gem-border': '0 0 0 1px rgba(178, 223, 219, 0.3)',
      },
      backgroundImage: {
        // Strategic gradient usage - updated to bright blue
        'route66-primary': 'linear-gradient(135deg, #1B60A3 0%, #2470B8 100%)',
        'route66-vintage': 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)',
        'route66-hero': 'linear-gradient(135deg, #1B60A3 0%, #2470B8 50%, #1B60A3 100%)',
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
        "nostalgic-glow": {
          "0%, 100%": {
            filter: "drop-shadow(0 0 10px rgba(27, 96, 163, 0.3))"
          },
          "50%": {
            filter: "drop-shadow(0 0 20px rgba(220, 38, 38, 0.4)) drop-shadow(0 0 30px rgba(27, 96, 163, 0.2))"
          }
        },
        "americana-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 10px rgba(27, 96, 163, 0.2)"
          },
          "50%": {
            boxShadow: "0 0 20px rgba(220, 38, 38, 0.3), 0 0 30px rgba(27, 96, 163, 0.15)"
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
        'vintage': '2px 2px 4px rgba(27, 96, 163, 0.15)',
        'strong': '3px 3px 6px rgba(27, 96, 163, 0.25)',
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
          textShadow: '2px 2px 4px rgba(27, 96, 163, 0.15)',
        },
        '.text-shadow-strong': {
          textShadow: '3px 3px 6px rgba(27, 96, 163, 0.25)',
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
