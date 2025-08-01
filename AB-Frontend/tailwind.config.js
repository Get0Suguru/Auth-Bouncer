/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        secondary: 'var(--dynamic-secondary-color)',
      },
    },
  },
  plugins: [],
}

