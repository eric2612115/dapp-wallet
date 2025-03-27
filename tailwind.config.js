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
          100: '#3D3D3D', // Lightest dark shade - used for borders and divisions
          200: '#2D2D2D', // Medium dark shade - used for cards and surfaces
          300: '#1E1E1E', // Darkest background color - used for main background
        },
      },
      animation: {
        'fadeIn': 'fadeIn 0.2s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}