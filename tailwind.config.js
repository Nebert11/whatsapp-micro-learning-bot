/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'wa-green': '#25D366',
        'wa-teal': '#128C7E',
        'wa-teal-dark': '#075E54',
        'wa-light': '#DCF8C6',
        'wa-gray': '#E5DDD5',
      }
    },
  },
  plugins: [],
};
