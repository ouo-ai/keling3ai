/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',
        accent: '#06B6D4',
        dark: '#0F0F1A',
        darker: '#080810'
      }
    }
  },
  plugins: []
}
