/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#1F1F1F',
          'lighter': '#2D2D2D',
          'secondary': '#252525',
          'hover': '#333333'
        }
      },
      backgroundColor: {
        dark: {
          primary: '#1F1F1F',
          secondary: '#252525',
          tertiary: '#2D2D2D'
        }
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
  corePlugins: {
    preflight: true,
  },
  variants: {
    extend: {
      outline: ['focus', 'focus-visible'],
    },
  },
}
