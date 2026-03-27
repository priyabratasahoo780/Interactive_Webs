/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        cyber: {
          50:  '#e8fff7',
          100: '#b3fde8',
          200: '#7efbd9',
          300: '#49f8ca',
          400: '#14f6bb',
          500: '#00d4a0',
          600: '#00a87e',
          700: '#007c5c',
          800: '#00503a',
          900: '#002418',
        },
        electric: {
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
        },
        neon: '#39ff14',
        plasma: '#ff2d78',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(0,212,160,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,160,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid': '60px 60px',
      },
    },
  },
  plugins: [],
}
