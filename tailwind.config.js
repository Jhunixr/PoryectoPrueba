/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'azul-oscuro': '#0d2c4e',
        'amarillo-dorado': '#e3a518',
        'blanco-crema': '#f8f6f3',
        'gris-suave': '#7b7d80',
        primary: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b9e0ff',
          300: '#7cc8ff',
          400: '#36acff',
          500: '#0d2c4e',
          600: '#0a2441',
          700: '#081d34',
          800: '#061527',
          900: '#040e1a',
        },
        secondary: {
          50: '#fef7e0',
          100: '#fdecc1',
          200: '#fbd882',
          300: '#f9c543',
          400: '#f7b004',
          500: '#e3a518',
          600: '#d4930a',
          700: '#b07c08',
          800: '#8c6306',
          900: '#684a05',
        },
        // Colores adicionales para mejor modo oscuro
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          850: '#1a202c',
          900: '#111827',
          950: '#0d1117',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(227, 165, 24, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(227, 165, 24, 0.6)' },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(227, 165, 24, 0.4)',
        'glow-lg': '0 0 30px rgba(227, 165, 24, 0.6)',
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      }
    },
  },
  plugins: [],
};