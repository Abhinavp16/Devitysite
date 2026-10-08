/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // "Academic navy & gold" direction (see docs/ui-mockups, direction G)
      colors: {
        navy: { DEFAULT: '#0b2a5b', ink: '#0b1d3a' },
        gold: { DEFAULT: '#c9a227', dark: '#8a6d12', soft: '#f3ead2' },
        cream: { DEFAULT: '#f6f3ec', line: '#e4e0d6' },
        // Admin panel (style A "clean light", see docs/ui-mockups/admin.html)
        accent: { DEFAULT: '#3b5bdb', dark: '#364fc7', soft: '#eef2ff' },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-reverse': 'float-reverse 8s ease-in-out infinite',
        'float-diagonal': 'float-diagonal 7s ease-in-out infinite',
        'float-circular': 'float-circular 10s linear infinite',
        'drawer-in': 'drawer-in 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        'fade-in': 'fade-in 0.25s ease-out',
      },
      keyframes: {
        'drawer-in': { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(-10px)' },
          '50%': { transform: 'translateY(10px)' },
        },
        'float-diagonal': {
          '0%, 100%': { transform: 'translate(0px, 0px)' },
          '25%': { transform: 'translate(10px, -10px)' },
          '50%': { transform: 'translate(-5px, -20px)' },
          '75%': { transform: 'translate(-10px, -5px)' },
        },
        'float-circular': {
          '0%': { transform: 'rotate(0deg) translateX(20px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(20px) rotate(-360deg)' },
        },
      },
    },
  },
  plugins: [],
}