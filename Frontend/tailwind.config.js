/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Add this to prevent any default focus styles
  corePlugins: {
    preflight: true,
  },
  // Add custom styles
  variants: {
    extend: {
      outline: ['focus', 'focus-visible'],
    },
  },
}
