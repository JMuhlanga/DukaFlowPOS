/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          // Adding custom colors to match your DukaFlow UI mockups
          sidebar: '#0f172a',
        }
      },
    },
    plugins: [],
  }