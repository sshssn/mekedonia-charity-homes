/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#4f46e5',
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        background: '#ffffff',
        text: '#1f2937'
      }
    },
  },
  plugins: [],
}

