/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'thai-gold': '#FFD700',
        'thai-red': '#A51931',
        'thai-blue': '#241D4F',
        'thai-green': '#3A7563',
        'thai-orange': '#F47216',
      }
    },
  },
  plugins: [],
}