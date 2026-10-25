/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta editorial: espresso oscuro + marfil, con rosa (marca) y arena como acentos
        accent: {
          DEFAULT: '#eca8d6',
          soft: '#f5cde6',
          deep: '#b0678f',
        },
        sand: {
          DEFAULT: '#c8a97e',
          soft: '#e4d3b8',
          deep: '#8a6d45',
        },
        ivory: {
          DEFAULT: '#f5efe6',
          100: '#fbf8f3',
          200: '#ece4d8',
          300: '#d9cdbb',
        },
        ink: {
          950: '#080707',
          900: '#0e0c0b',
          800: '#161311',
          700: '#1f1b18',
          600: '#2b2622',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.28em',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slow-zoom': {
          '0%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) both',
        'slow-zoom': 'slow-zoom 8s ease-out both',
      },
    },
  },
  plugins: [],
}
