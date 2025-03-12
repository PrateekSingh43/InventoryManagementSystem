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
          'hover': '#333333',
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      backgroundColor: {
        dark: {
          primary: '#1F1F1F',
          secondary: '#252525',
          tertiary: '#2D2D2D',
          card: '#1f2937',
          popup: '#374151',
          hover: '#374151'
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
      backgroundColor: ['dark', 'dark-hover'],
      borderColor: ['dark'],
      textColor: ['dark']
    },
  },
}
