/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: '#0A0A0A',
          soft: '#171717',
        },
        white: '#FFFFFF',
        offwhite: '#F7F5F0',
        gold: {
          DEFAULT: '#C9A45C',
          light: '#DDBF87',
          dark: '#A9803F',
        },
        grey: {
          DEFAULT: '#6B6B6B',
          light: '#E5E5E5',
        },
        status: {
          success: '#2F6B4F',
          error: '#9B2C2C',
          warning: '#B7791F',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.25em',
      },
      borderRadius: {
        sharp: '2px',
        subtle: '4px',
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(10, 10, 10, 0.04)',
        card: '0 2px 12px rgba(10, 10, 10, 0.06)',
        lift: '0 8px 24px rgba(10, 10, 10, 0.08)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-700px 0' },
          '100%': { backgroundPosition: '700px 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        underlineGrow: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out both',
        fadeInUp: 'fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        fadeInDown: 'fadeInDown 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        slideInRight: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        scaleIn: 'scaleIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        shimmer: 'shimmer 1.6s infinite linear',
        marquee: 'marquee 30s linear infinite',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2.5rem',
          xl: '4rem',
        },
      },
    },
  },
  plugins: [],
};
