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
          500: '#B07941', // Primary color changed to match the warm theme
          600: '#916435', // Darker shade
        },
        dark: {
          100: '#3D3D3D', // Lightest dark shade - used for borders and divisions
          200: '#2D2D2D', // Medium dark shade - used for cards and surfaces
          300: '#1E1E1E', // Darkest background color - used for main background
        },
        // Adding warm color scheme
        warm: {
          primary: '#B07941',
          secondary: '#D4A76A',
          bg: '#F8EDD7',
          paper: '#F2E6C7',
          text: '#33281B',
          textSecondary: '#7D6547',
          divider: '#E6D6A9',
        }
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