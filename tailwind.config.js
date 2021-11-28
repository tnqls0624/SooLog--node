// tailwind.config.js
module.exports = {
  purge: ['./src/html/**/*.{html,js,jsx,ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        'w-80': '22rem',
      },
    },
    variants: {},
    plugins: [],
  },
};
