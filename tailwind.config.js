/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        clay: {
          500: '#C06653', // Primary
          600: '#A84236', // Darker
        },
        dark: {
          100: '#3D3D3D',
          200: '#2D2D2D',
          300: '#1E1E1E',
        },
      },
    },
  },
  plugins: [],
}