
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // all your source files
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['inter', 'monospace'],
      },
      colors: {
        primary: '#1abc9c',
      },
    },
  },
  plugins: [],
};