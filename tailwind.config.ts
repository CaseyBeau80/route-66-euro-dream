
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
					// Authentic vintage Route 66 color palette
					red: '#CC2936',          // Vintage red from classic signs
					yellow: '#F4D03F',       // Warm vintage yellow
					cream: '#FDF6E3',        // Warm paper cream
					brown: '#8B4513',        // Rich leather brown
					navy: '#2E4057',         // Deep vintage navy
					orange: '#E67E22',       // Warm sunset orange
					tan: '#D2B48C',          // Desert tan
					rust: '#B7410E',         // Weathered rust
					// Enhanced vintage sub-palette
					vintage: {
						red: '#A52A2A',        // Deep barn red
						yellow: '#DAA520',     // Antique gold
						blue: '#1B2951',       // Midnight blue
						cream: '#F5F2EA',      // Aged paper
						brown: '#654321',      // Coffee brown
						green: '#2D5016',      // Forest green
						orange: '#CD853F',     // Peru orange
						beige: '#F5F5DC',      // Vintage beige
						burgundy: '#800020',   // Deep burgundy
						turquoise: '#40B5A8'   // Vintage turquoise
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
						textShadow: '0 0 5px #F4D03F, 0 0 10px #F4D03F, 0 0 15px #F4D03F'
					},
					'50%': {
						textShadow: '0 0 2px #F4D03F, 0 0 5px #F4D03F, 0 0 8px #F4D03F'
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
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'typewriter': {
					'0%': { width: '0' },
					'100%': { width: '100%' }
				},
				'paper-tear': {
					'0%': { 
						clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
						transform: 'rotate(0deg)'
					},
					'100%': { 
						clipPath: 'polygon(0 0, 98% 2%, 96% 98%, 2% 100%)',
						transform: 'rotate(-0.5deg)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'slow-pulse': 'slow-pulse 3s infinite ease-in-out',
				'neon-glow': 'neon-glow 2s ease-in-out infinite alternate',
				'vintage-flicker': 'vintage-flicker 3s linear infinite',
				'float': 'float 3s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'typewriter': 'typewriter 3s steps(40) infinite',
				'paper-tear': 'paper-tear 0.5s ease-out forwards'
			},
			backgroundImage: {
				'route66-gradient': 'linear-gradient(45deg, #CC2936 0%, #F4D03F 25%, #E67E22 50%, #CC2936 75%, #F4D03F 100%)',
				'vintage-paper': 'linear-gradient(45deg, #FDF6E3 0%, #F5F2EA 100%)',
				'asphalt': 'linear-gradient(180deg, #2C2C2C 0%, #1A1A1A 100%)',
				'sunset': 'linear-gradient(135deg, #E67E22 0%, #F4D03F 50%, #CC2936 100%)',
				'americana': 'linear-gradient(135deg, #CC2936 0%, #F4D03F 25%, #2E4057 50%, #E67E22 75%, #CC2936 100%)',
				'vintage-texture': `
					radial-gradient(circle at 20% 80%, rgba(204, 41, 54, 0.1) 0%, transparent 50%),
					radial-gradient(circle at 80% 20%, rgba(244, 208, 63, 0.1) 0%, transparent 50%),
					radial-gradient(circle at 40% 40%, rgba(230, 120, 34, 0.05) 0%, transparent 50%)
				`,
				'travel-poster': `
					linear-gradient(135deg, 
						rgba(204, 41, 54, 0.9) 0%, 
						rgba(230, 120, 34, 0.8) 25%, 
						rgba(244, 208, 63, 0.7) 50%, 
						rgba(46, 64, 87, 0.8) 75%, 
						rgba(204, 41, 54, 0.9) 100%
					)
				`,
				'aged-paper': `
					linear-gradient(45deg, #FDF6E3 0%, #F5F2EA 25%, #D2B48C 50%, #F5F2EA 75%, #FDF6E3 100%)
				`
			},
			fontFamily: {
				// Authentic vintage typography
				'route66': ['Bebas Neue', 'Impact', 'Arial Black', 'sans-serif'],
				'vintage': ['Fredoka One', 'Cooper Black', 'serif'],
				'americana': ['Bungee', 'Patriot', 'Impact', 'sans-serif'],
				'retro': ['Righteous', 'Orbitron', 'sans-serif'],
				'travel': ['Staatliches', 'Oswald', 'sans-serif'],
				'handwritten': ['Kalam', 'Caveat', 'cursive'],
				'serif-vintage': ['Playfair Display', 'Times', 'serif'],
				'sans': ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
			},
			boxShadow: {
				'vintage': '0 8px 16px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)',
				'neon': '0 0 10px #F4D03F, 0 0 20px #F4D03F, 0 0 30px #F4D03F',
				'retro': '8px 8px 0px #CC2936, 12px 12px 0px #F4D03F',
				'paper': '0 4px 8px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.1)',
				'postcard': '0 10px 20px rgba(0,0,0,0.2), 0 6px 6px rgba(0,0,0,0.1)',
				'travel-stamp': 'inset 0 0 10px rgba(204, 41, 54, 0.3), 0 4px 8px rgba(0,0,0,0.2)'
			},
			textShadow: {
				'vintage': '2px 2px 4px rgba(0,0,0,0.5)',
				'retro': '3px 3px 0px #CC2936, 6px 6px 0px #F4D03F',
				'glow': '0 0 10px rgba(244, 208, 63, 0.8)',
				'embossed': '1px 1px 2px rgba(255,255,255,0.5), -1px -1px 2px rgba(0,0,0,0.3)'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities }: any) {
			const newUtilities = {
				'.text-shadow-vintage': {
					textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
				},
				'.text-shadow-retro': {
					textShadow: '3px 3px 0px #CC2936, 6px 6px 0px #F4D03F',
				},
				'.text-shadow-glow': {
					textShadow: '0 0 10px rgba(244, 208, 63, 0.8)',
				},
				'.vintage-texture': {
					backgroundImage: `
						radial-gradient(circle at 20% 80%, rgba(204, 41, 54, 0.03) 0%, transparent 50%),
						radial-gradient(circle at 80% 20%, rgba(244, 208, 63, 0.03) 0%, transparent 50%),
						repeating-linear-gradient(
							45deg,
							transparent,
							transparent 2px,
							rgba(0,0,0,0.01) 2px,
							rgba(0,0,0,0.01) 4px
						)
					`,
				},
				'.route66-shield': {
					background: 'linear-gradient(145deg, #ffffff 0%, #f0f0f0 100%)',
					border: '3px solid #2E4057',
					borderRadius: '12px',
					position: 'relative',
					overflow: 'hidden',
					'&::before': {
						content: '""',
						position: 'absolute',
						top: '0',
						left: '0',
						right: '0',
						bottom: '0',
						background: 'linear-gradient(135deg, rgba(244, 208, 63, 0.1) 0%, transparent 50%)',
						pointerEvents: 'none'
					}
				},
				'.highway-sign': {
					background: '#2D5016',
					color: 'white',
					border: '4px solid white',
					borderRadius: '8px',
					padding: '8px 16px',
					fontFamily: 'Bungee, Impact, sans-serif',
					textTransform: 'uppercase',
					boxShadow: '0 4px 8px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.1)',
					position: 'relative',
					'&::after': {
						content: '""',
						position: 'absolute',
						top: '2px',
						left: '2px',
						right: '2px',
						bottom: '2px',
						border: '1px solid rgba(255,255,255,0.3)',
						borderRadius: '4px',
						pointerEvents: 'none'
					}
				},
				'.retro-heading': {
					fontFamily: 'Righteous, Arial Black, sans-serif',
					textShadow: '3px 3px 0px #CC2936, 6px 6px 0px #F4D03F, 9px 9px 10px rgba(0,0,0,0.3)',
					color: 'white'
				},
				'.vintage-button': {
					background: 'linear-gradient(45deg, #CC2936 0%, #E67E22 100%)',
					border: '3px solid #F4D03F',
					color: 'white',
					fontFamily: 'Fredoka One, cursive',
					textTransform: 'uppercase',
					letterSpacing: '1px',
					padding: '12px 24px',
					borderRadius: '25px',
					boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
					transition: 'all 0.3s ease',
					'&:hover': {
						transform: 'translateY(-2px)',
						boxShadow: '0 6px 12px rgba(0,0,0,0.4), 0 0 15px rgba(244, 208, 63, 0.5), inset 0 1px 0 rgba(255,255,255,0.3)'
					}
				}
			}
			addUtilities(newUtilities)
		}
	],
} satisfies Config;
