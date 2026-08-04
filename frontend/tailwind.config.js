/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
      },
      colors: {
        sand: {
          50: '#FAF8F5',
          100: '#F0EBE3',
          200: '#E5DDD3',
          300: '#D4C9BB',
          400: '#C4B5A6',
          500: '#B3A291',
          600: '#9A8876',
          700: '#7A6B5C',
          800: '#5A4F43',
          900: '#3A332B',
        },
        maroon: {
          DEFAULT: '#550000',
          50: '#FDF0F0',
          100: '#FADADA',
          200: '#F5B0B0',
          300: '#E86868',
          400: '#B82020',
          500: '#550000',
          600: '#450000',
          700: '#350000',
          800: '#250000',
          900: '#150000',
        },
        cocoa: '#550000',
        pearl: '#FAF8F5',
        latte: '#F0EBE3',
      },
      boxShadow: {
        glow: '0 24px 70px rgba(85, 0, 0, 0.18)',
        soft: '0 16px 50px rgba(85, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
