import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm cream base
        cream: {
          50: '#FEFDFB',
          100: '#FDF9F3',
          200: '#FAF3E8',
          300: '#F5EBDA',
          400: '#EDE0C8',
        },
        // Rich botanical sage green
        sage: {
          50: '#F6F7F4',
          100: '#E8EBE3',
          200: '#D4DAC9',
          300: '#B5C0A5',
          400: '#96A683',
          500: '#7A8B68',
          600: '#5F6E50',
          700: '#4A5640',
          800: '#3D4636',
          900: '#2F3629',
        },
        // Dusty rose / blush
        rose: {
          50: '#FDF8F8',
          100: '#FCF0F0',
          200: '#F9E0E0',
          300: '#F2C5C5',
          400: '#E8A3A3',
          500: '#D97B7B',
          600: '#C45858',
          700: '#A34545',
          800: '#873A3A',
          900: '#6F3232',
        },
        // Deep forest for text
        forest: {
          800: '#2D3A2D',
          900: '#1E261E',
        },
        // Premium gold accents
        gold: {
          50: '#FFFDF7',
          100: '#FEF9E7',
          200: '#FCF0C3',
          300: '#F9E29A',
          400: '#F5D06A',
          500: '#D4AF37', // Classic gold
          600: '#B8962E',
          700: '#8B7223',
          800: '#5F4E1A',
          900: '#3D3211',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-md': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(47, 54, 41, 0.07), 0 4px 6px -4px rgba(47, 54, 41, 0.05)',
        'soft-lg': '0 10px 40px -10px rgba(47, 54, 41, 0.12), 0 4px 15px -5px rgba(47, 54, 41, 0.05)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(47, 54, 41, 0.03)',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        'botanical-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c-2 8-8 14-16 16 8 2 14 8 16 16 2-8 8-14 16-16-8-2-14-8-16-16z' fill='%23B5C0A5' fill-opacity='0.08'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;
