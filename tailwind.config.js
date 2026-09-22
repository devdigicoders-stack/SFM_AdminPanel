/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sfm-navy': '#0b1d3a',
        'sfm-red': '#c1121f',
        'sfm-crimson': '#780000',
        'sfm-surface': '#f8fafc',
        'sfm-gold': '#d4af37',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Urbanist"', 'sans-serif'],
        display: ['"Outfit"', '"Syne"', 'sans-serif'],
        heading: ['"Urbanist"', '"Lexend"', '"Outfit"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
