/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      colors: {
        dark: '#141224',
        light: '#e9e7e5',
        primary: '#27d898',
        red: '#ff4d4d',
        purple: '#6767f4',
        lime: '#a8e001',
      },
    },
    fontFamily: {
      sans: ['Uncut Sans', 'system-ui', 'sans-serif'],
      mono: ['Cascadia Code'],
    },
  },
  plugins: [],
};
