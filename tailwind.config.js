/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Hanken Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        proninez: {
          teal: '#65bec2',
          green: '#00973a',
          lime: '#70b839',
          aqua: '#74d8c2',
          blue: '#00adef',
          pink: '#e96199',
          purple: '#4831B0',
        },
        surface: {
          50: '#ffffff',
          100: '#f8f9fb',
          200: '#eef2f5',
          300: '#dce3e8',
          400: '#8898a6',
          500: '#576677',
          600: '#374047',
          700: '#2b3644',
          800: '#1e2a36',
          900: '#152028',
        },
      },
    },
  },
  plugins: [],
}
