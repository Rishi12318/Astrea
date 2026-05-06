/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      colors: {
        sand: {
          50: '#FFF7F8',
          100: '#FFE5E7',
          200: '#FFD3D6',
          300: '#F9E6E4',
          400: '#FFC6CA',
          500: '#FFB0B5',
          600: '#E98C93',
          700: '#C86F76',
          800: '#8F5158',
          900: '#5A3136',
        },
        blush: '#FFB0B5',
        cocoa: '#8B5C5F',
        pearl: '#FFFDFE',
        latte: '#F9DCC0',
      },
      boxShadow: {
        glow: '0 24px 70px rgba(255, 176, 181, 0.22)',
        soft: '0 16px 50px rgba(90, 49, 54, 0.10)',
      },
    },
  },
  plugins: [],
};
