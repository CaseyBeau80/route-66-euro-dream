
import type { Config } from "tailwindcss";

export default {
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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				route66: {
					red: '#D2041A',
					yellow: '#FFD700',
					cream: '#F5F2EA',
					brown: '#8B4513',
					navy: '#1B2951',
					orange: '#FF6B35',
					tan: '#D2B48C',
					rust: '#B7410E',
					vintage: {
						red: '#CC2936',
						yellow: '#F4D03F',
						blue: '#2E4057',
						cream: '#FDF6E3',
						brown: '#8B4513',
						green: '#2D5016',
						orange: '#E67E22'
					}
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slow-pulse': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.8'
					}
				},
				'neon-glow': {
					'0%, 100%': {
						textShadow: '0 0 5px #FFD700, 0 0 10px #FFD700, 0 0 15px #FFD700'
					},
					'50%': {
						textShadow: '0 0 2px #FFD700, 0 0 5px #FFD700, 0 0 8px #FFD700'
					}
				},
				'vintage-flicker': {
					'0%, 100%': { opacity: '1' },
					'1%': { opacity: '0.9' },
					'2%': { opacity: '1' },
					'5%': { opacity: '0.95' },
					'8%': { opacity: '1' },
					'12%': { opacity: '0.9' },
					'15%': { opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'slow-pulse': 'slow-pulse 3s infinite ease-in-out',
				'neon-glow': 'neon-glow 2s ease-in-out infinite alternate',
				'vintage-flicker': 'vintage-flicker 3s linear infinite'
			},
			backgroundImage: {
				'route66-gradient': 'linear-gradient(45deg, #D2041A 0%, #FFD700 25%, #FF6B35 50%, #D2041A 75%, #FFD700 100%)',
				'vintage-paper': 'linear-gradient(45deg, #F5F2EA 0%, #E8E3D3 100%)',
				'asphalt': 'linear-gradient(180deg, #2C2C2C 0%, #1A1A1A 100%)',
				'sunset': 'linear-gradient(135deg, #FF6B35 0%, #FFD700 50%, #D2041A 100%)'
			},
			fontFamily: {
				'route66': ['Racing Sans One', 'Bebas Neue', 'Impact', 'sans-serif'],
				'vintage': ['Fredoka One', 'Comic Sans MS', 'cursive'],
				'americana': ['Bungee', 'Impact', 'sans-serif'],
				'retro': ['Righteous', 'Arial Black', 'sans-serif'],
				'sans': ['Inter', 'sans-serif'],
			},
			boxShadow: {
				'vintage': '0 4px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
				'neon': '0 0 5px #FFD700, 0 0 10px #FFD700, 0 0 15px #FFD700, 0 0 20px #FFD700',
				'retro': '8px 8px 0px #D2041A, 12px 12px 0px #FFD700'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
