/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: '#FDF2F5',
          100: '#FAE0E8',
          200: '#F7D0DA',
          400: '#C45070',
          600: '#9E1435',
          800: '#800020', // Logo Color
          900: '#4A0011',
        },
        ink: '#1A1A1A',
        charcoal: '#3D3533',
        stone: '#7A7370',
        'petal-gray': '#C8C2BE',
        linen: '#F0EDE8',
        cream: '#FAF8F6',
        copper: {
          400: '#C97B4B',
          100: '#E8D5B0',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        btn: '8px',
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'soft-hover': '0 20px 40px rgba(128, 0, 32, 0.08)',
      },
    },
  },
  plugins: [],
};