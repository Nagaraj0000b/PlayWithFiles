/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00d4ff',
        'neon-cyan': '#00ffff',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  }
}