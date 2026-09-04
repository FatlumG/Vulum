/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
  extend: {
  		colors: {
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			darkBlue: '#1979FF',
  			primaryBlue: '#4880FF',
  			lightBlue: '#5aa2ff5f',
  			lightGray: '#8D8D8D',
  			grayText: '#565656',
  			orangeBtn: '#FF8743',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
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
  			},
  			surface: {
  				DEFAULT: 'hsl(var(--surface-elevated))',
  				foreground: 'hsl(var(--surface-elevated-foreground))'
  			},
  			brand: {
  				blue: 'var(--brand-blue)',
  				'blue-hover': 'var(--brand-blue-hover)',
  				orange: 'var(--brand-orange)',
  				gray: 'var(--brand-gray)',
  				'light-gray': 'var(--brand-light-gray)'
  			}
  		},
  		fontFamily: {
  			outfit: ['Outfit', 'sans-serif'],
  			Poppins: ['Poppins', 'sans-serif'],
  			NunitoSans: ['Nunito Sans', 'sans-serif']
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
  			'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
  			'elevated': '0 20px 60px -15px rgba(0, 0, 0, 0.1)',
  			'elevated-lg': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
  			'card-hover': '0 12px 40px -12px rgba(72, 128, 255, 0.2)',
  			'card-hover-dark': '0 12px 40px -12px rgba(72, 128, 255, 0.15)',
  			'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05)',
  		},
  		keyframes: {
  			'fade-in': {
  				'0%': { opacity: '0', transform: 'translateY(10px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			},
  			'scale-in': {
  				'0%': { opacity: '0', transform: 'scale(0.95)' },
  				'100%': { opacity: '1', transform: 'scale(1)' }
  			},
  			'slide-up': {
  				'0%': { opacity: '0', transform: 'translateY(20px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			},
  			'marquee': {
  				'0%': { transform: 'translateX(0%)' },
  				'100%': { transform: 'translateX(-50%)' }
  			},
  			'float': {
  				'0%, 100%': { transform: 'translateY(0px)' },
  				'50%': { transform: 'translateY(-6px)' }
  			},
  		},
  		animation: {
  			'fade-in': 'fade-in 0.5s ease-out forwards',
  			'scale-in': 'scale-in 0.3s ease-out forwards',
  			'slide-up': 'slide-up 0.5s ease-out forwards',
  			'marquee': 'marquee 30s linear infinite',
  			'float': 'float 3s ease-in-out infinite',
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
